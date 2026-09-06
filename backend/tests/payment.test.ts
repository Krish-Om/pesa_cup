import { beforeEach, describe, expect, mock, test } from "bun:test";
import {
  PaymentService,
  type EsewaClient,
} from "../src/modules/registrations/payment.service";
import type { RegistrationPayload } from "../src/modules/registrations/registrations.schema";

const details = {
  tournamentId: 1,
  teamName: "Falcons",
  captainName: "Alex",
  captainEmail: "alex@example.com",
  captainPhone: "9812345678",
  playerCount: 8,
  batchYear: "2026",
};

const encode = (value: unknown) => btoa(JSON.stringify(value));

const repository = () => {
  const created: RegistrationPayload[] = [];
  return {
    created,
    async getByTransactionUuid(transactionUuid: string) {
      return (
        created.find((item) => item.transactionUuid === transactionUuid) ?? null
      );
    },
    async create(payload: RegistrationPayload) {
      created.push(payload);
      return { id: created.length, ...payload } as never;
    },
  };
};

const setPaymentEnvironment = () => {
  process.env.ESEWA_REGISTRATION_AMOUNT = "1500";
  process.env.ESEWA_PRODUCT_CODE = "EPAYTEST";
  process.env.ESEWA_SECRET_KEY = "test-secret";
  process.env.ESEWA_SUCCESS_URL = "http://localhost:5173/payment/success";
  process.env.ESEWA_FAILURE_URL = "http://localhost:5173/payment/failure";
  process.env.ESEWA_ENV = "sandbox";
};

describe("PaymentService", () => {
  beforeEach(() => {
    setPaymentEnvironment();
  });

  test("creates a signed gateway payload using the server amount", () => {
    const service = new PaymentService(repository());
    const payload = service.initiate({ ...details });

    expect(payload.amount).toBe(1500);
    expect(payload.total_amount).toBe(1500);
    expect(payload.product_code).toBe("EPAYTEST");
    expect(payload.transaction_uuid).toStartWith("pesa-cup-");
    expect(payload.gateway_url).toContain("rc-epay.esewa.com.np");
    expect(payload.signature).toBeString();
    expect(payload).not.toHaveProperty("secretKey");
  });

  test("verifies payment server-side before creating a pending registration", async () => {
    const repo = repository();
    const verifyPayment = mock<EsewaClient["verifyPayment"]>(async (input) => ({
      status: "COMPLETE",
      transaction_uuid: input.transactionUuid,
      product_code: input.productCode,
      total_amount: input.totalAmount,
      ref_id: "ref-123",
    }));
    const service = new PaymentService(repo, { verifyPayment });
    const transactionUuid = "pesa-cup-payment-1";

    const result = await service.verify({
      ...details,
      encodedResponse: encode({
        status: "COMPLETE",
        transaction_uuid: transactionUuid,
        product_code: "EPAYTEST",
        total_amount: "1500",
        transaction_code: "txn-code",
      }),
    });

    expect(verifyPayment).toHaveBeenCalledWith({
      transactionUuid,
      totalAmount: 1500,
      productCode: "EPAYTEST",
    });
    expect(result).toMatchObject({
      status: "PENDING",
      paymentMethod: "ESEWA",
      transactionUuid,
      transactionCode: "txn-code",
      amountPaid: 1500,
    });
    expect(repo.created).toHaveLength(1);
  });

  test("rejects incomplete or mismatched payment responses", async () => {
    const repo = repository();
    const verifyPayment = mock<EsewaClient["verifyPayment"]>(async () => ({
      status: "COMPLETE",
    }));
    const service = new PaymentService(repo, { verifyPayment });

    await expect(
      service.verify({
        ...details,
        encodedResponse: encode({
          status: "PENDING",
          transaction_uuid: "payment-1",
          product_code: "EPAYTEST",
          total_amount: "1500",
        }),
      }),
    ).rejects.toThrow("Payment could not be verified");
    expect(verifyPayment).not.toHaveBeenCalled();

    await expect(
      service.verify({
        ...details,
        encodedResponse: encode({
          status: "COMPLETE",
          transaction_uuid: "payment-2",
          product_code: "EPAYTEST",
          total_amount: "1",
        }),
      }),
    ).rejects.toThrow("Payment could not be verified");
    expect(repo.created).toHaveLength(0);
  });

  test("rejects a transaction UUID that was already used", async () => {
    const repo = repository();
    const verifyPayment = mock<EsewaClient["verifyPayment"]>(async (input) => ({
      status: "COMPLETE",
      transaction_uuid: input.transactionUuid,
      product_code: input.productCode,
      total_amount: input.totalAmount,
    }));
    const service = new PaymentService(repo, { verifyPayment });
    const encodedResponse = encode({
      status: "COMPLETE",
      transaction_uuid: "payment-used",
      product_code: "EPAYTEST",
      total_amount: "1500",
    });

    await service.verify({ ...details, encodedResponse });
    await expect(
      service.verify({ ...details, encodedResponse }),
    ).rejects.toThrow("Payment transaction has already been used");
    expect(repo.created).toHaveLength(1);
    expect(verifyPayment).toHaveBeenCalledTimes(1);
  });
});
