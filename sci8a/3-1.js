/* ===== 理化 3-1 波的傳播 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const TAU = Math.PI * 2;
  // 靜態波形：從 x0 到 x1，中線 y，振幅 A，波長 lam（px），起始相位 ph（圈）
  function wavePath(x0, x1, y, A, lam, ph) {
    let d = '';
    for (let x = x0; x <= x1; x += 3) d += (d ? 'L' : 'M') + x + ' ' + (y - A * Math.sin(TAU * (ph - (x - x0) / lam))).toFixed(1);
    return d;
  }
  const coils = (x0, n, y0, y1, gap, dense) => {
    let s = '';
    for (let i = 0; i < n; i++) { const x = x0 + i * gap + dense(i); s += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="#7a8699" stroke-width="2"/>`; }
    return s;
  };

  /* ---------- 波的模擬 ---------- */
  function waveSim(host, onChange) {
    const V = { thin: 2, thick: 1 };
    let f = 1, A = 25, med = 'thin', kind = 'T';
    const seen = { f1: 1, mthin: 1, kT: 1 };
    host.appendChild(h('<p class="sim-h">左手一直抖動一條長長的繩子（或彈簧）</p>'));
    const sv = U.svg(host, '0 0 360 190', '', '波的模擬', 'sim');
    const read = h('<div class="sim-read"></div>');
    const lam = () => V[med] / f;
    function upd() { read.innerHTML = `頻率 <b>${f} Hz</b>（每秒抖 ${f} 下）　波長 <b>${lam()} m</b><br>波速＝頻率×波長＝${f}×${lam()}＝<b>${V[med]} m/s</b>`; }
    let a;
    const ch = k => { seen[k] = 1; upd(); a.restart(); onChange(); };
    U.chips(host, '種類', [{ v: 'T', t: '繩子（橫波）' }, { v: 'L', t: '彈簧（縱波）' }], kind, v => { kind = v; ch('k' + v); });
    U.chips(host, '頻率', [1, 2, 4].map(v => ({ v, t: `每秒 ${v} 下` })), f, v => { f = v; ch('f' + v); });
    U.chips(host, '材料', [{ v: 'thin', t: '細的' }, { v: 'thick', t: '粗的（比較重）' }], med, v => { med = v; ch('m' + v); });
    U.slider(host, '振幅（抖多大）', { min: 10, max: 40, step: 5, value: A, fmt: v => v + ' cm' }, v => { A = v; seen.amp = 1; onChange(); });
    host.appendChild(read); upd();
    a = U.anim(sv, t => {
      const L = lam() * 100, front = 20 + V[med] * 100 * t, ph = f * t;
      const y = x => x > front ? 0 : Math.sin(TAU * (ph - (x - 20) / L));
      let s = `<line x1="20" y1="95" x2="340" y2="95" stroke="var(--line)" stroke-dasharray="4 4"/>
        <line x1="240" y1="178" x2="340" y2="178" stroke="var(--stroke)" stroke-width="1.5"/><line x1="240" y1="173" x2="240" y2="183" stroke="var(--stroke)"/><line x1="340" y1="173" x2="340" y2="183" stroke="var(--stroke)"/>
        <text x="290" y="171" text-anchor="middle" class="t12">1 m</text>`;
      if (kind === 'T') {
        let d = '';
        for (let x = 20; x <= 340; x += 3) d += (d ? 'L' : 'M') + x + ' ' + (95 - A * y(x)).toFixed(1);
        s += `<path d="${d}" fill="none" stroke="#c9a063" stroke-width="3"/><circle cx="200" cy="${(95 - A * y(200)).toFixed(1)}" r="6" fill="var(--bad)" ${ST}/>
          <circle cx="12" cy="${(95 - A * y(20)).toFixed(1)}" r="8" fill="#f2c9a0" ${ST}/>`;
      } else {
        for (let i = 0; i <= 40; i++) {
          const x0 = 20 + i * 8, x = x0 + (A / 4) * y(x0), red = i === 23;
          s += `<line x1="${x.toFixed(1)}" y1="70" x2="${x.toFixed(1)}" y2="120" stroke="${red ? 'var(--bad)' : '#7a8699'}" stroke-width="${red ? 3.5 : 2}"/>`;
        }
        s += `<circle cx="${(10 + (A / 4) * y(20)).toFixed(1)}" cy="95" r="8" fill="#f2c9a0" ${ST}/>`;
      }
      sv.innerHTML = s;
    });
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => U.svg(c, '0 0 320 90', `<rect x="0" y="40" width="320" height="50" fill="var(--water)"/>
          <path d="${wavePath(0, 320, 40, 6, 80, 0)}" fill="none" stroke="var(--water-line)" stroke-width="2"/>
          <text x="150" y="32" font-size="22">🍂</text><text x="20" y="30" class="t12b">丟一顆石頭 →</text>`, '水面上的葉子'),
        q: '在池塘丟一顆石頭，水波一圈一圈往外跑。水面上的<b>葉子</b>會怎樣？',
        options: [{ t: '跟著水波漂到岸邊' }, { t: '在原地上下晃，不會被帶走', ok: true }],
        reveal: '<b>在原地上下晃</b>。水波跑走了，水和葉子卻留在原地。那波到底帶走了什麼？' },
      { q: '手抖繩子，抖得越快，繩子上的波會跑得越快嗎？',
        options: [{ t: '會，抖越快波跑越快' }, { t: '不會，跑的速度一樣', ok: true }],
        reveal: '<b>不會</b>！很多人都猜錯。抖快一點，改變的是別的東西。下一步自己試。' }
    ]);
  }

  function play(p, api) {
    let S;
    const tk = U.tasks(p, api, [
      { text: '看繩子上的<b>紅點</b>，盯著它看 5 秒。', quiet: true, check: () => true,
        qs: () => [{ q: '波一直往右邊跑。紅點呢？', hint: '只看紅點，不要看波。它有往右移動嗎？',
          options: [{ t: '只在原地上下動，沒有往右跑', ok: true, why: '繩子本身沒有被送走，被傳過去的是「抖動」，也就是<b>能量</b>。' },
            { t: '跟著波一起往右跑', why: '盯著紅點：它的左右位置有變嗎？' }, { t: '完全不動', why: '紅點有在上下動喔。' }] }] },
      { text: '把頻率改成<b>每秒 2 下</b>，再改成<b>每秒 4 下</b>。看下面的數字。',
        check: () => S.seen.f2 && S.seen.f4,
        qs: () => [{ q: '抖得越快（頻率越大），一個波的長度（波長）會……',
            options: [{ t: '越短', ok: true, why: '每秒 1 下時波長 2 m，每秒 4 下時只剩 0.5 m。' }, { t: '越長', why: '看波長的數字：2 → 1 → 0.5。' }, { t: '不變', why: '看畫面，波是不是變密了？' }] },
          { q: '那波速呢？', hint: '看讀數最後那個數字。',
            options: [{ t: '不變，都是 2 m/s', ok: true, why: '頻率變 2 倍，波長就變一半，乘起來一樣。<b>波速＝頻率×波長</b>。' }, { t: '變快', why: '看讀數最後的數字有沒有變。' }, { t: '變慢', why: '看讀數最後的數字有沒有變。' }] }] },
      { text: '材料換成<b>粗的</b>，再把種類換成<b>彈簧（縱波）</b>。',
        check: () => S.seen.mthick && S.seen.kL,
        qs: () => [{ q: '同樣每秒抖 1 下，粗繩的波速從 2 m/s 變成 1 m/s。波速是由什麼決定的？',
            options: [{ t: '傳波的東西本身（介質）', ok: true, why: '換了介質，波速才會變。只是抖快一點，波速不會變。' }, { t: '手抖得多快', why: '剛剛改頻率時，波速沒有變。' }, { t: '手抖得多大', why: '拉振幅試試看，波速有變嗎？' }] },
          { q: '彈簧上的<b>紅線</b>是怎麼動的？', hint: '盯著紅線看。',
            options: [{ t: '左右來回動，跟波前進的方向一樣', ok: true, why: '這種波叫<b>縱波</b>（疏密波），一下擠在一起（密）、一下拉開（疏）。繩波是上下動，叫<b>橫波</b>。' }, { t: '上下動', why: '那是繩子。看彈簧的紅線。' }] }] }
    ]);
    const card = h('<div class="card"></div>'); p.appendChild(card);
    S = waveSim(card, () => tk.check());
    card.appendChild(tk.slot);
    tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.svg(U.card(p, '① 波傳的是能量，介質留在原地',
      '<p>繩子、水、空氣這些「傳波的東西」叫<b>介質</b>。<br>介質只在原地來回振動，被傳走的是<b>能量</b>。</p>'),
      '0 0 320 110', `<path d="${wavePath(20, 300, 55, 25, 140, 0)}" fill="none" stroke="#c9a063" stroke-width="3"/>
        <circle cx="160" cy="55" r="6" fill="var(--bad)" ${ST}/><path d="M160 20 V90" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="3 3"/>
        <text x="168" y="24" class="t12b" style="fill:var(--bad)">只上下動</text><text x="220" y="104" class="t12b" style="fill:var(--accent)">能量 →→</text>`, '繩波上的紅點只上下動');
    U.svg(U.card(p, '② 橫波和縱波',
      '<p><b>橫波</b>：介質振動方向和波前進方向<b>垂直</b>（繩波、水波）。<br><b>縱波</b>：介質振動方向和波前進方向<b>平行</b>，一疏一密（彈簧的疏密波、聲波）。</p>'),
      '0 0 320 130', `<path d="${wavePath(20, 300, 32, 18, 90, 0)}" fill="none" stroke="#c9a063" stroke-width="3"/><text x="304" y="36" class="t12b">橫波</text>
        ${coils(20, 36, 82, 118, 8, i => 3 * Math.sin(i * TAU / 11))}<text x="304" y="104" class="t12b">縱波</text>`, '橫波與縱波');
    U.svg(U.card(p, '③ 振幅、波長、週期、頻率',
      '<p><b>振幅</b>：離開中線最遠的距離。<b>波長 λ</b>：一個完整的波有多長（波峰到下一個波峰）。<br><b>週期 T</b>：振動一次要幾秒。<b>頻率 f</b>：一秒振動幾次，單位 Hz。</p><div class="formula">頻率 ＝ 1 ÷ 週期</div>'),
      '0 0 320 130', `<line x1="20" y1="70" x2="300" y2="70" stroke="var(--line)" stroke-dasharray="4 4"/>
        <path d="${wavePath(20, 300, 70, 30, 120, 0.25)}" fill="none" stroke="#c9a063" stroke-width="3"/>
        <path d="M140 18 H260" stroke="var(--accent)" stroke-width="2"/><path d="M140 12 V24 M260 12 V24" stroke="var(--accent)" stroke-width="2"/><text x="200" y="14" text-anchor="middle" class="t12b" style="fill:var(--accent)">波長 λ</text>
        <path d="M150 70 V42" stroke="var(--bad)" stroke-width="2"/><text x="154" y="60" class="t12b" style="fill:var(--bad)">振幅</text>
        <text x="260" y="34" text-anchor="middle" class="t12">波峰</text><text x="200" y="118" text-anchor="middle" class="t12">波谷</text>`, '波的各部分');
    U.card(p, '④ 波速＝頻率 × 波長',
      `<div class="formula">波速 ＝ 頻率 × 波長　（v ＝ f × λ）</div>
       <p><b>波速由介質決定</b>。同一個介質裡，頻率變大，波長就變短，波速不變。</p>`);
    const c = h('<div class="card"><h3>✏️ 算一題看看</h3></div>'); p.appendChild(c);
    U.svg(c, '0 0 320 80', `<path d="${wavePath(20, 300, 40, 20, 70, 0.25)}" fill="none" stroke="#c9a063" stroke-width="3"/>`, '一段繩波');
    U.numq(c, { q: '繩子每秒抖 <b>5</b> 下，波長是 <b>0.4 m</b>。波速是多少？', post: 'm/s', answer: 2,
      hint: '波速＝頻率×波長＝5×0.4。', diag: [{ v: 12.5, msg: '是相乘不是相除：5 <b>×</b> 0.4。' }, { v: 5.4, msg: '是相乘不是相加：5 × 0.4。' }],
      why: '5×0.4＝2 m/s。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開波的模擬',
      bench: host => waveSim(host, () => {}),
      qs: [
        { src: '改寫自 111 年會考',
          pic: c => {
            let d = '';
            for (let t = 0; t <= 1.2001; t += 0.01) d += (d ? 'L' : 'M') + (50 + t * 233).toFixed(1) + ' ' + (60 - 30 * Math.sin(TAU * t / 0.4)).toFixed(1);
            let ax = `<line x1="50" y1="60" x2="335" y2="60" class="g-axis"/><line x1="50" y1="20" x2="50" y2="100" class="g-axis"/>`;
            for (let t = 0; t <= 1.2001; t += 0.2) ax += `<line x1="${50 + t * 233}" y1="57" x2="${50 + t * 233}" y2="63" stroke="var(--stroke)"/><text x="${50 + t * 233}" y="116" text-anchor="middle" class="g-num">${t.toFixed(1)}</text>`;
            U.svg(c, '0 0 360 130', ax + `<path d="${d}" fill="none" stroke="var(--bad)" stroke-width="2.5"/><text x="340" y="128" text-anchor="end" class="g-lab">時間（秒）</text><text x="4" y="14" class="g-lab">P 點的高度</text>`, 'P 點高度隨時間變化').style.maxWidth = '380px';
          },
          q: '用固定頻率上下抖動一條繩子，繩上一點 P 的高度隨時間的變化如圖。這個繩波的<b>週期</b>是多少？',
          hint: '週期＝振動一次（上去、下來、回到原位）要幾秒。從 0 開始，什麼時候第一次回到「往上走」的樣子？',
          options: [{ t: '0.2 秒', why: '0.2 秒時 P 只回到中間，還在往下走，只完成半次。' }, { t: '0.4 秒', ok: true, why: '0～0.4 秒剛好上去、下來、回到原位一次。所以頻率＝1÷0.4＝2.5 Hz。' },
            { t: '0.8 秒', why: '0.8 秒內已經振動兩次了。' }, { t: '1.2 秒', why: '1.2 秒是整張圖的長度，裡面有 3 次振動。' }] },
        { src: '改寫自 104 年會考',
          pic: c => c.appendChild(h(`<table class="sim-table" style="max-width:360px"><thead><tr><th>音</th><th>唱名</th><th>頻率</th><th>波長</th></tr></thead>
            <tbody><tr><td>中央 C</td><td>Do</td><td>262 Hz</td><td>λ₁</td></tr><tr><td>高音 C</td><td>Do</td><td>524 Hz</td><td>λ₂</td></tr></tbody></table>`)),
          q: '中央 C 和高音 C 都唱「Do」，但頻率不同。在同樣的空氣裡傳播時，λ₁ 是 λ₂ 的幾倍？',
          hint: '同樣在空氣裡，波速一樣。頻率變 2 倍，波長會怎樣？',
          options: [{ t: '0.5 倍', why: '頻率越大，波長越短。高音 C 頻率比較大，所以它的波長 λ₂ 比較短。' }, { t: '1 倍', why: '波速一樣、頻率不一樣，波長就不會一樣。' },
            { t: '2 倍', ok: true, why: '524 是 262 的 2 倍，波速相同，所以高音 C 的波長只有一半。λ₁ 是 λ₂ 的 2 倍。' }, { t: '4 倍', why: '頻率是 2 倍，不是 4 倍。' }] },
        { src: '挑戰題・改寫自 107 年會考',
          pic: c => c.appendChild(h(`<table class="sim-table" style="max-width:360px"><thead><tr><th>動物</th><th>聽得到的頻率</th></tr></thead>
            <tbody><tr><td>大象 🐘</td><td>16～12000 Hz</td></tr><tr><td>兔子 🐰</td><td>360～42000 Hz</td></tr></tbody></table>`)),
          q: '空氣中聲波的波速是 <b>34000 cm/s</b>。有一個波長 <b>1000 cm</b> 的聲波，大象和兔子聽得到嗎？',
          hint: '先算頻率：頻率＝波速÷波長。再查表。',
          options: [{ t: '兩種都聽得到', why: '先算頻率：34000÷1000＝34 Hz。兔子最低只聽到 360 Hz。' }, { t: '兩種都聽不到', why: '34 Hz 在大象的範圍（16～12000）裡面。' },
            { t: '大象聽得到，兔子聽不到', ok: true, why: '頻率＝34000÷1000＝34 Hz。大象聽得到（16 以上），兔子聽不到（要 360 以上）。' }, { t: '兔子聽得到，大象聽不到', why: '算出來是 34 Hz，是很低的聲音。' }] }
      ]
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    U.mount(document.getElementById('unit'), { unit: 'sci8a-3-1', home: 'index.html', steps: [
      { id: 'guess', label: '猜', title: '先猜猜看：波帶走了什麼？', render: guess },
      { id: 'play', label: '玩', title: '動手玩：抖一條繩子', render: play },
      { id: 'know', label: '懂', title: '收成 4 句話', render: know },
      { id: 'exam', label: '考', title: '會考真的這樣考', render: exam }
    ] });
  });
})();
