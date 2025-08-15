(async function init(){
  try {
    const res = await fetch('./data/elements.json'); // keep ./ to be explicit
    if (!res.ok) {
      throw new Error(`Failed to load elements.json: ${res.status} ${res.statusText}`);
    }
    // Optional: guard against servers returning HTML on 404
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json') && !ct.includes('json')) {
      const text = await res.text();
      throw new Error(`Expected JSON but got: ${ct}\nFirst 80 chars: ${text.slice(0,80)}`);
    }
    const elements = await res.json();

    window.PTE = { elements, filtered: elements.slice() };

    renderTable(PTE.filtered, document.getElementById('ptable'));
    attachSearch();
    attachFilters();
  } catch (err) {
    console.error(err);
    alert('Could not load element data. Check console for details.');
  }
})();
