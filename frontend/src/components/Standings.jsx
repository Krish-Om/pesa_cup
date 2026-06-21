import { useEffect, useMemo, useState } from "react";
import { StandingsAPI } from "../data/apis/api.standings";
import "../css/Standings.css";

const StandingsTable = ({ data }) => (
  <div className="table-wrapper">
    <table className="standings-table">
      <thead>
        <tr>
          <th className="col-pos">Pos</th>
          <th className="col-team">Team</th>
          <th className="col-stat">Played</th>
          <th className="col-stat">Won</th>
          <th className="col-stat">Draw</th>
          <th className="col-stat">Lost</th>
          <th className="col-stat">GF</th>
          <th className="col-stat">GA</th>
          <th className="col-stat">GD</th>
          <th className="col-pts">Pts</th>
        </tr>
      </thead>

      <tbody>
        {data.map((team) => (
          <tr key={team.id ?? team.position ?? team.team}>
            <td className="col-pos">
              <div className="position-badge">
                {team.position}
              </div>
            </td>

            <td className="col-team">{team.team}</td>
            <td className="col-stat">{team.played}</td>
            <td className="col-stat">{team.won}</td>
            <td className="col-stat">{team.draw}</td>
            <td className="col-stat">{team.lost}</td>
            <td className="col-stat">{team.goalFor}</td>
            <td className="col-stat">{team.goalAgainst}</td>

            <td
              className={`col-stat ${
                team.goalDifference > 0
                  ? "positive"
                  : team.goalDifference < 0
                  ? "negative"
                  : ""
              }`}
            >
              {team.goalDifference > 0 ? "+" : ""}
              {team.goalDifference}
            </td>

            <td className="col-pts">
              <span className="points-badge">
                {team.points}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function StandingsSection() {
  const [standings, setStandings] = useState([]);
  const [activeGroup, setActiveGroup] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadStandings = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await StandingsAPI.getAllStandings();
        if (isMounted) {
          setStandings(Array.isArray(data) ? data : []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError("Unable to load standings from the backend.");
          setStandings([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStandings();

    return () => {
      isMounted = false;
    };
  }, []);

  const groups = useMemo(() => {
    const groupedStandings = standings.reduce((accumulator, standing) => {
      const groupId = standing.group || "groupA";
      if (!accumulator[groupId]) {
        accumulator[groupId] = [];
      }
      accumulator[groupId].push(standing);
      return accumulator;
    }, {});

    return Object.entries(groupedStandings)
      .map(([id, data]) => ({
        id,
        label: id.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase(),
        data: [...data].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [standings]);

  useEffect(() => {
    if (groups.length > 0 && !groups.some((group) => group.id === activeGroup)) {
      setActiveGroup(groups[0].id);
    }
  }, [groups, activeGroup]);

  const currentGroup =
    groups.find((g) => g.id === activeGroup) || groups[0];

  return (
    <section className="standings" id="standings">
      <div className="container">
        <h2 className="section-title">Standings</h2>

        {loading ? <p>Loading standings from the backend...</p> : null}
        {!loading && error ? <p>{error}</p> : null}

        {!loading && groups.length > 0 ? (
          <div className="group-tabs">
            {groups.map((group) => (
              <button
                key={group.id}
                className={`group-tab ${
                  activeGroup === group.id ? "active" : ""
                }`}
                onClick={() => setActiveGroup(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="standings-container">
          {!loading && currentGroup ? (
            <>
              <h3 className="group-title">
                {currentGroup.label}
              </h3>

              <StandingsTable data={currentGroup.data} />
            </>
          ) : !loading ? (
            <p>No standings available.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}