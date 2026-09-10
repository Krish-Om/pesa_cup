import ComingSoon from "../components/ComingSoon";

export default function ScorersAdmin() {
  return (
    <ComingSoon
      title="Scorers"
      description="Manage the top scorers leaderboard."
      apiHint="ScorersAdminAPI.create / .update / .remove — see src/admin/api/scorers.admin.js"
    />
  );
}
