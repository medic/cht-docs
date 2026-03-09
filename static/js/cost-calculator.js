let debounceTimer = null;

const DEFAULTS = {
  DEPLOYMENT_AGE: 1,
  DISK_COST_PER_GB: 1,
  DOCS_PER_GB: 63566,
  DB_OVERPROVISION_FACTOR: 2,
  PLACES_PER_POP: 0.36,
  USERS_PER_CPU: 211,
  RAM_PER_CPU: 2,
  COST_PER_CPU_MONTH: 20.85,
};

const formatCurrency = (amount) => `$${amount.toFixed()}`;
const formatNumber = (num) => num.toLocaleString();
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const updateRangeMarker = (marker, value, minRange, maxRange, offset = 1.5) => {
  const clamped = clamp(value, minRange, maxRange);
  const pct = ((clamped - minRange) / (maxRange - minRange)) * 100;
  marker.style.left = `calc(${pct}% - ${offset}px)`;
};

const calculateMetrics = (els) => {
  const deploymentAge = Number.parseInt(els.deploymentAgeValue.value);
  const workflowCount = Number.parseInt(els.workflowCount.value);
  const populationCount = Number.parseInt(els.populationCount.value);
  const userCount = Number.parseInt(els.userCountInput.value);

  const dbOverprovisionFactor = Math.max(1, Number.parseFloat(els.dbOverprovision?.value || DEFAULTS.DB_OVERPROVISION_FACTOR));

  if (els.dbOverprovision) {
    els.dbOverprovision.value = dbOverprovisionFactor;
  }

  const placeCount = Math.floor(populationCount * DEFAULTS.PLACES_PER_POP);
  const contactCount = userCount + populationCount + placeCount;
  const reportCount = workflowCount * populationCount * deploymentAge;
  const totalDocCount = contactCount + reportCount;
  const diskUsedGb = totalDocCount / DEFAULTS.DOCS_PER_GB;
  const diskOverprovisionGb = diskUsedGb * (dbOverprovisionFactor - 1);
  const diskSizeGb = diskUsedGb + diskOverprovisionGb;
  const diskCost = DEFAULTS.DISK_COST_PER_GB * diskSizeGb;
  const cpuCount = Math.max(1, Math.ceil(userCount / DEFAULTS.USERS_PER_CPU));
  const ramGb = cpuCount * DEFAULTS.RAM_PER_CPU;
  const instanceCost = cpuCount * DEFAULTS.COST_PER_CPU_MONTH * 12;

  const totalCost = diskCost + instanceCost;
  const popPerUser = userCount > 0 ? populationCount / userCount : 0;
  const docsPerUser = userCount > 0 ? totalDocCount / userCount : 0;
  return {
    cpuCount, ramGb, instanceCost, diskUsedGb, diskOverprovisionGb, diskSizeGb,
    diskCost, totalCost, popPerUser, docsPerUser
  };
};

const updateCostPie = (els, metrics) => {
  if (!els.costPie) {
    return;
  }

  const total = metrics.instanceCost + metrics.diskCost;
  const instancePct = (metrics.instanceCost / total) * 100;
  const diskPct = (metrics.diskCost / total) * 100;

  const isDark = document.documentElement.classList.contains('dark');
  const instanceColor = isDark ? '#60a5fa' : 'var(--calc-link)';
  const diskColor = isDark ? '#34d399' : 'var(--calc-grad-start)';

  els.costPie.style.background = `conic-gradient(
    ${instanceColor} 0% ${instancePct}%,
    ${diskColor} ${instancePct}% 100%
  )`;

  if (els.costPctInstance) {
    els.costPctInstance.textContent = `${instancePct.toFixed()}%`;
  }
  if (els.costPctDisk) {
    els.costPctDisk.textContent = `${diskPct.toFixed()}%`;
  }
};

const updateOutputElements = (els) => () => {
  const m = calculateMetrics(els);

  els.totalCost.textContent = formatCurrency(m.totalCost);
  els.monthlyCost.textContent = formatCurrency(m.totalCost / 12);
  els.diskCost.textContent = formatCurrency(m.diskCost);
  els.instanceCost.textContent = formatCurrency(m.instanceCost);
  els.instanceCostMonthly.textContent = formatCurrency(m.instanceCost / 12);
  els.diskCostMonthly.textContent = formatCurrency(m.diskCost / 12);

  els.instanceCpu.textContent = `${m.cpuCount} CPU`;
  els.instanceRam.textContent = `${m.ramGb} GB RAM`;

  els.diskSize.textContent = `${m.diskSizeGb.toFixed()} GB`;
  els.diskUsed.textContent = `${m.diskUsedGb.toFixed()} GB`;
  els.diskOverprovision.textContent = `${m.diskOverprovisionGb.toFixed()} GB`;
  els.diskUsedBar.style.width = (m.diskUsedGb / m.diskSizeGb * 100) + '%';
  els.diskOverprovisionBar.style.width = (m.diskOverprovisionGb / m.diskSizeGb * 100) + '%';

  const userCount = Number.parseInt(els.userCountInput.value);
  const yearlyCostPerUser = userCount > 0 ? m.totalCost / userCount : 0;
  const monthlyCostPerUser = yearlyCostPerUser / 12;
  els.costPerUserYearly.textContent = `$${yearlyCostPerUser.toFixed(2)}`;
  els.costPerUser.textContent = `$${monthlyCostPerUser.toFixed(2)}`;

  els.popPerUser.textContent = m.popPerUser.toFixed();
  updateRangeMarker(els.popPerUserMarker, m.popPerUser, 1, 250);

  els.docsPerUser.textContent = formatNumber(Math.round(m.docsPerUser));
  updateRangeMarker(els.docsPerUserMarker, m.docsPerUser, 1, 20000);

  updateCostPie(els, m);
};

