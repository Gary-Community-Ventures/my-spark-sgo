import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, X, Camera, Check } from "lucide-react";

const BRAND = {
  navy: "#0F2D5E",
  gold: "#F5A623",
  green: "#2E7D32",
};

const ATTRIBUTE_MAP = {
  Sports: {
    coachingQuality: "Coaching Quality",
    safety: "Safety",
    funFactor: "Fun Factor",
    value: "Value",
  },
  "Martial Arts": {
    coachingQuality: "Coaching Quality",
    safety: "Safety",
    funFactor: "Fun Factor",
    value: "Value",
  },
  Swim: {
    coachingQuality: "Coaching Quality",
    safety: "Safety",
    funFactor: "Fun Factor",
    value: "Value",
  },
  Gymnastics: {
    coachingQuality: "Coaching Quality",
    safety: "Safety",
    funFactor: "Fun Factor",
    value: "Value",
  },
  Academics: {
    instructorKnowledge: "Instructor Knowledge",
    patienceComm: "Patience & Communication",
    progress: "My Child's Progress",
    value: "Value",
  },
  STEM: {
    instructorKnowledge: "Instructor Knowledge",
    patienceComm: "Patience & Communication",
    progress: "My Child's Progress",
    value: "Value",
  },
  Dance: {
    instructorQuality: "Instructor Quality",
    creativeEnvironment: "Creative Environment",
    enthusiasm: "My Child's Enthusiasm",
    value: "Value",
  },
  Arts: {
    instructorQuality: "Instructor Quality",
    creativeEnvironment: "Creative Environment",
    enthusiasm: "My Child's Enthusiasm",
    value: "Value",
  },
  Music: {
    instructorQuality: "Instructor Quality",
    creativeEnvironment: "Creative Environment",
    enthusiasm: "My Child's Enthusiasm",
    value: "Value",
  },
};

const TAGS_BY_RATING = {
  high: [
    "Great instructor",
    "My child loves it",
    "Easy to schedule",
    "Would recommend",
    "Safe environment",
    "Good value",
  ],
  mid: [
    "Good but could improve",
    "Mixed experience",
    "Some scheduling issues",
    "Decent value",
  ],
  low: [
    "Hard to reach",
    "Scheduling issues",
    "Not what we expected",
    "Parking is difficult",
    "Poor communication",
    "Disorganized",
  ],
};

const RATING_LABELS = [
  null,
  "That's tough — we're sorry to hear that",
  "Thanks for letting us know",
  "Good to know",
  "Sounds like a great experience",
  "Amazing — that's what we love to hear",
];

const RATING_COLORS = [
  null,
  "text-red-600",
  "text-orange-600",
  "text-amber-600",
  "text-lime-600",
  "text-green-600",
];

function getAttributes(category) {
  if (!category) return ATTRIBUTE_MAP.Sports;
  for (const key of Object.keys(ATTRIBUTE_MAP)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return ATTRIBUTE_MAP[key];
    }
  }
  return ATTRIBUTE_MAP.Sports;
}

function getTags(rating) {
  if (rating >= 4) return TAGS_BY_RATING.high;
  if (rating === 3) return TAGS_BY_RATING.mid;
  return TAGS_BY_RATING.low;
}

function StarRow({ count, rating, onRate, size = 48 }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onRate(i)}
          className="focus:outline-none"
          style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            style={{
              color: i <= rating ? BRAND.gold : "#D1D5DB",
              fill: i <= rating ? BRAND.gold : "none",
              transition: "color 0.15s, fill 0.15s",
            }}
          />
        </button>
      ))}
    </div>
  );
}

function StepDots({ currentStep, submitted }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {[1, 2, 3, 4, 5].map((s) => (
        <div
          key={s}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor:
              submitted || s < currentStep
                ? BRAND.green
                : s === currentStep
                ? BRAND.navy
                : "transparent",
            border:
              submitted || s < currentStep
                ? `2px solid ${BRAND.green}`
                : s === currentStep
                ? `2px solid ${BRAND.navy}`
                : "2px solid #D1D5DB",
            transition: "background-color 0.2s, border-color 0.2s",
          }}
        />
      ))}
    </div>
  );
}

