/** Assemble forms and set the active item list. */
(function () {
  function rekey(items) {
    const letters = ["A", "B", "C", "D"];
    return (items || []).map(function (it) {
      if (it.form === "A" && it.number <= 15) return it;
      const target = (it.number - 1) % 4;
      const oldChoices = it.choices || [];
      const oldAnsIdx = letters.indexOf(it.answer);
      const rot = oldChoices.slice(oldAnsIdx).concat(oldChoices.slice(0, oldAnsIdx));
      const k = (4 - target) % 4;
      const rot2 = rot.slice(k).concat(rot.slice(0, k));
      const newChoices = rot2.map(function (c, i) { return { key: letters[i], text: c.text }; });
      const why = {};
      rot2.forEach(function (c, i) {
        const oldIdx = oldChoices.findIndex(function (o) { return o.text === c.text; });
        const oldL = letters[oldIdx];
        if (oldL === it.answer) return;
        const note = (it.solution.whyWrong || {})[oldL];
        if (note) why[letters[i]] = note;
      });
      return Object.assign({}, it, {
        choices: newChoices,
        answer: letters[target],
        solution: Object.assign({}, it.solution, { whyWrong: why }),
      });
    });
  }
  const A = rekey(
    (window.PE_FPE_ITEMS_A || [])
      .concat(window.PE_FPE_ITEMS_A_REST || [])
      .concat(window.PE_FPE_ITEMS_A_REST2 || [])
      .concat(window.PE_FPE_ITEMS_A_REST3 || [])
  );
  window.PE_FPE_FORMS = {
    A,
    B: window.PE_FPE_ITEMS_B || [],
    C: window.PE_FPE_ITEMS_C || [],
  };
  window.PE_FPE_SELECT_FORM = function (letter) {
    const f = (letter || "A").toUpperCase();
    const items = window.PE_FPE_FORMS[f] || [];
    window.PE_FPE_ITEMS = items;
    if (window.PE_FPE_META) {
      window.PE_FPE_META.form = f;
      window.PE_FPE_META.items_released = items.length;
      window.PE_FPE_META.scaled_clock_s = Math.max(360, items.length * 360);
      window.PE_FPE_META.status = items.length >= 85 ? "released" : "in-progress";
    }
    return items;
  };
  window.PE_FPE_SELECT_FORM("A");
})();
