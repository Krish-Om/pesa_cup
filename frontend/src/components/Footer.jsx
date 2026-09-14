import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../css/Footer.css";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* About section */}
            <div className="footer-section">
              <h3 className="footer-title">PESA</h3>
              <p className="footer-text">
                Prabhat English Secondary School (PESA CUP) organized by 2076
                Batch.
              </p>
              <div className="footer-social">
                <a
                  href="https://www.facebook.com/groups/139214785116"
                  className="social-link"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={20} />
                </a>
              </div>
            </div>

            {/* Contact section */}
            <div className="footer-section">
              <h3 className="footer-title">Contact</h3>
              <ul className="footer-links">
                <li>
                  <MapPin size={18} />
                  <span>
                    Unique Shilpakar
                    <br />
                    Bhaktapur, Byasi-2, Nepal
                  </span>
                </li>
                <li>
                  <Phone size={18} />
                  <span>+977 - 9761626772</span>
                </li>
                <li>
                  <Mail size={18} />
                  <span>uniqueshilpakar17@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links footer-links-grid">
                <li>
                  <Link to="/" onClick={scrollToTop}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/fixtures">Fixtures</Link>
                </li>
                <li>
                  <Link to="/standings">Standings</Link>
                </li>
                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>
                <li>
                  <Link to="/sponsors">Sponsors</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </ul>
            </div>

            {/* Social Media Links */}
            <div className="footer-section">
              <h3 className="footer-title">Social Media Links</h3>
              <p className="footer-text">
                Follow us on social media for live updates and tournament news.
              </p>
              <div className="footer-social-links">
                <a
                  href="https://www.facebook.com/groups/139214785116"
                  className="social-badge"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
                <a href="#" className="social-badge">
                  Messenger
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p className="copyright">
              &copy; 2026 Prabhat English Secondary School. All rights reserved.
            </p>
            <div className="footer-links-bottom">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
