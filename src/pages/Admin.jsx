import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
  Sparkles,
  ShieldAlert,
  BarChart3,
  Brain,
  GraduationCap,
  Pencil,
  Power,
} from "lucide-react";
import familyApplications from "@/data/familyApplications";
import providerApplications from "@/data/providerApplications";
import activityFeed from "@/data/activityFeed";
import complianceData from "@/data/complianceData";
import selDataModule from "@/data/selData";
import benchmarkData from "@/data/benchmarkData";
import subsidyData from "@/data/subsidyData";
import ReviewQueue from "@/components/ReviewQueue";

const { adminSelData } = selDataModule;

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
        {/* ============ REPLICATE THIS PROGRAM ============ */}
        <div className="mb-6 flex justify-end">
          <Link
            to="/setup"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: "#0F2D5E" }}
          >
            <Sparkles className="h-4 w-4" />
            Replicate This Program
          </Link>
        </div>

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
        <Tabs defaultValue="review-queue" className="mb-10">
          <TabsList className="mb-4 w-full justify-start overflow-x-auto flex-wrap">
            <TabsTrigger value="review-queue">AI Review Queue</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="compliance">Compliance & Reporting</TabsTrigger>
            <TabsTrigger value="outcomes">Student Outcomes</TabsTrigger>
            <TabsTrigger value="reviews">Review Intelligence</TabsTrigger>
            <TabsTrigger value="benchmarking">Benchmarking</TabsTrigger>
            <TabsTrigger value="subsidies">Subsidy Programs</TabsTrigger>
          </TabsList>

          {/* ---- AI Review Queue ---- */}
          <TabsContent value="review-queue">
            <ReviewQueue />
          </TabsContent>

          {/* ---- Activity Feed ---- */}
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

          {/* ---- Tab 5: Student Outcomes (SEL Analytics) ---- */}
          <TabsContent value="outcomes">
            <div className="space-y-6">
              {/* Callout Banner */}
              <div
                className="flex items-center gap-3 rounded-lg p-4 text-white"
                style={{ backgroundColor: "#0F2D5E" }}
              >
                <Sparkles className="h-6 w-6 flex-shrink-0" />
                <p className="text-sm font-medium leading-relaxed">
                  My Spark SGO is building the most comprehensive dataset on out-of-school programming outcomes in the country.
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {[
                  { label: "Average Confidence", value: adminSelData.avgScores.confidence },
                  { label: "Average Belonging", value: adminSelData.avgScores.belonging },
                  { label: "Average School Engagement", value: adminSelData.avgScores.schoolEngagement },
                  { label: "Average Wellbeing", value: adminSelData.avgScores.wellbeing },
                  { label: "Response Rate", value: `${Math.round(adminSelData.responseRate * 100)}%` },
                  { label: "Pending Outreach", value: `${adminSelData.pendingOutreach} families` },
                ].map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="pt-4 text-center">
                      <p className="text-2xl font-bold" style={{ color: "#0F2D5E" }}>
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cohort Trend Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
                    Cohort SEL Trend Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={adminSelData.cohortTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                      <YAxis domain={[2.5, 4.5]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgConfidence" name="Confidence" stroke="#0F2D5E" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="avgBelonging" name="Belonging" stroke="#F5A623" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="avgSchoolEngagement" name="School Engagement" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="avgWellbeing" name="Wellbeing" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Activity Heatmap */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
                    Activity Type vs. SEL Dimensions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="px-4 py-3 text-left font-semibold" style={{ color: "#0F2D5E" }}>Activity</th>
                          <th className="px-4 py-3 text-center font-semibold" style={{ color: "#0F2D5E" }}>Confidence</th>
                          <th className="px-4 py-3 text-center font-semibold" style={{ color: "#0F2D5E" }}>Belonging</th>
                          <th className="px-4 py-3 text-center font-semibold" style={{ color: "#0F2D5E" }}>School Engagement</th>
                          <th className="px-4 py-3 text-center font-semibold" style={{ color: "#0F2D5E" }}>Wellbeing</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {adminSelData.activityHeatmap.map((row) => (
                          <tr key={row.activity}>
                            <td className="px-4 py-3 font-medium text-gray-800">{row.activity}</td>
                            {["confidence", "belonging", "schoolEngagement", "wellbeing"].map((dim) => {
                              const val = row[dim];
                              const bg = val >= 4 ? "bg-green-100 text-green-800" : val >= 3.5 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800";
                              return (
                                <td key={dim} className="px-4 py-3 text-center">
                                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${bg}`}>
                                    {val.toFixed(1)}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Export Button */}
              <div className="flex justify-end">
                <Button
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: "#F5A623" }}
                  onClick={() => alert("Exporting longitudinal dataset...")}
                >
                  Export Longitudinal Dataset
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ---- Tab 6: Review Intelligence (NLP Analysis) ---- */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              {/* Timestamp and Re-analyze */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Last analyzed:</span> March 23, 2026 at 11:42 PM
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-500">
                    Analysis runs automatically every Sunday night and whenever 25+ new reviews are submitted.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
                    onClick={() => alert("Re-analyzing reviews...")}
                  >
                    Re-analyze
                  </Button>
                </div>
              </div>

              {/* Safety Flags */}
              <Card className="border-2 border-red-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-red-700">
                    <ShieldAlert className="h-5 w-5" />
                    Safety Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        provider: "Rocky Mountain Martial Arts",
                        issue: "One review mentions overcrowded classes during peak hours reducing instructor supervision",
                        severity: "Watch",
                      },
                    ].map((flag, i) => (
                      <div key={i} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800">{flag.provider}</p>
                          <p className="mt-1 text-sm text-gray-600">{flag.issue}</p>
                          <Badge className="mt-2 border-0 bg-amber-100 text-amber-800">{flag.severity}</Badge>
                        </div>
                        <Button
                          size="sm"
                          className="flex-shrink-0 text-white hover:opacity-90"
                          style={{ backgroundColor: "#0F2D5E" }}
                          onClick={() => alert(`Reviewing safety flag for ${flag.provider}...`)}
                        >
                          Review Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Themes at a Glance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
                    Themes at a Glance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { theme: "Instructor Quality", mentions: 42, severity: "Positive Trend", quote: "The instructors genuinely care about each student" },
                      { theme: "Class Size Concerns", mentions: 18, severity: "Watch", quote: "Class sizes have gotten larger recently" },
                      { theme: "Scheduling Flexibility", mentions: 24, severity: "Watch", quote: "Wish they had more weekend/evening options" },
                      { theme: "Student Confidence Growth", mentions: 38, severity: "Positive Trend", quote: "His confidence has grown so much" },
                      { theme: "Value for Families", mentions: 31, severity: "Positive Trend", quote: "Worth every penny" },
                      { theme: "Facility Conditions", mentions: 8, severity: "Watch", quote: "Pool can get crowded during peak hours" },
                    ].map((t) => {
                      const severityClass = t.severity === "Positive Trend"
                        ? "bg-green-100 text-green-800"
                        : t.severity === "Watch"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800";
                      return (
                        <Card key={t.theme} className="border">
                          <CardContent className="pt-4">
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-gray-800">{t.theme}</h4>
                              <Badge className={`flex-shrink-0 border-0 ${severityClass}`}>{t.severity}</Badge>
                            </div>
                            <p className="text-xs text-gray-500">{t.mentions} mentions</p>
                            <p className="mt-2 text-sm italic text-gray-600">"{t.quote}"</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3 w-full border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
                              onClick={() => alert(`Contacting providers related to "${t.theme}"...`)}
                            >
                              Contact Provider
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
                    Overall Sentiment Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                      data={[
                        { month: "Sep 2025", sentiment: 3.8 },
                        { month: "Oct 2025", sentiment: 3.9 },
                        { month: "Nov 2025", sentiment: 4.0 },
                        { month: "Dec 2025", sentiment: 4.0 },
                        { month: "Jan 2026", sentiment: 4.2 },
                        { month: "Feb 2026", sentiment: 4.3 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis domain={[3.5, 4.5]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="sentiment" name="Sentiment Score" stroke="#0F2D5E" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ---- Tab 7: Benchmarking (National Comparison) ---- */}
          <TabsContent value="benchmarking">
            <div className="space-y-6">
              {/* Framing Statement */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  See how your program compares to SGOs across the country — all data is anonymized and aggregated.
                </p>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                  <span className="font-medium text-gray-700">Include my data in the national benchmark</span>
                </label>
              </div>

              {/* Metric Comparison Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {benchmarkData.metrics.map((m) => {
                  const diff = typeof m.yourProgram === "number" && typeof m.nationalAvg === "number"
                    ? ((m.yourProgram - m.nationalAvg) / m.nationalAvg) * 100
                    : 0;
                  // For "days to first transaction" lower is better
                  const lowerIsBetter = m.name.includes("Days");
                  const effectiveDiff = lowerIsBetter ? -diff : diff;
                  const valueColor = effectiveDiff >= 0 ? "text-green-600" : effectiveDiff >= -10 ? "text-amber-600" : "text-red-600";
                  return (
                    <Card key={m.id} className="border">
                      <CardContent className="pt-4">
                        <p className="mb-3 text-sm font-semibold" style={{ color: "#0F2D5E" }}>{m.name}</p>
                        <div className="space-y-1">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-gray-500">Your Program</span>
                            <span className={`text-xl font-bold ${valueColor}`}>{m.yourProgram}{m.unit === "%" ? "%" : m.unit === "days" ? " days" : m.unit === "score" ? "" : ""}</span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-gray-500">National Average</span>
                            <span className="text-base font-medium text-gray-500">{m.nationalAvg}{m.unit === "%" ? "%" : m.unit === "days" ? " days" : ""}</span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-gray-500">Top Quartile</span>
                            <span className="text-base font-medium" style={{ color: "#0F2D5E" }}>{m.topQuartile}{m.unit === "%" ? "%" : m.unit === "days" ? " days" : ""}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Activity Mix Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
                    Activity Mix Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={benchmarkData.activityMix}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 12 }} label={{ value: "% of Spending", angle: -90, position: "insideLeft", style: { fontSize: 12 } }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="yourProgram" name="Your Program" fill="#0F2D5E" />
                      <Bar dataKey="nationalAvg" name="National Average" fill="#9CA3AF" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">Biggest divergence:</span> Your program allocates significantly more to Arts (18% vs. 14% national average) and less to Sports (22% vs. 28%). This may reflect strong local arts provider availability.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Demographics Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
                    Demographics Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="px-4 py-3 text-left font-semibold" style={{ color: "#0F2D5E" }}>Metric</th>
                          <th className="px-4 py-3 text-center font-semibold" style={{ color: "#0F2D5E" }}>Your Program</th>
                          <th className="px-4 py-3 text-center font-semibold" style={{ color: "#0F2D5E" }}>National Average</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {[
                          { label: "% Students of Color", yours: `${benchmarkData.demographics.yourProgram.studentsOfColor}%`, national: `${benchmarkData.demographics.nationalAvg.studentsOfColor}%` },
                          { label: "% ELL Families", yours: `${benchmarkData.demographics.yourProgram.ellFamilies}%`, national: `${benchmarkData.demographics.nationalAvg.ellFamilies}%` },
                          { label: "% Urban", yours: `${benchmarkData.demographics.yourProgram.urban}%`, national: `${benchmarkData.demographics.nationalAvg.urban}%` },
                          { label: "Avg Distance to Provider", yours: `${benchmarkData.demographics.yourProgram.avgDistance} mi`, national: `${benchmarkData.demographics.nationalAvg.avgDistance} mi` },
                        ].map((row) => (
                          <tr key={row.label} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{row.label}</td>
                            <td className="px-4 py-3 text-center font-semibold" style={{ color: "#0F2D5E" }}>{row.yours}</td>
                            <td className="px-4 py-3 text-center text-gray-500">{row.national}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Peer SGO Spotlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
                    Peer SGO Spotlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {benchmarkData.peerSpotlights.map((peer) => (
                      <Card key={peer.id} className="border">
                        <CardContent className="pt-4">
                          <h4 className="font-semibold" style={{ color: "#0F2D5E" }}>{peer.label}</h4>
                          <p className="mt-2 text-sm text-gray-600">{peer.highlight}</p>
                          <div className="mt-3 rounded-lg bg-gray-50 p-2 text-center">
                            <p className="text-xs text-gray-500">{peer.topMetric}</p>
                            <p className="text-lg font-bold" style={{ color: "#0F2D5E" }}>{peer.topMetricValue}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 w-full border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
                            onClick={() => alert(`Requesting peer connection with ${peer.label}...`)}
                          >
                            Request Peer Connection
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trend Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
                    Utilization Trend: Your Program vs. National
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={benchmarkData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 12 }} label={{ value: "Utilization %", angle: -90, position: "insideLeft", style: { fontSize: 12 } }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="yourUtilization" name="Your Utilization" stroke="#0F2D5E" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="nationalUtilization" name="National Utilization" stroke="#9CA3AF" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Export Button */}
              <div className="flex justify-end">
                <Button
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: "#F5A623" }}
                  onClick={() => alert("Exporting benchmarking report...")}
                >
                  Export Benchmarking Report
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ---- Tab 8: Subsidy Programs ---- */}
          <TabsContent value="subsidies">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
                  <DollarSign className="h-5 w-5" />
                  Subsidy Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>Subsidy Name</th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>Provider</th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>Typical Award</th>
                        <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>Category</th>
                        <th className="px-4 py-3 text-right font-semibold" style={{ color: "#0F2D5E" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {subsidyData.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{sub.name}</td>
                          <td className="px-4 py-3 text-gray-600">{sub.provider}</td>
                          <td className="px-4 py-3 text-gray-600">{sub.typicalAward}</td>
                          <td className="px-4 py-3">
                            <Badge className="border-0 bg-blue-100 text-blue-800 capitalize">{sub.category}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
                                onClick={() => alert(`Editing subsidy: ${sub.name}`)}
                              >
                                <Pencil className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 border-red-300 text-red-600 hover:bg-red-600 hover:text-white"
                                onClick={() => alert(`Deactivating subsidy: ${sub.name}`)}
                              >
                                <Power className="h-3 w-3" />
                                Deactivate
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
