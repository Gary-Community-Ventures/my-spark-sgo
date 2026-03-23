import { Link } from "react-router-dom";
import { Sparkles, Globe, MessageCircle, Heart, Users, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Family Application", to: "/apply/family" },
  { label: "Provider Application", to: "/apply/provider" },
  { label: "Support", to: "/support" },
  { label: "Admin", to: "/admin" },
];

const socialLinks = [
  { Icon: Globe, label: "Website" },
  { Icon: MessageCircle, label: "Twitter" },
  { Icon: Heart, label: "Instagram" },
  { Icon: Users, label: "LinkedIn" },
];

function Footer() {
  return (
    <footer style={{ backgroundColor: "#0F2D5E", color: "#ffffff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 40,
          }}
        >
          {/* Column 1 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles style={{ width: 24, height: 24, color: "#F5A623" }} />
              <span style={{ fontSize: 18, fontWeight: 700 }}>My Spark SGO</span>
            </div>
            <p
              style={{
                marginTop: 16,
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Connecting families to out-of-school opportunities — powered by
              scholarship funding.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {socialLinks.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.6)",
                marginBottom: 16,
              }}
            >
              Quick Links
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {quickLinks.map((link) => (
                <li key={link.to} style={{ marginBottom: 8 }}>
                  <Link
                    to={link.to}
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.6)",
                marginBottom: 16,
              }}
            >
              Contact Info
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <Mail style={{ width: 16, height: 16, flexShrink: 0 }} />
                <a
                  href="mailto:support@mysparkdenver.org"
                  style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
                >
                  support@mysparkdenver.org
                </a>
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <Phone style={{ width: 16, height: 16, flexShrink: 0 }} />
                <a
                  href="tel:720-807-0200"
                  style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
                >
                  720-807-0200
                </a>
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <MapPin style={{ width: 16, height: 16, flexShrink: 0 }} />
                Denver, CO
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>&copy; 2026 My Spark SGO. All rights reserved.</span>
          <div style={{ display: "flex", gap: 16 }}>
            <Link
              to="/privacy"
              style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
