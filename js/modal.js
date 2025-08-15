const panel = document.getElementById('details');
function openDetails(el){
  panel.classList.remove('hidden');
  panel.innerHTML = `
    <h3>${el.name} (${el.symbol})</h3>
    <p><small>Atomic #${el.atomicNumber} • Group ${el.group} • Period ${el.period} • ${el.block}-block</small></p>
    <ul>
      <li><b>Atomic mass:</b> ${el.atomicMass ?? '—'}</li>
      <li><b>Electronegativity:</b> ${el.electronegativity ?? '—'}</li>
      <li><b>Ionization energy:</b> ${el.ionizationEnergy ?? '—'} kJ/mol</li>
      <li><b>Electron affinity:</b> ${el.electronAffinity ?? '—'} kJ/mol</li>
      <li><b>Atomic radius:</b> ${el.atomicRadius ?? '—'} pm</li>
      <li><b>State:</b> ${el.state ?? '—'}</li>
      <li><b>Valency:</b> ${el.valency ?? '—'}</li>
      <li><b>Electronic configuration:</b> ${el.config ?? '—'}</li>
    </ul>
    <button id="closeDetails">Close</button>
  `;
  document.getElementById('closeDetails').onclick = ()=> panel.classList.add('hidden');
}
