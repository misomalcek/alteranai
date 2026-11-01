/**
 * Mycelial canvases, ported from the design-system prototype
 * (~/content/alteranai-design/alteranai-design-system-v2). No dependencies.
 *
 *   canvas[data-myc="tree|field|mecha"]  growing networks; data-static stops motion
 *   canvas[data-cover]                   article cover: the title seeds it, tags tint it,
 *                                        so the same article always draws the same image
 *   pointer bursts + cursor glow          desktop only, off under reduced motion
 */

type Pt = [number, number];
interface Path { p: Pt[]; d: number; col: string; pulses: number[]; sp: number; sq?: boolean }

const COLS = ['0,239,252', '158,119,255', '0,255,157'];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function mount(c: HTMLCanvasElement) {
  const ctx = c.getContext('2d');
  if (!ctx) return;
  const mode = c.dataset.myc;
  const lite = !!c.dataset.lite || innerWidth < 760;
  let seed = Number(c.dataset.seed) || 1;
  let W = 0, H = 0, paths: Path[] = [];
  const rng = () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const grow = (x: number, y: number, a: number, len: number, d: number, col: string) => {
    const p: Pt[] = [[x, y]];
    const n = Math.floor(len / 13);
    for (let i = 0; i < n; i++) {
      a += (rng() - 0.5) * 0.55; x += Math.cos(a) * 13; y += Math.sin(a) * 13; p.push([x, y]);
      if (d < (lite ? 3 : 4) && i > 2 && rng() < 0.12) {
        grow(x, y, a + (rng() < 0.5 ? -1 : 1) * (0.4 + rng() * 0.7), len * 0.62, d + 1, rng() < 0.2 ? COLS[1 + ((rng() * 2) | 0)] : col);
      }
    }
    paths.push({ p, d, col, pulses: d < 2 && rng() < 0.45 ? [rng()] : [], sp: 0.05 + rng() * 0.05 });
  };
  const build = () => {
    paths = []; seed = Number(c.dataset.seed) || 1;
    if (mode === 'tree') {
      const k = lite ? 2 : 4;
      for (let i = 0; i < k; i++) grow(W * (0.3 + 0.4 * rng()), H, -Math.PI / 2 + (rng() - 0.5) * 0.8, H * 0.75, 0, COLS[0]);
    } else if (mode === 'field') {
      const k = Math.min(lite ? 5 : 12, 3 + ((W * H / 120000) | 0));
      for (let i = 0; i < k; i++) grow(rng() * W, rng() * H, rng() * 6.28, 150 + rng() * 140, 1, COLS[i % 3]);
    } else {
      const g = 36;
      for (let i = 0; i < 8; i++) {
        const p: Pt[] = [];
        let x = ((rng() * W) / g | 0) * g, y = ((rng() * H) / g | 0) * g, dir = rng() < 0.5 ? 0 : 1;
        p.push([x, y]);
        for (let j = 0; j < 9; j++) {
          const s = (rng() < 0.5 ? 1 : -1) * g * (1 + ((rng() * 3) | 0));
          if (dir) y += s; else x += s;
          dir = 1 - dir; p.push([x, y]);
        }
        paths.push({ p, d: 0, col: '213,0,249', pulses: [rng()], sp: 0.08, sq: true });
      }
    }
  };
  const size = () => {
    const r = c.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height; c.width = W * dpr; c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); build();
  };
  const draw = (dt: number) => {
    ctx.clearRect(0, 0, W, H); ctx.lineCap = 'round'; ctx.lineJoin = mode === 'mecha' ? 'miter' : 'round';
    for (const q of paths) {
      const p = q.p, n = p.length;
      if (n < 2) continue;
      ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < n; i++) ctx.lineTo(p[i][0], p[i][1]);
      ctx.strokeStyle = `rgba(${q.col},${q.sq ? 0.22 : 0.28 - q.d * 0.03})`;
      ctx.lineWidth = q.sq ? 1 : Math.max(1, 3.2 - q.d * 0.6); ctx.stroke();
      for (let k = 0; k < q.pulses.length; k++) {
        if (!reduce) { q.pulses[k] += q.sp * dt; if (q.pulses[k] > 1.1) q.pulses[k] = -rng() * 1.2; }
        const t = q.pulses[k];
        if (t < 0 || t > 1) continue;
        const a = Math.max(0, Math.floor(t * (n - 1) - 4)), b = Math.min(n - 1, Math.floor(t * (n - 1)));
        if (b <= a) continue;
        ctx.beginPath(); ctx.moveTo(p[a][0], p[a][1]);
        for (let i = a + 1; i <= b; i++) ctx.lineTo(p[i][0], p[i][1]);
        ctx.strokeStyle = `rgba(${q.col},.18)`; ctx.lineWidth = 8; ctx.stroke();
        ctx.strokeStyle = `rgba(${q.col},.9)`; ctx.lineWidth = 2.4; ctx.stroke();
      }
    }
  };
  let last = 0, vis = true;
  const loop = (ts: number) => {
    requestAnimationFrame(loop);
    if (!vis || ts - last < 33) return;
    const dt = Math.min(0.1, (ts - last) / 1000); last = ts; draw(dt);
  };
  new IntersectionObserver((e) => { vis = e[0].isIntersecting; }).observe(c);
  new ResizeObserver(() => { size(); draw(0); }).observe(c);
  size(); draw(0);
  if (!reduce && !c.dataset.static) requestAnimationFrame(loop);
}

