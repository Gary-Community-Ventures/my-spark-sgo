import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function PageHeader({ title, description, breadcrumbs = [] }) {
  return (
    <div className="bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span key={index} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  {isLast || !crumb.href ? (
                    <span className="font-medium text-gray-700">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.href}
                      className="transition-colors hover:text-[#0F2D5E]"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        {/* Title */}
        <h1
          className="text-3xl font-bold"
          style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="mt-2 text-base text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
