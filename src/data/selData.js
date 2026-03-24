const surveyTypes = [
  { id: "monthly", name: "Monthly Pulse", duration: "2 min", questionCount: 5 },
  { id: "quarterly", name: "Quarterly SEL Survey", duration: "5 min", questionCount: 15 },
  { id: "provider", name: "Provider Experience Survey", duration: "3 min", questionCount: 8 },
  { id: "annual", name: "Annual Outcomes Survey", duration: "8 min", questionCount: 20 },
];

const monthlyQuestions = [
  { id: "mq-001", text: "How happy has your child been this month?", type: "scale", emoji: true },
  { id: "mq-002", text: "How excited is your child about their activity?", type: "scale", emoji: true },
  { id: "mq-003", text: "Does your child feel like they belong at their program?", type: "scale", emoji: true },
  { id: "mq-004", text: "How would you rate your child's energy and motivation?", type: "scale", emoji: true },
  { id: "mq-005", text: "Anything you want to tell us about how things are going?", type: "text" },
];

const quarterlyQuestions = [
  { id: "qq-001", text: "My child feels good at something", dimension: "Confidence", type: "scale" },
  { id: "qq-002", text: "My child is more willing to try new things", dimension: "Confidence", type: "scale" },
  { id: "qq-003", text: "My child talks about their strengths", dimension: "Confidence", type: "scale" },
  { id: "qq-004", text: "My child sets goals for themselves", dimension: "Confidence", type: "scale" },
  { id: "qq-005", text: "My child feels like they fit in somewhere outside of school", dimension: "Belonging", type: "scale" },
  { id: "qq-006", text: "My child has made new friends through activities", dimension: "Belonging", type: "scale" },
  { id: "qq-007", text: "My child looks forward to going to their program", dimension: "Belonging", type: "scale" },
  { id: "qq-008", text: "My child feels welcomed by instructors", dimension: "Belonging", type: "scale" },
  { id: "qq-009", text: "My child talks positively about school", dimension: "SchoolEngagement", type: "scale" },
  { id: "qq-010", text: "My child is more focused on homework", dimension: "SchoolEngagement", type: "scale" },
  { id: "qq-011", text: "My child's grades have improved", dimension: "SchoolEngagement", type: "scale" },
  { id: "qq-012", text: "My child connects what they learn in activities to school", dimension: "SchoolEngagement", type: "scale" },
  { id: "qq-013", text: "My child seems happy and energetic", dimension: "Wellbeing", type: "scale" },
  { id: "qq-014", text: "My child sleeps well and has a good routine", dimension: "Wellbeing", type: "scale" },
  { id: "qq-015", text: "My child manages frustration better than before", dimension: "Wellbeing", type: "scale" },
];

const selTimeline = [
  { period: "Sep 2025", confidence: 3.1, belonging: 2.8, schoolEngagement: 3.2, wellbeing: 3.5 },
  { period: "Oct 2025", confidence: 3.4, belonging: 3.1, schoolEngagement: 3.4, wellbeing: 3.7 },
  { period: "Nov 2025", confidence: 3.7, belonging: 3.5, schoolEngagement: 3.6, wellbeing: 3.9 },
  { period: "Dec 2025", confidence: 4.0, belonging: 3.8, schoolEngagement: 3.8, wellbeing: 4.1 },
  { period: "Jan 2026", confidence: 4.4, belonging: 4.1, schoolEngagement: 4.0, wellbeing: 4.3 },
  { period: "Feb 2026", confidence: 4.8, belonging: 4.5, schoolEngagement: 4.2, wellbeing: 4.6 },
];

