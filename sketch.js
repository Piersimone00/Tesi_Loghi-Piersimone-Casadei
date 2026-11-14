let applePath, colaPath, mcdPath, nikePath, amazonGroup;
let googleLetters = [];
const googleColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

let appleFragments = [];
let appleCenter = { x: 0, y: 0 };
let colaFragments = [];
let mcdHalves = [];
let mcdPivot = { x: 0, y: 0 };
let nikeFragments = [];
let amazonLetters = [];
let amazonSmile = [];

const hoverState = { apple: false, cola: false, mcd: false, nike: false, amazon: false, google: false };
const activation = { apple: 0, cola: 0, mcd: 0, nike: 0, amazon: 0, google: 0 };
let clipCounter = 0;

function setup() {
    noCanvas();

    applePath = document.getElementById('apple-body');
    colaPath = document.getElementById('cola-path');
    mcdPath = document.getElementById('mcd-path');
    nikePath = document.getElementById('nike-path');
    amazonGroup = document.getElementById('amazon-group');

    setupApple();
    setupCola();
    setupMcDonalds();
    setupNike();
    setupAmazon();
    setupGoogle();

    bindHover('apple', 'apple-logo');
    bindHover('cola', 'coca-logo');
    bindHover('mcd', 'mcd-logo');
    bindHover('nike', 'nike-logo');
    bindHover('amazon', 'amazon-logo');
    bindHover('google', 'google-logo');
}

function draw() {
    animateApple();
    animateCola();
    animateMcDonalds();
    animateNike();
    animateAmazon();
    animateGoogle();
}

function ensureDefs(svg) {
    let defs = svg.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS(SVG_NS, 'defs');
        svg.insertBefore(defs, svg.firstChild);
    }
    return defs;
}

function moveToDefs(svg, element) {
    if (!svg || !element) return;
    ensureDefs(svg).appendChild(element);
}

function addClip(svg, x, y, width, height) {
    const id = `clip-${svg.id}-${clipCounter++}`;
    const clip = document.createElementNS(SVG_NS, 'clipPath');
    clip.setAttribute('id', id);

    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);

    clip.appendChild(rect);
    ensureDefs(svg).appendChild(clip);
    return id;
}

function addUse(sourceId, clipId) {
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', `#${sourceId}`);
    use.setAttributeNS(XLINK_NS, 'xlink:href', `#${sourceId}`);
    use.setAttribute('clip-path', `url(#${clipId})`);
    return use;
}

function bindHover(key, svgId) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    const target = svg.closest('.logo-card, .preview-card') || svg;
    target.addEventListener('pointerenter', () => { hoverState[key] = true; });
    target.addEventListener('pointerleave', () => { hoverState[key] = false; });
}

function setupApple() {
    if (!applePath) return;
    const svg = document.getElementById('apple-logo');
    if (!svg) return;

    const bbox = applePath.getBBox();
    const cols = 4;
    const rows = 4;
    const overlap = 8;
    const tileW = bbox.width / cols;
    const tileH = bbox.height / rows;
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('id', 'apple-fragments');
    svg.appendChild(group);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = bbox.x + col * tileW - overlap / 2;
            const y = bbox.y + row * tileH - overlap / 2;
            const clipId = addClip(svg, x, y, tileW + overlap, tileH + overlap);
            const use = addUse('apple-body', clipId);
            const wrapper = document.createElementNS(SVG_NS, 'g');
            wrapper.appendChild(use);
            group.appendChild(wrapper);
            appleFragments.push({
                el: wrapper,
                cx: bbox.x + (col + 0.5) * tileW,
                cy: bbox.y + (row + 0.5) * tileH,
                phase: row * cols + col
            });
        }
    }

    appleCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
    moveToDefs(svg, applePath);
}

function setupCola() {
    if (!colaPath) return;
    const svg = document.getElementById('coca-logo');
    if (!svg) return;

    const bbox = colaPath.getBBox();
    const slices = 6;
    const overlap = 12;
    const sliceW = bbox.width / slices;
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('id', 'cola-fragments');
    svg.appendChild(group);

    for (let i = 0; i < slices; i++) {
        const x = bbox.x + i * sliceW - overlap / 2;
        const y = bbox.y - 10;
        const clipId = addClip(svg, x, y, sliceW + overlap, bbox.height + 20);
        const use = addUse('cola-path', clipId);
        const wrapper = document.createElementNS(SVG_NS, 'g');
        wrapper.appendChild(use);
        group.appendChild(wrapper);
        colaFragments.push({ el: wrapper, phase: i });
    }

    moveToDefs(svg, colaPath);
}

function setupMcDonalds() {
    if (!mcdPath) return;
    const svg = document.getElementById('mcd-logo');
    if (!svg) return;

    const bbox = mcdPath.getBBox();
    const midX = bbox.x + bbox.width / 2;
    const pad = 10;
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('id', 'mcd-halves');
    svg.appendChild(group);

    const halves = [
        { x: bbox.x - pad, w: midX - bbox.x + pad + 2 },
        { x: midX - 2, w: bbox.x + bbox.width - midX + pad + 2 }
    ];

    halves.forEach((half, index) => {
        const clipId = addClip(svg, half.x, bbox.y - pad, half.w, bbox.height + pad * 2);
        const use = addUse('mcd-path', clipId);
        const wrapper = document.createElementNS(SVG_NS, 'g');
        wrapper.appendChild(use);
        group.appendChild(wrapper);
        mcdHalves.push({ el: wrapper, sign: index === 0 ? -1 : 1 });
    });

    mcdPivot = { x: midX, y: bbox.y + bbox.height };
    moveToDefs(svg, mcdPath);
}

