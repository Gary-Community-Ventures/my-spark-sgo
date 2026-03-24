import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  Heart,
  Users,
  DollarSign,
  Activity,
  CheckCircle,
  Building2,
  User,
  X,
  MapPin,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import donorData from "@/data/donorData";

const NAVY = "#0F2D5E";
const GOLD = "#F5A623";
const GREEN = "#2E7D32";

const PIE_COLORS = [
  "#0F2D5E",
  "#F5A623",
  "#2E7D32",
  "#1976D2",
  "#E65100",
  "#7B1FA2",
  "#00838F",
  "#AD1457",
];

function useCountUp(target, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function ImpactTicker() {
  const families = useCountUp(donorData.impactStats.familiesServed);
  const dollars = useCountUp(donorData.impactStats.totalAwarded);
  const activities = useCountUp(donorData.impactStats.activitiesFunded);

  const stats = [
    {
      icon: Users,
      label: "Families Served",
      value: families.toLocaleString(),
    },
    {
      icon: DollarSign,
      label: "Total Scholarship Dollars Awarded",
      value: `$${dollars.toLocaleString()}`,
    },
    {
      icon: Activity,
      label: "Activities Funded",
      value: activities.toLocaleString(),
    },
  ];

  return (
    <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur"
        >
          <stat.icon
            className="mb-2 h-8 w-8"
            style={{ color: NAVY }}
          />
          <span
            className="text-3xl font-bold"
            style={{ color: NAVY }}
          >
            {stat.value}
          </span>
          <span className="mt-1 text-center text-sm text-gray-600">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function DonorPortal() {
  // Contribution state
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState("one-time");
  const [dedication, setDedication] = useState("");
  const [corporateGiving, setCorporateGiving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [coBranding, setCoBranding] = useState(false);
  const [publicRecognition, setPublicRecognition] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Corporate contact form state
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    message: "",
  });

  const presetAmounts = [50, 100, 250, 500, 1000];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount);
    return 0;
  };

  const handleSubmit = () => {
    if (getFinalAmount() > 0) {
      setShowConfirmation(true);
    }
  };

  return (
    <Layout>
      {/* ─── HERO SECTION ─── */}
      <section
        className="relative px-4 pb-20 pt-16"
        style={{
          background: `linear-gradient(180deg, ${GOLD}22 0%, #FFFFFF 100%)`,
        }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <Sparkles
            className="mx-auto mb-4 h-10 w-10"
            style={{ color: GOLD }}
          />
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: NAVY }}
          >
            Fund a Child's Spark.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-700 sm:text-xl">
            Your contribution goes directly to scholarship funding for
            Denver-area middle schoolers. Every dollar stays in Colorado.
          </p>
          <ImpactTicker />
        </div>
      </section>

      {/* ─── CONTRIBUTION SECTION ─── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle
                className="text-center text-2xl"
                style={{ color: NAVY }}
              >
                Make a Contribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preset amounts */}
              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">
                  Select Amount
                </Label>
                <div className="flex flex-wrap gap-2">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                      style={{
                        backgroundColor:
                          selectedAmount === amount ? NAVY : "#F3F4F6",
                        color:
                          selectedAmount === amount ? "#FFFFFF" : "#374151",
                      }}
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedAmount(null);
                    }}
                    className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor:
                        selectedAmount === null ? NAVY : "#F3F4F6",
                      color: selectedAmount === null ? "#FFFFFF" : "#374151",
                    }}
                  >
                    Custom
                  </button>
                </div>
                {selectedAmount === null && (
                  <div className="mt-3">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                    />
                  </div>
                )}
              </div>

              {/* Frequency toggle */}
              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">
                  Frequency
                </Label>
                <div className="inline-flex rounded-full bg-gray-100 p-1">
                  {["one-time", "monthly"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className="rounded-full px-5 py-2 text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: frequency === f ? NAVY : "transparent",
                        color: frequency === f ? "#FFFFFF" : "#6B7280",
                      }}
                    >
                      {f === "one-time" ? "One-Time" : "Monthly Recurring"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dedication */}
              <div>
                <Label htmlFor="dedication" className="text-sm font-medium text-gray-700">
                  Dedication (optional)
                </Label>
                <Input
                  id="dedication"
                  className="mt-1"
                  placeholder="In honor of..."
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                />
              </div>

              {/* Corporate Giving */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="corporate"
                    checked={corporateGiving}
                    onCheckedChange={(checked) => setCorporateGiving(!!checked)}
                  />
                  <Label htmlFor="corporate" className="text-sm font-medium text-gray-700">
                    Corporate Giving
                  </Label>
                </div>
                {corporateGiving && (
                  <div className="ml-6 space-y-3 rounded-lg bg-gray-50 p-4">
                    <div>
                      <Label htmlFor="companyName" className="text-sm text-gray-700">
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        className="mt-1"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="coBranding"
                        checked={coBranding}
                        onCheckedChange={(checked) => setCoBranding(!!checked)}
                      />
                      <Label htmlFor="coBranding" className="text-sm text-gray-700">
                        We'd like co-branding recognition
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              {/* Public Recognition */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="publicRecognition"
                  checked={publicRecognition}
                  onCheckedChange={(checked) => setPublicRecognition(!!checked)}
                />
                <Label htmlFor="publicRecognition" className="text-sm text-gray-700">
                  List my name/organization on our donor wall
                </Label>
              </div>

              {/* Tax note */}
              <p className="text-xs text-gray-500">
                My Spark SGO is a qualified Scholarship Granting Organization
                under Colorado law. Your contribution may be eligible for both
                state and federal tax benefits.
              </p>

              {/* Submit */}
              <Button
                className="w-full py-6 text-lg font-bold"
                style={{ backgroundColor: GOLD, color: NAVY }}
                onClick={handleSubmit}
              >
                Fund a Spark
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── CONFIRMATION MODAL ─── */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <button
              onClick={() => setShowConfirmation(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: `${GREEN}20` }}
              >
                <CheckCircle className="h-10 w-10" style={{ color: GREEN }} />
              </div>
              <h2
                className="text-2xl font-bold"
                style={{ color: NAVY }}
              >
                Thank You for Your Generosity!
              </h2>
              <div className="mt-6 w-full rounded-lg bg-gray-50 p-4 text-left text-sm">
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-semibold">
                    ${getFinalAmount().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-500">Frequency</span>
                  <span className="font-semibold">
                    {frequency === "one-time" ? "One-Time" : "Monthly Recurring"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-500">Date</span>
                  <span className="font-semibold">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Reference #</span>
                  <span className="font-semibold">
                    SPK-{Date.now().toString(36).toUpperCase()}
                  </span>
                </div>
              </div>
              <Button
                className="mt-6 w-full"
                style={{ backgroundColor: NAVY, color: "#FFFFFF" }}
                onClick={() => setShowConfirmation(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── IMPACT TRANSPARENCY SECTION ─── */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2
            className="text-center text-3xl font-bold"
            style={{ color: NAVY }}
          >
            Where Your Dollars Go
          </h2>

          {/* Privacy callout */}
          <div
            className="mx-auto mt-6 max-w-3xl rounded-lg border-l-4 bg-white p-4 shadow-sm"
            style={{ borderLeftColor: GREEN }}
          >
            <p className="text-sm text-gray-600">
              All impact data is aggregated and anonymized — no personally
              identifiable information about scholarship families is ever
              shared.
            </p>
          </div>

          {/* Charts */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: NAVY }}>
                  Spending by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={donorData.spendingByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {donorData.spendingByCategory.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: NAVY }}>
                  Families Served by Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={donorData.familiesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="families" fill={NAVY} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Map placeholder */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg" style={{ color: NAVY }}>
                <MapPin className="h-5 w-5" />
                Geographic Distribution Across Denver Metro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg p-6"
                style={{ backgroundColor: `${NAVY}08` }}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {donorData.zipDistribution.map((item) => (
                    <div
                      key={item.zip}
                      className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
                    >
                      <div>
                        <span
                          className="block text-sm font-bold"
                          style={{ color: NAVY }}
                        >
                          {item.zip}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.label}
                        </span>
                      </div>
                      <span
                        className="text-lg font-bold"
                        style={{ color: GOLD }}
                      >
                        {item.families}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── DONOR RECOGNITION SECTION ─── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2
            className="text-center text-3xl font-bold"
            style={{ color: NAVY }}
          >
            Our Generous Supporters
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {donorData.donors.map((donor) => (
              <div
                key={donor.id}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                style={{
                  border:
                    donor.type === "corporate"
                      ? `2px solid ${GOLD}`
                      : "1px solid #E5E7EB",
                }}
              >
                <Heart
                  className="h-5 w-5 flex-shrink-0"
                  style={{
                    color:
                      donor.type === "corporate" ? GOLD : NAVY,
                  }}
                  fill={donor.type === "corporate" ? GOLD : NAVY}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ color: NAVY }}
                  >
                    {donor.name}
                  </p>
                  <Badge
                    variant={
                      donor.type === "corporate" ? "secondary" : "default"
                    }
                    className="mt-1"
                  >
                    {donor.type === "corporate" ? (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> Corporate
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> Individual
                      </span>
                    )}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CORPORATE GIVING SECTION ─── */}
      <section className="px-4 py-16" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white">
            Corporate Giving & Tax Benefits
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Colorado's Education Freedom Tax Credit provides a dollar-for-dollar
            state tax credit for contributions to qualified Scholarship Granting
            Organizations. Combined with the federal Section 45F employer tax
            credit angle, your company's contribution can fund scholarships for
            Denver-area middle schoolers while generating meaningful tax benefits
            for your organization.
          </p>
          <Button
            className="mt-8 px-8 py-6 text-lg font-bold"
            style={{ backgroundColor: GOLD, color: NAVY }}
            onClick={() => setShowContactForm(!showContactForm)}
          >
            Partner With Us
          </Button>

          {showContactForm && (
            <Card className="mx-auto mt-8 max-w-lg text-left">
              <CardHeader>
                <CardTitle style={{ color: NAVY }}>
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="corp-company" className="text-sm text-gray-700">
                    Company Name
                  </Label>
                  <Input
                    id="corp-company"
                    className="mt-1"
                    value={contactForm.company}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, company: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="corp-contact" className="text-sm text-gray-700">
                    Contact Name
                  </Label>
                  <Input
                    id="corp-contact"
                    className="mt-1"
                    value={contactForm.contact}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, contact: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="corp-email" className="text-sm text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="corp-email"
                    type="email"
                    className="mt-1"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="corp-phone" className="text-sm text-gray-700">
                    Phone
                  </Label>
                  <Input
                    id="corp-phone"
                    type="tel"
                    className="mt-1"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="corp-message" className="text-sm text-gray-700">
                    Message
                  </Label>
                  <Textarea
                    id="corp-message"
                    className="mt-1"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                  />
                </div>
                <Button
                  className="w-full"
                  style={{ backgroundColor: NAVY, color: "#FFFFFF" }}
                >
                  Submit
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default DonorPortal;
