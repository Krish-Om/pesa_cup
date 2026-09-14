import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/TournamentsSection.css";
import { TournamentsAPI } from "../data/apis/api.tournaments";

export default function TournamentsSection({ isHomePage = false }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    TournamentsAPI.getAllTournaments()
      .then((res) => {
        const data = Array.isArray(res) ? res : res?.data || [];
        setTournaments(isHomePage ? data.slice(0, 3) : data);
      })
      .catch((err) => console.error("Error fetching tournaments:", err))
      .finally(() => setLoading(false));
  }, [isHomePage]);

  return (
    <section className="ts-wrapper">
      <div className="ts-container">
        {/* Header */}
        <div className="ts-header">
          <h2 className="ts-title">TOURNAMENTS</h2>
          <div className="ts-gold-line"></div>
          <p className="ts-subtitle">
            Explore upcoming competitions and register your team.
          </p>
        </div>

        {loading ? (
          <div className="ts-status">Loading tournaments...</div>
        ) : tournaments.length === 0 ? (
          <div className="ts-status">No tournaments found.</div>
        ) : (
          <div className="ts-grid">
            {tournaments.map((t) => (
              <div key={t.id} className="ts-card">
                <div className="ts-card-body">
                  <div className="ts-top-bar">
                    <span className="ts-badge">{t.status || "UPCOMING"}</span>
                    <span className="ts-fee">
                      {t.entryFee ? `NRs. ${t.entryFee}` : "Free"}
                    </span>
                  </div>

                  <h3 className="ts-card-title">{t.name}</h3>
                  <p className="ts-organizer">
                    Organized by {t.organizer || "Sports Committee"}
                  </p>

                  <div className="ts-info-list">
                    <div className="ts-info-row">
                      <span className="ts-icon">📍</span> {t.location || "TBD"}
                    </div>
                    <div className="ts-info-row">
                      <span className="ts-icon">📅</span> {t.startDate || "TBD"}
                      {t.endDate ? ` - ${t.endDate}` : ""}
                    </div>
                  </div>
                </div>

                <div className="ts-btn-group">
                  <button
                    onClick={() => navigate(`/tournaments/${t.id}`)}
                    className="ts-btn-details"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/register?tournamentId=${t.id}`)}
                    className="ts-btn-register"
                  >
                    Register Team &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isHomePage && (
          <div className="ts-view-all-box">
            <Link to="/tournaments" className="ts-view-all-link">
              View All Tournaments &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
