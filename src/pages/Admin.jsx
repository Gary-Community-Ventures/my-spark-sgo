import { useState } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Building2,
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  CreditCard,
  Upload,
  UserCheck,
  TrendingUp,
  X,
} from "lucide-react";
import familyApplications from "@/data/familyApplications";
import providerApplications from "@/data/providerApplications";
import activityFeed from "@/data/activityFeed";
import complianceData from "@/data/complianceData";

const iconMap = {
  CreditCard,
  FileText,
  CheckCircle,
  Upload,
  UserCheck,
  AlertCircle,
  Eye,
  Users,
  Building: Building2,
  Building2,
  DollarSign,
  Clock,
};

const statusBadgeClass = {
  "Pending Review": "border-0 bg-amber-100 text-amber-800",
  "Under Review": "border-0 bg-blue-100 text-blue-800",
  Approved: "border-0 bg-green-100 text-green-800",
  "More Info Needed": "border-0 bg-red-100 text-red-800",
};

const eventTypeBorderColor = {
  payment_processed: "border-l-green-500",
  application_submitted: "border-l-blue-500",
  provider_approved: "border-l-emerald-500",
  document_uploaded: "border-l-amber-500",
  application_approved: "border-l-purple-500",
};

const eventTypeDotColor = {
  payment_processed: "bg-green-500",
  application_submitted: "bg-blue-500",
  provider_approved: "bg-emerald-500",
  document_uploaded: "bg-amber-500",
  application_approved: "bg-purple-500",
};

const summaryStats = [
  {
    label: "Total Families Enrolled",
    value: "247",
    trend: "+12% from last month",
    icon: Users,
    iconBg: "bg-[#0F2D5E]",
  },
  {
    label: "Total Providers Approved",
    value: "103",
    trend: "+8% from last month",
    icon: Building2,
    iconBg: "bg-[#F5A623]",
  },
  {
    label: "Total Funds Distributed",
    value: "$186,500",
    trend: "+15% from last month",
    icon: DollarSign,
    iconBg: "bg-green-600",
  },
  {
    label: "Applications Pending Review",
    value: "11",
    trend: "+3% from last month",
    icon: Clock,
    iconBg: "bg-amber-500",
  },
];

const reportCards = [
  {
    key: "donorImpact",
    title: "Donor Impact Report",
    icon: DollarSign,
    iconBg: "bg-green-600",
    description:
      "Summarizes total families served, total funds distributed, breakdown of spending by activity category, and geographic distribution by zip code. Formatted for sharing with individual or institutional donors.",
  },
  {
    key: "sgoAnnual",
    title: "State SGO Annual Report",
    icon: FileText,
    iconBg: "bg-[#0F2D5E]",
    description:
      "Structured to satisfy Colorado SGO reporting requirements under the Education Freedom Tax Credit. Includes total scholarship amounts, eligibility documentation status, provider count, and fund utilization rate.",
  },
  {
    key: "providerPayments",
    title: "Provider Payment Summary",
    icon: Building2,
    iconBg: "bg-[#F5A623]",
    description:
      "Lists all approved providers, total payments received YTD, and transaction count. Useful for 1099 preparation and provider reconciliation.",
  },
  {
    key: "utilization",
    title: "Program Utilization Report",
    icon: TrendingUp,
    iconBg: "bg-purple-600",
    description:
      "Shows fund utilization rate, average spend per student, most popular activity categories, and families with zero or low utilization flagged for outreach.",
  },
];

/* ============ Report Modal Components ============ */

function ReportModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "#0F2D5E" }}
        >
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            className="border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
            onClick={() => alert("Share link copied to clipboard!")}
          >
            Copy Share Link
          </Button>
          <Button
            size="sm"
            className="text-white hover:opacity-90"
            style={{ backgroundColor: "#F5A623" }}
            onClick={() => alert("Exporting report as PDF...")}
          >
            Export as PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

