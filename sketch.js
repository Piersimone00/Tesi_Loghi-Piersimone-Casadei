let applePath, colaPath, mcdPath, nikePath, amazonGroup;
let googleLetters = [];
let googlePrism = null;
const googleColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

let appleFragments = [];
let appleCenter = { x: 0, y: 0 };
let colaFragments = [];
let mcdHalves = [];
let mcdFries = null;
let nikeFragments = [];
let nikePivot = { x: 0, y: 0 };
let amazonLetters = [];
let amazonSmile = [];
let amazonConnector = [];
let amazonBaseline = 0;
let amazonMorph = 0;
let amazonArrowTarget = 0;

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
    const overlap = 12;
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
            use.setAttribute('stroke', '#333');
            use.setAttribute('stroke-width', '3');
            use.setAttribute('stroke-linejoin', 'round');
            const wrapper = document.createElementNS(SVG_NS, 'g');
            wrapper.appendChild(use);
            group.appendChild(wrapper);
            appleFragments.push({
                el: wrapper,
                cx: bbox.x + (col + 0.5) * tileW,
                cy: bbox.y + (row + 0.5) * tileH,
                phase: row * cols + col,
                fixed: row === 0
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

    mcdFries = document.getElementById('mcd-fries');
    if (mcdFries) {
        mcdFries.style.transformOrigin = '150px 200px';
    }
}

function setupNike() {
    if (!nikePath) return;
    const svg = document.getElementById('nike-logo');
    if (!svg) return;

    const bbox = nikePath.getBBox();
    const slices = 12;
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
        const t = (slices - 1 - i) / (slices - 1);
        nikeFragments.push({
            el: wrapper,
            spread: t * 22,
            lift: t * 18,
            drift: (i - slices / 2) * 0.6
        });
    }

    nikePivot = { x: bbox.x + bbox.width * 0.1, y: bbox.y + bbox.height * 0.86 };
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
            const connector = parseAmazonConnector(path.getAttribute('d'));
            const points = [connector.start];
            connector.segments.forEach((segment) => {
                points.push(segment.c1, segment.c2, segment.end);
            });
            const isBand = index === 6;
            let targets = null;
            if (isBand) {
                const bbox = path.getBBox();
                amazonBaseline = bbox.y + bbox.height / 2;
                const halfThickness = bbox.height * 0.17;
                const top = amazonBaseline - halfThickness;
                const bottom = amazonBaseline + halfThickness;
                targets = [
                    amazonBaseline,
                    bottom, bottom, bottom,
                    bottom, bottom, bottom,
                    bottom, top, top,
                    top, top, top,
                    top, top, top,
                    top, top, amazonBaseline
                ];
            }
            amazonConnector.push({
                el: path,
                points,
                straight: isBand,
                targets,
                flatten: isBand ? 0 : 0.42
            });
        }
    });

    const svg = document.getElementById('amazon-logo');
    if (svg) {
        const card = svg.closest('.logo-card, .preview-card') || svg;
        card.addEventListener('pointerenter', () => {
            amazonArrowTarget = amazonArrowTarget ? 0 : 1;
        });
    }
}

function parseAmazonConnector(d) {
    const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
    const segments = [];
    let start = { x: 0, y: 0 };
    let x = 0;
    let y = 0;
    let index = 0;
    let command = null;

    while (index < tokens.length) {
        if (/[a-zA-Z]/.test(tokens[index])) {
            command = tokens[index++];
        }

        if (command === 'm' || command === 'M') {
            const nx = parseFloat(tokens[index++]);
            const ny = parseFloat(tokens[index++]);
            x = command === 'm' ? x + nx : nx;
            y = command === 'm' ? y + ny : ny;
            start = { x, y };
            command = null;
        } else if (command === 'c' || command === 'C') {
            const c1x = parseFloat(tokens[index++]);
            const c1y = parseFloat(tokens[index++]);
            const c2x = parseFloat(tokens[index++]);
            const c2y = parseFloat(tokens[index++]);
            const ex = parseFloat(tokens[index++]);
            const ey = parseFloat(tokens[index++]);
            const c1 = { x: command === 'c' ? x + c1x : c1x, y: command === 'c' ? y + c1y : c1y };
            const c2 = { x: command === 'c' ? x + c2x : c2x, y: command === 'c' ? y + c2y : c2y };
            const end = { x: command === 'c' ? x + ex : ex, y: command === 'c' ? y + ey : ey };
            segments.push({ c1, c2, end });
            x = end.x;
            y = end.y;
        } else {
            index++;
        }
    }

    return { start, segments };
}

