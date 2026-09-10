import { adminFetch } from "./adminClient";

export const StandingsAdminAPI = {
  getAll: () => adminFetch("/standings"),
  create: (standing) =>
    adminFetch("/standings", { method: "POST", body: standing }),
  update: (id, standing) =>
    adminFetch(`/standings/${id}`, { method: "PATCH", body: standing }),
  remove: (id) => adminFetch(`/standings/${id}`, { method: "DELETE" }),
};
