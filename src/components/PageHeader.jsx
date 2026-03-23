import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function PageHeader({ title, description, breadcrumbs = [] }) {
  return (
    <div style={{ backgroundColor: "#f9fafb", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {breadcrumbs.length > 0 && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 14,
              color: "#6b7280",
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  {index > 0 && (
                    <ChevronRight
                      style={{ width: 16, height: 16, color: "#9ca3af" }}
                    />
                  )}
                  {isLast || !crumb.href ? (
                    <span style={{ fontWeight: 500, color: "#374151" }}>
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.href}
                      style={{ color: "#6b7280", textDecoration: "none" }}
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
        )}
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 700,
            color: "#0F2D5E",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {description && (
          <p style={{ marginTop: 8, fontSize: 16, color: "#4b5563" }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
