function attachFilters() {
  const buttons = document.querySelectorAll('.filters button');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // remove active class from all buttons
      buttons.forEach(b => b.classList.remove('active'));
      // mark this one active
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      if (filter === 'all') {
        PTE.filtered = PTE.elements.slice();
      } else {
        PTE.filtered = PTE.elements.filter(el =>
          (el.category || '').toLowerCase() === filter.toLowerCase()
        );
      }

      renderTable(PTE.filtered, document.getElementById('ptable'));
    });
  });
}
