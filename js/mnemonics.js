let mnemonicsData = null;

async function loadMnemonics() {
  const res = await fetch('data/mnemonics.json');
  mnemonicsData = await res.json();
  displayMnemonics('english');
}

function displayMnemonics(language) {
  const container = document.getElementById('mnemonics-container');
  container.innerHTML = '';

  mnemonicsData.mnemonics.forEach(periodData => {
    const div = document.createElement('div');
    div.className = 'mnemonic-period';

    div.innerHTML = `<h3>Period ${periodData.period}</h3>
      <p><strong>Elements:</strong> ${periodData.elements.join(', ')}</p>
      <p><strong>Mnemonic (${language}):</strong> ${periodData.mnemonics[language] || 'N/A'}</p>
    `;

    container.appendChild(div);
  });
}

document.getElementById('lang-select').addEventListener('change', e => {
  displayMnemonics(e.target.value);
});

document.addEventListener('DOMContentLoaded', loadMnemonics);
