import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Palette,
  Crown,
  Monitor,
  ChefHat,
  Music2,
  Dumbbell,
  Users,
  Swords,
  Music,
  TreePine,
  Trophy,
  Waves,
  Building2,
  UserCircle,
  ClipboardList,
  Upload,
  FileText,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

/* ─── constants ─────────────────────────────────────────────────── */

const STEP_LABELS = [
  "Organization",
  "Primary Contact",
  "Program Details",
  "Documents",
  "Agreement",
];

const ACTIVITY_TILES = [
  { id: "academics", label: "Academics & Tutoring", icon: BookOpen },
  { id: "art", label: "Art", icon: Palette },
  { id: "chess", label: "Chess", icon: Crown },
  { id: "computer", label: "Computer", icon: Monitor },
  { id: "cooking", label: "Cooking", icon: ChefHat },
  { id: "dance", label: "Dance", icon: Music2 },
  { id: "gymnastics", label: "Gymnastics", icon: Dumbbell },
  { id: "leadership", label: "Leadership Development", icon: Users },
  { id: "martialArts", label: "Martial Arts", icon: Swords },
  { id: "music", label: "Music", icon: Music },
  { id: "outdoors", label: "Outdoors & Parks", icon: TreePine },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "swim", label: "Swim", icon: Waves },
];

const COLORADO_COUNTIES = [
  "Denver",
  "Adams",
  "Arapahoe",
  "Boulder",
  "Douglas",
  "El Paso",
  "Jefferson",
  "Larimer",
  "Weld",
  "Other",
];

const REQUIRED_DOCS = [
  { id: "w9", label: "W-9 Form", fileName: "W9_Form.pdf", size: "142 KB", required: true },
  { id: "insurance", label: "Certificate of Insurance / General Liability", fileName: "COI_General_Liability.pdf", size: "328 KB", required: true },
  { id: "backgroundCheck", label: "Staff Background Check Policy", fileName: "Background_Check_Policy.pdf", size: "89 KB", required: true },
];

const OPTIONAL_DOCS = [
  { id: "501c3", label: "501(c)(3) Determination Letter", fileName: "501c3_Determination.pdf", size: "201 KB", note: "If applicable" },
  { id: "stateReg", label: "State Business Registration", fileName: "State_Business_Registration.pdf", size: "156 KB" },
];

/* ─── helpers ───────────────────────────────────────────────────── */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s()+-]{7,20}$/.test(phone);
}

function generateRefNumber() {
  const num = String(Math.floor(Math.random() * 900000) + 100000).padStart(6, "0");
  return `PRV-2026-MSS-${num}`;
}

