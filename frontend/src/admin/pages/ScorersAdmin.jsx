import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminAuthError } from "../api/adminClient";
import { RegistrationsAdminAPI } from "../api/registrations.admin";
import { ScorersAdminAPI } from "../api/scorers.admin";
import { TournamentsAdminAPI } from "../api/tournaments.admin";
import AdminModal from "../components/AdminModal";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../css/Admin.css";

const EMPTY_FORM = {
  tournamentId: "",
  teamId: "",
  playerName: "",
  goals: "0",
  assists: "0",
  rank: "",
  avatar: "",
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

export default function ScorersAdmin() {
  const { logout } = useAdminAuth();

  const [scorers, setScorers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingScorer, setEditingScorer] = useState(null);
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
      const [scorersData, registrationsData, tournamentsData] =
        await Promise.all([
          ScorersAdminAPI.getAll(),
          RegistrationsAdminAPI.getAll(),
          TournamentsAdminAPI.getAll(),
        ]);

      setScorers(
        Array.isArray(scorersData) ? scorersData : (scorersData?.data ?? []),
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
      setError(err.message || "Failed to load scorers.");
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

  const sortedScorers = useMemo(() => {
    return [...scorers].sort(
      (a, b) => b.goals - a.goals || b.assists - a.assists,
    );
  }, [scorers]);

  const openCreateModal = () => {
    setEditingScorer(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (scorer) => {
    setEditingScorer(scorer);
    setForm({
      tournamentId: String(scorer.tournamentId ?? ""),
      teamId: String(scorer.teamId ?? ""),
      playerName: scorer.playerName || "",
      goals: String(scorer.goals ?? 0),
      assists: String(scorer.assists ?? 0),
      rank:
        scorer.rank === null || scorer.rank === undefined
          ? ""
          : String(scorer.rank),
      avatar: scorer.avatar || "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingScorer(null);
    setFormError("");
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.tournamentId || !form.teamId || !form.playerName.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const payload = {
      tournamentId: Number(form.tournamentId),
      teamId: Number(form.teamId),
      playerName: form.playerName.trim(),
      goals: toNumber(form.goals),
      assists: toNumber(form.assists),
      rank: form.rank.trim() === "" ? null : Number(form.rank),
      avatar: form.avatar.trim() === "" ? null : form.avatar.trim(),
    };

    setSaving(true);
    try {
      if (editingScorer) {
        await ScorersAdminAPI.update(editingScorer.id, payload);
      } else {
        await ScorersAdminAPI.create(payload);
      }
      closeModal();
      await loadAll();
    } catch (err) {
      if (err instanceof AdminAuthError) {
        logout();
        return;
      }
      setFormError(err.message || "Failed to save scorer.");
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (scorer) => {
    setDeleteTarget(scorer);
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
      await ScorersAdminAPI.remove(deleteTarget.id);
      setScorers((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      if (err instanceof AdminAuthError) {
        logout();
        return;
      }
      setDeleteError(err.message || "Failed to delete scorer.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Scorers</h1>
          <p>Manage the top scorers leaderboard.</p>
        </div>
        <button className="btn admin-add-btn" onClick={openCreateModal}>
          <PlusCircle size={16} />
          Add scorer
        </button>
      </div>

      {teams.length === 0 && !loading && (
        <p className="admin-inline-note">
          No teams available yet — a team only appears here once a registration
          for it has been approved.
        </p>
      )}

      {loading && <p className="admin-empty-state">Loading scorers…</p>}
      {!loading && error && (
        <p className="admin-empty-state admin-error-text">{error}</p>
      )}

      {!loading && !error && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Team</th>
                <th>Tournament</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedScorers.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-state">
                    No scorers yet.
                  </td>
                </tr>
              )}
              {sortedScorers.map((s, i) => (
                <tr key={s.id}>
                  <td>{s.rank ?? i + 1}</td>
                  <td className="admin-table-strong">{s.playerName}</td>
                  <td>
                    {s.teamName || teamNameById.get(String(s.teamId)) || "?"}
                  </td>
                  <td>{s.tournament?.name || "—"}</td>
                  <td>{s.goals}</td>
                  <td>{s.assists}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-icon-btn"
                        onClick={() => openEditModal(s)}
                        title="Edit scorer"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="admin-icon-btn admin-icon-btn--reject"
                        onClick={() => requestDelete(s)}
                        disabled={deletingId === s.id}
                        title="Remove scorer"
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
          title={editingScorer ? "Edit scorer" : "Add scorer"}
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
                <label className="admin-form-label">Player name</label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={form.playerName}
                  onChange={handleChange("playerName")}
                  placeholder="e.g. Ram Bahadur"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Rank (optional)</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="1"
                  value={form.rank}
                  onChange={handleChange("rank")}
                  placeholder="Auto if left blank"
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Goals</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="0"
                  value={form.goals}
                  onChange={handleChange("goals")}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Assists</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="0"
                  value={form.assists}
                  onChange={handleChange("assists")}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Avatar URL (optional)
                </label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={form.avatar}
                  onChange={handleChange("avatar")}
                  placeholder="https://…"
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
                  : editingScorer
                    ? "Save changes"
                    : "Create scorer"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminModal title="Remove scorer" onClose={cancelDelete}>
          <p className="admin-modal-text">
            Remove <strong>{deleteTarget.playerName || "this scorer"}</strong>{" "}
            from the leaderboard? This can't be undone.
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
