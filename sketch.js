let applePath, colaPath, mcdPath, nikePath, amazonGroup;
let colaLength;
const googleColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
let googleLetters = [];

function setup() {
    noCanvas();

    applePath = document.getElementById('apple-body');
    colaPath = document.getElementById('cola-path');
    if (colaPath) {
        colaLength = colaPath.getTotalLength();
        colaPath.style.strokeDasharray = colaLength;
        colaPath.style.strokeDashoffset = colaLength;
    }

    mcdPath = document.getElementById('mcd-path');
    nikePath = document.getElementById('nike-path');

    const gIds = ["g1", "o1", "o2", "g2", "l1", "e1"];
    gIds.forEach(id => {
        let el = document.getElementById(id);
        if (el) googleLetters.push(el);
    });
}

function draw() {
    animateApple();
    animateCola();
    animateMcDonalds();
    animateNike();
    animateAmazon();
    animateGoogle();
}

function animateApple() {
    let appleSvg = document.getElementById('apple-logo');
    if (!appleSvg) return;
    // Scala molto più evidente (da 0.8 a 1.2)
    let s = 1 + sin(frameCount * 0.08) * 0.25;
    appleSvg.style.transform = `scale(${s})`;
    appleSvg.style.transformOrigin = "center center";
}

function animateCola() {
    if (!colaPath) return;
    let time = frameCount % 120;
    colaPath.style.strokeDashoffset = map(time, 0, 120, colaLength, 0);
}

function animateMcDonalds() {
    if (!mcdPath) return;
    // Rotazione ampia legata al mouse (-45 a +45 gradi)
    let angle = map(constrain(mouseX, 0, windowWidth), 0, windowWidth, -45, 45);
    mcdPath.style.transform = `rotate(${angle}deg)`;
}

function animateNike() {
    if (!nikePath) return;
    // Rimbalzo verticale marcato (30 pixel)
    let wave = sin(frameCount * 0.1) * 30;
    nikePath.style.transform = `translateY(${wave}px)`;
    nikePath.style.transformOrigin = "center center";
}

function animateAmazon() {
    let amazonCard = document.querySelector('#amazon-logo');
    if (!amazonCard) return;
    // Spostamento verticale marcato con il mouse (-35 a +35 pixel)
    let targetY = map(constrain(mouseY, 0, windowHeight), 0, windowHeight, -35, 35);
    amazonCard.style.transform = `translateY(${targetY}px)`;
    amazonCard.style.transformOrigin = "center center";
}

function animateGoogle() {
    if (googleLetters.length === 0) return;
    googleLetters.forEach((letter, index) => {
        let colorIndex = Math.floor((frameCount * 0.1) + (index * 1.2)) % 4;
        letter.setAttribute('fill', googleColors[colorIndex]);
    });
}