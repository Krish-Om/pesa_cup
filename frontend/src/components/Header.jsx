import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="header-container container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img
              src="/src/assets/pesalogo.png"
              alt="Pesa Logo"
              className="pesa-logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <img
              src="/src/assets/prabhat.png"
              alt="Prabhat Logo"
              className="prabhat-logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Link>

          <nav className={`nav ${isMenuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-link">
              HOME
            </Link>
            <Link to="/fixtures" className="nav-link">
              FIXTURES
            </Link>
            <Link to="/standings" className="nav-link">
              STANDINGS
            </Link>
            <Link to="/gallery" className="nav-link">
              GALLERY
            </Link>
            <Link to="/tournaments" className="nav-link">
              TOURNAMENTS
            </Link>
            <Link to="/sponsors" className="nav-link">
              SPONSORS
            </Link>
            <Link to="/contact" className="nav-link">
              CONTACT
            </Link>
            <Link to="/register" className="nav-link">
              REGISTER
            </Link>
          </nav>

          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
