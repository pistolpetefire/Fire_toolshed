// Verification cases for Flammable Vapor Spill & Ventilation Dilution Screener
window.VAPOR_SPILL_VERIFY = [
  {
    id: "vapor-volume-rate",
    description: "m=0.001 kg/s, MW=78 g/mol, T=293.15 K, P=101325 Pa → G=3.084×10⁻⁴ m³/s; at Q_eff=1 → 308 ppm",
    expected_G: 3.084e-4,
    expected_ppm: 308
  },
  {
    id: "required-exhaust",
    description: "Same G, LFL=1.2%, f=0.25, K_mix=1 → required Q=0.1028 m³/s",
    expected_Q: 0.1028
  },
  {
    id: "transient",
    description: "V=100 m³, Q_eff=1 m³/s: C(100 s)=0.632·C_ss; C(2000 s) within 0.1% of C_ss",
    expected_ratio_100: 0.632
  },
  {
    id: "linear-area-units",
    description: "Evaporation scales linearly with area; US/SI round-trip without drift"
  }
];
