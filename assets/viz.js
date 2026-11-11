/* ===== 共用圖形元件（1-2 之後的單元用） =====
   Tiles 巧克力代數磚、areaBox 面積長方形、longDiv 直式除法、
   numLine 數線、pythag 直角三角形＋三個正方形、dotGrid 方格點、coord 坐標平面 */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const C = {
    choco: '#8a5a3c', milk: '#e9cfa6', berry: '#f28fad', matcha: '#8cc084', orange: '#f6a54b', blue: '#9aa8f5',
    edge: '#5b3a26', red: '#d6452f'
  };
  function box(host, w, h, cls) {
    const wrap = Lesson.h('<div class="choco-wrap"></div>');
    host.appendChild(wrap);
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('class', 'choco ' + (cls || ''));
    svg.setAttribute('role', 'img');
    wrap.appendChild(svg);
    return svg;
  }
  function el(tag, attrs, parent, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  const T = (svg, x, y, s, o) => el('text', Object.assign({ x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'ruler-t' }, o || {}), svg, s);
  const L = (svg, s, o) => el('text', Object.assign({ 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'region-label' }, o || {}), svg, s);
  function raw(host, w, h, inner) { const s = box(host, w, h); s.innerHTML = inner; return s; }

  /* =========================================================
     巧克力代數磚
     大方塊 = x²（巧克力色）、長條 = x（橘子）、小顆 = 1（抹茶）
     負的（欠的）= 虛線紅框空心
     items: [{k:'x2'|'x'|'1'|'y', n:個數, neg:bool}] 依序排成一組一組
     opts: {width, gap, labels(每組下方寫字), group(true=各組分開)}
     ========================================================= */
  const SZ = { x2: [52, 52], x: [16, 52], '1': [16, 16], y: [16, 36], y2: [36, 36], xy: [36, 52] };
  const COL = { x2: C.choco, x: C.orange, '1': C.matcha, y: C.blue, y2: C.berry, xy: C.milk };
  function Tiles(host, items, opts) {
    const o = opts || {};
    const W = o.width || 340;
    const gapIn = 4, gapGroup = o.groupGap || 18;
    // 先排版
    let x = 10, y = 14, rowH = 0;
    const placed = [];
    const groups = [];
    const newRow = () => { x = 10; y += rowH + gapIn + (o.labels ? 24 : 6); rowH = 0; };
    items.forEach((it, gi) => {
      const [w, h] = SZ[it.k];
      const gw = it.n * (w + gapIn) - gapIn;
      // 整組放得進一行，但這一行剩下的位置不夠 → 整組換行
      if (x > 10 && x + gw > W - 10 && gw <= W - 20) newRow();
      let segX0 = x, gMaxX = x, gMaxY = y;
      for (let i = 0; i < it.n; i++) {
        if (x + w > W - 10) { newRow(); segX0 = x; }
        placed.push({ k: it.k, neg: !!it.neg, x, y, w, h, gi });
        gMaxX = x + w; gMaxY = Math.max(gMaxY, y + h);
        x += w + gapIn; rowH = Math.max(rowH, h);
      }
      groups.push({ x0: segX0, x1: gMaxX, y1: gMaxY, it });
      x += gapGroup - gapIn;
    });
    const H = y + rowH + 14 + (o.labels ? 26 : 0);
    const svg = box(host, W, Math.max(H, 40));
    const nodes = placed.map(p => {
      const g = el('g', { class: 'tile' + (p.neg ? ' neg' : '') }, svg);
      if (p.neg) {
        el('rect', { x: p.x + 1, y: p.y + 1, width: p.w - 2, height: p.h - 2, rx: 4, fill: '#fff', 'fill-opacity': .55, stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, g);
        el('text', { x: p.x + p.w / 2, y: p.y + p.h / 2 + 1, 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: C.red, 'font-weight': 800, 'font-size': Math.min(16, p.w) }, g, '−');
      } else {
        el('rect', { x: p.x + 1, y: p.y + 1, width: p.w - 2, height: p.h - 2, rx: 4, fill: COL[p.k], stroke: C.edge, 'stroke-width': 1.5 }, g);
        el('rect', { x: p.x + 3, y: p.y + 3, width: p.w - 6, height: Math.max(2, (p.h - 6) * .22), rx: 2, fill: '#fff', opacity: .22 }, g);
      }
      g.style.transformOrigin = `${p.x + p.w / 2}px ${p.y + p.h / 2}px`;
      g.style.transition = 'transform .4s, opacity .4s';
      return Object.assign({ g }, p);
    });
    if (o.labels) groups.forEach((gr, i) => {
      const s = typeof o.labels === 'function' ? o.labels(gr.it, i) : o.labels[i];
      if (s) T(svg, (gr.x0 + gr.x1) / 2, gr.y1 + 16, s, { style: 'font-style:normal;font-size:15px' });
    });
    const api = {
      svg, nodes,
      // 點出所有某一種磚：kind 可以是 'x' 或 函式
      pick(kind, onDone, onWrong) {
        const want = typeof kind === 'function' ? kind : (n => n.k === kind);
        const need = nodes.filter(want).length;
        let got = 0;
        nodes.forEach(n => {
          n.g.style.cursor = 'pointer';
          n.g.addEventListener('click', () => {
            if (n.picked) return;
            if (want(n)) {
              n.picked = true; got++;
              n.g.style.transform = 'translateY(-6px) scale(1.06)';
              n.g.querySelector('rect').setAttribute('stroke', '#e0a95a');
              n.g.querySelector('rect').setAttribute('stroke-width', 4);
              if (got === need && onDone) onDone();
            } else {
              n.g.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 300 });
              onWrong && onWrong(n);
            }
          });
        });
      },
      // 正負一對對抵消（同種類）
      async cancel() {
        const kinds = ['x2', 'x', '1', 'y', 'y2', 'xy'];
        for (const k of kinds) {
          const pos = nodes.filter(n => n.k === k && !n.neg && !n.gone);
          const neg = nodes.filter(n => n.k === k && n.neg && !n.gone);
          const m = Math.min(pos.length, neg.length);
          for (let i = 0; i < m; i++) {
            [pos[i], neg[i]].forEach(n => { n.gone = true; n.g.style.opacity = 0; n.g.style.transform = 'scale(.2) rotate(30deg)'; });
            await Lesson.sleep(160);
          }
        }
      },
      flash(filter) {
        nodes.filter(filter).forEach(n => n.g.animate([{ opacity: 1 }, { opacity: .25 }, { opacity: 1 }], { duration: 500, iterations: 3 }));
      }
    };
    return api;
  }
  // 把多項式係數變成磚：{x2:3, x:-2, c:4}
  function polyTiles(host, p, opts) {
    const items = [];
    const push = (k, v) => { if (v) items.push({ k, n: Math.abs(v), neg: v < 0 }); };
    push('x2', p.x2); push('x', p.x); push('1', p.c);
    return Tiles(host, items, opts);
  }
  // 圖例
  function legend(host, extra) {
    const s = box(host, 340, 70);
    const items = [['x2', 'x²'], ['x', 'x'], ['1', '1']].concat(extra || []);
    let x = 14;
    items.forEach(([k, t]) => {
      const [w, h] = SZ[k];
      const sc = Math.min(1, 46 / h);
      el('rect', { x, y: 35 - h * sc / 2, width: w * sc, height: h * sc, rx: 4, fill: COL[k], stroke: C.edge, 'stroke-width': 1.5 }, s);
      T(s, x + w * sc + 22, 35, t, { style: 'font-size:17px' });
      x += w * sc + 62;
    });
    // 負的
    el('rect', { x, y: 27, width: 16, height: 16, rx: 4, fill: '#fff', stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, s);
    T(s, x + 46, 35, '欠一個', { style: 'font-size:15px;font-style:normal' });
    return s;
  }

  /* =========================================================
     面積長方形：cols/rows = [{t:'x', w:相對寬}]；cells[r][c] = {t, fill}
     opts: {top: 上方標籤是否顯示, title}
     ========================================================= */
  function areaBox(host, cols, rows, cells, opts) {
    const o = opts || {};
    const W = 340, padL = 58, padT = 34;
    const tw = cols.reduce((a, c) => a + c.w, 0), th = rows.reduce((a, r) => a + r.w, 0);
    const scale = Math.min((W - padL - 14) / tw, (o.maxH || 230) / th);
    const H = padT + th * scale + 14;
    const svg = box(host, W, H);
    let y = padT;
    rows.forEach((r, ri) => {
      let x = padL;
      const rh = r.w * scale;
      cols.forEach((c, ci) => {
        const cw = c.w * scale;
        const cell = (cells[ri] || [])[ci] || {};
        el('rect', { x: x + 1, y: y + 1, width: cw - 2, height: rh - 2, rx: 6, fill: cell.fill || C.milk, stroke: C.edge, 'stroke-width': 2, 'stroke-dasharray': cell.dash ? '6 4' : 'none', 'fill-opacity': cell.dash ? .35 : 1 }, svg);
        if (cell.t) L(svg, cell.t, { x: x + cw / 2, y: y + rh / 2, 'font-size': Math.max(12, Math.min(19, Math.min(cw, rh) / 2.4)) });
        if (ri === 0) T(svg, x + cw / 2, padT - 14, c.t, { fill: c.color || 'currentColor' });
        x += cw;
      });
      T(svg, padL - 16, y + rh / 2, r.t, { 'text-anchor': 'end' });
      y += rh;
    });
    return svg;
  }

  /* =========================================================
     直式除法（分格）
     spec: {div:'x+2', q:[...], rows:[[...] 或 {line:true, cells:[...]}], cols:n, hl:[[row,col]]}
     每格字串會被 KaTeX 處理（自動包 \( \)）
     ========================================================= */
  function longDiv(host, spec) {
    const n = spec.cols;
    const wrap = Lesson.h('<div class="ldiv-wrap"></div>');
    host.appendChild(wrap);
    const g = document.createElement('div');
    g.className = 'ldiv';
    g.style.gridTemplateColumns = `auto repeat(${n}, auto)`;
    wrap.appendChild(g);
    const m = s => (s == null || s === '' ? '' : `\\(${s}\\)`);
    const cell = (s, cls) => { const d = document.createElement('div'); d.className = cls || ''; d.innerHTML = m(s); g.appendChild(d); return d; };
    // 商
    cell('');
    for (let i = 0; i < n; i++) cell((spec.q || [])[i], 'qt');
    // 除式 ) 被除式
    const rows = spec.rows || [];
    rows.forEach((row, ri) => {
      const cells = Array.isArray(row) ? row : row.cells;
      const line = !Array.isArray(row) && row.line;
      cell(ri === 0 ? spec.div : '', ri === 0 ? 'dv' : '');
      for (let i = 0; i < n; i++) {
        let cls = '';
        if (ri === 0) cls += ' bt' + (i === 0 ? ' bl' : '');
        if (line) cls += ' bt';
        if ((spec.hl || []).some(([a, b]) => a === ri && b === i)) cls += ' hl';
        cell(cells[i], cls);
      }
    });
    JH.renderMath(wrap);
    return g;
  }

  /* =========================================================
     數線：{from, to, ticks:[數字], labels:{值:字}, points:[{v, t, color}], band:[a,b]}
     ========================================================= */
  function numLine(host, o) {
    const W = 340, H = o.h || 100, x0 = 24, x1 = W - 24, y = H - 46;
    const svg = box(host, W, H);
    const X = v => x0 + (v - o.from) / (o.to - o.from) * (x1 - x0);
    if (o.band) el('rect', { x: X(o.band[0]), y: y - 10, width: X(o.band[1]) - X(o.band[0]), height: 20, fill: '#f6a54b', opacity: .35, rx: 4 }, svg);
    el('line', { x1: x0 - 10, y1: y, x2: x1 + 10, y2: y, stroke: 'currentColor', 'stroke-width': 2, class: 'axis' }, svg).style.color = 'var(--ink)';
    (o.ticks || []).forEach(v => {
      el('line', { x1: X(v), y1: y - 7, x2: X(v), y2: y + 7, stroke: 'var(--muted)', 'stroke-width': 1.5 }, svg);
      const lab = o.labels && o.labels[v] != null ? o.labels[v] : String(v);
      if (lab !== '') T(svg, X(v), y + 22, lab, { style: 'font-style:normal;font-size:14px' });
    });
    (o.points || []).forEach((p, i) => {
      el('circle', { cx: X(p.v), cy: y, r: 7, fill: p.color || C.red, stroke: '#fff', 'stroke-width': 2 }, svg);
      if (p.t) T(svg, X(p.v), y - 22 - (p.up || 0), p.t, { fill: p.color || C.red, style: 'font-style:normal;font-size:15px' });
    });
    return svg;
  }

  /* =========================================================
     直角三角形＋三邊的正方形
     a = 底（橫），b = 高（直），直角在左下
     opts: {tiles:true(畫格子，需整數), la, lb, lc(邊上文字), sq:[a面積字, b面積字, c面積字], squares:true}
     ========================================================= */
  function pythag(host, a, b, opts) {
    const o = Object.assign({ squares: true, tiles: true }, opts || {});
    const c = Math.hypot(a, b);
    // 數學座標的範圍
    const minX = o.squares ? -b : 0, maxX = o.squares ? a + b : a;
    const minY = o.squares ? -a : 0, maxY = o.squares ? a + b : b;
    const W = 340, H0 = o.squares ? 320 : 230, pad = o.squares ? 26 : 40;
    const sc = Math.min((W - pad * 2) / (maxX - minX), (H0 - pad * 2) / (maxY - minY));
    const H = (maxY - minY) * sc + pad * 2;
    const svg = box(host, W, H);
    const P = (x, y) => [pad + (x - minX) * sc + ((W - pad * 2) - (maxX - minX) * sc) / 2, H - pad - (y - minY) * sc];
    const poly = (pts, attrs) => el('polygon', Object.assign({ points: pts.map(p => P(...p).join(',')).join(' ') }, attrs), svg);
    const line = (p, q, attrs) => { const A = P(...p), B = P(...q); return el('line', Object.assign({ x1: A[0], y1: A[1], x2: B[0], y2: B[1] }, attrs), svg); };
    const grid = { stroke: '#5b3a26', 'stroke-width': 1, opacity: .35 };
    if (o.squares) {
      // 底邊下方的正方形（a×a）
      poly([[0, 0], [a, 0], [a, -a], [0, -a]], { fill: C.orange, stroke: C.edge, 'stroke-width': 2 });
      // 左邊的正方形（b×b）
      poly([[0, 0], [0, b], [-b, b], [-b, 0]], { fill: C.matcha, stroke: C.edge, 'stroke-width': 2 });
      // 斜邊外側的正方形
      const A = [a, 0], B = [0, b], n = [b, a];
      poly([A, B, [B[0] + n[0], B[1] + n[1]], [A[0] + n[0], A[1] + n[1]]], { fill: C.berry, stroke: C.edge, 'stroke-width': 2 });
      if (o.tiles) {
        for (let i = 1; i < a; i++) { line([i, 0], [i, -a], grid); line([0, -i], [a, -i], grid); }
        for (let i = 1; i < b; i++) { line([0, i], [-b, i], grid); line([-i, 0], [-i, b], grid); }
        if (Math.abs(c - Math.round(c)) < 1e-9) {
          const cc = Math.round(c);
          for (let i = 1; i < cc; i++) {
            const t = i / cc;
            const p = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
            line(p, [p[0] + n[0], p[1] + n[1]], grid);
            const q = [A[0] + n[0] * t, A[1] + n[1] * t];
            line(q, [q[0] + (B[0] - A[0]), q[1] + (B[1] - A[1])], grid);
          }
        }
      }
      const sq = o.sq || [];
      const lab = (s, x, y) => { if (s) { const [X, Y] = P(x, y); L(svg, s, { x: X, y: Y, 'font-size': 18 }); } };
      lab(sq[0], a / 2, -a / 2); lab(sq[1], -b / 2, b / 2); lab(sq[2], (a + b) / 2, (a + b) / 2);
    }
    // 三角形本體
    poly([[0, 0], [a, 0], [0, b]], { fill: '#fff7e8', stroke: C.edge, 'stroke-width': 2.5 });
    const r = Math.min(a, b) * .18;
    poly([[0, 0], [r, 0], [r, r], [0, r]], { fill: 'none', stroke: C.edge, 'stroke-width': 1.5 });
    const side = (s, x, y) => { if (s) { const [X, Y] = P(x, y); T(svg, X, Y, s, { style: 'font-size:16px' }); } };
    if (!o.squares) {
      // 沒有正方形時，用像素位移把字放在邊的外側（才不會跑出畫面）
      const px = (s, x, y, dx, dy, anchor) => { if (s) { const [X, Y] = P(x, y); T(svg, X + dx, Y + dy, s, { style: 'font-size:17px', 'text-anchor': anchor || 'middle' }); } };
      const len = Math.hypot(a, b), nx = b / len, ny = a / len; // 斜邊往外的方向（數學座標）
      px(o.la, a / 2, 0, 0, 16);
      px(o.lb, 0, b / 2, -8, 0, 'end');
      px(o.lc, a / 2, b / 2, nx * 16, -ny * 16, 'start');
    } else {
      side(o.la, a / 2, .4); side(o.lb, .45, b / 2); side(o.lc, a / 2 - .35, b / 2 - .35);
    }
    return svg;
  }

  /* =========================================================
     方格點：cols×rows 個格子（點在格線交叉）
     segs: [{from:[x,y], to:[x,y], t, color, legs:true(畫出直角三角形的兩股)}]
     ========================================================= */
  function dotGrid(host, cols, rows, segs, opts) {
    const o = opts || {};
    const S = o.cell || Math.min(56, Math.floor(280 / Math.max(cols, rows)));
    const pad = 30, W = cols * S + pad * 2, H = rows * S + pad * 2;
    const svg = box(host, W, H);
    const P = (x, y) => [pad + x * S, H - pad - y * S];
    for (let i = 0; i <= cols; i++) { const [x1, y1] = P(i, 0), [x2, y2] = P(i, rows); el('line', { x1, y1, x2, y2, stroke: 'var(--line)', 'stroke-width': 1 }, svg); }
    for (let j = 0; j <= rows; j++) { const [x1, y1] = P(0, j), [x2, y2] = P(cols, j); el('line', { x1, y1, x2, y2, stroke: 'var(--line)', 'stroke-width': 1 }, svg); }
    (segs || []).forEach(s => {
      const [x1, y1] = P(...s.from), [x2, y2] = P(...s.to);
      if (s.legs) {
        const [cx, cy] = P(s.to[0], s.from[1]);
        el('polygon', { points: `${x1},${y1} ${cx},${cy} ${x2},${y2}`, fill: '#f6a54b', opacity: .3 }, svg);
        el('line', { x1, y1, x2: cx, y2: cy, stroke: C.orange, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, svg);
        el('line', { x1: cx, y1: cy, x2, y2, stroke: C.matcha, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, svg);
        if (s.lx) T(svg, (x1 + cx) / 2, cy + (cy > y2 ? 16 : -12), s.lx, { fill: '#c0561f' });
        if (s.ly) T(svg, cx + (cx > x1 ? 14 : -14), (cy + y2) / 2, s.ly, { fill: '#3f7f3a' });
      }
      el('line', { x1, y1, x2, y2, stroke: s.color || C.red, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, svg);
      if (s.t) T(svg, (x1 + x2) / 2 - 12, (y1 + y2) / 2 - 12, s.t, { fill: s.color || C.red });
    });
    for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) { const [x, y] = P(i, j); el('circle', { cx: x, cy: y, r: 3.5, fill: 'var(--ink)' }, svg); }
    (o.marks || []).forEach(m => { const [x, y] = P(m.p[0], m.p[1]); el('circle', { cx: x, cy: y, r: 6, fill: C.red }, svg); T(svg, x + 12, y - 12, m.t); });
    return svg;
  }

  /* =========================================================
     坐標平面：{xr:[-5,5], yr:[-5,5], pts:[{p:[x,y], t}], segs:[{a,b,legs}]}
     ========================================================= */
  function coord(host, o) {
    const [xa, xb] = o.xr, [ya, yb] = o.yr;
    const S = Math.min(30, Math.floor(300 / Math.max(xb - xa, yb - ya)));
    const pad = 22, W = (xb - xa) * S + pad * 2, H = (yb - ya) * S + pad * 2;
    const svg = box(host, W, H);
    const P = (x, y) => [pad + (x - xa) * S, pad + (yb - y) * S];
    for (let i = xa; i <= xb; i++) { const [x1, y1] = P(i, ya), [x2, y2] = P(i, yb); el('line', { x1, y1, x2, y2, stroke: 'var(--line)', 'stroke-width': i === 0 ? 2 : 1 }, svg).style.stroke = i === 0 ? 'var(--ink)' : ''; }
    for (let j = ya; j <= yb; j++) { const [x1, y1] = P(xa, j), [x2, y2] = P(xb, j); el('line', { x1, y1, x2, y2, stroke: 'var(--line)', 'stroke-width': j === 0 ? 2 : 1 }, svg).style.stroke = j === 0 ? 'var(--ink)' : ''; }
    const [ox, oy] = P(0, 0);
    T(svg, ox - 8, oy + 12, '0', { style: 'font-size:12px;font-style:normal' });
    T(svg, P(xb, 0)[0] - 6, oy - 10, 'x'); T(svg, ox + 10, P(0, yb)[1] + 6, 'y');
    (o.segs || []).forEach(s => {
      const [x1, y1] = P(...s.a), [x2, y2] = P(...s.b);
      if (s.legs) {
        const [cx, cy] = P(s.b[0], s.a[1]);
        el('polygon', { points: `${x1},${y1} ${cx},${cy} ${x2},${y2}`, fill: '#f6a54b', opacity: .3 }, svg);
        el('line', { x1, y1, x2: cx, y2: cy, stroke: C.orange, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, svg);
        el('line', { x1: cx, y1: cy, x2, y2, stroke: C.matcha, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, svg);
        if (s.lx) T(svg, (x1 + cx) / 2, cy + 16, s.lx, { fill: '#c0561f' });
        if (s.ly) T(svg, cx + 16, (cy + y2) / 2, s.ly, { fill: '#3f7f3a' });
      }
      el('line', { x1, y1, x2, y2, stroke: s.color || C.red, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
    });
    (o.pts || []).forEach(p => {
      const [x, y] = P(...p.p);
      el('circle', { cx: x, cy: y, r: 5, fill: C.red }, svg);
      if (p.t) T(svg, x + (p.dx || 10), y + (p.dy || -12), p.t, { style: 'font-size:14px;font-style:normal', 'text-anchor': 'start' });
    });
    return svg;
  }

  /* =========================================================
     十字交乘圖
     o: {l:[左上,左下], r:[右上,右下], p:[上列乘積,下列乘積], sum:'合起來', target:'要湊的中間項', ok:true/false/undefined}
     左上×右下 寫在上列；左下×右上 寫在下列
     ========================================================= */
  function cross(host, o) {
    const svg = box(host, 340, 190);
    const xL = 60, xR = 150, y1 = 42, y2 = 122;
    const big = (x, y, s, col) => T(svg, x, y, s, { style: `font-size:24px;font-style:normal;font-weight:800`, fill: col || 'currentColor' });
    el('line', { x1: xL + 20, y1: y1 + 8, x2: xR - 22, y2: y2 - 8, stroke: '#f6a54b', 'stroke-width': 3 }, svg);
    el('line', { x1: xL + 20, y1: y2 - 8, x2: xR - 22, y2: y1 + 8, stroke: '#8cc084', 'stroke-width': 3 }, svg);
    big(xL, y1, o.l[0]); big(xL, y2, o.l[1]); big(xR, y1, o.r[0]); big(xR, y2, o.r[1]);
    T(svg, xL, 164, '乘起來＝前面', { style: 'font-size:12px;font-style:normal', fill: 'var(--muted)' });
    T(svg, xR, 164, '乘起來＝常數', { style: 'font-size:12px;font-style:normal', fill: 'var(--muted)' });
    if (o.p) {
      big(262, y1, o.p[0], '#c0561f'); big(262, y2, o.p[1], '#3f7f3a');
      T(svg, 205, y1, '→', { style: 'font-size:18px;font-style:normal' }); T(svg, 205, y2, '→', { style: 'font-size:18px;font-style:normal' });
      el('line', { x1: 222, y1: y2 + 22, x2: 320, y2: y2 + 22, stroke: 'var(--ink)', 'stroke-width': 2 }, svg).style.stroke = 'var(--ink)';
      if (o.sum) big(262, y2 + 46, o.sum + (o.ok === true ? ' ✔' : o.ok === false ? ' ✘' : ''), o.ok === false ? C.red : null);
      T(svg, 228, y2 + 4, '＋', { style: 'font-size:20px;font-style:normal' });
    }
    if (o.target) T(svg, 262, 14, `要湊出中間項 ${o.target}`, { style: 'font-size:13px;font-style:normal', fill: 'var(--muted)' });
    return svg;
  }

  /* =========================================================
     統計圖：直方圖／折線圖
     o: {edges:[0,5,10,...], vals:[...], kind:'bar'|'line'|'cum', ymax, ylab, xlab, hi:索引, unit:'%'}
     bar：長條畫在組距上；line：點在組中點；cum：點在每組上限（從第一個下限的 0 開始）
     ========================================================= */
  function hist(host, o) {
    const W = 340, H = 240, x0 = 46, x1 = W - 22, y0 = H - 38, y1 = 30;
    const svg = box(host, W, H);
    const e = o.edges, n = o.vals.length;
    const ymax = o.ymax || Math.max(...o.vals);
    const X = v => x0 + (v - e[0]) / (e[e.length - 1] - e[0]) * (x1 - x0 - 14);
    const Y = v => y0 - v / ymax * (y0 - y1);
    const step = o.ystep || Math.ceil(ymax / 5);
    for (let v = 0; v <= ymax + 1e-9; v += step) {
      el('line', { x1: x0, y1: Y(v), x2: x1, y2: Y(v), stroke: 'var(--line)', 'stroke-width': 1 }, svg);
      T(svg, x0 - 8, Y(v), v + (o.unit || ''), { 'text-anchor': 'end', style: 'font-size:12px;font-style:normal' });
    }
    el('line', { x1: x0, y1: y0, x2: x1, y2: y0, stroke: 'var(--ink)', 'stroke-width': 2 }, svg).style.stroke = 'var(--ink)';
    el('line', { x1: x0, y1: y0, x2: x0, y2: y1 - 6, stroke: 'var(--ink)', 'stroke-width': 2 }, svg).style.stroke = 'var(--ink)';
    e.forEach(v => T(svg, X(v), y0 + 14, v, { style: 'font-size:12px;font-style:normal' }));
    if (o.xlab) T(svg, (x0 + x1) / 2, H - 6, o.xlab, { style: 'font-size:12px;font-style:normal', fill: 'var(--muted)' });
    if (o.ylab) T(svg, 8, 10, o.ylab, { 'text-anchor': 'start', style: 'font-size:12px;font-style:normal', fill: 'var(--muted)' });
    const kind = o.kind || 'bar';
    if (kind === 'bar') {
      o.vals.forEach((v, i) => {
        el('rect', { x: X(e[i]) + 1, y: Y(v), width: X(e[i + 1]) - X(e[i]) - 2, height: y0 - Y(v), fill: i === o.hi ? C.orange : C.choco, stroke: C.edge, 'stroke-width': 1.5 }, svg);
        if (o.show !== false) T(svg, (X(e[i]) + X(e[i + 1])) / 2, Y(v) - 9, o.labels ? o.labels[i] : v, { style: 'font-size:13px;font-style:normal' });
      });
    } else {
      const pts = kind === 'line' ? o.vals.map((v, i) => [(X(e[i]) + X(e[i + 1])) / 2, Y(v)]) : [[X(e[0]), Y(0)]].concat(o.vals.map((v, i) => [X(e[i + 1]), Y(v)]));
      el('polyline', { points: pts.map(p => p.join(',')).join(' '), fill: 'none', stroke: C.red, 'stroke-width': 2.5 }, svg);
      pts.forEach((p, i) => {
        const vi = kind === 'line' ? i : i - 1;
        el('circle', { cx: p[0], cy: p[1], r: vi === o.hi ? 7 : 4.5, fill: vi === o.hi ? C.orange : C.red, stroke: '#fff', 'stroke-width': 1.5 }, svg);
        if (o.show !== false && vi >= 0) T(svg, p[0], p[1] - 12, o.labels ? o.labels[vi] : o.vals[vi] + (o.unit || ''), { style: 'font-size:12px;font-style:normal' });
      });
    }
    return svg;
  }
  // 簡單表格：rows 是二維陣列，第一列是表頭；hl:[[r,c]] 要強調的格子
  function table(host, rows, o) {
    const opt = o || {};
    const hl = new Set((opt.hl || []).map(([r, c]) => r + ',' + c));
    const html = '<div class="tbl-wrap"><table class="tbl">' + rows.map((r, ri) => '<tr>' + r.map((c, ci) => {
      const tag = ri === 0 || (opt.headCol && ci === 0) ? 'th' : 'td';
      return `<${tag} class="${hl.has(ri + ',' + ci) ? 'hi' : ''}">${c}</${tag}>`;
    }).join('') + '</tr>').join('') + '</table></div>';
    host.appendChild(Lesson.h(html));
    JH.renderMath(host);
  }

  window.Viz = { C, box, el, T, L, raw, Tiles, polyTiles, legend, areaBox, longDiv, numLine, pythag, dotGrid, coord, cross, hist, table };
})();
