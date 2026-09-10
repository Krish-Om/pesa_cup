import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminAuthError } from "../api/adminClient";
import { RegistrationsAdminAPI } from "../api/registrations.admin";
import { StandingsAdminAPI } from "../api/standings.admin";
import { TournamentsAdminAPI } from "../api/tournaments.admin";
import AdminModal from "../components/AdminModal";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../css/Admin.css";

const EMPTY_FORM = {
  tournamentId: "",
  teamId: "",
  group: "",
  position: "",
  played: "0",
  won: "0",
  draw: "0",
  lost: "0",
  goalFor: "0",
  goalAgainst: "0",
};

// Teams only exist once a registration is approved — there's no dedicated
// /teams endpoint, so we derive the picker options from approved
// registrations instead (each carries a teamId once approved).
function deriveTeams(registrations) {
  const byId = new Map();
  for (const reg of registrations) {
    if (reg.status === "APPROVED" && reg.teamId) {
      byId.set(reg.teamId, { id: reg.teamId, name: reg.teamName });
    }
  }
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
}

const toNumber = (value) =>
  value === "" || value === null ? 0 : Number(value);

// Standard football scoring: 3 points for a win, 1 for a draw.
const computePoints = (won, draw) => toNumber(won) * 3 + toNumber(draw);

