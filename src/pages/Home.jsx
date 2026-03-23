import { Link } from "react-router-dom";
import {
  Wallet,
  MapPin,
  ClipboardCheck,
  FileText,
  CheckCircle,
  CreditCard,
  GraduationCap,
  ChevronRight,
  Star,
  Sparkles,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/* ─── data ──────────────────────────────────────────────────────── */

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
    description: "Complete the online application with basic household and student information.",
  },
  {
    icon: CheckCircle,
    title: "Get Approved",
    description: "Our team reviews your application and verifies eligibility within a few business days.",
  },
  {
    icon: CreditCard,
    title: "Activate Your Card",
    description: "Receive your virtual Chek card loaded with scholarship funds, ready to use.",
  },
  {
    icon: GraduationCap,
    title: "Start Enrolling",
    description: "Browse approved providers and enroll your child in the activities they love.",
  },
];

const testimonials = [
  {
    quote:
      "My Spark SGO made it possible for my daughter to join a competitive swim team. We never could have afforded the fees on our own. She's thriving and more confident than ever.",
    name: "Maria G.",
    role: "Parent, Denver",
    stars: 5,
  },
  {
    quote:
      "The application was so easy — I finished it during my lunch break. Within a week we had funding on the card and my son was signed up for guitar lessons. This program is a game-changer.",
    name: "James T.",
    role: "Parent, Aurora",
    stars: 5,
  },
  {
    quote:
      "As a single mom of three, extracurriculars always felt out of reach. Now all three of my kids are in after-school programs they love. I'm so grateful for this scholarship.",
    name: "Priya S.",
    role: "Parent, Colorado Springs",
    stars: 5,
  },
];

const faqs = [
  {
    question: "Who is eligible for the My Spark SGO scholarship?",
    answer:
      "Eligibility is based on household income and residency. Families must reside in Colorado and have a household income at or below 185% of the federal poverty level. Students must be between the ages of 5 and 18 and attending a qualifying school or homeschool program. Our application will walk you through the specific requirements.",
  },
  {
    question: "How much funding can my family receive?",
    answer:
      "Each eligible student can receive up to $1,000 per scholarship year. Families with multiple eligible children may apply for each child individually. The exact award amount is determined during the approval process based on available funding and demonstrated need.",
  },
  {
    question: "What activities and programs are covered?",
    answer:
      "Scholarship funds can be used for a wide range of enrichment activities including organized sports, music and art lessons, academic tutoring, STEM programs, dance classes, martial arts, theater, language courses, and more. The activity must be offered by an approved provider in our network.",
  },
  {
    question: "How does the Chek virtual card work?",
    answer:
      "Once approved, you'll receive a virtual Chek card that works like a prepaid debit card. It's loaded with your scholarship funds and can be used to pay approved providers directly. You can manage your card, check your balance, and view transactions through your My Spark SGO dashboard.",
  },
  {
    question: "How long does the application process take?",
    answer:
      "Most families complete the online application in under 10 minutes. After submission, our team typically reviews and processes applications within 3–5 business days. You'll receive email notifications at each stage so you always know where things stand.",
  },
  {
    question: "Can I apply for more than one child?",
    answer:
      "Yes! You can submit a separate application for each eligible child in your household. Each child may qualify for up to $1,000 in scholarship funding. You'll use the same parent account to manage all applications from your family dashboard.",
  },
  {
    question: "When do scholarship funds expire?",
    answer:
      "Scholarship funds are valid for the current program year, which typically runs from August through July. Any unused funds at the end of the program year do not roll over. We encourage families to plan ahead and take full advantage of their award.",
  },
  {
    question: "How do I find approved providers near me?",
    answer:
      "Our Provider Directory lets you search by location, activity type, and age group. You can browse the full list of approved providers from your dashboard or visit the Providers page on our website. New providers are added regularly, so check back often.",
  },
];

/* ─── component ─────────────────────────────────────────────────── */

