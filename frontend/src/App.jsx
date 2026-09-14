import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollMemory from "./components/ScrollMemory";

import Fixtures from "./components/Fixtures";
import Gallery from "./components/Gallery";
import Sponsors from "./components/Sponsors";
import StandingsSection from "./components/Standings";
import Contact from "./pages/Contact";
import GalleryPages from "./pages/GalleryPages";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import TournamentDetail from "./pages/TournamentDetail"; // 👈 Added
import Tournaments from "./pages/Tournaments"; // 👈 Added

// Admin part
import AdminLayout from "./admin/components/AdminLayout";
import RequireAdmin from "./admin/components/RequireAdmin";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import ContactsAdmin from "./admin/pages/ContactsAdmin";
import Dashboard from "./admin/pages/Dashboard";
import FixturesAdmin from "./admin/pages/FixturesAdmin";
import GalleryAdmin from "./admin/pages/GalleryAdmin";
import AdminLogin from "./admin/pages/Login";
import RegistrationsAdmin from "./admin/pages/RegistrationsAdmin";
import ScorersAdmin from "./admin/pages/ScorersAdmin";
import StandingsAdmin from "./admin/pages/StandingsAdmin";
import TournamentsAdmin from "./admin/pages/TournamentsAdmin";

function PublicHeader() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return isAdminRoute ? null : <Header />;
}

function HomeFooter() {
  const location = useLocation();
  return location.pathname === "/" ? <Footer /> : null;
}

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <ScrollMemory />
        <PublicHeader />
        <Routes>
          {/* ── Public site ── */}
          <Route path="/" element={<Home />} />
          <Route path="/tournaments" element={<Tournaments />} />{" "}
          {/* 👈 Added */}
          <Route path="/tournaments/:id" element={<TournamentDetail />} />{" "}
          {/* 👈 Added */}
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/standings" element={<StandingsSection />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:categoryId" element={<GalleryPages />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Registration />} />
          {/* ── Admin ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="registrations" element={<RegistrationsAdmin />} />
            <Route path="fixtures" element={<FixturesAdmin />} />
            <Route path="standings" element={<StandingsAdmin />} />
            <Route path="scorers" element={<ScorersAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="tournaments" element={<TournamentsAdmin />} />
            <Route path="contacts" element={<ContactsAdmin />} />
          </Route>
        </Routes>
        <HomeFooter />
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
