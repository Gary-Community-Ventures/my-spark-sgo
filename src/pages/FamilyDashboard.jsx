import { useState } from "react";
import Layout from "@/components/Layout";
import ReviewForm from "@/components/ReviewForm";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Search,
  Star,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  MapPin,
  Clock,
  Plus,
  Camera,
  Phone,
  Mail,
  Globe,
  X,
  Upload,
  Users,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import providers from "@/data/providers";
import students from "@/data/students";
import reviews from "@/data/reviews";
import selDataExports from "@/data/selData";
import subsidyData from "@/data/subsidyData";

const { surveyTypes, monthlyQuestions, selTimeline, selTimelineMarcus, milestones } = selDataExports;

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

const interestOptions = [
  "Sports",
  "Arts",
  "Music",
  "Dance",
  "Academics",
  "STEM",
  "Martial Arts",
  "Swim",
];

function FamilyDashboard() {
  const [activeStudentId, setActiveStudentId] = useState(students[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [reviewSort, setReviewSort] = useState("recent");
  const [showLeaveReview, setShowLeaveReview] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [addStudentSuccess, setAddStudentSuccess] = useState(false);
  const [showSELSurvey, setShowSELSurvey] = useState(false);
  const [selSurveyType, setSelSurveyType] = useState("monthly");
  const [selResponses, setSelResponses] = useState({});
  const [selCurrentQ, setSelCurrentQ] = useState(0);
  const [selComplete, setSelComplete] = useState(false);
  const [showSubsidyFinder, setShowSubsidyFinder] = useState(false);
  const [flaggedSubsidies, setFlaggedSubsidies] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [reviewedTransactions, setReviewedTransactions] = useState(new Set());
  const [reviewFilterStars, setReviewFilterStars] = useState("all");
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    school: "",
    grade: "",
    dob: "",
    frl: false,
    interests: [],
  });

  const student = students.find((s) => s.id === activeStudentId);

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating, size = "h-4 w-4") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${size} ${
            i <= Math.round(rating)
              ? "fill-[#F5A623] text-[#F5A623]"
              : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const renderClickableStars = (rating, onRate) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-7 w-7 cursor-pointer transition-colors ${
            i <= rating
              ? "fill-[#F5A623] text-[#F5A623]"
              : "text-gray-300 hover:text-[#F5A623]"
          }`}
          onClick={() => onRate(i)}
        />
      );
    }
    return stars;
  };

  // Feature 1: Recommendation algorithm
  const getRecommendations = () => {
    const scored = providers.map((provider) => {
      let score = 0;
      const reasons = [];

      const categoryMatch = student.interests.some(
        (interest) =>
          provider.category.toLowerCase() === interest.toLowerCase()
      );
      if (categoryMatch) {
        score += 30;
        reasons.push(`Matches ${student.firstName}'s interest in ${provider.category}`);
      }

      const zipMatch = provider.zip === student.zip;
      if (zipMatch) {
        score += 20;
        reasons.push("close to home");
      }

      // Review-based scoring: higher ratings get bonus
      if (provider.rating) {
        score += 5 * provider.rating;
      }
      // More reviews = more trusted (capped at +5)
      if (provider.reviewCount) {
        score += Math.min(Math.floor(provider.reviewCount / 10), 5);
      }

      // Random bonus for variety (seeded by provider id for consistency)
      const seed = provider.id.charCodeAt(provider.id.length - 1);
      score += (seed % 11);

      if (!categoryMatch && !zipMatch) {
        reasons.push(`Top-rated in ${provider.category}`);
      }

      return { ...provider, score, reason: reasons.join(", ") || `Top-rated in ${provider.category}` };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  };

  const recommendations = getRecommendations();

  const getInitials = (s) =>
    `${s.firstName.charAt(0)}${s.lastName.charAt(0)}`;

  const spentPercent = Math.round(
    (student.totalSpent / student.totalBudget) * 100
  );

  const handleAddStudentSubmit = () => {
    setAddStudentSuccess(true);
    setTimeout(() => {
      setAddStudentSuccess(false);
      setShowAddStudent(false);
      setNewStudent({
        firstName: "",
        lastName: "",
        school: "",
        grade: "",
        dob: "",
        frl: false,
        interests: [],
      });
    }, 1500);
  };

  const toggleNewStudentInterest = (interest) => {
    setNewStudent((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // Provider detail review helpers
  const getProviderReviews = (providerId) => {
    let provReviews = reviews[providerId] || [];

    // Filter by stars
    if (reviewFilterStars === "5") {
      provReviews = provReviews.filter((r) => r.rating === 5);
    } else if (reviewFilterStars === "4") {
      provReviews = provReviews.filter((r) => r.rating === 4);
    } else if (reviewFilterStars === "3below") {
      provReviews = provReviews.filter((r) => r.rating <= 3);
    }

    // Sort
    if (reviewSort === "highest") {
      return [...provReviews].sort((a, b) => b.rating - a.rating);
    } else if (reviewSort === "lowest") {
      return [...provReviews].sort((a, b) => a.rating - b.rating);
    } else if (reviewSort === "helpful") {
      return [...provReviews].sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
    }
    return provReviews; // "recent" — already in most recent order
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
        {/* ============ STUDENT SWITCHER ============ */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {students.map((s) => {
            const isActive = s.id === activeStudentId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStudentId(s.id)}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isActive ? "#0F2D5E" : "#e5e7eb",
                  color: isActive ? "#ffffff" : "#374151",
                }}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{
                    backgroundColor: isActive ? "#F5A623" : "#9ca3af",
                  }}
                >
                  {getInitials(s)}
                </span>
                {s.firstName} {s.lastName}
                <span className="text-xs opacity-70">{s.grade}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowAddStudent(true)}
            className="flex items-center gap-1.5 rounded-full border-2 border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>

        {/* ============ GREETING & STATUS ============ */}
        <div className="mb-8">
          <h2
            className="text-3xl font-bold"
            style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
          >
            Welcome back, Maria!
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <Badge
              variant="success"
              className="flex items-center gap-1.5 px-3 py-1 text-sm"
            >
              <CheckCircle className="h-4 w-4" />
              Active
            </Badge>
            <p className="text-gray-600">
              Your My Spark SGO scholarship is active and ready to use.
            </p>
          </div>
        </div>

        {/* ============ POST-SESSION REVIEW NUDGE ============ */}
        {!nudgeDismissed && student.transactions.some(t => t.status === "Completed" && !reviewedTransactions.has(t.id)) && (() => {
          const recentTxn = student.transactions.find(t => t.status === "Completed" && !reviewedTransactions.has(t.id));
          const prov = providers.find(p => p.name === recentTxn.provider);
          return (
            <div style={{ border: "1px solid #F5A623", borderLeft: "4px solid #F5A623", borderRadius: 12, padding: "20px 24px", marginBottom: 24, backgroundColor: "rgba(245,166,35,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#0F2D5E", marginBottom: 4 }}>
                    How did {student.firstName}'s session at {recentTxn.provider} go?
                  </p>
                  <p style={{ fontSize: 14, color: "#6b7280" }}>
                    It takes 60 seconds and helps other families.
                  </p>
                  {/* Inline star rating - tap to open full form */}
                  <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setShowReviewForm({ provider: prov, transactionId: recentTxn.id })} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                        <Star style={{ width: 32, height: 32, color: "#F5A623", fill: "none", strokeWidth: 1.5 }} />
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setNudgeDismissed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13 }}>
                  Maybe later
                </button>
              </div>
            </div>
          );
        })()}

        {/* ============ SEL CHECK-IN BANNER ============ */}
        <Card
          className="mb-8 overflow-hidden border-l-4"
          style={{ borderLeftColor: "#F5A623", backgroundColor: "#FFFDF7" }}
        >
          <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(245, 166, 35, 0.15)" }}
              >
                <Sparkles className="h-5 w-5" style={{ color: "#F5A623" }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#0F2D5E" }}>
                  How is {student.firstName} doing?
                </p>
                <p className="text-sm text-gray-500">
                  Take our 2-minute check-in
                </p>
              </div>
            </div>
            <Button
              className="flex-shrink-0 text-white"
              style={{ backgroundColor: "#F5A623" }}
              onClick={() => {
                setShowSELSurvey(true);
                setSelResponses({});
                setSelCurrentQ(0);
                setSelComplete(false);
              }}
            >
              Start Check-In
            </Button>
          </CardContent>
        </Card>

        {/* ============ VERIFICATION STATUS ============ */}
        <div className="mb-8">
          {student.verificationStatus === "Verified" && (
            <Card
              className="overflow-hidden border-l-4"
              style={{ borderLeftColor: "#2E7D32" }}
            >
              <CardContent className="flex items-center gap-4 py-5">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(46, 125, 50, 0.12)" }}
                >
                  <CheckCircle
                    className="h-5 w-5"
                    style={{ color: "#2E7D32" }}
                  />
                </div>
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "#2E7D32" }}
                  >
                    Eligibility Verified
                  </p>
                  <p className="text-sm text-gray-500">
                    Automatically verified via school records
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {student.verificationStatus === "Pending Review" && (
            <Card
              className="overflow-hidden border-l-4"
              style={{ borderLeftColor: "#F59E0B" }}
            >
              <CardContent className="flex items-center gap-4 py-5">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(245, 158, 11, 0.12)" }}
                >
                  <Clock
                    className="h-5 w-5"
                    style={{ color: "#F59E0B" }}
                  />
                </div>
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "#F59E0B" }}
                  >
                    Verification Pending
                  </p>
                  <p className="text-sm text-gray-500">
                    Your documents are being reviewed
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {student.verificationStatus === "Action Required" && (
            <Card
              className="overflow-hidden border-l-4"
              style={{ borderLeftColor: "#DC2626" }}
            >
              <CardContent className="flex items-center gap-4 py-5">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(220, 38, 38, 0.12)" }}
                >
                  <AlertTriangle
                    className="h-5 w-5"
                    style={{ color: "#DC2626" }}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className="font-semibold"
                    style={{ color: "#DC2626" }}
                  >
                    Action Required
                  </p>
                  <p className="text-sm text-gray-500">
                    Additional documentation is needed to verify eligibility
                  </p>
                </div>
                <Button
                  className="flex items-center gap-2 text-white"
                  style={{ backgroundColor: "#DC2626" }}
                >
                  <Upload className="h-4 w-4" />
                  Upload Documents
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ============ CARD BALANCE SECTION ============ */}
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
                <div className="flex items-start justify-between">
                  <span
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    My Spark SGO
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{
                      color: "#F5A623",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Chek
                  </span>
                </div>

                <div className="my-4">
                  <p
                    className="text-xl tracking-[0.25em] text-white/90"
                    style={{ fontFamily: "'Courier New', monospace" }}
                  >
                    **** &nbsp; **** &nbsp; **** &nbsp; {student.cardLast4}
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/50">
                      Card Holder
                    </p>
                    <p
                      className="text-sm font-semibold tracking-wider text-white"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {student.firstName.toUpperCase()}{" "}
                      {student.lastName.toUpperCase()}
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
                <p className="text-sm font-medium text-gray-500">
                  Current Balance
                </p>
                <p className="text-4xl font-bold text-green-600">
                  ${student.cardBalance.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "#0F2D5E" }}
                  >
                    ${student.totalSpent.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="text-lg font-semibold text-green-600">
                    ${student.cardBalance.toFixed(2)}
                  </p>
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

        {/* ============ MAXIMIZE YOUR FUNDS ============ */}
        <Card className="mb-10 overflow-hidden border" style={{ borderColor: "#E5E7EB" }}>
          <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4
                className="text-lg font-bold"
                style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
              >
                Your ${student.totalBudget} card could go even further
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                Discover additional subsidies and scholarships
              </p>
            </div>
            <Button
              className="flex-shrink-0 text-white"
              style={{ backgroundColor: "#0F2D5E" }}
              onClick={() => setShowSubsidyFinder(true)}
            >
              Explore Funding
            </Button>
          </CardContent>
        </Card>

        {/* ============ SPENDING SUMMARY ============ */}
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
                  data={student.spendingData}
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
                  <RechartsTooltip
                    formatter={(value) => [`$${value}`, "Amount"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {student.spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#F5A623" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-600">
                  ${student.totalSpent} spent of ${student.totalBudget} total
                </span>
                <span
                  className="font-semibold"
                  style={{ color: "#0F2D5E" }}
                >
                  {spentPercent}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${spentPercent}%`,
                    background: "linear-gradient(90deg, #F5A623, #f7b84e)",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============ STUDENT JOURNEY ============ */}
        <div className="mb-10">
          <h3
            className="mb-5 text-2xl font-bold"
            style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
          >
            {student.firstName}'s Journey
          </h3>

          {/* SEL Trend Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
                Social-Emotional Growth Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activeStudentId === "stu-002" ? selTimelineMarcus : selTimeline}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" tick={{ fill: "#0F2D5E", fontSize: 12 }} />
                    <YAxis domain={[1, 5]} tick={{ fill: "#0F2D5E", fontSize: 12 }} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#0F2D5E" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="belonging" name="Belonging" stroke="#F5A623" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="schoolEngagement" name="School Engagement" stroke="#2E7D32" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="wellbeing" name="Wellbeing" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Milestones */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
                Activity Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-gray-200 pl-6">
                {(milestones[student.id] || []).map((m, idx) => (
                  <div key={idx} className="relative mb-6 last:mb-0">
                    <div
                      className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: "#F5A623" }}
                    />
                    <p className="text-xs font-medium text-gray-400">{m.date}</p>
                    <p className="text-sm font-medium text-gray-700">{m.event}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Growth Summary */}
          {(() => {
            const timeline = activeStudentId === "stu-002" ? selTimelineMarcus : selTimeline;
            const first = timeline[0].confidence;
            const last = timeline[timeline.length - 1].confidence;
            const pct = Math.round(((last - first) / first) * 100);
            return (
              <Card
                className="overflow-hidden border-l-4"
                style={{ borderLeftColor: "#2E7D32", backgroundColor: "#F0FFF4" }}
              >
                <CardContent className="py-5">
                  <p className="font-semibold" style={{ color: "#2E7D32" }}>
                    Growth Summary
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Since enrolling in September, {student.firstName}'s confidence score has grown from {first} to {last} — a {pct}% improvement!
                  </p>
                </CardContent>
              </Card>
            );
          })()}
        </div>

        {/* ============ RECOMMENDED FOR YOU (Feature 1) ============ */}
        <div className="mb-10">
          <h3
            className="mb-1 flex items-center gap-2 text-2xl font-bold"
            style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
          >
            <Sparkles className="h-6 w-6" style={{ color: "#F5A623" }} />
            Recommended for {student.firstName}
          </h3>
          <p className="mb-5 text-sm text-gray-500">
            Personalized picks based on {student.firstName}'s interests and
            location
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className="overflow-hidden border-l-4 transition-shadow hover:shadow-md"
                style={{ borderLeftColor: "#F5A623" }}
              >
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-start justify-between">
                    <h4
                      className="text-lg font-bold"
                      style={{ color: "#0F2D5E" }}
                    >
                      {rec.name}
                    </h4>
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge
                      className={`${
                        categoryColors[rec.category] ||
                        "bg-gray-100 text-gray-800"
                      } border-0`}
                    >
                      {rec.category}
                    </Badge>
                    <Badge
                      className="border-0 text-xs"
                      style={{
                        backgroundColor: "rgba(245, 166, 35, 0.15)",
                        color: "#B8860B",
                      }}
                    >
                      Recommended for {student.firstName}
                    </Badge>
                  </div>
                  <div className="mb-2 flex items-center gap-1.5">
                    <div className="flex">{renderStars(rec.rating)}</div>
                    <span className="text-sm font-semibold text-gray-700">
                      {rec.rating}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-500 italic">
                    {rec.reason}
                  </p>
                  <div className="mb-4 flex items-center gap-1.5">
                    <div className="flex">{renderStars(rec.rating, "h-3.5 w-3.5")}</div>
                    <span className="text-xs font-semibold text-gray-600">{rec.rating}</span>
                    <span className="text-xs text-gray-400">({rec.reviewCount} reviews)</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
                    onClick={() => setSelectedProvider(rec)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              className="text-sm font-medium underline"
              style={{ color: "#0F2D5E" }}
              onClick={() => {
                document
                  .querySelector("#providers-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See All Providers
            </button>
          </div>
        </div>

        {/* ============ PROVIDER MARKETPLACE (Feature 4) ============ */}
        <div className="mb-10" id="providers-section">
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
                  selectedCategory === cat
                    ? { backgroundColor: "#0F2D5E" }
                    : {}
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
                className="flex cursor-pointer flex-col justify-between transition-shadow hover:shadow-md"
                onClick={() => setSelectedProvider(provider)}
              >
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-start justify-between">
                    <h4
                      className="text-lg font-bold"
                      style={{ color: "#0F2D5E" }}
                    >
                      {provider.name}
                    </h4>
                  </div>
                  <Badge
                    className={`mb-3 ${
                      categoryColors[provider.category] ||
                      "bg-gray-100 text-gray-800"
                    } border-0`}
                  >
                    {provider.category}
                  </Badge>
                  <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {provider.address}, {provider.city}, {provider.state}{" "}
                    {provider.zip}
                  </div>
                  <div className="mb-2 flex items-center gap-1.5">
                    <div className="flex">{renderStars(provider.rating)}</div>
                    <span className="text-sm font-semibold text-gray-700">
                      {provider.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({provider.reviewCount})
                    </span>
                  </div>
                  <p className="mb-4 text-xs text-gray-400">
                    Reviews from Scholarship Families
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProvider(provider);
                    }}
                  >
                    View Details
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

        {/* ============ RECENT TRANSACTIONS ============ */}
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
                  <th
                    className="px-4 py-3 font-semibold"
                    style={{ color: "#0F2D5E" }}
                  >
                    Date
                  </th>
                  <th
                    className="px-4 py-3 font-semibold"
                    style={{ color: "#0F2D5E" }}
                  >
                    Provider
                  </th>
                  <th
                    className="px-4 py-3 font-semibold"
                    style={{ color: "#0F2D5E" }}
                  >
                    Category
                  </th>
                  <th
                    className="px-4 py-3 font-semibold"
                    style={{ color: "#0F2D5E" }}
                  >
                    Amount
                  </th>
                  <th
                    className="px-4 py-3 font-semibold"
                    style={{ color: "#0F2D5E" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-4 py-3 font-semibold"
                    style={{ color: "#0F2D5E" }}
                  >
                    Review
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {student.transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{txn.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {txn.provider}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {txn.category}
                    </td>
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
                    <td className="px-4 py-3">
                      {reviewedTransactions.has(txn.id) ? (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" />
                          Reviewed
                        </span>
                      ) : txn.status === "Completed" ? (
                        <button
                          className="rounded-full px-3 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: "#F5A623" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const prov = providers.find(p => p.name === txn.provider);
                            setShowReviewForm({ provider: prov, transactionId: txn.id });
                          }}
                        >
                          Rate
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {student.transactions.map((txn) => (
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
                  <p
                    className="mt-2 text-lg font-bold"
                    style={{ color: "#0F2D5E" }}
                  >
                    ${txn.amount.toFixed(2)}
                  </p>
                  {reviewedTransactions.has(txn.id) ? (
                    <span className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                      <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" />
                      Reviewed
                    </span>
                  ) : txn.status === "Completed" ? (
                    <button
                      className="mt-2 rounded-full px-3 py-1 text-xs font-medium text-white"
                      style={{ backgroundColor: "#F5A623" }}
                      onClick={() => {
                        const prov = providers.find(p => p.name === txn.provider);
                        setShowReviewForm({ provider: prov, transactionId: txn.id });
                      }}
                    >
                      Rate
                    </button>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ============ UPCOMING DEADLINES ============ */}
        <Card
          className="mb-10 overflow-hidden border-l-4"
          style={{ borderLeftColor: "#F5A623" }}
        >
          <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(245, 166, 35, 0.15)" }}
            >
              <AlertTriangle
                className="h-6 w-6"
                style={{ color: "#F5A623" }}
              />
            </div>
            <div className="flex-1">
              <h4
                className="text-lg font-bold"
                style={{
                  color: "#0F2D5E",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Funds Expiration Reminder
              </h4>
              <p className="mt-1 text-gray-600">
                Your unused scholarship funds will expire on{" "}
                <span className="font-semibold">June 30, 2026</span>. Make
                sure to enroll in activities before this date!
              </p>
            </div>
            <Button
              className="flex-shrink-0 text-white"
              style={{ backgroundColor: "#F5A623" }}
              onClick={() => {
                document
                  .querySelector("#providers-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Providers
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ============ ADD STUDENT MODAL ============ */}
      {showAddStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            {addStudentSuccess ? (
              <div className="flex flex-col items-center gap-4 py-10">
                <CheckCircle
                  className="h-16 w-16"
                  style={{ color: "#2E7D32" }}
                />
                <p
                  className="text-xl font-bold"
                  style={{ color: "#2E7D32" }}
                >
                  Student Added Successfully!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h3
                    className="flex items-center gap-2 text-xl font-bold"
                    style={{ color: "#0F2D5E" }}
                  >
                    <Users className="h-5 w-5" />
                    Add Another Student
                  </h3>
                  <button
                    onClick={() => setShowAddStudent(false)}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        className="mt-1"
                        value={newStudent.firstName}
                        onChange={(e) =>
                          setNewStudent((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        className="mt-1"
                        value={newStudent.lastName}
                        onChange={(e) =>
                          setNewStudent((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>School</Label>
                    <Input
                      className="mt-1"
                      value={newStudent.school}
                      onChange={(e) =>
                        setNewStudent((prev) => ({
                          ...prev,
                          school: e.target.value,
                        }))
                      }
                      placeholder="School name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Grade</Label>
                      <select
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D5E]"
                        value={newStudent.grade}
                        onChange={(e) =>
                          setNewStudent((prev) => ({
                            ...prev,
                            grade: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select grade</option>
                        <option value="6th">6th</option>
                        <option value="7th">7th</option>
                        <option value="8th">8th</option>
                      </select>
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input
                        className="mt-1"
                        type="date"
                        value={newStudent.dob}
                        onChange={(e) =>
                          setNewStudent((prev) => ({
                            ...prev,
                            dob: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="frl-checkbox"
                      checked={newStudent.frl}
                      onChange={(e) =>
                        setNewStudent((prev) => ({
                          ...prev,
                          frl: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="frl-checkbox">
                      Free/Reduced Lunch (FRL) Eligible
                    </Label>
                  </div>

                  <div>
                    <Label className="mb-2 block">Activity Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map((interest) => {
                        const selected =
                          newStudent.interests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleNewStudentInterest(interest)}
                            className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                            style={{
                              backgroundColor: selected
                                ? "#0F2D5E"
                                : "#f3f4f6",
                              color: selected ? "#ffffff" : "#374151",
                            }}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddStudent(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="text-white"
                      style={{ backgroundColor: "#0F2D5E" }}
                      onClick={handleAddStudentSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============ PROVIDER DETAIL MODAL ============ */}
      {selectedProvider && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b bg-white px-6 py-4"
            >
              <h3
                className="text-xl font-bold"
                style={{ color: "#0F2D5E" }}
              >
                {selectedProvider.name}
              </h3>
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  setShowLeaveReview(false);
                  setNewReviewRating(0);
                  setNewReviewText("");
                }}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              {/* Category & Rating */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge
                  className={`${
                    categoryColors[selectedProvider.category] ||
                    "bg-gray-100 text-gray-800"
                  } border-0`}
                >
                  {selectedProvider.category}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {renderStars(selectedProvider.rating)}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {selectedProvider.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({selectedProvider.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="mb-6 text-gray-600">
                {selectedProvider.description}
              </p>

              {/* Contact & Details */}
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span>
                    {selectedProvider.address}, {selectedProvider.city},{" "}
                    {selectedProvider.state} {selectedProvider.zip}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span>{selectedProvider.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span>{selectedProvider.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <a
                    href={selectedProvider.website}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                    style={{ color: "#0F2D5E" }}
                  >
                    {selectedProvider.website.replace("https://", "")}
                  </a>
                </div>
              </div>

              {/* Hours, Age, Pricing */}
              <div className="mb-6 grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-3">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#0F2D5E" }}
                  >
                    Hours
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Mon-Fri 3:00 PM - 8:00 PM
                  </p>
                  <p className="text-sm text-gray-600">
                    Sat 9:00 AM - 2:00 PM
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#0F2D5E" }}
                  >
                    Age Ranges
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Ages 5-18</p>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#0F2D5E" }}
                  >
                    Pricing
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedProvider.priceRange}
                  </p>
                </div>
              </div>

              {/* Photo Gallery Placeholder */}
              <div className="mb-6">
                <p
                  className="mb-3 text-sm font-semibold"
                  style={{ color: "#0F2D5E" }}
                >
                  Photos
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex aspect-video items-center justify-center rounded-lg bg-gray-100"
                    >
                      <Camera className="h-8 w-8 text-gray-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mb-6">
                <p
                  className="mb-4 text-lg font-semibold"
                  style={{ color: "#0F2D5E" }}
                >
                  Reviews
                </p>

                {/* Rating Summary Block */}
                {(() => {
                  const allRevs = reviews[selectedProvider.id] || [];
                  const totalCount = allRevs.length;
                  const avgRating = totalCount > 0 ? (allRevs.reduce((s, r) => s + r.rating, 0) / totalCount) : 0;
                  const dist = [5, 4, 3, 2, 1].map(star => ({
                    star,
                    count: allRevs.filter(r => r.rating === star).length,
                  }));
                  const maxCount = Math.max(...dist.map(d => d.count), 1);
                  return (
                    <div className="mb-5 flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:gap-8">
                      <div className="flex flex-col items-center">
                        <p className="text-4xl font-bold" style={{ color: "#0F2D5E" }}>
                          {avgRating.toFixed(1)}
                        </p>
                        <div className="my-1 flex">{renderStars(avgRating)}</div>
                        <p className="text-xs text-gray-400">{totalCount} review{totalCount !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        {dist.map(({ star, count }) => (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-8 text-right text-gray-500">{star} star</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: "#F5A623" }}
                              />
                            </div>
                            <span className="w-5 text-gray-400">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Sort & Filter Controls */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 mr-1">Sort:</span>
                  {[
                    { key: "recent", label: "Most Recent" },
                    { key: "highest", label: "Highest Rated" },
                    { key: "lowest", label: "Lowest Rated" },
                    { key: "helpful", label: "Most Helpful" },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setReviewSort(opt.key)}
                      className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: reviewSort === opt.key ? "#0F2D5E" : "#f3f4f6",
                        color: reviewSort === opt.key ? "#ffffff" : "#6b7280",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 mr-1">Filter:</span>
                  {[
                    { key: "all", label: "All Stars" },
                    { key: "5", label: "5 Stars" },
                    { key: "4", label: "4 Stars" },
                    { key: "3below", label: "3 and below" },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setReviewFilterStars(opt.key)}
                      className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: reviewFilterStars === opt.key ? "#F5A623" : "#f3f4f6",
                        color: reviewFilterStars === opt.key ? "#ffffff" : "#6b7280",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Few reviews encouragement */}
                {(reviews[selectedProvider.id] || []).length < 3 && (
                  <div className="mb-4 rounded-lg border border-dashed border-[#F5A623] bg-[#FFFDF7] p-3 text-center">
                    <p className="text-sm text-gray-600">
                      Be one of the first families to review this provider — your experience helps the whole community.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {getProviderReviews(selectedProvider.id).map((review) => (
                    <div
                      key={review.id}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <div className="flex">
                          {renderStars(review.rating, "h-3.5 w-3.5")}
                        </div>
                      </div>
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium text-gray-800">
                          {review.reviewerName}
                        </span>
                        <span className="text-gray-400">-</span>
                        <span className="text-gray-500">
                          Parent of a {review.studentGrade}
                        </span>
                        <span className="text-gray-400">-</span>
                        <span className="text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{review.text}</p>
                      {/* Tags */}
                      {review.tags && review.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {review.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="rounded-full px-2 py-0.5 text-xs font-medium"
                              style={{ backgroundColor: "rgba(245,166,35,0.12)", color: "#B8860B" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Helpful button */}
                      <div className="mt-2">
                        <button className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
                          Helpful? 👍 {review.helpful || 0}
                        </button>
                      </div>
                      {/* Provider Response */}
                      {review.providerResponse && (
                        <div className="mt-3 rounded-lg bg-gray-100 p-3">
                          <p className="mb-1 text-xs font-semibold text-gray-500">
                            Response from {selectedProvider.name}
                          </p>
                          <p className="text-sm text-gray-600">{review.providerResponse}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {getProviderReviews(selectedProvider.id).length === 0 && (
                    <p className="py-6 text-center text-sm text-gray-400">
                      No reviews yet. Be the first to leave a review!
                    </p>
                  )}
                </div>

                {/* Share Your Experience / Leave a Review */}
                {(() => {
                  const hasTransactions = student.transactions.some(t => t.provider === selectedProvider.name);
                  if (hasTransactions) {
                    return (
                      <Button
                        variant="outline"
                        className="mt-4 w-full border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623] hover:text-white"
                        onClick={() => setShowReviewForm({ provider: selectedProvider, transactionId: null })}
                      >
                        Share Your Experience
                      </Button>
                    );
                  }
                  return (
                    <div className="mt-4" title="You'll be able to leave a review after your first session">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-400 cursor-not-allowed"
                        disabled
                      >
                        Share Your Experience
                      </Button>
                      <p className="mt-1 text-center text-xs text-gray-400">
                        You'll be able to leave a review after your first session
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 text-white"
                  style={{ backgroundColor: "#0F2D5E" }}
                >
                  Enroll
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProvider(null);
                    setShowLeaveReview(false);
                    setNewReviewRating(0);
                    setNewReviewText("");
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ============ SEL SURVEY MODAL ============ */}
      {showSELSurvey && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            {selComplete ? (
              /* Thank-you screen */
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(46, 125, 50, 0.12)" }}
                >
                  <CheckCircle className="h-10 w-10" style={{ color: "#2E7D32" }} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>
                  Thank you for sharing about {student.firstName}!
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  It sounds like {student.firstName} is really finding her confidence in dance — that's exactly what My Spark is for.
                </p>
                <Button
                  className="mt-4 text-white"
                  style={{ backgroundColor: "#0F2D5E" }}
                  onClick={() => setShowSELSurvey(false)}
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>
                    SEL Check-In
                  </h3>
                  <button
                    onClick={() => setShowSELSurvey(false)}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Survey type selector (demo) */}
                <div className="mb-5">
                  <Label className="mb-1 block text-sm text-gray-500">Survey Type</Label>
                  <select
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D5E]"
                    value={selSurveyType}
                    onChange={(e) => {
                      setSelSurveyType(e.target.value);
                      setSelResponses({});
                      setSelCurrentQ(0);
                    }}
                  >
                    {surveyTypes.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.duration}, {st.questionCount} questions)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="mb-1 flex justify-between text-xs text-gray-400">
                    <span>Question {selCurrentQ + 1} of {monthlyQuestions.length}</span>
                    <span>{Math.round(((selCurrentQ) / monthlyQuestions.length) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(selCurrentQ / monthlyQuestions.length) * 100}%`,
                        backgroundColor: "#F5A623",
                      }}
                    />
                  </div>
                </div>

                {/* Current Question */}
                {(() => {
                  const q = monthlyQuestions[selCurrentQ];
                  return (
                    <div className="mb-6">
                      <p className="mb-4 text-lg font-medium" style={{ color: "#0F2D5E" }}>
                        {q.text}
                      </p>
                      {q.type === "scale" ? (
                        <div className="flex justify-center gap-3">
                          {[
                            { emoji: "\uD83D\uDE22", val: 1 },
                            { emoji: "\uD83D\uDE15", val: 2 },
                            { emoji: "\uD83D\uDE10", val: 3 },
                            { emoji: "\uD83D\uDE42", val: 4 },
                            { emoji: "\uD83D\uDE04", val: 5 },
                          ].map(({ emoji, val }) => (
                            <button
                              key={val}
                              onClick={() =>
                                setSelResponses((prev) => ({ ...prev, [q.id]: val }))
                              }
                              className="flex h-14 w-14 items-center justify-center rounded-xl border-2 text-2xl transition-all"
                              style={{
                                borderColor: selResponses[q.id] === val ? "#F5A623" : "#e5e7eb",
                                backgroundColor: selResponses[q.id] === val ? "rgba(245,166,35,0.1)" : "transparent",
                                transform: selResponses[q.id] === val ? "scale(1.15)" : "scale(1)",
                              }}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <Textarea
                          rows={4}
                          placeholder="Share your thoughts..."
                          value={selResponses[q.id] || ""}
                          onChange={(e) =>
                            setSelResponses((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                        />
                      )}
                    </div>
                  );
                })()}

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    disabled={selCurrentQ === 0}
                    onClick={() => setSelCurrentQ((p) => p - 1)}
                  >
                    Back
                  </Button>
                  {selCurrentQ < monthlyQuestions.length - 1 ? (
                    <Button
                      className="text-white"
                      style={{ backgroundColor: "#0F2D5E" }}
                      disabled={selResponses[monthlyQuestions[selCurrentQ].id] == null}
                      onClick={() => setSelCurrentQ((p) => p + 1)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      className="text-white"
                      style={{ backgroundColor: "#2E7D32" }}
                      disabled={selResponses[monthlyQuestions[selCurrentQ].id] == null}
                      onClick={() => setSelComplete(true)}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============ SUBSIDY FINDER MODAL ============ */}
      {showSubsidyFinder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b bg-white px-6 py-4">
              <h3 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>
                Maximize Your Funds
              </h3>
              <button
                onClick={() => setShowSubsidyFinder(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              {/* Explainer */}
              <div
                className="mb-6 rounded-lg p-4"
                style={{ backgroundColor: "rgba(245, 166, 35, 0.08)", border: "1px solid rgba(245, 166, 35, 0.25)" }}
              >
                <h4 className="mb-1 font-semibold" style={{ color: "#0F2D5E" }}>
                  How stacking works with your My Spark card
                </h4>
                <p className="text-sm text-gray-600">
                  Many families qualify for additional subsidies and scholarships beyond their My Spark SGO funds. By "stacking" multiple funding sources, you can stretch your child's enrichment budget even further. Browse the options below and apply to any that fit your family's situation.
                </p>
              </div>

              {/* Subsidy Grid */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                {subsidyData.map((sub) => {
                  const isFlagged = flaggedSubsidies.includes(sub.id);
                  const matchColor =
                    sub.matchScore === "High"
                      ? { bg: "#DEF7EC", text: "#03543F" }
                      : sub.matchScore === "Medium"
                      ? { bg: "#FEF3C7", text: "#92400E" }
                      : { bg: "#F3F4F6", text: "#6B7280" };
                  return (
                    <Card key={sub.id} className="flex flex-col justify-between">
                      <CardContent className="pt-5">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold" style={{ color: "#0F2D5E" }}>
                            {sub.name}
                          </h4>
                          <Badge
                            className="flex-shrink-0 border-0 text-xs"
                            style={{ backgroundColor: matchColor.bg, color: matchColor.text }}
                          >
                            {sub.matchScore}
                          </Badge>
                        </div>
                        <p className="mb-1 text-xs text-gray-400">{sub.provider}</p>
                        <p className="mb-2 text-sm font-semibold" style={{ color: "#F5A623" }}>
                          {sub.typicalAward}
                        </p>
                        <p className="mb-3 text-xs text-gray-500">{sub.description}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 text-xs">
                            Learn More
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 text-xs text-white"
                            style={{ backgroundColor: isFlagged ? "#2E7D32" : "#0F2D5E" }}
                            onClick={() =>
                              setFlaggedSubsidies((prev) =>
                                isFlagged
                                  ? prev.filter((id) => id !== sub.id)
                                  : [...prev, sub.id]
                              )
                            }
                          >
                            {isFlagged ? "Added" : "Add to My Funds"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* My Stacked Funds Summary */}
              <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: "#0F2D5E" }}>
                <CardContent className="py-5">
                  <h4 className="mb-3 font-bold" style={{ color: "#0F2D5E" }}>
                    My Stacked Funds
                  </h4>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">My Spark Balance</span>
                      <span className="font-semibold">${student.cardBalance.toFixed(2)}</span>
                    </div>
                    {flaggedSubsidies.map((fId) => {
                      const sub = subsidyData.find((s) => s.id === fId);
                      return (
                        <div key={fId} className="flex justify-between">
                          <span className="text-gray-600">{sub?.name}</span>
                          <span className="font-semibold text-green-600">{sub?.typicalAward}</span>
                        </div>
                      );
                    })}
                    <hr className="my-1" />
                    <div className="flex justify-between text-base font-bold" style={{ color: "#0F2D5E" }}>
                      <span>Combined Potential</span>
                      <span>
                        ${student.cardBalance.toFixed(2)}
                        {flaggedSubsidies.length > 0 && " + subsidies"}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs italic text-gray-400">
                    Tell us when you've been approved for additional funding and we'll reflect it here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      {/* ============ REVIEW FORM MODAL ============ */}
      {showReviewForm && showReviewForm.provider && (
        <ReviewForm
          provider={showReviewForm.provider}
          studentName={student.firstName}
          studentGrade={student.grade}
          parentName="Maria"
          onSubmit={(reviewData) => {
            // Add to reviewedTransactions
            if (showReviewForm.transactionId) {
              setReviewedTransactions(prev => new Set([...prev, showReviewForm.transactionId]));
            }
          }}
          onClose={() => setShowReviewForm(null)}
        />
      )}
    </Layout>
  );
}

export default FamilyDashboard;
