import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  X,
  Clock,
  Users,
  Shield,
  Flag,
  Download,
  Filter,
  SortAsc,
  Zap,
  Eye,
  CheckSquare,
  XCircle,
  Mail,
  ToggleLeft,
  ToggleRight,
  FileText,
  Building2,
  User,
  GraduationCap,
} from "lucide-react";
import familyApplications from "@/data/familyApplications";
import providerApplications from "@/data/providerApplications";

const NAVY = "#0F2D5E";
const GOLD = "#F5A623";
const SUCCESS = "#2E7D32";

const confidenceBadgeClasses = {
  "Strong Approve": "bg-green-100 text-green-800",
  "Likely Approve": "bg-lime-100 text-lime-800",
  "Review Needed": "bg-amber-100 text-amber-800",
  "Likely Deny": "bg-orange-100 text-orange-800",
  "Strong Deny": "bg-red-100 text-red-800",
};

const confidenceOrder = [
  "Strong Deny",
  "Likely Deny",
  "Review Needed",
  "Likely Approve",
  "Strong Approve",
];

function parseTimeInQueue(str) {
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function generateMockAnalysis(app, isProvider) {
  const conf = app.aiConfidence;
  const isStrong = conf === "Strong Approve";
  const isLikely = conf === "Likely Approve";
  const isReview = conf === "Review Needed";
  const isDeny = conf === "Likely Deny" || conf === "Strong Deny";

  if (isProvider) {
    const docs = app.docsUploaded || {};
    const completeness = [
      { item: "W-9 Form", status: docs.w9 ? "complete" : "missing" },
      {
        item: "General Liability Insurance",
        status: docs.insurance ? "complete" : "missing",
      },
      {
        item: "Background Check Policy",
        status: docs.backgroundCheck ? "complete" : "missing",
      },
      {
        item: "501(c)(3) Determination / Entity Docs",
        status:
          docs.determination501c3 ||
          app.type === "For-Profit" ||
          app.type === "LLC"
            ? "complete"
            : "missing",
      },
      {
        item: "State Registration",
        status: docs.stateRegistration ? "complete" : "missing",
      },
    ];

    const hasFlags =
      app.flags && app.flags.some((f) => f.type !== "none");

    let recommendation = "Approve";
    if (isDeny) recommendation = "Deny";
    else if (isReview) recommendation = "Request More Information";
    else if (isLikely || hasFlags) recommendation = "Approve with Conditions";

    return {
      orgLegitimacy: isStrong || isLikely
        ? `EIN ${app.ein} verified against IRS database. ${app.orgName} is a registered ${app.type} entity founded in ${app.yearFounded}. No adverse findings.`
        : isDeny
        ? `EIN ${app.ein} returned limited results. ${app.orgName} was formed in ${app.yearFounded} and has minimal public footprint. Further verification recommended.`
        : `EIN ${app.ein} found in IRS records. ${app.orgName} is a ${app.type} entity. Some documentation gaps require follow-up before legitimacy can be fully confirmed.`,
      documentCompleteness: completeness.filter((c) => c.status === "complete").length + "/" + completeness.length + " required documents on file.",
      insuranceAdequacy: docs.insurance
        ? `General liability insurance is on file, expiring ${docs.insuranceExpiry}. ${
            new Date(docs.insuranceExpiry) < new Date("2026-06-01")
              ? "Expiration is within 90 days — renewal confirmation recommended."
              : "Coverage is current and adequate."
          }`
        : "No insurance documentation on file. This is a blocking requirement.",
      activityAlignment: `Activities offered (${(app.activities || []).join(", ")}) align with SGO-eligible enrichment categories. Service area covers ${(app.serviceArea || []).join(", ")}.`,
      networkCheck: "No existing provider with the same name or EIN found in the current network.",
      redFlags: hasFlags
        ? app.flags.filter((f) => f.type !== "none").map((f) => f.description).join(" ")
        : "No red flags detected.",
      recommendation,
      justification: isStrong
        ? `${app.orgName} presents a complete and well-documented application. All required documents are on file, insurance is current, and the organization has an established track record. Recommend immediate approval.`
        : isLikely
        ? `${app.orgName} is a strong applicant with minor documentation gaps. Recommend conditional approval pending resolution of flagged items within 14 days.`
        : isReview
        ? `${app.orgName} has several incomplete items that prevent a confident determination. Recommend requesting additional information before proceeding.`
        : `${app.orgName} has significant gaps in documentation and/or legitimacy verification. The application does not meet minimum requirements for approval at this time.`,
      suggestedEmail: isStrong || isLikely
        ? `Dear ${app.contactName},\n\nThank you for applying to join the My Spark SGO provider network. We are pleased to inform you that your application for ${app.orgName} has been ${isStrong ? "approved" : "conditionally approved"}.\n\n${isLikely ? "To finalize your approval, please submit the following within 14 days:\n- " + app.flags.filter(f => f.type !== "none").map(f => f.description).join("\n- ") + "\n\n" : ""}Our team will be in touch with onboarding details and next steps.\n\nWarm regards,\nMy Spark SGO Team`
        : isReview
        ? `Dear ${app.contactName},\n\nThank you for your interest in joining the My Spark SGO provider network. After our initial review of the application for ${app.orgName}, we need some additional information before we can proceed.\n\nPlease provide the following:\n- ${app.flags.filter(f => f.type !== "none").map(f => f.description).join("\n- ")}\n\nPlease respond within 14 business days.\n\nBest regards,\nMy Spark SGO Team`
        : `Dear ${app.contactName},\n\nThank you for your interest in the My Spark SGO provider network. After careful review, we are unable to approve the application for ${app.orgName} at this time.\n\nThe following concerns were identified:\n- ${app.flags.filter(f => f.type !== "none").map(f => f.description).join("\n- ")}\n\nYou are welcome to reapply once these items have been addressed.\n\nBest regards,\nMy Spark SGO Team`,
      completeness,
      confidence: isStrong ? "High" : isLikely ? "Medium-High" : isReview ? "Medium" : "Low",
    };
  }

  // Family analysis
  const completeness = [
    { item: "Parent/Guardian Information", status: app.parentName && app.email ? "complete" : "missing" },
    { item: "Student Information", status: app.studentName && app.grade && app.school ? "complete" : app.school ? "complete" : "missing" },
    { item: "FRL Verification", status: app.frlVerification === "auto_verified" ? "complete" : app.frlVerification === "document_uploaded" ? "flagged" : "missing" },
    { item: "Proof of Residency", status: (app.documentsUploaded || []).includes("Proof of Residency") ? "complete" : "missing" },
    { item: "FRL Approval Letter", status: (app.documentsUploaded || []).includes("FRL Approval Letter") ? "complete" : "missing" },
    { item: "Activity Interests", status: (app.interests || []).length > 0 ? "complete" : "missing" },
    { item: "Interest Reason", status: app.interestReason ? "complete" : "missing" },
  ];

  const hasFlags = app.flags && app.flags.some((f) => f.type !== "none");

  let recommendation = "Approve";
  if (isDeny) recommendation = "Deny";
  else if (isReview) recommendation = "Request More Information";
  else if (isLikely && hasFlags) recommendation = "Approve with Conditions";

  return {
    eligibility: isStrong || isLikely
      ? `Yes — Student ${app.studentName} is enrolled in ${app.school || "N/A"} within ${app.district || "N/A"}. Age (${app.age}) and grade (${app.grade}) are consistent.`
      : isReview
      ? `Needs Verification — ${app.flags.filter(f => f.type !== "none").map(f => f.description).join(" ")}`
      : `No — ${app.flags.filter(f => f.type !== "none").map(f => f.description).join(" ")}`,
    confidence: isStrong ? "High" : isLikely ? "Medium-High" : isReview ? "Medium" : "Low",
    frlStatus: app.frlVerification === "auto_verified"
      ? "Auto-verified through district FRL database. No further action needed."
      : app.frlVerification === "document_uploaded"
      ? "Document uploaded but not auto-verified. Manual review of uploaded income documentation recommended."
      : app.frlVerification === "pending"
      ? "FRL verification is pending. No documentation has been provided yet."
      : "Not verified. No FRL documentation or verification on file.",
    completeness,
    duplicateCheck: app.flags?.some((f) => f.type === "potential_duplicate")
      ? app.flags.find((f) => f.type === "potential_duplicate").description
      : "No duplicate applications detected for this student.",
    riskFlags: hasFlags
      ? app.flags.filter((f) => f.type !== "none").map((f) => f.description).join(" ")
      : "No risk flags identified.",
    recommendation,
    justification: isStrong
      ? `This application for ${app.studentName} is complete, fully verified, and meets all eligibility criteria. FRL status is ${app.frlVerification === "auto_verified" ? "auto-verified" : "documented"}, all required documents are on file, and no risk flags were identified. Recommend immediate approval.`
      : isLikely
      ? `${app.studentName}'s application is strong overall with minor items requiring attention. ${hasFlags ? app.flags.filter(f => f.type !== "none").map(f => f.description).join(" ") : ""} Recommend approval with follow-up on flagged items.`
      : isReview
      ? `${app.studentName}'s application cannot be fully evaluated due to outstanding questions. ${app.flags.filter(f => f.type !== "none").map(f => f.description).join(" ")} Recommend requesting additional information before making a determination.`
      : `${app.studentName}'s application has significant concerns that prevent approval. ${app.flags.filter(f => f.type !== "none").map(f => f.description).join(" ")} Recommend denial with an invitation to reapply once issues are resolved.`,
    suggestedEmail: isStrong || isLikely
      ? `Dear ${app.parentName},\n\nGreat news! We are delighted to let you know that ${app.studentName}'s application to the My Spark SGO scholarship program has been ${isStrong ? "approved" : "conditionally approved"}.\n\n${isLikely && hasFlags ? "To finalize enrollment, please provide the following within 14 days:\n- " + app.flags.filter(f => f.type !== "none").map(f => f.description).join("\n- ") + "\n\n" : ""}${app.preferredLanguage !== "English" ? "(This message is also available in " + app.preferredLanguage + " upon request.)\n\n" : ""}Our team will follow up with provider matching and next steps shortly.\n\nWarm regards,\nMy Spark SGO Team`
      : isReview
      ? `Dear ${app.parentName},\n\nThank you for submitting ${app.studentName}'s application to the My Spark SGO program. We've begun our review and need a bit more information to move forward.\n\nCould you please provide:\n- ${app.flags.filter(f => f.type !== "none").map(f => f.description).join("\n- ")}\n\n${app.preferredLanguage !== "English" ? "(This message is also available in " + app.preferredLanguage + " upon request.)\n\n" : ""}Please respond within 14 business days so we can continue processing the application.\n\nBest regards,\nMy Spark SGO Team`
      : `Dear ${app.parentName},\n\nThank you for your interest in the My Spark SGO scholarship program. After reviewing ${app.studentName}'s application, we are unable to approve it at this time.\n\nThe following issues were identified:\n- ${app.flags.filter(f => f.type !== "none").map(f => f.description).join("\n- ")}\n\nYou are welcome to submit a new application once these items have been addressed. If you believe this decision was made in error, please contact us.\n\n${app.preferredLanguage !== "English" ? "(This message is also available in " + app.preferredLanguage + " upon request.)\n\n" : ""}Best regards,\nMy Spark SGO Team`,
  };
}

export default function ReviewQueue() {
  const [activeTab, setActiveTab] = useState("families");
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewMode, setReviewMode] = useState("queue");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [applications, setApplications] = useState([...familyApplications]);
  const [provApplications, setProvApplications] = useState([...providerApplications]);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [showActionModal, setShowActionModal] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [overrideActive, setOverrideActive] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [batchSelected, setBatchSelected] = useState(new Set());
  const [batchSuccess, setBatchSuccess] = useState(null);
  const [actionEmailText, setActionEmailText] = useState("");

  const allApps = [...applications, ...provApplications];
  const pendingApps = allApps.filter(
    (a) => a.status === "Pending Review" || a.status === "Under Review"
  );
  const pendingCount = pendingApps.length;
  const avgTimeInQueue =
    pendingApps.length > 0
      ? (
          pendingApps.reduce((s, a) => s + parseTimeInQueue(a.timeInQueue), 0) /
          pendingApps.length
        ).toFixed(1)
      : "0.0";
  const aiPreScreened = allApps.filter(
    (a) => a.aiConfidence === "Strong Approve" || a.aiConfidence === "Likely Approve"
  ).length;
  const flaggedCount = allApps.filter(
    (a) =>
      a.aiConfidence === "Review Needed" ||
      a.aiConfidence === "Likely Deny" ||
      a.aiConfidence === "Strong Deny"
  ).length;

  const currentList = activeTab === "families" ? applications : provApplications;
  const setCurrentList = activeTab === "families" ? setApplications : setProvApplications;

  const filteredApps = currentList
    .filter((a) => {
      if (filter === "all") return true;
      return a.aiConfidence === filter;
    })
    .sort((a, b) => {
      if (sortBy === "confidence") {
        return confidenceOrder.indexOf(a.aiConfidence) - confidenceOrder.indexOf(b.aiConfidence);
      }
      return parseTimeInQueue(b.timeInQueue) - parseTimeInQueue(a.timeInQueue);
    });

  const currentQueueIndex = selectedApp
    ? filteredApps.findIndex((a) => a.id === selectedApp.id)
    : -1;

  const loadAiAnalysis = useCallback(
    async (app) => {
      setAiLoading(true);
      setAiAnalysis(null);

      const isProvider = app.id.startsWith("prov");

      if (apiKey) {
        try {
          const systemPrompt = isProvider
            ? "You are an expert provider vetting analyst reviewing a provider application for the My Spark SGO program. Return your analysis as structured text with these sections: ORGANIZATION LEGITIMACY CHECK (cross-reference EIN), DOCUMENT COMPLETENESS, INSURANCE ADEQUACY, ACTIVITY TYPE ALIGNMENT, EXISTING NETWORK CHECK, RED FLAGS, RECOMMENDED DECISION (Approve/Approve with Conditions/Request More Information/Deny with justification), SUGGESTED ONBOARDING EMAIL."
            : "You are an expert SGO eligibility analyst reviewing a family scholarship application for the My Spark SGO program. Return your analysis as structured text with these sections: ELIGIBILITY DETERMINATION (Yes/No/Needs Verification with explanation), CONFIDENCE LEVEL (High/Medium/Low), FRL VERIFICATION STATUS, COMPLETENESS CHECK (list required fields/docs), DUPLICATE DETECTION, RISK FLAGS, RECOMMENDED DECISION (Approve/Approve with Conditions/Request More Information/Deny with justification paragraph), SUGGESTED EMAIL (personalized email to the family).";

          const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
              "anthropic-dangerous-direct-browser-access": "true",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 2000,
              system: systemPrompt,
              messages: [{ role: "user", content: JSON.stringify(app) }],
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.content?.[0]?.text || "";
            // Parse raw API response into display - store as raw text
            setAiAnalysis({ raw: text, isRaw: true, recommendation: app.aiConfidence.includes("Approve") ? "Approve" : app.aiConfidence === "Review Needed" ? "Request More Information" : "Deny" });
          } else {
            // Fallback to mock
            setAiAnalysis(generateMockAnalysis(app, isProvider));
          }
        } catch {
          setAiAnalysis(generateMockAnalysis(app, isProvider));
        }
      } else {
        // Simulate loading delay
        await new Promise((r) => setTimeout(r, 1200));
        setAiAnalysis(generateMockAnalysis(app, isProvider));
      }

      setAiLoading(false);
    },
    [apiKey]
  );

  useEffect(() => {
    if (selectedApp && reviewMode === "review") {
      loadAiAnalysis(selectedApp);
    }
  }, [selectedApp, reviewMode, loadAiAnalysis]);

  function openReview(app) {
    setSelectedApp(app);
    setReviewMode("review");
    setOverrideActive(false);
    setOverrideReason("");
  }

  function handleBackToQueue() {
    setSelectedApp(null);
    setReviewMode("queue");
    setAiAnalysis(null);
    setOverrideActive(false);
    setOverrideReason("");
  }

  function navigateReview(direction) {
    const idx = currentQueueIndex + direction;
    if (idx >= 0 && idx < filteredApps.length) {
      setSelectedApp(filteredApps[idx]);
      setOverrideActive(false);
      setOverrideReason("");
    }
  }

  function openActionModal(type) {
    const emailText = aiAnalysis?.suggestedEmail || aiAnalysis?.raw || "";
    setActionEmailText(emailText);
    setShowActionModal({ type, app: selectedApp });
  }

  function confirmAction() {
    if (!showActionModal) return;
    const { type, app } = showActionModal;
    const newStatus =
      type === "approve" ? "Approved" : type === "info" ? "Info Requested" : "Denied";

    const isProvider = app.id.startsWith("prov");
    if (isProvider) {
      setProvApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a))
      );
    } else {
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a))
      );
    }

    setShowActionModal(null);
    setSelectedApp(null);
    setReviewMode("queue");
    setAiAnalysis(null);
  }

  function handleClearStrongApprovals() {
    setShowBulkConfirm(true);
  }

  const strongApproveNoFlags = currentList.filter(
    (a) =>
      a.aiConfidence === "Strong Approve" &&
      (!a.flags || a.flags.every((f) => f.type === "none")) &&
      (a.status === "Pending Review" || a.status === "Under Review")
  );

  function confirmBulkApprove() {
    const ids = new Set(strongApproveNoFlags.map((a) => a.id));
    if (activeTab === "families") {
      setApplications((prev) =>
        prev.map((a) => (ids.has(a.id) ? { ...a, status: "Approved" } : a))
      );
    } else {
      setProvApplications((prev) =>
        prev.map((a) => (ids.has(a.id) ? { ...a, status: "Approved" } : a))
      );
    }
    setShowBulkConfirm(false);
  }

  // Batch mode
  const batchEligible = [
    ...applications.filter(
      (a) =>
        a.aiConfidence === "Strong Approve" &&
        (!a.flags || a.flags.every((f) => f.type === "none")) &&
        (a.status === "Pending Review" || a.status === "Under Review")
    ),
    ...provApplications.filter(
      (a) =>
        a.aiConfidence === "Strong Approve" &&
        (!a.flags || a.flags.every((f) => f.type === "none")) &&
        (a.status === "Pending Review" || a.status === "Under Review")
    ),
  ];

  function toggleBatchSelect(id) {
    setBatchSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function confirmBatchApprove() {
    setApplications((prev) =>
      prev.map((a) => (batchSelected.has(a.id) ? { ...a, status: "Approved" } : a))
    );
    setProvApplications((prev) =>
      prev.map((a) => (batchSelected.has(a.id) ? { ...a, status: "Approved" } : a))
    );
    const count = batchSelected.size;
    setBatchSelected(new Set());
    setBatchSuccess(count);
    setTimeout(() => {
      setBatchSuccess(null);
      setReviewMode("queue");
    }, 4000);
  }

  // ─── RENDER ───────────────────────────────────────────────────

  const renderTriageSummary = () => (
    <div className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          {/* Awaiting Review */}
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white text-sm font-medium"
            style={{ backgroundColor: NAVY }}
          >
            <Clock className="h-4 w-4" />
            <span>Awaiting Review</span>
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
              {pendingCount}
            </span>
          </div>
          {/* Avg Time */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Avg Time in Queue</span>
            <span className="ml-1 font-bold">{avgTimeInQueue} days</span>
          </div>
          {/* AI Pre-Screened */}
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
            <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
            <span>AI Pre-Screened</span>
            <span className="ml-1 font-bold">{aiPreScreened}</span>
          </div>
          {/* Flagged */}
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800">
            <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
            <span>Flagged for Attention</span>
            <span className="ml-1 font-bold">{flaggedCount}</span>
          </div>
        </div>
        {/* API Key */}
        <div className="flex items-center gap-2">
          <Label htmlFor="apiKey" className="text-xs text-gray-500 whitespace-nowrap">
            Connect AI
          </Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-48 h-8 text-xs"
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        AI pre-screening has already reviewed each application. Estimated time to clear this
        queue:{" "}
        <span className="font-semibold">{(pendingCount * 1.5).toFixed(0)} minutes</span>.
      </p>
    </div>
  );

  const renderConfidenceBadge = (confidence) => (
    <Badge className={`${confidenceBadgeClasses[confidence] || "bg-gray-100 text-gray-800"} border-0 text-xs font-medium`}>
      {confidence}
    </Badge>
  );

  const renderFlags = (flags) => {
    if (!flags || flags.length === 0 || flags.every((f) => f.type === "none")) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return (
      <div className="flex gap-1">
        {flags
          .filter((f) => f.type !== "none")
          .map((f, i) => (
            <AlertTriangle
              key={i}
              className={`h-4 w-4 ${
                f.type === "age_grade_mismatch" || f.type === "eligibility_question"
                  ? "text-red-500"
                  : f.type === "missing_doc" || f.type === "incomplete_background"
                  ? "text-orange-500"
                  : "text-amber-500"
              }`}
              title={f.description}
            />
          ))}
      </div>
    );
  };

  const renderQueueTable = () => (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab("families")}
          className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "families"
              ? "border-current text-[#0F2D5E]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          style={activeTab === "families" ? { color: NAVY, borderColor: NAVY } : {}}
        >
          <Users className="inline h-4 w-4 mr-1" />
          Family Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab("providers")}
          className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "providers"
              ? "border-current text-[#0F2D5E]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          style={activeTab === "providers" ? { color: NAVY, borderColor: NAVY } : {}}
        >
          <Building2 className="inline h-4 w-4 mr-1" />
          Provider Applications ({provApplications.length})
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Confidence Levels</option>
            <option value="Strong Approve">Strong Approve</option>
            <option value="Likely Approve">Likely Approve</option>
            <option value="Review Needed">Review Needed</option>
            <option value="Likely Deny">Likely Deny</option>
            <option value="Strong Deny">Strong Deny</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Time in Queue</option>
            <option value="confidence">Sort by Confidence</option>
          </select>
        </div>
        <Button
          onClick={handleClearStrongApprovals}
          className="ml-auto text-sm font-semibold text-white"
          style={{ backgroundColor: GOLD }}
        >
          <Zap className="h-4 w-4 mr-1" />
          Clear Strong Approvals ({strongApproveNoFlags.length})
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setReviewMode("batch");
            setBatchSelected(new Set());
          }}
          className="text-sm"
        >
          <CheckSquare className="h-4 w-4 mr-1" />
          Batch Review
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium uppercase tracking-wider text-gray-500" style={{ backgroundColor: "#f8f9fb" }}>
              <th className="px-4 py-3">{activeTab === "families" ? "Applicant" : "Organization"}</th>
              <th className="px-4 py-3">Date Submitted</th>
              <th className="px-4 py-3">AI Confidence</th>
              <th className="px-4 py-3">AI Summary</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Time in Queue</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  {activeTab === "families" ? (
                    <div>
                      <div className="font-medium text-gray-900">{app.parentName}</div>
                      <div className="text-xs text-gray-500">{app.studentName} — {app.grade}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium text-gray-900">{app.orgName}</div>
                      <div className="text-xs text-gray-500">{app.contactName} — {app.type}</div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{app.dateSubmitted}</td>
                <td className="px-4 py-3">{renderConfidenceBadge(app.aiConfidence)}</td>
                <td className="px-4 py-3 max-w-[240px]">
                  <p className="truncate text-gray-600 text-xs">{app.aiSummary}</p>
                </td>
                <td className="px-4 py-3">{renderFlags(app.flags)}</td>
                <td className="px-4 py-3 text-gray-600">{app.timeInQueue}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      app.status === "Approved"
                        ? "border-green-300 text-green-700 bg-green-50"
                        : app.status === "Denied"
                        ? "border-red-300 text-red-700 bg-red-50"
                        : app.status === "Info Requested"
                        ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                        : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {app.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openReview(app)}
                    className="text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Review
                  </Button>
                </td>
              </tr>
            ))}
            {filteredApps.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No applications match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFieldRow = (label, value, flagged) => (
    <div
      className={`flex flex-col sm:flex-row sm:items-start gap-1 px-3 py-2 rounded ${
        flagged ? "bg-yellow-50" : ""
      }`}
      key={label}
    >
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide sm:w-44 shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-800">
        {Array.isArray(value) ? value.join(", ") || "—" : value || "—"}
      </span>
    </div>
  );

  const renderFamilyDetails = (app) => {
    const flaggedTypes = (app.flags || []).filter((f) => f.type !== "none").map((f) => f.type);
    const isFlagged = (field) => {
      if (flaggedTypes.includes("incomplete_field") && !app[field]) return true;
      if (field === "frlVerification" && flaggedTypes.includes("missing_doc")) return true;
      if (field === "age" && flaggedTypes.includes("age_grade_mismatch")) return true;
      if (field === "school" && flaggedTypes.includes("eligibility_question")) return true;
      return false;
    };

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: NAVY }}>
              <User className="h-4 w-4" />
              Parent/Guardian Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {renderFieldRow("Name", app.parentName)}
            {renderFieldRow("Relationship", app.relationship)}
            {renderFieldRow("Email", app.email)}
            {renderFieldRow("Phone", app.phone)}
            {renderFieldRow("Address", `${app.address}, ${app.city}, ${app.state} ${app.zip}`)}
            {renderFieldRow("Preferred Language", app.preferredLanguage)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: NAVY }}>
              <GraduationCap className="h-4 w-4" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {renderFieldRow("Student Name", app.studentName)}
            {renderFieldRow("Grade", app.grade)}
            {renderFieldRow("School", app.school, isFlagged("school"))}
            {renderFieldRow("District", app.district, isFlagged("school"))}
            {renderFieldRow("Date of Birth", app.dob)}
            {renderFieldRow("Age", app.age, isFlagged("age"))}
            {renderFieldRow("Gender Identity", app.genderIdentity, isFlagged("genderIdentity"))}
            {renderFieldRow("Ethnicity", app.ethnicity, isFlagged("ethnicity"))}
            {renderFieldRow("Race", app.race, isFlagged("race"))}
            {renderFieldRow("IEP/504", app.iep504)}
            {renderFieldRow("Sibling Add-On", app.isSiblingAddOn ? "Yes" : "No")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: NAVY }}>
              <Shield className="h-4 w-4" />
              Eligibility & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {renderFieldRow("FRL Verification", app.frlVerification, isFlagged("frlVerification"))}
            {renderFieldRow("Documents Uploaded", app.documentsUploaded)}
            {renderFieldRow("Barriers", app.barriers, isFlagged("barriers"))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: NAVY }}>
              <Sparkles className="h-4 w-4" />
              Program Interest
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {renderFieldRow("Interests", app.interests, isFlagged("interests"))}
            {renderFieldRow("Passion Frequency", app.passionFrequency, isFlagged("passionFrequency"))}
            {renderFieldRow("Main Concern", app.mainConcern, isFlagged("mainConcern"))}
            {renderFieldRow("Interest Reason", app.interestReason, isFlagged("interestReason"))}
            {renderFieldRow("How Heard About Us", app.hearAboutUs)}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProviderDetails = (app) => {
    const docs = app.docsUploaded || {};
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: NAVY }}>
              <Building2 className="h-4 w-4" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {renderFieldRow("Organization Name", app.orgName)}
            {renderFieldRow("DBA Name", app.dbaName)}
            {renderFieldRow("Type", app.type)}
            {renderFieldRow("EIN", app.ein)}
            {renderFieldRow("Year Founded", app.yearFounded)}
            {renderFieldRow("Website", app.website || "Not provided")}
            {renderFieldRow("Description", app.description)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: NAVY }}>
              <User className="h-4 w-4" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {renderFieldRow("Contact Name", app.contactName)}
            {renderFieldRow("Title", app.contactTitle)}
            {renderFieldRow("Email", app.email)}
            {renderFieldRow("Phone", app.phone)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: NAVY }}>
              <Sparkles className="h-4 w-4" />
              Program Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {renderFieldRow("Activities", app.activities)}
            {renderFieldRow("Service Locations", app.serviceLocations)}
            {renderFieldRow("Service Area", app.serviceArea)}
            {renderFieldRow("Age Ranges", app.ageRanges)}
            {renderFieldRow("Sliding Scale", app.slidingScale ? "Yes" : "No")}
            {renderFieldRow("Public Funding", app.publicFunding ? "Yes" : "No")}
            {app.publicFunding && renderFieldRow("Funding Details", app.publicFundingDetails)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: NAVY }}>
              <FileText className="h-4 w-4" />
              Document Vault
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {renderFieldRow("W-9", docs.w9 ? "Uploaded" : "Missing")}
            {renderFieldRow("Insurance", docs.insurance ? `Uploaded (expires ${docs.insuranceExpiry})` : "Missing")}
            {renderFieldRow("Background Check Policy", docs.backgroundCheck ? "Uploaded" : "Missing")}
            {renderFieldRow("501(c)(3) Determination", docs.determination501c3 ? "Uploaded" : app.type !== "Nonprofit 501c3" ? "N/A" : "Missing")}
            {renderFieldRow("State Registration", docs.stateRegistration ? "Uploaded" : "Missing")}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAiLoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: GOLD }}>
        <Sparkles className="h-4 w-4 animate-pulse" />
        Spark AI is reviewing this application...
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-32 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );

  const renderAiPanel = () => {
    if (aiLoading) return renderAiLoadingSkeleton();
    if (!aiAnalysis) return null;

    // If raw API response
    if (aiAnalysis.isRaw) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
            <span className="text-sm font-semibold" style={{ color: NAVY }}>
              Spark AI Analysis
            </span>
          </div>
          <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-lg p-4 border">
            {aiAnalysis.raw}
          </div>
          {renderActionButtons()}
        </div>
      );
    }

    const analysis = aiAnalysis;
    const isProvider = selectedApp?.id?.startsWith("prov");

    const recColor =
      analysis.recommendation === "Approve"
        ? "bg-green-100 text-green-800 border-green-300"
        : analysis.recommendation === "Approve with Conditions"
        ? "bg-amber-100 text-amber-800 border-amber-300"
        : analysis.recommendation === "Request More Information"
        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
        : "bg-red-100 text-red-800 border-red-300";

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
          <span className="text-sm font-semibold" style={{ color: NAVY }}>
            Spark AI Analysis
          </span>
        </div>

        {/* Recommended Decision - Most Prominent */}
        <Card className={`border-2 ${recColor.includes("green") ? "border-green-300" : recColor.includes("amber") ? "border-amber-300" : recColor.includes("yellow") ? "border-yellow-300" : "border-red-300"}`}>
          <CardContent className="pt-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Recommended Decision
            </div>
            <Badge className={`${recColor} text-base px-3 py-1 mb-3 border`}>
              {analysis.recommendation}
            </Badge>
            <p className="text-sm text-gray-700 leading-relaxed">{analysis.justification}</p>
          </CardContent>
        </Card>

        {/* Eligibility / Org Legitimacy */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            {isProvider ? "Organization Legitimacy" : "Eligibility Determination"}
          </h4>
          <p className="text-sm text-gray-700">
            {isProvider ? analysis.orgLegitimacy : analysis.eligibility}
          </p>
        </div>

        {/* Confidence */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Confidence Level
          </h4>
          <Badge variant="outline" className="text-xs">
            {analysis.confidence}
          </Badge>
        </div>

        {/* FRL / Documents */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            {isProvider ? "Document Status" : "FRL Verification Status"}
          </h4>
          <p className="text-sm text-gray-700">
            {isProvider ? analysis.documentCompleteness : analysis.frlStatus}
          </p>
        </div>

        {isProvider && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
              Insurance Adequacy
            </h4>
            <p className="text-sm text-gray-700">{analysis.insuranceAdequacy}</p>
          </div>
        )}

        {isProvider && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
              Activity Alignment
            </h4>
            <p className="text-sm text-gray-700">{analysis.activityAlignment}</p>
          </div>
        )}

        {/* Completeness Check */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Completeness Check
          </h4>
          <div className="space-y-1">
            {(analysis.completeness || []).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {item.status === "complete" ? (
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                ) : item.status === "flagged" ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
                <span className={item.status === "missing" ? "text-red-700" : item.status === "flagged" ? "text-amber-700" : "text-gray-700"}>
                  {item.item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Duplicate / Network Check */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            {isProvider ? "Network Check" : "Duplicate Detection"}
          </h4>
          <p className="text-sm text-gray-700">
            {isProvider ? analysis.networkCheck : analysis.duplicateCheck}
          </p>
        </div>

        {/* Risk Flags / Red Flags */}
        {(isProvider ? analysis.redFlags : analysis.riskFlags) &&
          (isProvider ? analysis.redFlags : analysis.riskFlags) !== "No red flags detected." &&
          (isProvider ? analysis.redFlags : analysis.riskFlags) !== "No risk flags identified." && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">
                  {isProvider ? "Red Flags" : "Risk Flags"}
                </h4>
                <p className="text-sm text-red-700">
                  {isProvider ? analysis.redFlags : analysis.riskFlags}
                </p>
              </CardContent>
            </Card>
          )}

        {/* Suggested Communication */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Suggested Communication
          </h4>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <pre className="whitespace-pre-wrap text-xs text-gray-700 font-sans">
              {analysis.suggestedEmail}
            </pre>
          </div>
        </div>

        {renderActionButtons()}
      </div>
    );
  };

  const renderActionButtons = () => (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <div className="flex gap-2">
        <Button
          onClick={() => openActionModal("approve")}
          className="flex-1 text-white font-semibold"
          style={{ backgroundColor: SUCCESS }}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button
          onClick={() => openActionModal("info")}
          className="flex-1 text-white font-semibold"
          style={{ backgroundColor: "#F59E0B" }}
        >
          <Mail className="h-4 w-4 mr-1" />
          Request More Info
        </Button>
        <Button
          onClick={() => openActionModal("deny")}
          className="flex-1 text-white font-semibold bg-red-600 hover:bg-red-700"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Deny
        </Button>
      </div>

      {/* Override Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOverrideActive(!overrideActive)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
        >
          {overrideActive ? (
            <ToggleRight className="h-5 w-5 text-amber-500" />
          ) : (
            <ToggleLeft className="h-5 w-5" />
          )}
          Override AI Recommendation
        </button>
      </div>
      {overrideActive && (
        <div>
          <Label htmlFor="overrideReason" className="text-xs text-gray-600">
            Override Reason
          </Label>
          <Input
            id="overrideReason"
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            placeholder="Explain why you are overriding the AI recommendation..."
            className="mt-1 text-sm"
          />
        </div>
      )}
    </div>
  );

  const renderReviewPanel = () => {
    if (!selectedApp) return null;
    const isProvider = selectedApp.id.startsWith("prov");

    return (
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={handleBackToQueue} className="text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Queue
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentQueueIndex <= 0}
              onClick={() => navigateReview(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-xs text-gray-500">
              {currentQueueIndex + 1} of {filteredApps.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentQueueIndex >= filteredApps.length - 1}
              onClick={() => navigateReview(1)}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold" style={{ color: NAVY }}>
            {isProvider ? selectedApp.orgName : `${selectedApp.parentName} — ${selectedApp.studentName}`}
          </h2>
          {renderConfidenceBadge(selectedApp.aiConfidence)}
          <Badge variant="outline" className="text-xs">
            {selectedApp.status}
          </Badge>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Application Data */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Application Data
            </h3>
            {isProvider ? renderProviderDetails(selectedApp) : renderFamilyDetails(selectedApp)}
          </div>

          {/* Right - AI Analysis */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              AI Analysis
            </h3>
            <Card>
              <CardContent className="pt-4">
                {renderAiPanel()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderBatchReview = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => setReviewMode("queue")} className="text-sm">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Queue
        </Button>
        <h2 className="text-lg font-bold" style={{ color: NAVY }}>
          Batch Review — Strong Approvals
        </h2>
        <div />
      </div>

      {batchSuccess !== null ? (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-800 mb-1">
              You just approved {batchSuccess} applications in under a minute.
            </h3>
            <p className="text-sm text-green-700">
              Estimated time without AI: <span className="font-semibold">{batchSuccess * 9} minutes</span>.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {batchEligible.length === 0 ? (
            <p className="text-center text-gray-400 py-12">
              No applications eligible for batch approval.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
              {batchEligible.map((app) => {
                const isProvider = app.id.startsWith("prov");
                return (
                  <Card
                    key={app.id}
                    className={`cursor-pointer transition-all ${
                      batchSelected.has(app.id) ? "ring-2 ring-green-400 bg-green-50/50" : ""
                    }`}
                    onClick={() => toggleBatchSelect(app.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {isProvider ? app.orgName : app.parentName}
                          </div>
                          {!isProvider && (
                            <div className="text-xs text-gray-500">
                              {app.studentName} — {app.grade}
                            </div>
                          )}
                          {isProvider && (
                            <div className="text-xs text-gray-500">{app.contactName}</div>
                          )}
                        </div>
                        <div
                          className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                            batchSelected.has(app.id)
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {batchSelected.has(app.id) && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                      {renderConfidenceBadge(app.aiConfidence)}
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{app.aiSummary}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Sticky bottom bar */}
          {batchEligible.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-6 py-4 flex items-center justify-between z-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (batchSelected.size === batchEligible.length) {
                      setBatchSelected(new Set());
                    } else {
                      setBatchSelected(new Set(batchEligible.map((a) => a.id)));
                    }
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {batchSelected.size === batchEligible.length ? "Deselect All" : "Select All"}
                </button>
                <span className="text-sm text-gray-600">
                  <span className="font-bold">{batchSelected.size}</span> selected
                </span>
              </div>
              <Button
                disabled={batchSelected.size === 0}
                onClick={() => setShowBulkConfirm(true)}
                className="text-white font-semibold"
                style={{ backgroundColor: SUCCESS }}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve All Selected
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
        Review Analytics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Avg Time to Decision
            </div>
            <div className="text-2xl font-bold" style={{ color: NAVY }}>
              2.1 hours
            </div>
            <div className="text-xs text-gray-400 mt-1">
              National avg: <span className="font-semibold">4.8 days</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              AI Accuracy Rate
            </div>
            <div className="text-2xl font-bold" style={{ color: SUCCESS }}>
              94%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full"
                style={{ width: "94%", backgroundColor: SUCCESS }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Override Rate</div>
            <div className="text-2xl font-bold text-amber-600">6%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="h-2 rounded-full bg-amber-400" style={{ width: "6%" }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Applications / Staff Hour
            </div>
            <div className="text-2xl font-bold" style={{ color: NAVY }}>
              12.4
            </div>
            <div className="text-xs text-gray-400 mt-1">
              National avg: <span className="font-semibold">2.1</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4" style={{ backgroundColor: "#FFF8E7" }}>
        <CardContent className="pt-4 flex items-center gap-3">
          <Sparkles className="h-6 w-6 shrink-0" style={{ color: GOLD }} />
          <p className="text-sm font-medium" style={{ color: NAVY }}>
            AI pre-screening has saved your team an estimated{" "}
            <span className="font-bold">47 hours</span> this cycle.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // ─── MODALS ───────────────────────────────────────────────────

  const renderActionModal = () => {
    if (!showActionModal) return null;
    const { type } = showActionModal;
    const heading =
      type === "approve"
        ? "Approve Application"
        : type === "info"
        ? "Request More Information"
        : "Deny Application";
    const headingColor =
      type === "approve" ? SUCCESS : type === "info" ? "#F59E0B" : "#DC2626";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: headingColor }}>
              {heading}
            </h3>
            <button onClick={() => setShowActionModal(null)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <Label className="text-xs text-gray-500 mb-1 block">Communication to Applicant</Label>
          <Textarea
            value={actionEmailText}
            onChange={(e) => setActionEmailText(e.target.value)}
            rows={10}
            className="text-sm mb-4"
          />
          {overrideActive && overrideReason && (
            <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs font-semibold text-amber-700 mb-1">Override Reason:</p>
              <p className="text-sm text-amber-800">{overrideReason}</p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowActionModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className="text-white font-semibold"
              style={{ backgroundColor: headingColor }}
            >
              Confirm & Send
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderBulkConfirmModal = () => {
    if (!showBulkConfirm) return null;

    const isBatchMode = reviewMode === "batch";
    const count = isBatchMode ? batchSelected.size : strongApproveNoFlags.length;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: NAVY }}>
              Confirm Bulk Approval
            </h3>
            <button onClick={() => setShowBulkConfirm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            You are about to approve <span className="font-bold">{count}</span> applications.{" "}
            <span className="font-bold">{count}</span> automated notifications will be sent.
          </p>
          <p className="text-xs text-gray-500 mb-4">This action cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowBulkConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (isBatchMode) {
                  confirmBatchApprove();
                } else {
                  confirmBulkApprove();
                }
                setShowBulkConfirm(false);
              }}
              className="text-white font-semibold"
              style={{ backgroundColor: SUCCESS }}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirm
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // ─── MAIN RETURN ──────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {renderTriageSummary()}

      {reviewMode === "queue" && (
        <>
          {renderQueueTable()}
          {renderAnalytics()}
        </>
      )}

      {reviewMode === "review" && renderReviewPanel()}

      {reviewMode === "batch" && renderBatchReview()}

      {renderActionModal()}
      {renderBulkConfirmModal()}
    </div>
  );
}