function updateAmazonConnector() {
    if (amazonConnector.length === 0) return;

    amazonConnector.forEach((item) => {
        const yValues = item.points.map((point, index) => {
            if (item.straight) {
                const target = item.targets[index];
                return point.y + (target - point.y) * amazonMorph;
            }
            const scale = 1 - item.flatten * amazonMorph;
            return amazonBaseline + (point.y - amazonBaseline) * scale;
        });
        let d = `M ${item.points[0].x.toFixed(2)} ${yValues[0].toFixed(2)}`;

        for (let i = 1; i < item.points.length; i += 3) {
            d += ` C ${item.points[i].x.toFixed(2)} ${yValues[i].toFixed(2)}`
                + ` ${item.points[i + 1].x.toFixed(2)} ${yValues[i + 1].toFixed(2)}`
                + ` ${item.points[i + 2].x.toFixed(2)} ${yValues[i + 2].toFixed(2)}`;
        }

        item.el.setAttribute('d', d);
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
    googlePrism = document.getElementById('g-prism');
}

function animateApple() {
    if (appleFragments.length === 0) return;
    activation.apple = lerp(activation.apple, hoverState.apple ? 1 : 0, 0.08);
    const a = activation.apple;

    appleFragments.forEach((fragment) => {
        if (fragment.fixed) {
            fragment.el.style.transform = '';
            return;
        }
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
    if (!mcdPath) return;
    activation.mcd = lerp(activation.mcd, hoverState.mcd ? 1 : 0, 0.08);
    const a = activation.mcd;

    mcdPath.style.opacity = String(1 - a);
    mcdPath.style.transformOrigin = '150px 200px';
    mcdPath.style.transform = `scale(${1 - 0.15 * a}) translateY(${10 * a}px)`;

    if (mcdFries) {
        mcdFries.style.opacity = String(a);
        const s = 0.7 + 0.3 * a;
        mcdFries.style.transform = `translateY(${18 * (1 - a)}px) scale(${s})`;
    }
}

function animateNike() {
    if (nikeFragments.length === 0) return;
    activation.nike = lerp(activation.nike, hoverState.nike ? 1 : 0, 0.06);
    const a = activation.nike;

    nikeFragments.forEach((fragment, index) => {
        const p = constrain(a * 1.35 - index * 0.045, 0, 1);
        const e = p * p * (3 - 2 * p);
        const angle = -fragment.spread * e;
        const lift = -fragment.lift * e;
        const dx = fragment.drift * e;
        fragment.el.setAttribute(
            'transform',
            `translate(${nikePivot.x} ${nikePivot.y}) rotate(${angle}) translate(${-nikePivot.x} ${-nikePivot.y}) translate(${dx} ${lift})`
        );
    });
}

function animateAmazon() {
    if (amazonLetters.length === 0 && amazonSmile.length === 0) return;
    amazonMorph = lerp(amazonMorph, amazonArrowTarget, 0.08);
    updateAmazonConnector();
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

    googleLetters.forEach((letter) => {
        letter.style.opacity = String(1 - a);
        letter.style.transform = '';
    });

    if (googlePrism) {
        googlePrism.style.opacity = String(a);
    }
}
