import { Award, ChevronLeft, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/TournamentDetail.css";
import { TournamentsAPI } from "../data/apis/api.tournaments";

// Returns a CSS class based on how close/past the registration deadline is.
// - "text-red": deadline has already passed
// - "text-amber": deadline is within the next 3 days
// - "": otherwise, render normally
function getDeadlineClass(deadline) {
  if (!deadline) return "";
  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate)) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = (deadlineDate - today) / msPerDay;

  if (daysLeft < 0) return "text-red";
  if (daysLeft <= 3) return "text-amber";
  return "";
}

export default function TournamentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TournamentsAPI.getTournamentById(id)
      .then((res) => {
        setTournament(res?.data || res);
      })
      .catch((err) => console.error("Error fetching tournament details:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="detail-loading-state">Loading tournament details...</div>
    );
  }

  if (!tournament) {
    return (
      <div className="detail-not-found-state">
        <p>Tournament not found.</p>
        <button
          onClick={() => navigate("/tournaments")}
          className="btn-gold-primary"
        >
          Back to Tournaments
        </button>
      </div>
    );
  }

  return (
    <div className="tournament-detail-page">
      <div className="detail-container">
        {/* Back Button */}
        <button
          onClick={() => navigate("/tournaments")}
          className="btn-back-link"
        >
          <ChevronLeft size={16} /> Back to Tournaments
        </button>

        {/* Hero Banner */}
        <div className="detail-hero-banner">
          {tournament.bannerUrl && (
            <img
              src={tournament.bannerUrl}
              alt={tournament.name}
              className="detail-hero-img"
            />
          )}
          <div className="detail-hero-overlay">
            <span
              className={`badge-status ${
                tournament.status?.toLowerCase() || "upcoming"
              }`}
            >
              {tournament.status || "Upcoming"}
            </span>
            <h1 className="detail-title">{tournament.name}</h1>
            <p className="detail-organizer">
              Organized by {tournament.organizer || "Sports Committee"}
            </p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="detail-grid-layout">
          {/* Main Content (Left) */}
          <div className="detail-main-content">
            {/* About */}
            <div className="detail-card">
              <h2 className="detail-card-title">About the Tournament</h2>
              <p className="detail-card-text">
                {tournament.description || "No description provided."}
              </p>
            </div>

            {/* Prizes */}
            <div className="detail-card">
              <h2 className="detail-card-title flex-title">
                <Award size={20} className="icon-gold" /> Prizes & Awards
              </h2>
              <div className="prize-boxes-grid">
                <div className="prize-box prize-1st">
                  <span className="prize-rank">🥇 1st Prize</span>
                  <p className="prize-amount">
                    {tournament.firstPrize || "N/A"}
                  </p>
                </div>
                <div className="prize-box prize-2nd">
                  <span className="prize-rank">🥈 2nd Prize</span>
                  <p className="prize-amount">
                    {tournament.secondPrize || "N/A"}
                  </p>
                </div>
                <div className="prize-box prize-3rd">
                  <span className="prize-rank">🥉 3rd Prize</span>
                  <p className="prize-amount">
                    {tournament.thirdPrize || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="detail-card">
              <h2 className="detail-card-title flex-title">
                <ShieldCheck size={20} className="icon-gold" /> Rules &
                Guidelines
              </h2>
              <div className="detail-card-text rules-text">
                {tournament.rules || "Standard tournament rules apply."}
              </div>
            </div>
          </div>

          {/* Sidebar Summary (Right) */}
          <div className="detail-sidebar">
            <div className="detail-card sidebar-card">
              <h3 className="detail-sidebar-title">Tournament Summary</h3>

              <div className="summary-list">
                <div className="summary-row">
                  <span className="summary-label">Entry Fee</span>
                  <span className="summary-val font-gold">
                    {tournament.entryFee
                      ? `NRs. ${tournament.entryFee}`
                      : "Free"}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Location</span>
                  <span className="summary-val">
                    {tournament.location || "TBD"}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Start Date</span>
                  <span className="summary-val">
                    {tournament.startDate || "TBD"}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Deadline</span>
                  <span
                    className={`summary-val ${getDeadlineClass(
                      tournament.registrationDeadline,
                    )}`}
                  >
                    {tournament.registrationDeadline || "N/A"}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(`/register?tournamentId=${tournament.id}`)
                }
                className="btn-register-action"
              >
                Register Team Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
