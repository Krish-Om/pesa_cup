import { adminFetch } from "./adminClient";

export const ScorersAdminAPI = {
  getAll: () => adminFetch("/scorers"),
  create: (scorer) => adminFetch("/scorers", { method: "POST", body: scorer }),
  update: (id, scorer) =>
    adminFetch(`/scorers/${id}`, { method: "PATCH", body: scorer }),
  remove: (id) => adminFetch(`/scorers/${id}`, { method: "DELETE" }),
};
