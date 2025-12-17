/**
 * CHT Cost Calculator
 * Interactive calculator for estimating CHT hosting costs
 */

// Initialize the calculator for a given container ID
function initCostCalculator(calcId) {
  // Constants
  const INSTANCES = [
    { name: 't3.medium', ram: 4, cpu: 2, cost: 386.28, minLoad: 0, maxLoad: 2500 },
    { name: 'c6g.xlarge', ram: 8, cpu: 4, cost: 1263.24, minLoad: 2500, maxLoad: 5000 },
    { name: 'c6g.2xlarge', ram: 16, cpu: 8, cost: 2525.52, minLoad: 5000, maxLoad: 10000 },
    { name: 'c6g.4xlarge', ram: 32, cpu: 16, cost: 5051.04, minLoad: 10000, maxLoad: 20000 },
    { name: 'c6g.8xlarge', ram: 64, cpu: 32, cost: 10102.92, minLoad: 20000, maxLoad: Infinity }
  ];

  const DISK_COST_PER_GB = 1.0;

  // State
  let debounceTimer = null;

  // Get elements
  const els = {
    deploymentAge: document.getElementById(`deployment-age-${calcId}`),
    deploymentAgeValue: document.getElementById(`deployment-age-value-${calcId}`),
    workflowCount: document.getElementById(`workflow-count-${calcId}`),
    workflowCountValue: document.getElementById(`workflow-count-value-${calcId}`),
    populationCount: document.getElementById(`population-count-${calcId}`),
    populationCountValue: document.getElementById(`population-count-value-${calcId}`),

    // Output elements
    totalCost: document.getElementById(`total-cost-${calcId}`),
    diskCost: document.getElementById(`disk-cost-${calcId}`),
    instanceName: document.getElementById(`instance-name-${calcId}`),
    instanceSize: document.getElementById(`instance-size-${calcId}`),
    instanceCost: document.getElementById(`instance-cost-${calcId}`),
    userCount: document.getElementById(`user-count-${calcId}`),
    contactCount: document.getElementById(`contact-count-${calcId}`),
    reportCount: document.getElementById(`report-count-${calcId}`),
    placeCount: document.getElementById(`place-count-${calcId}`),
    totalDocCount: document.getElementById(`total-doc-count-${calcId}`),
    diskSize: document.getElementById(`disk-size-${calcId}`),
    loadFactor: document.getElementById(`load-factor-${calcId}`)
  };

  // Calculation functions
  function calculateMetrics() {
    const deploymentAge = parseInt(els.deploymentAge.value);
    const workflowCount = parseInt(els.workflowCount.value);
    const populationCount = parseInt(els.populationCount.value);

    // Calculate derived values
    const placeCount = Math.floor((populationCount - 1) / (5 - 1));
    const contactCount = placeCount * 2 + populationCount;
    const reportCount = workflowCount * 12 * populationCount * deploymentAge;
    const totalDocCount = contactCount + reportCount;
    const diskSizeGb = (totalDocCount / 10000) * 5;
    const diskCost = DISK_COST_PER_GB * diskSizeGb;
    const userCount = Math.floor(populationCount / 200);
    const loadFactor = userCount * workflowCount;

    // Select appropriate instance
    const instance = INSTANCES.find(inst =>
      loadFactor >= inst.minLoad && loadFactor < inst.maxLoad
    ) || INSTANCES[INSTANCES.length - 1];

    const totalCost = diskCost + instance.cost;

    return {
      deploymentAge,
      workflowCount,
      populationCount,
      placeCount,
      contactCount,
      reportCount,
      totalDocCount,
      diskSizeGb,
      diskCost,
      userCount,
      loadFactor,
      instance,
      totalCost
    };
  }

  function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
  }

  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  // Update displays
  function updateOutputs() {
    const metrics = calculateMetrics();

    // Update all output fields
    els.totalCost.textContent = formatCurrency(metrics.totalCost);
    els.diskCost.textContent = formatCurrency(metrics.diskCost);
    els.instanceName.textContent = metrics.instance.name;
    els.instanceSize.textContent = `${metrics.instance.ram} GB RAM + ${metrics.instance.cpu} CPU`;
    els.instanceCost.textContent = formatCurrency(metrics.instance.cost);
    els.userCount.textContent = formatNumber(metrics.userCount);
    els.contactCount.textContent = formatNumber(metrics.contactCount);
    els.reportCount.textContent = formatNumber(metrics.reportCount);

    // Additional calculated values
    if (els.placeCount) els.placeCount.textContent = formatNumber(metrics.placeCount);
    if (els.totalDocCount) els.totalDocCount.textContent = formatNumber(metrics.totalDocCount);
    if (els.diskSize) els.diskSize.textContent = metrics.diskSizeGb.toFixed(2) + ' GB';
    if (els.loadFactor) els.loadFactor.textContent = formatNumber(metrics.loadFactor);
  }

  function debouncedUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateOutputs, 250);
  }

  // Event listeners
  function attachListeners() {
    // Deployment age slider
    els.deploymentAge.addEventListener('input', (e) => {
      els.deploymentAgeValue.textContent = e.target.value;
      debouncedUpdate();
    });

    // Workflow count slider
    els.workflowCount.addEventListener('input', (e) => {
      els.workflowCountValue.textContent = e.target.value;
      debouncedUpdate();
    });

    // Population count slider
    els.populationCount.addEventListener('input', (e) => {
      els.populationCountValue.textContent = formatNumber(parseInt(e.target.value));
      debouncedUpdate();
    });
  }

  // Initialize
  attachListeners();
  updateOutputs();
}
