import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, UploadCloud, X } from "lucide-react";
import { submitRegistration, uploadPaymentReceipt } from "../data/apis/api.registrations";
import "./Pages.css";
import "../css/Registration.css";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const initialForm = {
  tournamentId: 1,
  teamName: "",
  captainName: "",
  captainEmail: "",
  captainPhone: "",
  playerCount: "",
  batchYear: "",
  transactionCode: "",
};

const initialReceipt = {
  file: null,
  previewUrl: null,
  uploadedUrl: null,
  uploading: false,
  error: "",
};

export default function Registration() {
  const [form, setForm] = useState(initialForm);
  const [receipt, setReceipt] = useState(initialReceipt);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const fileInputRef = useRef(null);

  // ── form field handler ──────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── receipt upload ──────────────────────────────────────────────────
  const processFile = async (file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setReceipt((prev) => ({
        ...prev,
        error: "Only PNG, JPG, and WebP images are accepted.",
      }));
      return;
    }
    if (file.size > MAX_BYTES) {
      setReceipt((prev) => ({ ...prev, error: "File must be under 5 MB." }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setReceipt({ file, previewUrl, uploadedUrl: null, uploading: true, error: "" });

    try {
      const { url } = await uploadPaymentReceipt(file);
      setReceipt((prev) => ({ ...prev, uploadedUrl: url, uploading: false }));
    } catch (err) {
      URL.revokeObjectURL(previewUrl);
      setReceipt({
        ...initialReceipt,
        error: err.message || "Upload failed. Please try again.",
      });
    }
  };

  const handleFileInputChange = (e) => processFile(e.target.files?.[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleDropzoneClick = () => fileInputRef.current?.click();
  const handleDropzoneKey = (e) => {
    if (e.key === "Enter" || e.key === " ") handleDropzoneClick();
  };

  const handleRemoveReceipt = (e) => {
    e.stopPropagation();
    if (receipt.previewUrl) URL.revokeObjectURL(receipt.previewUrl);
    setReceipt(initialReceipt);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── form submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!receipt.uploadedUrl) {
      setFormError("Please upload your payment receipt screenshot before submitting.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...form,
      tournamentId: Number(form.tournamentId),
      playerCount: Number(form.playerCount),
      paymentReceiptUrl: receipt.uploadedUrl,
      transactionCode: form.transactionCode.trim() || null,
    };

    try {
      await submitRegistration(payload);
      setSubmittedData({
        teamName: form.teamName,
        captainName: form.captainName,
        batchYear: form.batchYear,
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(err.message || "Unable to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Confirmation view ───────────────────────────────────────────────
  if (submitted && submittedData) {
    return (
      <main className="page-content">
        <div className="page-header">
          <h1>Register Your Team</h1>
          <p>Pay via QR code, then submit your receipt to complete registration.</p>
        </div>
        <div className="container">
          <div className="success-view" role="region" aria-live="polite">
            <div className="success-icon" aria-hidden="true">
              <CheckCircle2 size={64} strokeWidth={1.5} />
            </div>

            <h2 className="success-headline">Registration Submitted Successfully!</h2>

            <div className="success-details">
              <div className="success-detail-row">
                <span className="success-detail-label">Team</span>
                <span className="success-detail-value">{submittedData.teamName}</span>
              </div>
              <div className="success-detail-row">
                <span className="success-detail-label">Captain</span>
                <span className="success-detail-value">{submittedData.captainName}</span>
              </div>
              <div className="success-detail-row">
                <span className="success-detail-label">Batch Year</span>
                <span className="success-detail-value">{submittedData.batchYear}</span>
              </div>
            </div>

            <div className="success-badge" role="status">
              <span className="success-badge-dot" aria-hidden="true" />
              PENDING APPROVAL
            </div>

            <p className="success-message-text">
              Your payment receipt is under review by the tournament organizers.
              You will receive an email once your team is officially verified.
            </p>

            <div className="success-actions">
              <Link to="/" className="btn btn-primary">Back to Home</Link>
              <Link to="/fixtures" className="btn btn-secondary">View Fixtures</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Registration form ───────────────────────────────────────────────
  const dropzoneClass = [
    "dropzone",
    isDragOver ? "dropzone--active" : "",
    receipt.uploading ? "dropzone--uploading" : "",
    receipt.previewUrl ? "dropzone--filled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="page-content">
      <div className="page-header">
        <h1>Register Your Team</h1>
        <p>Pay via QR code, then upload your receipt to complete registration.</p>
      </div>

      <div className="container registration-layout">
        {/* ── Left: intro ── */}
        <section className="registration-intro">
          <span className="registration-kicker">PESA CUP 2083</span>
          <h2>Secure your place on the court.</h2>
          <p>
            Scan one of the QR codes to pay the registration fee, screenshot
            your confirmation, and upload it directly below. Your team will be
            reviewed and activated by the organizers.
          </p>
          <Link to="/contact" className="registration-help">
            Need help? Contact the organizers.
          </Link>
        </section>

        {/* ── Right: form ── */}
        <form className="registration-form" onSubmit={handleSubmit} noValidate>

          {/* Step 1: Team details */}
          <div className="registration-form-heading">
            <div>
              <span className="registration-kicker">STEP 1 — TEAM DETAILS</span>
              <h2>Registration details</h2>
            </div>
            <span className="registration-step">01 / 02</span>
          </div>

          <div className="registration-fields">
            <div className="form-group registration-field-wide">
              <label htmlFor="teamName">Team name</label>
              <input
                id="teamName" name="teamName"
                value={form.teamName} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label htmlFor="captainName">Captain name</label>
              <input
                id="captainName" name="captainName"
                value={form.captainName} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label htmlFor="captainPhone">Captain phone</label>
              <input
                id="captainPhone" name="captainPhone" type="tel"
                value={form.captainPhone} onChange={handleChange}
                required minLength="10"
              />
            </div>
            <div className="form-group registration-field-wide">
              <label htmlFor="captainEmail">Captain email</label>
              <input
                id="captainEmail" name="captainEmail" type="email"
                value={form.captainEmail} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label htmlFor="playerCount">Number of players</label>
              <input
                id="playerCount" name="playerCount" type="number" min="1"
                value={form.playerCount} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label htmlFor="batchYear">Alumni batch year</label>
              <input
                id="batchYear" name="batchYear" placeholder="e.g. 2021"
                value={form.batchYear} onChange={handleChange} required
              />
            </div>
          </div>

          {/* Step 2: Payment */}
          <div className="registration-form-heading" style={{ marginTop: "2rem" }}>
            <div>
              <span className="registration-kicker">STEP 2 — PAYMENT</span>
              <h2>Pay &amp; upload receipt</h2>
            </div>
            <span className="registration-step">02 / 02</span>
          </div>

          {/* QR codes */}
          <div className="qr-section">
            <p className="qr-instruction">
              Scan either QR code to complete payment, then screenshot your
              confirmation and upload it below.
            </p>
            <div className="qr-grid">
              <div className="qr-card">
                <div className="qr-placeholder">
                  {/* Replace with: <img src="/qr/esewa-qr.png" alt="eSewa QR code" /> */}
                  <span>eSewa QR</span>
                </div>
                <span className="qr-label">eSewa</span>
              </div>
              <div className="qr-card">
                <div className="qr-placeholder">
                  {/* Replace with: <img src="/qr/fonepay-qr.png" alt="Fonepay QR code" /> */}
                  <span>Fonepay QR</span>
                </div>
                <span className="qr-label">Fonepay</span>
              </div>
            </div>
          </div>

          {/* Dropzone */}
          <div className="form-group" style={{ marginTop: "1.25rem" }}>
            <label>
              Payment receipt screenshot{" "}
              <span className="field-required">*</span>
            </label>

            {/* The outer div is the interactive dropzone only when no file is selected */}
            <div
              className={dropzoneClass}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={!receipt.previewUrl && !receipt.uploading ? handleDropzoneClick : undefined}
              role={!receipt.previewUrl && !receipt.uploading ? "button" : undefined}
              tabIndex={!receipt.previewUrl && !receipt.uploading ? 0 : undefined}
              onKeyDown={!receipt.previewUrl && !receipt.uploading ? handleDropzoneKey : undefined}
              aria-label="Upload payment receipt"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleFileInputChange}
                className="dropzone-input"
                aria-hidden="true"
                tabIndex={-1}
              />

              {receipt.uploading ? (
                <div className="dropzone-content">
                  <div className="upload-spinner" role="status" aria-label="Uploading receipt" />
                  <span className="dropzone-label">Uploading...</span>
                </div>
              ) : receipt.previewUrl ? (
                <div className="receipt-preview">
                  <img
                    src={receipt.previewUrl}
                    alt="Payment receipt preview"
                    className="receipt-thumb"
                  />
                  <div className="receipt-preview-info">
                    <span className="receipt-preview-name">{receipt.file?.name}</span>
                    {receipt.uploadedUrl ? (
                      <span className="receipt-upload-ok">✓ Uploaded successfully</span>
                    ) : (
                      <span className="receipt-upload-error">Upload pending…</span>
                    )}
                    <button
                      type="button"
                      className="receipt-preview-remove"
                      onClick={handleRemoveReceipt}
                      aria-label="Remove receipt and upload a different file"
                    >
                      <X size={13} strokeWidth={2.5} />
                      Remove / Replace
                    </button>
                  </div>
                </div>
              ) : (
                <div className="dropzone-content">
                  <UploadCloud size={32} strokeWidth={1.5} className="dropzone-icon" />
                  <span className="dropzone-label">Drop your screenshot here</span>
                  <span className="dropzone-hint">or click to browse</span>
                  <span className="dropzone-hint">PNG, JPG, WEBP — max 5 MB</span>
                </div>
              )}
            </div>

            {receipt.error && (
              <p className="form-error receipt-error" role="alert">
                {receipt.error}
              </p>
            )}
          </div>

          {/* Optional transaction code */}
          <div className="form-group">
            <label htmlFor="transactionCode">
              Transaction ID{" "}
              <span className="field-optional">(optional)</span>
            </label>
            <input
              id="transactionCode" name="transactionCode"
              placeholder="e.g. ABC123XYZ"
              value={form.transactionCode}
              onChange={handleChange}
            />
            <span className="field-hint">
              Copy the transaction reference from your payment app.
            </span>
          </div>

          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary registration-submit"
            disabled={isSubmitting || receipt.uploading}
          >
            {isSubmitting ? "Submitting…" : "Submit Registration"}
          </button>

          <p className="registration-note">
            Your registration will be reviewed by the organizers after payment is verified.
          </p>
        </form>
      </div>
    </main>
  );
}
