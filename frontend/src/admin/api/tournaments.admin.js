import { adminFetch } from "./adminClient";

export const TournamentsAdminAPI = {
  getAll: () => adminFetch("/tournaments"),
  create: (tournament) =>
    adminFetch("/tournaments", { method: "POST", body: tournament }),
  update: (id, tournament) =>
    adminFetch(`/tournaments/${id}`, { method: "PATCH", body: tournament }),
  remove: (id) => adminFetch(`/tournaments/${id}`, { method: "DELETE" }),
};

export const ContactsAdminAPI = {
  getAll: () => adminFetch("/contacts"),
};
