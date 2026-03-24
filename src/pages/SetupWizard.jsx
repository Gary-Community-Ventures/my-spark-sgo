import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Building2,
  Settings,
  Shield,
  CreditCard,
  Users,
  FileText,
  Rocket,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Globe,
  Palette,
  X,
} from "lucide-react";

const STEPS = [
  { num: 1, label: "Organization Profile", icon: Building2 },
  { num: 2, label: "Program Configuration", icon: Settings },
  { num: 3, label: "Eligibility Rules", icon: Shield },
  { num: 4, label: "Chek Integration", icon: CreditCard },
  { num: 5, label: "Provider Network", icon: Users },
  { num: 6, label: "Compliance Templates", icon: FileText },
  { num: 7, label: "Review & Launch", icon: Rocket },
];

const ACTIVITY_CATEGORIES = [
  "Sports", "Arts", "Music", "Dance", "Academics", "STEM",
  "Martial Arts", "Swim", "Outdoors", "Leadership", "Chess",
  "Cooking", "Gymnastics",
];

const CARD_DESIGNS = ["Classic", "Modern", "Bold"];

const REPORT_TYPES = [
  { name: "Donor Impact", desc: "Track donation utilization and student outcomes" },
  { name: "State SGO Annual", desc: "Pre-formatted for state compliance filing" },
  { name: "Provider Payment Summary", desc: "Payment reconciliation and provider activity" },
  { name: "Program Utilization", desc: "Student engagement and fund usage analytics" },
];

/* ── confetti keyframes injected once ── */
const confettiCSS = `
@keyframes confetti-fall {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
@keyframes confetti-sway {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(30px); }
  75% { transform: translateX(-30px); }
}
`;

function ConfettiOverlay({ config, onClose }) {
  const colors = ["#F5A623", "#0F2D5E", "#2E7D32", "#E91E63", "#9C27B0", "#FF5722", "#03A9F4"];
  const dots = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    size: 6 + Math.random() * 8,
    color: colors[i % colors.length],
  }));

  const slug = (config.programName || "yourprogram").toLowerCase().replace(/\s+/g, "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <style>{confettiCSS}</style>
      {dots.map((d) => (
        <div
          key={d.id}
          style={{
            position: "fixed",
            left: `${d.left}%`,
            top: -20,
            width: d.size,
            height: d.size,
            borderRadius: d.size > 10 ? "2px" : "50%",
            backgroundColor: d.color,
            animation: `confetti-fall ${d.duration}s ${d.delay}s ease-in forwards, confetti-sway ${d.duration * 0.6}s ${d.delay}s ease-in-out infinite`,
            zIndex: 51,
            pointerEvents: "none",
          }}
        />
      ))}
      <Card className="relative z-[52] mx-4 max-w-lg w-full text-center">
        <CardContent className="p-8 pt-8">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: "#2E7D32" }}
          >
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#0F2D5E" }}>
            Your program is ready!
          </h2>
          <p className="text-gray-600 mb-6">
            Families can start applying at{" "}
            <span className="font-semibold" style={{ color: "#0F2D5E" }}>
              {slug}.mysparkplatform.org
            </span>
          </p>
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-semibold mb-3" style={{ color: "#0F2D5E" }}>Next steps:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#F5A623" }} /> Share your application link</li>
              <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#F5A623" }} /> Recruit providers</li>
              <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#F5A623" }} /> Set up your first outreach campaign</li>
              <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#F5A623" }} /> Schedule a training session</li>
            </ul>
          </div>
          <Button
            className="w-full text-white"
            style={{ backgroundColor: "#0F2D5E" }}
            onClick={onClose}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Progress Tracker ── */
