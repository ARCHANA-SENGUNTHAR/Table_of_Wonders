let MN = { data: [], lang: 'english', scope: 'period' };

(async function(){
  try {
    MN.data = await (await fetch('../data/mnemonics.json')).json();
    renderMN();
  } catch (err) {
    console.error('Failed to load mnemonics:', err);
    document.getElementById('mnArea').textContent = 'Could not load mnemonics.';
  }
})();

function renderMN(){
  const wrap = document.getElementById('mnArea');
  wrap.innerHTML = '';

  let items = [];
  switch(MN.scope){
    case 'period': items = MN.data.periods; break;
    case 'group': items = MN.data.groups; break;
    case 'lanthanide': items = MN.data.lanthanides; break;
    case 'actinide': items = MN.data.actinides; break;
    default: items = [];
  }

  if(!items || items.length === 0){
    wrap.innerHTML = `<p class="info">${MN.scope.charAt(0).toUpperCase() + MN.scope.slice(1)} mnemonics are not available yet.</p>`;
    return;
  }

  items.forEach(x => {
    const title = x.period ? `${MN.scope.toUpperCase()} ${x.period}`
                 : x.group ? `${MN.scope.toUpperCase()} ${x.group}`
                 : `${MN.scope.charAt(0).toUpperCase() + MN.scope.slice(1)}`;

    const card = document.createElement('article');
    card.className = 'mn-card';
    card.innerHTML = `
      <h3>${title}</h3>
      <p class="elements">${x.elements.join(', ')}</p>
      <p class="mnemonic">${x[MN.lang] || (x.mnemonics ? x.mnemonics[MN.lang] : '—')}</p>
      <small class="fun-fact">💡 ${x.fun_fact || (x.mnemonics ? x.mnemonics.fun_fact : '')}</small>
    `;
    wrap.appendChild(card);
  });
}

// Change scope radio buttons
document.querySelectorAll('input[name=scope]').forEach(r=>{
  r.addEventListener('change', e=>{
    MN.scope = e.target.value;
    renderMN();
  });
});

// Change language buttons
document.querySelectorAll('.lang .chip').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.lang .chip').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    MN.lang = btn.dataset.lang;
    renderMN();
  });
});
