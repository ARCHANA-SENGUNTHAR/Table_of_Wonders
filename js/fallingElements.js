const fallCanvas = document.getElementById('fallCanvas');
const fCtx = fallCanvas.getContext('2d');

fallCanvas.width = window.innerWidth;
fallCanvas.height = window.innerHeight;

let fallingElements = [];
const elementCount = 60; // number of falling symbols
const elementSymbols = ['H','He','Li','C','O','N','Na','K','Mg','Fe','Au','Ag']; // can add more

class FallingElement {
    constructor(){
        this.x = Math.random() * fallCanvas.width;
        this.y = Math.random() * -fallCanvas.height;
        this.size = Math.random() * 20 + 10;
        this.speed = Math.random() * 2 + 1;
        this.symbol = elementSymbols[Math.floor(Math.random() * elementSymbols.length)];
        this.opacity = Math.random() * 0.7 + 0.3;
    }
    draw() {
        fCtx.fillStyle = `rgba(76, 175, 80, ${this.opacity})`; // greenish glow
        fCtx.font = `${this.size}px Arial`;
        fCtx.fillText(this.symbol, this.x, this.y);
    }
    update() {
        this.y += this.speed;
        if(this.y > fallCanvas.height) {
            this.y = -this.size;
            this.x = Math.random() * fallCanvas.width;
        }
    }
}

function initFalling() {
    fallingElements = [];
    for(let i=0; i<elementCount; i++){
        fallingElements.push(new FallingElement());
    }
}

function animateFalling(){
    fCtx.clearRect(0,0,fallCanvas.width,fallCanvas.height);
    fallingElements.forEach(el => {
        el.update();
        el.draw();
    });
    requestAnimationFrame(animateFalling);
}

window.addEventListener('resize', () => {
    fallCanvas.width = window.innerWidth;
    fallCanvas.height = window.innerHeight;
    initFalling();
});

initFalling();
animateFalling();