function todayString() {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ─── component ─────────────────────────────────────────────────── */

function ProviderApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [refNumber, setRefNumber] = useState("");

  /* --- form state --- */
  const [form, setForm] = useState({
    // Step 1 - Organization
    orgName: "",
    dbaName: "",
    orgType: "",
    ein: "",
    yearFounded: "",
    website: "",
    orgDescription: "",

    // Step 2 - Primary Contact
    contactFirstName: "",
    contactLastName: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
    preferredContact: "",

    // Step 3 - Program Details
    activityTypes: [],
    programmingLocations: [],
    serviceArea: [],
    ageRanges: [],
    slidingScale: "",
    acceptsPublicFunding: "",
    publicFundingDescription: "",

    // Step 4 - Documents
    uploadedDocs: [],

    // Step 5 - Agreement
    agreeTerms: false,
    signature: "",
    signatureDate: todayString(),
  });

  /* --- field updaters --- */
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const toggleArrayField = (field, value) => {
    setForm((prev) => {
      const arr = prev[field];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [field]: next };
    });
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const toggleActivityTile = (id) => {
    setForm((prev) => {
      const arr = prev.activityTypes;
      if (arr.includes(id)) {
        return { ...prev, activityTypes: arr.filter((v) => v !== id) };
      }
      return { ...prev, activityTypes: [...arr, id] };
    });
    if (errors.activityTypes) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.activityTypes;
        return copy;
      });
    }
  };

  const toggleDoc = (docId) => {
    setForm((prev) => {
      const arr = prev.uploadedDocs;
      const next = arr.includes(docId)
        ? arr.filter((v) => v !== docId)
        : [...arr, docId];
      return { ...prev, uploadedDocs: next };
    });
    if (errors.uploadedDocs) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.uploadedDocs;
        return copy;
      });
    }
  };

  /* --- validation --- */
  const validateStep = (step) => {
    const errs = {};

    if (step === 1) {
      if (!form.orgName.trim()) errs.orgName = "Organization name is required";
      if (!form.orgType) errs.orgType = "Organization type is required";
      if (!form.ein.trim()) errs.ein = "EIN / Tax ID is required";
      if (!form.yearFounded) errs.yearFounded = "Year founded is required";
      if (!form.orgDescription.trim()) errs.orgDescription = "Organization description is required";
    }

    if (step === 2) {
      if (!form.contactFirstName.trim()) errs.contactFirstName = "First name is required";
      if (!form.contactLastName.trim()) errs.contactLastName = "Last name is required";
      if (!form.contactTitle.trim()) errs.contactTitle = "Title/Role is required";
      if (!form.contactEmail.trim()) {
        errs.contactEmail = "Email is required";
      } else if (!isValidEmail(form.contactEmail)) {
        errs.contactEmail = "Please enter a valid email address";
      }
      if (!form.contactPhone.trim()) {
        errs.contactPhone = "Phone number is required";
      } else if (!isValidPhone(form.contactPhone)) {
        errs.contactPhone = "Please enter a valid phone number";
      }
      if (!form.preferredContact) errs.preferredContact = "Please select a preferred contact method";
    }

    if (step === 3) {
      if (form.activityTypes.length === 0) errs.activityTypes = "Please select at least one activity type";
      if (form.programmingLocations.length === 0) errs.programmingLocations = "Please select at least one location type";
      if (form.serviceArea.length === 0) errs.serviceArea = "Please select at least one county";
      if (form.ageRanges.length === 0) errs.ageRanges = "Please select at least one age range";
      if (!form.slidingScale) errs.slidingScale = "Please select an option";
      if (!form.acceptsPublicFunding) errs.acceptsPublicFunding = "Please select an option";
      if (form.acceptsPublicFunding === "yes" && !form.publicFundingDescription.trim()) {
        errs.publicFundingDescription = "Please describe the funding programs";
      }
    }

    if (step === 4) {
      const requiredIds = REQUIRED_DOCS.map((d) => d.id);
      const missing = requiredIds.filter((id) => !form.uploadedDocs.includes(id));
      if (missing.length > 0) errs.uploadedDocs = "Please upload all required documents";
    }

    if (step === 5) {
      if (!form.agreeTerms) errs.agreeTerms = "You must agree to the Provider Terms of Service";
      if (!form.signature.trim()) errs.signature = "Signature is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => s - 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (validateStep(5)) {
      setRefNumber(generateRefNumber());
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* --- reusable field error display --- */
  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
    ) : null;

  const errorBorder = (field) =>
    errors[field] ? "border-red-500 focus:ring-red-500" : "";

  /* ─── progress bar ────────────────────────────────────────────── */
  const progressValue = currentStep >= 6 ? 100 : ((currentStep - 1) / 5) * 100;

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1;
          const isComplete = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;
          return (
            <div key={stepNum} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    isComplete
                      ? "bg-[#2E7D32] text-white"
                      : isCurrent
                      ? "bg-[#0F2D5E] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isComplete ? <Check className="h-5 w-5" /> : stepNum}
                </div>
                <span
                  className={`mt-1 text-xs font-medium text-center hidden sm:block ${
                    isCurrent
                      ? "text-[#0F2D5E]"
                      : isComplete
                      ? "text-[#2E7D32]"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {stepNum < 5 && (
                <div
                  className={`mx-2 h-0.5 flex-1 ${
                    currentStep > stepNum ? "bg-[#2E7D32]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );

  /* ─── STEP 1 — Organization Information ─────────────────────── */
  const Step1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
          <Building2 className="h-5 w-5" />
          Organization Information
        </CardTitle>
        <p className="text-sm text-gray-500">
          Tell us about your organization so we can verify your eligibility as a provider.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Organization Name */}
        <div>
          <Label htmlFor="orgName">Organization Name *</Label>
          <Input
            id="orgName"
            placeholder="e.g. Denver Youth Athletics"
            className={errorBorder("orgName")}
            value={form.orgName}
            onChange={(e) => updateField("orgName", e.target.value)}
          />
          <FieldError field="orgName" />
        </div>

        {/* DBA Name */}
        <div>
          <Label htmlFor="dbaName">DBA Name</Label>
          <p className="mb-1 text-sm text-gray-500">If different from organization name</p>
          <Input
            id="dbaName"
            placeholder="e.g. DYA Programs"
            value={form.dbaName}
            onChange={(e) => updateField("dbaName", e.target.value)}
          />
        </div>

        {/* Organization Type */}
        <div>
          <Label>Organization Type *</Label>
          <Select
            value={form.orgType}
            onValueChange={(v) => updateField("orgType", v)}
          >
            <SelectTrigger className={errorBorder("orgType")}>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="for-profit">For-Profit</SelectItem>
              <SelectItem value="nonprofit">Nonprofit 501(c)(3)</SelectItem>
              <SelectItem value="government">Government / Public</SelectItem>
              <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
              <SelectItem value="llc">LLC</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FieldError field="orgType" />
        </div>

        {/* EIN / Tax ID */}
        <div>
          <Label htmlFor="ein">EIN / Tax ID *</Label>
          <Input
            id="ein"
            placeholder="XX-XXXXXXX"
            className={errorBorder("ein")}
            value={form.ein}
            onChange={(e) => updateField("ein", e.target.value)}
          />
          <FieldError field="ein" />
        </div>

        {/* Year Founded & Website */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="yearFounded">Year Founded *</Label>
            <Input
              id="yearFounded"
              type="number"
              placeholder="e.g. 2010"
              className={errorBorder("yearFounded")}
              value={form.yearFounded}
              onChange={(e) => updateField("yearFounded", e.target.value)}
            />
            <FieldError field="yearFounded" />
          </div>
          <div>
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://www.example.com"
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
            />
          </div>
        </div>

        {/* Organization Description */}
        <div>
          <Label htmlFor="orgDescription">Organization Description *</Label>
          <Textarea
            id="orgDescription"
            rows={4}
            placeholder="Briefly describe your organization, its mission, and the programs you offer..."
            className={errorBorder("orgDescription")}
            value={form.orgDescription}
            onChange={(e) => updateField("orgDescription", e.target.value)}
          />
          <FieldError field="orgDescription" />
        </div>
      </CardContent>
    </Card>
  );

  /* ─── STEP 2 — Primary Contact ──────────────────────────────── */
  const Step2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
          <UserCircle className="h-5 w-5" />
          Primary Contact
        </CardTitle>
        <p className="text-sm text-gray-500">
          Provide the primary point of contact for your organization.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Name */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="contactFirstName">First Name *</Label>
            <Input
              id="contactFirstName"
              placeholder="e.g. Maria"
              className={errorBorder("contactFirstName")}
              value={form.contactFirstName}
              onChange={(e) => updateField("contactFirstName", e.target.value)}
            />
            <FieldError field="contactFirstName" />
          </div>
          <div>
            <Label htmlFor="contactLastName">Last Name *</Label>
            <Input
              id="contactLastName"
              placeholder="e.g. Rodriguez"
              className={errorBorder("contactLastName")}
              value={form.contactLastName}
              onChange={(e) => updateField("contactLastName", e.target.value)}
            />
            <FieldError field="contactLastName" />
          </div>
        </div>

        {/* Title/Role */}
        <div>
          <Label htmlFor="contactTitle">Title / Role *</Label>
          <Input
            id="contactTitle"
            placeholder="e.g. Program Director"
            className={errorBorder("contactTitle")}
            value={form.contactTitle}
            onChange={(e) => updateField("contactTitle", e.target.value)}
          />
          <FieldError field="contactTitle" />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="contactEmail">Email *</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="e.g. maria@organization.org"
            className={errorBorder("contactEmail")}
            value={form.contactEmail}
            onChange={(e) => updateField("contactEmail", e.target.value)}
          />
          <FieldError field="contactEmail" />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="contactPhone">Phone *</Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="e.g. (303) 555-1234"
            className={errorBorder("contactPhone")}
            value={form.contactPhone}
            onChange={(e) => updateField("contactPhone", e.target.value)}
          />
          <FieldError field="contactPhone" />
        </div>

        {/* Preferred Contact Method */}
        <div>
          <Label className="text-base font-semibold">Preferred Contact Method *</Label>
          <RadioGroup
            value={form.preferredContact}
            onValueChange={(v) => updateField("preferredContact", v)}
            className="mt-3 flex flex-wrap gap-6"
          >
            {[
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
              { value: "either", label: "Either" },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={value} id={`contact-${value}`} />
                <Label htmlFor={`contact-${value}`} className="cursor-pointer font-normal">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <FieldError field="preferredContact" />
        </div>
      </CardContent>
    </Card>
  );

  /* ─── STEP 3 — Program Details ──────────────────────────────── */
  const Step3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
          <ClipboardList className="h-5 w-5" />
          Program Details
        </CardTitle>
        <p className="text-sm text-gray-500">
          Help us understand the programs and services you offer.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Activity Type Tiles */}
        <div>
          <Label className="text-base font-semibold">
            What types of activities do you offer? *
          </Label>
          <p className="mb-3 text-sm text-gray-500">
            Select all activity types that apply to your programs.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {ACTIVITY_TILES.map(({ id, label, icon: Icon }) => {
              const selected = form.activityTypes.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleActivityTile(id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${
                    selected
                      ? "border-[#0F2D5E] bg-[#0F2D5E]/5 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <Icon
                    className={`h-7 w-7 ${
                      selected ? "text-[#0F2D5E]" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium leading-tight ${
                      selected ? "text-[#0F2D5E]" : "text-gray-600"
                    }`}
                  >
                    {label}
                  </span>
                  {selected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F2D5E]">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <FieldError field="activityTypes" />
        </div>

        {/* Programming Locations */}
        <div>
          <Label className="text-base font-semibold">
            Where do you offer programming? *
          </Label>
          <div className="mt-3 space-y-3">
            {[
              { value: "own-facility", label: "In-person at our facility" },
              { value: "school-community", label: "In-person at schools / community sites" },
              { value: "online", label: "Online / virtual" },
              { value: "both", label: "Both in-person and virtual" },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center gap-3">
                <Checkbox
                  id={`loc-${value}`}
                  checked={form.programmingLocations.includes(value)}
                  onCheckedChange={() => toggleArrayField("programmingLocations", value)}
                />
                <Label htmlFor={`loc-${value}`} className="cursor-pointer font-normal">
                  {label}
                </Label>
              </div>
            ))}
          </div>
          <FieldError field="programmingLocations" />
        </div>

        {/* Service Area */}
        <div>
          <Label className="text-base font-semibold">
            Service Area (Colorado Counties) *
          </Label>
          <p className="mb-3 text-sm text-gray-500">
            Select all counties where you currently offer or plan to offer services.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {COLORADO_COUNTIES.map((county) => (
              <div key={county} className="flex items-center gap-3">
                <Checkbox
                  id={`county-${county}`}
                  checked={form.serviceArea.includes(county)}
                  onCheckedChange={() => toggleArrayField("serviceArea", county)}
                />
                <Label htmlFor={`county-${county}`} className="cursor-pointer font-normal">
                  {county}
                </Label>
              </div>
            ))}
          </div>
          <FieldError field="serviceArea" />
        </div>

        {/* Age Ranges */}
        <div>
          <Label className="text-base font-semibold">
            Age Ranges Served *
          </Label>
          <div className="mt-3 space-y-3">
            {[
              { value: "elementary", label: "Elementary (K-5)" },
              { value: "middle", label: "Middle School (6-8)" },
              { value: "high", label: "High School (9-12)" },
              { value: "all", label: "Mixed / All Ages" },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center gap-3">
                <Checkbox
                  id={`age-${value}`}
                  checked={form.ageRanges.includes(value)}
                  onCheckedChange={() => toggleArrayField("ageRanges", value)}
                />
                <Label htmlFor={`age-${value}`} className="cursor-pointer font-normal">
                  {label}
                </Label>
              </div>
            ))}
          </div>
          <FieldError field="ageRanges" />
        </div>

        {/* Sliding Scale */}
        <div>
          <Label className="text-base font-semibold">
            Do you offer sliding scale or income-based pricing? *
          </Label>
          <RadioGroup
            value={form.slidingScale}
            onValueChange={(v) => updateField("slidingScale", v)}
            className="mt-3 flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="sliding-yes" />
              <Label htmlFor="sliding-yes" className="cursor-pointer font-normal">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="sliding-no" />
              <Label htmlFor="sliding-no" className="cursor-pointer font-normal">No</Label>
            </div>
          </RadioGroup>
          <FieldError field="slidingScale" />
        </div>

        {/* Public Funding */}
        <div>
          <Label className="text-base font-semibold">
            Do you currently accept any public funding or subsidy programs? *
          </Label>
          <RadioGroup
            value={form.acceptsPublicFunding}
            onValueChange={(v) => updateField("acceptsPublicFunding", v)}
            className="mt-3 flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="funding-yes" />
              <Label htmlFor="funding-yes" className="cursor-pointer font-normal">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="funding-no" />
              <Label htmlFor="funding-no" className="cursor-pointer font-normal">No</Label>
            </div>
          </RadioGroup>
          <FieldError field="acceptsPublicFunding" />

          {form.acceptsPublicFunding === "yes" && (
            <div className="mt-4">
              <Label htmlFor="publicFundingDescription">Please describe *</Label>
              <Input
                id="publicFundingDescription"
                placeholder="e.g. CCAP, Title I, 21st Century Community Learning Centers..."
                className={errorBorder("publicFundingDescription")}
                value={form.publicFundingDescription}
                onChange={(e) => updateField("publicFundingDescription", e.target.value)}
              />
              <FieldError field="publicFundingDescription" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  /* ─── STEP 4 — Document Uploads ─────────────────────────────── */
  const Step4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
          <Upload className="h-5 w-5" />
          Document Uploads
        </CardTitle>
        <p className="text-sm text-gray-500">
          Upload the required documents to complete your application. Click each zone to simulate an upload.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Required Documents */}
        <div>
          <Label className="text-base font-semibold">Required Documents</Label>
          <div className="mt-3 space-y-4">
            {REQUIRED_DOCS.map((doc) => {
              const uploaded = form.uploadedDocs.includes(doc.id);
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggleDoc(doc.id)}
                  className={`w-full rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                    uploaded
                      ? "border-[#2E7D32] bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {uploaded ? (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle className="h-6 w-6 text-[#2E7D32]" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{doc.fileName}</p>
                        <p className="text-sm text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <p className="font-medium text-gray-700">{doc.label} <span className="text-red-500">*</span></p>
                      <p className="text-sm text-gray-400">Click or drag to upload</p>
                      <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <FieldError field="uploadedDocs" />
        </div>

        {/* Optional Documents */}
        <div>
          <Label className="text-base font-semibold">Optional Documents</Label>
          <div className="mt-3 space-y-4">
            {OPTIONAL_DOCS.map((doc) => {
              const uploaded = form.uploadedDocs.includes(doc.id);
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggleDoc(doc.id)}
                  className={`w-full rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                    uploaded
                      ? "border-[#2E7D32] bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {uploaded ? (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle className="h-6 w-6 text-[#2E7D32]" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{doc.fileName}</p>
                        <p className="text-sm text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <p className="font-medium text-gray-700">
                        {doc.label}
                        {doc.note && <span className="ml-1 text-sm text-gray-400">({doc.note})</span>}
                      </p>
                      <p className="text-sm text-gray-400">Click or drag to upload</p>
                      <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Documents will be reviewed by our team within 5 business days.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  /* ─── STEP 5 — Agreement & Submission ───────────────────────── */
  const Step5 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
          <ShieldCheck className="h-5 w-5" />
          Agreement & Submission
        </CardTitle>
        <p className="text-sm text-gray-500">
          Review and agree to the Provider Terms of Service to submit your application.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Terms of Service */}
        <div>
          <Label className="text-base font-semibold">Provider Terms of Service</Label>
          <div className="mt-3 h-64 overflow-y-auto rounded-lg border bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed">
            <h4 className="mb-2 font-bold text-gray-900">My Spark SGO -- Provider Terms of Service</h4>

            <p className="mb-3">
              By submitting this application and entering into an agreement with My Spark SGO, you ("Provider") agree to the following terms and conditions governing your participation in the My Spark SGO provider network.
            </p>

            <h5 className="mb-1 font-semibold text-gray-900">1. Payment Processing</h5>
            <p className="mb-3">
              All payments for services rendered through the My Spark SGO program will be processed via the Chek virtual card system. Families will present their Chek virtual card at the time of enrollment or service. Providers must have a functioning point-of-sale system or online payment portal capable of accepting virtual card payments. My Spark SGO is not responsible for payment processing fees charged by your merchant services provider.
            </p>

            <h5 className="mb-1 font-semibold text-gray-900">2. Program Quality & Safety</h5>
            <p className="mb-3">
              Provider is responsible for maintaining high-quality programming that meets or exceeds industry standards. All staff who interact with minors must have current background checks on file. Provider must maintain adequate supervision ratios as required by applicable state and local regulations. Provider agrees to immediately report any safety incidents to My Spark SGO within 24 hours of occurrence.
            </p>

            <h5 className="mb-1 font-semibold text-gray-900">3. Attendance Tracking</h5>
            <p className="mb-3">
              Provider agrees to maintain accurate attendance records for all participants enrolled through the My Spark SGO program. Attendance data must be submitted through the My Spark SGO provider portal within 48 hours of each session. Failure to maintain accurate attendance records may result in payment delays or suspension from the provider network.
            </p>

            <h5 className="mb-1 font-semibold text-gray-900">4. Compliance</h5>
            <p className="mb-3">
              Provider agrees to comply with all applicable My Spark SGO policies, including but not limited to: non-discrimination policies, data privacy and protection requirements, marketing and branding guidelines, and program reporting requirements. Provider must maintain all required licenses, certifications, and insurance coverage for the duration of participation in the network.
            </p>

            <h5 className="mb-1 font-semibold text-gray-900">5. Payment Timeline</h5>
            <p className="mb-3">
              Payments processed through the Chek virtual card system will be settled on a net-15 basis after the date of service. Provider will receive a monthly statement detailing all transactions processed during the billing period. Any payment disputes must be submitted in writing within 30 days of the transaction date.
            </p>

            <h5 className="mb-1 font-semibold text-gray-900">6. Dispute Resolution</h5>
            <p className="mb-3">
              In the event of a dispute between Provider and My Spark SGO, both parties agree to first attempt resolution through good-faith negotiation. If a resolution cannot be reached within 30 days, the dispute shall be submitted to mediation in Denver, Colorado. The prevailing party in any legal action shall be entitled to recover reasonable attorney fees and costs.
            </p>

            <p className="mt-4 text-xs text-gray-500">
              Last updated: March 2026. These terms are subject to change with 30 days written notice.
            </p>
          </div>
        </div>

        {/* Agree Checkbox */}
        <div className="flex items-start gap-3 rounded-lg border p-4 bg-gray-50">
          <Checkbox
            id="agreeTerms"
            checked={form.agreeTerms}
            onCheckedChange={(v) => updateField("agreeTerms", !!v)}
          />
          <Label htmlFor="agreeTerms" className="cursor-pointer leading-snug font-medium">
            I agree to the Provider Terms of Service *
          </Label>
        </div>
        <FieldError field="agreeTerms" />

        {/* Signature */}
        <div>
          <Label htmlFor="signature">Signature (Type your full legal name) *</Label>
          <Input
            id="signature"
            placeholder="e.g. Maria A. Rodriguez"
            className={errorBorder("signature")}
            value={form.signature}
            onChange={(e) => updateField("signature", e.target.value)}
          />
          <FieldError field="signature" />
        </div>

        {/* Date */}
        <div>
          <Label htmlFor="signatureDate">Date</Label>
          <Input
            id="signatureDate"
            value={form.signatureDate}
            disabled
            className="bg-gray-100"
          />
        </div>
      </CardContent>
    </Card>
  );

  /* ─── CONFIRMATION ──────────────────────────────────────────── */
  const Confirmation = () => (
    <div className="flex flex-col items-center py-8 text-center">
      {/* Animated checkmark */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#2E7D32] shadow-lg animate-[scale-in_0.5s_ease-out]">
        <Check className="h-12 w-12 text-white" strokeWidth={3} />
      </div>

      <h2 className="mb-2 text-3xl font-bold" style={{ color: "#0F2D5E" }}>
        Application Received!
      </h2>
      <p className="mb-1 text-gray-500">Your reference number is:</p>
      <p className="mb-6 text-lg font-mono font-bold" style={{ color: "#0F2D5E" }}>
        {refNumber}
      </p>
      <p className="mb-8 max-w-md text-gray-600">
        We'll review your application and reach out within 5 business days.
        Please save your reference number for your records.
      </p>

      {/* What happens next */}
      <Card className="mb-8 w-full max-w-lg text-left">
        <CardHeader>
          <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2D5E] text-sm font-bold text-white">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-800">Application & Document Review</p>
                <p className="text-sm text-gray-500">
                  Our team will review your application, verify your documents, and confirm your organization's eligibility within 5 business days.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2D5E] text-sm font-bold text-white">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-800">Provider Onboarding</p>
                <p className="text-sm text-gray-500">
                  Once approved, you'll receive access to the provider portal to set up your program listings, pricing, and availability.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2D5E] text-sm font-bold text-white">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-800">Chek Payment Setup</p>
                <p className="text-sm text-gray-500">
                  Configure your payment processing to accept Chek virtual card payments from enrolled families.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2D5E] text-sm font-bold text-white">
                4
              </div>
              <div>
                <p className="font-semibold text-gray-800">Go Live</p>
                <p className="text-sm text-gray-500">
                  Your programs will appear in the My Spark SGO marketplace and families can begin enrolling.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Link to="/">
        <Button
          size="lg"
          className="gap-2"
          style={{ backgroundColor: "#0F2D5E" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );

  /* ─── main render ─────────────────────────────────────────── */
  return (
    <Layout>
      <PageHeader
        title="Provider Application"
        description="Apply to become an approved provider in the My Spark SGO network."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Apply", href: "/apply" },
          { label: "Provider Application" },
        ]}
      />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {currentStep <= 5 && <StepIndicator />}

        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
        {currentStep === 5 && <Step5 />}
        {currentStep === 6 && <Confirmation />}

        {/* Navigation buttons */}
        {currentStep <= 5 && (
          <div className="mt-6 flex items-center justify-between">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                className="gap-1"
                style={{ backgroundColor: "#0F2D5E" }}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="gap-1"
                style={{ backgroundColor: "#2E7D32" }}
              >
                <FileText className="h-4 w-4" />
                Submit Application
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ProviderApplication;
