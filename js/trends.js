let trendsData = null;
let chart = null;

async function loadTrends() {
  const res = await fetch('data/trends.json');
  trendsData = await res.json();
  populateTrendPropertiesList();
}

function populateTrendPropertiesList() {
  const list = document.getElementById('trend-properties-list');
  list.innerHTML = '';

  trendsData.properties.forEach(prop => {
    const btn = document.createElement('button');
    btn.textContent = prop.name;
    btn.dataset.property = prop.key;
    btn.addEventListener('click', () => showTrend(prop.key));
    list.appendChild(btn);
  });
}

function showTrend(propertyKey) {
  const direction = document.querySelector('input[name="trend-direction"]:checked').value;
  const visualMode = document.getElementById('visual-mode').value;

  const dataPoints = getTrendData(propertyKey, direction);

  if (visualMode === 'chart') {
    renderChart(propertyKey, dataPoints);
  } else if (visualMode === 'table') {
    renderTable(propertyKey, dataPoints);
  } else {
    renderArrows(propertyKey, dataPoints);
  }

  showExplanation(propertyKey, direction);
}

function getTrendData(propertyKey, direction) {
  // Filter and return the data points for charting
  if (!trendsData.trends[propertyKey]) return [];

  return trendsData.trends[propertyKey][direction] || [];
}

function renderChart(propertyKey, dataPoints) {
  const ctx = document.getElementById('trend-chart').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataPoints.map(dp => dp.element),
      datasets: [{
        label: propertyKey,
        data: dataPoints.map(dp => dp.value),
        borderColor: 'rgba(26, 188, 156, 1)',
        backgroundColor: 'rgba(26, 188, 156, 0.2)',
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

function renderTable(propertyKey, dataPoints) {
  // Create a simple HTML table showing element and value
  const container = document.getElementById('trend-display');
  container.innerHTML = `
    <table class="trend-table">
      <thead><tr><th>Element</th><th>${propertyKey}</th></tr></thead>
      <tbody>
        ${dataPoints.map(dp => `<tr><td>${dp.element}</td><td>${dp.value}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}

function renderArrows(propertyKey, dataPoints) {
  // For simplicity, just show arrow symbols or text
  const container = document.getElementById('trend-display');
  let trend = trendsData.trends[propertyKey];
  // Logic for arrow visualization based on increase/decrease trends (can be improved)
  container.innerHTML = `<p>Arrow visualization coming soon for ${propertyKey}</p>`;
}

function showExplanation(propertyKey, direction) {
  const explanation = trendsData.properties.find(p => p.key === propertyKey)?.explanation || '';
  const explanationDiv = document.getElementById('trend-explanation');
  explanationDiv.textContent = explanation;
}

document.addEventListener('DOMContentLoaded', () => {
  loadTrends();

  document.getElementById('visual-mode').addEventListener('change', () => {
    const selectedProperty = document.querySelector('#trend-properties-list button.active')?.dataset.property;
    if (selectedProperty) showTrend(selectedProperty);
  });

  document.querySelectorAll('input[name="trend-direction"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedProperty = document.querySelector('#trend-properties-list button.active')?.dataset.property;
      if (selectedProperty) showTrend(selectedProperty);
    });
  });
});
