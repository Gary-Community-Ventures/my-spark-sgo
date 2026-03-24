import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Pencil,
  Star,
} from "lucide-react";
import reviews from "@/data/reviews";

const paymentHistory = [
  { date: "Mar 18, 2026", studentRef: "STU-2026-0042", amount: 150.0, status: "Completed" },
  { date: "Mar 15, 2026", studentRef: "STU-2026-0038", amount: 125.0, status: "Processing" },
  { date: "Mar 12, 2026", studentRef: "STU-2026-0051", amount: 200.0, status: "Completed" },
  { date: "Mar 08, 2026", studentRef: "STU-2026-0029", amount: 75.0, status: "Completed" },
  { date: "Mar 04, 2026", studentRef: "STU-2026-0063", amount: 125.0, status: "Pending" },
  { date: "Feb 28, 2026", studentRef: "STU-2026-0017", amount: 100.0, status: "Completed" },
  { date: "Feb 22, 2026", studentRef: "STU-2026-0044", amount: 150.0, status: "Completed" },
  { date: "Feb 18, 2026", studentRef: "STU-2026-0033", amount: 125.0, status: "Processing" },
  { date: "Feb 12, 2026", studentRef: "STU-2026-0055", amount: 50.0, status: "Completed" },
  { date: "Feb 05, 2026", studentRef: "STU-2026-0021", amount: 175.0, status: "Completed" },
];

const paymentTotal = paymentHistory.reduce((sum, row) => sum + row.amount, 0);

const documents = [
  { name: "W-9 Form", status: "on-file", date: "Jan 10, 2026" },
  { name: "Certificate of Insurance", status: "on-file", date: "Jan 10, 2026" },
  { name: "Background Check Policy", status: "on-file", date: "Jan 12, 2026" },
  { name: "501(c)(3) Letter", status: "on-file", date: "Dec 15, 2025" },
  { name: "State Business Registration", status: "expiring", expDate: "Apr 15, 2026" },
];

function statusBadge(status) {
  if (status === "Completed") {
    return <Badge variant="success">{status}</Badge>;
  }
  if (status === "Processing") {
    return <Badge variant="secondary">{status}</Badge>;
  }
  return (
    <Badge className="border-transparent bg-gray-400 text-white hover:bg-gray-400/80">
      {status}
    </Badge>
  );
}

const providerReviews = reviews["prov-001"] || [];
const avgRating =
  providerReviews.length > 0
    ? providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length
    : 0;
const totalReviews = providerReviews.length;

// Build rating breakdown (5 down to 1)
const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
  star,
  count: providerReviews.filter((r) => r.rating === star).length,
}));

function FilledStars({ count, size = "h-5 w-5" }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < count ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
    </span>
  );
}

