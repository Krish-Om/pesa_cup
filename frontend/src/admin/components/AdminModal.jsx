import { X } from "lucide-react";
import "../css/Admin.css";

export default function AdminModal({ title, onClose, children }) {
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>{title}</h2>
          <button
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}
