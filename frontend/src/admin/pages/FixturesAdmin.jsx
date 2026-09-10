import ComingSoon from "../components/ComingSoon";

export default function FixturesAdmin() {
  return (
    <ComingSoon
      title="Fixtures"
      description="Create and update match fixtures."
      apiHint="FixturesAdminAPI.create(fixture) / .update(id, fixture) — see src/admin/api/fixtures.admin.js"
    />
  );
}
