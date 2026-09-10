import { adminFetch } from "./adminClient";

export const RegistrationsAdminAPI = {
  getAll: () => adminFetch("/registrations"),

  approve: (id) =>
    adminFetch(`/registrations/${id}/approve`, { method: "PATCH" }),

  reject: (id, rejectionReason) =>
    adminFetch(`/registrations/${id}/reject`, {
      method: "PATCH",
      body: rejectionReason ? { rejectionReason } : {},
    }),
};
