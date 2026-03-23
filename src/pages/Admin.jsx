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
} from "lucide-react";
import familyApplications from "@/data/familyApplications";
import providerApplications from "@/data/providerApplications";
import activityFeed from "@/data/activityFeed";

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

function Admin() {
  const handleReview = (id, type) => {
    alert(`Opening review for ${type} application: ${id}`);
  };

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
        </Tabs>
      </div>
    </Layout>
  );
}

export default Admin;
