/**
 * CHT Cost Calculator
 * Interactive calculator for estimating CHT hosting costs
 */

function initCostCalculator(calcId) {
  // Constants
  const INSTANCES = [
    { name: 'EC2: t3.medium', ram: 4, cpu: 2, cost: 386.28, minLoad: 0, maxLoad: 13000 },
    { name: 'EC2: c6g.xlarge', ram: 8, cpu: 4, cost: 1263.24, minLoad: 13000, maxLoad: 25000 },
    { name: 'EC2: c6g.2xlarge', ram: 16, cpu: 8, cost: 2525.52, minLoad: 25000, maxLoad: 50000 },
    { name: 'EC2: c6g.4xlarge', ram: 32, cpu: 16, cost: 5051.04, minLoad: 50000, maxLoad: 100000 },
    { name: 'EC2: c6g.8xlarge', ram: 64, cpu: 32, cost: 10102.92, minLoad: 100000, maxLoad: 375000 }
  ];

  const DEFAULTS = {
    DISK_COST_PER_GB: 1.0,
    CONTACTS_PER_PLACE: 5,
    WORKFLOW_YEARLY_DOCS_PER_CONTACT: 12,
    DOCS_PER_GB: 12000,
    DB_OVERPROVISION_FACTOR: 2
  };

  // State
  let debounceTimer = null;
  let pieChart = null;

  // Helper: Get element by ID with calcId prefix
  const el = (id) => document.getElementById(`${id}-${calcId}`);

  // Helper: Get all elements
  const els = {
    // Basic parameters
    deploymentAge: el('deployment-age'),
    deploymentAgeValue: el('deployment-age-value'),
    workflowCount: el('workflow-count'),
    workflowCountValue: el('workflow-count-value'),
    populationCount: el('population-count'),
    populationCountValue: el('population-count-value'),
    userCountInput: el('user-count-input'),
    userCountInputValue: el('user-count-input-value'),
    // Advanced parameters
    contactsPerPlace: el('contacts-per-place'),
    workflowDocs: el('workflow-docs'),
    dbOverprovision: el('db-overprovision'),
    // View toggles
    basicParams: el('basic-params'),
    advancedParams: el('advanced-params'),
    showAdvanced: el('show-advanced'),
    showBasic: el('show-basic'),
    // Outputs
    totalCost: el('total-cost'),
    monthlyCost: el('monthly-cost'),
    diskCost: el('disk-cost'),
    instanceName: el('instance-name'),
    instanceSize: el('instance-size'),
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
    resourceUtil: el('resource-util'),
    resourceUtilMarker: el('resource-util-marker'),
    pieChartCanvas: el('cost-pie-chart'),
    loading: el('loading')
  };

  // Utilities
  const formatCurrency = (amount) => '$' + amount.toFixed(2);
  const formatNumber = (num) => num.toLocaleString('en-US');
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  // Helper: Update range marker position
  const updateRangeMarker = (marker, value, minRange, maxRange, offset = 1.5) => {
    const clamped = clamp(value, minRange, maxRange);
    const pct = ((clamped - minRange) / (maxRange - minRange)) * 100;
    marker.style.left = `calc(${pct}% - ${offset}px)`;
  };

  // Calculate all metrics
  function calculateMetrics() {
    const deploymentAge = parseInt(els.deploymentAge.value);
    const workflowCount = parseInt(els.workflowCount.value);
    const populationCount = parseInt(els.populationCount.value);
    const userCount = parseInt(els.userCountInput.value);

    // Get advanced parameters with validation
    const contactsPerPlace = Math.max(2, parseFloat(els.contactsPerPlace?.value || DEFAULTS.CONTACTS_PER_PLACE));
    const workflowDocsPerContact = Math.max(1, parseFloat(els.workflowDocs?.value || DEFAULTS.WORKFLOW_YEARLY_DOCS_PER_CONTACT));
    const dbOverprovisionFactor = Math.max(1, parseFloat(els.dbOverprovision?.value || DEFAULTS.DB_OVERPROVISION_FACTOR));

    // Update advanced input values if they exist
    if (els.contactsPerPlace) els.contactsPerPlace.value = contactsPerPlace;
    if (els.workflowDocs) els.workflowDocs.value = workflowDocsPerContact;
    if (els.dbOverprovision) els.dbOverprovision.value = dbOverprovisionFactor;

    // Core calculations
    const placeCount = Math.floor((populationCount - 1) / (contactsPerPlace - 1));
    const contactCount = placeCount * 2 + populationCount;
    const reportCount = workflowCount * workflowDocsPerContact * populationCount * deploymentAge;
    const totalDocCount = contactCount + reportCount;
    const diskUsedGb = totalDocCount / DEFAULTS.DOCS_PER_GB;
    const diskOverprovisionGb = diskUsedGb * (dbOverprovisionFactor - 1);
    const diskSizeGb = diskUsedGb + diskOverprovisionGb;
    const diskCost = DEFAULTS.DISK_COST_PER_GB * diskSizeGb;
    const loadFactor = userCount * workflowCount;

    // Select instance
    const instance = INSTANCES.find(inst => loadFactor >= inst.minLoad && loadFactor < inst.maxLoad) || INSTANCES.at(-1);

    // Derived metrics
    const totalCost = diskCost + instance.cost;
    const popPerUser = userCount > 0 ? populationCount / userCount : 0;
    const docsPerUser = userCount > 0 ? totalDocCount / userCount : 0;
    const resourceUtilizationPct = (loadFactor - instance.minLoad) / (instance.maxLoad - instance.minLoad);

    return {
      instance, diskUsedGb, diskOverprovisionGb, diskSizeGb, diskCost, totalCost,
      popPerUser, docsPerUser, resourceUtilizationPct
    };
  }

  // Update all displays
  function updateOutputs() {
    const m = calculateMetrics();

    // Costs
    els.totalCost.textContent = formatCurrency(m.totalCost);
    els.monthlyCost.textContent = formatCurrency(m.totalCost / 12);
    els.diskCost.textContent = formatCurrency(m.diskCost);
    els.instanceCost.textContent = formatCurrency(m.instance.cost);

    // Instance
    els.instanceName.textContent = m.instance.name;
    els.instanceSize.textContent = `${m.instance.ram} GB RAM + ${m.instance.cpu} CPU`;

    // Disk
    els.diskSize.textContent = m.diskSizeGb.toFixed(2) + ' GB';
    els.diskUsed.textContent = m.diskUsedGb.toFixed(2) + ' GB';
    els.diskOverprovision.textContent = m.diskOverprovisionGb.toFixed(2) + ' GB';
    els.diskUsedBar.style.width = (m.diskUsedGb / m.diskSizeGb * 100) + '%';
    els.diskOverprovisionBar.style.width = (m.diskOverprovisionGb / m.diskSizeGb * 100) + '%';

    // Visualizations
    els.popPerUser.textContent = m.popPerUser.toFixed(1);
    updateRangeMarker(els.popPerUserMarker, m.popPerUser, 1, 250);

    els.docsPerUser.textContent = formatNumber(Math.round(m.docsPerUser));
    updateRangeMarker(els.docsPerUserMarker, m.docsPerUser, 1, 20000);

    const utilPct = m.resourceUtilizationPct * 100;
    els.resourceUtil.textContent = utilPct.toFixed(1) + '%';
    updateRangeMarker(els.resourceUtilMarker, utilPct, 0, 100, 1);

    // Update chart
    updatePieChart(m);
  }

  // Update pie chart
  function updatePieChart(metrics) {
    if (!els.pieChartCanvas) return;

    const isDark = document.documentElement.classList.contains('dark');
    const colors = isDark ? ['#60a5fa', '#34d399'] : ['#3b82f6', '#10b981'];
    const textColor = isDark ? '#f9fafb' : '#1f2937';

    const data = {
      labels: ['Instance', 'Disk'],
      datasets: [{ data: [metrics.instance.cost, metrics.diskCost], backgroundColor: colors, borderWidth: 0 }]
    };

    if (pieChart) {
      pieChart.data = data;
      pieChart.options.plugins.legend.labels.color = textColor;
      pieChart.update('none');
    } else {
      pieChart = new Chart(els.pieChartCanvas, {
        type: 'pie',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom', labels: { color: textColor, padding: 15, font: { size: 12 } } },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = ((ctx.parsed / total) * 100).toFixed(1);
                  return `${ctx.label}: ${formatCurrency(ctx.parsed)} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    }
  }

  // Attach event listeners
  function attachListeners() {
    // Helper: Attach slider listener
    const addSlider = (input, display, formatter = (v) => v) => {
      input.addEventListener('input', (e) => {
        display.textContent = formatter(e.target.value);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateOutputs, 250);
      });
    };

    addSlider(els.deploymentAge, els.deploymentAgeValue);
    addSlider(els.workflowCount, els.workflowCountValue);
    addSlider(els.populationCount, els.populationCountValue, (v) => formatNumber(parseInt(v)));
    addSlider(els.userCountInput, els.userCountInputValue, (v) => formatNumber(parseInt(v)));

    // Advanced parameters
    [els.contactsPerPlace, els.workflowDocs, els.dbOverprovision].forEach(el => {
      el?.addEventListener('input', updateOutputs);
    });

    // View toggles
    const toggle = (showAdvanced) => {
      els.basicParams.style.display = showAdvanced ? 'none' : 'block';
      els.advancedParams.style.display = showAdvanced ? 'block' : 'none';
    };
    els.showAdvanced?.addEventListener('click', () => toggle(true));
    els.showBasic?.addEventListener('click', () => toggle(false));
  }

  // Load Chart.js and initialize
  const loadChartJS = () => {
    if (typeof Chart !== 'undefined') return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      script.integrity = 'sha256-6UWtgTSKKPXhqKgDHb2lWjX6RZxQqfSP4rN0vK91Y14=';
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = () => {
        const fallback = document.createElement('script');
        fallback.src = 'https://unpkg.com/chart.js@4.4.0/dist/chart.umd.js';
        fallback.onload = resolve;
        fallback.onerror = reject;
        document.head.appendChild(fallback);
      };
      document.head.appendChild(script);
    });
  };

  // Initialize
  if (els.loading) els.loading.style.display = 'block';

  loadChartJS()
    .then(() => {
      if (els.loading) els.loading.style.display = 'none';
      attachListeners();
      // Dark mode observer
      new MutationObserver(() => pieChart && updateOutputs())
        .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      updateOutputs();
    })
    .catch((error) => {
      if (els.loading) els.loading.textContent = 'Error loading Chart.js. Calculator will work without charts.';
      console.error('Failed to load Chart.js:', error);
      attachListeners();
      updateOutputs();
    });
}
