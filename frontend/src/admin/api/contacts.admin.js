import { adminFetch } from "./adminClient";

export const ContactsAdminAPI = {
  getAll: () => adminFetch("/contacts"),
};
