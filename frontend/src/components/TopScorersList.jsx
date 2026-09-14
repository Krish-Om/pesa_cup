import { useEffect, useMemo, useState } from "react";
import "../css/TopScorersList.css";
import { ScorersAPI } from "../data/apis/api.scorers";
import { TournamentsAPI } from "../data/apis/api.tournaments";
import API_BASE_URL from "../data/apis/config";

const UPLOADS_ORIGIN = API_BASE_URL.replace(/\/api\/v1$/, "");
const resolveAvatarSrc = (avatar) => {
  if (!avatar) return null;
  if (/^https?:\/\//.test(avatar)) return avatar;
  if (avatar.startsWith("/")) return `${UPLOADS_ORIGIN}${avatar}`;
  return null;
};

function pickDefaultTournamentId(tournaments) {
  if (!tournaments || tournaments.length === 0) return null;

  const ongoing = tournaments.filter((t) => t.status === "ONGOING");
  if (ongoing.length > 0) return ongoing[0].id;

  const upcoming = tournaments
    .filter((t) => t.status === "UPCOMING")
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  if (upcoming.length > 0) return upcoming[0].id;

  const completed = tournaments
    .filter((t) => t.status === "COMPLETED")
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
  if (completed.length > 0) return completed[0].id;

  return tournaments[0].id;
}

const MAX_DISPLAYED_SCORERS = 5;

export default function TopScorersList({ scorers: providedScorers }) {
  const usingProvidedScorers = Array.isArray(providedScorers);

  const [scorers, setScorers] = useState(
    usingProvidedScorers ? providedScorers : [],
  );
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [loading, setLoading] = useState(!usingProvidedScorers);

  useEffect(() => {
    if (usingProvidedScorers) {
      setScorers(providedScorers);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const [scorersData, tournamentsData] = await Promise.all([
          ScorersAPI.getAllScorers(),
          TournamentsAPI.getAllTournaments(),
        ]);

        if (!isMounted) return;

        const scorersList = Array.isArray(scorersData) ? scorersData : [];
        const tournamentsList = Array.isArray(tournamentsData)
          ? tournamentsData
          : [];

        setScorers(scorersList);
        setTournaments(tournamentsList);
        setSelectedTournamentId(pickDefaultTournamentId(tournamentsList));
      } catch (fetchError) {
        console.error("Error loading scorers/tournaments:", fetchError);
        if (isMounted) {
          setScorers([]);
          setTournaments([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const scopedScorers = useMemo(() => {
    if (usingProvidedScorers || selectedTournamentId === null) return scorers;
    return scorers.filter((s) => s.tournamentId === selectedTournamentId);
  }, [scorers, selectedTournamentId, usingProvidedScorers]);

  const activeScorers = useMemo(
    () =>
      [...scopedScorers].sort(
        (a, b) => b.goals - a.goals || b.assists - a.assists,
      ),
    [scopedScorers],
  );
  const maxGoals = activeScorers[0]?.goals ?? 0;
  const displayedScorers = activeScorers.slice(0, MAX_DISPLAYED_SCORERS);

  const selectedTournament = tournaments.find(
    (t) => t.id === selectedTournamentId,
  );

  if (loading) {
    return (
      <section className="scorers-section">
        <div className="container">
          <h2 className="section-title">Top Scorers</h2>
          <p className="scorers-empty-state">
            Loading scorers from the backend...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="scorers-section">
      <div className="container">
        <h2 className="section-title">Top Scorers</h2>

        {!usingProvidedScorers && tournaments.length > 0 && (
          <div className="scorers-filters">
            <div className="scorers-filter-group">
              <label htmlFor="scorers-tournament-select">TOURNAMENT:</label>
              <select
                id="scorers-tournament-select"
                className="scorers-filter-select"
                value={selectedTournamentId ?? ""}
                onChange={(e) =>
                  setSelectedTournamentId(Number(e.target.value))
                }
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.status === "ONGOING" ? "(Ongoing)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {activeScorers.length === 0 ? (
          <p className="scorers-empty-state">
            No scorers yet
            {selectedTournament ? ` for ${selectedTournament.name}` : ""} —
            check back once the tournament gets underway.
          </p>
        ) : (
          <div className="scorers-grid">
            {displayedScorers.map((s, i) => (
              <div
                className={`scorer-card ${i === 0 ? "first-place" : ""}`}
                key={s.id ?? s.playerName}
              >
                <span className={`scorer-rank ${i < 3 ? "top" : ""}`}>
                  #{i + 1}
                </span>

                <div
                  className={`scorer-avatar ${i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : ""}`}
                >
                  {resolveAvatarSrc(s.avatar) ? (
                    <img
                      src={resolveAvatarSrc(s.avatar)}
                      alt={s.playerName}
                      className="scorer-avatar-img"
                    />
                  ) : (
                    s.playerName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  )}
                </div>

                <div className="scorer-info">
                  <p className="scorer-name">{s.playerName}</p>
                  <p className="scorer-team">{s.teamName}</p>

                  <div className="goal-bar-track">
                    <div
                      className="goal-bar-fill"
                      style={{
                        width: `${maxGoals ? Math.round((s.goals / maxGoals) * 100) : 0}%`,
                      }}
                    />
                  </div>

                  <div className="scorer-stats">
                    <span className="scorer-stat">
                      ⚽ <strong>{s.goals}</strong> goals
                    </span>
                    <span className="scorer-stat">
                      🎯 <strong>{s.assists}</strong> assists
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
