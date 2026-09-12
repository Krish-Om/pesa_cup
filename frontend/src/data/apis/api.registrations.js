import API_BASE_URL from "./config";

const registrationsEndpoint = `${API_BASE_URL}/registrations`;

const requestJson = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || "Unable to submit registration");
  }
  return body;
};

/** Upload a payment receipt image. Returns { url: string }. */
export const uploadPaymentReceipt = async (file) => {
  const formData = new FormData();
  formData.append("receipt", file);

  const response = await fetch(`${registrationsEndpoint}/upload-receipt`, {
    method: "POST",
    body: formData,
    // No Content-Type header — browser sets multipart boundary automatically
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || "Failed to upload receipt");
  }
  return body;
};

/** Submit a completed registration payload. Returns the created registration. */
export const submitRegistration = (registration) =>
  requestJson(registrationsEndpoint, {
    method: "POST",
    body: JSON.stringify(registration),
  });
