// Verification cases for Rated Wall Opening Screener
window.FT_VERIFY_CASES = {
  script: "rated_wall_opening.py",
  app: "Rated Wall Opening Reliability & Exposure Screener",
  versionSel: "#appVersion",
  handcalc: "independent checks in verify.test.mjs",
  cases: [
    {
      id: "geom-25",
      title: "25 ft openings in 100 ft wall = 25%",
      source: "Aggregate width / length",
      steps: [
        { set: "#wallLength", value: "100" },
        { set: "#openingLimit", value: "25" }
      ],
      reads: [
        { sel: "#metricPct", label: "Opening percentage", unit: "%", ref: 25 }
      ]
    },
    {
      id: "or-and",
      title: "p1=0.1, p2=0.2 → OR=0.28, AND=0.02",
      source: "Independent probability",
      steps: [
        { set: "#p1", value: "0.1" },
        { set: "#p2", value: "0.2" }
      ],
      reads: [
        { sel: "#metricOR", label: "OR probability", unit: "", ref: 0.28 },
        { sel: "#metricAND", label: "AND probability", unit: "", ref: 0.02 }
      ]
    }
  ]
};
