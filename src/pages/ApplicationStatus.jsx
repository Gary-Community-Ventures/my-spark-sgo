import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Search,
  Sparkles,
  Upload,
  ArrowRight,
  Brain,
  User,
  FileText,
  Shield,
} from "lucide-react";

/* ─── pulse animation (injected once) ─────────────────────────── */
const pulseKeyframes = `
@keyframes stagePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(15, 45, 94, 0.45); }
  50% { box-shadow: 0 0 0 10px rgba(15, 45, 94, 0); }
}
`;

/* ─── brand colors ─────────────────────────────────────────────── */
const NAVY = "#0F2D5E";
const GOLD = "#F5A623";
const GREEN = "#2E7D32";

/* ─── stage definitions ────────────────────────────────────────── */
const stageDefinitions = [
  {
    label: "Application Submitted",
    icon: FileText,
    description:
      "Your application has been received and is in our system.",
  },
  {
    label: "In Review",
    icon: Search,
    description:
      "Our team has begun reviewing your submission.",
  },
  {
    label: "AI Pre-Screening Complete",
    icon: Brain,
    description:
      "Our AI system has pre-screened your application for eligibility and completeness.",
  },
  {
    label: "Under Human Review",
    icon: User,
    description:
      "A human reviewer is now evaluating your application with AI assistance.",
  },
  {
    label: "Decision Made",
    icon: Shield,
    description:
      "A decision has been made on your application.",
  },
];

/* ─── mock status builders ─────────────────────────────────────── */
function buildMockStatus(refNumber) {
  const baseStages = stageDefinitions.map((s) => s.label);

  if (refNumber.includes("001")) {
    return {
      applicantName: "Maria Gonzalez",
      studentName: "Sofia Gonzalez",
      refNumber,
      currentStage: 5,
      stages: baseStages,
      decision: "Approved",
      submittedDate: "March 10, 2026",
      lastUpdated: "March 22, 2026",
    };
  }

  if (refNumber.includes("004")) {
    return {
      applicantName: "James Carter",
      studentName: "Elijah Carter",
      refNumber,
      currentStage: 4,
      stages: baseStages,
      decision: "More Info Needed",
      submittedDate: "March 14, 2026",
      lastUpdated: "March 23, 2026",
    };
  }

  // default — under review
  return {
    applicantName: "Applicant",
    studentName: "Student",
    refNumber,
    currentStage: 2,
    stages: baseStages,
    decision: null,
    submittedDate: "March 18, 2026",
    lastUpdated: "March 24, 2026",
  };
}

/* ─── mock timestamps per stage ────────────────────────────────── */
function stageTimestamp(stageIndex, submitted) {
  const offsets = [
    submitted,
    "March 12, 2026 — 9:14 AM",
    "March 15, 2026 — 2:37 PM",
    "March 18, 2026 — 10:05 AM",
    "March 22, 2026 — 4:48 PM",
  ];
  return offsets[stageIndex] || "";
}

/* ═══════════════════════════════════════════════════════════════ */

