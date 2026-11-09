// Verification cases for Structural Fire Member Temperature Screener
window.FT_VERIFY_CASES = {
  script: "structural_fire_member.py",
  app: "Structural Fire Member Temperature Screener",
  versionSel: "#appVersion",
  handcalc: "independent checks in verify.test.mjs",
  cases: [
    {
      id: "analytical-conv",
      title: "Constant gas, convection-only matches analytical",
      source: "Lumped capacitance analytical solution",
      steps: [
        { set: "#gasMode", value: "constant" },
        { set: "#gasConst", value: "800" },
        { set: "#T0", value: "20" },
        { set: "#hc", value: "25" },
        { set: "#emissivity", value: "0" },
        { set: "#sectionFactor", value: "100" }
      ],
      reads: [
        { sel: "#metricPeak", label: "Peak temperature", unit: "°C", ref: 800 }
      ]
    }
  ]
};
