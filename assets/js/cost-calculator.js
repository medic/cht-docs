const DEFAULTS = {
  DISK_COST_PER_GB_YEAR: 0.96,
  MEDIC_DOCS_PER_GB: 186089,
  PLACES_PER_POP: 0.36,
  USERS_PER_CPU: 288,
  RAM_PER_CPU: 2,
  COST_PER_CPU_MONTH: 20.85,
  DOCS_PER_POP_WORKFLOW_YEAR: 1,
  ROOT_VOLUME_GB: 50
};

const UI_CONSTANTS = {
  POP_PER_USER_BAR_MAX: 250,
  DOCS_PER_USER_BAR_MAX: 20000,
  POPULATION: { value: 100000, min: 1000, max: 2000000, step: 1000 },
  WORKFLOWS: { value: 10, min: 1, max: 40, step: 1 },
  USERS: { value: 1000, min: 10, max: 15000, step: 10 },
  DEPLOYMENT_AGE: { value: 1, min: 1, max: 10 },
  DB_OVERPROVISION: { value: 5, min: 1, max: 10 },
};

const formatCurrency = (amount, opts = {}) => amount.toLocaleString(navigator.language, {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0, ...opts
});
const formatNumber = (num) => num.toLocaleString(navigator.language);
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const debouncedUpdate = (fn, delay = 250) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};

// Colors match CSS variables --calc-grad-start/mid/end
const lerpColor = (a, b, t) => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];
const gradientColor = (pct) => {
  const green = [16, 185, 129];
  const amber = [245, 158, 11];
  const red = [239, 68, 68];
  if (pct <= 50) {
    return lerpColor(green, amber, pct / 50);
  }
  return lerpColor(amber, red, (pct - 50) / 50);
};

const updateRangeMarker = (marker, value, minRange, maxRange, offset = 1.5) => {
  const clamped = clamp(value, minRange, maxRange);
  const pct = ((clamped - minRange) / (maxRange - minRange)) * 100;
  marker.style.left = `calc(${pct}% - ${offset}px)`;
  return pct;
};

const calculateMetrics = (els) => {
  const deploymentAge = Number.parseInt(els.deploymentAgeValue.value);
  const workflowCount = Number.parseInt(els.workflowCount.value);
  const populationCount = Number.parseInt(els.populationCount.value);
  const userCount = Number.parseInt(els.userCountInput.value);
  const dbOverprovisionFactor = Math.max(
    1,
    Number.parseInt(els.dbOverprovision?.value || UI_CONSTANTS.DB_OVERPROVISION.value)
  );
  const placeCount = Math.floor(populationCount * DEFAULTS.PLACES_PER_POP);
  const contactCount = userCount + populationCount + placeCount;
  const reportCount = workflowCount * populationCount * deploymentAge * DEFAULTS.DOCS_PER_POP_WORKFLOW_YEAR;
  const totalDocCount = contactCount + reportCount;
  const dbDiskGb = Math.max(1, Math.ceil(totalDocCount / DEFAULTS.MEDIC_DOCS_PER_GB));
  const diskOverprovisionGb = dbDiskGb * dbOverprovisionFactor;
  const rootVolumeGb = DEFAULTS.ROOT_VOLUME_GB;
  const diskSizeGb = dbDiskGb + diskOverprovisionGb + rootVolumeGb;
  const diskCost = DEFAULTS.DISK_COST_PER_GB_YEAR * diskSizeGb;
  const cpuCount = Math.max(1, Math.ceil(userCount / DEFAULTS.USERS_PER_CPU));
  const ramGb = cpuCount * DEFAULTS.RAM_PER_CPU;
  const instanceCost = cpuCount * DEFAULTS.COST_PER_CPU_MONTH * 12;
  const totalCost = diskCost + instanceCost;
  const popPerUser = userCount > 0 ? populationCount / userCount : 0;
  const docsPerUser = userCount > 0 ? totalDocCount / userCount : 0;
  return {
    cpuCount, ramGb, instanceCost, dbDiskGb, diskOverprovisionGb, rootVolumeGb, diskSizeGb,
    diskCost, totalCost, totalDocCount, popPerUser, docsPerUser, dbOverprovisionFactor, userCount
  };
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

  els.diskSize.textContent = `${formatNumber(Math.round(m.diskSizeGb))} GB Disk`;
  els.diskSize.title = `Docs in medic DB: ${formatNumber(m.totalDocCount)}`;
  els.dbDisk.textContent = `${formatNumber(m.dbDiskGb)} GB`;
  els.diskOverprovision.textContent = `${formatNumber(m.diskOverprovisionGb)} GB`;
  els.rootVolume.textContent = `${formatNumber(m.rootVolumeGb)} GB`;
  els.dbDiskBar.style.width = (m.dbDiskGb / m.diskSizeGb * 100) + '%';
  els.diskOverprovisionBar.style.width = (m.diskOverprovisionGb / m.diskSizeGb * 100) + '%';
  els.rootVolumeBar.style.width = (m.rootVolumeGb / m.diskSizeGb * 100) + '%';

  const yearlyCostPerUser = m.userCount > 0 ? m.totalCost / m.userCount : 0;
  const monthlyCostPerUser = yearlyCostPerUser / 12;
  els.costPerUserYearly.textContent = formatCurrency(
    yearlyCostPerUser,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );
  els.costPerUser.textContent = formatCurrency(
    monthlyCostPerUser,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );

  els.popPerUser.textContent = m.popPerUser.toFixed();
  const popPct = updateRangeMarker(els.popPerUserMarker, m.popPerUser, 1, UI_CONSTANTS.POP_PER_USER_BAR_MAX);
  const [pr, pg, pb] = gradientColor(popPct);
  els.popPerUser.style.color = `rgb(${pr}, ${pg}, ${pb})`;

  els.docsPerUser.textContent = formatNumber(Math.round(m.docsPerUser));
  const docsPct = updateRangeMarker(els.docsPerUserMarker, m.docsPerUser, 1, UI_CONSTANTS.DOCS_PER_USER_BAR_MAX);
  const [dr, dg, db] = gradientColor(docsPct);
  els.docsPerUser.style.color = `rgb(${dr}, ${dg}, ${db})`;

  // Pie chart: set percentage custom property, CSS handles colors
  if (els.costPie) {
    const instancePct = (m.instanceCost / (m.instanceCost + m.diskCost)) * 100;
    els.costPie.style.setProperty('--instance-pct', instancePct);
    if (els.costPctInstance) {
      els.costPctInstance.textContent = `${instancePct.toFixed()}%`;
    }
    if (els.costPctDisk) {
      els.costPctDisk.textContent = `${(100 - instancePct).toFixed()}%`;
    }
  }

  els.dbOverprovision.value = m.dbOverprovisionFactor;
};

