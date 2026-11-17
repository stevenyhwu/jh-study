/* ===== 數學新版 第 1～2 章共用：多項式、代數磚、長除法、根式、直角三角形、方格 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, ST = K.ST, NEG = K.NEG, num = K.num, abs = Math.abs;

  document.head.appendChild(h(`<style>
    table.mk-ld{border-collapse:collapse;font-size:16px;font-variant-numeric:tabular-nums;margin:6px auto}
    table.mk-ld td{padding:2px 7px;text-align:right;white-space:nowrap;min-width:46px}
    table.mk-ld td.dv{border-right:2px solid var(--ink);text-align:right;padding-right:8px}
    table.mk-ld tr.top td.n{border-top:2px solid var(--ink)}
    table.mk-ld tr.pr td.n{border-bottom:1.5px solid var(--ink)}
    table.mk-ld td.hi{background:rgba(255,200,80,.35);border-radius:4px}
    table.mk-ld td.q{color:var(--accent);font-weight:700}
    table.mk-ld td.z{color:var(--muted)}
    .mk-wrap{overflow-x:auto}
  </style>`));

  /* ---------- 多項式：係數由高次到低次 ---------- */
  const pw = (d, v) => (d === 0 ? '' : d === 1 ? v : `${v}<sup>${d}</sup>`);
  function term(c, d, first, v, keepZero) {
    v = v || 'x';
    if (!c && !keepZero) return '';
    const a = abs(c), body = (a === 1 && d > 0 ? '' : a) + pw(d, v);
    if (first) return (c < 0 ? '−' : '') + body;
    return (c < 0 ? ' − ' : ' + ') + body;
  }
  function polyN(cs, v, keepZero) {
    let s = '', first = true;
    cs.forEach((c, i) => { const t = term(c, cs.length - 1 - i, first, v, keepZero && i > 0); if (t) { s += t; first = false; } });
    return s || '0';
  }
  const addP = (A, B, k) => { k = k === undefined ? 1 : k; const n = Math.max(A.length, B.length), a = pad(A, n), b = pad(B, n); return a.map((x, i) => x + k * b[i]); };
  const pad = (A, n) => Array(n - A.length).fill(0).concat(A);
  const mulP = (A, B) => { const r = Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => { r[i + j] += a * b; })); return r; };
  const trim = A => { let i = 0; while (i < A.length - 1 && !A[i]) i++; return A.slice(i); };

  /* ---------- 代數磚：ax² + bx + c ---------- */
  function tilesSvg(cs, opt) {
    opt = opt || {};
    const [a, b, c] = cs.length === 3 ? cs : [0].concat(pad(cs, 2));
    const S = 46, L = 12, u = 12, gap = 6;
    let x = 8, s = '';
    const col = { 2: '#f6c26b', 1: '#9fd3a8', 0: '#c9b8f0' };
    function put(n, d) {
      for (let i = 0; i < abs(n); i++) {
        const w = d === 2 ? S : d === 1 ? L : u, hh = d === 0 ? u : S, neg = n < 0;
        const y = d === 0 ? 8 + S - u - (i % 3) * (u + 3) : 8;
        const xx = d === 0 ? x + Math.floor(i / 3) * (u + 3) : x;
        s += `<rect x="${xx}" y="${y}" width="${w}" height="${hh}" rx="2" fill="${neg ? 'none' : col[d]}" fill-opacity=".7" stroke="${neg ? NEG : 'var(--stroke)'}" stroke-width="1.5"${neg ? ' stroke-dasharray="4 2"' : ''}/>`;
        if (d !== 0) x += w + 3;
      }
      if (d === 0 && n) x += Math.ceil(abs(n) / 3) * (u + 3);
      if (n) x += gap;
    }
    put(a, 2); put(b, 1); put(c, 0);
    if (x <= 10) s += `<text x="10" y="40" class="t12" style="fill:var(--muted)">（沒有磚）</text>`;
    return { vb: `0 0 ${Math.max(x + 4, opt.minW || 60)} ${S + 16}`, inner: s, w: Math.max(x + 4, opt.minW || 60) };
  }
  function tilesPic(host, cs, max, cls) {
    const t = tilesSvg(cs);
    const sv = U.svg(host, t.vb, t.inner, '代數磚', cls || 'u4-pic'); sv.style.maxWidth = Math.min(max || 420, t.w * 1.2) + 'px'; return sv;
  }
  const tileLegend = '<span class="small muted">黃大方塊＝x²，綠長條＝x，紫小方塊＝1；<span style="color:' + NEG + '">紅色虛線＝負的</span></span>';

  /* ---------- 長除法 ---------- */
  function divide(N, D) {
    const n = N.length - 1, d = D.length - 1, Q = [], steps = [];
    let r = N.slice();
    for (let i = 0; i <= n - d; i++) {
      const c = r[i] / D[0], prod = Array(n + 1).fill(0);
      for (let j = 0; j <= d; j++) prod[i + j] = c * D[j];
      const nr = r.map((x, k) => x - prod[k]);
      Q.push(c); steps.push({ i, c, prod, rem: nr }); r = nr;
    }
    return { Q, R: trim(r.slice(n - d + 1).length ? r.slice(n - d + 1) : [0]), steps, n, d };
  }
  // k ＝ 顯示到第幾步（0 ＝ 只有題目）；opt.zero ＝ 缺項用淺色 0 表示
  function longDiv(host, N, D, k, opt) {
    opt = opt || {};
    const R = divide(N, D), n = R.n, d = R.d, v = opt.v || 'x';
    const cell = (c, deg, first, cls) => `<td class="n ${cls || ''}${!c ? ' z' : ''}">${c || opt.zero ? (term(c, deg, first, v, true) || '0') : ''}</td>`;
    let qrow = '<tr><td></td>';
    for (let col = 0; col <= n; col++) {
      const qi = col - d;
      qrow += qi >= 0 && qi < k ? `<td class="q">${term(R.Q[qi], n - d - qi, qi === 0, v, true)}</td>` : '<td></td>';
    }
    qrow += '</tr>';
    let rows = `<tr class="top"><td class="dv">${polyN(D, v)}</td>${N.map((c, i) => `<td class="n${!c ? ' z' : ''}">${term(c, n - i, i === 0, v, true)}</td>`).join('')}</tr>`;
    for (let s = 0; s < Math.min(k, R.steps.length); s++) {
      const st = R.steps[s], last = s === R.steps.length - 1;
      rows += `<tr class="pr"><td style="text-align:right">−)</td>${Array.from({ length: n + 1 }, (_, col) => col >= st.i && col <= st.i + d ? `<td class="n${s === k - 1 ? ' hi' : ''}">${term(st.prod[col], n - col, col === st.i, v, true)}</td>` : '<td></td>').join('')}</tr>`;
      const hiEnd = last ? n : Math.min(n, st.i + d + 1);
      rows += `<tr><td></td>${Array.from({ length: n + 1 }, (_, col) => col > st.i && col <= hiEnd ? `<td class="n${!st.rem[col] ? ' z' : ''}">${term(st.rem[col], n - col, col === st.i + 1, v, true)}</td>` : '<td></td>').join('')}</tr>`;
    }
    const wrap = h(`<div class="mk-wrap"><table class="mk-ld" aria-label="長除法">${qrow}${rows}</table></div>`);
    host.appendChild(wrap);
    return R;
  }

  /* ---------- 根式 ---------- */
  function simp(n) { let s = 1, m = n; for (let k = Math.floor(Math.sqrt(n)); k > 1; k--) if (n % (k * k) === 0) { s = k; m = n / (k * k); break; } return { s, m }; }
  function rootTxt(s, m) { if (m === 1) return String(s); return (s === 1 ? '' : s) + K.sqrt(m); }
  const rootOf = n => { const r = simp(n); return rootTxt(r.s, r.m); };
  const r2 = x => Math.round(x * 100) / 100;

  /* ---------- 直角三角形＋三個正方形：兩股 a（橫）、b（直） ---------- */
  function triSvg(a, b, opt) {
    opt = opt || {};
    const sqs = opt.squares !== false;
    const W = sqs ? a + 2 * b : a, H = sqs ? 2 * a + b : b;
    const u = Math.min(300 / (W + 1), 260 / (H + 1), opt.u || 40);
    const ox = (sqs ? b : 0) * u + 30, oy = (sqs ? b + a : b) * u + 26;
    const P = (x, y) => `${ox + x * u},${oy - y * u}`;
    const c2 = a * a + b * b;
    let s = '';
    if (sqs) {
      s += `<polygon points="${P(0, 0)} ${P(a, 0)} ${P(a, -a)} ${P(0, -a)}" fill="#9fd3a8" fill-opacity=".6" ${ST}/>`;
      s += `<polygon points="${P(0, 0)} ${P(0, b)} ${P(-b, b)} ${P(-b, 0)}" fill="#f6c26b" fill-opacity=".6" ${ST}/>`;
      s += `<polygon points="${P(a, 0)} ${P(0, b)} ${P(b, a + b)} ${P(a + b, a)}" fill="#c9b8f0" fill-opacity=".6" ${ST}/>`;
      s += `<text x="${ox + a * u / 2}" y="${oy + a * u / 2 + 5}" text-anchor="middle" class="t14b">${a * a}</text>`;
      s += `<text x="${ox - b * u / 2}" y="${oy - b * u / 2 + 5}" text-anchor="middle" class="t14b">${b * b}</text>`;
      s += `<text x="${ox + (a + b) * u / 2}" y="${oy - (a + b) * u / 2 + 5}" text-anchor="middle" class="t14b">${opt.hideC ? '?' : c2}</text>`;
    }
    s += `<polygon points="${P(0, 0)} ${P(a, 0)} ${P(0, b)}" fill="var(--card, #fff)" stroke="var(--ink)" stroke-width="2"/>`;
    s += `<polyline points="${P(0.0, Math.min(0.6, b / 4))} ${P(Math.min(0.6, a / 4), Math.min(0.6, b / 4))} ${P(Math.min(0.6, a / 4), 0)}" fill="none" stroke="var(--ink)" stroke-width="1.2"/>`;
    const la = opt.la !== undefined ? opt.la : a, lb = opt.lb !== undefined ? opt.lb : b, lc = opt.lc !== undefined ? opt.lc : (opt.hideC ? '?' : rootOf(c2).replace(/<[^>]+>/g, '').replace('√', '√'));
    s += `<text x="${ox + a * u / 2}" y="${oy - 6}" text-anchor="middle" class="t14b" style="fill:var(--accent)">${la}</text>`;
    s += `<text x="${ox + 8}" y="${oy - b * u / 2 + 5}" class="t14b" style="fill:var(--accent)">${lb}</text>`;
    s += `<text x="${ox + a * u / 2 + 8}" y="${oy - b * u / 2 - 4}" class="t14b" style="fill:var(--accent)">${lc}</text>`;
    return { vb: `0 0 ${W * u + 60} ${H * u + 40}`, inner: s };
  }
  function triPic(host, a, b, opt, cls) { const t = triSvg(a, b, opt); const sv = U.svg(host, t.vb, t.inner, '直角三角形', cls || 'u4-pic'); sv.style.maxWidth = ((opt && opt.max) || 300) + 'px'; return sv; }

  /* ---------- 方格紙：o = {w, hh, pts:{名:[x,y]}, segs:[[名, 名, 'solid'|'dot'|'bold'|'leg']], u} ---------- */
  function gridSvg(o) {
    const u = o.u || 40, w = o.w, H = o.hh, x0 = 24, y0 = 16;
    const P = ([x, y]) => [x0 + x * u, y0 + (H - y) * u];
    let s = '';
    for (let i = 0; i <= w; i++) s += `<line x1="${x0 + i * u}" y1="${y0}" x2="${x0 + i * u}" y2="${y0 + H * u}" stroke="var(--line)"/>`;
    for (let j = 0; j <= H; j++) s += `<line x1="${x0}" y1="${y0 + j * u}" x2="${x0 + w * u}" y2="${y0 + j * u}" stroke="var(--line)"/>`;
    (o.segs || []).forEach(([p, q, sty]) => {
      const [x1, y1] = P(o.pts[p]), [x2, y2] = P(o.pts[q]);
      const st = { solid: 'stroke="var(--ink)" stroke-width="1.5"', dot: 'stroke="var(--ink)" stroke-width="2.2" stroke-dasharray="3 4"', bold: 'stroke="var(--ink)" stroke-width="3.5"', leg: 'stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="6 3"', hyp: 'stroke="#d9534f" stroke-width="3"' }[sty || 'solid'];
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${st}/>`;
    });
    Object.keys(o.pts).forEach(k => {
      if (k[0] === '_') return;
      const [x, y] = P(o.pts[k]);
      s += `<circle cx="${x}" cy="${y}" r="3.5" fill="var(--ink)"/><text x="${x + 6}" y="${y - 6}" class="t14b">${k}</text>`;
    });
    return { vb: `0 0 ${x0 * 2 + w * u} ${y0 * 2 + H * u}`, inner: s };
  }
  function gridPic(host, o, cls) { const g = gridSvg(o); const sv = U.svg(host, g.vb, g.inner, '方格紙', cls || 'u4-pic'); sv.style.maxWidth = (o.max || 300) + 'px'; return sv; }

  /* ---------- 正方形（面積 → 邊長） ---------- */
  function areaSq(host, A, opt) {
    opt = opt || {};
    const side = Math.sqrt(A), u = 20, S = side * u, Mx = 10 * u + 70;
    let s = '';
    for (let i = 0; i <= 10; i++) s += `<line x1="${30 + i * u}" y1="20" x2="${30 + i * u}" y2="${20 + 10 * u}" stroke="var(--line)"/><line x1="30" y1="${20 + i * u}" x2="${30 + 10 * u}" y2="${20 + i * u}" stroke="var(--line)"/>`;
    const ok = Number.isInteger(side);
    s += `<rect x="30" y="${20 + 10 * u - S}" width="${S}" height="${S}" fill="${ok ? '#9fd3a8' : '#f6c26b'}" fill-opacity=".65" stroke="var(--ink)" stroke-width="2"/>`;
    s += `<text x="${30 + S / 2}" y="${20 + 10 * u - S / 2 + 5}" text-anchor="middle" class="t14b">${A}</text>`;
    s += `<text x="${30 + S / 2}" y="${20 + 10 * u - S - 6}" text-anchor="middle" class="t14b" style="fill:var(--accent)">${opt.label || (ok ? side : '√' + A)}</text>`;
    const sv = U.svg(host, `0 0 ${Mx} ${10 * u + 40}`, s, '正方形', opt.cls || 'u4-pic'); sv.style.maxWidth = (opt.max || 260) + 'px'; return sv;
  }

  window.MK2 = { pw, term, polyN, addP, mulP, pad, trim, tilesSvg, tilesPic, tileLegend, divide, longDiv, simp, rootTxt, rootOf, r2, triSvg, triPic, gridSvg, gridPic, areaSq };
})();
