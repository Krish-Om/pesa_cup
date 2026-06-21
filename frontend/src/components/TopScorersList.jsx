import { useEffect, useMemo, useState } from "react";
import { ScorersAPI } from "../data/apis/api.scorers";
import "../css/TopScorersList.css";

const defaultScorers = [
  { rank: 1, name: "Ram Bahadur", team: "Team Alpha", goals: 8, assists: 3, avatar: "RB" },
  { rank: 2, name: "Hari Prasad", team: "Team Beta", goals: 6, assists: 5, avatar: "HP" },
  { rank: 3, name: "Sita Karki", team: "Team Gamma", goals: 5, assists: 2, avatar: "SK" },
  { rank: 4, name: "Bikash Thapa", team: "Team Delta", goals: 3, assists: 4, avatar: "BT" },
  { rank: 5, name: "Anish Gurung", team: "Team Alpha", goals: 2, assists: 6, avatar: "AG" },
];

export default function TopScorersList({ scorers: providedScorers }) {
  const [scorers, setScorers] = useState(
    Array.isArray(providedScorers) && providedScorers.length > 0
      ? providedScorers
      : defaultScorers
  );
  const [loading, setLoading] = useState(
    !Array.isArray(providedScorers) || providedScorers.length === 0
  );
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (Array.isArray(providedScorers) && providedScorers.length > 0) {
      setScorers(providedScorers);
      setLoading(false);
      setError("");
      return () => {
        isMounted = false;
      };
    }

    const loadScorers = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await ScorersAPI.getAllScorers();
        if (isMounted) {
          setScorers(Array.isArray(data) && data.length > 0 ? data : defaultScorers);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError("Unable to load scorers from the backend.");
          setScorers(defaultScorers);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadScorers();

    return () => {
      isMounted = false;
    };
  }, [providedScorers]);

  const activeScorers = useMemo(
    () => [...scorers].sort((a, b) => (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER) || b.goals - a.goals),
    [scorers]
  );
  const maxGoals = activeScorers[0]?.goals ?? 0;

  if (loading) {
    return (
      <section className="scorers-section">
        <h2 className="scorers-heading">Top Scorers</h2>
        <p>Loading scorers from the backend...</p>
      </section>
    );
  }

  if (error && activeScorers.length === 0) {
    return (
      <section className="scorers-section">
        <h2 className="scorers-heading">Top Scorers</h2>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="scorers-section">
      <h2 className="scorers-heading">Top Scorers</h2>
      <div className="scorers-grid">
        {activeScorers.map((s, i) => (
          <div className={`scorer-card ${i === 0 ? "first-place" : ""}`} key={s.id ?? s.rank ?? s.name}>

            <span className={`scorer-rank ${i < 3 ? "top" : ""}`}>
              #{s.rank ?? i + 1}
            </span>

            <div className={`scorer-avatar ${i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : ""}`}>
              {s.avatar ?? s.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
            </div>

            <div className="scorer-info">
              <p className="scorer-name">{s.name}</p>
              <p className="scorer-team">{s.team}</p>

              <div className="goal-bar-track">
                <div
                  className="goal-bar-fill"
                  style={{ width: `${maxGoals ? Math.round((s.goals / maxGoals) * 100) : 0}%` }}
                />
              </div>

              <div className="scorer-stats">
                <span className="scorer-stat">⚽ <strong>{s.goals}</strong> goals</span>
                <span className="scorer-stat">🎯 <strong>{s.assists}</strong> assists</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}