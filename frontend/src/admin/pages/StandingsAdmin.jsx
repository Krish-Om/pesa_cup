import ComingSoon from "../components/ComingSoon";

export default function StandingsAdmin() {
  return (
    <ComingSoon
      title="Standings"
      description="Create, update, and remove standings rows."
      apiHint="StandingsAdminAPI.create / .update / .remove — see src/admin/api/standings.admin.js"
    />
  );
}