function Home() {
  return (
    <Layout>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F2D5E 0%, #1a3f7a 50%, #153470 100%)",
        }}
      >
        {/* decorative sparkles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Sparkles className="absolute left-[10%] top-[15%] h-6 w-6 text-white/10 animate-pulse" />
          <Sparkles className="absolute right-[15%] top-[25%] h-8 w-8 text-[#F5A623]/20 animate-pulse delay-300" />
          <Sparkles className="absolute left-[25%] bottom-[20%] h-5 w-5 text-white/10 animate-pulse delay-700" />
          <Sparkles className="absolute right-[30%] bottom-[30%] h-7 w-7 text-[#F5A623]/15 animate-pulse delay-500" />
          <Sparkles className="absolute left-[60%] top-[10%] h-4 w-4 text-white/10 animate-pulse delay-200" />
          <Sparkles className="absolute right-[8%] bottom-[15%] h-6 w-6 text-white/10 animate-pulse delay-1000" />
          {/* subtle dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center lg:py-36">
          <h1 className="animate-fade-in text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Unlock Your Child's Potential — Outside the Classroom.
          </h1>
          <p className="animate-fade-in mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
            My Spark SGO connects eligible families with scholarship funding for
            sports, arts, tutoring, and more.
          </p>
          <div className="animate-slide-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#F5A623] text-[#0F2D5E] font-semibold hover:bg-[#F5A623]/90 px-8 py-3 text-base"
            >
              <Link to="/apply/family">Apply as a Family</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border-2 border-white bg-transparent text-white hover:bg-white/10 px-8 py-3 text-base"
            >
              <Link to="/apply/provider">Become a Provider</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FEATURE CALLOUT CARDS ─────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <Card
                key={i}
                className="animate-slide-up border-0 bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="items-center text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A623]/10">
                    <f.icon className="h-7 w-7 text-[#F5A623]" />
                  </div>
                  <CardTitle className="text-lg text-[#0F2D5E]">
                    {f.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-600 leading-relaxed">
                  {f.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="animate-fade-in mb-16 text-center text-3xl font-bold text-[#0F2D5E] sm:text-4xl">
            How It Works
          </h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-7 md:gap-0 items-start">
            {steps.map((s, i) => (
              <div key={i} className="contents">
                {/* step card */}
                <div className="animate-slide-up flex flex-col items-center text-center md:col-span-1">
                  {/* numbered circle */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F2D5E] text-lg font-bold text-white">
                    {i + 1}
                  </div>
                  {/* icon */}
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#F5A623]/10">
                    <s.icon className="h-6 w-6 text-[#F5A623]" />
                  </div>
                  {/* text */}
                  <h3 className="mt-4 text-lg font-semibold text-[#0F2D5E]">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[180px] text-sm text-gray-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {/* arrow between steps (hidden on mobile & after last step) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex md:col-span-1 items-center justify-center pt-5">
                    <ChevronRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="animate-fade-in mb-14 text-center text-3xl font-bold text-[#0F2D5E] sm:text-4xl">
            What Families Are Saying
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card
                key={i}
                className="animate-slide-up border-0 bg-white shadow-sm"
              >
                <CardContent className="pt-6">
                  {/* stars */}
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-[#F5A623] text-[#F5A623]"
                      />
                    ))}
                  </div>
                  {/* quote */}
                  <p className="text-sm leading-relaxed text-gray-700 italic">
                    "{t.quote}"
                  </p>
                  {/* attribution */}
                  <div className="mt-6 border-t pt-4">
                    <p className="font-semibold text-[#0F2D5E]">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="animate-fade-in mb-12 text-center text-3xl font-bold text-[#0F2D5E] sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="animate-slide-up">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-[#0F2D5E] font-medium text-base hover:no-underline">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section className="bg-[#F5A623]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="animate-fade-in text-3xl font-bold text-[#0F2D5E] sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#0F2D5E]/80 text-lg">
            Apply today and give your child access to the enrichment programs
            they deserve. It only takes a few minutes.
          </p>
          <Button
            asChild
            size="lg"
            className="animate-slide-up mt-8 bg-[#0F2D5E] text-white hover:bg-[#0F2D5E]/90 px-10 py-3 text-base font-semibold"
          >
            <Link to="/apply/family">Apply Now</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

export default Home;
