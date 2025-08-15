// Canvas particle code (keep your existing code)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 200;
let mouse = { x: null, y: null };

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
    }
    draw() {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        let maxDist = 100;
        let force = (maxDist - dist) / maxDist;
        if(dist < maxDist && dist > 0){
            let directionX = dx / dist;
            let directionY = dy / dist;
            this.x -= directionX * force * this.density;
            this.y -= directionY * force * this.density;
        } else {
            this.x += (this.baseX - this.x)/10;
            this.y += (this.baseY - this.y)/10;
        }
    }
}

function init() {
    particles = [];
    for(let i=0; i<particleCount; i++){
        particles.push(new Particle());
    }
}
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0; i<particles.length; i++){
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); });

init();
animate();

// Show description and button in sequence after welcome text
window.addEventListener('load', () => {
    const description = document.getElementById('description');
    const exploreBtn = document.getElementById('exploreBtn');

    // Show description after 2s
    setTimeout(() => {
        description.style.opacity = 1;
        description.style.transform = 'translateY(0)';
    }, 2000);

    // Show button after 3.5s
    setTimeout(() => {
        exploreBtn.style.opacity = 1;
        exploreBtn.style.transform = 'translateY(0)';
    }, 3500);
});

// Explore button click
document.getElementById('exploreBtn').onclick = () => {
    window.location.href = 'frontPage.html';
};