function cover(c: HTMLCanvasElement) {
  const ctx = c.getContext('2d');
  if (!ctx) return;
  const draw = () => {
    const r = c.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2), W = r.width, H = r.height;
    if (!W) return;
    c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let h = 2166136261;
    for (const ch of c.dataset.title ?? '') h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    let s = h >>> 0;
    const rng = () => { s = (Math.imul(s ^ (s >>> 15), 2246822507) + 0x9E3779B9) | 0; return ((s ^ (s >>> 13)) >>> 0) / 4294967296; };
    const cols = (c.dataset.cols ?? COLS.join(';')).split(';');
    ctx.fillStyle = '#080C10'; ctx.fillRect(0, 0, W, H);
    cols.forEach((col) => {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.6), x = W * (0.1 + rng() * 0.8), y = H * (0.1 + rng() * 0.8);
      ctx.save(); ctx.translate(x, y);
      g.addColorStop(0, `rgba(${col},.5)`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.fillRect(-W, -H * 2, W * 2, H * 4); ctx.restore();
    });
    const n = 9 + cols.length * 4, pts: { x: number; y: number; r: number; c: string }[] = [];
    for (let i = 0; i < n; i++) pts.push({ x: rng() * W, y: rng() * H, r: 1.5 + rng() * 3.5, c: cols[i % cols.length] });
    ctx.lineWidth = 1;
    pts.forEach((a, i) => pts.forEach((b, j) => {
      if (j <= i) return;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < W * 0.3) {
        ctx.strokeStyle = `rgba(${a.c},${0.55 * (1 - d / (W * 0.3))})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo((a.x + b.x) / 2 + (rng() - 0.5) * 30, (a.y + b.y) / 2 + (rng() - 0.5) * 30, b.x, b.y); ctx.stroke();
      }
    }));
    pts.forEach((p) => {
      ctx.shadowColor = `rgb(${p.c})`; ctx.shadowBlur = 14; ctx.fillStyle = `rgb(${p.c})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    });
    ctx.shadowBlur = 0;
  };
  new ResizeObserver(draw).observe(c); draw();
}