export default function ApplicationStatus() {
  const [refNumber, setRefNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [mockStatus, setMockStatus] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    if (!refNumber.trim()) return;
    setSearched(true);
    setMockStatus(buildMockStatus(refNumber.trim()));
  }

  return (
    <Layout>
      {/* inject pulse keyframes */}
      <style>{pulseKeyframes}</style>

      <PageHeader
        title="Application Status"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Application Status" },
        ]}
      />

      <div
        style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px 80px" }}
      >
        {/* ── HEADER + SEARCH ─────────────────────────────────────── */}
        <div className="text-center" style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: "clamp(22px, 4vw, 30px)",
              fontWeight: 700,
              color: NAVY,
              marginBottom: 8,
            }}
          >
            Check Your Application Status
          </h2>
          <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 24 }}>
            Enter the reference number you received when you submitted your
            application.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row"
            style={{ gap: 12, maxWidth: 600, margin: "0 auto" }}
          >
            <Input
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="Enter your reference number, e.g., REF-2026-MSS-004829"
              className="flex-1"
              style={{ fontSize: 14 }}
            />
            <Button
              type="submit"
              style={{ backgroundColor: NAVY, color: "#fff", minWidth: 140 }}
              className="flex items-center justify-center gap-2"
            >
              <Search style={{ width: 16, height: 16 }} />
              Check Status
            </Button>
          </form>
        </div>

        {/* ── NO RESULT YET ───────────────────────────────────────── */}
        {searched && !mockStatus && (
          <p className="text-center" style={{ color: "#6b7280" }}>
            No application found. Please double-check your reference number.
          </p>
        )}

        {/* ── STATUS CARD ─────────────────────────────────────────── */}
        {searched && mockStatus && (
          <>
            {/* applicant summary */}
            <Card style={{ marginBottom: 32 }}>
              <CardContent style={{ padding: 24 }}>
                <div
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  style={{ gap: 16 }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: NAVY,
                        marginBottom: 4,
                      }}
                    >
                      {mockStatus.applicantName}
                    </p>
                    <p style={{ color: "#6b7280", fontSize: 14 }}>
                      Student: {mockStatus.studentName}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Badge
                      style={{
                        backgroundColor:
                          mockStatus.decision === "Approved"
                            ? "#e8f5e9"
                            : mockStatus.decision === "More Info Needed"
                            ? "#fff8e1"
                            : "#e3edf9",
                        color:
                          mockStatus.decision === "Approved"
                            ? GREEN
                            : mockStatus.decision === "More Info Needed"
                            ? "#e65100"
                            : NAVY,
                        fontSize: 13,
                        padding: "4px 12px",
                      }}
                    >
                      {mockStatus.decision || "Under Review"}
                    </Badge>
                    <p
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                        marginTop: 6,
                      }}
                    >
                      Ref: {mockStatus.refNumber}
                    </p>
                    <p style={{ color: "#9ca3af", fontSize: 12 }}>
                      Submitted: {mockStatus.submittedDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── TIMELINE ──────────────────────────────────────────── */}
            <h3
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: NAVY,
                marginBottom: 24,
              }}
            >
              Application Timeline
            </h3>

            <div style={{ position: "relative", paddingLeft: 36 }}>
              {stageDefinitions.map((stage, idx) => {
                const stageNum = idx + 1;
                const isComplete = stageNum < mockStatus.currentStage;
                const isCurrent = stageNum === mockStatus.currentStage;
                const isFuture =
                  stageNum > mockStatus.currentStage;
                const isLast = idx === stageDefinitions.length - 1;
                const StageIcon = stage.icon;

                return (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      paddingBottom: isLast ? 0 : 36,
                    }}
                  >
                    {/* connecting line */}
                    {!isLast && (
                      <div
                        style={{
                          position: "absolute",
                          left: -20,
                          top: 30,
                          bottom: 0,
                          width: 3,
                          backgroundColor: isComplete ? GREEN : "#d1d5db",
                          borderRadius: 2,
                        }}
                      />
                    )}

                    {/* circle */}
                    <div
                      style={{
                        position: "absolute",
                        left: -32,
                        top: 2,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isComplete || isCurrent
                          ? isComplete
                            ? GREEN
                            : NAVY
                          : "#fff",
                        border: isFuture ? "2px solid #d1d5db" : "none",
                        animation: isCurrent
                          ? "stagePulse 2s ease-in-out infinite"
                          : "none",
                      }}
                    >
                      {isComplete ? (
                        <CheckCircle
                          style={{
                            width: 18,
                            height: 18,
                            color: "#fff",
                          }}
                        />
                      ) : isCurrent ? (
                        <Clock
                          style={{
                            width: 16,
                            height: 16,
                            color: "#fff",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#d1d5db",
                          }}
                        />
                      )}
                    </div>

                    {/* content */}
                    <div>
                      <div
                        className="flex flex-wrap items-center"
                        style={{ gap: 8, marginBottom: 4 }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: isFuture ? "#9ca3af" : NAVY,
                          }}
                        >
                          {stage.label}
                        </span>
                        {isCurrent && (
                          <Badge
                            style={{
                              backgroundColor: "#e3edf9",
                              color: NAVY,
                              fontSize: 11,
                              padding: "2px 8px",
                            }}
                          >
                            Current
                          </Badge>
                        )}
                      </div>

                      {(isComplete ||
                        (isCurrent && mockStatus.currentStage === 5)) && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            marginBottom: 4,
                          }}
                        >
                          {stageTimestamp(idx, mockStatus.submittedDate)}
                        </p>
                      )}

                      <p
                        style={{
                          fontSize: 14,
                          color: isFuture ? "#9ca3af" : "#4b5563",
                          lineHeight: 1.55,
                        }}
                      >
                        {stage.description}
                      </p>

                      {isCurrent && mockStatus.currentStage < 5 && (
                        <p
                          style={{
                            marginTop: 8,
                            fontSize: 13,
                            color: GOLD,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Clock style={{ width: 14, height: 14 }} />
                          Estimated time to next update: 1–2 business days
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── DECISION: APPROVED ────────────────────────────────── */}
            {mockStatus.currentStage === 5 &&
              mockStatus.decision === "Approved" && (
                <div style={{ marginTop: 48 }}>
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${GREEN}, #43a047)`,
                      borderRadius: 16,
                      padding: "36px 28px",
                      color: "#fff",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* confetti-like decorative dots */}
                    {[
                      { top: 10, left: 20, bg: GOLD, size: 8 },
                      { top: 18, right: 40, bg: "#fff", size: 6 },
                      { bottom: 14, left: 60, bg: GOLD, size: 10 },
                      { bottom: 20, right: 80, bg: "#fff", size: 7 },
                      { top: 40, left: "50%", bg: GOLD, size: 5 },
                      { top: 8, right: 120, bg: "#81c784", size: 9 },
                    ].map((dot, i) => (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          width: dot.size,
                          height: dot.size,
                          borderRadius: "50%",
                          backgroundColor: dot.bg,
                          opacity: 0.5,
                          top: dot.top,
                          left: dot.left,
                          right: dot.right,
                          bottom: dot.bottom,
                        }}
                      />
                    ))}

                    <Sparkles
                      style={{
                        width: 36,
                        height: 36,
                        marginBottom: 12,
                        color: GOLD,
                      }}
                    />
                    <h3
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        marginBottom: 8,
                      }}
                    >
                      Congratulations, {mockStatus.studentName.split(" ")[0]}!
                    </h3>
                    <p style={{ fontSize: 16, opacity: 0.95 }}>
                      Your My Spark SGO scholarship has been approved.
                    </p>
                  </div>

                  {/* next steps */}
                  <Card style={{ marginTop: 24 }}>
                    <CardContent style={{ padding: 28 }}>
                      <h4
                        style={{
                          fontWeight: 700,
                          fontSize: 17,
                          color: NAVY,
                          marginBottom: 16,
                        }}
                      >
                        Here's what happens next:
                      </h4>
                      <ol
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: 16,
                        }}
                      >
                        {[
                          "You'll receive a welcome email with your Chek virtual card details",
                          "Activate your card through your family dashboard",
                          "Browse approved providers and start enrolling!",
                        ].map((step, i) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 12,
                            }}
                          >
                            <span
                              style={{
                                flexShrink: 0,
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                backgroundColor: "#e8f5e9",
                                color: GREEN,
                                fontWeight: 700,
                                fontSize: 14,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {i + 1}
                            </span>
                            <span
                              style={{
                                fontSize: 15,
                                color: "#374151",
                                lineHeight: 1.55,
                                paddingTop: 3,
                              }}
                            >
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>

                      <div style={{ marginTop: 24 }}>
                        <Link to="/dashboard/family">
                          <Button
                            className="flex items-center gap-2"
                            style={{
                              backgroundColor: NAVY,
                              color: "#fff",
                            }}
                          >
                            Go to Dashboard
                            <ArrowRight style={{ width: 16, height: 16 }} />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            {/* ── DECISION: MORE INFO NEEDED ────────────────────────── */}
            {mockStatus.decision === "More Info Needed" && (
              <div style={{ marginTop: 48 }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #f9a825, #ffb300)",
                    borderRadius: 16,
                    padding: "32px 28px",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  <FileText
                    style={{
                      width: 32,
                      height: 32,
                      marginBottom: 10,
                    }}
                  />
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      marginBottom: 6,
                    }}
                  >
                    We need a bit more information
                  </h3>
                  <p style={{ fontSize: 15, opacity: 0.95 }}>
                    Please provide the following document(s) so we can continue
                    reviewing your application.
                  </p>
                </div>

                <Card style={{ marginTop: 24 }}>
                  <CardContent style={{ padding: 28 }}>
                    <h4
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: NAVY,
                        marginBottom: 12,
                      }}
                    >
                      Items needed:
                    </h4>
                    <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                      <li
                        style={{
                          fontSize: 14,
                          color: "#374151",
                          marginBottom: 6,
                        }}
                      >
                        Free &amp; Reduced Lunch Verification Document
                      </li>
                    </ul>

                    {/* upload dropzone */}
                    <div
                      onClick={() => setUploaded((v) => !v)}
                      style={{
                        border: uploaded
                          ? `2px solid ${GREEN}`
                          : "2px dashed #d1d5db",
                        borderRadius: 12,
                        padding: "32px 20px",
                        textAlign: "center",
                        cursor: "pointer",
                        backgroundColor: uploaded ? "#f1f8e9" : "#fafafa",
                        transition: "all 0.2s ease",
                        marginBottom: 20,
                      }}
                    >
                      {uploaded ? (
                        <>
                          <CheckCircle
                            style={{
                              width: 32,
                              height: 32,
                              color: GREEN,
                              marginBottom: 8,
                            }}
                          />
                          <p
                            style={{
                              fontWeight: 600,
                              color: GREEN,
                              fontSize: 14,
                            }}
                          >
                            FRL_Verification_Carter.pdf uploaded
                          </p>
                          <p style={{ fontSize: 12, color: "#6b7280" }}>
                            Click to remove
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload
                            style={{
                              width: 32,
                              height: 32,
                              color: "#9ca3af",
                              marginBottom: 8,
                            }}
                          />
                          <p
                            style={{
                              fontWeight: 600,
                              color: "#374151",
                              fontSize: 14,
                            }}
                          >
                            Click to upload your document
                          </p>
                          <p style={{ fontSize: 12, color: "#9ca3af" }}>
                            PDF, JPG, or PNG up to 10MB
                          </p>
                        </>
                      )}
                    </div>

                    <Button
                      disabled={!uploaded}
                      className="flex items-center gap-2"
                      style={{
                        backgroundColor: uploaded ? NAVY : "#d1d5db",
                        color: "#fff",
                      }}
                    >
                      Submit Additional Documents
                      <ArrowRight style={{ width: 16, height: 16 }} />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── FOOTER NOTE ───────────────────────────────────────── */}
            <div
              style={{
                marginTop: 48,
                textAlign: "center",
                padding: "24px 16px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 1.7,
                }}
              >
                Questions? Our AI assistant can answer most questions instantly.
              </p>
              <Link
                to="/support"
                style={{
                  color: NAVY,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "underline",
                }}
              >
                Visit Support
              </Link>
              <p
                style={{
                  fontSize: 13,
                  color: "#9ca3af",
                  marginTop: 8,
                }}
              >
                You can also email{" "}
                <a
                  href="mailto:support@mysparkdenver.org"
                  style={{ color: NAVY }}
                >
                  support@mysparkdenver.org
                </a>{" "}
                or call{" "}
                <a href="tel:7208070200" style={{ color: NAVY }}>
                  720-807-0200
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