function setupNike() {
    if (!nikePath) return;
    const svg = document.getElementById('nike-logo');
    if (!svg) return;

    const bbox = nikePath.getBBox();
    const slices = 6;
    const overlap = 14;
    const sliceW = bbox.width / slices;
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('id', 'nike-fragments');
    svg.appendChild(group);

    for (let i = 0; i < slices; i++) {
        const x = bbox.x + i * sliceW - overlap / 2;
        const y = bbox.y - 10;
        const clipId = addClip(svg, x, y, sliceW + overlap, bbox.height + 20);
        const use = addUse('nike-path', clipId);
        const wrapper = document.createElementNS(SVG_NS, 'g');
        wrapper.appendChild(use);
        group.appendChild(wrapper);
        nikeFragments.push({
            el: wrapper,
            phase: i,
            dir: i - (slices - 1) / 2
        });
    }

    moveToDefs(svg, nikePath);
}

function setupAmazon() {
    if (!amazonGroup) return;
    const paths = Array.from(amazonGroup.querySelectorAll('path'));
    paths.forEach((path, index) => {
        if (index < 6) {
            amazonLetters.push(path);
        } else {
            amazonSmile.push(path);
        }
    });
}

function setupGoogle() {
    const gIds = ["g1", "o1", "o2", "g2", "l1", "e1"];
    gIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.transformBox = 'fill-box';
            el.style.transformOrigin = 'center';
            googleLetters.push(el);
        }
    });
}

function animateApple() {
    if (appleFragments.length === 0) return;
    activation.apple = lerp(activation.apple, hoverState.apple ? 1 : 0, 0.08);
    const a = activation.apple;

    appleFragments.forEach((fragment) => {
        const dx = (fragment.cx - appleCenter.x) * 0.16 * a
            + sin(frameCount * 0.04 + fragment.phase) * 12 * a;
        const dy = (fragment.cy - appleCenter.y) * 0.16 * a
            + cos(frameCount * 0.05 + fragment.phase) * 12 * a;
        fragment.el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
}

function animateCola() {
    if (colaFragments.length === 0) return;
    activation.cola = lerp(activation.cola, hoverState.cola ? 1 : 0, 0.08);
    const a = activation.cola;
    const center = (colaFragments.length - 1) / 2;

    colaFragments.forEach((fragment, index) => {
        const dir = index - center;
        const dx = dir * 8 * a + sin(frameCount * 0.05 + index * 0.9) * 10 * a;
        const dy = sin(frameCount * 0.06 + index * 0.7) * 20 * a;
        fragment.el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
}

function animateMcDonalds() {
    if (mcdHalves.length === 0) return;
    activation.mcd = lerp(activation.mcd, hoverState.mcd ? 1 : 0, 0.07);
    const a = activation.mcd;

    mcdHalves.forEach((half) => {
        const angle = half.sign * 24 * a;
        const offsetX = half.sign * 16 * a;
        half.el.setAttribute(
            'transform',
            `translate(${mcdPivot.x + offsetX} ${mcdPivot.y}) rotate(${angle}) translate(${-mcdPivot.x} ${-mcdPivot.y})`
        );
    });
}

function animateNike() {
    if (nikeFragments.length === 0) return;
    activation.nike = lerp(activation.nike, hoverState.nike ? 1 : 0, 0.08);
    const a = activation.nike;

    nikeFragments.forEach((fragment, index) => {
        const dx = fragment.dir * 14 * a + sin(frameCount * 0.08 + index) * 6 * a;
        const dy = -fragment.dir * 5 * a + cos(frameCount * 0.06 + index) * 5 * a;
        fragment.el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
}

function animateAmazon() {
    if (amazonLetters.length === 0 && amazonSmile.length === 0) return;
    activation.amazon = lerp(activation.amazon, hoverState.amazon ? 1 : 0, 0.08);
    const a = activation.amazon;
    const center = (amazonLetters.length - 1) / 2;

    amazonLetters.forEach((letter, index) => {
        const dx = (index - center) * 8 * a;
        const dy = sin(frameCount * 0.06 + index * 0.8) * 6 * a;
        letter.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    const smileX = sin(frameCount * 0.04) * 24 * a;
    const smileY = 12 * a + cos(frameCount * 0.05) * 3 * a;
    amazonSmile.forEach((smile) => {
        smile.style.transform = `translate(${smileX}px, ${smileY}px)`;
    });
}

function animateGoogle() {
    if (googleLetters.length === 0) return;
    activation.google = lerp(activation.google, hoverState.google ? 1 : 0, 0.08);
    const a = activation.google;

    googleLetters.forEach((letter, index) => {
        const dir = index - 2.5;
        const dx = dir * 7 * a;
        const dy = (index % 2 === 0 ? -1 : 1) * 16 * a
            + sin(frameCount * 0.07 + index) * 3 * a;
        const rot = dir * 4 * a;
        letter.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;

        const colorIndex = Math.floor((frameCount * 0.1) + (index * 1.2)) % 4;
        letter.setAttribute('fill', googleColors[colorIndex]);
    });
}
