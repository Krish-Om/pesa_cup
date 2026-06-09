
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
// import Hero from './components/Hero';
// import StandingsSection from './components/Standings';
// import ScorersPage from './pages/ScorersPage';
// import Sponsors from './components/Sponsors';
// import { Contact } from 'lucide-react';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}