export default function StandingsAdmin() {
  const { logout } = useAdminAuth();

  const [standings, setStandings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStanding, setEditingStanding] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [standingsData, registrationsData, tournamentsData] =
        await Promise.all([
          StandingsAdminAPI.getAll(),
          RegistrationsAdminAPI.getAll(),
          TournamentsAdminAPI.getAll(),
        ]);

      setStandings(
        Array.isArray(standingsData)
          ? standingsData
          : (standingsData?.data ?? []),
      );

      const registrations = Array.isArray(registrationsData)
        ? registrationsData
        : (registrationsData?.data ?? []);
      setTeams(deriveTeams(registrations));

      setTournaments(
        Array.isArray(tournamentsData)
          ? tournamentsData
          : (tournamentsData?.data ?? []),
      );
    } catch (err) {
      if (err instanceof AdminAuthError) {
        logout();
        return;
      }
      setError(err.message || "Failed to load standings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const teamNameById = useMemo(() => {
    const map = new Map();
    for (const t of teams) map.set(String(t.id), t.name);
    return map;
  }, [teams]);

  const sortedStandings = useMemo(() => {
    return [...standings].sort((a, b) => {
      const tourA = a.tournament?.name || "";
      const tourB = b.tournament?.name || "";
      if (tourA !== tourB) return tourA.localeCompare(tourB);
      const groupA = a.group || "";
      const groupB = b.group || "";
      if (groupA !== groupB) return groupA.localeCompare(groupB);
      const posA = a.position ?? Number.MAX_SAFE_INTEGER;
      const posB = b.position ?? Number.MAX_SAFE_INTEGER;
      return posA - posB;
    });
  }, [standings]);

  const openCreateModal = () => {
    setEditingStanding(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (standing) => {
    setEditingStanding(standing);
    setForm({
      tournamentId: String(standing.tournamentId ?? ""),
      teamId: String(standing.teamId ?? ""),
      group: standing.group || "",
      position:
        standing.position === null || standing.position === undefined
          ? ""
          : String(standing.position),
      played: String(standing.played ?? 0),
      won: String(standing.won ?? 0),
      draw: String(standing.draw ?? 0),
      lost: String(standing.lost ?? 0),
      goalFor: String(standing.goalFor ?? 0),
      goalAgainst: String(standing.goalAgainst ?? 0),
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStanding(null);
    setFormError("");
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.tournamentId || !form.teamId || !form.group.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const goalFor = toNumber(form.goalFor);
    const goalAgainst = toNumber(form.goalAgainst);

    const payload = {
      tournamentId: Number(form.tournamentId),
      teamId: Number(form.teamId),
      group: form.group.trim(),
      position: form.position.trim() === "" ? null : Number(form.position),
      played: toNumber(form.played),
      won: toNumber(form.won),
      draw: toNumber(form.draw),
      lost: toNumber(form.lost),
      goalFor,
      goalAgainst,
      goalDifference: goalFor - goalAgainst,
      points: computePoints(form.won, form.draw),
    };

    setSaving(true);
    try {
      if (editingStanding) {
        await StandingsAdminAPI.update(editingStanding.id, payload);
      } else {
        await StandingsAdminAPI.create(payload);
      }
      closeModal();
      await loadAll();
    } catch (err) {
      if (err instanceof AdminAuthError) {
        logout();
        return;
      }
      setFormError(err.message || "Failed to save standing.");
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (standing) => {
    setDeleteTarget(standing);
    setDeleteError("");
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setDeleteError("");
    try {
      await StandingsAdminAPI.remove(deleteTarget.id);
      setStandings((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      if (err instanceof AdminAuthError) {
        logout();
        return;
      }
      setDeleteError(err.message || "Failed to delete standing.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Standings</h1>
          <p>Create, update, and remove standings rows.</p>
        </div>
        <button className="btn admin-add-btn" onClick={openCreateModal}>
          <PlusCircle size={16} />
          Add row
        </button>
      </div>

      {teams.length === 0 && !loading && (
        <p className="admin-inline-note">
          No teams available yet — a team only appears here once a registration
          for it has been approved.
        </p>
      )}

      {loading && <p className="admin-empty-state">Loading standings…</p>}
      {!loading && error && (
        <p className="admin-empty-state admin-error-text">{error}</p>
      )}

      {!loading && !error && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>Group</th>
                <th>Tournament</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Pts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStandings.length === 0 && (
                <tr>
                  <td colSpan={13} className="admin-empty-state">
                    No standings rows yet.
                  </td>
                </tr>
              )}
              {sortedStandings.map((s) => (
                <tr key={s.id}>
                  <td>{s.position ?? "—"}</td>
                  <td className="admin-table-strong">
                    {s.team || teamNameById.get(String(s.teamId)) || "?"}
                  </td>
                  <td>{s.group}</td>
                  <td>{s.tournament?.name || "—"}</td>
                  <td>{s.played}</td>
                  <td>{s.won}</td>
                  <td>{s.draw}</td>
                  <td>{s.lost}</td>
                  <td>{s.goalFor}</td>
                  <td>{s.goalAgainst}</td>
                  <td>{s.goalDifference}</td>
                  <td className="admin-table-strong">{s.points}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-icon-btn"
                        onClick={() => openEditModal(s)}
                        title="Edit row"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="admin-icon-btn admin-icon-btn--reject"
                        onClick={() => requestDelete(s)}
                        disabled={deletingId === s.id}
                        title="Remove row"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <AdminModal
          title={editingStanding ? "Edit standings row" : "Add standings row"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Tournament</label>
                <select
                  className="admin-form-select"
                  value={form.tournamentId}
                  onChange={handleChange("tournamentId")}
                >
                  <option value="">Select tournament…</option>
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Team</label>
                <select
                  className="admin-form-select"
                  value={form.teamId}
                  onChange={handleChange("teamId")}
                >
                  <option value="">Select team…</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Group</label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={form.group}
                  onChange={handleChange("group")}
                  placeholder="e.g. Group A"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Position</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="1"
                  value={form.position}
                  onChange={handleChange("position")}
                  placeholder="e.g. 1"
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Played</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="0"
                  value={form.played}
                  onChange={handleChange("played")}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Won</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="0"
                  value={form.won}
                  onChange={handleChange("won")}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Draw</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="0"
                  value={form.draw}
                  onChange={handleChange("draw")}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Lost</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="0"
                  value={form.lost}
                  onChange={handleChange("lost")}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Goals for</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="0"
                  value={form.goalFor}
                  onChange={handleChange("goalFor")}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Goals against</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="0"
                  value={form.goalAgainst}
                  onChange={handleChange("goalAgainst")}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Goal difference (auto)
                </label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={
                    (toNumber(form.goalFor) - toNumber(form.goalAgainst) >= 0
                      ? "+"
                      : "") +
                    (toNumber(form.goalFor) - toNumber(form.goalAgainst))
                  }
                  disabled
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Points (auto, 3–1–0)</label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={computePoints(form.won, form.draw)}
                  disabled
                />
              </div>
            </div>

            {formError && <p className="admin-form-error">{formError}</p>}

            <div className="admin-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button type="submit" className="btn" disabled={saving}>
                {saving
                  ? "Saving…"
                  : editingStanding
                    ? "Save changes"
                    : "Create row"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminModal title="Remove standings row" onClose={cancelDelete}>
          <p className="admin-modal-text">
            Remove{" "}
            <strong>
              {deleteTarget.team ||
                teamNameById.get(String(deleteTarget.teamId)) ||
                "this row"}
            </strong>{" "}
            from the standings? This can't be undone.
          </p>

          {deleteError && <p className="admin-form-error">{deleteError}</p>}

          <div className="admin-modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelDelete}
              disabled={deletingId === deleteTarget.id}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn admin-btn-danger"
              onClick={confirmDelete}
              disabled={deletingId === deleteTarget.id}
            >
              {deletingId === deleteTarget.id ? "Removing…" : "Remove"}
            </button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