export default function ReviewForm({
  provider,
  studentName,
  studentGrade,
  parentName,
  onSubmit,
  onClose,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [overallRating, setOverallRating] = useState(0);
  const [attributeRatings, setAttributeRatings] = useState({});
  const [reviewText, setReviewText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const attributes = useMemo(
    () => getAttributes(provider?.category),
    [provider?.category]
  );

  const tags = useMemo(() => getTags(overallRating), [overallRating]);

  const providerInitial = provider?.name ? provider.name.charAt(0).toUpperCase() : "?";

  const handleTextChange = (e) => {
    const val = e.target.value;
    setReviewText(val);
    setCharCount(val.length);
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
      setReviewText((prev) => {
        const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`,?\\s*${escaped}`, "gi");
        let cleaned = prev.replace(regex, "");
        cleaned = cleaned.replace(/^,\s*/, "").replace(/,\s*$/, "").trim();
        setCharCount(cleaned.length);
        return cleaned;
      });
    } else {
      setSelectedTags((prev) => [...prev, tag]);
      setReviewText((prev) => {
        const newText = prev.length > 0 ? `${prev}, ${tag}` : tag;
        setCharCount(newText.length);
        return newText;
      });
    }
  };

  const handleAttributeRate = (key, val) => {
    setAttributeRatings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        providerId: provider?.id,
        rating: overallRating,
        attributes: attributeRatings,
        text: reviewText,
        tags: selectedTags,
        anonymous: isAnonymous,
        photo: photoUploaded,
      });
    }
    setSubmitted(true);
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const getPlaceholder = () => {
    if (overallRating === 5)
      return "Tell other families what made it so great — what should they know before enrolling?";
    if (overallRating >= 3)
      return "What went well, and what could be better?";
    return "We're sorry to hear that. What happened? Your feedback helps us improve.";
  };

  // --- Thank-you screen ---
  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="relative w-full h-full bg-white flex flex-col items-center justify-center px-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 focus:outline-none"
            style={{ minWidth: 44, minHeight: 44 }}
            aria-label="Close"
          >
            <X size={24} style={{ color: "#6B7280" }} />
          </button>

          <div
            className="flex items-center justify-center rounded-full mb-6"
            style={{
              width: 80,
              height: 80,
              backgroundColor: "#E8F5E9",
              animation: "scaleIn 0.4s ease-out",
            }}
          >
            <Check size={48} style={{ color: BRAND.green }} />
          </div>

          <h2
            className="text-xl font-bold text-center mb-4"
            style={{ color: BRAND.navy }}
          >
            Thank you for helping other My Spark families!
          </h2>

          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex items-center justify-center rounded-full text-white font-bold"
              style={{
                width: 32,
                height: 32,
                backgroundColor: BRAND.navy,
                fontSize: 14,
              }}
            >
              {providerInitial}
            </div>
            <span className="font-semibold" style={{ color: BRAND.navy }}>
              {provider?.name}
            </span>
          </div>

          <div className="flex items-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={28}
                style={{
                  color: i <= overallRating ? BRAND.gold : "#D1D5DB",
                  fill: i <= overallRating ? BRAND.gold : "none",
                }}
              />
            ))}
          </div>

          <p className="text-gray-600 text-center text-sm mb-8 max-w-xs">
            Your review will appear on {provider?.name}'s profile within 24
            hours.
          </p>

          <Button
            onClick={onClose}
            className="w-full max-w-xs text-white font-semibold py-3"
            style={{ backgroundColor: BRAND.navy, minHeight: 44 }}
          >
            See other providers your child might love
          </Button>

          <style>{`
            @keyframes scaleIn {
              0% { transform: scale(0); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // --- Main multi-step modal ---
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="relative w-full h-full bg-white flex flex-col overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 z-10 focus:outline-none"
          style={{ minWidth: 44, minHeight: 44 }}
          aria-label="Close"
        >
          <X size={24} style={{ color: "#6B7280" }} />
        </button>

        <div className="w-full max-w-[500px] mx-auto px-5 py-6 flex flex-col flex-1">
          {/* Step dots */}
          <StepDots currentStep={currentStep} submitted={submitted} />

          {/* ===== STEP 1 — Star Rating ===== */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center flex-1 pt-8">
              {/* Provider avatar */}
              <div
                className="flex items-center justify-center rounded-full text-white font-bold mb-4"
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: BRAND.navy,
                  fontSize: 24,
                }}
              >
                {providerInitial}
              </div>

              <h2
                className="text-xl font-bold text-center mb-8"
                style={{ color: BRAND.navy }}
              >
                {provider?.name}
              </h2>

              <StarRow count={5} rating={overallRating} onRate={setOverallRating} size={48} />

              {/* Rating label */}
              <div
                className="mt-4 h-8 flex items-center justify-center"
                style={{
                  opacity: overallRating > 0 ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                {overallRating > 0 && (
                  <p className={`text-sm font-medium text-center ${RATING_COLORS[overallRating]}`}>
                    {RATING_LABELS[overallRating]}
                  </p>
                )}
              </div>

              <div className="mt-auto pb-4 w-full">
                <Button
                  onClick={next}
                  disabled={overallRating === 0}
                  className="w-full text-white font-semibold py-3"
                  style={{
                    backgroundColor: overallRating === 0 ? "#D1D5DB" : BRAND.navy,
                    minHeight: 44,
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* ===== STEP 2 — Attribute Ratings ===== */}
          {currentStep === 2 && (
            <div className="flex flex-col flex-1 pt-6">
              <h2
                className="text-lg font-bold mb-6"
                style={{ color: BRAND.navy }}
              >
                Rate specific aspects
              </h2>

              <div className="space-y-5">
                {Object.entries(attributes).map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between"
                  >
                    <Label className="text-sm font-medium text-gray-700 shrink-0 pr-3">
                      {label}
                    </Label>
                    <StarRow
                      count={5}
                      rating={attributeRatings[key] || 0}
                      onRate={(val) => handleAttributeRate(key, val)}
                      size={24}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-auto pb-4 w-full flex gap-3 pt-8">
                <Button
                  onClick={back}
                  variant="outline"
                  className="flex-1 font-semibold py-3"
                  style={{ minHeight: 44 }}
                >
                  Back
                </Button>
                <Button
                  onClick={next}
                  className="flex-1 text-white font-semibold py-3"
                  style={{ backgroundColor: BRAND.navy, minHeight: 44 }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* ===== STEP 3 — Written Review ===== */}
          {currentStep === 3 && (
            <div className="flex flex-col flex-1 pt-6">
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: BRAND.navy }}
              >
                Write your review
              </h2>

              <Textarea
                placeholder={getPlaceholder()}
                value={reviewText}
                onChange={handleTextChange}
                className="min-h-[140px] resize-none mb-1"
                maxLength={500}
              />

              <div className="flex items-center justify-between mb-4">
                {charCount < 20 ? (
                  <span className="text-xs text-gray-400">
                    Minimum 20 characters
                  </span>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-500">
                  {charCount} / 500
                </span>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className="rounded-full px-3 py-1.5 text-xs font-medium border transition-colors"
                      style={{
                        backgroundColor: isSelected ? BRAND.navy : "white",
                        color: isSelected ? "white" : "#374151",
                        borderColor: isSelected ? BRAND.navy : "#D1D5DB",
                        minHeight: 44,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto pb-4 w-full flex gap-3">
                <Button
                  onClick={back}
                  variant="outline"
                  className="flex-1 font-semibold py-3"
                  style={{ minHeight: 44 }}
                >
                  Back
                </Button>
                <Button
                  onClick={next}
                  disabled={charCount < 20}
                  className="flex-1 text-white font-semibold py-3"
                  style={{
                    backgroundColor: charCount < 20 ? "#D1D5DB" : BRAND.navy,
                    minHeight: 44,
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* ===== STEP 4 — Identity ===== */}
          {currentStep === 4 && (
            <div className="flex flex-col flex-1 pt-6">
              <h2
                className="text-lg font-bold mb-6"
                style={{ color: BRAND.navy }}
              >
                How would you like to post?
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Named card */}
                <button
                  type="button"
                  onClick={() => setIsAnonymous(false)}
                  className="rounded-xl p-4 text-left border-2 transition-colors"
                  style={{
                    borderColor: !isAnonymous ? BRAND.navy : "#E5E7EB",
                    backgroundColor: !isAnonymous ? "#EEF2F8" : "white",
                    minHeight: 44,
                  }}
                >
                  <div className="text-2xl mb-2">👤</div>
                  <p className="text-sm font-semibold text-gray-800">
                    Post as {parentName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    parent of a {studentGrade}
                  </p>
                </button>

                {/* Anonymous card */}
                <button
                  type="button"
                  onClick={() => setIsAnonymous(true)}
                  className="rounded-xl p-4 text-left border-2 transition-colors"
                  style={{
                    borderColor: isAnonymous ? BRAND.navy : "#E5E7EB",
                    backgroundColor: isAnonymous ? "#EEF2F8" : "white",
                    minHeight: 44,
                  }}
                >
                  <div className="text-2xl mb-2">🙈</div>
                  <p className="text-sm font-semibold text-gray-800">
                    Post anonymously
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hide your identity
                  </p>
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mb-6">
                Your full name and your child's name are never shown publicly.
              </p>

              <div className="mt-auto pb-4 w-full flex gap-3">
                <Button
                  onClick={back}
                  variant="outline"
                  className="flex-1 font-semibold py-3"
                  style={{ minHeight: 44 }}
                >
                  Back
                </Button>
                <Button
                  onClick={next}
                  className="flex-1 text-white font-semibold py-3"
                  style={{ backgroundColor: BRAND.navy, minHeight: 44 }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* ===== STEP 5 — Photo (Optional) ===== */}
          {currentStep === 5 && (
            <div className="flex flex-col flex-1 pt-6">
              <h2
                className="text-lg font-bold mb-6"
                style={{ color: BRAND.navy }}
              >
                Add a photo (optional)
              </h2>

              {!photoUploaded ? (
                <button
                  type="button"
                  onClick={() => setPhotoUploaded(true)}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-10 mb-4 hover:border-gray-400 transition-colors"
                  style={{ minHeight: 44 }}
                >
                  <Camera size={40} className="text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 font-medium">
                    Tap to upload a photo
                  </p>
                </button>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 mb-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Check size={20} style={{ color: BRAND.green }} />
                    <span className="text-sm font-medium text-gray-700">
                      activity_photo.jpg
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoUploaded(false)}
                    className="text-sm text-red-500 font-medium focus:outline-none"
                    style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center" }}
                  >
                    Remove
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center mb-6">
                Photos help other families. Please do not include faces of other
                children.
              </p>

              <div className="mt-auto pb-4 w-full flex gap-3">
                <Button
                  onClick={back}
                  variant="outline"
                  className="flex-1 font-semibold py-3"
                  style={{ minHeight: 44 }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 text-white font-bold py-3 text-base"
                  style={{
                    backgroundColor: BRAND.gold,
                    minHeight: 48,
                  }}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
