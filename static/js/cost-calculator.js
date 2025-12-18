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
    { name: 'EC2: t3.medium', ram: 4, cpu: 2, cost: 386.28, minLoad: 0, maxLoad: 13000 },
    { name: 'EC2: c6g.xlarge', ram: 8, cpu: 4, cost: 1263.24, minLoad: 13000, maxLoad: 25000 },
    { name: 'EC2: c6g.2xlarge', ram: 16, cpu: 8, cost: 2525.52, minLoad: 25000, maxLoad: 50000 },
    { name: 'EC2: c6g.4xlarge', ram: 32, cpu: 16, cost: 5051.04, minLoad: 50000, maxLoad: 100000 },
    { name: 'EC2: c6g.8xlarge', ram: 64, cpu: 32, cost: 10102.92, minLoad: 100000, maxLoad: 375000 }
  ];

  const DISK_COST_PER_GB = 1.0;
  const CONTACTS_PER_PLACE = 5;
  const WORKFLOW_YEARLY_DOCS_PER_CONTACT = 12;
  const DOCS_PER_GB = 12000;
  const DB_OVERPROVISION_FACTOR = 2;

  // State
  let debounceTimer = null;
  let pieChart = null;

  // Get elements
  const els = {
    // Basic parameters
    deploymentAge: document.getElementById(`deployment-age-${calcId}`),
    deploymentAgeValue: document.getElementById(`deployment-age-value-${calcId}`),
    workflowCount: document.getElementById(`workflow-count-${calcId}`),
    workflowCountValue: document.getElementById(`workflow-count-value-${calcId}`),
    populationCount: document.getElementById(`population-count-${calcId}`),
    populationCountValue: document.getElementById(`population-count-value-${calcId}`),
    userCountInput: document.getElementById(`user-count-input-${calcId}`),
    userCountInputValue: document.getElementById(`user-count-input-value-${calcId}`),

    // Advanced parameters
    contactsPerPlace: document.getElementById(`contacts-per-place-${calcId}`),
    workflowDocs: document.getElementById(`workflow-docs-${calcId}`),
    dbOverprovision: document.getElementById(`db-overprovision-${calcId}`),

    // View toggles
    basicParams: document.getElementById(`basic-params-${calcId}`),
    advancedParams: document.getElementById(`advanced-params-${calcId}`),
    showAdvanced: document.getElementById(`show-advanced-${calcId}`),
    showBasic: document.getElementById(`show-basic-${calcId}`),

    // Output elements
    totalCost: document.getElementById(`total-cost-${calcId}`),
    diskCost: document.getElementById(`disk-cost-${calcId}`),
    instanceName: document.getElementById(`instance-name-${calcId}`),
    instanceSize: document.getElementById(`instance-size-${calcId}`),
    instanceCost: document.getElementById(`instance-cost-${calcId}`),
    diskSize: document.getElementById(`disk-size-${calcId}`),
    diskUsed: document.getElementById(`disk-used-${calcId}`),
    diskOverprovision: document.getElementById(`disk-overprovision-${calcId}`),
    diskUsedBar: document.getElementById(`disk-used-bar-${calcId}`),
    diskOverprovisionBar: document.getElementById(`disk-overprovision-bar-${calcId}`),
    popPerUser: document.getElementById(`pop-per-user-${calcId}`),
    popPerUserMarker: document.getElementById(`pop-per-user-marker-${calcId}`),
    docsPerUser: document.getElementById(`docs-per-user-${calcId}`),
    docsPerUserMarker: document.getElementById(`docs-per-user-marker-${calcId}`),
    resourceUtil: document.getElementById(`resource-util-${calcId}`),
    resourceUtilMarker: document.getElementById(`resource-util-marker-${calcId}`),

    // Chart elements
    pieChartCanvas: document.getElementById(`cost-pie-chart-${calcId}`),
    loading: document.getElementById(`loading-${calcId}`)
  };

  // Calculation functions
  function calculateMetrics() {
    const deploymentAge = parseInt(els.deploymentAge.value);
    const workflowCount = parseInt(els.workflowCount.value);
    const populationCount = parseInt(els.populationCount.value);

    // Get advanced parameters (use custom values if available, otherwise use defaults)
    const contactsPerPlace = els.contactsPerPlace ? Math.max(2, Number.parseFloat(els.contactsPerPlace.value)) : CONTACTS_PER_PLACE;
    els.contactsPerPlace.value = contactsPerPlace;
    const workflowDocsPerContact = els.workflowDocs ? Math.max(1, Number.parseFloat(els.workflowDocs.value)) : WORKFLOW_YEARLY_DOCS_PER_CONTACT;
    els.workflowDocs.value = workflowDocsPerContact;
    const dbOverprovisionFactor = els.dbOverprovision ? Math.max(1, Number.parseFloat(els.dbOverprovision.value)) : DB_OVERPROVISION_FACTOR;
    els.dbOverprovision.value = dbOverprovisionFactor;

    // Calculate derived values
    const placeCount = Math.floor((populationCount - 1) / (contactsPerPlace - 1));
    const contactCount = placeCount * 2 + populationCount;
    const reportCount = workflowCount * workflowDocsPerContact * populationCount * deploymentAge;
    const totalDocCount = contactCount + reportCount;
    const diskUsedGb = totalDocCount / DOCS_PER_GB;
    const diskOverprovisionGb = (diskUsedGb * dbOverprovisionFactor) - diskUsedGb;
    const diskSizeGb = diskUsedGb + diskOverprovisionGb;
    const diskCost = DISK_COST_PER_GB * diskSizeGb;
    const userCount = parseInt(els.userCountInput.value);
    const loadFactor = userCount * workflowCount;

    // Select appropriate instance
    const instance = INSTANCES.find(inst =>
      loadFactor >= inst.minLoad && loadFactor < inst.maxLoad
    ) || INSTANCES[INSTANCES.length - 1];

    const totalCost = diskCost + instance.cost;
    const popPerUser = userCount > 0 ? populationCount / userCount : 0;
    const docsPerUser = userCount > 0 ? totalDocCount / userCount : 0;
    const resourceUtilizationPct = (loadFactor - instance.minLoad) / (instance.maxLoad - instance.minLoad);

    return {
      deploymentAge,
      workflowCount,
      populationCount,
      placeCount,
      contactCount,
      reportCount,
      totalDocCount,
      diskUsedGb,
      diskOverprovisionGb,
      diskSizeGb,
      diskCost,
      userCount,
      loadFactor,
      instance,
      totalCost,
      popPerUser,
      docsPerUser,
      resourceUtilizationPct
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
    els.diskSize.textContent = metrics.diskSizeGb.toFixed(2) + ' GB';

    // Update disk breakdown visualization
    if (els.diskUsed && els.diskOverprovision && els.diskUsedBar && els.diskOverprovisionBar) {
      els.diskUsed.textContent = metrics.diskUsedGb.toFixed(2) + ' GB';
      els.diskOverprovision.textContent = metrics.diskOverprovisionGb.toFixed(2) + ' GB';

      // Calculate percentages for the visual bars
      const usedPct = (metrics.diskUsedGb / metrics.diskSizeGb) * 100;
      const overprovisionPct = (metrics.diskOverprovisionGb / metrics.diskSizeGb) * 100;
      els.diskUsedBar.style.width = usedPct + '%';
      els.diskOverprovisionBar.style.width = overprovisionPct + '%';
    }

    // Update people per user visualization
    if (els.popPerUser && els.popPerUserMarker) {
      els.popPerUser.textContent = metrics.popPerUser.toFixed(1);

      // Calculate marker position (0-100% based on 1-250 range)
      const minRange = 1;
      const maxRange = 250;
      const clampedValue = Math.max(minRange, Math.min(maxRange, metrics.popPerUser));
      const percentage = ((clampedValue - minRange) / (maxRange - minRange)) * 100;
      els.popPerUserMarker.style.left = `calc(${percentage}% - 1.5px)`;
    }

    // Update docs per user visualization
    if (els.docsPerUser && els.docsPerUserMarker) {
      els.docsPerUser.textContent = formatNumber(Math.round(metrics.docsPerUser));

      // Calculate marker position (0-100% based on 1-20000 range)
      const minRange = 1;
      const maxRange = 20000;
      const clampedValue = Math.max(minRange, Math.min(maxRange, metrics.docsPerUser));
      const percentage = ((clampedValue - minRange) / (maxRange - minRange)) * 100;
      els.docsPerUserMarker.style.left = `calc(${percentage}% - 1.5px)`;
    }

    // Update resource utilization visualization
    if (els.resourceUtil && els.resourceUtilMarker) {
      const utilPct = metrics.resourceUtilizationPct * 100;
      els.resourceUtil.textContent = utilPct.toFixed(1) + '%';

      // Calculate marker position (0-100% range)
      const clampedValue = Math.max(0, Math.min(100, utilPct));
      els.resourceUtilMarker.style.left = `calc(${clampedValue}% - 1px)`;
    }

    // Update pie chart
    if (pieChart || els.pieChartCanvas) {
      updatePieChart(metrics);
    }
  }

  function debouncedUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateOutputs, 250);
  }

  // Toggle between basic and advanced views
  function toggleAdvanced(showAdvanced) {
    if (showAdvanced) {
      els.basicParams.style.display = 'none';
      els.advancedParams.style.display = 'block';
    } else {
      els.basicParams.style.display = 'block';
      els.advancedParams.style.display = 'none';
    }
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

    // User count slider
    els.userCountInput.addEventListener('input', (e) => {
      els.userCountInputValue.textContent = formatNumber(parseInt(e.target.value));
      debouncedUpdate();
    });

    // Advanced parameter inputs
    if (els.contactsPerPlace) {
      els.contactsPerPlace.addEventListener('input', updateOutputs);
    }
    if (els.workflowDocs) {
      els.workflowDocs.addEventListener('input', updateOutputs);
    }
    if (els.dbOverprovision) {
      els.dbOverprovision.addEventListener('input', updateOutputs);
    }

    // Toggle buttons
    if (els.showAdvanced) {
      els.showAdvanced.addEventListener('click', () => toggleAdvanced(true));
    }
    if (els.showBasic) {
      els.showBasic.addEventListener('click', () => toggleAdvanced(false));
    }
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
