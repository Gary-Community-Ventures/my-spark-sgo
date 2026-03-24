const donorData = {
  impactStats: {
    familiesServed: 247,
    totalAwarded: 186500,
    activitiesFunded: 1842,
  },

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

  familiesByMonth: [
    { month: "Aug 2025", families: 28 },
    { month: "Sep 2025", families: 54 },
    { month: "Oct 2025", families: 87 },
    { month: "Nov 2025", families: 112 },
    { month: "Dec 2025", families: 138 },
    { month: "Jan 2026", families: 174 },
    { month: "Feb 2026", families: 215 },
    { month: "Mar 2026", families: 247 },
  ],

  donors: [
    { id: "don-001", name: "Xcel Energy Foundation", type: "corporate", amount: 25000, recurring: true, date: "Jan 15, 2026" },
    { id: "don-002", name: "FirstBank Colorado", type: "corporate", amount: 15000, recurring: true, date: "Feb 1, 2026" },
    { id: "don-003", name: "Gates Family Foundation", type: "corporate", amount: 20000, recurring: false, date: "Nov 20, 2025" },
    { id: "don-004", name: "Western Union Foundation", type: "corporate", amount: 10000, recurring: true, date: "Dec 5, 2025" },
    { id: "don-005", name: "Arrow Electronics", type: "corporate", amount: 12500, recurring: false, date: "Jan 28, 2026" },
    { id: "don-006", name: "Sarah M.", type: "individual", amount: 250, recurring: true, date: "Mar 1, 2026" },
    { id: "don-007", name: "James R.", type: "individual", amount: 500, recurring: false, date: "Feb 14, 2026" },
    { id: "don-008", name: "Linda P.", type: "individual", amount: 100, recurring: true, date: "Mar 10, 2026" },
    { id: "don-009", name: "Robert K.", type: "individual", amount: 150, recurring: true, date: "Jan 5, 2026" },
    { id: "don-010", name: "Patricia W.", type: "individual", amount: 75, recurring: false, date: "Feb 22, 2026" },
    { id: "don-011", name: "Daniela V.", type: "individual", amount: 200, recurring: true, date: "Dec 12, 2025" },
    { id: "don-012", name: "Colorado Health Foundation", type: "corporate", amount: 8000, recurring: false, date: "Oct 15, 2025" },
    { id: "don-013", name: "Michael T.", type: "individual", amount: 300, recurring: false, date: "Mar 5, 2026" },
    { id: "don-014", name: "Nancy L.", type: "individual", amount: 50, recurring: true, date: "Jan 20, 2026" },
    { id: "don-015", name: "Kevin D.", type: "individual", amount: 125, recurring: false, date: "Feb 8, 2026" },
    { id: "don-016", name: "Angela H.", type: "individual", amount: 350, recurring: true, date: "Nov 30, 2025" },
    { id: "don-017", name: "Thomas B.", type: "individual", amount: 200, recurring: false, date: "Mar 15, 2026" },
    { id: "don-018", name: "Maria G.", type: "individual", amount: 75, recurring: true, date: "Dec 28, 2025" },
    { id: "don-019", name: "Christopher N.", type: "individual", amount: 400, recurring: false, date: "Feb 18, 2026" },
    { id: "don-020", name: "Jennifer S.", type: "individual", amount: 100, recurring: true, date: "Jan 12, 2026" },
  ],

  zipDistribution: [
    { zip: "80204", families: 42, label: "West Denver / Sun Valley" },
    { zip: "80219", families: 38, label: "Westwood / Mar Lee" },
    { zip: "80239", families: 35, label: "Montbello / Gateway" },
    { zip: "80249", families: 31, label: "Green Valley Ranch" },
    { zip: "80010", families: 28, label: "Aurora Central" },
    { zip: "80223", families: 26, label: "Ruby Hill / Athmar Park" },
    { zip: "80211", families: 25, label: "Highland / Sunnyside" },
    { zip: "80216", families: 22, label: "Globeville / Elyria-Swansea" },
  ],
};

export default donorData;
