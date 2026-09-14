import Standings from "../components/Standings";
import "./Pages.css";

export default function StandingsPage() {
  return (
    <main className="page-content">
      <div className="page-header">
        <div className="container">
          <h1>Tournament Standings</h1>
          <p>Current group standings and team points overview.</p>
        </div>
      </div>

      <Standings />
    </main>
  );
}