function ProgressTracker({ currentStep, vertical }) {
  if (!vertical) {
    /* Mobile: compact horizontal pills */
    return (
      <div className="flex items-center justify-center gap-1 py-4 overflow-x-auto">
        {STEPS.map((s) => {
          const completed = s.num < currentStep;
          const active = s.num === currentStep;
          return (
            <div key={s.num} className="flex items-center gap-1">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: completed ? "#2E7D32" : active ? "#0F2D5E" : "transparent",
                  color: completed || active ? "#fff" : "#9CA3AF",
                  border: !completed && !active ? "2px solid #D1D5DB" : "none",
                }}
              >
                {completed ? <Check className="h-4 w-4" /> : s.num}
              </div>
              {s.num < 7 && <div className="w-4 h-0.5 bg-gray-300" />}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {STEPS.map((s, idx) => {
        const completed = s.num < currentStep;
        const active = s.num === currentStep;
        const Icon = s.icon;
        return (
          <div key={s.num} className="flex items-start gap-3">
            {/* circle + line column */}
            <div className="flex flex-col items-center">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all"
                style={{
                  backgroundColor: completed ? "#2E7D32" : active ? "#0F2D5E" : "transparent",
                  color: completed || active ? "#fff" : "#9CA3AF",
                  border: !completed && !active ? "2px solid #D1D5DB" : "none",
                }}
              >
                {completed ? <Check className="h-4 w-4" /> : s.num}
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className="w-0.5 h-8"
                  style={{ backgroundColor: completed ? "#2E7D32" : "#D1D5DB" }}
                />
              )}
            </div>
            {/* label */}
            <div className="pt-1.5">
              <p
                className="text-sm font-medium leading-tight"
                style={{ color: active ? "#0F2D5E" : completed ? "#2E7D32" : "#6B7280" }}
              >
                {s.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Live Preview ── */
function LivePreview({ config }) {
  return (
    <Card className="mt-6 overflow-hidden">
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
        Application Portal Preview
      </div>
      <div>
        <div
          className="px-4 py-3"
          style={{ backgroundColor: config.primaryColor || "#0F2D5E" }}
        >
          <p className="text-white text-sm font-bold truncate">
            {config.sgoName || "Your SGO Name"}
          </p>
          {config.tagline && <p className="text-white/70 text-xs truncate">{config.tagline}</p>}
        </div>
        <div className="p-3 space-y-2">
          <div className="h-2.5 rounded bg-gray-200 w-3/4" />
          <div className="h-2.5 rounded bg-gray-200 w-1/2" />
          <div className="h-7 rounded mt-3" style={{ backgroundColor: config.secondaryColor || "#F5A623", opacity: 0.7 }} />
        </div>
      </div>
    </Card>
  );
}

/* ── Step Components ── */
function Step1({ config, setConfig }) {
  const update = (key, val) => setConfig((c) => ({ ...c, [key]: val }));
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>Organization Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Tell us about your SGO so we can brand your platform.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>SGO Name</Label>
          <Input className="mt-1" value={config.sgoName || ""} onChange={(e) => update("sgoName", e.target.value)} placeholder="e.g. My Spark Denver" />
        </div>

        {/* Logo upload */}
        <div className="sm:col-span-2">
          <Label>Logo</Label>
          <div
            className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => update("logoUploaded", !config.logoUploaded)}
          >
            {config.logoUploaded ? (
              <div className="flex items-center gap-2 text-sm" style={{ color: "#2E7D32" }}>
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Logo uploaded</span>
                <span className="text-gray-400 ml-2">(click to remove)</span>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">Click to upload your logo</p>
              </div>
            )}
          </div>
        </div>

        {/* Colors */}
        <div>
          <Label>Primary Color</Label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={config.primaryColor || "#0F2D5E"}
              onChange={(e) => update("primaryColor", e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300"
            />
            <Input value={config.primaryColor || "#0F2D5E"} onChange={(e) => update("primaryColor", e.target.value)} className="flex-1" />
          </div>
        </div>
        <div>
          <Label>Secondary Color</Label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={config.secondaryColor || "#F5A623"}
              onChange={(e) => update("secondaryColor", e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300"
            />
            <Input value={config.secondaryColor || "#F5A623"} onChange={(e) => update("secondaryColor", e.target.value)} className="flex-1" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label>Tagline</Label>
          <Input className="mt-1" value={config.tagline || ""} onChange={(e) => update("tagline", e.target.value)} placeholder="Empowering families through enrichment" />
        </div>

        <div>
          <Label>Website</Label>
          <Input className="mt-1" value={config.website || ""} onChange={(e) => update("website", e.target.value)} placeholder="https://yoursgo.org" />
        </div>
        <div>
          <Label>EIN</Label>
          <Input className="mt-1" value={config.ein || ""} onChange={(e) => update("ein", e.target.value)} placeholder="XX-XXXXXXX" />
        </div>
        <div>
          <Label>State of Operation</Label>
          <Input className="mt-1" value={config.state || ""} onChange={(e) => update("state", e.target.value)} placeholder="e.g. Colorado" />
        </div>
        <div className="sm:col-span-2">
          <div className="border-t pt-5 mt-2">
            <p className="text-sm font-semibold text-gray-700 mb-3">Executive Director</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input className="mt-1" value={config.directorName || ""} onChange={(e) => update("directorName", e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1" type="email" value={config.directorEmail || ""} onChange={(e) => update("directorEmail", e.target.value)} placeholder="director@yoursgo.org" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2({ config, setConfig }) {
  const update = (key, val) => setConfig((c) => ({ ...c, [key]: val }));
  const grades = config.eligibleGrades || [];
  const categories = config.activityCategories || [];

  const toggleGrade = (g) => {
    update("eligibleGrades", grades.includes(g) ? grades.filter((x) => x !== g) : [...grades, g]);
  };
  const toggleCategory = (c) => {
    update("activityCategories", categories.includes(c) ? categories.filter((x) => x !== c) : [...categories, c]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>Program Configuration</h2>
        <p className="text-sm text-gray-500 mt-1">Set up how your scholarship program works.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Program Name</Label>
          <Input className="mt-1" value={config.programName || ""} onChange={(e) => update("programName", e.target.value)} placeholder="e.g. My Spark Denver" />
        </div>

        <div>
          <Label>Scholarship Amount Per Student ($)</Label>
          <Input className="mt-1" type="number" value={config.scholarshipAmount ?? 1000} onChange={(e) => update("scholarshipAmount", e.target.value)} />
        </div>

        <div>
          <Label>Fund Expiration Policy</Label>
          <select
            className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            value={config.fundExpiration || "end_of_year"}
            onChange={(e) => update("fundExpiration", e.target.value)}
          >
            <option value="end_of_year">End of school year</option>
            <option value="12_months">12 months from activation</option>
            <option value="custom">Custom date</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <Label>Eligible Grades</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {["K-2", "3-5", "6-8", "9-12"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGrade(g)}
                className="flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all"
                style={{
                  borderColor: grades.includes(g) ? "#0F2D5E" : "#D1D5DB",
                  backgroundColor: grades.includes(g) ? "#0F2D5E" : "white",
                  color: grades.includes(g) ? "white" : "#374151",
                }}
              >
                {grades.includes(g) && <Check className="h-3.5 w-3.5" />}
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label>Eligible Activity Categories</Label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {ACTIVITY_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                className="rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all text-center"
                style={{
                  borderColor: categories.includes(c) ? "#F5A623" : "#E5E7EB",
                  backgroundColor: categories.includes(c) ? "#FFF8EC" : "white",
                  color: categories.includes(c) ? "#B8751A" : "#6B7280",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Max Students Per Cohort</Label>
          <Input className="mt-1" type="number" value={config.maxStudents || ""} onChange={(e) => update("maxStudents", e.target.value)} placeholder="e.g. 500" />
        </div>

        <div />

        <div>
          <Label>Application Open Date</Label>
          <Input className="mt-1" type="date" value={config.appOpenDate || ""} onChange={(e) => update("appOpenDate", e.target.value)} />
        </div>
        <div>
          <Label>Application Close Date</Label>
          <Input className="mt-1" type="date" value={config.appCloseDate || ""} onChange={(e) => update("appCloseDate", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function Step3({ config, setConfig }) {
  const rules = config.eligibilityRules || [
    { id: 1, label: "Free & Reduced Lunch eligibility required", enabled: true, type: "toggle" },
    { id: 2, label: "Enrolled in public school", enabled: true, type: "toggle" },
    { id: 3, label: "Resident of", enabled: true, type: "area", area: "Denver Metro" },
    { id: 4, label: "Age range", enabled: true, type: "age", minAge: 5, maxAge: 18 },
  ];

  const updateRules = (updated) => setConfig((c) => ({ ...c, eligibilityRules: updated }));

  const toggleRule = (id) => {
    updateRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const updateRule = (id, key, val) => {
    updateRules(rules.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  };

  const addCustomRule = () => {
    updateRules([...rules, { id: Date.now(), label: "", enabled: true, type: "custom", description: "" }]);
  };

  const removeRule = (id) => {
    updateRules(rules.filter((r) => r.id !== id));
  };

  // Initialize rules in config if needed
  if (!config.eligibilityRules) {
    setConfig((c) => ({ ...c, eligibilityRules: rules }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>Eligibility Rules</h2>
        <p className="text-sm text-gray-500 mt-1">Define who qualifies for your scholarship program.</p>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id} className={`transition-all ${rule.enabled ? "" : "opacity-60"}`}>
            <CardContent className="p-4 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {rule.type === "custom" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={rule.description || ""}
                        onChange={(e) => updateRule(rule.id, "description", e.target.value)}
                        placeholder="Enter custom rule description..."
                        className="flex-1"
                      />
                      <button onClick={() => removeRule(rule.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-gray-900 text-sm">
                        {rule.type === "area" ? `${rule.label} ${rule.area || ""}` : rule.label}
                      </p>
                      {rule.type === "area" && rule.enabled && (
                        <div className="mt-2">
                          <Input
                            value={rule.area || ""}
                            onChange={(e) => updateRule(rule.id, "area", e.target.value)}
                            placeholder="Enter area name"
                            className="max-w-xs text-sm"
                          />
                        </div>
                      )}
                      {rule.type === "age" && rule.enabled && (
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            type="number"
                            value={rule.minAge ?? 5}
                            onChange={(e) => updateRule(rule.id, "minAge", e.target.value)}
                            className="w-20 text-sm"
                          />
                          <span className="text-sm text-gray-500">to</span>
                          <Input
                            type="number"
                            value={rule.maxAge ?? 18}
                            onChange={(e) => updateRule(rule.id, "maxAge", e.target.value)}
                            className="w-20 text-sm"
                          />
                          <span className="text-sm text-gray-500">years old</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {rule.type !== "custom" && (
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="mt-0.5 relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
                    style={{ backgroundColor: rule.enabled ? "#2E7D32" : "#D1D5DB" }}
                  >
                    <span
                      className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: rule.enabled ? "translateX(20px)" : "translateX(0)" }}
                    />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addCustomRule}
        className="gap-2"
      >
        <Plus className="h-4 w-4" /> Add Custom Rule
      </Button>
    </div>
  );
}

function Step4({ config, setConfig }) {
  const update = (key, val) => setConfig((c) => ({ ...c, [key]: val }));
  const [testing, setTesting] = useState(false);

  const testConnection = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      update("chekConnected", true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>Chek Integration</h2>
        <p className="text-sm text-gray-500 mt-1">Connect your Chek account for card issuance and payments.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label>Chek Program ID</Label>
          <Input className="mt-1" value={config.chekProgramId || ""} onChange={(e) => update("chekProgramId", e.target.value)} placeholder="PRG-XXXXXXXX" />
        </div>
        <div>
          <Label>Chek API Key</Label>
          <Input className="mt-1" type="password" value={config.chekApiKey || ""} onChange={(e) => update("chekApiKey", e.target.value)} placeholder="Enter your API key" />
        </div>
      </div>

      {/* Card Design */}
      <div>
        <Label>Card Design</Label>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {CARD_DESIGNS.map((design) => (
            <button
              key={design}
              type="button"
              onClick={() => update("cardDesign", design)}
              className="rounded-xl overflow-hidden border-2 transition-all"
              style={{
                borderColor: config.cardDesign === design ? "#0F2D5E" : "#E5E7EB",
                boxShadow: config.cardDesign === design ? "0 0 0 1px #0F2D5E" : "none",
              }}
            >
              <div
                className="h-16 sm:h-20 flex items-end p-2"
                style={{
                  backgroundColor: config.primaryColor || "#0F2D5E",
                  borderRadius: design === "Modern" ? "0 0 24px 0" : design === "Bold" ? "0" : "0",
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-white/40" />
                  <div className="h-1.5 w-8 rounded bg-white/40" />
                </div>
              </div>
              <div className="px-2 py-1.5 bg-white">
                <p className="text-xs font-medium text-gray-700">{design}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Test Connection */}
      <div className="flex items-center gap-3">
        <Button
          onClick={testConnection}
          disabled={testing}
          className="gap-2 text-white"
          style={{ backgroundColor: "#0F2D5E" }}
        >
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          {testing ? "Testing..." : "Test Connection"}
        </Button>
        {config.chekConnected && (
          <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#2E7D32" }}>
            <CheckCircle className="h-4 w-4" /> Connected to Chek — ready to issue cards.
          </span>
        )}
      </div>

      {/* Explainer */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-5 pt-5">
          <p className="font-semibold text-sm mb-3" style={{ color: "#0F2D5E" }}>What Chek handles automatically:</p>
          <ul className="space-y-1.5 text-sm text-gray-600">
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#2E7D32" }} /> Card issuance & activation</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#2E7D32" }} /> Restricted merchant acceptance</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#2E7D32" }} /> Multi-source fund stacking</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#2E7D32" }} /> Real-time transaction reporting</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#2E7D32" }} /> Fraud detection & prevention</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Step5({ config, setConfig }) {
  const update = (key, val) => setConfig((c) => ({ ...c, [key]: val }));
  const national = config.useNationalNetwork ?? false;
  const custom = config.buildOwnNetwork ?? false;

  const mockProviders = [
    "Denver Youth Sports Academy",
    "Rocky Mountain Music School",
    "Mile High Dance Studio",
    "Front Range STEM Labs",
    "Colorado Arts Collective",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>Provider Network</h2>
        <p className="text-sm text-gray-500 mt-1">Choose how to build your network of approved activity providers.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* National Network */}
        <button
          type="button"
          onClick={() => update("useNationalNetwork", !national)}
          className="text-left rounded-xl border-2 p-5 transition-all"
          style={{
            borderColor: national ? "#0F2D5E" : "#E5E7EB",
            backgroundColor: national ? "#F0F4FA" : "white",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Checkbox checked={national} className="pointer-events-none" />
            <Globe className="h-5 w-5" style={{ color: "#0F2D5E" }} />
          </div>
          <p className="font-semibold text-gray-900">Start with the National Provider Network</p>
          <p className="text-sm text-gray-500 mt-1">2,400+ providers across 38 states</p>
          {national && (
            <div className="mt-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-xs">
                <tbody>
                  {mockProviders.map((p, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-2 py-1.5 text-gray-700">{p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </button>

        {/* Build Your Own */}
        <button
          type="button"
          onClick={() => update("buildOwnNetwork", !custom)}
          className="text-left rounded-xl border-2 p-5 transition-all"
          style={{
            borderColor: custom ? "#0F2D5E" : "#E5E7EB",
            backgroundColor: custom ? "#F0F4FA" : "white",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Checkbox checked={custom} className="pointer-events-none" />
            <Users className="h-5 w-5" style={{ color: "#0F2D5E" }} />
          </div>
          <p className="font-semibold text-gray-900">Build Your Own Network</p>
          <p className="text-sm text-gray-500 mt-1">Start with an empty directory and use the existing provider application workflow.</p>
        </button>
      </div>

      {/* Fast-Track Approval */}
      <Card>
        <CardContent className="p-4 pt-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-medium text-sm text-gray-900">Fast-Track Approval</p>
            <p className="text-xs text-gray-500 mt-0.5">Auto-approve providers already approved by another SGO</p>
          </div>
          <button
            onClick={() => update("fastTrackApproval", !config.fastTrackApproval)}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
            style={{ backgroundColor: config.fastTrackApproval ? "#2E7D32" : "#D1D5DB" }}
          >
            <span
              className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
              style={{ transform: config.fastTrackApproval ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

function Step6({ config, setConfig }) {
  const update = (key, val) => setConfig((c) => ({ ...c, [key]: val }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>Compliance Templates</h2>
        <p className="text-sm text-gray-500 mt-1">Pre-configured reporting templates for your program.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {REPORT_TYPES.map((r) => (
          <Card key={r.name} className="border-l-4" style={{ borderLeftColor: "#2E7D32" }}>
            <CardContent className="p-4 pt-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4" style={{ color: "#2E7D32" }} />
                <p className="font-medium text-sm text-gray-900">{r.name}</p>
              </div>
              <p className="text-xs text-gray-500 ml-6">{r.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label>State for Reporting Templates</Label>
          <Input className="mt-1" value={config.complianceState || ""} onChange={(e) => update("complianceState", e.target.value)} placeholder="e.g. Colorado" />
        </div>
        <div>
          <Label>Report Schedule</Label>
          <select
            className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            value={config.reportSchedule || "quarterly"}
            onChange={(e) => update("reportSchedule", e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
        <div>
          <Label>Compliance Contact Name</Label>
          <Input className="mt-1" value={config.complianceContactName || ""} onChange={(e) => update("complianceContactName", e.target.value)} placeholder="Full name" />
        </div>
        <div>
          <Label>Compliance Contact Email</Label>
          <Input className="mt-1" type="email" value={config.complianceContactEmail || ""} onChange={(e) => update("complianceContactEmail", e.target.value)} placeholder="compliance@yoursgo.org" />
        </div>
      </div>
    </div>
  );
}

function Step7({ config }) {
  const checklist = [
    { label: "Organization profile complete", done: !!config.sgoName },
    { label: "Program configured", done: !!config.programName },
    { label: "Eligibility rules set", done: true },
    { label: "Chek integration connected", done: !!config.chekConnected, warn: !config.chekConnected },
    { label: "Provider network selected", done: config.useNationalNetwork || config.buildOwnNetwork },
    { label: "Compliance templates configured", done: true },
  ];

  const rules = config.eligibilityRules || [];
  const enabledRules = rules.filter((r) => r.enabled);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>Review & Launch</h2>
        <p className="text-sm text-gray-500 mt-1">Review your configuration before going live.</p>
      </div>

      {/* Summary sections */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Organization</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-gray-500">SGO Name</span><span className="font-medium">{config.sgoName || "—"}</span>
              <span className="text-gray-500">State</span><span className="font-medium">{config.state || "—"}</span>
              <span className="text-gray-500">EIN</span><span className="font-medium">{config.ein || "—"}</span>
              <span className="text-gray-500">Director</span><span className="font-medium">{config.directorName || "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Program</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-gray-500">Program Name</span><span className="font-medium">{config.programName || "—"}</span>
              <span className="text-gray-500">Scholarship Amount</span><span className="font-medium">${config.scholarshipAmount || 1000}</span>
              <span className="text-gray-500">Eligible Grades</span><span className="font-medium">{(config.eligibleGrades || []).join(", ") || "—"}</span>
              <span className="text-gray-500">Activities</span><span className="font-medium">{(config.activityCategories || []).length} categories</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Eligibility Rules</p>
            <div className="space-y-1 text-sm">
              {enabledRules.length > 0 ? enabledRules.map((r) => (
                <p key={r.id} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#2E7D32" }} />
                  {r.type === "custom" ? r.description : r.type === "area" ? `${r.label} ${r.area}` : r.type === "age" ? `${r.label}: ${r.minAge}-${r.maxAge}` : r.label}
                </p>
              )) : <p className="text-gray-400">No rules configured</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Integration & Network</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-gray-500">Chek</span>
              <span className="font-medium">{config.chekConnected ? "Connected" : "Not tested"}</span>
              <span className="text-gray-500">Card Design</span><span className="font-medium">{config.cardDesign || "—"}</span>
              <span className="text-gray-500">Provider Network</span>
              <span className="font-medium">
                {[config.useNationalNetwork && "National", config.buildOwnNetwork && "Custom"].filter(Boolean).join(" + ") || "—"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch readiness */}
      <Card>
        <CardContent className="p-4 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Launch Readiness</p>
          <div className="space-y-2">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.warn ? (
                  <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "#F5A623" }} />
                ) : item.done ? (
                  <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "#2E7D32" }} />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded-full border-2 border-gray-300" />
                )}
                <span className={item.done ? "text-gray-900" : "text-gray-400"}>{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Main Wizard ── */
export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [config, setConfig] = useState({
    primaryColor: "#0F2D5E",
    secondaryColor: "#F5A623",
    scholarshipAmount: 1000,
    fundExpiration: "end_of_year",
    reportSchedule: "quarterly",
    eligibilityRules: [
      { id: 1, label: "Free & Reduced Lunch eligibility required", enabled: true, type: "toggle" },
      { id: 2, label: "Enrolled in public school", enabled: true, type: "toggle" },
      { id: 3, label: "Resident of", enabled: true, type: "area", area: "Denver Metro" },
      { id: 4, label: "Age range", enabled: true, type: "age", minAge: 5, maxAge: 18 },
    ],
  });

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 7));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const handleLaunch = () => setShowConfetti(true);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 config={config} setConfig={setConfig} />;
      case 2: return <Step2 config={config} setConfig={setConfig} />;
      case 3: return <Step3 config={config} setConfig={setConfig} />;
      case 4: return <Step4 config={config} setConfig={setConfig} />;
      case 5: return <Step5 config={config} setConfig={setConfig} />;
      case 6: return <Step6 config={config} setConfig={setConfig} />;
      case 7: return <Step7 config={config} />;
      default: return null;
    }
  };

  return (
    <Layout>
      {showConfetti && <ConfettiOverlay config={config} onClose={() => setShowConfetti(false)} />}

      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "#0F2D5E" }}
            >
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#0F2D5E" }}>SGO Replication Toolkit</h1>
              <p className="text-sm text-gray-500">Set up your branded My Spark platform in 7 easy steps</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Mobile progress tracker */}
        <div className="lg:hidden mb-4">
          <ProgressTracker currentStep={currentStep} vertical={false} />
          <p className="text-center text-sm font-medium text-gray-600">
            Step {currentStep}: {STEPS[currentStep - 1].label}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - desktop only */}
          <div className="hidden lg:block lg:w-[280px] shrink-0">
            <Card className="sticky top-6">
              <CardContent className="p-5 pt-5">
                <ProgressTracker currentStep={currentStep} vertical />
              </CardContent>
            </Card>
            <LivePreview config={config} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardContent className="p-5 pt-5 sm:p-6 sm:pt-6">
                {renderStep()}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t">
                  {currentStep > 1 ? (
                    <Button variant="outline" onClick={goBack} className="gap-2">
                      <ChevronLeft className="h-4 w-4" /> Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 7 ? (
                    <Button
                      onClick={goNext}
                      className="gap-2 text-white"
                      style={{ backgroundColor: "#0F2D5E" }}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleLaunch}
                      className="gap-2 text-white font-bold px-8 py-3 text-base"
                      style={{ backgroundColor: "#F5A623" }}
                    >
                      <Rocket className="h-5 w-5" /> Launch My Program
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
