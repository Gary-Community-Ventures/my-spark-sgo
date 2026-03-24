const complianceData = {
  donorImpact: {
    totalFamilies: 247,
    totalDistributed: 186500,
    avgPerStudent: 755,
    spendingByCategory: [
      { name: "Sports", value: 32 },
      { name: "Arts", value: 18 },
      { name: "Academics", value: 15 },
      { name: "Music", value: 12 },
      { name: "Dance", value: 10 },
      { name: "Martial Arts", value: 5 },
      { name: "Swim", value: 4 },
      { name: "Other", value: 4 },
    ],
    byZip: [
      { zip: "80204", families: 42, label: "West Denver / Sun Valley" },
      { zip: "80219", families: 38, label: "Westwood / Mar Lee" },
      { zip: "80239", families: 35, label: "Montbello / Gateway" },
      { zip: "80249", families: 31, label: "Green Valley Ranch" },
      { zip: "80010", families: 28, label: "Aurora Central" },
      { zip: "80223", families: 26, label: "Ruby Hill / Athmar Park" },
      { zip: "80211", families: 25, label: "Highland / Sunnyside" },
      { zip: "80216", families: 22, label: "Globeville / Elyria-Swansea" },
    ],
  },

  sgoAnnual: {
    totalAwarded: 186500,
    studentsServed: 247,
    eligibilityRate: 0.94,
    providersApproved: 103,
    utilizationRate: 0.76,
    verifiedAutomatic: 189,
    verifiedDocument: 58,
  },

  providerPayments: [
    { providerId: "prov-001", providerName: "Denver Academy of Dance", totalReceived: 18750, transactionCount: 62, ein: "84-2314567" },
    { providerId: "prov-002", providerName: "Mile High Tutoring Co.", totalReceived: 22400, transactionCount: 78, ein: "84-3928174" },
    { providerId: "prov-003", providerName: "Rocky Mountain Martial Arts", totalReceived: 9800, transactionCount: 34, ein: "84-5017362" },
    { providerId: "prov-004", providerName: "Front Range Swim Academy", totalReceived: 7200, transactionCount: 28, ein: "84-6183920" },
    { providerId: "prov-005", providerName: "Colorado Youth Orchestra", totalReceived: 14500, transactionCount: 42, ein: "84-7294051" },
    { providerId: "prov-006", providerName: "Pikes Peak Art Studio", totalReceived: 11300, transactionCount: 38, ein: "84-8305162" },
    { providerId: "prov-007", providerName: "Denver Chess Club", totalReceived: 4800, transactionCount: 22, ein: "84-9416273" },
    { providerId: "prov-008", providerName: "Altitude Gymnastics Center", totalReceived: 25200, transactionCount: 80, ein: "84-1527384" },
    { providerId: "prov-009", providerName: "Mountain View Sports Academy", totalReceived: 21600, transactionCount: 72, ein: "84-2638495" },
    { providerId: "prov-010", providerName: "Code Rangers Denver", totalReceived: 16400, transactionCount: 48, ein: "84-3749506" },
  ],

  utilization: {
    allocated: 247000,
    spent: 186500,
    avgPerStudent: 755,
    topCategories: [
      { name: "Sports", pct: 32 },
      { name: "Arts", pct: 18 },
      { name: "Academics", pct: 15 },
      { name: "Music", pct: 12 },
      { name: "Dance", pct: 10 },
    ],
    lowUtilization: [
      { name: "Rodriguez Family", spent: 120, allocated: 1000, pct: 12 },
      { name: "Nguyen Family", spent: 85, allocated: 1000, pct: 8.5 },
      { name: "Williams Family", spent: 200, allocated: 1000, pct: 20 },
      { name: "Patel Family", spent: 150, allocated: 1000, pct: 15 },
    ],
  },
};

export default complianceData;
