// Verification cases for Smoke/Heat Removal & Purge Screener
window.FT_VERIFY_CASES = {
  script: "smoke_heat_removal.py",
  app: "Smoke/Heat Removal & Purge Screener",
  versionSel: "#appVersion",
  handcalc: "independent checks in verify.test.mjs",
  cases: [
    {
      id: "natural-1-100",
      title: "1:100 on 50,000 ft² requires 500 ft²; 32 ft² vents → 16",
      source: "Prescriptive ratio",
      steps: [
        { set: "#workflow", value: "natural" },
        { set: "#floorArea", value: "50000" },
        { set: "#ventRatio", value: "0.01" },
        { set: "#ventSize", value: "32" }
      ],
      reads: [
        { sel: "#metricReq", label: "Required area", unit: "ft²", ref: 500 }
      ]
    }
  ]
};
