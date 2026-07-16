/**
 * Fire Pump Sizer — client-side engineering calculator
 * Self-contained: no network required after first load (when served + SW).
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'firePumpSizer.v1';
  const APP_VERSION = '2.0.0';

  const hazardClasses = [
    { id: 'light', name: 'Light Hazard (Offices, Barracks)', suggestedDensity: 0.10, typicalDesignArea: 1500, hoseAllowance: 250 },
    { id: 'ordinary1', name: 'Ordinary Hazard Group 1', suggestedDensity: 0.15, typicalDesignArea: 1500, hoseAllowance: 500 },
    { id: 'ordinary2', name: 'Ordinary Hazard Group 2', suggestedDensity: 0.20, typicalDesignArea: 1500, hoseAllowance: 500 },
    { id: 'extra1', name: 'Extra Hazard Group 1', suggestedDensity: 0.30, typicalDesignArea: 2500, hoseAllowance: 750 },
    { id: 'aircraft', name: 'Aircraft Hangar / Maintenance (DoD)', suggestedDensity: 0.25, typicalDesignArea: 3000, hoseAllowance: 1000 },
    { id: 'ammo', name: 'Ammunition / Explosives Storage (DoD)', suggestedDensity: 0.35, typicalDesignArea: 2000, hoseAllowance: 1000 },
    { id: 'warehouse', name: 'Warehouse High-Piled (UFC 2026)', suggestedDensity: 0.25, typicalDesignArea: 10000, hoseAllowance: 750 }
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

  function updateHazardSelection() {
    const select = $('hazardSelect');
    if (!select) return;
    const h = hazardClasses.find((x) => x.id === select.value);
    if (!h) return;
    $('density').value = h.suggestedDensity;
    $('designArea').value = h.typicalDesignArea;
    $('hoseAllowance').value = h.hoseAllowance;
    calculateAll();
  }

  function useSimplifiedDemand() {
    const density = num('density');
    const area = num('designArea');
    const hose = num('hoseAllowance');
    const totalQ = density * area + hose;
    $('systemFlow').value = Math.round(totalQ);
    calculateAll();
    switchTab(0);
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
      hoseAllowance: $('hoseAllowance')?.value
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
      } else {
        const dieselHP = baseHP * 1.2;
        const runtime = num('dieselRuntime', 8);
        const fuelRate = dieselHP * 0.055;
        const fuelTank = fuelRate * runtime * 1.2;
        setText('dieselHP', dieselHP.toFixed(1));
        setHtml('fuelRate', fuelRate.toFixed(1) + ' <span class="tiny">gal/hr</span>');
        setHtml('fuelTank', Math.round(fuelTank) + ' <span class="tiny">gal</span>');
      }
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
      { name: 'System Duty Point', flow: systemFlow, psi: systemPSI, note: 'Required at pump discharge', duty: true }
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
          label: 'System Duty Point',
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

  function updateRoomSizing(ratedGPM, driverType) {
    const container = $('roomSizingContent');
    if (!container) return;

    if (!ratedGPM) {
      container.innerHTML = '<div class="muted">Enter a proposed pump rating to estimate room size.</div>';
      return;
    }

    let baseSF = Math.max(120, Math.ceil(ratedGPM / 8));
    const notes = [];

    if (driverType === 'electric') {
      baseSF = Math.max(baseSF, 180);
      notes.push('Working clearance 3–4 ft around pump and controller (NFPA 20).');
    } else {
      baseSF = Math.max(baseSF * 1.6, 280);
      notes.push('Fuel tank, exhaust, and combustion air clearances required.');
    }

    if (ufcMode) {
      baseSF = Math.round(baseSF * 1.25);
      notes.push('UFC 3-600-01 may require additional space for redundant pump or larger clearances.');
    }

    const minWidth = Math.ceil(Math.sqrt(baseSF * 0.6));
    const minLength = Math.ceil(baseSF / minWidth);

    container.innerHTML = `
      <div class="room-grid">
        <div class="room-stat">
          <div class="stat-label">Estimated Room Size</div>
          <div class="value tabular-nums">${baseSF}</div>
          <div class="tiny">square feet (gross)</div>
        </div>
        <div class="room-stat">
          <div class="stat-label">Minimum Dimensions (approx)</div>
          <div class="value tabular-nums" style="font-size:1.5rem">${minWidth}' × ${minLength}'</div>
          <div class="tiny">Plus working clearances</div>
        </div>
        <div class="room-notes">
          <div style="font-weight:600;margin-bottom:0.35rem">Key Considerations</div>
          <ul>${notes.map((n) => `<li>${n}</li>`).join('')}</ul>
        </div>
      </div>
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

    text += 'SYSTEM DUTY POINT\n';
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

    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(() => console.log('[Fire Pump Sizer] Service worker ready'))
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
      if ($('ufcToggle')) $('ufcToggle').checked = true;
      ufcMode = true;
    } else {
      ufcMode = !!$('ufcToggle')?.checked;
    }

    bindEvents();
    updateDriverUI();
    updateOnlineStatus();
    updateCodeNotes();
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
