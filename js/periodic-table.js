async function loadElements() {
  const res = await fetch('data/elements.json');
  const data = await res.json();
  return data;
}

function renderPeriodicTable(elements) {
  const container = document.getElementById('periodic-table-container');
  container.innerHTML = '';

  // Assuming elements array with properties and position info
  elements.forEach(el => {
    const cell = document.createElement('div');
    cell.className = 'element-cell';
    cell.style.gridColumnStart = el.group;
    cell.style.gridRowStart = el.period;
    cell.textContent = el.symbol;

    cell.addEventListener('mouseover', () => showElementSummary(el));
    cell.addEventListener('click', () => showElementDetails(el));

    container.appendChild(cell);
  });
}

function showElementSummary(el) {
  // You can add tooltip or small popup
  // For brevity, let's just console.log
  console.log(`Element: ${el.name} (${el.symbol})`);
}
function showElementDetails(el) {
  const details = document.getElementById('element-details');
  details.innerHTML = `
    <h3>${el.elementName} (${el.elementSymbol})</h3>
    <p><strong>Atomic Number:</strong> ${el.atomicNumber}</p>
    <p><strong>Atomic Mass:</strong> ${el.atomicMass}</p>
    <p><strong>Group:</strong> ${el.group}</p>
    <p><strong>Period:</strong> ${el.period}</p>
    <p><strong>Block:</strong> ${el.block}</p>
    <p><strong>Electronic Configuration:</strong> ${el.electronicConfiguration}</p>
    <p><strong>Valency:</strong> ${el.valency}</p>
    <p><strong>Type:</strong> ${el.type}</p>
    <p><strong>State at Room Temp:</strong> ${el.stateAtRoomTemp}</p>
    <p><strong>Category:</strong> ${el.category}</p>
    <p><strong>Boiling Point:</strong> ${el.boilingPoint} °C</p>
    <p><strong>Melting Point:</strong> ${el.meltingPoint} °C</p>
    <p><strong>Electronegativity:</strong> ${el.electronegativity}</p>
    <p><strong>Ionization Energy:</strong> ${el.ionizationEnergy} kJ/mol</p>
    <p><strong>Electron Affinity:</strong> ${el.electronAffinity} kJ/mol</p>
    <p><strong>Atomic Radius:</strong> ${el.atomicRadius} pm</p>
    <p><strong>Reactivity:</strong> ${el.reactivity}</p>
  `;
}


document.addEventListener('DOMContentLoaded', async () => {
  const elementsData = await loadElements();
  renderPeriodicTable(elementsData.elements);
});
