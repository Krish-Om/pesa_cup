import API_BASE_URL from "../../data/apis/config";

const STORAGE_KEY = "pesa_admin_key";

export class AdminAuthError extends Error {}

const getAdminKey = () => sessionStorage.getItem(STORAGE_KEY) || "";

/**
 * Fetch wrapper for admin routes. Attaches the Bearer token automatically.
 * Pass `body` as a plain object for JSON requests, or a FormData instance
 * for file uploads (Content-Type is left for the browser to set).
 */
export async function adminFetch(path, { method = "GET", body, headers } = {}) {
  const key = getAdminKey();
  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    // Let callers redirect to /admin/login
    throw new AdminAuthError("Admin session expired or invalid.");
  }

  // 204 No Content — nothing to parse
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}

/**
 * Fetches a protected static file (e.g. a receipt image) and returns a
 * local object URL. Caller is responsible for revoking it when done.
 */
export async function fetchProtectedFileUrl(path) {
  const key = getAdminKey();
  const response = await fetch(`${API_BASE_URL.replace(/\/api\/v1$/, "")}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (response.status === 401) {
    throw new AdminAuthError("Admin session expired or invalid.");
  }
  if (!response.ok) {
    throw new Error("Unable to load file.");
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
