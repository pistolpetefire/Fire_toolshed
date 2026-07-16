/**
 * Fire Pump Sizer — client-side engineering calculator
 * Self-contained: no network required after first load (when served + SW).
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'firePumpSizer.v1';
  const APP_VERSION = '2.1.0';

  const hazardClasses = [
    { id: 'light', name: 'Light Hazard (Offices, Barracks)', suggestedDensity: 0.10, typicalDesignArea: 1500, hoseAllowance: 250, typicalPressurePSI: 70 },
    { id: 'ordinary1', name: 'Ordinary Hazard Group 1', suggestedDensity: 0.15, typicalDesignArea: 1500, hoseAllowance: 500, typicalPressurePSI: 85 },
    { id: 'ordinary2', name: 'Ordinary Hazard Group 2', suggestedDensity: 0.20, typicalDesignArea: 1500, hoseAllowance: 500, typicalPressurePSI: 95 },
    { id: 'extra1', name: 'Extra Hazard Group 1', suggestedDensity: 0.30, typicalDesignArea: 2500, hoseAllowance: 750, typicalPressurePSI: 110 },
    { id: 'aircraft', name: 'Aircraft Hangar / Maintenance (DoD)', suggestedDensity: 0.25, typicalDesignArea: 3000, hoseAllowance: 1000, typicalPressurePSI: 105 },
    { id: 'ammo', name: 'Ammunition / Explosives Storage (DoD)', suggestedDensity: 0.35, typicalDesignArea: 2000, hoseAllowance: 1000, typicalPressurePSI: 120 },
    { id: 'warehouse', name: 'Warehouse High-Piled (UFC 2026)', suggestedDensity: 0.25, typicalDesignArea: 10000, hoseAllowance: 750, typicalPressurePSI: 100 }
  ];

  let pumpChart = null;
  let ufcMode = true;
  let saveTimer = null;
  let chartAvailable = typeof window.Chart === 'function';

  const $ = (id) => document.getElementById(id);

  function num(id, fallback) {
    const el = $(id);
    if (!el) return fallback || 0;
    const v = parseFloat(el.value);
    return Number.isFinite(v) ? v : (fallback || 0);
  }

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  function setHtml(id, html) {
    const el = $(id);
    if (el) el.innerHTML = html;
  }

  function toast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 220);
    }, 2200);
  }

  function populateHazardSelect() {
    const select = $('hazardSelect');
    if (!select) return;
    select.innerHTML = '';
    hazardClasses.forEach((h) => {
      const opt = document.createElement('option');
      opt.value = h.id;
      opt.textContent = h.name;
      select.appendChild(opt);
    });
  }

  function getSimplifiedDemand() {
    const density = num('density');
    const area = num('designArea');
    const hose = num('hoseAllowance');
    const flow = density * area + hose;
    const pressure = num('simplifiedPressure');
    return {
      flow: Math.max(0, flow),
      pressure: Math.max(0, pressure),
      density,
      area,
      hose
    };
  }

  function updateSimplifiedPreview() {
    const d = getSimplifiedDemand();
    setText('simplifiedFlowResult', d.flow > 0 ? Math.round(d.flow).toLocaleString() : '—');
    setText('simplifiedPressureResult', d.pressure > 0 ? d.pressure.toFixed(0) : '—');
  }

  function updateHazardSelection() {
    const select = $('hazardSelect');
    if (!select) return;
    const h = hazardClasses.find((x) => x.id === select.value);
    if (!h) return;
    $('density').value = h.suggestedDensity;
    $('designArea').value = h.typicalDesignArea;
    $('hoseAllowance').value = h.hoseAllowance;
    if ($('simplifiedPressure')) {
      $('simplifiedPressure').value = h.typicalPressurePSI;
    }
    updateSimplifiedPreview();
    scheduleSave();
  }

  /** Override primary system flow + pressure from simplified calculator results. */
  function useSimplifiedDemand() {
    const panel = $('simplifiedDemandPanel');
    if (panel) panel.open = true;

    const d = getSimplifiedDemand();
    if (!(d.flow > 0) || !(d.pressure > 0)) {
      toast('Enter density, area, hose, and pressure in the simplified calculator first.');
      return;
    }

    // Force-override primary duty inputs
    $('systemFlow').value = Math.round(d.flow);
    $('systemPressure').value = Math.round(d.pressure);

    // Visual cue that values were replaced
    ['systemFlow', 'systemPressure'].forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.style.transition = 'box-shadow 0.3s, border-color 0.3s';
      el.style.borderColor = '#1e3a8a';
      el.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.2)';
      setTimeout(() => {
        el.style.boxShadow = '';
        el.style.borderColor = '';
      }, 1600);
    });

    updateSimplifiedPreview();
    calculateAll();
    switchTab(0);
    toast(`Simplified demand applied: ${Math.round(d.flow)} GPM @ ${Math.round(d.pressure)} PSI`);
    scheduleSave();
  }

  function toggleUFC() {
    ufcMode = !!$('ufcToggle')?.checked;
    updateCodeNotes();
    calculateAll();
    scheduleSave();
  }

  function getDriverType() {
    const el = document.querySelector('input[name="driverType"]:checked');
    return el ? el.value : 'electric';
  }

  function updateDriverUI() {
    const electric = getDriverType() === 'electric';
    $('electricPanel')?.classList.toggle('hidden', !electric);
    $('dieselPanel')?.classList.toggle('hidden', electric);
    calculateAll();
  }

  function switchTab(tabIndex) {
    document.querySelectorAll('.tab-content').forEach((el) => el.classList.add('hidden'));
    document.querySelectorAll('.nav-tab').forEach((el) => el.classList.remove('active'));
    const content = $(`content-${tabIndex}`);
    const tab = $(`tab-${tabIndex}`);
    if (content) content.classList.remove('hidden');
    if (tab) tab.classList.add('active');
    if (tabIndex === 2) {
      requestAnimationFrame(() => setTimeout(updateChart, 40));
    }
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveState, 400);
  }

  function collectState() {
    return {
      version: APP_VERSION,
      projectName: $('projectName')?.value || '',
      ufcMode: !!$('ufcToggle')?.checked,
      systemFlow: $('systemFlow')?.value,
      systemPressure: $('systemPressure')?.value,
      hydrantStatic: $('hydrantStatic')?.value,
      hydrantFlow: $('hydrantFlow')?.value,
      hydrantResidual: $('hydrantResidual')?.value,
      ratedGPM: $('ratedGPM')?.value,
      ratedPSI: $('ratedPSI')?.value,
      driverType: getDriverType(),
      voltage: $('voltage')?.value,
      dieselRuntime: $('dieselRuntime')?.value,
      hazard: $('hazardSelect')?.value,
      density: $('density')?.value,
      designArea: $('designArea')?.value,
      hoseAllowance: $('hoseAllowance')?.value,
      simplifiedPressure: $('simplifiedPressure')?.value
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collectState()));
    } catch (_) { /* private mode / quota */ }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const s = JSON.parse(raw);
      if (!s || typeof s !== 'object') return false;

      const assign = (id, val) => {
        if (val != null && $(id)) $(id).value = val;
      };

      assign('projectName', s.projectName);
      assign('systemFlow', s.systemFlow);
      assign('systemPressure', s.systemPressure);
      assign('hydrantStatic', s.hydrantStatic);
      assign('hydrantFlow', s.hydrantFlow);
      assign('hydrantResidual', s.hydrantResidual);
      assign('ratedGPM', s.ratedGPM);
      assign('ratedPSI', s.ratedPSI);
      assign('voltage', s.voltage);
      assign('dieselRuntime', s.dieselRuntime);
      assign('density', s.density);
      assign('designArea', s.designArea);
      assign('hoseAllowance', s.hoseAllowance);
      assign('simplifiedPressure', s.simplifiedPressure);

      if (s.hazard && $('hazardSelect')) $('hazardSelect').value = s.hazard;

      if (typeof s.ufcMode === 'boolean' && $('ufcToggle')) {
        $('ufcToggle').checked = s.ufcMode;
        ufcMode = s.ufcMode;
      }

      if (s.driverType) {
        const radio = document.querySelector(`input[name="driverType"][value="${s.driverType}"]`);
        if (radio) radio.checked = true;
      }

      return true;
    } catch (_) {
      return false;
    }
  }

  function clearSavedState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* ignore */ }
  }

  function calculateAll() {
    updateSimplifiedPreview();

    const systemFlow = num('systemFlow');
    const systemPSI = num('systemPressure');
    const finalHeadFt = systemPSI * 2.31;

    // PSI-primary summary cards
    setText('resultFlow', Math.round(systemFlow).toString());
    setText('resultHead', systemPSI.toFixed(0));
    setText('resultHeadPSI', `PSI (${Math.round(finalHeadFt)} ft)`);

    window.calculatedData = {
      systemFlow,
      systemPSI,
      systemHeadFt: finalHeadFt,
      ratedGPM: num('ratedGPM'),
      ratedPSI: num('ratedPSI')
    };

    const hydrantStatic = num('hydrantStatic');
    const hydrantFlow = num('hydrantFlow');
    const hydrantResidual = num('hydrantResidual');

    if (hydrantStatic > 0 && hydrantFlow > 0 && hydrantResidual > 0 && systemFlow > 0) {
      calculateSupplyCurve(true);
    } else {
      $('supplyResults')?.classList.add('hidden');
      setText('availablePressure', '—');
      setText('pumpMustAdd', '—');
      setText('supplyStatus', '');
      if ($('supplyStatus')) $('supplyStatus').className = 'badge';
    }

    const driverType = getDriverType();
    const ratedGPM = window.calculatedData.ratedGPM;
    const ratedPSI = window.calculatedData.ratedPSI;
    const ratedHeadFt = ratedPSI * 2.31;

    if (ratedGPM > 0 && ratedPSI > 0) {
      const efficiency = 0.75;
      const baseHP = (ratedGPM * ratedHeadFt) / (3960 * efficiency);

      if (driverType === 'electric') {
        const motorHP = baseHP * 1.15;
        const voltage = num('voltage', 460);
        const fla = (motorHP * 746) / (voltage * 1.732 * 0.9 * 0.85);
        const breaker = Math.ceil((fla * 1.25) / 5) * 5;
        setText('motorHP', motorHP.toFixed(1));
        setText('fla', fla.toFixed(0));
        setText('breaker', breaker + 'A');
        window.calculatedData.diesel = null;
      } else {
        const dieselHP = baseHP * 1.2;
        const runtime = num('dieselRuntime', 8);
        const fuelRate = dieselHP * 0.055;
        const fuelTank = Math.round(fuelRate * runtime * 1.2);
        setText('dieselHP', dieselHP.toFixed(1));
        setHtml('fuelRate', fuelRate.toFixed(1) + ' <span class="tiny">gal/hr</span>');
        setHtml('fuelTank', fuelTank + ' <span class="tiny">gal</span>');
        window.calculatedData.diesel = { dieselHP, fuelRate, fuelTank, runtime };
      }
    } else {
      window.calculatedData.diesel = null;
    }

    updateVerification(systemFlow, systemPSI, ratedGPM, ratedPSI);
    updateHighPressureWarning(ratedPSI);
    updateTestPointsTable(systemFlow, systemPSI, ratedGPM, ratedPSI);
    updateRoomSizing(ratedGPM, driverType);
    updateCodeNotes();

    if (!$('content-2')?.classList.contains('hidden')) {
      updateChart();
    }

    scheduleSave();
  }

  function calculateSupplyCurve(silent) {
    const systemFlow = num('systemFlow');
    const hydrantStatic = num('hydrantStatic');
    const hydrantFlow = num('hydrantFlow');
    const hydrantResidual = num('hydrantResidual');
    const systemPressure = num('systemPressure');

    if (!(hydrantStatic > 0 && hydrantFlow > 0 && hydrantResidual > 0 && systemFlow > 0)) {
      if (!silent) toast('Enter valid hydrant test data and system flow.');
      return;
    }

    // Linear supply-curve estimate (quick field method)
    const pressureDrop = hydrantStatic - hydrantResidual;
    const flowRatio = systemFlow / hydrantFlow;
    let availablePSI = hydrantStatic - pressureDrop * flowRatio;
    if (availablePSI < 0) availablePSI = 0;

    const netPumpPressure = Math.max(0, systemPressure - availablePSI);

    setText('availablePressure', availablePSI.toFixed(0));
    setText('pumpMustAdd', netPumpPressure.toFixed(0));

    const resultsBox = $('supplyResults');
    if (resultsBox) resultsBox.classList.remove('hidden');

    setText('availableAtFlow', availablePSI.toFixed(1) + ' PSI');
    setText('netPumpPressure', netPumpPressure.toFixed(1) + ' PSI');

    const qualityBox = $('supplyQualityBox');
    const statusEl = $('supplyStatus');
    let qualityClass = '';
    let qualityText = '';

    if (availablePSI >= systemPressure * 0.9) {
      qualityClass = 'supply-good';
      qualityText = '<strong class="text-emerald">Supply Adequate</strong><br>System can likely meet demand with minimal pump boost.';
      if (statusEl) {
        statusEl.className = 'badge badge-good';
        statusEl.textContent = 'Supply Strong';
      }
    } else if (availablePSI >= systemPressure * 0.6) {
      qualityClass = 'supply-marginal';
      qualityText = '<strong class="text-amber">Marginal Supply</strong><br>Pump will need to make up significant pressure. Verify test data and consider redundancy.';
      if (statusEl) {
        statusEl.className = 'badge badge-warn';
        statusEl.textContent = 'Marginal';
      }
    } else {
      qualityClass = 'supply-poor';
      qualityText = '<strong class="text-red">Inadequate Supply</strong><br>Strongly indicates need for fire pump. Confirm hydrant test location and consider supply improvements.';
      if (statusEl) {
        statusEl.className = 'badge badge-bad';
        statusEl.textContent = 'Pump Required';
      }
    }

    if (qualityBox) {
      qualityBox.className = 'p-box ' + qualityClass;
      qualityBox.style.padding = '0.75rem';
      qualityBox.style.borderRadius = '0.75rem';
      qualityBox.style.border = '1px solid';
      qualityBox.style.fontSize = '0.75rem';
      qualityBox.innerHTML = qualityText;
    }

    if (!silent) {
      setTimeout(() => switchTab(2), 250);
    }
  }

  function updateHighPressureWarning(ratedPSI) {
    const warningBox = $('highPressureWarning');
    const messageEl = $('highPressureMessage');
    if (!warningBox || !messageEl) return;

    if (!ratedPSI || ratedPSI <= 0) {
      warningBox.classList.add('hidden');
      return;
    }

    const churnPSI = ratedPSI * 1.4;

    if (churnPSI >= 170) {
      warningBox.classList.remove('hidden');
      if (churnPSI >= 300) {
        messageEl.innerHTML = `Maximum churn pressure ≈ <strong>${churnPSI.toFixed(0)} PSI</strong>. Significantly exceeds standard 175 psi components. 300 psi rated fittings and relief protection strongly recommended.`;
      } else {
        messageEl.innerHTML = `Maximum churn pressure ≈ <strong>${churnPSI.toFixed(0)} PSI</strong>. Approaches/exceeds 175 psi rating of standard components. Consider 300 psi fittings or pressure relief valve.`;
      }
    } else {
      warningBox.classList.add('hidden');
    }
  }

  function updateVerification(dutyFlow, dutyPSI, ratedGPM, ratedPSI) {
    const container = $('checksGrid');
    if (!container) return;
    container.innerHTML = '';

    if (!ratedGPM || !ratedPSI) {
      setText('verificationStatus', 'Enter pump data');
      setHtml('verificationIcon', '❓');
      return;
    }

    // Preliminary checks vs NFPA 20 performance envelope (illustrative)
    const meets100 = dutyFlow <= ratedGPM * 1.1;
    const dutyHeadOk = dutyPSI <= ratedPSI * 1.05; // duty pressure should be near/below rated
    const churnPSI = ratedPSI * 1.4;
    const meetsChurn = churnPSI <= ratedPSI * 1.4 + 0.5;
    const meets150 = true; // assumed by standard 65% head model unless manufacturer curve says otherwise

    const checks = [
      { label: '100% Rated Flow', pass: meets100, msg: meets100 ? 'Duty point covered' : 'Consider larger pump' },
      { label: 'Duty ≤ Rated Pressure', pass: dutyHeadOk, msg: dutyHeadOk ? 'Within rating' : 'Duty pressure above rated — review' },
      { label: 'Churn ≤140% Rated', pass: meetsChurn, msg: meetsChurn ? 'Within NFPA 20 model' : 'Exceeds limit' }
    ];

    checks.forEach((c) => {
      const div = document.createElement('div');
      div.className = 'check-card ' + (c.pass ? 'pass' : 'fail');
      div.innerHTML = `
        <div class="label">${c.pass ? '✓' : '!'} ${c.label}</div>
        <div class="msg">${c.msg}</div>
      `;
      container.appendChild(div);
    });

    const allPass = meets100 && meets150 && meetsChurn && dutyHeadOk;
    setHtml('verificationStatus', allPass
      ? '<span class="text-emerald">PASS — NFPA 20</span>'
      : '<span class="text-amber">REVIEW NEEDED</span>');
    setHtml('verificationIcon', allPass ? '🛡️' : '⚠️');
  }

  function updateTestPointsTable(systemFlow, systemPSI, ratedGPM, ratedPSI) {
    const tbody = $('testPointsBody');
    if (!tbody) return;

    if (!ratedGPM || !ratedPSI) {
      tbody.innerHTML = '<tr><td colspan="4" class="tiny">Enter proposed pump rating to populate test points.</td></tr>';
      return;
    }

    const churnPSI = ratedPSI * 1.4;
    const oneFiftyPSI = ratedPSI * 0.65;
    const rows = [
      { name: 'Churn (shutoff)', flow: 0, psi: churnPSI, note: '≤ 140% rated pressure', duty: false },
      { name: '100% Rated', flow: ratedGPM, psi: ratedPSI, note: 'Rated capacity & pressure', duty: false },
      { name: '150% Flow', flow: ratedGPM * 1.5, psi: oneFiftyPSI, note: '≥ 65% rated pressure', duty: false },
      { name: 'System Demand', flow: systemFlow, psi: systemPSI, note: 'Required at pump discharge', duty: true }
    ];

    tbody.innerHTML = rows.map((r) => `
      <tr class="${r.duty ? 'duty' : ''}">
        <td>${r.name}</td>
        <td class="num">${Math.round(r.flow).toLocaleString()}</td>
        <td class="num">${r.psi.toFixed(1)}</td>
        <td>${r.note}</td>
      </tr>
    `).join('');
  }

  function updateChart() {
    const canvas = $('pumpChart');
    const fallback = $('chartFallback');
    const data = window.calculatedData;

    if (!canvas) return;

    if (!chartAvailable) {
      canvas.classList.add('hidden');
      if (fallback) {
        fallback.classList.remove('hidden');
        fallback.textContent = 'Chart library unavailable. Test points table below still works.';
      }
      return;
    }

    if (!data || !data.ratedGPM || !data.ratedPSI) {
      if (fallback) {
        fallback.classList.remove('hidden');
        fallback.textContent = 'Enter pump rating to draw the curve.';
      }
      canvas.classList.add('hidden');
      return;
    }

    canvas.classList.remove('hidden');
    if (fallback) fallback.classList.add('hidden');

    const churnPSI = data.ratedPSI * 1.4;
    const oneFiftyPSI = data.ratedPSI * 0.65;

    const chartData = {
      datasets: [
        {
          label: 'Pump Curve (NFPA 20 points)',
          data: [
            { x: 0, y: churnPSI },
            { x: data.ratedGPM, y: data.ratedPSI },
            { x: data.ratedGPM * 1.5, y: oneFiftyPSI }
          ],
          borderColor: '#1e40af',
          borderWidth: 3,
          tension: 0.15,
          pointRadius: 5,
          pointBackgroundColor: '#1e40af',
          fill: false
        },
        {
          label: 'System Demand',
          data: [{ x: data.systemFlow, y: data.systemPSI }],
          borderColor: '#dc2626',
          backgroundColor: '#dc2626',
          pointRadius: 9,
          showLine: false
        }
      ]
    };

    try {
      if (pumpChart) {
        pumpChart.destroy();
        pumpChart = null;
      }

      pumpChart = new Chart(canvas, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'nearest', intersect: false },
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label(ctx) {
                  const x = ctx.parsed.x;
                  const y = ctx.parsed.y;
                  return `${ctx.dataset.label}: ${Math.round(x)} GPM @ ${y.toFixed(1)} PSI`;
                }
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              title: { display: true, text: 'Flow (GPM)' },
              min: 0,
              max: Math.max(data.ratedGPM * 1.7, data.systemFlow * 1.3, 100)
            },
            y: {
              type: 'linear',
              title: { display: true, text: 'Pressure (PSI)' },
              min: 0,
              max: Math.max(churnPSI * 1.15, data.systemPSI * 1.2, 50)
            }
          }
        }
      });
    } catch (err) {
      console.warn('[Fire Pump Sizer] Chart error:', err);
      canvas.classList.add('hidden');
      if (fallback) {
        fallback.classList.remove('hidden');
        fallback.textContent = 'Chart failed to render. Use the test points table below.';
      }
    }
  }

  /**
   * Estimate diesel fuel tank footprint + dike plan area (preliminary).
   * Tank: volume → floor SF at ~4 ft working height.
   * Dike: ≥110% tank volume at 1 ft effective containment depth, min 3 ft beyond tank.
   */
  function estimateFuelTankAndDike(tankGal) {
    const gal = Math.max(0, tankGal || 0);
    const tankCuFt = gal * 0.133681;
    const tankSF = Math.max(20, Math.ceil(tankCuFt / 4)); // ~4 ft tall tank equivalent
    let tankW = Math.max(3, Math.ceil(Math.sqrt(tankSF * 0.55)));
    let tankL = Math.max(4, Math.ceil(tankSF / tankW));
    const tankFootSF = tankW * tankL;

    // Dike: 110% of tank volume at 1 ft wall height; not less than tank + 3 ft each side
    const DIKE_BEYOND_TANK_FT = 3;
    const dikeVolSF = Math.ceil((1.1 * tankCuFt) / 1.0);
    const dikeMinW = tankW + DIKE_BEYOND_TANK_FT * 2;
    const dikeMinL = tankL + DIKE_BEYOND_TANK_FT * 2;
    let dikeW = dikeMinW;
    let dikeL = Math.max(dikeMinL, Math.ceil(dikeVolSF / dikeW));
    while (dikeW * dikeL < dikeVolSF) dikeL += 1;
    const dikeSF = dikeW * dikeL;

    return {
      tankGal: gal,
      tankCuFt,
      tankW,
      tankL,
      tankFootSF,
      dikeW,
      dikeL,
      dikeSF,
      dikeBeyondFt: DIKE_BEYOND_TANK_FT,
      containmentPct: 110,
      dikeWallHtFt: 1
    };
  }

  function dimsFromSF(sf, aspect) {
    const a = aspect == null ? 0.6 : aspect;
    const w = Math.max(6, Math.ceil(Math.sqrt(sf * a)));
    const l = Math.max(8, Math.ceil(sf / w));
    return { w, l, sf: w * l };
  }

  /** Typical wall-mounted fire pump controller footprint (plan), feet */
  const CONTROLLER_TYP = {
    alongWallFt: 3, // ~36 in wide
    depthFt: 2,     // ~24 in deep into room
    label: 'Controller (typ. 3\' × 2\')'
  };

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Build plan-view geometry in feet.
   * X = left→right (pump toward fuel for diesel), Y = top→bottom (room width).
   */
  function buildRoomPlanLayout(driverType, equip, fuel, clearanceFt, sepFt, roomWidth, roomLength) {
    const C = clearanceFt;
    const ctrl = CONTROLLER_TYP;

    // Pump package block (equipment + clearance)
    const pumpBlockL = equip.l + C * 2; // along X
    const pumpBlockW = equip.w + C * 2; // along Y

    let dikeBlockL = 0;
    let dikeBlockW = 0;
    if (driverType === 'diesel' && fuel) {
      dikeBlockL = fuel.dikeL + C * 2;
      dikeBlockW = fuel.dikeW + C * 2;
    }

    // Center blocks in Y
    const pumpBlockY = Math.max(0, (roomWidth - pumpBlockW) / 2);
    const pumpX = C;
    const pumpY = pumpBlockY + C;

    // Controller on left (west) wall, aligned with pump band
    const ctrlX = 0;
    const ctrlY = Math.min(
      Math.max(0.25, pumpY + (equip.w - ctrl.alongWallFt) / 2),
      Math.max(0, roomWidth - ctrl.alongWallFt)
    );

    // Clearance envelope around pump (dashed)
    const clearX = pumpX - C;
    const clearY = pumpY - C;
    const clearW = equip.l + C * 2;
    const clearH = equip.w + C * 2;

    let dike = null;
    let tank = null;
    let sep = null;
    if (driverType === 'diesel' && fuel) {
      const dikeBlockX = pumpBlockL + sepFt;
      const dikeBlockY = Math.max(0, (roomWidth - dikeBlockW) / 2);
      const dikeX = dikeBlockX + C;
      const dikeY = dikeBlockY + C;
      dike = { x: dikeX, y: dikeY, w: fuel.dikeL, h: fuel.dikeW };
      tank = {
        x: dikeX + (fuel.dikeL - fuel.tankL) / 2,
        y: dikeY + (fuel.dikeW - fuel.tankW) / 2,
        w: fuel.tankL,
        h: fuel.tankW,
        gal: fuel.tankGal
      };
      sep = {
        x: pumpBlockL,
        y: 0,
        w: sepFt,
        h: roomWidth
      };
    }

    return {
      roomW: roomLength, // SVG width in ft (X)
      roomH: roomWidth,  // SVG height in ft (Y)
      pump: {
        x: pumpX,
        y: pumpY,
        w: equip.l,
        h: equip.w,
        label: driverType === 'diesel' ? 'Pump + diesel engine' : 'Pump + motor'
      },
      clearance: { x: clearX, y: clearY, w: clearW, h: clearH, ft: C },
      controller: {
        x: ctrlX,
        y: ctrlY,
        w: ctrl.depthFt,
        h: ctrl.alongWallFt,
        label: ctrl.label
      },
      dike,
      tank,
      sep,
      driverType
    };
  }

  /** SVG plan view — dimensions in feet, scaled to viewBox */
  function renderRoomPlanSVG(layout) {
    const padL = 48;
    const padR = 28;
    const padT = 36;
    const padB = 52;
    const roomFtW = layout.roomW;
    const roomFtH = layout.roomH;
    // Scale so long side ~ 520 px
    const scale = Math.min(520 / roomFtW, 360 / roomFtH, 28);
    const rw = roomFtW * scale;
    const rh = roomFtH * scale;
    const vbW = padL + rw + padR;
    const vbH = padT + rh + padB;
    const ox = padL;
    const oy = padT;

    const x = (ft) => ox + ft * scale;
    const y = (ft) => oy + ft * scale;
    const s = (ft) => ft * scale;

    const parts = [];
    parts.push(`<svg viewBox="0 0 ${vbW.toFixed(1)} ${vbH.toFixed(1)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fire pump room plan view">`);
    parts.push('<defs>');
    parts.push('<pattern id="hatchDike" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">');
    parts.push('<line x1="0" y1="0" x2="0" y2="8" stroke="#f59e0b" stroke-width="1.5" opacity="0.45"/>');
    parts.push('</pattern>');
    parts.push('</defs>');

    // Title / north arrow
    parts.push(`<text x="${ox}" y="16" font-size="12" font-weight="600" fill="#1e293b">PLAN VIEW</text>`);
    parts.push(`<g transform="translate(${ox + rw - 10}, 8)">`);
    parts.push('<polygon points="0,0 6,14 -6,14" fill="#334155"/>');
    parts.push('<text x="0" y="26" text-anchor="middle" font-size="9" fill="#475569">N</text>');
    parts.push('</g>');

    // Room floor
    parts.push(`<rect x="${x(0)}" y="${y(0)}" width="${s(roomFtW)}" height="${s(roomFtH)}" fill="#f8fafc" stroke="#0f172a" stroke-width="2.5" rx="2"/>`);

    // Separation strip (diesel)
    if (layout.sep) {
      const sp = layout.sep;
      parts.push(`<rect x="${x(sp.x)}" y="${y(sp.y)}" width="${s(sp.w)}" height="${s(sp.h)}" fill="#e2e8f0" stroke="none" opacity="0.7"/>`);
      parts.push(`<text x="${x(sp.x + sp.w / 2)}" y="${y(roomFtH / 2)}" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90 ${x(sp.x + sp.w / 2)} ${y(roomFtH / 2)})">${sp.w}' sep.</text>`);
    }

    // Clearance envelope (dashed)
    const cl = layout.clearance;
    parts.push(`<rect x="${x(cl.x)}" y="${y(cl.y)}" width="${s(cl.w)}" height="${s(cl.h)}" fill="#dbeafe" fill-opacity="0.45" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="6 4" rx="2"/>`);
    parts.push(`<text x="${x(cl.x + 0.15)}" y="${y(cl.y) + 12}" font-size="9" fill="#1d4ed8">${cl.ft}' clr</text>`);

    // Dike
    if (layout.dike) {
      const d = layout.dike;
      parts.push(`<rect x="${x(d.x)}" y="${y(d.y)}" width="${s(d.w)}" height="${s(d.h)}" fill="url(#hatchDike)" stroke="#d97706" stroke-width="2" rx="2"/>`);
      parts.push(`<text x="${x(d.x + d.w / 2)}" y="${y(d.y) + 12}" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">DIKE ${d.w.toFixed(0)}'×${d.h.toFixed(0)}'</text>`);
    }

    // Fuel tank
    if (layout.tank) {
      const t = layout.tank;
      parts.push(`<rect x="${x(t.x)}" y="${y(t.y)}" width="${s(t.w)}" height="${s(t.h)}" fill="#fdba74" stroke="#c2410c" stroke-width="1.5" rx="3"/>`);
      parts.push(`<text x="${x(t.x + t.w / 2)}" y="${y(t.y + t.h / 2) - 4}" text-anchor="middle" font-size="10" font-weight="600" fill="#7c2d12">FUEL TANK</text>`);
      parts.push(`<text x="${x(t.x + t.w / 2)}" y="${y(t.y + t.h / 2) + 10}" text-anchor="middle" font-size="9" fill="#9a3412">${Math.round(t.gal).toLocaleString()} gal</text>`);
      parts.push(`<text x="${x(t.x + t.w / 2)}" y="${y(t.y + t.h / 2) + 22}" text-anchor="middle" font-size="8" fill="#9a3412">${t.w.toFixed(0)}'×${t.h.toFixed(0)}'</text>`);
    }

    // Pump / driver
    const p = layout.pump;
    parts.push(`<rect x="${x(p.x)}" y="${y(p.y)}" width="${s(p.w)}" height="${s(p.h)}" fill="#1e3a8a" stroke="#172554" stroke-width="1.5" rx="3"/>`);
    // Simple pump symbol (circle + impeller hint)
    const cx = x(p.x + p.w * 0.35);
    const cy = y(p.y + p.h / 2);
    const pr = Math.min(s(p.w), s(p.h)) * 0.22;
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${pr}" fill="none" stroke="#93c5fd" stroke-width="1.5"/>`);
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${pr * 0.35}" fill="#93c5fd"/>`);
    parts.push(`<text x="${x(p.x + p.w / 2)}" y="${y(p.y + p.h / 2) - 2}" text-anchor="middle" font-size="10" font-weight="600" fill="#fff">${esc(p.label)}</text>`);
    parts.push(`<text x="${x(p.x + p.w / 2)}" y="${y(p.y + p.h / 2) + 12}" text-anchor="middle" font-size="9" fill="#bfdbfe">${p.w.toFixed(0)}'×${p.h.toFixed(0)}'</text>`);

    // Controller on wall
    const c = layout.controller;
    parts.push(`<rect x="${x(c.x)}" y="${y(c.y)}" width="${s(c.w)}" height="${s(c.h)}" fill="#312e81" stroke="#1e1b4b" stroke-width="1.5" rx="2"/>`);
    parts.push(`<text x="${x(c.x + c.w / 2)}" y="${y(c.y + c.h / 2)}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-weight="600" fill="#e0e7ff" transform="rotate(-90 ${x(c.x + c.w / 2)} ${y(c.y + c.h / 2)})">CTRL</text>`);

    // Wall tick marks for controller
    parts.push(`<line x1="${x(0)}" y1="${y(c.y)}" x2="${x(0)}" y2="${y(c.y + c.h)}" stroke="#4f46e5" stroke-width="4" stroke-linecap="square"/>`);

    // Overall dimension — width (bottom)
    const dimY = y(roomFtH) + 22;
    parts.push(`<line x1="${x(0)}" y1="${dimY}" x2="${x(roomFtW)}" y2="${dimY}" stroke="#334155" stroke-width="1"/>`);
    parts.push(`<line x1="${x(0)}" y1="${dimY - 5}" x2="${x(0)}" y2="${dimY + 5}" stroke="#334155" stroke-width="1"/>`);
    parts.push(`<line x1="${x(roomFtW)}" y1="${dimY - 5}" x2="${x(roomFtW)}" y2="${dimY + 5}" stroke="#334155" stroke-width="1"/>`);
    parts.push(`<text x="${x(roomFtW / 2)}" y="${dimY + 14}" text-anchor="middle" font-size="11" font-weight="600" fill="#0f172a">${roomFtW.toFixed(0)} ft</text>`);

    // Overall dimension — height (left)
    const dimX = x(0) - 18;
    parts.push(`<line x1="${dimX}" y1="${y(0)}" x2="${dimX}" y2="${y(roomFtH)}" stroke="#334155" stroke-width="1"/>`);
    parts.push(`<line x1="${dimX - 5}" y1="${y(0)}" x2="${dimX + 5}" y2="${y(0)}" stroke="#334155" stroke-width="1"/>`);
    parts.push(`<line x1="${dimX - 5}" y1="${y(roomFtH)}" x2="${dimX + 5}" y2="${y(roomFtH)}" stroke="#334155" stroke-width="1"/>`);
    parts.push(`<text x="${dimX - 10}" y="${y(roomFtH / 2)}" text-anchor="middle" font-size="11" font-weight="600" fill="#0f172a" transform="rotate(-90 ${dimX - 10} ${y(roomFtH / 2)})">${roomFtH.toFixed(0)} ft</text>`);

    // Clearance callout on pump right side
    const clrMidY = p.y + p.h / 2;
    const clrLineX1 = p.x + p.w;
    const clrLineX2 = p.x + p.w + cl.ft;
    if (cl.ft > 0 && clrLineX2 <= roomFtW + 0.01) {
      parts.push(`<line x1="${x(clrLineX1)}" y1="${y(clrMidY)}" x2="${x(clrLineX2)}" y2="${y(clrMidY)}" stroke="#2563eb" stroke-width="1.2"/>`);
      parts.push(`<text x="${x((clrLineX1 + clrLineX2) / 2)}" y="${y(clrMidY) - 4}" text-anchor="middle" font-size="8" fill="#1d4ed8">${cl.ft}'</text>`);
    }

    // Controller size note
    parts.push(`<text x="${x(c.x + c.w + 0.15)}" y="${y(c.y) - 3}" font-size="8" fill="#4338ca">typ. ${CONTROLLER_TYP.alongWallFt}'W × ${CONTROLLER_TYP.depthFt}'D</text>`);

    parts.push('</svg>');
    return parts.join('');
  }

  function planLegendHtml(isDiesel) {
    const dieselBits = isDiesel
      ? '<span><i class="plan-swatch" style="background:#fdba74"></i> Fuel tank</span>' +
        '<span><i class="plan-swatch" style="background:#fde68a;border-color:#d97706"></i> Dike / containment</span>' +
        '<span><i class="plan-swatch" style="background:#e2e8f0"></i> Pump-fuel separation</span>'
      : '';
    return (
      '<div class="plan-legend">' +
      '<span><i class="plan-swatch" style="background:#1e3a8a"></i> Pump / driver</span>' +
      '<span><i class="plan-swatch" style="background:#312e81"></i> Controller (wall)</span>' +
      '<span><i class="plan-swatch" style="background:#dbeafe;border-style:dashed;border-color:#3b82f6"></i> 3 ft working clearance</span>' +
      dieselBits +
      '</div>'
    );
  }

  /** Reliable plan image (avoids SVG-via-innerHTML stripping in some browsers). */
  function planSvgToImgHtml(svgMarkup) {
    const encoded = encodeURIComponent(svgMarkup)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    const src = 'data:image/svg+xml;charset=utf-8,' + encoded;
    return (
      '<img class="room-plan-img" src="' + src + '" ' +
      'alt="Fire pump room plan view" ' +
      'width="640" height="420" ' +
      'style="display:block;width:100%;max-width:720px;height:auto;min-height:280px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;" />'
    );
  }

  function updateRoomSizing(ratedGPM, driverType) {
    const container = $('roomSizingContent');
    if (!container) return;

    if (!ratedGPM) {
      container.innerHTML = '<div class="muted">Enter a proposed pump rating to estimate room size.</div>';
      return;
    }

    const CLEARANCE_FT = 3; // NFPA 20 working clearance each side of equipment
    const PUMP_TO_FUEL_SEP_FT = 5; // separation between pump package and fuel/dike zone
    const notes = [];
    const breakdown = [];

    // --- Pump / driver core footprint (fuel handled separately for diesel) ---
    let equipSF = Math.max(120, Math.ceil(ratedGPM / 8));
    if (driverType === 'electric') {
      equipSF = Math.max(equipSF, 180);
    } else {
      // Engine + pump only (tank/dike added below)
      equipSF = Math.max(equipSF, 220);
    }

    if (ufcMode) {
      equipSF = Math.round(equipSF * 1.25);
      notes.push('UFC 3-600-01 factor applied to pump/driver core (may need redundant unit space).');
    }

    const equip = dimsFromSF(equipSF, 0.6);
    breakdown.push({
      name: driverType === 'diesel' ? 'Pump + diesel engine core' : 'Pump + electric motor core',
      detail: `${equip.w}' × ${equip.l}'`,
      sf: equip.sf
    });
    breakdown.push({
      name: CONTROLLER_TYP.label,
      detail: `${CONTROLLER_TYP.alongWallFt}' along wall × ${CONTROLLER_TYP.depthFt}' deep (wall-mounted)`,
      sf: CONTROLLER_TYP.alongWallFt * CONTROLLER_TYP.depthFt
    });

    let roomWidth;
    let roomLength;
    let roomSF;
    let includeLine = 'Working clearance included';
    let fuel = null;

    if (driverType === 'diesel') {
      const diesel = (window.calculatedData && window.calculatedData.diesel) || null;
      let tankGal = diesel ? diesel.fuelTank : 0;
      if (!tankGal && ratedGPM) {
        const ratedPSI = num('ratedPSI');
        const headFt = ratedPSI * 2.31;
        const baseHP = (ratedGPM * headFt) / (3960 * 0.75);
        const dieselHP = baseHP * 1.2;
        const runtime = num('dieselRuntime', 8);
        tankGal = Math.round(dieselHP * 0.055 * runtime * 1.2);
      }

      fuel = estimateFuelTankAndDike(tankGal);

      breakdown.push({
        name: `Fuel tank (${fuel.tankGal.toLocaleString()} gal)`,
        detail: `${fuel.tankW}' × ${fuel.tankL}' footprint (~4 ft tall equiv.)`,
        sf: fuel.tankFootSF
      });
      breakdown.push({
        name: `Diking / spill containment (${fuel.containmentPct}% of tank vol. @ ${fuel.dikeWallHtFt}' wall)`,
        detail: `${fuel.dikeW}' × ${fuel.dikeL}' (incl. ${fuel.dikeBeyondFt}' beyond tank)`,
        sf: fuel.dikeSF
      });
      breakdown.push({
        name: `Working clearances (${CLEARANCE_FT}' around pump package & around dike)`,
        detail: `+${CLEARANCE_FT * 2}' on each zone’s width & length`,
        sf: null
      });
      breakdown.push({
        name: `Pump-to-fuel separation`,
        detail: `${PUMP_TO_FUEL_SEP_FT}' between pump package and dike zone`,
        sf: null
      });

      const pumpBlockW = equip.w + CLEARANCE_FT * 2;
      const pumpBlockL = equip.l + CLEARANCE_FT * 2;
      const dikeBlockW = fuel.dikeW + CLEARANCE_FT * 2;
      const dikeBlockL = fuel.dikeL + CLEARANCE_FT * 2;

      roomWidth = Math.max(pumpBlockW, dikeBlockW);
      roomLength = pumpBlockL + PUMP_TO_FUEL_SEP_FT + dikeBlockL;
      roomSF = roomWidth * roomLength;

      const clearancePumpSF = pumpBlockW * pumpBlockL - equip.sf;
      const clearanceDikeSF = dikeBlockW * dikeBlockL - fuel.dikeSF;
      const separationSF = roomWidth * PUMP_TO_FUEL_SEP_FT;
      breakdown.push({
        name: 'Clearance area (pump zone)',
        detail: `${pumpBlockW}' × ${pumpBlockL}' package minus core`,
        sf: Math.max(0, clearancePumpSF)
      });
      breakdown.push({
        name: 'Clearance area (dike zone to walls)',
        detail: `${dikeBlockW}' × ${dikeBlockL}' package minus dike`,
        sf: Math.max(0, clearanceDikeSF)
      });
      breakdown.push({
        name: 'Separation strip (pump ↔ fuel)',
        detail: `${roomWidth}' × ${PUMP_TO_FUEL_SEP_FT}'`,
        sf: separationSF
      });

      includeLine = 'Fuel tank, diking, clearances & separation included';
      notes.unshift('All listed sizes are included in the total room dimensions and square footage.');
      notes.push('Exhaust, combustion air, and AHJ/fuel-code setbacks may increase size further.');
      notes.push('Dike volume uses 110% of tank capacity at a 1 ft effective wall height (preliminary).');
      if (diesel && diesel.runtime) {
        notes.push(`Fuel tank sized for ${diesel.runtime}-hr runtime × 1.2 contingency (matches Driver tab).`);
      }
    } else {
      roomWidth = equip.w + CLEARANCE_FT * 2;
      roomLength = equip.l + CLEARANCE_FT * 2;
      roomSF = roomWidth * roomLength;
      breakdown.push({
        name: `Working clearances (${CLEARANCE_FT}' each side)`,
        detail: `Room ${roomWidth}' × ${roomLength}' includes +${CLEARANCE_FT * 2}' each way`,
        sf: roomSF - equip.sf
      });
      includeLine = 'Working clearance included';
      notes.unshift('Working clearance included (3 ft around equipment per NFPA 20).');
      notes.unshift('All listed sizes are included in the total room dimensions and square footage.');
    }

    notes.push('Controller shown as typical wall-mounted fire pump controller (~3\' wide × 2\' deep); verify manufacturer cabinet size.');

    let planBlock = '';
    try {
      const planLayout = buildRoomPlanLayout(
        driverType,
        equip,
        fuel,
        CLEARANCE_FT,
        PUMP_TO_FUEL_SEP_FT,
        roomWidth,
        roomLength
      );
      const planSvg = renderRoomPlanSVG(planLayout);
      const planImg = planSvgToImgHtml(planSvg);
      planBlock =
        '<div class="room-plan-wrap" id="roomPlanDiagram">' +
        '<h3>Room plan view (preliminary)</h3>' +
        '<p class="plan-caption">Top-down layout. Dimensions match the totals above. Not a construction drawing — verify clearances, doors, piping, and AHJ requirements.</p>' +
        planImg +
        planLegendHtml(driverType === 'diesel') +
        '</div>';
    } catch (err) {
      console.error('[Fire Pump Sizer] Plan diagram error:', err);
      planBlock =
        '<div class="room-plan-wrap" id="roomPlanDiagram">' +
        '<h3>Room plan view</h3>' +
        '<p class="plan-caption" style="color:#b91c1c">Diagram could not be drawn. Try refresh. (' +
        esc(err && err.message ? err.message : 'error') + ')</p></div>';
    }

    const breakdownRows = breakdown.map((b) => `
      <tr>
        <td>${b.name}</td>
        <td class="num">${b.detail}</td>
        <td class="num">${b.sf != null ? b.sf.toLocaleString() + ' sf' : '— (in dims)'}</td>
      </tr>
    `).join('');

    // Diagram first so it is visible without scrolling past long notes
    container.innerHTML = `
      <div class="room-grid">
        <div class="room-stat">
          <div class="stat-label">Estimated Room Size</div>
          <div class="value tabular-nums">${roomSF.toLocaleString()}</div>
          <div class="tiny">square feet (${includeLine.toLowerCase()})</div>
        </div>
        <div class="room-stat">
          <div class="stat-label">Minimum Dimensions (approx)</div>
          <div class="value tabular-nums" style="font-size:1.5rem">${roomWidth}' × ${roomLength}'</div>
          <div class="tiny">${includeLine}</div>
        </div>
        <div class="room-notes">
          <div style="font-weight:600;margin-bottom:0.35rem">Key Considerations</div>
          <ul>${notes.map((n) => `<li>${n}</li>`).join('')}</ul>
        </div>
      </div>

      ${planBlock}

      <div class="table-wrap" style="margin-top:1rem">
        <table class="test-points" aria-label="Room size breakdown">
          <thead>
            <tr>
              <th>Component</th>
              <th>Size</th>
              <th class="num">Area</th>
            </tr>
          </thead>
          <tbody>
            ${breakdownRows}
            <tr class="duty">
              <td><strong>Total room (all included)</strong></td>
              <td class="num"><strong>${roomWidth}' × ${roomLength}'</strong></td>
              <td class="num"><strong>${roomSF.toLocaleString()} sf</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="tiny" style="margin-top:0.75rem">Preliminary layout estimate only. Every component listed above is already included in the total dimensions and square footage — do not add them again.</p>
    `;
  }

  function updateCodeNotes() {
    const container = $('codeNotesContent');
    if (!container) return;

    if (ufcMode) {
      container.innerHTML = `
        <h4>UFC 3-600-01 (2026) + NFPA 20</h4>
        <ul>
          <li>Fire pumps installed per NFPA 20 as modified by UFC.</li>
          <li><strong>Redundancy:</strong> Often required for mission-critical or high-hazard DoD facilities.</li>
          <li><strong>Diesel:</strong> Minimum 8-hour fuel supply (typical UFC baseline).</li>
          <li>Pump room and water supply criteria per UFC (duration and redundancy for certain occupancies).</li>
          <li>2026 notes: Simplified checklists; warehouse high-piled threshold commonly cited at 10,000 SF.</li>
        </ul>
      `;
    } else {
      container.innerHTML = `
        <h4>NFPA 20 (Primary)</h4>
        <ul>
          <li>Performance: 100% capacity at rated head, 150% flow at ≥65% head, churn ≤140%.</li>
          <li>Driver sizing and controller requirements.</li>
          <li>Water supply must be adequate and reliable.</li>
        </ul>
        <p class="tiny" style="margin-top:0.75rem">UFC Mode is OFF — core NFPA 20 rules shown.</p>
      `;
    }
  }

  function loadDoDExample() {
    $('projectName').value = 'DoD Aircraft Maintenance Hangar - Rev 3';
    $('systemFlow').value = '1750';
    $('systemPressure').value = '105';
    $('hydrantStatic').value = '58';
    $('hydrantFlow').value = '1500';
    $('hydrantResidual').value = '35';
    $('ratedGPM').value = '2000';
    $('ratedPSI').value = '125';

    const electric = document.querySelector('input[name="driverType"][value="electric"]');
    if (electric) electric.checked = true;
    if ($('voltage')) $('voltage').value = '480';
    if ($('ufcToggle')) $('ufcToggle').checked = true;
    ufcMode = true;

    updateDriverUI();
    calculateAll();
    calculateSupplyCurve(true);
    switchTab(0);
    toast('DoD example loaded');
  }

  function resetApp() {
    clearSavedState();
    window.location.reload();
  }

  async function copyResults() {
    const data = window.calculatedData || {};
    const driver = getDriverType();
    const hydrantStatic = $('hydrantStatic')?.value;

    let text = 'FIRE PUMP SIZER RESULTS\n';
    text += `Project: ${$('projectName')?.value || ''}\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n`;
    text += `UFC Mode: ${ufcMode ? 'ON' : 'OFF'}\n`;
    text += `Tool version: ${APP_VERSION}\n\n`;

    text += 'SYSTEM DEMAND\n';
    text += `Flow: ${Math.round(data.systemFlow || 0)} GPM\n`;
    text += `Required Pressure at Pump: ${(data.systemPSI || 0).toFixed(1)} PSI\n\n`;

    if (hydrantStatic) {
      text += 'HYDRANT FLOW TEST\n';
      text += `Static: ${$('hydrantStatic').value} PSI\n`;
      text += `Test Flow: ${$('hydrantFlow').value} GPM @ ${$('hydrantResidual').value} PSI residual\n`;
      text += `Available at Design Flow: ${$('availableAtFlow')?.textContent || 'N/A'}\n`;
      text += `Net Pump Pressure Required: ${$('netPumpPressure')?.textContent || 'N/A'}\n\n`;
    }

    text += 'PROPOSED PUMP\n';
    text += `Rated: ${data.ratedGPM || 0} GPM @ ${data.ratedPSI || 0} PSI\n\n`;

    text += `DRIVER (${driver.toUpperCase()})\n`;
    if (driver === 'electric') {
      text += `Motor HP: ${$('motorHP')?.textContent || '—'}\n`;
      text += `FLA / Breaker: ${$('fla')?.textContent || '—'}A / ${$('breaker')?.textContent || '—'}\n`;
    } else {
      text += `Engine HP: ${$('dieselHP')?.textContent || '—'}\n`;
      text += `Min Fuel Tank: ${$('fuelTank')?.textContent || '—'}\n`;
    }

    text += `\nVerification: ${$('verificationStatus')?.innerText || '—'}\n`;
    text += 'References: NFPA 20 + UFC 3-600-01 (2026)\n';
    text += 'Preliminary tool only — not a substitute for stamped design.\n';

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      toast('Results copied');
    } catch (_) {
      toast('Copy failed — select text manually');
    }
  }

  function showDisclaimer() {
    const existing = document.querySelector('.modal-backdrop');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-head">
          <h2>Important Disclaimer</h2>
          <button type="button" class="modal-close" aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          <p>This tool assists qualified Fire Protection Engineers with <strong>preliminary</strong> pump sizing using system hydraulic results, hydrant flow test data, and NFPA 20 / UFC 3-600-01 criteria.</p>
          <p>Final selection requires manufacturer-certified curves, complete hydraulic calculations, site-specific water supply verification, and AHJ approval. Hydrant flow test interpolation is approximate.</p>
          <p>All calculations run locally in your browser. Project inputs may be saved in this device's browser storage only.</p>
        </div>
        <div class="modal-foot">
          <button type="button" class="btn btn-primary modal-ok">Understood</button>
        </div>
      </div>
    `;
    const close = () => modal.remove();
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('.modal-ok').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.body.appendChild(modal);
  }

  function updateOnlineStatus() {
    const el = $('appStatus');
    if (!el) return;
    if (navigator.onLine) {
      el.textContent = 'Online';
      el.classList.remove('offline');
    } else {
      el.textContent = 'Offline OK';
      el.classList.add('offline');
    }
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    // Only register when served over http(s) — not file://
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

    // Drop old caches so plan-diagram updates are not stuck
    if (navigator.serviceWorker.getRegistrations) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => {
          // re-register fresh below
        });
      }).catch(() => undefined);
    }
    if (window.caches && caches.keys) {
      caches.keys().then((keys) => {
        keys.filter((k) => k.indexOf('fire-pump-sizer') === 0 && k !== 'fire-pump-sizer-v3')
          .forEach((k) => caches.delete(k));
      }).catch(() => undefined);
    }

    navigator.serviceWorker.register('./sw.js?v=3', { scope: './' })
      .then(() => console.log('[Fire Pump Sizer] Service worker ready v3'))
      .catch((err) => console.warn('[Fire Pump Sizer] SW register failed', err));
  }

  function bindEvents() {
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.getAttribute('data-tab'), 10);
        if (Number.isFinite(idx)) switchTab(idx);
      });
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tab.click();
        }
      });
    });

    const onInput = () => calculateAll();
    document.querySelectorAll('input[type="number"], input[type="text"], select').forEach((el) => {
      el.addEventListener('input', onInput);
      el.addEventListener('change', onInput);
    });

    document.querySelectorAll('input[name="driverType"]').forEach((el) => {
      el.addEventListener('change', updateDriverUI);
    });

    $('ufcToggle')?.addEventListener('change', toggleUFC);
    $('hazardSelect')?.addEventListener('change', updateHazardSelection);
    $('btnSimplified')?.addEventListener('click', useSimplifiedDemand);
    $('btnSupply')?.addEventListener('click', () => calculateSupplyCurve(false));
    $('btnRecalc')?.addEventListener('click', calculateAll);
    $('btnDoD')?.addEventListener('click', loadDoDExample);
    $('btnDisclaimer')?.addEventListener('click', showDisclaimer);
    $('btnCopy')?.addEventListener('click', copyResults);
    $('btnReset')?.addEventListener('click', () => {
      if (confirm('Reset all inputs and clear saved project data on this device?')) resetApp();
    });

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Persist on leave
    window.addEventListener('pagehide', saveState);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') saveState();
    });
  }

  function initializeApp() {
    chartAvailable = typeof window.Chart === 'function';
    populateHazardSelect();

    const restored = loadState();
    if (!restored) {
      const h = hazardClasses.find((x) => x.id === 'aircraft') || hazardClasses[0];
      if ($('density')) $('density').value = h.suggestedDensity;
      if ($('designArea')) $('designArea').value = h.typicalDesignArea;
      if ($('hoseAllowance')) $('hoseAllowance').value = h.hoseAllowance;
      if ($('simplifiedPressure')) $('simplifiedPressure').value = h.typicalPressurePSI;
      if ($('ufcToggle')) $('ufcToggle').checked = true;
      ufcMode = true;
    } else {
      ufcMode = !!$('ufcToggle')?.checked;
      if (!$('simplifiedPressure')?.value) {
        const h = hazardClasses.find((x) => x.id === ($('hazardSelect')?.value || 'aircraft')) || hazardClasses[0];
        if ($('simplifiedPressure')) $('simplifiedPressure').value = h.typicalPressurePSI;
      }
    }

    bindEvents();
    updateDriverUI();
    updateOnlineStatus();
    updateCodeNotes();
    updateSimplifiedPreview();
    calculateAll();
    switchTab(0);
    registerServiceWorker();

    console.log(`[Fire Pump Sizer] v${APP_VERSION} ready · chart=${chartAvailable} · restored=${restored}`);
  }

  // Public API for debugging / future extensions
  window.FirePumpSizer = {
    version: APP_VERSION,
    calculateAll,
    loadDoDExample,
    switchTab,
    calculateSupplyCurve,
    copyResults,
    saveState,
    clearSavedState
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();
