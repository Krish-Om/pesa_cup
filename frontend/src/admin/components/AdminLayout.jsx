import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, ClipboardList, CalendarDays, Trophy, Target, Image, Mail, Flag } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../css/Admin.css";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/registrations", label: "Registrations", icon: ClipboardList },
  { to: "/admin/fixtures", label: "Fixtures", icon: CalendarDays },
  { to: "/admin/standings", label: "Standings", icon: Trophy },
  { to: "/admin/scorers", label: "Scorers", icon: Target },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/tournaments", label: "Tournaments", icon: Flag },
  { to: "/admin/contacts", label: "Contacts", icon: Mail },
];

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-brand-main">PESA CUP</span>
          <span className="admin-sidebar-brand-sub">Admin</span>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? " active" : ""}`
              }
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} strokeWidth={2} />
          <span>Log out</span>
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
