// Verification cases for HVAC Smoke Recirculation Screener
window.HVAC_SMOKE_VERIFY = [
  {
    id: "pure-recirc-difference",
    description: "Two equal rooms, 100% recirculation, G=1 g/s, Q=1 m³/s: C1 − C2 approaches 1.0 g/m³; total smoke = G·t"
  },
  {
    id: "100-percent-oa",
    description: "100% outdoor air (no recirculation): room 2 stays at 0"
  },
  {
    id: "instant-shutdown",
    description: "Instant shutdown at t=0 with zero-leak dampers delivers 0. No detector runs to end and flags “no shutdown.”"
  },
  {
    id: "mass-balance",
    description: "Mass balance closes within 0.1% in every case"
  }
];