function fx() {
  if (reduce || matchMedia('(pointer: coarse)').matches) return;
  const c = document.createElement('canvas');
  c.setAttribute('aria-hidden', 'true');
  c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:60';
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  if (!ctx) return;
  let W = 0, H = 0, raf = 0, mx = -999, my = -999, gx = -999, gy = -999, lastMove = 0;
  type Hypha = { pts: Pt[]; delay: number; col: string; w: number };
  let bursts: { x: number; y: number; t0: number; hs: Hypha[] }[] = [];
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  const hypha = (x: number, y: number, a: number, len: number, depth: number, delay: number, col: string, out: Hypha[]) => {
    const pts: Pt[] = [[x, y]]; const n = Math.floor(len / 6);
    for (let i = 0; i < n; i++) {
      a += (Math.random() - 0.5) * 0.5; x += Math.cos(a) * 6; y += Math.sin(a) * 6; pts.push([x, y]);
      if (depth < 2 && i > 3 && Math.random() < 0.09) {
        hypha(x, y, a + (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.6), len * 0.55, depth + 1, delay + (i / n) * 700,
          Math.random() < 0.3 ? COLS[(Math.random() * 3) | 0] : col, out);
      }
    }
    out.push({ pts, delay, col, w: 1.6 - depth * 0.4 });
  };
  const draw = (now: number) => {
    raf = 0; ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    gx += (mx - gx) * 0.18; gy += (my - gy) * 0.18;
    const show = Math.max(0, Math.min(1, 1 - (now - lastMove - 1200) / 600));
    if (show > 0 && gx > -500) {
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 170);
      g.addColorStop(0, `rgba(0,239,252,${0.16 * show})`); g.addColorStop(0.45, `rgba(158,119,255,${0.06 * show})`); g.addColorStop(1, 'rgba(0,239,252,0)');
      ctx.fillStyle = g; ctx.fillRect(gx - 170, gy - 170, 340, 340);
    }
    bursts = bursts.filter((b) => now - b.t0 < 2300);
    for (const b of bursts) {
      const age = now - b.t0, fade = 1 - Math.max(0, Math.min(1, (age - 1000) / 1300));
      for (const h of b.hs) {
        const p = Math.max(0, Math.min(1, (age - h.delay) / 900));
        if (p <= 0) continue;
        const e = 1 - Math.pow(1 - p, 2), m = Math.max(1, Math.floor(e * (h.pts.length - 1)));
        ctx.beginPath(); ctx.moveTo(h.pts[0][0], h.pts[0][1]);
        for (let i = 1; i <= m; i++) ctx.lineTo(h.pts[i][0], h.pts[i][1]);
        ctx.strokeStyle = `rgba(${h.col},${0.2 * fade})`; ctx.lineWidth = h.w * 5; ctx.stroke();
        ctx.strokeStyle = `rgba(${h.col},${0.9 * fade})`; ctx.lineWidth = h.w; ctx.stroke();
      }
    }
    if (bursts.length || show > 0) raf = requestAnimationFrame(draw);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    mx = e.clientX; my = e.clientY;
    if (gx < -500) { gx = mx; gy = my; }
    lastMove = performance.now(); kick();
  }, { passive: true });
  addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('a,button')) return;
    if (bursts.length > 3) bursts.shift();
    const hs: Hypha[] = [], k = 7 + ((Math.random() * 3) | 0), off = Math.random() * 6.28;
    for (let i = 0; i < k; i++) hypha(e.clientX, e.clientY, off + (i / k) * 6.283 + (Math.random() - 0.5) * 0.4, 70 + Math.random() * 110, 0, Math.random() * 120, COLS[i % 3], hs);
    bursts.push({ x: e.clientX, y: e.clientY, t0: performance.now(), hs }); kick();
  }, { passive: true });
  addEventListener('resize', size);
}

function reveal() {
  if (reduce) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target as HTMLElement;
    el.style.opacity = '1'; el.style.transform = 'none'; io.unobserve(el);
  }), { threshold: 0.06 });
  const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
    // Only what starts below the fold animates; the first screen is never hidden.
    .filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
  els.forEach((el) => {
    el.style.opacity = '0'; el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)';
    io.observe(el);
  });
  // Content must never depend on an observer firing: crawlers, link previews and
  // full-page captures do not scroll. Anything still hidden after 2.5 s is shown.
  setTimeout(() => els.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; }), 2500);
}

document.querySelectorAll<HTMLCanvasElement>('canvas[data-myc]').forEach(mount);
document.querySelectorAll<HTMLCanvasElement>('canvas[data-cover]').forEach(cover);
reveal();
fx();
