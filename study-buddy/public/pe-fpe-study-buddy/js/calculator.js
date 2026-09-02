/** Onboard scientific calculator — same class of functions as an NCEES-approved handheld. No stored programs. */
(function () {
  "use strict";
  const state = { expr: "", deg: true, mem: 0 };

  function render(root) {
    if (!root) return;
    root.innerHTML = `
      <div class="calc" role="group" aria-label="Scientific calculator">
        <input id="calc-disp" aria-label="Calculator display" readonly value="0">
        <button type="button" data-k="MC">MC</button>
        <button type="button" data-k="MR">MR</button>
        <button type="button" data-k="M+">M+</button>
        <button type="button" data-k="M-">M−</button>
        <button type="button" data-k="DRG">${state.deg ? "DEG" : "RAD"}</button>
        <button type="button" data-k="sin">sin</button>
        <button type="button" data-k="cos">cos</button>
        <button type="button" data-k="tan">tan</button>
        <button type="button" data-k="ln">ln</button>
        <button type="button" data-k="log">log</button>
        <button type="button" data-k="(">(</button>
        <button type="button" data-k=")">)</button>
        <button type="button" data-k="sqrt">√</button>
        <button type="button" data-k="sq">x²</button>
        <button type="button" data-k="pow" class="op">yˣ</button>
        <button type="button" data-k="7">7</button>
        <button type="button" data-k="8">8</button>
        <button type="button" data-k="9">9</button>
        <button type="button" data-k="/" class="op">÷</button>
        <button type="button" data-k="inv">1/x</button>
        <button type="button" data-k="4">4</button>
        <button type="button" data-k="5">5</button>
        <button type="button" data-k="6">6</button>
        <button type="button" data-k="*" class="op">×</button>
        <button type="button" data-k="pi">π</button>
        <button type="button" data-k="1">1</button>
        <button type="button" data-k="2">2</button>
        <button type="button" data-k="3">3</button>
        <button type="button" data-k="-" class="op">−</button>
        <button type="button" data-k="EE">EE</button>
        <button type="button" data-k="0">0</button>
        <button type="button" data-k=".">.</button>
        <button type="button" data-k="C">C</button>
        <button type="button" data-k="+" class="op">+</button>
        <button type="button" data-k="=" class="eq">=</button>
      </div>`;
    root.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => hit(b.dataset.k, root)));
    show(root);
  }

  function show(root) {
    const el = root.querySelector("#calc-disp");
    if (el) el.value = state.expr || "0";
    const drg = root.querySelector('[data-k="DRG"]');
    if (drg) drg.textContent = state.deg ? "DEG" : "RAD";
  }

  function ang(x) { return state.deg ? (x * Math.PI) / 180 : x; }

  function evalExpr(s) {
    const safe = s.replace(/π/g, String(Math.PI)).replace(/EE/g, "e").replace(/\^/g, "**");
    if (!/^[0-9eE+.\-*/() ]+$/.test(safe.replace(/\*\*/g, ""))) throw new Error("bad");
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict"; return (${safe})`)();
    if (!Number.isFinite(v)) throw new Error("nan");
    return v;
  }

  function currentNum() {
    try { return evalExpr(state.expr || "0"); } catch (_) { return NaN; }
  }

  function hit(k, root) {
    const unary = {
      sin: (x) => Math.sin(ang(x)),
      cos: (x) => Math.cos(ang(x)),
      tan: (x) => Math.tan(ang(x)),
      ln: Math.log,
      log: (x) => Math.log10(x),
      sqrt: Math.sqrt,
      sq: (x) => x * x,
      inv: (x) => 1 / x,
    };
    try {
      if (k === "C") state.expr = "";
      else if (k === "DRG") state.deg = !state.deg;
      else if (k === "pi") state.expr += String(Math.PI);
      else if (k === "EE") state.expr += "e";
      else if (k === "pow") state.expr += "^";
      else if (k === "=") state.expr = String(evalExpr(state.expr || "0"));
      else if (k === "MC") state.mem = 0;
      else if (k === "MR") state.expr += String(state.mem);
      else if (k === "M+" || k === "M-") {
        const n = currentNum();
        if (Number.isFinite(n)) state.mem += k === "M+" ? n : -n;
      } else if (unary[k]) {
        const n = currentNum();
        state.expr = String(unary[k](n));
      } else {
        state.expr += k;
      }
    } catch (_) {
      state.expr = "Error";
    }
    show(root);
  }

  window.PE_FPE_CALC = { render };
})();
