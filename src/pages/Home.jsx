import { Link } from "react-router-dom";
import {
  Wallet,
  MapPin,
  ClipboardCheck,
  FileText,
  CheckCircle,
  CreditCard,
  GraduationCap,
  ArrowRight,
  Star,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import Layout from "@/components/Layout";

const features = [
  {
    icon: Wallet,
    title: "Up to $1,000 in Scholarship Funding",
    description:
      "Eligible families receive a virtual Chek card preloaded with scholarship funds that can be spent at any approved enrichment provider.",
  },
  {
    icon: MapPin,
    title: "100+ Approved Providers",
    description:
      "Choose from a growing network of vetted sports leagues, arts studios, tutoring centers, and enrichment programs across Colorado.",
  },
  {
    icon: ClipboardCheck,
    title: "Simple, Guided Application",
    description:
      "Our step-by-step application walks you through eligibility, documentation, and approval — most families finish in under 10 minutes.",
  },
];

const steps = [
  {
    icon: FileText,
    title: "Apply",
    description:
      "Complete the online application with basic household and student information.",
  },
  {
    icon: CheckCircle,
    title: "Get Approved",
    description:
      "Our team reviews your application and verifies eligibility within a few business days.",
  },
  {
    icon: CreditCard,
    title: "Activate Your Card",
    description:
      "Receive your virtual Chek card loaded with scholarship funds, ready to use.",
  },
  {
    icon: GraduationCap,
    title: "Start Enrolling",
    description:
      "Browse approved providers and enroll your child in the activities they love.",
  },
];

const testimonials = [
  {
    quote:
      "My Spark SGO made it possible for my daughter to join a competitive swim team. We never could have afforded the fees on our own. She's thriving and more confident than ever.",
    name: "Maria G.",
    role: "Parent, Denver",
  },
  {
    quote:
      "The application was so easy — I finished it during my lunch break. Within a week we had funding on the card and my son was signed up for guitar lessons. This program is a game-changer.",
    name: "James T.",
    role: "Parent, Aurora",
  },
  {
    quote:
      "As a single mom of three, extracurriculars always felt out of reach. Now all three of my kids are in after-school programs they love. I'm so grateful for this scholarship.",
    name: "Priya S.",
    role: "Parent, Colorado Springs",
  },
];

const faqs = [
  {
    question: "Who is eligible for the My Spark SGO scholarship?",
    answer:
      "Eligibility is based on household income and residency. Families must reside in Colorado and have a household income at or below 185% of the federal poverty level. Students must be between the ages of 5 and 18 and attending a qualifying school or homeschool program.",
  },
  {
    question: "How much funding can my family receive?",
    answer:
      "Each eligible student can receive up to $1,000 per scholarship year. Families with multiple eligible children may apply for each child individually.",
  },
  {
    question: "What activities and programs are covered?",
    answer:
      "Scholarship funds can be used for organized sports, music and art lessons, academic tutoring, STEM programs, dance classes, martial arts, theater, language courses, and more. The activity must be offered by an approved provider.",
  },
  {
    question: "How does the Chek virtual card work?",
    answer:
      "Once approved, you'll receive a virtual Chek card that works like a prepaid debit card. It's loaded with your scholarship funds and can be used to pay approved providers directly.",
  },
  {
    question: "How long does the application process take?",
    answer:
      "Most families complete the online application in under 10 minutes. After submission, our team typically reviews applications within 3-5 business days.",
  },
  {
    question: "Can I apply for more than one child?",
    answer:
      "Yes! You can submit a separate application for each eligible child in your household. Each child may qualify for up to $1,000 in scholarship funding.",
  },
  {
    question: "When do scholarship funds expire?",
    answer:
      "Scholarship funds are valid for the current program year, which typically runs from August through July. Any unused funds do not roll over.",
  },
  {
    question: "How do I find approved providers near me?",
    answer:
      "Our Provider Directory lets you search by location, activity type, and age group. You can browse the full list from your dashboard. New providers are added regularly.",
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "16px",
          fontWeight: 500,
          color: "#0F2D5E",
          fontFamily: "inherit",
        }}
      >
        {question}
        <ChevronDown
          style={{
            width: 20,
            height: 20,
            flexShrink: 0,
            marginLeft: 16,
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
            color: "#6b7280",
          }}
        />
      </button>
      {open && (
        <div
          style={{
            paddingBottom: 20,
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#4b5563",
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
}

function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0F2D5E 0%, #1a3f7a 50%, #153470 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: 900,
            margin: "0 auto",
            padding: "96px 24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Unlock Your Child's Potential — Outside the Classroom.
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2.5vw, 20px)",
              color: "rgba(255,255,255,0.8)",
              maxWidth: 600,
              margin: "24px auto 0",
              lineHeight: 1.6,
            }}
          >
            My Spark SGO connects eligible families with scholarship funding for
            sports, arts, tutoring, and more.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              marginTop: 40,
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/apply/family"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 32px",
                borderRadius: 8,
                backgroundColor: "#F5A623",
                color: "#0F2D5E",
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              Apply as a Family
            </Link>
            <Link
              to="/apply/provider"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 32px",
                borderRadius: 8,
                backgroundColor: "transparent",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
                border: "2px solid rgba(255,255,255,0.8)",
                transition: "background 0.2s",
              }}
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={{ backgroundColor: "#f9fafb", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 32,
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 12,
                  padding: 32,
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: "rgba(245,166,35,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <f.icon style={{ width: 28, height: 28, color: "#F5A623" }} />
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#0F2D5E",
                    margin: "0 0 12px",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#4b5563",
                    margin: 0,
                  }}
                >
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              color: "#0F2D5E",
              marginBottom: 56,
            }}
          >
            How It Works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 32,
            }}
          >
            {steps.map((s, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "#0F2D5E",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    margin: "0 auto 16px",
                  }}
                >
                  {i + 1}
                </div>
                {/* Icon */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "rgba(245,166,35,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <s.icon style={{ width: 24, height: 24, color: "#F5A623" }} />
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#0F2D5E",
                    margin: "0 0 8px",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#4b5563",
                    maxWidth: 220,
                    margin: "0 auto",
                  }}
                >
                  {s.description}
                </p>
                {/* Arrow (hidden on last step) */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block"
                    style={{
                      position: "absolute",
                      right: -20,
                      top: 24,
                    }}
                  >
                    <ArrowRight
                      style={{ width: 20, height: 20, color: "#d1d5db" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ backgroundColor: "#f9fafb", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              color: "#0F2D5E",
              marginBottom: 48,
            }}
          >
            What Families Are Saying
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 32,
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 12,
                  padding: 32,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      style={{
                        width: 16,
                        height: 16,
                        fill: "#F5A623",
                        color: "#F5A623",
                      }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#374151",
                    fontStyle: "italic",
                    margin: "0 0 24px",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: 16,
                  }}
                >
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#0F2D5E",
                      fontSize: 14,
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              color: "#0F2D5E",
              marginBottom: 40,
            }}
          >
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((f, i) => (
              <FaqItem key={i} question={f.question} answer={f.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ backgroundColor: "#F5A623", padding: "64px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              color: "#0F2D5E",
              margin: "0 0 16px",
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "rgba(15,45,94,0.8)",
              margin: "0 0 32px",
              lineHeight: 1.6,
            }}
          >
            Apply today and give your child access to the enrichment programs
            they deserve. It only takes a few minutes.
          </p>
          <Link
            to="/apply/family"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 40px",
              borderRadius: 8,
              backgroundColor: "#0F2D5E",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
            }}
          >
            Apply Now
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export default Home;
