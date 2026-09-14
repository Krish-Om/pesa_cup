import { Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { TournamentsAdminAPI } from "../api/tournaments.admin";
import "../css/Admin.css";
import "../css/TournamentsAdmin.css";

// Turns a tournament name into a URL-safe slug, e.g.
// "Inter-Faculty Football League" -> "inter-faculty-football-league"
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function TournamentsAdmin() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    organizer: "",
    location: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    entryFee: "",
    status: "UPCOMING",
    description: "",
    rules: "",
    firstPrize: "",
    secondPrize: "",
    thirdPrize: "",
    bannerUrl: "",
  });

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const res = await TournamentsAdminAPI.getAll();
      setTournaments(res?.data || res || []);
    } catch (err) {
      setError(err.message || "Failed to fetch tournaments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const handleOpenModal = (tournament = null) => {
    if (tournament) {
      setEditingId(tournament.id);
      setFormData({
        name: tournament.name || "",
        organizer: tournament.organizer || "",
        location: tournament.venue || tournament.location || "",
        startDate: tournament.startDate || "",
        endDate: tournament.endDate || "",
        registrationDeadline: tournament.registrationDeadline || "",
        entryFee: tournament.entryFee || "",
        status: (tournament.status || "UPCOMING").toUpperCase(),
        description: tournament.description || "",
        rules: tournament.rules || "",
        firstPrize: tournament.firstPrize || "",
        secondPrize: tournament.secondPrize || "",
        thirdPrize: tournament.thirdPrize || "",
        bannerUrl: tournament.bannerUrl || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        organizer: "",
        location: "",
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        entryFee: "",
        status: "UPCOMING",
        description: "",
        rules: "",
        firstPrize: "",
        secondPrize: "",
        thirdPrize: "",
        bannerUrl: "",
      });
    }
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const { location, ...rest } = formData;
    const payload = { ...rest, venue: location, slug: slugify(formData.name) };
    try {
      if (editingId) {
        await TournamentsAdminAPI.update(editingId, payload);
      } else {
        await TournamentsAdminAPI.create(payload);
      }
      handleCloseModal();
      await loadTournaments();
      setSuccessMsg(editingId ? "Tournament updated." : "Tournament created.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setFormError(err.message || "Failed to save tournament.");
    }
  };

  const requestDelete = (tournament) => {
    setDeleteTarget(tournament);
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
      await TournamentsAdminAPI.remove(deleteTarget.id);
      await loadTournaments();
      setDeleteTarget(null);
      setSuccessMsg("Tournament deleted.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete tournament.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Tournaments</h1>
          <p>Create, edit, and manage tournament details.</p>
        </div>
        <button className="btn admin-add-btn" onClick={() => handleOpenModal()}>
          <PlusCircle size={16} /> Add Tournament
        </button>
      </div>

      {successMsg && (
        <p className="admin-inline-note admin-success-text">{successMsg}</p>
      )}

      {loading ? (
        <div className="admin-empty-state">Loading tournaments...</div>
      ) : error ? (
        <div className="admin-empty-state admin-error-text">{error}</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Location</th>
                <th>Fee</th>
                <th>Start Date</th>
                <th>Deadline</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="admin-empty-state">
                    No tournaments found.
                  </td>
                </tr>
              ) : (
                tournaments.map((t) => (
                  <tr key={t.id}>
                    <td className="admin-table-strong">{t.name}</td>
                    <td>
                      <span
                        className={`badge-status ${t.status?.toLowerCase() || "upcoming"}`}
                      >
                        {t.status || "UPCOMING"}
                      </span>
                    </td>
                    <td>{t.venue || t.location || "-"}</td>
                    <td>{t.entryFee ? `NRs. ${t.entryFee}` : "NRs. -"}</td>
                    <td>{t.startDate || "-"}</td>
                    <td>{t.registrationDeadline || "-"}</td>
                    <td>
                      <div
                        className="admin-row-actions"
                        style={{ justifyContent: "flex-end" }}
                      >
                        <button
                          className="admin-icon-btn"
                          onClick={() => handleOpenModal(t)}
                          title="Edit Tournament"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="admin-icon-btn admin-icon-btn--reject"
                          onClick={() => requestDelete(t)}
                          title="Delete Tournament"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editingId ? "Edit Tournament" : "New Tournament"}</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Tournament Name</label>
                  <input
                    required
                    className="admin-form-input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Organizer</label>
                    <input
                      required
                      className="admin-form-input"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Location</label>
                    <input
                      required
                      className="admin-form-input"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Status</label>
                    <select
                      className="admin-form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ONGOING">Ongoing</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Entry Fee (NRs)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      name="entryFee"
                      value={formData.entryFee}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Start Date</label>
                    <input
                      type="date"
                      className="admin-form-input"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">End Date</label>
                    <input
                      type="date"
                      className="admin-form-input"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Deadline</label>
                  <input
                    type="date"
                    className="admin-form-input"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    className="admin-form-input"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Shown under 'About the Tournament' on the public page"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Rules & Guidelines</label>
                  <textarea
                    className="admin-form-input"
                    name="rules"
                    rows={3}
                    value={formData.rules}
                    onChange={handleChange}
                    placeholder="Shown under 'Rules & Guidelines' on the public page"
                  />
                </div>

                <div className="admin-form-row-3">
                  <div className="admin-form-group">
                    <label className="admin-form-label">1st Prize</label>
                    <input
                      className="admin-form-input"
                      name="firstPrize"
                      value={formData.firstPrize}
                      onChange={handleChange}
                      placeholder="e.g. NRs. 50,000"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">2nd Prize</label>
                    <input
                      className="admin-form-input"
                      name="secondPrize"
                      value={formData.secondPrize}
                      onChange={handleChange}
                      placeholder="e.g. NRs. 25,000"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">3rd Prize</label>
                    <input
                      className="admin-form-input"
                      name="thirdPrize"
                      value={formData.thirdPrize}
                      onChange={handleChange}
                      placeholder="e.g. NRs. 10,000"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Banner Image URL (optional)
                  </label>
                  <input
                    className="admin-form-input"
                    name="bannerUrl"
                    value={formData.bannerUrl}
                    onChange={handleChange}
                    placeholder="https://…"
                  />
                </div>

                {formError && <p className="admin-form-error">{formError}</p>}

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn">
                    {editingId ? "Save changes" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Delete Tournament</h2>
              <button className="admin-modal-close" onClick={cancelDelete}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p className="admin-modal-text">
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.name || "this tournament"}</strong>? This
                will also remove any related fixtures, standings, and scorers.
                This can't be undone.
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
                  {deletingId === deleteTarget.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
