import TopScorersList from "../components/TopScorersList";
import "./Pages.css";

export default function ScorersPage() {
  return (
    <main className="page-content">
      <div className="page-header">
        <div className="container">
          <h1>Golden Boot Race</h1>
          <p>Rankings based on goals scored. Assists used as tiebreaker.</p>
        </div>
      </div>

      <TopScorersList />
    </main>
  );
}
