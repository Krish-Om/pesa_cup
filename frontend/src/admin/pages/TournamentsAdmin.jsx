import ComingSoon from "../components/ComingSoon";

export default function TournamentsAdmin() {
  return (
    <ComingSoon
      title="Tournaments"
      description="Create and edit tournament metadata."
      apiHint="TournamentsAdminAPI.create / .update / .remove — see src/admin/api/tournaments.admin.js"
    />
  );
}
