import ComingSoon from "../components/ComingSoon";

export default function ContactsAdmin() {
  return (
    <ComingSoon
      title="Contacts"
      description="View messages submitted through the contact form."
      apiHint="ContactsAdminAPI.getAll() — see src/admin/api/tournaments.admin.js"
    />
  );
}
