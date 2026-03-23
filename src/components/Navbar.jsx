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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const isActive = (to) => location.pathname === to;

  const isDropdownActive = (children) =>
    children.some((child) => location.pathname === child.to);

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" style={{ color: "#F5A623" }} />
            <span
              className="text-lg font-bold"
              style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
            >
              My Spark SGO
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  ref={(el) => (dropdownRefs.current[link.label] = el)}
                >
                  <button
                    onClick={() => toggleDropdown(link.label)}
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
                      isDropdownActive(link.children)
                        ? "border-b-2 text-[#0F2D5E]"
                        : "text-gray-600"
                    }`}
                    style={
                      isDropdownActive(link.children)
                        ? { borderBottomColor: "#0F2D5E" }
                        : {}
                    }
                  >
                    {link.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute left-0 top-full mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                      {link.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className={`block px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                            isActive(child.to)
                              ? "font-semibold text-[#0F2D5E]"
                              : "text-gray-700"
                          }`}
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
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
                    isActive(link.to)
                      ? "border-b-2 text-[#0F2D5E]"
                      : "text-gray-600"
                  }`}
                  style={
                    isActive(link.to)
                      ? { borderBottomColor: "#0F2D5E" }
                      : {}
                  }
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right: Get Started + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/apply/family"
              className="hidden rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-90 md:inline-block"
              style={{
                backgroundColor: "#F5A623",
                color: "#0F2D5E",
              }}
            >
              Get Started
            </Link>
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => toggleDropdown(link.label)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
                      isDropdownActive(link.children)
                        ? "text-[#0F2D5E]"
                        : "text-gray-600"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === link.label && (
                    <div className="ml-4 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                            isActive(child.to)
                              ? "font-semibold text-[#0F2D5E]"
                              : "text-gray-600"
                          }`}
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
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
                    isActive(link.to) ? "text-[#0F2D5E]" : "text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              to="/apply/family"
              className="mt-2 block rounded-full px-5 py-2 text-center text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#F5A623",
                color: "#0F2D5E",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
