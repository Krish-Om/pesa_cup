import { adminFetch } from "./adminClient";

export const FixturesAdminAPI = {
  create: (fixture) => adminFetch("/fixtures", { method: "POST", body: fixture }),
  update: (id, fixture) =>
    adminFetch(`/fixtures/${id}`, { method: "PATCH", body: fixture }),
};
