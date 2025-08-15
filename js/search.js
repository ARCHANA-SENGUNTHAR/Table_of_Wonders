function attachSearch(){
  const input = document.getElementById('searchInput');
  input.addEventListener('input', debounce(e=>{
    const q = e.target.value.trim().toLowerCase();
    const base = PTE.elements;
    PTE.filtered = q ? base.filter(el =>
      (el.name||'').toLowerCase().includes(q) ||
      (el.symbol||'').toLowerCase().includes(q) ||
      String(el.atomicNumber)===q
    ) : base;
    renderTable(PTE.filtered, document.getElementById('ptable'));
  }, 120));
}