// Bidirectional sync between slider and number input
const addSliderWithInput = (slider, numberInput, updateOutputs) => {
  const min = Number.parseFloat(slider.min);
  const max = Number.parseFloat(slider.max);

  // Slider changes -> update number input
  slider.addEventListener('input', (e) => {
    numberInput.value = e.target.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateOutputs, 250);
  });

  // Number input changes -> update slider (clamped to range)
  numberInput.addEventListener('input', (e) => {
    slider.value = clamp(Number.parseFloat(e.target.value) || min, min, max);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateOutputs, 250);
  });

  // On blur, clamp the number input value to valid range
  numberInput.addEventListener('blur', (e) => {
    const val = clamp(Number.parseFloat(e.target.value) || min, min, max);
    e.target.value = val;
    slider.value = val;
    updateOutputs();
  });
};
const addAdvancedInput = (input, updateOutputs) => {
  const min = Number.parseFloat(input.min) || 1;
  const max = Number.parseFloat(input.max) || Infinity;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateOutputs, 250);
  });
  input.addEventListener('blur', (e) => {
    e.target.value = clamp(Number.parseFloat(e.target.value) || min, min, max);;
    updateOutputs();
  });
};

const attachListeners = (els, updateOutputs) => {

  addSliderWithInput(els.populationCount, els.populationCountValue, updateOutputs);
  addSliderWithInput(els.workflowCount, els.workflowCountValue, updateOutputs);
  addSliderWithInput(els.userCountInput, els.userCountInputValue, updateOutputs);

  addAdvancedInput(els.deploymentAgeValue, updateOutputs);
  addAdvancedInput(els.dbOverprovision, updateOutputs);

  // View toggles
  const toggle = (showAdvanced) => {
    els.basicParams.classList.toggle('hidden', showAdvanced);
    els.advancedParams.classList.toggle('hidden', !showAdvanced);
  };
  els.showAdvanced?.addEventListener('click', () => toggle(true));
  els.showBasic?.addEventListener('click', () => toggle(false));
  els.resetAdvanced?.addEventListener('click', () => {
    els.deploymentAgeValue.value = DEFAULTS.DEPLOYMENT_AGE;
    els.dbOverprovision.value = DEFAULTS.DB_OVERPROVISION_FACTOR;
    updateOutputs();
  });
};

const initCostCalculator = (calcId) => {

  const el = (id) => document.getElementById(`${id}-${calcId}`);

  const els = {
    // Basic parameters
    workflowCount: el('workflow-count'),
    workflowCountValue: el('workflow-count-value'),
    populationCount: el('population-count'),
    populationCountValue: el('population-count-value'),
    userCountInput: el('user-count-input'),
    userCountInputValue: el('user-count-input-value'),
    // Advanced parameters
    deploymentAgeValue: el('deployment-age-value'),
    dbOverprovision: el('db-overprovision'),
    resetAdvanced: el('reset-advanced'),
    // View toggles
    basicParams: el('basic-params'),
    advancedParams: el('advanced-params'),
    showAdvanced: el('show-advanced'),
    showBasic: el('show-basic'),
    // Outputs
    totalCost: el('total-cost'),
    monthlyCost: el('monthly-cost'),
    diskCost: el('disk-cost'),
    instanceCpu: el('instance-cpu'),
    instanceRam: el('instance-ram'),
    instanceCost: el('instance-cost'),
    diskSize: el('disk-size'),
    diskUsed: el('disk-used'),
    diskOverprovision: el('disk-overprovision'),
    diskUsedBar: el('disk-used-bar'),
    diskOverprovisionBar: el('disk-overprovision-bar'),
    popPerUser: el('pop-per-user'),
    popPerUserMarker: el('pop-per-user-marker'),
    docsPerUser: el('docs-per-user'),
    docsPerUserMarker: el('docs-per-user-marker'),
    costPerUserYearly: el('cost-per-user-yearly'),
    costPerUser: el('cost-per-user'),
    instanceCostMonthly: el('instance-cost-monthly'),
    diskCostMonthly: el('disk-cost-monthly'),
    costPie: el('cost-pie'),
    costPctInstance: el('cost-pct-instance'),
    costPctDisk: el('cost-pct-disk')
  };

  const updateOutputs = updateOutputElements(els);

  attachListeners(els, updateOutputs);

  // Dark mode observer to update colors
  new MutationObserver(() => updateOutputs())
    .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  updateOutputs();
}
