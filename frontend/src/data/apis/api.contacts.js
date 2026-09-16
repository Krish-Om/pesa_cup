import API_BASE_URL from "./config";

const contactsEndpoint = `${API_BASE_URL}/contacts`;

/** Submit a contact form message. Returns the created contact message. */
export const submitContact = async (contact) => {
  const response = await fetch(contactsEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      Array.isArray(body?.errors) && body.errors.length > 0
        ? body.errors
            .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message || e))
            .join("; ")
        : null;
    throw new Error(detail || body?.message || "Unable to send message");
  }

  return body;
};
