import { useState } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CheckCircle,
  Search,
  Star,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  MapPin,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import providers from "@/data/providers";
import transactions from "@/data/transactions";

const spendingData = [
  { category: "Sports", amount: 250 },
  { category: "Arts", amount: 150 },
  { category: "Academics", amount: 0 },
  { category: "Music", amount: 0 },
  { category: "Dance", amount: 0 },
  { category: "STEM", amount: 0 },
];

const categoryFilters = [
  "All",
  "Sports",
  "Arts",
  "Academics",
  "Music",
  "Dance",
  "Martial Arts",
  "Swim",
  "Outdoors",
  "STEM",
];

const categoryColors = {
  Sports: "bg-blue-100 text-blue-800",
  Arts: "bg-purple-100 text-purple-800",
  Academics: "bg-green-100 text-green-800",
  Music: "bg-yellow-100 text-yellow-800",
  Dance: "bg-pink-100 text-pink-800",
  "Martial Arts": "bg-red-100 text-red-800",
  Swim: "bg-cyan-100 text-cyan-800",
  Outdoors: "bg-emerald-100 text-emerald-800",
  STEM: "bg-indigo-100 text-indigo-800",
};

function FamilyDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= Math.round(rating)
              ? "fill-[#F5A623] text-[#F5A623]"
              : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <Layout>
      <PageHeader
        title="Family Dashboard"
        description="Manage your scholarship, find providers, and track spending."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Dashboard", href: "#" },
          { label: "Family Dashboard" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ============ 1. GREETING HEADER ============ */}
        <div className="mb-8">
          <h2
            className="text-3xl font-bold"
            style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
          >
            Welcome back, Maria!
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <Badge variant="success" className="flex items-center gap-1.5 px-3 py-1 text-sm">
              <CheckCircle className="h-4 w-4" />
              Active
            </Badge>
            <p className="text-gray-600">
              Your My Spark SGO scholarship is active and ready to use.
            </p>
          </div>
        </div>

        {/* ============ 2. CARD BALANCE SECTION ============ */}
        <div className="mb-10">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
            {/* Virtual Card */}
            <div
              className="relative w-full max-w-[400px] overflow-hidden rounded-2xl p-6 shadow-xl"
              style={{
                aspectRatio: "1.6 / 1",
                background:
                  "linear-gradient(135deg, #0F2D5E 0%, #1A3F7A 50%, #0F2D5E 100%)",
              }}
            >
              {/* Gold decorative lines */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 80% 20%, rgba(245,166,35,0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(245,166,35,0.1) 0%, transparent 50%)",
                }}
              />
              <div
                className="pointer-events-none absolute right-[-40px] top-[-40px] h-[200px] w-[200px] rounded-full opacity-10"
                style={{ border: "2px solid #F5A623" }}
              />
              <div
                className="pointer-events-none absolute bottom-[-60px] left-[-30px] h-[250px] w-[250px] rounded-full opacity-10"
                style={{ border: "2px solid #F5A623" }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <span
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    My Spark SGO
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: "#F5A623", fontFamily: "Inter, sans-serif" }}
                  >
                    Chek
                  </span>
                </div>

                {/* Card number */}
                <div className="my-4">
                  <p
                    className="text-xl tracking-[0.25em] text-white/90"
                    style={{ fontFamily: "'Courier New', monospace" }}
                  >
                    **** &nbsp; **** &nbsp; **** &nbsp; 4832
                  </p>
                </div>

                {/* Bottom row */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/50">
                      Card Holder
                    </p>
                    <p
                      className="text-sm font-semibold tracking-wider text-white"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      MARIA GONZALEZ
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-white/50">
                      Valid Thru
                    </p>
                    <p className="text-sm font-semibold text-white">06/26</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Info */}
            <div className="flex flex-col items-center gap-4 lg:items-start lg:pt-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Balance</p>
                <p className="text-4xl font-bold text-green-600">$1,000.00</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-lg font-semibold" style={{ color: "#0F2D5E" }}>
                    $400.00
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="text-lg font-semibold text-green-600">$600.00</p>
                </div>
              </div>
              <Button
                className="mt-2 flex items-center gap-2 text-white"
                style={{ backgroundColor: "#F5A623" }}
              >
                <CreditCard className="h-4 w-4" />
                Activate Card
                <CheckCircle className="ml-1 h-4 w-4 text-green-300" />
              </Button>
            </div>
          </div>
        </div>

        {/* ============ 3. SPENDING SUMMARY ============ */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle
              className="flex items-center gap-2 text-xl"
              style={{ color: "#0F2D5E" }}
            >
              <TrendingUp className="h-5 w-5" />
              Spending Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={spendingData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "#0F2D5E", fontSize: 12 }}
                    axisLine={{ stroke: "#0F2D5E" }}
                  />
                  <YAxis
                    tick={{ fill: "#0F2D5E", fontSize: 12 }}
                    axisLine={{ stroke: "#0F2D5E" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Amount"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#F5A623" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-600">
                  $400 spent of $1,000 total
                </span>
                <span className="font-semibold" style={{ color: "#0F2D5E" }}>
                  40%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "40%",
                    background: "linear-gradient(90deg, #F5A623, #f7b84e)",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============ 4. APPROVED PROVIDERS ============ */}
        <div className="mb-10">
          <h3
            className="mb-4 text-2xl font-bold"
            style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
          >
            Find Approved Providers
          </h3>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search providers by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter chips */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categoryFilters.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                className={
                  selectedCategory === cat
                    ? "text-white"
                    : "border-gray-300 text-gray-600 hover:border-[#0F2D5E] hover:text-[#0F2D5E]"
                }
                style={
                  selectedCategory === cat ? { backgroundColor: "#0F2D5E" } : {}
                }
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Provider grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
              <Card
                key={provider.id}
                className="flex flex-col justify-between transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="text-lg font-bold" style={{ color: "#0F2D5E" }}>
                      {provider.name}
                    </h4>
                  </div>
                  <Badge
                    className={`mb-3 ${
                      categoryColors[provider.category] || "bg-gray-100 text-gray-800"
                    } border-0`}
                  >
                    {provider.category}
                  </Badge>
                  <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {provider.address}, {provider.city}, {provider.state}{" "}
                    {provider.zip}
                  </div>
                  <div className="mb-4 flex items-center gap-1.5">
                    <div className="flex">{renderStars(provider.rating)}</div>
                    <span className="text-sm font-semibold text-gray-700">
                      {provider.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({provider.reviewCount})
                    </span>
                  </div>
                  <Button variant="outline" className="w-full border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white">
                    Enroll
                  </Button>
                </CardContent>
              </Card>
            ))}
            {filteredProviders.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No providers found matching your search criteria.
              </div>
            )}
          </div>
        </div>

        {/* ============ 5. RECENT TRANSACTIONS ============ */}
        <div className="mb-10">
          <h3
            className="mb-4 text-2xl font-bold"
            style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
          >
            Recent Transactions
          </h3>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-lg border sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                    Date
                  </th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                    Provider
                  </th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                    Category
                  </th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                    Amount
                  </th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#0F2D5E" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{txn.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {txn.provider}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{txn.category}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      ${txn.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          txn.status === "Completed" ? "success" : "secondary"
                        }
                      >
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {transactions.map((txn) => (
              <Card key={txn.id}>
                <CardContent className="pt-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      {txn.provider}
                    </span>
                    <Badge
                      variant={
                        txn.status === "Completed" ? "success" : "secondary"
                      }
                    >
                      {txn.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{txn.date}</span>
                    <span>{txn.category}</span>
                  </div>
                  <p className="mt-2 text-lg font-bold" style={{ color: "#0F2D5E" }}>
                    ${txn.amount.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ============ 6. UPCOMING DEADLINES ============ */}
        <Card className="mb-10 overflow-hidden border-l-4" style={{ borderLeftColor: "#F5A623" }}>
          <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(245, 166, 35, 0.15)" }}
            >
              <AlertTriangle className="h-6 w-6" style={{ color: "#F5A623" }} />
            </div>
            <div className="flex-1">
              <h4
                className="text-lg font-bold"
                style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
              >
                Funds Expiration Reminder
              </h4>
              <p className="mt-1 text-gray-600">
                Your unused scholarship funds will expire on{" "}
                <span className="font-semibold">June 30, 2026</span>. Make sure
                to enroll in activities before this date!
              </p>
            </div>
            <Button
              className="flex-shrink-0 text-white"
              style={{ backgroundColor: "#F5A623" }}
              onClick={() => {
                document.querySelector("#providers-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Providers
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default FamilyDashboard;
