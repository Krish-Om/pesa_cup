import { CheckCircle2, ImageOff, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminAuthError, fetchProtectedFileUrl } from "../api/adminClient";
import { RegistrationsAdminAPI } from "../api/registrations.admin";
import AdminModal from "../components/AdminModal";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../css/Admin.css";

const STATUS_LABEL = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

function ReceiptThumb({ url }) {
  const [objectUrl, setObjectUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let revoke;
    let cancelled = false;

    fetchProtectedFileUrl(url)
      .then((blobUrl) => {
        if (cancelled) return;
        revoke = blobUrl;
        setObjectUrl(blobUrl);
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [url]);

  if (failed) {
    return (
      <div className="receipt-cell-empty">
        <ImageOff size={16} />
      </div>
    );
  }

  if (!objectUrl) {
    return (
      <div className="receipt-cell-empty">
        <Loader2 size={16} className="spin" />
      </div>
    );
  }

  return (
    <a href={objectUrl} target="_blank" rel="noopener noreferrer">
      <img
        src={objectUrl}
        alt="Payment receipt"
        className="receipt-cell-thumb"
      />
    </a>
  );
}

export default function RegistrationsAdmin() {
  const { logout } = useAdminAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const loadRegistrations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await RegistrationsAdminAPI.getAll();
      setRegistrations(Array.isArray(data) ? data : (data?.data ?? []));
    } catch (err) {
      if (err instanceof AdminAuthError) {
        logout();
        return;
      }
      setError(err.message || "Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await RegistrationsAdminAPI.approve(id);
      await loadRegistrations();
    } catch (err) {
      if (err instanceof AdminAuthError) return logout();
      window.alert(err.message || "Approve failed.");
    } finally {
      setActioningId(null);
    }
  };

  const openRejectModal = (registration) => {
    setRejectTarget(registration);
    setRejectReason("");
  };

  const closeRejectModal = () => {
    setRejectTarget(null);
    setRejectReason("");
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    setActioningId(rejectTarget.id);
    try {
      await RegistrationsAdminAPI.reject(
        rejectTarget.id,
        rejectReason || undefined,
      );
      closeRejectModal();
      await loadRegistrations();
    } catch (err) {
      if (err instanceof AdminAuthError) return logout();
      setError(err.message || "Reject failed.");
    } finally {
      setActioningId(null);
    }
  };

  const filtered = registrations.filter((r) =>
    statusFilter === "ALL" ? true : r.status === statusFilter,
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Registrations</h1>
          <p>
            Review payment receipts and approve or reject team registrations.
          </p>
        </div>
      </div>

      <div className="admin-filter-tabs">
        {["PENDING", "APPROVED", "REJECTED", "ALL"].map((status) => (
          <button
            key={status}
            className={`admin-filter-tab${statusFilter === status ? " active" : ""}`}
            onClick={() => setStatusFilter(status)}
          >
            {status === "ALL" ? "All" : STATUS_LABEL[status]}
            {status !== "ALL" && (
              <span className="admin-filter-count">
                {registrations.filter((r) => r.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && <p className="admin-empty-state">Loading registrations…</p>}
      {!loading && error && (
        <p className="admin-empty-state admin-error-text">{error}</p>
      )}

      {!loading && !error && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Captain</th>
                <th>Players</th>
                <th>Batch</th>
                <th>Receipt</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-state">
                    No{" "}
                    {statusFilter !== "ALL"
                      ? STATUS_LABEL[statusFilter].toLowerCase()
                      : ""}{" "}
                    registrations.
                  </td>
                </tr>
              )}
              {filtered.map((reg) => (
                <tr key={reg.id}>
                  <td className="admin-table-strong">{reg.teamName}</td>
                  <td>
                    {reg.captainName}
                    <div className="admin-table-sub">
                      {reg.captainEmail} · {reg.captainPhone}
                    </div>
                  </td>
                  <td>{reg.playerCount}</td>
                  <td>{reg.batchYear}</td>
                  <td>
                    {reg.paymentReceiptUrl ? (
                      <ReceiptThumb url={reg.paymentReceiptUrl} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span
                      className={`admin-status-badge admin-status-${reg.status?.toLowerCase()}`}
                    >
                      {STATUS_LABEL[reg.status] || reg.status}
                    </span>
                  </td>
                  <td>
                    {reg.status === "PENDING" ? (
                      <div className="admin-row-actions">
                        <button
                          className="admin-icon-btn admin-icon-btn--approve"
                          onClick={() => handleApprove(reg.id)}
                          disabled={actioningId === reg.id}
                          title="Approve"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          className="admin-icon-btn admin-icon-btn--reject"
                          onClick={() => openRejectModal(reg)}
                          disabled={actioningId === reg.id}
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="admin-table-sub">
                        {reg.rejectionReason
                          ? `Reason: ${reg.rejectionReason}`
                          : "—"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rejectTarget && (
        <AdminModal title="Reject registration" onClose={closeRejectModal}>
          <p className="admin-modal-text">
            Rejecting <strong>{rejectTarget.teamName}</strong>. You can add a
            reason for the organizers' records — this is optional.
          </p>
          <textarea
            className="admin-modal-textarea"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Receipt image unreadable, please resubmit."
            rows={4}
            autoFocus
          />
          <div className="admin-modal-actions">
            <button className="btn btn-secondary" onClick={closeRejectModal}>
              Cancel
            </button>
            <button
              className="btn admin-btn-danger"
              onClick={confirmReject}
              disabled={actioningId === rejectTarget.id}
            >
              {actioningId === rejectTarget.id
                ? "Rejecting…"
                : "Reject registration"}
            </button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
