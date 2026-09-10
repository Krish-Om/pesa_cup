import { adminFetch } from "./adminClient";

export const ScorersAdminAPI = {
  create: (scorer) => adminFetch("/scorers", { method: "POST", body: scorer }),
  update: (id, scorer) =>
    adminFetch(`/scorers/${id}`, { method: "PATCH", body: scorer }),
  remove: (id) => adminFetch(`/scorers/${id}`, { method: "DELETE" }),
};
