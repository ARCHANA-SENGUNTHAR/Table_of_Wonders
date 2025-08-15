/* js/tooltip.js
   Safe tooltip helper that only wraps renderTable if renderTable exists.
*/

let tooltipEl;

function initTooltip() {
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'tooltip';
  document.body.appendChild(tooltipEl);
}

function showTooltip(text, x, y) {
  if (!tooltipEl) return;
  tooltipEl.textContent = text;
  tooltipEl.style.left = x + 10 + 'px';
  tooltipEl.style.top = y + 10 + 'px';
  tooltipEl.style.opacity = '1';
}

function hideTooltip() {
  if (!tooltipEl) return;
  tooltipEl.style.opacity = '0';
}

// create tooltip element on DOM ready
document.addEventListener('DOMContentLoaded', initTooltip);

// Only wrap renderTable if it exists (prevents ReferenceError)
if (typeof renderTable === 'function') {
  const oldRenderTable = renderTable;
  renderTable = function(list, mount) {
    // call original renderer
    oldRenderTable(list, mount);

    // attach tooltip handlers to each rendered cell
    mount.querySelectorAll('.cell').forEach(cell => {
      // ensure we don't attach duplicate listeners (simple guard)
      if (cell.__tooltipAttached) return;
      cell.__tooltipAttached = true;

      cell.addEventListener('mouseenter', e => {
        const numEl = cell.querySelector('.num');
        const symEl = cell.querySelector('.sym');
        const nameEl = cell.querySelector('.name');
        const num = numEl ? numEl.textContent : '';
        const sym = symEl ? symEl.textContent : '';
        const name = nameEl ? nameEl.textContent : '';
        showTooltip(`${num} ${sym} - ${name}`, e.pageX, e.pageY);
      });

      cell.addEventListener('mousemove', e => {
        // move tooltip as mouse moves
        showTooltip(tooltipEl ? tooltipEl.textContent : '', e.pageX, e.pageY);
      });

      cell.addEventListener('mouseleave', hideTooltip);
    });
  };
} else {
  // If renderTable doesn't exist yet, try again after window load (defensive)
  window.addEventListener('load', () => {
    if (typeof renderTable === 'function') {
      // re-run the wrapping logic by reloading this script's logic
      const oldRenderTable = renderTable;
      renderTable = function(list, mount) {
        oldRenderTable(list, mount);
        mount.querySelectorAll('.cell').forEach(cell => {
          if (cell.__tooltipAttached) return;
          cell.__tooltipAttached = true;
          cell.addEventListener('mouseenter', e => {
            const num = cell.querySelector('.num')?.textContent || '';
            const sym = cell.querySelector('.sym')?.textContent || '';
            const name = cell.querySelector('.name')?.textContent || '';
            showTooltip(`${num} ${sym} - ${name}`, e.pageX, e.pageY);
          });
          cell.addEventListener('mousemove', e => {
            showTooltip(tooltipEl ? tooltipEl.textContent : '', e.pageX, e.pageY);
          });
          cell.addEventListener('mouseleave', hideTooltip);
        });
      };
    }
  });
}
