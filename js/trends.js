let TDATA, mode = 'line';

(async function() {
    TDATA = await (await fetch('../data/trends.json')).json();
    wire();
    draw();
})();

// Wire up events
function wire() {
    document.getElementById('modeLine').onclick = () => {
        mode = 'line';
        toggleMode();
        draw();
    };
    document.getElementById('modeHeat').onclick = () => {
        mode = 'heat';
        toggleMode();
        draw();
    };
    document.getElementById('propSel').onchange = draw;
    document.getElementById('pathSel').onchange = draw;
}

function toggleMode() {
    document.getElementById('modeLine').classList.toggle('active', mode === 'line');
    document.getElementById('modeHeat').classList.toggle('active', mode === 'heat');
    document.getElementById('chart').classList.toggle('hidden', mode !== 'line');
    document.getElementById('heat').classList.toggle('hidden', mode !== 'heat');
}

// Generate labels and values based on property trend
function getSeries() {
    const prop = document.getElementById('propSel').value;
    const path = document.getElementById('pathSel').value; // periodTrend / groupTrend
    const seg = TDATA[prop];

    let labels = [], values = [];
    const n = path === 'periodTrend' ? 7 : 18;

    labels = Array.from({length: n}, (_, i) => path === 'periodTrend' ? `Period ${i+1}` : `Group ${i+1}`);

    values = labels.map((_, i) => {
        switch(seg[path]) {
            case 'increases': return i + 1;
            case 'decreases': return n - i;
            case 'generally increases': return 1 + i * 0.8;
            case 'generally decreases': return n - i * 0.8;
            case 'varies': return Math.random() * n + 1;
            default: return i + 1;
        }
    });

    // 2-line trend statement with larger font and light color
document.getElementById('trendStatement').innerHTML =
    `<span style="font-size:18px; color:#d3d3d3; line-height:1.5;">
        <strong>Trend Nature:</strong> ${seg[path]}<br>
        <strong>Explanation:</strong> ${seg.explanation}
    </span>`;

    return {labels, values, min: Math.min(...values), max: Math.max(...values)};
}

// Draw either line chart or heatmap
function draw() {
    const {labels, values, min, max} = getSeries();

    if (mode === 'line') {
        const c = document.getElementById('chart');
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);

        // Chart margins
        const chartMargin = { left: 60, right: 40, top: 40, bottom: 40 };
        const chartWidth = c.width - chartMargin.left - chartMargin.right;
        const chartHeight = c.height - chartMargin.top - chartMargin.bottom;

        // axes
        ctx.strokeStyle = '#3a4068';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartMargin.left, chartMargin.top);
        ctx.lineTo(chartMargin.left, chartHeight + chartMargin.top);
        ctx.lineTo(chartWidth + chartMargin.left, chartHeight + chartMargin.top);
        ctx.stroke();

        // line + points + arrows
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#3498db';

        values.forEach((v, i) => {
            const x = chartMargin.left + i * (chartWidth / (labels.length - 1));
            const y = chartMargin.top + chartHeight - ((v - min) / (max - min)) * chartHeight;

            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);

            // draw point
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();

            // draw arrow
            ctx.fillStyle = '#f6f7fb';
            const arrow = (i < values.length - 1 && values[i + 1] > v) ? '→' :
                          (i < values.length - 1 && values[i + 1] < v) ? '←' : '';
            ctx.font = '16px system-ui';
            ctx.fillText(arrow, x - 5, y - 18);

            // draw value above point
            ctx.fillStyle = '#fff';
            ctx.font = '12px system-ui';
            ctx.fillText(v.toFixed(1), x - 10, y - 28);
        });
        ctx.stroke();

        // labels
        ctx.fillStyle = '#f6f7fb';
        ctx.font = '12px system-ui';
        labels.forEach((lb, i) => {
            const x = chartMargin.left + i * (chartWidth / (labels.length - 1));
            ctx.fillText(lb, x - 20, chartHeight + chartMargin.top + 20);
        });

    } else {
        // Heatmap mode
        const heat = document.getElementById('heat');
        heat.innerHTML = '';
        heat.style.display = 'grid';
        heat.style.gridTemplateColumns = `repeat(${values.length}, minmax(60px, 1fr))`;
        heat.style.gap = '12px';
        heat.style.padding = '16px 8px 8px 8px';

        labels.forEach((lb, i) => {
            const div = document.createElement('div');
            div.className = 'tile';
            const t = (values[i] - min) / (max - min);
            div.style.background = `hsl(${220 - t * 180} 70% 35%)`;
            div.title = `${lb}: ${values[i].toFixed(2)}`;
            div.innerHTML = `<strong>${lb}</strong><br>${values[i].toFixed(1)}`;
            heat.appendChild(div);
        });
    }
}