const selTimelineMarcus = [
  { period: "Sep 2025", confidence: 3.0, belonging: 3.2, schoolEngagement: 3.3, wellbeing: 3.6 },
  { period: "Oct 2025", confidence: 3.2, belonging: 3.5, schoolEngagement: 3.4, wellbeing: 3.7 },
  { period: "Nov 2025", confidence: 3.5, belonging: 3.7, schoolEngagement: 3.5, wellbeing: 3.9 },
  { period: "Dec 2025", confidence: 3.8, belonging: 4.0, schoolEngagement: 3.7, wellbeing: 4.1 },
  { period: "Jan 2026", confidence: 4.1, belonging: 4.2, schoolEngagement: 3.9, wellbeing: 4.3 },
  { period: "Feb 2026", confidence: 4.4, belonging: 4.5, schoolEngagement: 4.1, wellbeing: 4.5 },
];

const milestones = {
  "stu-001": [
    { date: "Sep 2025", event: "First enrollment — Denver Academy of Dance" },
    { date: "Oct 2025", event: "Started Art classes at Pikes Peak Art Studio" },
    { date: "Dec 2025", event: "10th session milestone" },
    { date: "Feb 2026", event: "Joined Colorado Youth Orchestra" },
  ],
  "stu-002": [
    { date: "Sep 2025", event: "First enrollment — Mountain View Sports Academy" },
    { date: "Nov 2025", event: "Started Martial Arts at Rocky Mountain MA" },
    { date: "Jan 2026", event: "10th session milestone" },
    { date: "Mar 2026", event: "Started STEM at Code Rangers" },
  ],
};

const adminSelData = {
  avgScores: {
    confidence: 4.1,
    belonging: 3.8,
    schoolEngagement: 3.6,
    wellbeing: 4.2,
  },
  responseRate: 0.72,
  pendingOutreach: 68,
  activityHeatmap: [
    { activity: "Dance", confidence: 4.6, belonging: 4.1, schoolEngagement: 3.5, wellbeing: 4.3 },
    { activity: "Sports", confidence: 4.0, belonging: 4.5, schoolEngagement: 3.4, wellbeing: 4.4 },
    { activity: "Academics", confidence: 3.8, belonging: 3.4, schoolEngagement: 4.6, wellbeing: 3.9 },
    { activity: "Music", confidence: 4.3, belonging: 4.0, schoolEngagement: 3.7, wellbeing: 4.5 },
    { activity: "Art", confidence: 4.4, belonging: 3.9, schoolEngagement: 3.3, wellbeing: 4.2 },
    { activity: "Martial Arts", confidence: 4.2, belonging: 4.2, schoolEngagement: 3.6, wellbeing: 4.1 },
    { activity: "STEM", confidence: 4.1, belonging: 3.5, schoolEngagement: 4.3, wellbeing: 3.8 },
    { activity: "Swimming", confidence: 3.9, belonging: 3.7, schoolEngagement: 3.2, wellbeing: 4.6 },
  ],
  cohortTrend: [
    { period: "Sep 2025", avgConfidence: 3.2, avgBelonging: 3.0, avgSchoolEngagement: 3.1, avgWellbeing: 3.4 },
    { period: "Oct 2025", avgConfidence: 3.4, avgBelonging: 3.2, avgSchoolEngagement: 3.2, avgWellbeing: 3.6 },
    { period: "Nov 2025", avgConfidence: 3.6, avgBelonging: 3.4, avgSchoolEngagement: 3.3, avgWellbeing: 3.8 },
    { period: "Dec 2025", avgConfidence: 3.8, avgBelonging: 3.6, avgSchoolEngagement: 3.4, avgWellbeing: 4.0 },
    { period: "Jan 2026", avgConfidence: 4.0, avgBelonging: 3.7, avgSchoolEngagement: 3.5, avgWellbeing: 4.1 },
    { period: "Feb 2026", avgConfidence: 4.1, avgBelonging: 3.8, avgSchoolEngagement: 3.6, avgWellbeing: 4.2 },
  ],
};

export default {
  surveyTypes,
  monthlyQuestions,
  quarterlyQuestions,
  selTimeline,
  selTimelineMarcus,
  milestones,
  adminSelData,
};
