/** Compact MCQ constructor used by form packs. */
window.PE_FPE_MAKE = function (form, n, domain, sub, units, hb, code, lock, cog, stem, choiceTexts, answer, outline, miss, repair, whyWrong) {
  const letters = ["A", "B", "C", "D"];
  return {
    id: "FPE-2027-" + form + "-" + String(n).padStart(3, "0"),
    form, number: n, domain, subdomain: sub, type: "mcq4", units,
    handbook: hb, code: code || null, edition_lock: lock || null,
    cognitive: cog, time_budget_s: 360, figure: null, stem,
    choices: choiceTexts.map((text, i) => ({ key: letters[i], text })),
    answer,
    solution: {
      outline,
      miss_type: miss,
      repair_loci: repair || [],
      whyWrong,
    },
  };
};
