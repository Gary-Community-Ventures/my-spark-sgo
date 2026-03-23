import { Link } from "react-router-dom";
import {
  Sparkles,
  Globe,
  MessageCircle,
  Heart,
  Users,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Family Application", to: "/apply/family" },
  { label: "Provider Application", to: "/apply/provider" },
  { label: "Support", to: "/support" },
  { label: "Admin", to: "/admin" },
];

const socialLinks = [
  { Icon: Globe, label: "Website", href: "#" },
  { Icon: MessageCircle, label: "Twitter", href: "#" },
  { Icon: Heart, label: "Instagram", href: "#" },
  { Icon: Users, label: "LinkedIn", href: "#" },
];

function Footer() {
  return (
    <footer style={{ backgroundColor: "#0F2D5E" }} className="text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Column 1: Logo + Tagline */}
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" style={{ color: "#F5A623" }} />
              <span
                className="text-lg font-bold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                My Spark SGO
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              Connecting families to out-of-school opportunities — powered by
              scholarship funding.
            </p>
            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Contact Info
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href="mailto:support@mysparkdenver.org"
                  className="transition-colors hover:text-white"
                >
                  support@mysparkdenver.org
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a
                  href="tel:720-807-0200"
                  className="transition-colors hover:text-white"
                >
                  720-807-0200
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Denver, CO</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-gray-400 sm:flex-row sm:px-6 lg:px-8">
          <span>&copy; 2026 My Spark SGO. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
