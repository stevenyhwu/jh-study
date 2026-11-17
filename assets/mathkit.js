/* ===== 數學新版共用工具：寫式子、面積盒、十字交乘圖、直方圖、折線圖、幾個模擬 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const NEG = '#d9534f';
  const abs = Math.abs;

  document.head.appendChild(h(`<style>
    .frac{display:inline-flex;flex-direction:column;text-align:center;vertical-align:middle;line-height:1.25;font-size:.92em}
    .frac>span:first-child{border-bottom:1.5px solid currentColor;padding:0 4px}
    .frac>span:last-child{padding:0 4px}
    .mk-eq{font-size:17px;line-height:2;margin:6px 0}
    .mk-big{font-size:20px;font-weight:700;text-align:center;margin:6px 0}
  </style>`));

  /* ---------- 寫式子 ---------- */
  const X2 = 'x<sup>2</sup>';
  const num = n => (n < 0 ? '−' + -n : String(n));
  const pn = n => (n < 0 ? `(${num(n)})` : String(n));          // 負數加括號
  const co = (k, v) => (abs(k) === 1 && v ? '' : abs(k)) + v;
  // poly(b, c) → x²+bx+c；poly(a, b, c) → ax²+bx+c
  function poly(a, b, c) {
    if (c === undefined) { c = b; b = a; a = 1; }
    let s = '', first = true;
    [[a, X2], [b, 'x'], [c, '']].forEach(([k, v]) => {
      if (!k) return;
      s += first ? (k < 0 ? '−' : '') + co(k, v) : (k > 0 ? ' + ' : ' − ') + co(k, v);
      first = false;
    });
    return s || '0';
  }
  // par(m) → (x+m)；par(p, m) → (px+m)
  function par(p, m) { if (m === undefined) { m = p; p = 1; } return m === 0 ? co(p, 'x') : `(${poly(0, p, m)})`; }
  const M = s => `<span class="mth">${s}</span>`;
  const sqrt = n => `√<span style="text-decoration:overline">${n}</span>`;
  const frac = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const plain = s => String(s).replace(/<sup>2<\/sup>/g, '²').replace(/<[^>]+>/g, '');

  /* ---------- 面積盒 (x+m)(x+n) ---------- */
  function boxSvg(m, n) {
    const X = 110, u = 13, W = k => Math.max(abs(k) * u, 16);
    const wm = W(m), wn = W(n), x0 = 40, y0 = 28;
    const cell = (x, y, w, hh, txt, kind, neg) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${neg ? 'none' : ['#f6c26b', '#9fd3a8', '#c9b8f0'][kind]}" fill-opacity=".6" ${ST}${neg ? ' stroke-dasharray="5 3"' : ''}/>
      <text x="${x + w / 2}" y="${y + hh / 2 + 5}" text-anchor="middle" class="t14b"${neg ? ` style="fill:${NEG}"` : ''}>${txt}</text>`;
    const w = x0 + X + wm + 10, hh = y0 + X + wn + 10;
    return { vb: `0 0 ${Math.max(w, 200)} ${hh}`, inner: `
      <text x="${x0 + X / 2}" y="18" text-anchor="middle" class="t14b">x</text>
      <text x="${x0 + X + wm / 2}" y="18" text-anchor="middle" class="t14b"${m < 0 ? ` style="fill:${NEG}"` : ''}>${num(m)}</text>
      <text x="${x0 - 12}" y="${y0 + X / 2 + 5}" text-anchor="middle" class="t14b">x</text>
      <text x="${x0 - 12}" y="${y0 + X + wn / 2 + 5}" text-anchor="middle" class="t14b"${n < 0 ? ` style="fill:${NEG}"` : ''}>${num(n)}</text>
      ${cell(x0, y0, X, X, 'x²', 0)}${cell(x0 + X, y0, wm, X, co(m, 'x').replace(/^/, m < 0 ? '−' : ''), 1, m < 0)}
      ${cell(x0, y0 + X, X, wn, co(n, 'x').replace(/^/, n < 0 ? '−' : ''), 1, n < 0)}${cell(x0 + X, y0 + X, wm, wn, num(m * n), 2, m * n < 0)}` };
  }
  function boxPic(host, m, n, max) { const b = boxSvg(m, n); const sv = U.svg(host, b.vb, b.inner, '面積盒', 'u4-pic'); sv.style.maxWidth = (max || 260) + 'px'; return sv; }

  /* ---------- 一排長方形：左邊是提出來的，上面是括號裡剩下的 ---------- */
  function rowPic(host, left, tops, cells, max) {
    const ws = tops.map(t => Math.max(70, plain(t).length * 13 + 26)), H = 56, x0 = 70;
    let x = x0, inner = `<text x="${x0 - 10}" y="${30 + H / 2 + 5}" text-anchor="end" class="t14b" style="fill:var(--accent)">${plain(left)}</text>`;
    tops.forEach((t, i) => {
      inner += `<rect x="${x}" y="30" width="${ws[i]}" height="${H}" fill="${['#f6c26b', '#9fd3a8', '#c9b8f0'][i % 3]}" fill-opacity=".6" ${ST}/>
        <text x="${x + ws[i] / 2}" y="20" text-anchor="middle" class="t14b">${plain(t)}</text>
        <text x="${x + ws[i] / 2}" y="${30 + H / 2 + 5}" text-anchor="middle" class="t14b" style="font-weight:400">${plain(cells[i])}</text>`;
      x += ws[i];
    });
    const sv = U.svg(host, `0 0 ${x + 10} ${H + 40}`, inner, '提公因式的長方形', 'u4-pic');
    sv.style.maxWidth = (max || Math.min(380, x + 10)) + 'px';
    return sv;
  }

  /* ---------- 十字交乘圖：(px + m)(qx + n) ---------- */
  function crossSvg(p, m, q, n) {
    const L = k => co(k, 'x').replace(/^/, k < 0 ? '−' : '');
    const a = p * n, b = q * m;
    return `<text x="40" y="34" text-anchor="middle" class="t14b">${L(p)}</text><text x="140" y="34" text-anchor="middle" class="t14b">${num(m)}</text>
      <text x="40" y="104" text-anchor="middle" class="t14b">${L(q)}</text><text x="140" y="104" text-anchor="middle" class="t14b">${num(n)}</text>
      <line x1="58" y1="40" x2="125" y2="90" stroke="var(--accent)" stroke-width="2"/><line x1="58" y1="90" x2="125" y2="40" stroke="var(--accent)" stroke-width="2"/>
      <text x="170" y="34" class="t14b" style="font-weight:400">${L(p)} × ${pn(n)} ＝ ${L(a)}</text>
      <text x="170" y="60" class="t14b" style="font-weight:400">${L(q)} × ${pn(m)} ＝ ${L(b)}</text>
      <line x1="170" y1="70" x2="300" y2="70" stroke="var(--stroke)"/>
      <text x="170" y="92" class="t14b">加起來 ${a + b === 0 ? '0' : L(a + b)}</text>
      <text x="90" y="126" text-anchor="middle" class="t14b" style="font-weight:400">橫著讀：${plain(par(p, m) + par(q, n))}</text>`;
  }
  function crossPic(host, p, m, q, n) { const sv = U.svg(host, '0 0 305 132', crossSvg(p, m, q, n), '十字交乘圖', 'u4-pic'); sv.style.maxWidth = '340px'; return sv; }

  // 乘起來是 c 的整數配對（含正負）
  function pairsOf(c) {
    const out = [];
    for (let a = 1; a * a <= abs(c); a++) if (abs(c) % a === 0) {
      const b = abs(c) / a;
      if (c > 0) { out.push([a, b]); out.push([-a, -b]); } else { out.push([a, -b]); if (a !== b) out.push([-a, b]); }
    }
    return out;
  }

  /* ---------- 模擬：十字交乘 ax²+bx+c，左邊固定 (ax, x)，右邊選兩個數 ---------- */
  function crossSim(host, on) {
    host.appendChild(h('<p class="sim-h">右邊放哪兩個數，交叉相乘加起來才會是中間項？</p>'));
    const tgt = h('<div class="sim-note"></div>'), pic = h('<div></div>'), chipHost = h('<div></div>'), read = h('<div class="sim-read"></div>');
    host.append(tgt, pic, chipHost, read);
    let T = null, cur = null, tries = 0;
    function draw() {
      pic.innerHTML = '';
      if (!T) return;
      tgt.innerHTML = `🎯 目標：${M(poly(T.a, T.b, T.c))}　左邊已經放好 ${co(T.a, 'x')} 和 x`;
      if (!cur) { read.innerHTML = '選一組數字放到右邊看看。'; return; }
      const sv = U.svg(pic, '0 0 305 132', crossSvg(T.a, cur[0], 1, cur[1]), '十字交乘圖', 'sim'); sv.style.maxWidth = '340px';
      const mid = T.a * cur[1] + cur[0], ok = mid === T.b;
      read.innerHTML = `${M(par(T.a, cur[0]) + par(1, cur[1]))} ＝ ${M(poly(T.a, mid, T.c))}<br>${ok ? '<b style="color:var(--good)">✔ 中間項對了！</b>' : `<span style="color:${NEG}">中間是 ${num(mid)}x，目標是 ${num(T.b)}x，換一組或上下對調。</span>`}`;
    }
    const st = {
      setTarget(a, b, c) {
        T = { a, b, c }; cur = null; tries = 0; chipHost.innerHTML = '';
        const opts = [];
        pairsOf(c).forEach(([x, y]) => { opts.push([x, y]); if (x !== y) opts.push([y, x]); });
        U.chips(chipHost, '右邊（上、下）', opts.map((o, i) => ({ v: i, t: `${num(o[0])}、${num(o[1])}` })), -1, i => { cur = opts[i]; tries++; draw(); on(); });
        draw();
      },
      hit: () => T && cur && T.a * cur[1] + cur[0] === T.b,
      get tries() { return tries; }
    };
    return st;
  }

  /* ---------- 模擬：補一角變正方形 x² + bx + c ---------- */
  function sqSim(host, on, opt) {
    opt = opt || {};
    host.appendChild(h(`<p class="sim-h">${opt.title || '補上右下角，拼成一個大正方形'}</p>`));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>'), ch = h('<div></div>');
    let b = (opt.bs || [6])[0], c = 0, sl;
    function draw() {
      const k = b / 2, X = 100, u = 14, w = k * u, x0 = 36, y0 = 26, need = k * k;
      const full = c === need;
      const side = Math.sqrt(c) * u;
      pic.innerHTML = '';
      const sv = U.svg(pic, `0 0 ${x0 + X + 6 * u + 12} ${y0 + X + 6 * u + 12}`, `
        <text x="${x0 + X / 2}" y="16" text-anchor="middle" class="t14b">x</text><text x="${x0 + X + w / 2}" y="16" text-anchor="middle" class="t14b">${k}</text>
        <text x="${x0 - 12}" y="${y0 + X / 2 + 5}" text-anchor="middle" class="t14b">x</text><text x="${x0 - 12}" y="${y0 + X + w / 2 + 5}" text-anchor="middle" class="t14b">${k}</text>
        <rect x="${x0}" y="${y0}" width="${X}" height="${X}" fill="#f6c26b" fill-opacity=".6" ${ST}/><text x="${x0 + X / 2}" y="${y0 + X / 2 + 5}" text-anchor="middle" class="t14b">x²</text>
        <rect x="${x0 + X}" y="${y0}" width="${w}" height="${X}" fill="#9fd3a8" fill-opacity=".6" ${ST}/><text x="${x0 + X + w / 2}" y="${y0 + X / 2 + 5}" text-anchor="middle" class="t14b">${k}x</text>
        <rect x="${x0}" y="${y0 + X}" width="${X}" height="${w}" fill="#9fd3a8" fill-opacity=".6" ${ST}/><text x="${x0 + X / 2}" y="${y0 + X + w / 2 + 5}" text-anchor="middle" class="t14b">${k}x</text>
        <rect x="${x0 + X}" y="${y0 + X}" width="${side}" height="${side}" fill="${full ? '#7bc88f' : '#c9b8f0'}" fill-opacity=".75"/>
        <rect x="${x0 + X}" y="${y0 + X}" width="${w}" height="${w}" fill="none" stroke="${full ? 'var(--good)' : NEG}" stroke-width="2" stroke-dasharray="${full ? '0' : '5 3'}"/>
        <text x="${x0 + X + w + 8}" y="${y0 + X + w / 2 + 5}" class="t12b">${full ? '剛好！' : c < need ? '缺口' : '太多'}</text>`, '補正方形', 'sim');
      sv.style.maxWidth = '300px';
      read.innerHTML = `${M(poly(b, c))}　右下角缺口是 ${k} × ${k} ＝ <b>${need}</b><br>${full ? `<b style="color:var(--good)">✔ 補滿了：${M(poly(b, c))} ＝ ${M(`(x + ${k})<sup>2</sup>`)}</b>` : c < need ? `還缺 ${need - c}` : `多了 ${c - need}`}`;
    }
    host.append(pic);
    if ((opt.bs || []).length > 1) {
      U.chips(ch, 'x 項', opt.bs.map(v => ({ v, t: v + 'x' })), b, v => { b = v; c = 0; sl.set(0); draw(); on(); });
      host.appendChild(ch);
    }
    sl = U.slider(host, '補上的數', { min: 0, max: 36, step: 1, value: 0 }, v => { c = v; draw(); on(); });
    host.appendChild(read); draw();
    return { get b() { return b; }, get c() { return c; }, full: bb => (bb === undefined || bb === b) && c === (b / 2) * (b / 2),
      setB(v) { b = v; c = 0; sl.set(0); draw(); } };
  }

  /* ---------- 數線（-R..R），標幾個點 ---------- */
  function lineSvg(R, pts, cur) {
    const W = 340, x = v => 20 + (v + R) * (W - 40) / (2 * R);
    let s = `<line x1="10" y1="34" x2="${W - 10}" y2="34" stroke="var(--stroke)" stroke-width="1.5"/>`;
    for (let i = -R; i <= R; i++) s += `<line x1="${x(i)}" y1="${i % 2 ? 31 : 28}" x2="${x(i)}" y2="${i % 2 ? 37 : 40}" stroke="var(--stroke)"/>${i % 2 === 0 ? `<text x="${x(i)}" y="54" text-anchor="middle" class="t12">${num(i)}</text>` : ''}`;
    (pts || []).forEach(p => { if (abs(p) <= R) s += `<circle cx="${x(p)}" cy="34" r="6" fill="var(--good)"/>`; });
    if (cur !== undefined && cur !== null) s += `<path d="M${x(cur)} 26 l-6 -12 h12 z" fill="var(--accent)"/>`;
    return { vb: `0 0 ${W} 60`, inner: s };
  }

  /* ---------- 模擬：代 x 進去，看 (x+m)(x+n) 什麼時候是 0 ---------- */
  function rootSim(host, on) {
    host.appendChild(h('<p class="sim-h">拉 x，看看兩個括號各是多少、乘起來是多少</p>'));
    const tgt = h('<div class="sim-note"></div>'), pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    host.append(tgt, pic);
    let m = -2, n = 3, x = 0, label = '', found = [];
    const A = () => (m === 0 ? 'x' : par(m)), B = () => par(n);
    function draw() {
      const a = x + m, b = x + n, z = a * b === 0;
      if (z && found.indexOf(x) < 0) found.push(x);
      const l = lineSvg(8, found, x);
      pic.innerHTML = ''; U.svg(pic, l.vb, l.inner, '數線', 'sim');
      tgt.innerHTML = `方程式：${M((label ? label + '　也就是　' : '') + A() + B() + ' ＝ 0')}`;
      read.innerHTML = `x ＝ <b>${num(x)}</b>　→　${M(A())} ＝ ${num(a)}，${M(B())} ＝ ${num(b)}，乘起來 ＝ <b style="color:${z ? 'var(--good)' : 'inherit'}">${num(a * b)}</b>${z ? ' ✔ 是 0！' : ''}<br><span class="small muted">找到的根（綠點）：${found.length ? found.map(num).join('、') : '還沒有'}</span>`;
    }
    const sl = U.slider(host, 'x', { min: -8, max: 8, step: 1, value: 0, fmt: num }, v => { x = v; draw(); on(); });
    host.appendChild(read); draw();
    return { setEq(mm, nn, lab) { m = mm; n = nn; label = lab || ''; found = []; x = 1; if ((1 + m) * (1 + n) === 0) x = -1; sl.set(x); draw(); }, get found() { return found; } };
  }

  /* ---------- 直方圖／長條 ----------
     o = {edges:[..], vals:[..], ylab, xlab, max, fmt, hi:[idx], line:bool, vline:{x, label}, xl:[自訂橫軸文字], note} */
  function hist(host, o) {
    const n = o.vals.length, W = 360, H = o.h || 220, L = 44, Rr = 14, T = 22, B = 44;
    const lo = Math.min(0, Math.min.apply(null, o.vals)), hi = o.max || Math.max.apply(null, o.vals);
    const span = (hi - lo) * 1.12 || 1, y = v => T + (H - T - B) * (1 - (v - lo) / span), bw = (W - L - Rr) / n;
    const fmt = o.fmt || (v => num(v));
    let s = `<line x1="${L}" y1="${T - 8}" x2="${L}" y2="${H - B}" class="g-axis"/><line x1="${L}" y1="${y(0)}" x2="${W - Rr}" y2="${y(0)}" class="g-axis"/>`;
    o.vals.forEach((v, i) => {
      const on = (o.hi || []).indexOf(i) >= 0, top = Math.min(y(v), y(0)), hh = abs(y(v) - y(0));
      s += `<rect x="${L + i * bw}" y="${top}" width="${bw}" height="${hh}" fill="${on ? 'var(--accent)' : '#9aa7b8'}" fill-opacity="${on ? '.75' : '.55'}" ${ST}/>`;
      if (o.labels !== false) s += `<text x="${L + (i + .5) * bw}" y="${v >= 0 ? top - 4 : top + hh + 13}" text-anchor="middle" class="t12b">${fmt(v)}</text>`;
    });
    const xl = o.xl || o.edges;
    const every = xl.length > 14 ? 2 : 1;
    xl.forEach((e, i) => { if (i % every === 0) s += `<text x="${L + i * bw}" y="${H - B + 15}" text-anchor="middle" class="t12">${e}</text>`; });
    if (o.line) s += `<polyline fill="none" stroke="var(--accent)" stroke-width="2.5" points="${[`${L},${y(0)}`].concat(o.vals.map((v, i) => `${L + (i + 1) * bw},${y(v)}`)).join(' ')}"/>` + o.vals.map((v, i) => `<circle cx="${L + (i + 1) * bw}" cy="${y(v)}" r="3.5" fill="var(--accent)"/>`).join('');
    if (o.vline) { const vx = L + o.vline.i * bw; s += `<line x1="${vx}" y1="${T + 6}" x2="${vx}" y2="${y(0)}" stroke="var(--ink)" stroke-width="1.5"/><text x="${vx}" y="${T}" text-anchor="middle" class="t12b">${o.vline.label}</text>`; }
    s += `<text x="${W - Rr}" y="${H - 8}" text-anchor="end" class="t12">${o.xlab || ''}</text><text x="6" y="12" class="t12">${o.ylab || ''}</text>`;
    const sv = U.svg(host, `0 0 ${W} ${H}`, s, o.title || '直方圖', o.cls || 'u4-pic');
    sv.style.maxWidth = '460px';
    return sv;
  }

  /* ---------- 折線圖：o = {xs:[..], series:[{name, vals, color, dash}], ymax, step, ylab, xlab} ---------- */
  function lineChart(host, o) {
    const W = 340, H = 220, L = 40, Rr = 16, T = 40, B = 34, n = o.xs.length;
    const x = i => L + 24 + i * (W - L - Rr - 48) / (n - 1), y = v => T + (H - T - B) * (1 - v / o.ymax);
    let s = `<line x1="${L}" y1="${T - 6}" x2="${L}" y2="${H - B}" class="g-axis"/><line x1="${L}" y1="${H - B}" x2="${W - Rr}" y2="${H - B}" class="g-axis"/>`;
    for (let v = o.step; v <= o.ymax + 1e-9; v += o.step) s += `<line x1="${L}" y1="${y(v)}" x2="${W - Rr}" y2="${y(v)}" stroke="var(--line)" ${Number.isInteger(v) ? '' : 'stroke-dasharray="3 3"'}/>${Number.isInteger(v) ? `<text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" class="t12b">${v}</text>` : ''}`;
    o.xs.forEach((t, i) => { s += `<text x="${x(i)}" y="${H - B + 16}" text-anchor="middle" class="t12b">${t}</text>`; });
    const mark = (k, cx, cy, c) => k === 0 ? `<path d="M${cx} ${cy - 6} l6 11 h-12 z" fill="${c}"/>` : k === 1 ? `<circle cx="${cx}" cy="${cy}" r="5.5" fill="${c}"/>` : `<rect x="${cx - 5}" y="${cy - 5}" width="10" height="10" fill="${c}"/>`;
    o.series.forEach((se, k) => {
      const c = se.color;
      s += `<polyline fill="none" stroke="${c}" stroke-width="2" points="${se.vals.map((v, i) => `${x(i)},${y(v)}`).join(' ')}"/>` + se.vals.map((v, i) => mark(k, x(i), y(v), c)).join('');
      const lx = L + 10 + k * 96;
      s += `<line x1="${lx}" y1="14" x2="${lx + 26}" y2="14" stroke="${c}" stroke-width="2"/>${mark(k, lx + 13, 14, c)}<text x="${lx + 32}" y="18" class="t12b">${se.name}</text>`;
    });
    s += `<text x="${W - Rr}" y="${H - 2}" text-anchor="end" class="t12">${o.xlab || ''}</text><text x="4" y="${T - 12}" class="t12">${o.ylab || ''}</text>`;
    const sv = U.svg(host, `0 0 ${W} ${H}`, s, o.title || '折線圖', 'u4-pic');
    sv.style.maxWidth = '420px';
    return sv;
  }

  function table(host, head, rows, max) {
    const t = h(`<table class="sim-table"><tr>${head.map(x => `<th>${x}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table>`);
    t.style.maxWidth = (max || 400) + 'px'; host.appendChild(t); return t;
  }
  const run = (unit, titles, fns) => U.run(unit, titles, fns, { course: 'math8a', ns: 'math', homeLabel: '回數學首頁' });
  const SIM = '會考題型模擬題';

  window.MK = { ST, NEG, X2, num, pn, co, poly, par, M, sqrt, frac, plain, boxSvg, boxPic, rowPic, crossSvg, crossPic, pairsOf, crossSim, sqSim, lineSvg, rootSim, hist, lineChart, table, run, SIM };
})();