const applyInputConfig = ({ value, ...attrs }, ...inputs) => {
  for (const input of inputs) {
    Object.assign(input, attrs);
    input.value = value;
  }
};

const addSliderWithInput = (slider, numberInput, debounced, updateOutputs) => {
  const min = Number.parseInt(slider.min);
  const max = Number.parseInt(slider.max);
  slider.addEventListener('input', (e) => {
    numberInput.value = e.target.value;
    debounced();
  });
  numberInput.addEventListener('input', (e) => {
    slider.value = clamp(Number.parseInt(e.target.value) || min, min, max);
    debounced();
  });
  numberInput.addEventListener('blur', (e) => {
    const val = clamp(Number.parseInt(e.target.value) || min, min, max);
    e.target.value = val;
    slider.value = val;
    updateOutputs();
  });
};

const addAdvancedInput = (input, debounced, updateOutputs) => {
  const min = Number.parseInt(input.min) || 1;
  const max = Number.parseInt(input.max) || Infinity;
  input.addEventListener('input', () => debounced());
  input.addEventListener('blur', (e) => {
    e.target.value = clamp(Number.parseInt(e.target.value) || min, min, max);
    updateOutputs();
  });
};

const attachListeners = (els, debounced, updateOutputs) => {
  addSliderWithInput(els.populationCount, els.populationCountValue, debounced, updateOutputs);
  addSliderWithInput(els.workflowCount, els.workflowCountValue, debounced, updateOutputs);
  addSliderWithInput(els.userCountInput, els.userCountInputValue, debounced, updateOutputs);

  addAdvancedInput(els.deploymentAgeValue, debounced, updateOutputs);
  addAdvancedInput(els.dbOverprovision, debounced, updateOutputs);

  const toggleParameters = (showAdvanced) => {
    els.basicParams.classList.toggle('calc-hidden', showAdvanced);
    els.advancedParams.classList.toggle('calc-hidden', !showAdvanced);
  };
  els.showAdvanced?.addEventListener('click', () => toggleParameters(true));
  els.showBasic?.addEventListener('click', () => toggleParameters(false));
  els.resetAdvanced?.addEventListener('click', () => {
    els.deploymentAgeValue.value = UI_CONSTANTS.DEPLOYMENT_AGE.value;
    els.dbOverprovision.value = UI_CONSTANTS.DB_OVERPROVISION.value;
    updateOutputs();
  });
};

const initCostCalculator = (calcId) => {
  const container = document.getElementById(`calc-container-${calcId}`);
  const el = (name) => container.querySelector(`[data-calc="${name}"]`);

  const els = {
    workflowCount: el('workflow-count'),
    workflowCountValue: el('workflow-count-value'),
    populationCount: el('population-count'),
    populationCountValue: el('population-count-value'),
    userCountInput: el('user-count-input'),
    userCountInputValue: el('user-count-input-value'),
    deploymentAgeValue: el('deployment-age-value'),
    dbOverprovision: el('db-overprovision'),
    resetAdvanced: el('reset-advanced'),
    basicParams: el('basic-params'),
    advancedParams: el('advanced-params'),
    showAdvanced: el('show-advanced'),
    showBasic: el('show-basic'),
    totalCost: el('total-cost'),
    monthlyCost: el('monthly-cost'),
    diskCost: el('disk-cost'),
    instanceCpu: el('instance-cpu'),
    instanceRam: el('instance-ram'),
    instanceCost: el('instance-cost'),
    diskSize: el('disk-size'),
    dbDisk: el('db-disk'),
    diskOverprovision: el('disk-overprovision'),
    rootVolume: el('root-volume'),
    dbDiskBar: el('db-disk-bar'),
    diskOverprovisionBar: el('disk-overprovision-bar'),
    rootVolumeBar: el('root-volume-bar'),
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

  applyInputConfig(UI_CONSTANTS.POPULATION, els.populationCount, els.populationCountValue);
  applyInputConfig(UI_CONSTANTS.WORKFLOWS, els.workflowCount, els.workflowCountValue);
  applyInputConfig(UI_CONSTANTS.USERS, els.userCountInput, els.userCountInputValue);
  applyInputConfig(UI_CONSTANTS.DEPLOYMENT_AGE, els.deploymentAgeValue);
  applyInputConfig(UI_CONSTANTS.DB_OVERPROVISION, els.dbOverprovision);

  const updateOutputs = updateOutputElements(els);
  const debounced = debouncedUpdate(updateOutputs);

  attachListeners(els, debounced, updateOutputs);
  updateOutputs();
};
