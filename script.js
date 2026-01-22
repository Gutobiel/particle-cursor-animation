let THICKNESS = Math.pow(80, 2),
  SPACING = 4,
  DRAG = 0.95,
  EASE = 0.25,
  container,
  canvas,
  coords,
  list = [],
  ctx,
  man = false,
  mx = 0, my = 0,
  w, h;

const TEXT = "GUTOBIELSANTOS";
const SUB_TEXT = "Desenvolvedor Fullstack";

async function init() {
  if (document.fonts) {
    await document.fonts.ready;
  }

  container = document.getElementById('container');
  coords = document.getElementById('coords');

  if (!canvas) {
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
  }

  ctx = canvas.getContext('2d');

  resize();

  window.addEventListener('resize', resize);

  container.addEventListener('mousemove', function (e) {
    const bounds = container.getBoundingClientRect();
    mx = e.clientX - bounds.left;
    my = e.clientY - bounds.top;
    man = true;
  });

  container.addEventListener('mouseleave', function (e) {
    man = false;
  });

  step();
}

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  container.style.marginLeft = Math.round(w * -0.5) + 'px';
  container.style.marginTop = Math.round(h * -0.5) + 'px';

  sampleText();
}

function sampleText() {
  const offscreen = document.createElement('canvas');
  const octx = offscreen.getContext('2d');
  offscreen.width = w;
  offscreen.height = h;

  const fontSize = Math.min(w / 6, h / 3);
  const subFontSize = fontSize * 0.25;

  octx.fillStyle = '#000';
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';

  // Draw Main Text
  octx.font = `bold ${fontSize}px Intro, sans-serif`;
  octx.fillText(TEXT, w / 2, h / 2 - subFontSize);

  // Draw Sub Text
  octx.font = `300 ${subFontSize}px Intro, sans-serif`;
  octx.fillText(SUB_TEXT, w / 2, h / 2 + fontSize * 0.4);

  const data = octx.getImageData(0, 0, w, h).data;
  list = [];

  for (let y = 0; y < h; y += SPACING) {
    for (let x = 0; x < w; x += SPACING) {
      const alpha = data[((y * w) + x) * 4 + 3];
      if (alpha > 128) {
        list.push({
          x: x,
          y: y,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
          size: 1.5,
          c1: 50,
          c2: 50,
          c3: 50
        });
      }
    }
  }
}

function step() {
  ctx.clearRect(0, 0, w, h);

  if (!man) {
    const t = +new Date() * 0.001;
    mx = w * 0.5 + (Math.cos(t) * w * 0.25);
    my = h * 0.5 + (Math.sin(t) * h * 0.25);
  }

  for (let i = 0, n = list.length; i < n; i++) {
    const p = list[i];

    const dx = mx - p.x;
    const dy = my - p.y;
    const d = dx * dx + dy * dy;
    const f = -THICKNESS / d;

    if (d < THICKNESS) {
      const t = Math.atan2(dy, dx);
      p.vx += f * Math.cos(t);
      p.vy += f * Math.sin(t);

      // Neon Blue interaction
      p.c1 = 0;
      p.c2 = 242;
      p.c3 = 255;
    } else {
      // Fade back to dark gray
      p.c1 += (50 - p.c1) * 0.05;
      p.c2 += (50 - p.c2) * 0.05;
      p.c3 += (50 - p.c3) * 0.05;
    }

    p.vx *= DRAG;
    p.vy *= DRAG;

    p.x += p.vx + (p.ox - p.x) * EASE;
    p.y += p.vy + (p.oy - p.y) * EASE;

    ctx.fillStyle = `rgb(${Math.floor(p.c1)}, ${Math.floor(p.c2)}, ${Math.floor(p.c3)})`;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }

  if (coords) {
    coords.innerHTML = `X=${Math.round(mx)} Y=${Math.round(my)}`;
  }

  requestAnimationFrame(step);
}

init();