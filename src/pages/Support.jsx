import { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  Search,
  Send,
  Bot,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import supportKnowledgeBase from "@/data/supportKnowledgeBase";

/* ─── category config ──────────────────────────────────────────── */

const categories = [
  { key: "eligibility", label: "Eligibility" },
  { key: "cardsPayments", label: "Cards & Payments" },
  { key: "providers", label: "Providers" },
  { key: "applications", label: "Applications" },
  { key: "technicalHelp", label: "Technical Help" },
];

/* ─── simulated responses (no API key) ─────────────────────────── */

function getSimulatedResponse(message) {
  const lower = message.toLowerCase();

  const isSpanish =
    /\b(hola|habla|español|espanol|ayuda|pregunta|cómo|como|puedo|necesito|gracias)\b/i.test(
      message
    );
  if (isSpanish) {
    return "¡Hola! Gracias por contactarnos. El programa My Spark SGO ofrece hasta $1,000 en fondos de becas para actividades de enriquecimiento fuera de la escuela. Los estudiantes en grados 6-8 que califican para almuerzo gratuito o reducido pueden ser elegibles. Los fondos se cargan en una tarjeta virtual Chek. ¿En qué más puedo ayudarte hoy?";
  }
  if (lower.includes("eligible") || lower.includes("eligib") || lower.includes("qualify")) {
    return "Great question! To be eligible for My Spark SGO, students must be in grades 6-8 and qualify for Free and Reduced Lunch. The program provides up to $1,000 in scholarship funding for out-of-school enrichment activities like sports, arts, tutoring, music, dance, and more. Would you like to know how to apply, or do you have another question?";
  }
  if (lower.includes("card") || lower.includes("chek") || lower.includes("payment")) {
    return "Your scholarship funds are loaded onto a Chek virtual card, which works like a prepaid Visa debit card. You can find your card details in the 'My Card' section of your dashboard. You can use it online, over the phone, or add it to Apple Pay or Google Pay for tap-to-pay at approved providers. Is there anything else you'd like to know about the card?";
  }
  if (lower.includes("provider") || lower.includes("find") || lower.includes("activity")) {
    return "You can browse approved providers in the 'Find Providers' section of your dashboard. Filter by activity type (sports, arts, music, academics, and more), distance, price, and age group. Only approved providers accept the Chek card. If your favorite provider isn't listed, you can suggest them through the platform! Would you like help with anything else?";
  }
  if (lower.includes("expir") || lower.includes("expire") || lower.includes("deadline") || lower.includes("when do")) {
    return "All scholarship funds for the current program year must be used by June 30. After that date, any remaining balance expires and cannot roll over to the next year. We recommend planning activities early to make the most of your funds! You'll receive email reminders at 90 days, 30 days, and 7 days before expiration. Is there anything else I can help with?";
  }
  if (lower.includes("apply") || lower.includes("application") || lower.includes("sign up")) {
    return "Applying is easy! Click the 'Apply Now' button on the homepage and follow the step-by-step guide. You'll need proof of income, student enrollment verification, proof of Colorado residency, and a parent/guardian photo ID. Most families complete the application in under 10 minutes. Would you like more details about any of these requirements?";
  }
  return "Thank you for reaching out! I'm here to help with questions about the My Spark SGO program, including eligibility, your Chek virtual card, finding providers, and more. For specific account inquiries, you can contact our support team at support@mysparkdenver.org or call 720-807-0200. What would you like to know?";
}

/* ─── component ────────────────────────────────────────────────── */

function Support() {
  // ── Knowledge Base state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("eligibility");

  // ── Chat state
  const [apiKey, setApiKey] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Spark Assistant, your friendly guide to the My Spark SGO program. I can help with questions about eligibility, your Chek virtual card, finding providers, and more. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // ── Ticket form state
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // ── scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── search / filter knowledge base
  const getFilteredQuestions = () => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const results = [];
    for (const [categoryKey, items] of Object.entries(supportKnowledgeBase)) {
      for (const item of items) {
        if (
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
        ) {
          results.push({ ...item, category: categoryKey });
        }
      }
    }
    return results;
  };

  const filteredQuestions = getFilteredQuestions();

  // ── send chat message
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    if (apiKey && isConnected) {
      // Real API call
      try {
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
            max_tokens: 500,
            system:
              "You are Spark Assistant, a friendly and knowledgeable customer support agent for the My Spark SGO program. My Spark SGO is a Scholarship Granting Organization that provides up to $1,000 in scholarship funding for eligible families to use on out-of-school enrichment activities like sports, arts, tutoring, music, dance, and more. Funding is loaded onto a Chek virtual card. Key facts: Eligible students are in grades 6-8, must qualify for Free and Reduced Lunch, funds expire June 30 of the program year, families can find approved providers through the platform. You should be warm, clear, and helpful. If someone writes in Spanish, respond in Spanish. Always end your response with a follow-up question or suggestion of what to do next. You cannot look up specific account information. If asked about a specific account, direct them to contact support@mysparkdenver.org or call 720-807-0200.",
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData?.error?.message || `API error: ${response.status}`
          );
        }

        const data = await response.json();
        const assistantText =
          data.content?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantText },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I'm sorry, I encountered an error: ${error.message}. Please try again or contact support@mysparkdenver.org for assistance.`,
          },
        ]);
      }
    } else {
      // Simulated response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const simulated = getSimulatedResponse(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: simulated },
      ]);
    }

    setIsTyping(false);
  };

  const handleConnect = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setIsConnected(true);
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => setTicketSubmitted(false), 4000);
    setTicketForm({ name: "", email: "", topic: "", message: "" });
  };

  const suggestionChips = [
    "Am I eligible?",
    "How does the card work?",
    "How do I find a provider?",
    "When do my funds expire?",
    "Habla español?",
  ];

  // ─────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <PageHeader
        title="Support Center"
        description="Get answers to your questions or chat with our AI assistant."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Support" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Two-panel layout ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ════════ LEFT PANEL — Knowledge Base ════════ */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
                <BookOpen className="h-5 w-5" />
                Help Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search all questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtered results or tabbed Q&A */}
              {filteredQuestions ? (
                <div>
                  <p className="mb-3 text-sm text-gray-500">
                    {filteredQuestions.length} result
                    {filteredQuestions.length !== 1 ? "s" : ""} found
                  </p>
                  {filteredQuestions.length === 0 ? (
                    <p className="py-8 text-center text-gray-400">
                      No results match your search. Try different keywords.
                    </p>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <Accordion type="single" collapsible className="w-full">
                        {filteredQuestions.map((item, idx) => (
                          <AccordionItem key={idx} value={`search-${idx}`}>
                            <AccordionTrigger className="text-left text-sm font-medium">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm leading-relaxed text-gray-600">
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </ScrollArea>
                  )}
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 flex flex-wrap gap-1">
                    {categories.map((cat) => (
                      <TabsTrigger
                        key={cat.key}
                        value={cat.key}
                        className="text-xs sm:text-sm"
                      >
                        {cat.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {categories.map((cat) => (
                    <TabsContent key={cat.key} value={cat.key}>
                      <ScrollArea className="h-[500px]">
                        <Accordion type="single" collapsible className="w-full">
                          {supportKnowledgeBase[cat.key]?.map((item, idx) => (
                            <AccordionItem
                              key={idx}
                              value={`${cat.key}-${idx}`}
                            >
                              <AccordionTrigger className="text-left text-sm font-medium">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-sm leading-relaxed text-gray-600">
                                {item.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </ScrollArea>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* ════════ RIGHT PANEL — AI Chat Assistant ════════ */}
          <Card className="flex flex-col border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl" style={{ color: "#0F2D5E" }}>
                <Sparkles className="h-5 w-5" />
                Spark Assistant
                <span className="ml-auto flex items-center gap-1.5 text-xs font-normal text-gray-500">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Online
                </span>
              </CardTitle>

              {/* API key input */}
              {!isConnected ? (
                <div className="mt-2 rounded-lg bg-gray-50 p-3">
                  <Label className="mb-1 block text-xs font-medium text-gray-600">
                    API Key
                  </Label>
                  <p className="mb-2 text-xs text-gray-400">
                    Enter your Anthropic API key to enable AI chat
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="sk-ant-..."
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Button
                      onClick={handleConnect}
                      size="sm"
                      className="text-white"
                      style={{ backgroundColor: "#0F2D5E" }}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              ) : (
                <Badge variant="outline" className="mt-2 w-fit border-green-300 text-green-700">
                  AI Connected
                </Badge>
              )}
            </CardHeader>

            <CardContent className="flex flex-1 flex-col p-0">
              {/* Chat messages */}
              <ScrollArea className="flex-1 px-4" style={{ height: "400px" }}>
                <div className="space-y-4 py-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 ${
                        msg.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          msg.role === "assistant"
                            ? "bg-gray-200 text-gray-600"
                            : "text-white"
                        }`}
                        style={
                          msg.role === "user"
                            ? { backgroundColor: "#0F2D5E" }
                            : {}
                        }
                      >
                        {msg.role === "assistant" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      {/* Bubble */}
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                          msg.role === "assistant"
                            ? "bg-gray-100 text-gray-800"
                            : "text-white"
                        }`}
                        style={
                          msg.role === "user"
                            ? { backgroundColor: "#0F2D5E" }
                            : {}
                        }
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Suggestion chips (show after welcome only) */}
                  {messages.length === 1 && messages[0].role === "assistant" && (
                    <div className="flex flex-wrap gap-2 pl-9">
                      {suggestionChips.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => sendMessage(chip)}
                          className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-start gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-3">
                        <span className="pulse-dot h-2 w-2 rounded-full bg-gray-400" />
                        <span className="pulse-dot h-2 w-2 rounded-full bg-gray-400" />
                        <span className="pulse-dot h-2 w-2 rounded-full bg-gray-400" />
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              {/* Chat input */}
              <div className="border-t border-gray-200 p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(inputValue);
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Type your question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    type="submit"
                    disabled={isTyping || !inputValue.trim()}
                    className="text-white"
                    style={{ backgroundColor: "#0F2D5E" }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Contact a Human ──────────────────────────────────── */}
        <div className="mt-10">
          <h2
            className="mb-6 text-2xl font-bold"
            style={{ color: "#0F2D5E" }}
          >
            Contact a Human
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Email */}
            <Card className="border border-gray-200 text-center shadow-sm">
              <CardContent className="pt-6">
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: "#0F2D5E" }}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Email Us
                </h3>
                <a
                  href="mailto:support@mysparkdenver.org"
                  className="mt-1 block text-sm font-medium"
                  style={{ color: "#0F2D5E" }}
                >
                  support@mysparkdenver.org
                </a>
                <p className="mt-1 text-xs text-gray-500">
                  Typical response: 24 hours
                </p>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className="border border-gray-200 text-center shadow-sm">
              <CardContent className="pt-6">
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: "#0F2D5E" }}
                >
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Call Us
                </h3>
                <a
                  href="tel:7208070200"
                  className="mt-1 block text-sm font-medium"
                  style={{ color: "#0F2D5E" }}
                >
                  720-807-0200
                </a>
                <p className="mt-1 text-xs text-gray-500">
                  Mon-Fri 9am-5pm MT
                </p>
              </CardContent>
            </Card>

            {/* Submit a Ticket */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: "#0F2D5E" }}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mb-3 text-center text-lg font-semibold text-gray-900">
                  Submit a Ticket
                </h3>

                {ticketSubmitted ? (
                  <div className="rounded-lg bg-green-50 p-4 text-center text-sm text-green-700">
                    Ticket submitted! We'll get back to you soon.
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-3">
                    <div>
                      <Label htmlFor="ticket-name" className="text-xs">
                        Name
                      </Label>
                      <Input
                        id="ticket-name"
                        value={ticketForm.name}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, name: e.target.value })
                        }
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ticket-email" className="text-xs">
                        Email
                      </Label>
                      <Input
                        id="ticket-email"
                        type="email"
                        value={ticketForm.email}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, email: e.target.value })
                        }
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ticket-topic" className="text-xs">
                        Topic
                      </Label>
                      <Select
                        value={ticketForm.topic}
                        onValueChange={(val) =>
                          setTicketForm({ ...ticketForm, topic: val })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Question
                          </SelectItem>
                          <SelectItem value="application">
                            Application Status
                          </SelectItem>
                          <SelectItem value="card">Card Issues</SelectItem>
                          <SelectItem value="provider">
                            Provider Question
                          </SelectItem>
                          <SelectItem value="technical">
                            Technical Issue
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ticket-message" className="text-xs">
                        Message
                      </Label>
                      <Textarea
                        id="ticket-message"
                        value={ticketForm.message}
                        onChange={(e) =>
                          setTicketForm({
                            ...ticketForm,
                            message: e.target.value,
                          })
                        }
                        required
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full text-white"
                      style={{ backgroundColor: "#0F2D5E" }}
                    >
                      Submit
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Support;
