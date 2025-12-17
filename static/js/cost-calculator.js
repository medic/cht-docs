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
  const BASE_COST_PER_USER = 0.10;
  const RESOURCE_RATIOS = {
    ram: 0.324,
    cpu: 0.118,
    storage: 0.353,
    overProvision: 0.206
  };

  const FIXED_COSTS = {
    small: { controlPlane: 8, workers: 692, storage: 45 },
    medium: { controlPlane: 8, workers: 1154, storage: 75 },
    large: { controlPlane: 16, workers: 2308, storage: 150 }
  };

  const STORAGE_COST_PER_GB = 0.09; // EBS gp3
  const BACKUP_COST_PER_GB = 0.05; // S3 glacier
  const GB_PER_MILLION_DOCS = 40;
  const MONITORING_COST = 50;

  // State
  let pieChart = null;
  let barChart = null;
  let debounceTimer = null;

  // Get elements
  const els = {
    activeUsers: document.getElementById(`active-users-${calcId}`),
    activeUsersValue: document.getElementById(`active-users-value-${calcId}`),
    docGrowth: document.getElementById(`doc-growth-${calcId}`),
    dbSize: document.getElementById(`db-size-${calcId}`),
    deploymentType: document.getElementById(`deployment-type-${calcId}`),
    cloudProvider: document.getElementById(`cloud-provider-${calcId}`),
    overprovision: document.getElementById(`overprovision-${calcId}`),
    overprovisionValue: document.getElementById(`overprovision-value-${calcId}`),
    backupMult: document.getElementById(`backup-mult-${calcId}`),
    backupMultValue: document.getElementById(`backup-mult-value-${calcId}`),
    includeBackups: document.getElementById(`include-backups-${calcId}`),
    includeMonitoring: document.getElementById(`include-monitoring-${calcId}`),
    projectionPeriod: document.getElementById(`projection-period-${calcId}`),
    tableBody: document.getElementById(`cost-table-body-${calcId}`),
    totalCost: document.getElementById(`total-cost-${calcId}`),
    loading: document.getElementById(`loading-${calcId}`)
  };

  // Calculation functions
  function calculateStorageGB(dbSizeMillion, growthPerMonth, months) {
    const currentGB = dbSizeMillion * GB_PER_MILLION_DOCS;
    const growthGB = (growthPerMonth * months / 1000000) * GB_PER_MILLION_DOCS;
    return currentGB + growthGB;
  }

  function calculateCosts() {
    const activeUsers = parseInt(els.activeUsers.value);
    const docGrowth = parseFloat(els.docGrowth.value);
    const dbSize = parseFloat(els.dbSize.value);
    const deploymentType = els.deploymentType.value;
    const cloudMultiplier = parseFloat(els.cloudProvider.value);
    const overprovisionPercent = parseInt(els.overprovision.value);
    const backupMult = parseFloat(els.backupMult.value);
    const includeBackups = els.includeBackups.checked;
    const includeMonitoring = els.includeMonitoring.checked;

    // Variable costs
    const baseCost = activeUsers * BASE_COST_PER_USER;
    const ram = baseCost * RESOURCE_RATIOS.ram;
    const cpu = baseCost * RESOURCE_RATIOS.cpu;
    const storage = baseCost * RESOURCE_RATIOS.storage;
    const overProvision = baseCost * (overprovisionPercent / 100);

    // Fixed costs
    const fixed = FIXED_COSTS[deploymentType];
    const controlPlane = fixed.controlPlane * cloudMultiplier;
    const workers = fixed.workers * cloudMultiplier;
    const fixedStorage = fixed.storage * cloudMultiplier;

    // Optional costs
    let backupCost = 0;
    if (includeBackups) {
      const storageGB = calculateStorageGB(dbSize, docGrowth, 1);
      backupCost = storageGB * backupMult * BACKUP_COST_PER_GB;
    }

    const monitoringCost = includeMonitoring ? MONITORING_COST : 0;

    // Total
    const total = ram + cpu + storage + overProvision + controlPlane + workers + fixedStorage + backupCost + monitoringCost;

    return {
      ram, cpu, storage, overProvision,
      controlPlane, workers, fixedStorage,
      backupCost, monitoringCost,
      total,
      activeUsers, docGrowth, dbSize, deploymentType
    };
  }

  function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
  }

  // Update displays
  function updateTable(costs) {
    const rows = [
      { label: 'RAM', detail: `${costs.activeUsers} active users`, amount: costs.ram },
      { label: 'CPU', detail: `${costs.activeUsers} active users`, amount: costs.cpu },
      { label: 'Variable Storage', detail: 'Database and application data', amount: costs.storage },
      { label: 'Over-provisioning', detail: 'Headroom for bursts and growth', amount: costs.overProvision },
      { label: 'Control Plane', detail: `${costs.deploymentType} deployment`, amount: costs.controlPlane },
      { label: 'Worker Nodes', detail: `${costs.deploymentType} deployment`, amount: costs.workers },
      { label: 'Fixed Storage', detail: 'EBS volumes', amount: costs.fixedStorage }
    ];

    if (costs.backupCost > 0) {
      rows.push({ label: 'Backups', detail: 'Off-site backup storage', amount: costs.backupCost });
    }

    if (costs.monitoringCost > 0) {
      rows.push({ label: 'Monitoring & Alerting', detail: 'System monitoring', amount: costs.monitoringCost });
    }

    els.tableBody.innerHTML = rows.map(row => `
      <tr>
        <td>${row.label}</td>
        <td>${row.detail}</td>
        <td class="cost-amount">${formatCurrency(row.amount)}</td>
      </tr>
    `).join('');

    els.totalCost.textContent = formatCurrency(costs.total);
  }

  function getChartColors() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      return {
        colors: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#c084fc'],
        text: '#f9fafb',
        grid: '#374151'
      };
    } else {
      return {
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#a855f7'],
        text: '#1f2937',
        grid: '#e5e7eb'
      };
    }
  }

  function updatePieChart(costs) {
    const colors = getChartColors();

    const data = {
      labels: ['RAM', 'CPU', 'Storage', 'Over-provision', 'Control Plane', 'Workers', 'Fixed Storage'],
      datasets: [{
        data: [costs.ram, costs.cpu, costs.storage, costs.overProvision, costs.controlPlane, costs.workers, costs.fixedStorage],
        backgroundColor: colors.colors
      }]
    };

    if (costs.backupCost > 0) {
      data.labels.push('Backups');
      data.datasets[0].data.push(costs.backupCost);
    }

    if (costs.monitoringCost > 0) {
      data.labels.push('Monitoring');
      data.datasets[0].data.push(costs.monitoringCost);
    }

    if (pieChart) {
      pieChart.data = data;
      pieChart.options.plugins.legend.labels.color = colors.text;
      pieChart.update('none');
    } else {
      const ctx = document.getElementById(`pie-chart-${calcId}`);
      pieChart = new Chart(ctx, {
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
                padding: 10,
                font: { size: 11 }
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

  function updateBarChart(costs) {
    const colors = getChartColors();
    const months = parseInt(els.projectionPeriod.value);
    const docGrowth = parseFloat(els.docGrowth.value);
    const dbSize = parseFloat(els.dbSize.value);

    const labels = [];
    const data = [];

    for (let i = 0; i <= months; i++) {
      labels.push(`Month ${i}`);

      // Calculate projected costs
      const storageGB = calculateStorageGB(dbSize, docGrowth, i);
      const projectedStorage = storageGB * STORAGE_COST_PER_GB;

      let projectedTotal = costs.ram + costs.cpu + costs.overProvision +
                          costs.controlPlane + costs.workers + costs.fixedStorage +
                          projectedStorage;

      if (els.includeBackups.checked) {
        projectedTotal += storageGB * parseFloat(els.backupMult.value) * BACKUP_COST_PER_GB;
      }

      if (els.includeMonitoring.checked) {
        projectedTotal += MONITORING_COST;
      }

      data.push(projectedTotal);
    }

    if (barChart) {
      barChart.data.labels = labels;
      barChart.data.datasets[0].data = data;
      barChart.options.scales.x.ticks.color = colors.text;
      barChart.options.scales.y.ticks.color = colors.text;
      barChart.options.scales.x.grid.color = colors.grid;
      barChart.options.scales.y.grid.color = colors.grid;
      barChart.options.plugins.legend.labels.color = colors.text;
      barChart.update('none');
    } else {
      const ctx = document.getElementById(`bar-chart-${calcId}`);
      barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monthly Cost',
            data: data,
            backgroundColor: colors.colors[0],
            borderColor: colors.colors[0],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: colors.text,
                callback: (value) => formatCurrency(value)
              },
              grid: { color: colors.grid }
            },
            x: {
              ticks: { color: colors.text },
              grid: { color: colors.grid }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => `Cost: ${formatCurrency(context.parsed.y)}`
              }
            }
          }
        }
      });
    }
  }

  function updateAll() {
    const costs = calculateCosts();
    updateTable(costs);
    updatePieChart(costs);
    updateBarChart(costs);
  }

  function debouncedUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateAll, 250);
  }

  // Event listeners
  function attachListeners() {
    // Sliders with debounce
    els.activeUsers.addEventListener('input', (e) => {
      els.activeUsersValue.textContent = e.target.value;
      debouncedUpdate();
    });

    els.overprovision.addEventListener('input', (e) => {
      els.overprovisionValue.textContent = e.target.value + '%';
      debouncedUpdate();
    });

    els.backupMult.addEventListener('input', (e) => {
      els.backupMultValue.textContent = e.target.value + 'x';
      debouncedUpdate();
    });

    // Other inputs - immediate update
    els.docGrowth.addEventListener('input', updateAll);
    els.dbSize.addEventListener('input', updateAll);
    els.deploymentType.addEventListener('change', updateAll);
    els.cloudProvider.addEventListener('change', updateAll);
    els.includeBackups.addEventListener('change', updateAll);
    els.includeMonitoring.addEventListener('change', updateAll);
    els.projectionPeriod.addEventListener('change', updateAll);
  }

  // Dark mode observer
  function setupDarkModeObserver() {
    const observer = new MutationObserver(() => {
      if (pieChart && barChart) {
        updateAll();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Initialize
  els.loading.style.display = 'block';
  loadChartJS()
    .then(() => {
      els.loading.style.display = 'none';
      attachListeners();
      setupDarkModeObserver();
      updateAll();
    })
    .catch((error) => {
      els.loading.textContent = 'Error loading Chart.js. Please refresh the page.';
      console.error('Failed to load Chart.js:', error);
    });
}
