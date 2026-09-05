import { createHmac, randomUUID } from "node:crypto";
import { AppError } from "../../utils/app-error";
import {
  registrationDetailsSchema,
  verifyPaymentSchema,
  type Registration,
  type RegistrationPayload,
} from "./registrations.schema";
import type { RegistrationsRepository } from "./registrations.repository";

const ESEWA_SANDBOX_URL = "https://rc-epay.esewa.com.np";
const ESEWA_PRODUCTION_URL = "https://epay.esewa.com.np";

export type RegistrationDetails = ReturnType<
  typeof registrationDetailsSchema.parse
>;

export type EsewaStatusResponse = {
  status?: string;
  ref_id?: string;
  transaction_code?: string;
  total_amount?: string | number;
  transaction_uuid?: string;
  product_code?: string;
};

export type EsewaClient = {
  verifyPayment(input: {
    transactionUuid: string;
    totalAmount: number;
    productCode: string;
  }): Promise<EsewaStatusResponse>;
};

type PaymentConfig = {
  amount: number;
  productCode: string;
  secretKey: string;
  successUrl: string;
  failureUrl: string;
  gatewayUrl: string;
};

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new AppError(`${name} is not configured`, 500);
  return value;
};

const getConfig = (): PaymentConfig => {
  const amount = Number(required("ESEWA_REGISTRATION_AMOUNT"));
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new AppError(
      "ESEWA_REGISTRATION_AMOUNT must be a positive integer",
      500,
    );
  }

  const sandbox = process.env.ESEWA_ENV !== "production";
  return {
    amount,
    productCode: required("ESEWA_PRODUCT_CODE"),
    secretKey: required("ESEWA_SECRET_KEY"),
    successUrl: required("ESEWA_SUCCESS_URL"),
    failureUrl: required("ESEWA_FAILURE_URL"),
    gatewayUrl: `${sandbox ? ESEWA_SANDBOX_URL : ESEWA_PRODUCTION_URL}/api/epay/main/v2/form`,
  };
};

const sign = (message: string, secretKey: string): string =>
  createHmac("sha256", secretKey).update(message).digest("base64");

const decodeResponse = (encodedResponse: string): EsewaStatusResponse => {
  try {
    const normalized = encodedResponse.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = new TextDecoder().decode(
      Uint8Array.from(atob(padded), (character) => character.charCodeAt(0)),
    );
    const response: unknown = JSON.parse(decoded);
    if (!response || typeof response !== "object")
      throw new Error("Invalid response");
    return response as EsewaStatusResponse;
  } catch {
    throw new AppError("Invalid eSewa payment response", 400);
  }
};

const defaultEsewaClient: EsewaClient = {
  async verifyPayment({ transactionUuid, totalAmount, productCode }) {
    const sandbox = process.env.ESEWA_ENV !== "production";
    const baseUrl = sandbox ? ESEWA_SANDBOX_URL : ESEWA_PRODUCTION_URL;
    const url = new URL("/api/epay/transaction/status/", baseUrl);
    url.search = new URLSearchParams({
      product_code: productCode,
      total_amount: String(totalAmount),
      transaction_uuid: transactionUuid,
    }).toString();

    const response = await fetch(url);
    if (!response.ok) {
      throw new AppError("eSewa payment verification failed", 502);
    }
    return (await response.json()) as EsewaStatusResponse;
  },
};

export class PaymentService {
  constructor(
    private readonly repo: Pick<
      RegistrationsRepository,
      "getByTransactionUuid" | "create"
    >,
    private readonly esewaClient: EsewaClient = defaultEsewaClient,
  ) {}

  initiate(details: unknown) {
    const validated = registrationDetailsSchema.parse(details);
    const config = getConfig();
    const transactionUuid = `pesa-cup-${randomUUID()}`;
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const signature = sign(
      `total_amount=${config.amount},transaction_uuid=${transactionUuid},product_code=${config.productCode}`,
      config.secretKey,
    );

    return {
      ...validated,
      amount: config.amount,
      total_amount: config.amount,
      transaction_uuid: transactionUuid,
      product_code: config.productCode,
      signed_field_names: signedFieldNames,
      signature,
      success_url: config.successUrl,
      failure_url: config.failureUrl,
      gateway_url: config.gatewayUrl,
    };
  }

  async verify(details: unknown): Promise<Registration> {
    const { encodedResponse, ...registrationDetails } =
      verifyPaymentSchema.parse(details);
    const decoded = decodeResponse(encodedResponse);
    const config = getConfig();

    if (
      decoded.status !== "COMPLETE" ||
      decoded.product_code !== config.productCode ||
      Number(decoded.total_amount) !== config.amount
    ) {
      throw new AppError("Payment could not be verified", 400);
    }

    if (!decoded.transaction_uuid) {
      throw new AppError("Payment response is missing transaction UUID", 400);
    }
    if (await this.repo.getByTransactionUuid(decoded.transaction_uuid)) {
      throw new AppError("Payment transaction has already been used", 409);
    }

    const status = await this.esewaClient.verifyPayment({
      transactionUuid: decoded.transaction_uuid,
      totalAmount: config.amount,
      productCode: config.productCode,
    });
    if (
      status.status !== "COMPLETE" ||
      status.transaction_uuid !== decoded.transaction_uuid ||
      status.product_code !== config.productCode ||
      Number(status.total_amount) !== config.amount
    ) {
      throw new AppError("Payment could not be verified", 400);
    }

    const payload: RegistrationPayload = {
      ...registrationDetails,
      paymentMethod: "ESEWA",
      transactionUuid: decoded.transaction_uuid,
      transactionCode: decoded.transaction_code ?? status.ref_id ?? null,
      amountPaid: config.amount,
      paymentReceiptUrl: null,
      status: "PENDING",
      rejectionReason: null,
      teamId: null,
    };
    return this.repo.create(payload);
  }
}

export { decodeResponse, getConfig, sign };
