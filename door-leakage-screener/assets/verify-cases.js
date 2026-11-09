// Verification cases for Door Leakage Screener (v0.2.0)
// Run in browser console or via shared verify-tab if wired.
// Acceptance criteria from requirements:

window.DOOR_LEAKAGE_VERIFY = [
  {
    id: "orifice-basic",
    description: "Cd 0.65, A 0.01 m², ΔP 25 Pa, ρ 1.2 kg/m³ → Q ≈ 0.04196 m³/s",
    inputs: { Cd: 0.65, A_m2: 0.01, dP_Pa: 25, rho: 1.2 },
    expected_Q_m3s: 0.04196,
    tolerance: 0.0005
  },
  {
    id: "pressure-scale",
    description: "Quadrupling pressure doubles flow (sqrt(4)=2)",
    note: "Independent check of orifice scaling"
  },
  {
    id: "zero-pressure",
    description: "Zero pressure produces zero pressure-driven flow"
  },
  {
    id: "reverse-pressure",
    description: "Reverse pressure changes direction correctly; mass balances consistent"
  },
  {
    id: "unit-roundtrip",
    description: "US/SI conversions remain consistent on round-trip"
  }
];

// Independent calculation helper for tests
function independentOrifice(Cd, A, dP, rho) {
  if (rho <= 0 || A <= 0) return 0;
  const sign = Math.sign(dP) || 1;
  return sign * Cd * A * Math.sqrt(2 * Math.abs(dP) / rho);
}

// Example automated checks (can be expanded into node test if desired)
if (typeof module !== "undefined") {
  module.exports = { independentOrifice, DOOR_LEAKAGE_VERIFY };
}
