/* ===== 理化實驗台零件：密度實驗台、M-V 圖、水槽場景 ===== */
(function () {
  'use strict';

  const MAT = {
    wood: { name: '木頭', d: 0.6, color: '#c9a063' },
    ice:  { name: '冰塊', d: 0.9, color: '#a8dcf0' },
    al:   { name: '鋁',   d: 2.7, color: '#c3ccd8' },
    fe:   { name: '鐵',   d: 7.9, color: '#7a8699' },
    cu:   { name: '銅',   d: 8.9, color: '#d9824a' }
  };

  function h(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  const r1 = x => Math.round(x * 10) / 10;
  const side = V => 8.5 * Math.cbrt(V);           // 方塊在畫面上的邊長
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';

  /* ---------- M-V 圖 ---------- */
  // recs: [{key, name, color, V, M}]；o.lines=true 時只有一個點也畫線
  function drawGraph(svg, recs, o) {
    o = o || {};
    const L = 42, T = 26, W = 320 - L - 16, H = 220 - T - 36, xmax = 100;
    const maxM = Math.max(100, ...recs.map(r => r.M));
    const ymax = [100, 200, 500, 1000].find(v => v >= maxM) || 1000;
    const X = v => L + v / xmax * W, Y = m => T + H - m / ymax * H;
    let s = '';
    for (let i = 0; i <= 5; i++) {
      const gx = X(xmax * i / 5), gy = Y(ymax * i / 5);
      s += `<line x1="${gx}" y1="${T}" x2="${gx}" y2="${T + H}" class="g-grid"/><line x1="${L}" y1="${gy}" x2="${L + W}" y2="${gy}" class="g-grid"/>`;
      s += `<text x="${gx}" y="${T + H + 14}" text-anchor="middle" class="g-num">${xmax * i / 5}</text>`;
      s += `<text x="${L - 6}" y="${gy + 4}" text-anchor="end" class="g-num">${ymax * i / 5}</text>`;
    }
    s += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + H}" class="g-axis"/><line x1="${L}" y1="${T + H}" x2="${L + W}" y2="${T + H}" class="g-axis"/>`;
    s += `<text x="${L + W}" y="${T + H + 30}" text-anchor="end" class="g-lab">體積（cm³）</text><text x="4" y="11" class="g-lab">質量（g）</text>`;
    const groups = {};
    recs.forEach(r => { (groups[r.key] = groups[r.key] || []).push(r); });
    Object.values(groups).forEach(g => {
      if (g.length < 2 && !o.lines) return;
      const d = g[0].M / g[0].V, ve = Math.min(xmax, ymax / d);
      s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(ve)}" y2="${Y(ve * d)}" stroke="${g[0].color}" stroke-width="3" stroke-linecap="round"/>`;
      if (g[0].name) {
        const top = ve < xmax;
        s += `<text x="${X(ve) - (top ? -5 : 4)}" y="${Y(ve * d) + (top ? 12 : -6)}" text-anchor="${top ? 'start' : 'end'}" class="g-name">${g[0].name}</text>`;
      }
    });
    recs.forEach(r => { s += `<circle cx="${X(r.V)}" cy="${Y(r.M)}" r="5.5" fill="${r.color}" ${ST}/>`; });
    svg.innerHTML = s;
  }
  function mvGraph(host, recs, o) {
    const svg = h('<svg class="bench-graph" viewBox="0 0 320 220" role="img" aria-label="質量對體積的圖"></svg>');
    host.appendChild(svg); drawGraph(svg, recs, o); return svg;
  }
  // 方便產生某材料的幾個點
  function pts(key, Vs) { const m = MAT[key]; return Vs.map(V => ({ key, name: m.name, color: m.color, V, M: r1(m.d * V) })); }

  /* ---------- 水槽場景（猜／懂 用） ---------- */
  // items: [{label, sub, color, w, h, d}]；回傳 {drop()}
  function tank(host, items, o) {
    o = o || {};
    const VW = 320, WY = 82, BOT = 178;
    const svg = h(`<svg class="bench-svg" viewBox="0 0 ${VW} 190" role="img" aria-label="水槽"></svg>`);
    let s = `<rect x="8" y="${WY}" width="${VW - 16}" height="${BOT - WY + 2}" fill="var(--water)"/>
      <path d="M8 56 V${BOT + 2} H${VW - 8} V56" fill="none" ${ST}/>
      <line x1="8" y1="${WY}" x2="${VW - 8}" y2="${WY}" stroke="var(--water-line)" stroke-width="2"/>`;
    const gap = (VW - 16) / items.length;
    const fin = [];
    items.forEach((it, i) => {
      const cx = 8 + gap * (i + .5), y0 = 62 - it.h;
      const yEnd = it.d < 1 ? WY - it.h * (1 - it.d) : BOT - it.h;
      fin.push(yEnd - y0);
      s += `<g class="tank-item" data-i="${i}"><rect x="${cx - it.w / 2}" y="${y0}" width="${it.w}" height="${it.h}" rx="3" fill="${it.color}" ${ST}/>
        <text x="${cx}" y="${y0 - (it.sub ? 19 : 6)}" text-anchor="middle" class="b-lab">${it.label}</text>
        ${it.sub ? `<text x="${cx}" y="${y0 - 5}" text-anchor="middle" class="g-num">${it.sub}</text>` : ''}</g>`;
    });
    svg.innerHTML = s;
    host.appendChild(svg);
    const gs = [...svg.querySelectorAll('.tank-item')];
    const place = () => gs.forEach((g, i) => { g.style.transform = `translateY(${fin[i]}px)`; });
    if (o.settled) { gs.forEach(g => { g.style.transition = 'none'; }); place(); }
    return { drop() { requestAnimationFrame(place); } };
  }

  /* ---------- 密度實驗台 ---------- */
  function density(host, opts) {
    opts = Object.assign({ mats: Object.keys(MAT), mat: 'fe', V: 50 }, opts || {});
    let mat = opts.mat, V = opts.V, showRatio = !!opts.showRatio;
    const records = [], handlers = {};
    const emit = (e, a) => (handlers[e] || []).forEach(f => f(a));

    const root = h(`<div class="bench">
      <div class="bench-mats" role="group" aria-label="選材料"></div>
      <label class="bench-size"><span>大小：小</span><input type="range" min="10" max="100" step="10" value="${V}" aria-label="大小"><span>大</span></label>
      <svg class="bench-svg" viewBox="0 0 360 205" role="img" aria-label="實驗台：天平、量筒、水槽"></svg>
      <div class="bench-read" aria-live="polite"></div>
      <div class="row bench-btns">
        <button type="button" class="btn primary rec">📌 記錄這一筆</button>
        <button type="button" class="btn cut">✂ 切一半</button>
        <button type="button" class="btn clr">清除紀錄</button>
      </div>
      <div class="bench-note" aria-live="polite"></div>
      <div class="bench-data"><div class="bench-table"></div><svg class="bench-graph" viewBox="0 0 320 220" role="img" aria-label="質量對體積的圖"></svg></div>
      <div class="bench-slot"></div>
    </div>`);
    host.appendChild(root);
    const $ = q => root.querySelector(q);
    const matsEl = $('.bench-mats'), slider = $('input'), svg = $('.bench-svg'), read = $('.bench-read'),
      note = $('.bench-note'), tableEl = $('.bench-table'), graph = $('.bench-graph');

    opts.mats.forEach(k => {
      const b = h(`<button type="button" class="btn mat" data-k="${k}"><i style="background:${MAT[k].color}"></i>${MAT[k].name}</button>`);
      b.addEventListener('click', () => { mat = k; note.textContent = ''; draw(); emit('change'); });
      matsEl.appendChild(b);
    });
    slider.addEventListener('input', () => { V = Number(slider.value); note.textContent = ''; draw(); emit('change'); });
    $('.rec').addEventListener('click', () => record());
    $('.cut').addEventListener('click', () => {
      if (V % 10 !== 0) { say('這一塊已經切過了。先用「大小」拉桿換一塊，再切。'); return; }
      V = V / 2; slider.value = V; draw();
      say('喀！切成一半了。看看天平和量筒的數字怎麼變。');
      record(true); emit('cut');
    });
    $('.clr').addEventListener('click', () => { records.length = 0; note.textContent = ''; drawData(); emit('clear'); });

    function say(t) { note.innerHTML = t; }
    function record(quiet) {
      const m = MAT[mat];
      if (records.some(r => r.key === mat && r.V === V)) { if (!quiet) say('這個大小已經記錄過了，換一個大小再記錄。'); return; }
      records.push({ key: mat, name: m.name, color: m.color, V, M: r1(m.d * V) });
      if (!quiet) say(`記下來了：${m.name}，質量 ${r1(m.d * V)} g，體積 ${V} cm³。`);
      drawData(); emit('record');
    }

    function draw() {
      const m = MAT[mat], M = r1(m.d * V), s = side(V), fl = m.d < 1;
      matsEl.querySelectorAll('.mat').forEach(b => b.classList.toggle('on', b.dataset.k === mat));
      let g = '';
      // 標題
      g += `<text x="64" y="15" text-anchor="middle" class="b-title">① 秤質量</text>
            <text x="170" y="15" text-anchor="middle" class="b-title">② 量體積</text>
            <text x="292" y="15" text-anchor="middle" class="b-title">③ 丟進水裡</text>`;
      // 天平
      g += `<rect x="16" y="160" width="96" height="7" rx="3" fill="var(--line)" ${ST}/>
            <rect x="12" y="167" width="104" height="32" rx="7" fill="var(--card)" ${ST}/>
            <rect x="30" y="174" width="68" height="18" rx="4" fill="#16241b"/>
            <text x="64" y="188" text-anchor="middle" class="b-lcd">${M} g</text>
            <rect x="${64 - s / 2}" y="${160 - s}" width="${s}" height="${s}" rx="3" fill="${m.color}" ${ST}/>`;
      // 量筒：0.8 px / mL，底 y=190，原本 100 mL
      const lv = 190 - (100 + V) * 0.8, bh = V * 0.8 * 40 / 30;
      const by = fl ? lv + 3 : 190 - bh;
      g += `<rect x="150" y="${lv}" width="40" height="${190 - lv}" fill="var(--water)"/>
            <rect x="155" y="${by}" width="30" height="${bh}" rx="2" fill="${m.color}" ${ST}/>`;
      if (fl) g += `<line x1="170" y1="22" x2="170" y2="${by}" stroke="var(--stroke)" stroke-width="1.5"/><text x="174" y="29" class="g-num">細針壓住</text>`;
      for (let ml = 0; ml <= 200; ml += 10) {
        const y = 190 - ml * 0.8, big = ml % 50 === 0;
        g += `<line x1="150" y1="${y}" x2="${big ? 162 : 156}" y2="${y}" stroke="var(--stroke)" stroke-width="${big ? 1.2 : .7}"/>`;
        if (big && ml) g += `<text x="146" y="${y + 3.5}" text-anchor="end" class="g-num">${ml}</text>`;
      }
      g += `<path d="M150 26 V190 H190 V26" fill="none" ${ST}/><rect x="140" y="190" width="60" height="6" rx="2" fill="var(--line)" ${ST}/>
            <line x1="150" y1="110" x2="198" y2="110" stroke="var(--muted)" stroke-dasharray="3 3"/>
            <line x1="150" y1="${lv}" x2="190" y2="${lv}" stroke="var(--water-line)" stroke-width="2"/>
            <text x="194" y="${lv + 4}" class="b-lab">${100 + V}</text>`;
      // 水槽
      const WY = 88, BOT = 193, ty = fl ? WY - s * (1 - m.d) : BOT - s;
      g += `<rect x="234" y="${WY}" width="116" height="${BOT - WY + 2}" fill="var(--water)"/>
            <path d="M234 62 V${BOT + 2} H350 V62" fill="none" ${ST}/>
            <line x1="234" y1="${WY}" x2="350" y2="${WY}" stroke="var(--water-line)" stroke-width="2"/>
            <rect x="${292 - s / 2}" y="${ty}" width="${s}" height="${s}" rx="3" fill="${m.color}" ${ST}/>
            <text x="292" y="36" text-anchor="middle" class="b-state">${fl ? '浮起來 ⬆' : '沉下去 ⬇'}</text>`;
      svg.innerHTML = g;
      read.innerHTML = `<b>${m.name}</b>　天平：<b>${M} g</b>　量筒：水面 100 → ${100 + V}，所以體積 <b>${V} cm³</b>`;
    }

    function drawData() {
      if (!records.length) {
        tableEl.innerHTML = '<p class="muted small">還沒有紀錄。按「📌 記錄這一筆」，數字會記在這裡，右邊的圖也會多一個點。</p>';
      } else {
        tableEl.innerHTML = `<table><thead><tr><th>材料</th><th>質量 (g)</th><th>體積 (cm³)</th>${showRatio ? '<th class="ratio">質量÷體積</th>' : ''}</tr></thead><tbody>` +
          records.map(r => `<tr><td><i style="background:${r.color}"></i>${r.name}</td><td>${r.M}</td><td>${r.V}</td>${showRatio ? `<td class="ratio">${r1(r.M / r.V)}</td>` : ''}</tr>`).join('') + '</tbody></table>';
      }
      drawGraph(graph, records);
    }

    draw(); drawData();
    return {
      records, MAT, slot: $('.bench-slot'), say,
      on(e, f) { (handlers[e] = handlers[e] || []).push(f); },
      showRatio(v) { showRatio = v; drawData(); },
      // 依材料分組：{key: [records]}
      groups() { const g = {}; records.forEach(r => { (g[r.key] = g[r.key] || []).push(r); }); return g; }
    };
  }

  window.Bench = { MAT, density, mvGraph, pts, tank, h };
})();
