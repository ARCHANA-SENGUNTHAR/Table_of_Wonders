// js/renderTable.js
// Robust renderer: keeps gaps, places main elements, and puts lanth/actinides in rows 8 & 9

function renderTable(list, mount) {
  mount.innerHTML = '';

  const COLS = 18;
  const MAIN_ROWS = 7;      // periods 1..7 displayed as rows 1..7
  const LANTH_ROW = 8;     // lanthanides will be placed here
  const ACTI_ROW = 9;      // actinides will be placed here

  // 1) create placeholders for main grid (periods 1..7, groups 1..18)
  for (let r = 1; r <= MAIN_ROWS; r++) {
    for (let c = 1; c <= COLS; c++) {
      const ph = document.createElement('div');
      ph.className = 'cell empty';
      ph.style.gridRow = r;
      ph.style.gridColumn = c;
      mount.appendChild(ph);
    }
  }

  // 2) helper to detect lanthanide/actinide labels in data (tolerant)
  function isLanthanoidCategory(cat) {
    if (!cat) return false;
    return /lanth|lanthanide/i.test(cat);
  }
  function isActinoidCategory(cat) {
    if (!cat) return false;
    return /actin|actinoid/i.test(cat);
  }

  // 3) Place each element
  list.forEach(el => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.category = (el.category || '').toLowerCase();

    // content (auto-wrap names)
    cell.innerHTML = `
      <div class="num">${el.atomicNumber}</div>
      <div class="sym">${el.symbol}</div>
      <div class="name">${el.name}</div>
    `;
    cell.addEventListener('click', () => openDetails(el));

    // Positioning rules
    const z = el.atomicNumber;

    // Force lanthanide series (57-71) to row 8 and columns 3..17 (15 items)
    if ((z >= 57 && z <= 71) || isLanthanoidCategory(el.category)) {
      const idx = (z >= 57 && z <= 71) ? (z - 57) : null;
      // start column 3 (so 3 + 0 => col 3, ... 3+14 => col 17)
      const col = (idx !== null) ? (3 + idx) : (el.group || 3);
      cell.style.gridRow = LANTH_ROW;
      cell.style.gridColumn = Math.min(Math.max(3, col), 17);
      mount.appendChild(cell);
      return;
    }

    // Force actinide series (89-103) to row 9 and columns 3..17 (15 items)
    if ((z >= 89 && z <= 103) || isActinoidCategory(el.category)) {
      const idx = (z >= 89 && z <= 103) ? (z - 89) : null;
      const col = (idx !== null) ? (3 + idx) : (el.group || 3);
      cell.style.gridRow = ACTI_ROW;
      cell.style.gridColumn = Math.min(Math.max(3, col), 17);
      mount.appendChild(cell);
      return;
    }

    // For normal elements: use period -> gridRow and group -> gridColumn
    // If group missing, try to approximate by atomicNumber (fallback)
    if (el.period) {
      cell.style.gridRow = el.period;
    } else {
      // fallback: put in period 1..7 by atomic number ranges
      if (z === 1 || z === 2) cell.style.gridRow = 1;
      else if (z <= 10) cell.style.gridRow = 2;
      else if (z <= 18) cell.style.gridRow = 3;
      else if (z <= 36) cell.style.gridRow = 4;
      else if (z <= 54) cell.style.gridRow = 5;
      else if (z <= 86) cell.style.gridRow = 6;
      else cell.style.gridRow = 7;
    }

    if (el.group) {
      cell.style.gridColumn = el.group;
    } else {
      // fallback: attempt reasonable placement for d-block elements
      // default: auto place to avoid breaking layout
      cell.style.gridColumn = 'auto';
    }

    mount.appendChild(cell);
  });
}