function MyReviewsTab() {
  return (
    <div>
      {/* Aggregate Summary */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center text-center">
              <p
                className="text-5xl font-bold"
                style={{ color: "#0F2D5E" }}
              >
                {avgRating.toFixed(1)}
              </p>
              <div className="mt-2">
                <FilledStars count={Math.round(avgRating)} size="h-6 w-6" />
              </div>
              <p className="mt-1 text-sm text-gray-500">Average Rating</p>
            </div>

            {/* Total Reviews */}
            <div className="flex flex-col items-center justify-center text-center">
              <p
                className="text-5xl font-bold"
                style={{ color: "#0F2D5E" }}
              >
                {totalReviews}
              </p>
              <p className="mt-2 text-sm text-gray-500">Total Reviews</p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              <p
                className="mb-2 text-sm font-semibold"
                style={{ color: "#0F2D5E" }}
              >
                Rating Breakdown
              </p>
              {ratingBreakdown.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-12 text-gray-600">{star}-star</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width:
                          totalReviews > 0
                            ? `${(count / totalReviews) * 100}%`
                            : "0%",
                        backgroundColor: "#F5A623",
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-medium text-gray-700">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Review Cards */}
      <div className="space-y-4">
        {providerReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center justify-between">
                <FilledStars count={review.rating} />
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="mb-2 font-semibold" style={{ color: "#0F2D5E" }}>
                {review.reviewerName}{" "}
                <span className="font-normal text-gray-500">
                  &middot; Parent of a {review.studentGrade}
                </span>
              </p>
              <p className="text-gray-700">{review.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProviderDashboard() {
  return (
    <Layout>
      <PageHeader
        title="Provider Dashboard"
        description="Manage your provider profile, track payments, and keep documents up to date."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Dashboard", href: "#" },
          { label: "Provider Dashboard" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ============ 1. GREETING & STATUS ============ */}
        <div className="mb-8">
          <h2
            className="text-3xl font-bold"
            style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
          >
            Welcome, Denver Academy of Dance
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <Badge variant="success" className="flex items-center gap-1.5 px-3 py-1 text-sm">
              <CheckCircle className="h-4 w-4" />
              Approved Provider
            </Badge>
            <p className="text-gray-600">
              Your organization is approved and eligible to receive My Spark SGO scholarship payments.
            </p>
          </div>
        </div>

        {/* ============ 2. SUMMARY STATS ============ */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Received YTD */}
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(46, 125, 50, 0.12)" }}
              >
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Received YTD</p>
                <p className="text-2xl font-bold" style={{ color: "#0F2D5E" }}>
                  $12,450.00
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Students Served */}
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(15, 45, 94, 0.1)" }}
              >
                <Users className="h-6 w-6" style={{ color: "#0F2D5E" }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Students Served</p>
                <p className="text-2xl font-bold" style={{ color: "#0F2D5E" }}>
                  28
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Average Transaction */}
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(245, 166, 35, 0.12)" }}
              >
                <TrendingUp className="h-6 w-6" style={{ color: "#F5A623" }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Transaction</p>
                <p className="text-2xl font-bold" style={{ color: "#0F2D5E" }}>
                  $125.00
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(245, 166, 35, 0.12)" }}
              >
                <Clock className="h-6 w-6" style={{ color: "#F5A623" }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold" style={{ color: "#F5A623" }}>
                  $350.00
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============ 3. MY PROFILE CARD ============ */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle
              className="flex items-center gap-2 text-xl"
              style={{ color: "#0F2D5E" }}
            >
              <Building2 className="h-5 w-5" />
              My Provider Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Organization Name</p>
                  <p className="text-lg font-semibold" style={{ color: "#0F2D5E" }}>
                    Denver Academy of Dance
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Organization Type</p>
                  <p className="font-medium text-gray-800">Nonprofit 501(c)(3)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Approval Status</p>
                  <Badge variant="success" className="mt-1 flex w-fit items-center gap-1.5 px-3 py-1 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Approved
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Activities Offered</p>
                  <div className="mt-1 flex gap-2">
                    <Badge className="border-0 bg-pink-100 text-pink-800">Dance</Badge>
                    <Badge className="border-0 bg-purple-100 text-purple-800">Arts</Badge>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>info@denveracademyofdance.org</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>(303) 555-0192</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>1234 Colfax Ave, Denver, CO 80204</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Service Area</p>
                  <p className="text-gray-700">Denver, Adams County</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ============ 4. TABS: PAYMENTS / MY REVIEWS / DOCUMENTS ============ */}
        <Tabs defaultValue="payments" className="mb-10">
          <TabsList className="mb-6">
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* ---- Payments Tab ---- */}
          <TabsContent value="payments">
            <div>
              <h3
                className="mb-4 text-2xl font-bold"
                style={{ color: "#0F2D5E", fontFamily: "Inter, sans-serif" }}
              >
                Payment History
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
                        Student Reference #
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
                    {paymentHistory.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">{row.date}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{row.studentRef}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          ${row.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">{statusBadge(row.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 bg-gray-50">
                    <tr>
                      <td
                        className="px-4 py-3 font-bold"
                        style={{ color: "#0F2D5E" }}
                        colSpan={2}
                      >
                        Total
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: "#0F2D5E" }}>
                        ${paymentTotal.toFixed(2)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="flex flex-col gap-3 sm:hidden">
                {paymentHistory.map((row, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-semibold text-gray-800">{row.studentRef}</span>
                        {statusBadge(row.status)}
                      </div>
                      <div className="text-sm text-gray-500">{row.date}</div>
                      <p className="mt-2 text-lg font-bold" style={{ color: "#0F2D5E" }}>
                        ${row.amount.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                <div className="rounded-lg border bg-gray-50 px-4 py-3 text-right">
                  <span className="font-bold" style={{ color: "#0F2D5E" }}>
                    Total: ${paymentTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ---- My Reviews Tab ---- */}
          <TabsContent value="reviews">
            <MyReviewsTab />
          </TabsContent>

          {/* ---- Documents Tab ---- */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2 text-xl"
                  style={{ color: "#0F2D5E" }}
                >
                  <FileText className="h-5 w-5" />
                  Document Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        {doc.status === "on-file" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{doc.name}</p>
                          {doc.status === "on-file" && (
                            <p className="text-sm text-gray-500">
                              Uploaded {doc.date}
                            </p>
                          )}
                          {doc.status === "expiring" && (
                            <p className="text-sm font-semibold text-red-600">
                              Expiring Soon! Exp: {doc.expDate}
                            </p>
                          )}
                        </div>
                      </div>
                      {doc.status === "on-file" ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          On File
                        </Badge>
                      ) : (
                        <Badge className="flex items-center gap-1 border-transparent bg-amber-500 text-white hover:bg-amber-500/80">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-end">
                  <Button
                    className="flex items-center gap-2 text-white"
                    style={{ backgroundColor: "#F5A623" }}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default ProviderDashboard;
