const benchmarkData = {
  metrics: [
    { id: "bm-001", name: "Fund Utilization Rate", yourProgram: 76, nationalAvg: 68, topQuartile: 85, unit: "%" },
    { id: "bm-002", name: "Avg Days to First Transaction", yourProgram: 8, nationalAvg: 14, topQuartile: 5, unit: "days" },
    { id: "bm-003", name: "Family Retention Rate", yourProgram: 82, nationalAvg: 71, topQuartile: 91, unit: "%" },
    { id: "bm-004", name: "Provider Approval Rate", yourProgram: 87, nationalAvg: 79, topQuartile: 94, unit: "%" },
    { id: "bm-005", name: "Avg Review Score", yourProgram: 4.6, nationalAvg: 4.2, topQuartile: 4.8, unit: "score" },
    { id: "bm-006", name: "Survey Response Rate", yourProgram: 72, nationalAvg: 55, topQuartile: 83, unit: "%" },
    { id: "bm-007", name: "Avg Providers Per Student", yourProgram: 2.4, nationalAvg: 1.8, topQuartile: 3.1, unit: "count" },
  ],

  activityMix: [
    { category: "Sports", yourProgram: 22, nationalAvg: 28 },
    { category: "Arts", yourProgram: 18, nationalAvg: 14 },
    { category: "Academics", yourProgram: 16, nationalAvg: 20 },
    { category: "Music", yourProgram: 12, nationalAvg: 10 },
    { category: "Dance", yourProgram: 10, nationalAvg: 7 },
    { category: "STEM", yourProgram: 9, nationalAvg: 11 },
    { category: "Swimming", yourProgram: 7, nationalAvg: 5 },
    { category: "Martial Arts", yourProgram: 6, nationalAvg: 5 },
  ],

  demographics: {
    yourProgram: {
      studentsOfColor: 78,
      ellFamilies: 34,
      urban: 92,
      avgDistance: 2.1,
    },
    nationalAvg: {
      studentsOfColor: 62,
      ellFamilies: 22,
      urban: 71,
      avgDistance: 4.8,
    },
  },

  peerSpotlights: [
    {
      id: "peer-001",
      label: "Mountain West SGO",
      highlight: "Achieved 91% family retention by pairing every new family with a peer mentor during onboarding.",
      topMetric: "Family Retention Rate",
      topMetricValue: "91%",
    },
    {
      id: "peer-002",
      label: "Mid-sized Urban Southeast SGO",
      highlight: "Reduced average days to first transaction to 4 days through a streamlined digital enrollment flow.",
      topMetric: "Avg Days to First Transaction",
      topMetricValue: "4 days",
    },
    {
      id: "peer-003",
      label: "Great Lakes Metro SGO",
      highlight: "Reached an 88% survey response rate by integrating SEL check-ins directly into the family app.",
      topMetric: "Survey Response Rate",
      topMetricValue: "88%",
    },
  ],

  trendData: [
    { month: "Jul 2025", yourUtilization: 62, nationalUtilization: 58, yourRetention: 75, nationalRetention: 66 },
    { month: "Aug 2025", yourUtilization: 65, nationalUtilization: 60, yourRetention: 76, nationalRetention: 67 },
    { month: "Sep 2025", yourUtilization: 68, nationalUtilization: 62, yourRetention: 78, nationalRetention: 68 },
    { month: "Oct 2025", yourUtilization: 70, nationalUtilization: 63, yourRetention: 79, nationalRetention: 69 },
    { month: "Nov 2025", yourUtilization: 72, nationalUtilization: 65, yourRetention: 80, nationalRetention: 70 },
    { month: "Dec 2025", yourUtilization: 73, nationalUtilization: 66, yourRetention: 80, nationalRetention: 70 },
    { month: "Jan 2026", yourUtilization: 75, nationalUtilization: 67, yourRetention: 81, nationalRetention: 71 },
    { month: "Feb 2026", yourUtilization: 76, nationalUtilization: 68, yourRetention: 82, nationalRetention: 71 },
  ],

  sgoList: [
    { id: "sgo-001", name: "Denver Spark SGO", state: "Colorado", studentsServed: 1240, providersApproved: 87, yearFounded: 2023 },
    { id: "sgo-002", name: "Atlanta Youth Enrichment Network", state: "Georgia", studentsServed: 2100, providersApproved: 134, yearFounded: 2022 },
    { id: "sgo-003", name: "Great Lakes Opportunity Fund", state: "Illinois", studentsServed: 1850, providersApproved: 112, yearFounded: 2021 },
    { id: "sgo-004", name: "Desert Southwest SGO", state: "Arizona", studentsServed: 980, providersApproved: 65, yearFounded: 2024 },
    { id: "sgo-005", name: "Pacific Northwest Youth Access", state: "Washington", studentsServed: 1560, providersApproved: 98, yearFounded: 2022 },
    { id: "sgo-006", name: "Heartland Enrichment Alliance", state: "Kansas", studentsServed: 720, providersApproved: 48, yearFounded: 2024 },
    { id: "sgo-007", name: "Tri-State Youth Fund", state: "Ohio", studentsServed: 2400, providersApproved: 156, yearFounded: 2021 },
    { id: "sgo-008", name: "Gulf Coast Opportunity Network", state: "Texas", studentsServed: 3100, providersApproved: 203, yearFounded: 2020 },
  ],
};

export default benchmarkData;
