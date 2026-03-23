import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Check,
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
  User,
  GraduationCap,
  Heart,
  FileText,
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
import states from "@/data/states";

/* ─── constants ─────────────────────────────────────────────────── */

const STEP_LABELS = [
  "Parent/Guardian",
  "Student Info",
  "Program Interest",
  "Terms & Consent",
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

/* ─── helpers ───────────────────────────────────────────────────── */

function calculateAge(dob) {
  if (!dob) return "";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s()+-]{7,20}$/.test(phone);
}

function generateRefNumber() {
  const num = String(Math.floor(Math.random() * 900000) + 100000).padStart(6, "0");
  return `REF-2026-MSS-${num}`;
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

function FamilyApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [refNumber, setRefNumber] = useState("");

  /* --- form state --- */
  const [form, setForm] = useState({
    // Step 1
    firstName: "",
    lastName: "",
    relationship: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    preferredLanguage: "",
    marketingConsent: false,

    // Step 2
    studentFirstName: "",
    studentLastName: "",
    currentSchool: "",
    studentId: "",
    currentGrade: "",
    dob: "",
    age: "",
    genderIdentity: [],
    ethnicity: "",
    race: [],
    iep504: "",
    frlEligibility: false,

    // Step 3
    passionFrequency: "",
    currentActivities: [],
    biggestBarrier: "",
    interestedActivities: [],
    mainConcern: "",
    interestReason: "",
    hearAboutUs: [],

    // Step 4
    agreeTerms: false,
    confirmAge: false,
    consentData: false,
    signature: "",
  });

  /* --- field updaters --- */
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for that field
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
      const arr = prev.interestedActivities;
      if (arr.includes(id)) {
        return { ...prev, interestedActivities: arr.filter((v) => v !== id) };
      }
      if (arr.length >= 3) return prev;
      return { ...prev, interestedActivities: [...arr, id] };
    });
  };

  /* auto-calculate age */
  useEffect(() => {
    const age = calculateAge(form.dob);
    setForm((prev) => ({ ...prev, age: age !== "" ? String(age) : "" }));
  }, [form.dob]);

  /* --- validation --- */
  const validateStep = (step) => {
    const errs = {};

    if (step === 1) {
      if (!form.firstName.trim()) errs.firstName = "First name is required";
      if (!form.lastName.trim()) errs.lastName = "Last name is required";
      if (!form.relationship) errs.relationship = "Relationship is required";
      if (!form.address1.trim()) errs.address1 = "Address is required";
      if (!form.city.trim()) errs.city = "City is required";
      if (!form.state) errs.state = "State is required";
      if (!form.zip.trim()) errs.zip = "Zip code is required";
      if (!form.phone.trim()) {
        errs.phone = "Phone number is required";
      } else if (!isValidPhone(form.phone)) {
        errs.phone = "Please enter a valid phone number";
      }
      if (!form.email.trim()) {
        errs.email = "Email is required";
      } else if (!isValidEmail(form.email)) {
        errs.email = "Please enter a valid email address";
      }
      if (!form.preferredLanguage) errs.preferredLanguage = "Please select a language";
    }

    if (step === 2) {
      if (!form.studentFirstName.trim()) errs.studentFirstName = "Student first name is required";
      if (!form.studentLastName.trim()) errs.studentLastName = "Student last name is required";
      if (!form.currentSchool.trim()) errs.currentSchool = "School name is required";
      if (!form.studentId.trim()) errs.studentId = "Student ID is required";
      if (!form.currentGrade) errs.currentGrade = "Grade is required";
      if (!form.dob) errs.dob = "Date of birth is required";
      if (form.genderIdentity.length === 0) errs.genderIdentity = "Please select at least one option";
      if (!form.ethnicity) errs.ethnicity = "Please select an option";
      if (form.race.length === 0) errs.race = "Please select at least one option";
      if (!form.iep504) errs.iep504 = "Please select an option";
    }

    if (step === 3) {
      if (!form.passionFrequency) errs.passionFrequency = "Please select an option";
      if (form.currentActivities.length === 0) errs.currentActivities = "Please select at least one activity";
      if (!form.biggestBarrier) errs.biggestBarrier = "Please select an option";
      if (form.interestedActivities.length === 0) errs.interestedActivities = "Please select at least one activity";
      if (!form.mainConcern) errs.mainConcern = "Please select an option";
      if (form.hearAboutUs.length === 0) errs.hearAboutUs = "Please select at least one option";
    }

    if (step === 4) {
      if (!form.agreeTerms) errs.agreeTerms = "You must agree to the Terms of Service";
      if (!form.confirmAge) errs.confirmAge = "You must confirm your age";
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
    if (validateStep(4)) {
      setRefNumber(generateRefNumber());
      setCurrentStep(5);
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
  const progressValue = currentStep >= 5 ? 100 : ((currentStep - 1) / 4) * 100;

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
              {stepNum < 4 && (
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

  /* ─── STEP 1 — Parent/Guardian ─────────────────────────────── */
  const Step1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
          <User className="h-5 w-5" />
          Parent / Guardian Information
        </CardTitle>
        <p className="text-sm text-gray-500">
          Tell us about yourself so we can keep you updated on your application status.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="e.g. Maria"
              className={errorBorder("firstName")}
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
            />
            <FieldError field="firstName" />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              placeholder="e.g. Gonzalez"
              className={errorBorder("lastName")}
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
            <FieldError field="lastName" />
          </div>
        </div>

        {/* Relationship */}
        <div>
          <Label>Relationship to Student *</Label>
          <Select value={form.relationship} onValueChange={(v) => updateField("relationship", v)}>
            <SelectTrigger className={errorBorder("relationship")}>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="legalGuardian">Legal Guardian</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FieldError field="relationship" />
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address1">Address Line 1 *</Label>
          <Input
            id="address1"
            placeholder="Street address"
            className={errorBorder("address1")}
            value={form.address1}
            onChange={(e) => updateField("address1", e.target.value)}
          />
          <FieldError field="address1" />
        </div>
        <div>
          <Label htmlFor="address2">Address Line 2 <span className="text-gray-400 font-normal">(optional)</span></Label>
          <Input
            id="address2"
            placeholder="Apartment, suite, etc."
            value={form.address2}
            onChange={(e) => updateField("address2", e.target.value)}
          />
        </div>

        {/* City / State / Zip */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="e.g. Denver"
              className={errorBorder("city")}
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
            <FieldError field="city" />
          </div>
          <div>
            <Label>State *</Label>
            <Select value={form.state} onValueChange={(v) => updateField("state", v)}>
              <SelectTrigger className={errorBorder("state")}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError field="state" />
          </div>
          <div>
            <Label htmlFor="zip">Zip Code *</Label>
            <Input
              id="zip"
              placeholder="e.g. 80202"
              className={errorBorder("zip")}
              value={form.zip}
              onChange={(e) => updateField("zip", e.target.value)}
            />
            <FieldError field="zip" />
          </div>
        </div>

        {/* Phone / Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="(555) 123-4567"
              className={errorBorder("phone")}
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
            <FieldError field="phone" />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="maria.gonzalez@email.com"
              className={errorBorder("email")}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            <FieldError field="email" />
          </div>
        </div>

        {/* Preferred Language */}
        <div>
          <Label>Preferred Language *</Label>
          <Select value={form.preferredLanguage} onValueChange={(v) => updateField("preferredLanguage", v)}>
            <SelectTrigger className={`sm:max-w-xs ${errorBorder("preferredLanguage")}`}>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FieldError field="preferredLanguage" />
        </div>

        {/* Marketing consent */}
        <div className="flex items-start gap-3 rounded-lg border p-4 bg-gray-50">
          <Checkbox
            id="marketingConsent"
            checked={form.marketingConsent}
            onCheckedChange={(v) => updateField("marketingConsent", !!v)}
          />
          <Label htmlFor="marketingConsent" className="cursor-pointer leading-snug" style={{ color: "#D32F2F" }}>
            I agree and consent to be contacted by My Spark SGO or its affiliates regarding other programming opportunities that may be of interest to me.
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  /* ─── STEP 2 — Student Information ────────────────────────── */
  const Step2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
          <GraduationCap className="h-5 w-5" />
          Student Information
        </CardTitle>
        <p className="text-sm text-gray-500">
          Provide details about the student who will benefit from the scholarship.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Student Name */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="studentFirstName">Student First Name *</Label>
            <Input
              id="studentFirstName"
              placeholder="e.g. Sofia"
              className={errorBorder("studentFirstName")}
              value={form.studentFirstName}
              onChange={(e) => updateField("studentFirstName", e.target.value)}
            />
            <FieldError field="studentFirstName" />
          </div>
          <div>
            <Label htmlFor="studentLastName">Student Last Name *</Label>
            <Input
              id="studentLastName"
              placeholder="e.g. Gonzalez"
              className={errorBorder("studentLastName")}
              value={form.studentLastName}
              onChange={(e) => updateField("studentLastName", e.target.value)}
            />
            <FieldError field="studentLastName" />
          </div>
        </div>

        {/* School / Student ID */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="currentSchool">Current School Name *</Label>
            <Input
              id="currentSchool"
              placeholder="e.g. Lincoln Middle School"
              className={errorBorder("currentSchool")}
              value={form.currentSchool}
              onChange={(e) => updateField("currentSchool", e.target.value)}
            />
            <FieldError field="currentSchool" />
          </div>
          <div>
            <Label htmlFor="studentId">Student ID / Lunch Number *</Label>
            <Input
              id="studentId"
              placeholder="e.g. 123456"
              className={errorBorder("studentId")}
              value={form.studentId}
              onChange={(e) => updateField("studentId", e.target.value)}
            />
            <FieldError field="studentId" />
          </div>
        </div>

        {/* Grade */}
        <div>
          <Label>Current Grade *</Label>
          <RadioGroup
            value={form.currentGrade}
            onValueChange={(v) => updateField("currentGrade", v)}
            className="mt-2 flex flex-wrap gap-4"
          >
            {["6th", "7th", "8th"].map((g) => (
              <div key={g} className="flex items-center gap-2">
                <RadioGroupItem value={g} id={`grade-${g}`} />
                <Label htmlFor={`grade-${g}`} className="cursor-pointer font-normal">
                  {g} Grade
                </Label>
              </div>
            ))}
          </RadioGroup>
          <FieldError field="currentGrade" />
        </div>

        {/* DOB / Age */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              className={errorBorder("dob")}
              value={form.dob}
              onChange={(e) => updateField("dob", e.target.value)}
            />
            <FieldError field="dob" />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              disabled
              value={form.age}
              placeholder="Auto-calculated"
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Gender Identity */}
        <div>
          <Label>Gender Identity *</Label>
          <p className="mb-2 text-xs text-gray-500">Select all that apply</p>
          <div className="flex flex-wrap gap-4">
            {["Female", "Male", "Non-Binary", "Prefer Not to Disclose"].map((g) => (
              <div key={g} className="flex items-center gap-2">
                <Checkbox
                  id={`gender-${g}`}
                  checked={form.genderIdentity.includes(g)}
                  onCheckedChange={() => toggleArrayField("genderIdentity", g)}
                />
                <Label htmlFor={`gender-${g}`} className="cursor-pointer font-normal">
                  {g}
                </Label>
              </div>
            ))}
          </div>
          <FieldError field="genderIdentity" />
        </div>

        {/* Ethnicity */}
        <div>
          <Label>Ethnicity *</Label>
          <RadioGroup
            value={form.ethnicity}
            onValueChange={(v) => updateField("ethnicity", v)}
            className="mt-2 space-y-2"
          >
            {["Hispanic or Latino", "Not Hispanic or Latino", "Prefer Not to Disclose"].map((e) => (
              <div key={e} className="flex items-center gap-2">
                <RadioGroupItem value={e} id={`eth-${e}`} />
                <Label htmlFor={`eth-${e}`} className="cursor-pointer font-normal">
                  {e}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <FieldError field="ethnicity" />
        </div>

        {/* Race */}
        <div>
          <Label>Race *</Label>
          <p className="mb-2 text-xs text-gray-500">Select all that apply</p>
          <div className="space-y-2">
            {[
              "American Indian or Alaskan Native",
              "Asian",
              "Black or African American",
              "Native Hawaiian or Pacific Islander",
              "White",
              "Some Other Race",
              "Prefer Not to Disclose",
            ].map((r) => (
              <div key={r} className="flex items-center gap-2">
                <Checkbox
                  id={`race-${r}`}
                  checked={form.race.includes(r)}
                  onCheckedChange={() => toggleArrayField("race", r)}
                />
                <Label htmlFor={`race-${r}`} className="cursor-pointer font-normal">
                  {r}
                </Label>
              </div>
            ))}
          </div>
          <FieldError field="race" />
        </div>

        {/* IEP or 504 */}
        <div>
          <Label>Does the student have an IEP or 504 Plan? *</Label>
          <RadioGroup
            value={form.iep504}
            onValueChange={(v) => updateField("iep504", v)}
            className="mt-2 flex flex-wrap gap-4"
          >
            {["Yes", "No", "Prefer Not to Disclose"].map((o) => (
              <div key={o} className="flex items-center gap-2">
                <RadioGroupItem value={o} id={`iep-${o}`} />
                <Label htmlFor={`iep-${o}`} className="cursor-pointer font-normal">
                  {o}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <FieldError field="iep504" />
        </div>

        {/* FRL Eligibility */}
        <div className="rounded-lg border p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <Checkbox
              id="frlEligibility"
              checked={form.frlEligibility}
              onCheckedChange={(v) => updateField("frlEligibility", !!v)}
            />
            <div>
              <Label htmlFor="frlEligibility" className="cursor-pointer leading-snug">
                I affirm that this student is eligible for Free and Reduced Lunch.
              </Label>
              <p className="mt-1 text-xs text-gray-500">
                Note: School staff signature may be required for verification.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  /* ─── STEP 3 — Program Interest ───────────────────────────── */
  const Step3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
          <Heart className="h-5 w-5" />
          Program Interest
        </CardTitle>
        <p className="text-sm text-gray-500">
          Help us understand what your youth enjoys so we can match them with the best programs.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Passion frequency */}
        <div>
          <Label className="text-base font-semibold">
            How often does your youth do an activity they are passionate about? *
          </Label>
          <RadioGroup
            value={form.passionFrequency}
            onValueChange={(v) => updateField("passionFrequency", v)}
            className="mt-3 space-y-2"
          >
            {["All the time", "Often", "Occasionally", "Rarely", "Don't Know"].map((o) => (
              <div key={o} className="flex items-center gap-2">
                <RadioGroupItem value={o} id={`passion-${o}`} />
                <Label htmlFor={`passion-${o}`} className="cursor-pointer font-normal">
                  {o}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <FieldError field="passionFrequency" />
        </div>

        {/* Current activities */}
        <div>
          <Label className="text-base font-semibold">
            What types of activities does your youth currently do? *
          </Label>
          <p className="mb-2 text-xs text-gray-500">Select all that apply</p>
          <div className="flex flex-wrap gap-3">
            {[
              "Sports",
              "Arts",
              "Music",
              "Dance",
              "Academics/Tutoring",
              "STEM/Computer",
              "Outdoors",
              "Other",
            ].map((a) => (
              <div key={a} className="flex items-center gap-2">
                <Checkbox
                  id={`curAct-${a}`}
                  checked={form.currentActivities.includes(a)}
                  onCheckedChange={() => toggleArrayField("currentActivities", a)}
                />
                <Label htmlFor={`curAct-${a}`} className="cursor-pointer font-normal">
                  {a}
                </Label>
              </div>
            ))}
          </div>
          <FieldError field="currentActivities" />
        </div>

        {/* Biggest barrier */}
        <div>
          <Label className="text-base font-semibold">
            What is the biggest barrier to participation? *
          </Label>
          <RadioGroup
            value={form.biggestBarrier}
            onValueChange={(v) => updateField("biggestBarrier", v)}
            className="mt-3 space-y-2"
          >
            {[
              "Cost/Affordability",
              "Transportation",
              "Lack of programs nearby",
              "Schedule conflicts",
              "Safety concerns",
              "Don't know what's available",
              "No barriers",
              "Other",
            ].map((o) => (
              <div key={o} className="flex items-center gap-2">
                <RadioGroupItem value={o} id={`barrier-${o}`} />
                <Label htmlFor={`barrier-${o}`} className="cursor-pointer font-normal">
                  {o}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <FieldError field="biggestBarrier" />
        </div>

        {/* Activity interest tiles */}
        <div>
          <Label className="text-base font-semibold">
            What type(s) of activity are you most interested in? *
          </Label>
          <p className="mb-3 text-sm text-gray-500">
            Select up to 3 activities that interest your youth the most.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {ACTIVITY_TILES.map(({ id, label, icon: Icon }) => {
              const selected = form.interestedActivities.includes(id);
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
          <FieldError field="interestedActivities" />
        </div>

        {/* Main concern */}
        <div>
          <Label className="text-base font-semibold">
            My main concern about my youth is: *
          </Label>
          <RadioGroup
            value={form.mainConcern}
            onValueChange={(v) => updateField("mainConcern", v)}
            className="mt-3 space-y-2"
          >
            {[
              "Academic performance",
              "Social skills",
              "Physical health",
              "Mental health",
              "Screen time",
              "Lack of motivation",
              "Finding their passion",
              "Other",
            ].map((o) => (
              <div key={o} className="flex items-center gap-2">
                <RadioGroupItem value={o} id={`concern-${o}`} />
                <Label htmlFor={`concern-${o}`} className="cursor-pointer font-normal">
                  {o}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <FieldError field="mainConcern" />
        </div>

        {/* Interest reason */}
        <div>
          <Label htmlFor="interestReason" className="text-base font-semibold">
            Tell us more about why you're interested in My Spark SGO
          </Label>
          <p className="mb-2 text-xs text-gray-500">Optional — but we'd love to hear from you!</p>
          <Textarea
            id="interestReason"
            placeholder="Share anything you'd like us to know about your family's goals or your youth's interests..."
            rows={4}
            value={form.interestReason}
            onChange={(e) => updateField("interestReason", e.target.value)}
          />
        </div>

        {/* How did you hear about us */}
        <div>
          <Label className="text-base font-semibold">How did you hear about us? *</Label>
          <p className="mb-2 text-xs text-gray-500">Select all that apply</p>
          <div className="flex flex-wrap gap-3">
            {[
              "School",
              "Community organization",
              "Friend or family",
              "Social media",
              "Flyer/poster",
              "Email",
              "Other",
            ].map((h) => (
              <div key={h} className="flex items-center gap-2">
                <Checkbox
                  id={`hear-${h}`}
                  checked={form.hearAboutUs.includes(h)}
                  onCheckedChange={() => toggleArrayField("hearAboutUs", h)}
                />
                <Label htmlFor={`hear-${h}`} className="cursor-pointer font-normal">
                  {h}
                </Label>
              </div>
            ))}
          </div>
          <FieldError field="hearAboutUs" />
        </div>
      </CardContent>
    </Card>
  );

  /* ─── STEP 4 — Terms & Consent ────────────────────────────── */
  const Step4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
          <FileText className="h-5 w-5" />
          Terms of Service & Consent
        </CardTitle>
        <p className="text-sm text-gray-500">
          Please review and agree to the following terms before submitting your application.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Terms of Service box */}
        <div>
          <Label className="text-base font-semibold mb-2 block">Terms of Service</Label>
          <div className="max-h-64 overflow-y-auto rounded-lg border p-4 bg-gray-50 text-sm leading-relaxed text-gray-700 space-y-4">
            <p className="font-semibold">MY SPARK SGO — TERMS OF SERVICE AND PROGRAM AGREEMENT</p>
            <p>
              Last Updated: January 15, 2026
            </p>
            <p>
              Welcome to My Spark SGO ("the Program"), a scholarship granting organization dedicated to expanding
              access to enrichment activities for eligible middle school students in Colorado. By submitting this
              application, you ("Applicant," "Parent," or "Guardian") agree to the following terms and conditions
              governing participation in the Program.
            </p>
            <p className="font-semibold">1. ELIGIBILITY AND ENROLLMENT</p>
            <p>
              The Program is available to students currently enrolled in grades 6 through 8 at a participating
              Colorado school who qualify for Free and Reduced-Price Lunch (FRL) under the National School Lunch
              Program guidelines. Eligibility is determined at the time of application and may be re-verified at
              any point during the scholarship period. Providing false or misleading information on this application
              may result in immediate disqualification and forfeiture of any remaining scholarship funds.
            </p>
            <p className="font-semibold">2. SCHOLARSHIP FUNDS AND USAGE</p>
            <p>
              Upon approval, eligible families will receive a virtual prepaid card ("Chek Card") loaded with
              scholarship funds up to $1,000 per academic year. These funds may only be used at providers approved
              by My Spark SGO for qualifying enrichment activities including, but not limited to, sports leagues,
              arts programs, tutoring services, music lessons, STEM programs, and other extracurricular activities.
              Funds may not be used for non-approved purchases, cash withdrawals, or transfers. Any misuse of funds
              will result in card deactivation and may require repayment.
            </p>
            <p className="font-semibold">3. DATA COLLECTION AND PRIVACY</p>
            <p>
              My Spark SGO collects personal information including names, addresses, school information,
              demographic data, and transaction-level spending data to administer the Program and improve service
              offerings. All data is stored securely in compliance with applicable federal and state privacy laws,
              including FERPA and COPPA where applicable. We do not sell personal information to third parties.
              Aggregated, de-identified data may be used for program evaluation, reporting to funding partners,
              and research purposes. For full details, please refer to our Privacy Policy available at
              mysparksgo.org/privacy.
            </p>
            <p className="font-semibold">4. CARD-LEVEL SPENDING DATA</p>
            <p>
              By participating in the Program, you acknowledge that transaction data from your Chek Card
              (including merchant name, transaction amount, date, and category) will be collected and analyzed
              to ensure compliance with program guidelines, detect fraud, and improve the quality of approved
              provider offerings. You may optionally consent to expanded data analysis to help personalize
              program recommendations.
            </p>
            <p className="font-semibold">5. PROGRAM MODIFICATIONS AND TERMINATION</p>
            <p>
              My Spark SGO reserves the right to modify, suspend, or terminate the Program or any individual
              scholarship at any time, with or without notice, due to funding limitations, policy changes,
              or violation of these Terms. In the event of program termination, any remaining funds on issued
              Chek Cards will remain available until their expiration date unless otherwise specified.
            </p>
            <p className="font-semibold">6. LIMITATION OF LIABILITY</p>
            <p>
              My Spark SGO, its directors, employees, partners, and affiliates shall not be liable for any
              direct, indirect, incidental, or consequential damages arising from participation in the Program,
              including but not limited to the quality of services provided by approved providers, loss of
              scholarship funds due to card theft or unauthorized use, or any interruption in Program services.
              Participants are encouraged to report lost or stolen cards immediately.
            </p>
            <p className="font-semibold">7. GOVERNING LAW</p>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Colorado,
              without regard to its conflict of law provisions. Any disputes arising under these Terms shall be
              resolved in the courts of Denver County, Colorado.
            </p>
            <p>
              By checking the boxes below and providing your electronic signature, you confirm that you have read,
              understood, and agree to these Terms of Service.
            </p>
          </div>
        </div>

        {/* Consent checkboxes */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="agreeTerms"
              checked={form.agreeTerms}
              onCheckedChange={(v) => updateField("agreeTerms", !!v)}
            />
            <div>
              <Label htmlFor="agreeTerms" className="cursor-pointer leading-snug font-medium">
                I have read and agree to the Terms of Service *
              </Label>
              <FieldError field="agreeTerms" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="confirmAge"
              checked={form.confirmAge}
              onCheckedChange={(v) => updateField("confirmAge", !!v)}
            />
            <div>
              <Label htmlFor="confirmAge" className="cursor-pointer leading-snug font-medium">
                I confirm I am 13 years of age or older *
              </Label>
              <FieldError field="confirmAge" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="consentData"
              checked={form.consentData}
              onCheckedChange={(v) => updateField("consentData", !!v)}
            />
            <Label htmlFor="consentData" className="cursor-pointer leading-snug font-normal text-gray-600">
              I consent to the collection of card-level spending data to help improve program offerings
              <span className="ml-1 text-xs text-gray-400">(optional)</span>
            </Label>
          </div>
        </div>

        {/* Signature / Date */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="signature">Electronic Signature *</Label>
            <p className="mb-1 text-xs text-gray-500">Type your full legal name as your electronic signature</p>
            <Input
              id="signature"
              placeholder="e.g. Maria Elena Gonzalez"
              className={`italic ${errorBorder("signature")}`}
              value={form.signature}
              onChange={(e) => updateField("signature", e.target.value)}
            />
            <FieldError field="signature" />
          </div>
          <div>
            <Label htmlFor="signDate">Date</Label>
            <Input
              id="signDate"
              disabled
              value={todayString()}
              className="bg-gray-50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  /* ─── STEP 5 — Confirmation ───────────────────────────────── */
  const Confirmation = () => (
    <div className="flex flex-col items-center py-8 text-center">
      {/* Animated checkmark */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#2E7D32] shadow-lg animate-[scale-in_0.5s_ease-out]">
        <Check className="h-12 w-12 text-white" strokeWidth={3} />
      </div>

      <h2 className="mb-2 text-3xl font-bold" style={{ color: "#0F2D5E" }}>
        Application Submitted Successfully!
      </h2>
      <p className="mb-1 text-gray-500">Your reference number is:</p>
      <p className="mb-6 text-lg font-mono font-bold" style={{ color: "#0F2D5E" }}>
        {refNumber}
      </p>
      <p className="mb-8 max-w-md text-gray-600">
        You'll receive an email within 3-5 business days with your approval status.
        Please save your reference number for your records.
      </p>

      {/* What happens next */}
      <Card className="mb-8 w-full max-w-lg text-left">
        <CardHeader>
          <CardTitle className="text-lg" style={{ color: "#0F2D5E" }}>
            What happens next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2D5E] text-sm font-bold text-white">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-800">Application Review</p>
                <p className="text-sm text-gray-500">
                  Our team will review your application and verify eligibility within 3-5 business days.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2D5E] text-sm font-bold text-white">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-800">Receive Your Chek Card</p>
                <p className="text-sm text-gray-500">
                  Once approved, you'll receive a virtual Chek card preloaded with up to $1,000 in scholarship funds.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2D5E] text-sm font-bold text-white">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-800">Start Exploring Programs</p>
                <p className="text-sm text-gray-500">
                  Browse our network of 100+ approved providers and enroll your youth in activities they'll love.
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
        title="Family Application"
        description="Apply for up to $1,000 in enrichment scholarship funding for your student."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Apply", href: "/apply" },
          { label: "Family Application" },
        ]}
      />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {currentStep <= 4 && <StepIndicator />}

        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
        {currentStep === 5 && <Confirmation />}

        {/* Navigation buttons */}
        {currentStep <= 4 && (
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

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="gap-1"
                style={{ backgroundColor: "#0F2D5E" }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                size="lg"
                className="gap-2 px-8 text-base font-semibold"
                style={{ backgroundColor: "#D4A843" }}
              >
                Submit Application
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Scale-in animation for the checkmark */}
      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Layout>
  );
}

export default FamilyApplication;
