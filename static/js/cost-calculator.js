/**
 * CHT Cost Calculator
 * Interactive calculator for estimating CHT hosting costs
 */

// Initialize the calculator for a given container ID
function initCostCalculator(calcId) {
  // Load Chart.js from CDN
  const loadChartJS = () => {
    return new Promise((resolve, reject) => {
      if (typeof Chart !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      script.integrity = 'sha256-6UWtgTSKKPXhqKgDHb2lWjX6RZxQqfSP4rN0vK91Y14=';
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = () => {
        // Fallback to unpkg
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://unpkg.com/chart.js@4.4.0/dist/chart.umd.js';
        fallbackScript.onload = resolve;
        fallbackScript.onerror = reject;
        document.head.appendChild(fallbackScript);
      };
      document.head.appendChild(script);
    });
  };

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
  let pieChart = null;

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
    diskSize: document.getElementById(`disk-size-${calcId}`),

    // Chart elements
    pieChartCanvas: document.getElementById(`cost-pie-chart-${calcId}`),
    loading: document.getElementById(`loading-${calcId}`)
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

  function getChartColors() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      return {
        colors: ['#60a5fa', '#34d399'],
        text: '#f9fafb',
        grid: '#374151'
      };
    } else {
      return {
        colors: ['#3b82f6', '#10b981'],
        text: '#1f2937',
        grid: '#e5e7eb'
      };
    }
  }

  function updatePieChart(metrics) {
    if (!els.pieChartCanvas) return;

    const colors = getChartColors();

    const data = {
      labels: ['Instance', 'Disk'],
      datasets: [{
        data: [metrics.instance.cost, metrics.diskCost],
        backgroundColor: colors.colors,
        borderWidth: 0
      }]
    };

    if (pieChart) {
      pieChart.data = data;
      pieChart.options.plugins.legend.labels.color = colors.text;
      pieChart.update('none');
    } else {
      pieChart = new Chart(els.pieChartCanvas, {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: colors.text,
                padding: 15,
                font: { size: 12 }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = formatCurrency(context.parsed);
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percent = ((context.parsed / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percent}%)`;
                }
              }
            }
          }
        }
      });
    }
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
    els.diskSize.textContent = metrics.diskSizeGb.toFixed(2) + ' GB';

    // Update pie chart
    if (pieChart || els.pieChartCanvas) {
      updatePieChart(metrics);
    }
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

  // Dark mode observer
  function setupDarkModeObserver() {
    const observer = new MutationObserver(() => {
      if (pieChart) {
        updateOutputs();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Initialize
  if (els.loading) {
    els.loading.style.display = 'block';
  }

  loadChartJS()
    .then(() => {
      if (els.loading) {
        els.loading.style.display = 'none';
      }
      attachListeners();
      setupDarkModeObserver();
      updateOutputs();
    })
    .catch((error) => {
      if (els.loading) {
        els.loading.textContent = 'Error loading Chart.js. Calculator will work without charts.';
      }
      console.error('Failed to load Chart.js:', error);
      // Still initialize without charts
      attachListeners();
      updateOutputs();
    });
}