function DonorImpactModal({ onClose, dateFrom, dateTo }) {
  const d = complianceData.donorImpact;
  return (
    <ReportModalShell title="Donor Impact Report" onClose={onClose}>
      <p className="mb-4 text-sm text-gray-500">
        Report period: {dateFrom} to {dateTo}
      </p>

      {/* Summary stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Families", value: d.totalFamilies.toLocaleString() },
          { label: "Total Distributed", value: `$${d.totalDistributed.toLocaleString()}` },
          { label: "Avg Per Student", value: `$${d.avgPerStudent.toLocaleString()}` },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border p-4 text-center"
          >
            <p className="text-2xl font-bold" style={{ color: "#0F2D5E" }}>
              {s.value}
            </p>
            <p className="mt-1 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Spending by category */}
      <h3 className="mb-2 text-sm font-semibold" style={{ color: "#0F2D5E" }}>
        Spending by Activity Category
      </h3>
      <div className="mb-6 overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-2 font-semibold" style={{ color: "#0F2D5E" }}>Category</th>
              <th className="px-4 py-2 text-right font-semibold" style={{ color: "#0F2D5E" }}>Share</th>
              <th className="px-4 py-2 text-right font-semibold" style={{ color: "#0F2D5E" }}>Est. Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {d.spendingByCategory.map((cat) => (
              <tr key={cat.name} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700">{cat.name}</td>
                <td className="px-4 py-2 text-right text-gray-600">{cat.value}%</td>
                <td className="px-4 py-2 text-right text-gray-600">
                  ${Math.round((cat.value / 100) * d.totalDistributed).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Geographic distribution */}
      <h3 className="mb-2 text-sm font-semibold" style={{ color: "#0F2D5E" }}>
        Geographic Distribution by Zip Code
      </h3>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-2 font-semibold" style={{ color: "#0F2D5E" }}>Zip Code</th>
              <th className="px-4 py-2 font-semibold" style={{ color: "#0F2D5E" }}>Neighborhood</th>
              <th className="px-4 py-2 text-right font-semibold" style={{ color: "#0F2D5E" }}>Families</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {d.byZip.map((z) => (
              <tr key={z.zip} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-700">{z.zip}</td>
                <td className="px-4 py-2 text-gray-600">{z.label}</td>
                <td className="px-4 py-2 text-right text-gray-600">{z.families}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportModalShell>
  );
}

function SgoAnnualModal({ onClose, dateFrom, dateTo }) {
  const d = complianceData.sgoAnnual;
  const utilPct = Math.round(d.utilizationRate * 100);
  const eligPct = Math.round(d.eligibilityRate * 100);

  const stats = [
    { label: "Total Awarded", value: `$${d.totalAwarded.toLocaleString()}` },
    { label: "Students Served", value: d.studentsServed.toLocaleString() },
    { label: "Eligibility Verification Rate", value: `${eligPct}%` },
    { label: "Providers Approved", value: d.providersApproved.toLocaleString() },
    { label: "Fund Utilization Rate", value: `${utilPct}%` },
    { label: "Auto-Verified", value: d.verifiedAutomatic.toLocaleString() },
    { label: "Document-Verified", value: d.verifiedDocument.toLocaleString() },
  ];

  return (
    <ReportModalShell
      title="State SGO Annual Report — Colorado Education Freedom Tax Credit"
      onClose={onClose}
    >
      <p className="mb-4 text-sm text-gray-500">
        Report period: {dateFrom} to {dateTo}
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border p-3 text-center">
            <p className="text-xl font-bold" style={{ color: "#0F2D5E" }}>
              {s.value}
            </p>
            <p className="mt-1 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Utilization bar */}
      <h3 className="mb-2 text-sm font-semibold" style={{ color: "#0F2D5E" }}>
        Fund Utilization
      </h3>
      <div className="mb-2 h-6 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="flex h-full items-center justify-center rounded-full text-xs font-bold text-white"
          style={{
            width: `${utilPct}%`,
            backgroundColor: "#0F2D5E",
          }}
        >
          {utilPct}%
        </div>
      </div>
      <p className="text-xs text-gray-500">
        ${d.totalAwarded.toLocaleString()} allocated — $
        {Math.round(d.totalAwarded * d.utilizationRate).toLocaleString()} utilized
      </p>
    </ReportModalShell>
  );
}

function ProviderPaymentsModal({ onClose, dateFrom, dateTo }) {
  const payments = complianceData.providerPayments;
  const totalReceived = payments.reduce((s, p) => s + p.totalReceived, 0);
  const totalTxns = payments.reduce((s, p) => s + p.transactionCount, 0);

  return (
    <ReportModalShell title="Provider Payment Summary — YTD" onClose={onClose}>
      <p className="mb-4 text-sm text-gray-500">
        Report period: {dateFrom} to {dateTo}
      </p>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-2 font-semibold" style={{ color: "#0F2D5E" }}>Provider Name</th>
              <th className="px-4 py-2 font-semibold" style={{ color: "#0F2D5E" }}>EIN</th>
              <th className="px-4 py-2 text-right font-semibold" style={{ color: "#0F2D5E" }}>Total Received</th>
              <th className="px-4 py-2 text-right font-semibold" style={{ color: "#0F2D5E" }}>Transactions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((p) => (
              <tr key={p.providerId} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-700">{p.providerName}</td>
                <td className="px-4 py-2 text-gray-600">{p.ein}</td>
                <td className="px-4 py-2 text-right text-gray-600">
                  ${p.totalReceived.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right text-gray-600">{p.transactionCount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 bg-gray-50 font-bold">
            <tr>
              <td className="px-4 py-2" style={{ color: "#0F2D5E" }}>Total</td>
              <td className="px-4 py-2" />
              <td className="px-4 py-2 text-right" style={{ color: "#0F2D5E" }}>
                ${totalReceived.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right" style={{ color: "#0F2D5E" }}>
                {totalTxns}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </ReportModalShell>
  );
}

function UtilizationModal({ onClose, dateFrom, dateTo }) {
  const d = complianceData.utilization;
  const utilPct = Math.round((d.spent / d.allocated) * 100);

  return (
    <ReportModalShell title="Program Utilization Report" onClose={onClose}>
      <p className="mb-4 text-sm text-gray-500">
        Report period: {dateFrom} to {dateTo}
      </p>

      {/* Top stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Allocated", value: `$${d.allocated.toLocaleString()}` },
          { label: "Spent", value: `$${d.spent.toLocaleString()}` },
          { label: "Utilization Rate", value: `${utilPct}%` },
          { label: "Avg Per Student", value: `$${d.avgPerStudent.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border p-3 text-center">
            <p className="text-xl font-bold" style={{ color: "#0F2D5E" }}>
              {s.value}
            </p>
            <p className="mt-1 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Top categories */}
      <h3 className="mb-2 text-sm font-semibold" style={{ color: "#0F2D5E" }}>
        Top Activity Categories
      </h3>
      <div className="mb-6 space-y-2">
        {d.topCategories.map((cat) => (
          <div key={cat.name} className="flex items-center gap-3">
            <span className="w-24 text-sm text-gray-700">{cat.name}</span>
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${cat.pct}%`,
                  backgroundColor: "#F5A623",
                }}
              />
            </div>
            <span className="w-10 text-right text-sm font-medium text-gray-600">
              {cat.pct}%
            </span>
          </div>
        ))}
      </div>

      {/* Low utilization families */}
      <h3 className="mb-2 text-sm font-semibold" style={{ color: "#0F2D5E" }}>
        Low Utilization Families — Flagged for Outreach
      </h3>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-2 font-semibold" style={{ color: "#0F2D5E" }}>Name</th>
              <th className="px-4 py-2 text-right font-semibold" style={{ color: "#0F2D5E" }}>Spent</th>
              <th className="px-4 py-2 text-right font-semibold" style={{ color: "#0F2D5E" }}>Allocated</th>
              <th className="px-4 py-2 text-right font-semibold" style={{ color: "#0F2D5E" }}>Utilization %</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {d.lowUtilization.map((fam) => (
              <tr key={fam.name} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-700">{fam.name}</td>
                <td className="px-4 py-2 text-right text-gray-600">${fam.spent}</td>
                <td className="px-4 py-2 text-right text-gray-600">
                  ${fam.allocated.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <Badge className="border-0 bg-red-100 text-red-800">{fam.pct}%</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportModalShell>
  );
}

/* ============ Main Admin Component ============ */

function Admin() {
  const [activeReport, setActiveReport] = useState(null);
  const [dateFrom] = useState("2025-08-01");
  const [dateTo] = useState("2026-03-24");

  const handleReview = (id, type) => {
    alert(`Opening review for ${type} application: ${id}`);
  };

  const isSiblingAddOn = (app) => app.parentName === "Maria Gonzalez";

  return (
    <Layout>
      <PageHeader
        title="Admin Dashboard"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admin" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ============ 1. SUMMARY STAT CARDS ============ */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summaryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-2xl font-bold sm:text-3xl"
                        style={{ color: "#0F2D5E" }}
                      >
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                      <p className="mt-1 text-xs text-green-600">{stat.trend}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ============ 2. TABBED INTERFACE ============ */}
        <Tabs defaultValue="families" className="mb-10">
          <TabsList className="mb-4 w-full justify-start overflow-x-auto">
            <TabsTrigger value="families">Pending Family Applications</TabsTrigger>
            <TabsTrigger value="providers">Pending Provider Applications</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="compliance">Compliance & Reporting</TabsTrigger>
          </TabsList>

          {/* ---- Tab 1: Family Applications ---- */}
          <TabsContent value="families">
            <Card>
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2 text-xl"
                  style={{ color: "#0F2D5E" }}
                >
                  <Users className="h-5 w-5" />
                  Family Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop table */}
                <div className="hidden overflow-hidden rounded-lg border md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Applicant Name
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Student Name
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Grade
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Type
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Date Submitted
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Status
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {familyApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {app.parentName}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{app.studentName}</td>
                          <td className="px-4 py-3 text-gray-600">{app.grade}</td>
                          <td className="px-4 py-3">
                            {isSiblingAddOn(app) ? (
                              <Badge className="border-0 bg-amber-100 text-amber-800">
                                Sibling Add-On
                              </Badge>
                            ) : (
                              <Badge className="border-0 bg-blue-100 text-blue-800">
                                New Application
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{app.dateSubmitted}</td>
                          <td className="px-4 py-3">
                            <Badge className={statusBadgeClass[app.status] || ""}>
                              {app.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1.5 border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
                              onClick={() => handleReview(app.id, "family")}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="flex flex-col gap-3 md:hidden">
                  {familyApplications.map((app) => (
                    <Card key={app.id} className="border">
                      <CardContent className="pt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-gray-800">
                            {app.parentName}
                          </span>
                          <Badge className={statusBadgeClass[app.status] || ""}>
                            {app.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-500">
                          <p>
                            <span className="font-medium text-gray-700">Student:</span>{" "}
                            {app.studentName}
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">Grade:</span>{" "}
                            {app.grade}
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">Type:</span>{" "}
                            {isSiblingAddOn(app) ? (
                              <Badge className="border-0 bg-amber-100 text-amber-800">
                                Sibling Add-On
                              </Badge>
                            ) : (
                              <Badge className="border-0 bg-blue-100 text-blue-800">
                                New Application
                              </Badge>
                            )}
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">Submitted:</span>{" "}
                            {app.dateSubmitted}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 flex w-full items-center justify-center gap-1.5 border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
                          onClick={() => handleReview(app.id, "family")}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- Tab 2: Provider Applications ---- */}
          <TabsContent value="providers">
            <Card>
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2 text-xl"
                  style={{ color: "#0F2D5E" }}
                >
                  <Building2 className="h-5 w-5" />
                  Provider Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop table */}
                <div className="hidden overflow-hidden rounded-lg border md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Organization Name
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Contact
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Type
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Date Submitted
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Docs Status
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Status
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {providerApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {app.orgName}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{app.contactName}</td>
                          <td className="px-4 py-3 text-gray-600">{app.type}</td>
                          <td className="px-4 py-3 text-gray-600">{app.dateSubmitted}</td>
                          <td className="px-4 py-3">
                            {app.docsComplete ? (
                              <Badge className="border-0 bg-green-100 text-green-800">
                                Complete
                              </Badge>
                            ) : (
                              <Badge className="border-0 bg-red-100 text-red-800">
                                Incomplete
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={statusBadgeClass[app.status] || ""}>
                              {app.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1.5 border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
                              onClick={() => handleReview(app.id, "provider")}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="flex flex-col gap-3 md:hidden">
                  {providerApplications.map((app) => (
                    <Card key={app.id} className="border">
                      <CardContent className="pt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-gray-800">
                            {app.orgName}
                          </span>
                          <Badge className={statusBadgeClass[app.status] || ""}>
                            {app.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-500">
                          <p>
                            <span className="font-medium text-gray-700">Contact:</span>{" "}
                            {app.contactName}
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">Type:</span>{" "}
                            {app.type}
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">Submitted:</span>{" "}
                            {app.dateSubmitted}
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">Docs:</span>{" "}
                            {app.docsComplete ? (
                              <Badge className="border-0 bg-green-100 text-green-800">
                                Complete
                              </Badge>
                            ) : (
                              <Badge className="border-0 bg-red-100 text-red-800">
                                Incomplete
                              </Badge>
                            )}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 flex w-full items-center justify-center gap-1.5 border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
                          onClick={() => handleReview(app.id, "provider")}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- Tab 3: Activity Feed ---- */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2 text-xl"
                  style={{ color: "#0F2D5E" }}
                >
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200" />

                  <div className="space-y-0">
                    {activityFeed.map((event, index) => {
                      const Icon = iconMap[event.icon] || FileText;
                      const borderColor =
                        eventTypeBorderColor[event.type] || "border-l-gray-400";
                      const dotColor =
                        eventTypeDotColor[event.type] || "bg-gray-400";

                      return (
                        <div
                          key={event.id}
                          className="relative flex items-start gap-4 py-4"
                        >
                          {/* Timeline dot */}
                          <div
                            className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm`}
                          >
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full ${dotColor}`}
                            >
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                          </div>

                          {/* Event content */}
                          <div
                            className={`flex-1 rounded-lg border border-l-4 ${borderColor} bg-white p-3 shadow-sm ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                          >
                            <p className="text-sm text-gray-800">{event.message}</p>
                            <p className="mt-1 text-xs text-gray-400">
                              {event.timestamp}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- Tab 4: Compliance & Reporting ---- */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2 text-xl"
                  style={{ color: "#0F2D5E" }}
                >
                  <FileText className="h-5 w-5" />
                  Compliance & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Date range selector */}
                <div className="mb-8 flex flex-wrap items-end gap-4 rounded-lg border bg-gray-50 p-4">
                  <div>
                    <label
                      className="mb-1 block text-sm font-medium"
                      style={{ color: "#0F2D5E" }}
                    >
                      From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      readOnly
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm"
                    />
                  </div>
                  <div>
                    <label
                      className="mb-1 block text-sm font-medium"
                      style={{ color: "#0F2D5E" }}
                    >
                      To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      readOnly
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm"
                    />
                  </div>
                </div>

                {/* Report cards grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {reportCards.map((report) => {
                    const RIcon = report.icon;
                    return (
                      <Card
                        key={report.key}
                        className="border transition-shadow hover:shadow-md"
                      >
                        <CardContent className="pt-6">
                          <div className="mb-4 flex items-start gap-4">
                            <div
                              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${report.iconBg}`}
                            >
                              <RIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3
                                className="text-lg font-bold"
                                style={{ color: "#0F2D5E" }}
                              >
                                {report.title}
                              </h3>
                              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                                {report.description}
                              </p>
                            </div>
                          </div>
                          <Button
                            className="w-full text-white hover:opacity-90"
                            style={{ backgroundColor: "#F5A623" }}
                            onClick={() => setActiveReport(report.key)}
                          >
                            Generate Report
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ============ REPORT PREVIEW MODALS ============ */}
      {activeReport === "donorImpact" && (
        <DonorImpactModal
          onClose={() => setActiveReport(null)}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      )}
      {activeReport === "sgoAnnual" && (
        <SgoAnnualModal
          onClose={() => setActiveReport(null)}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      )}
      {activeReport === "providerPayments" && (
        <ProviderPaymentsModal
          onClose={() => setActiveReport(null)}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      )}
      {activeReport === "utilization" && (
        <UtilizationModal
          onClose={() => setActiveReport(null)}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      )}
    </Layout>
  );
}

export default Admin;
