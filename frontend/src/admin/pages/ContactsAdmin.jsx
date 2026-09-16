import { Eye, Mail } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminAuthError } from "../api/adminClient";
import { ContactsAdminAPI } from "../api/contacts.admin";
import AdminModal from "../components/AdminModal";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../css/Admin.css";

const STATUS_LABEL = {
  new: "New",
  read: "Read",
  archived: "Archived",
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} · ${date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function ContactsAdmin() {
  const { logout } = useAdminAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewTarget, setViewTarget] = useState(null);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await ContactsAdminAPI.getAll();
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      // Most recent messages first.
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setContacts(list);
    } catch (err) {
      if (err instanceof AdminAuthError) {
        logout();
        return;
      }
      setError(err.message || "Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () =>
      contacts.filter((c) =>
        statusFilter === "ALL" ? true : c.status === statusFilter,
      ),
    [contacts, statusFilter],
  );

  const counts = useMemo(
    () => ({
      new: contacts.filter((c) => c.status === "new").length,
      read: contacts.filter((c) => c.status === "read").length,
      archived: contacts.filter((c) => c.status === "archived").length,
    }),
    [contacts],
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Contacts</h1>
          <p>View messages submitted through the contact form.</p>
        </div>
      </div>

      <div className="admin-filter-tabs">
        {["new", "read", "archived", "ALL"].map((status) => (
          <button
            key={status}
            className={`admin-filter-tab${statusFilter === status ? " active" : ""}`}
            onClick={() => setStatusFilter(status)}
          >
            {status === "ALL" ? "All" : STATUS_LABEL[status]}
            {status !== "ALL" && (
              <span className="admin-filter-count">{counts[status]}</span>
            )}
          </button>
        ))}
      </div>

      {loading && (
        <p className="admin-empty-state">Loading contact messages…</p>
      )}
      {!loading && error && (
        <p className="admin-empty-state admin-error-text">{error}</p>
      )}

      {!loading && !error && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Received</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty-state">
                    No{" "}
                    {statusFilter !== "ALL"
                      ? STATUS_LABEL[statusFilter].toLowerCase()
                      : ""}{" "}
                    messages.
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="admin-table-strong">
                    {c.name}
                    <div className="admin-table-sub">{c.email}</div>
                  </td>
                  <td>{c.subject}</td>
                  <td>
                    <span className="admin-contact-preview">{c.message}</span>
                  </td>
                  <td className="admin-table-sub">{formatDate(c.createdAt)}</td>
                  <td>
                    <span
                      className={`admin-status-badge admin-status-${c.status}`}
                    >
                      {STATUS_LABEL[c.status] || c.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-icon-btn"
                        onClick={() => setViewTarget(c)}
                        title="View message"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewTarget && (
        <AdminModal title="Contact message" onClose={() => setViewTarget(null)}>
          <div className="admin-contact-detail">
            <div className="admin-contact-detail-row">
              <span className="admin-form-label">From</span>
              <span>
                {viewTarget.name} &lt;{viewTarget.email}&gt;
              </span>
            </div>
            <div className="admin-contact-detail-row">
              <span className="admin-form-label">Subject</span>
              <span>{viewTarget.subject}</span>
            </div>
            <div className="admin-contact-detail-row">
              <span className="admin-form-label">Received</span>
              <span>{formatDate(viewTarget.createdAt)}</span>
            </div>
            <div className="admin-contact-detail-row">
              <span className="admin-form-label">Message</span>
              <p className="admin-contact-detail-message">
                {viewTarget.message}
              </p>
            </div>
            <a
              className="btn btn-secondary admin-contact-reply-btn"
              href={`mailto:${viewTarget.email}?subject=${encodeURIComponent(
                `Re: ${viewTarget.subject}`,
              )}`}
            >
              <Mail size={16} />
              Reply by email
            </a>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
