import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  {
    label: "Apply",
    children: [
      { label: "Families", to: "/apply/family" },
      { label: "Providers", to: "/apply/provider" },
    ],
  },
  {
    label: "My Dashboard",
    children: [
      { label: "Family Dashboard", to: "/dashboard/family" },
      { label: "Provider Dashboard", to: "/dashboard/provider" },
    ],
  },
  { label: "Support", to: "/support" },
  { label: "Admin", to: "/admin" },
];

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        openDropdown !== null &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const isActive = (to) => location.pathname === to;
  const isDropdownActive = (children) =>
    children.some((child) => location.pathname === child.to);
  const toggleDropdown = (label) =>
    setOpenDropdown((prev) => (prev === label ? null : label));

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <Sparkles style={{ width: 24, height: 24, color: "#F5A623" }} />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#0F2D5E",
              }}
            >
              My Spark SGO
            </span>
          </Link>

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            className="hidden md:flex"
          >
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  ref={(el) => (dropdownRefs.current[link.label] = el)}
                >
                  <button
                    onClick={() => toggleDropdown(link.label)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "8px 12px",
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 500,
                      color: isDropdownActive(link.children)
                        ? "#0F2D5E"
                        : "#4b5563",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      borderBottom: isDropdownActive(link.children)
                        ? "2px solid #0F2D5E"
                        : "2px solid transparent",
                    }}
                  >
                    {link.label}
                    <ChevronDown style={{ width: 16, height: 16 }} />
                  </button>
                  {openDropdown === link.label && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "100%",
                        marginTop: 4,
                        width: 200,
                        borderRadius: 8,
                        backgroundColor: "#ffffff",
                        boxShadow:
                          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                        border: "1px solid #e5e7eb",
                        padding: "4px 0",
                        zIndex: 100,
                      }}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          style={{
                            display: "block",
                            padding: "10px 16px",
                            fontSize: 14,
                            color: isActive(child.to) ? "#0F2D5E" : "#374151",
                            fontWeight: isActive(child.to) ? 600 : 400,
                            textDecoration: "none",
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 500,
                    color: isActive(link.to) ? "#0F2D5E" : "#4b5563",
                    textDecoration: "none",
                    borderBottom: isActive(link.to)
                      ? "2px solid #0F2D5E"
                      : "2px solid transparent",
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              to="/apply/family"
              className="hidden md:inline-block"
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                backgroundColor: "#F5A623",
                color: "#0F2D5E",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Get Started
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#374151",
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X style={{ width: 24, height: 24 }} />
              ) : (
                <Menu style={{ width: 24, height: 24 }} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            padding: "8px 16px 16px",
          }}
        >
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  onClick={() => toggleDropdown(link.label)}
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 500,
                    color: isDropdownActive(link.children)
                      ? "#0F2D5E"
                      : "#4b5563",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {link.label}
                  <ChevronDown
                    style={{
                      width: 16,
                      height: 16,
                      transform:
                        openDropdown === link.label
                          ? "rotate(180deg)"
                          : "rotate(0)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
                {openDropdown === link.label && (
                  <div style={{ marginLeft: 16 }}>
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        style={{
                          display: "block",
                          padding: "8px 12px",
                          fontSize: 14,
                          color: isActive(child.to) ? "#0F2D5E" : "#4b5563",
                          fontWeight: isActive(child.to) ? 600 : 400,
                          textDecoration: "none",
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: "block",
                  padding: "10px 12px",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive(link.to) ? "#0F2D5E" : "#4b5563",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            to="/apply/family"
            style={{
              display: "block",
              marginTop: 8,
              padding: "10px 20px",
              borderRadius: 999,
              backgroundColor: "#F5A623",
              color: "#0F2D5E",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
