import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";

import Fixtures from "./components/Fixtures";
import Gallery from "./components/Gallery";
import StandingsSection from "./components/Standings";
import Contact from "./pages/Contact";
import GalleryPages from "./pages/GalleryPages";
import Home from "./pages/Home";
import Registration from "./pages/Registration";

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

// Renders the public Header on every route except /admin/*
function PublicHeader() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return isAdminRoute ? null : <Header />;
}

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <PublicHeader />
        <Routes>
          {/* ── Public site ── */}
          <Route path="/" element={<Home />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/standings" element={<StandingsSection />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:categoryId" element={<GalleryPages />} />
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
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
