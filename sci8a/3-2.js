/* ===== 理化 3-2 聲音的形成 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const airV = T => Math.round((331 + 0.6 * T) * 10) / 10;

  /* ---------- 真空鐘罩 ---------- */
  function bellSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">鐘罩裡有一個電鈴，旁邊的抽氣機可以把空氣抽掉</p>'));
    const sv = U.svg(host, '0 0 360 200', '', '真空鐘罩', 'sim');
    const read = h('<div class="sim-read"></div>');
    let air = 100, ringEnd = 0; const seen = {};
    const dots = []; for (let i = 0; i < 30; i++) dots.push([90 + (i * 47) % 120, 50 + (i * 31) % 120]);
    const hear = () => air === 0 ? '<b>完全聽不到</b>（可是看得到鈴錘一直在敲！）' : air <= 40 ? '<b>很小聲</b>' : air <= 80 ? '<b>小聲一點</b>' : '<b>很大聲 🔔</b>';
    function upd() { read.innerHTML = `鐘罩裡的空氣：<b>${air}%</b>　你聽到：` + (performance.now() < ringEnd ? hear() : '（按「敲鈴」）'); }
    U.slider(host, '鐘罩裡的空氣（往左＝抽氣）', { min: 0, max: 100, step: 20, value: air, fmt: v => v + '%' }, v => { air = v; upd(); onChange(); });
    const row = h('<div class="row"><button type="button" class="btn primary">🔔 敲鈴（響 3 秒）</button></div>');
    row.firstChild.addEventListener('click', () => { ringEnd = performance.now() + 3000; seen['r' + air] = 1; upd(); onChange(); });
    host.append(row, read); upd();
    let wasRing = false;
    U.anim(sv, t => {
      const ring = performance.now() < ringEnd;
      if (wasRing && !ring) upd();
      wasRing = ring;
      const ang = ring ? 14 * Math.sin(t * 40) : 0, op = air / 100;
      let s = `<path d="M70 180 V75 Q70 22 150 22 Q230 22 230 75 V180" fill="var(--accent-soft)" fill-opacity=".35" ${ST}/>
        <rect x="50" y="180" width="200" height="10" rx="3" fill="var(--line)" ${ST}/>
        <path d="M230 160 H285" stroke="var(--stroke)" stroke-width="5"/><rect x="285" y="140" width="62" height="44" rx="6" fill="var(--card)" ${ST}/><text x="316" y="167" text-anchor="middle" class="t12b">抽氣機</text>`;
      dots.slice(0, Math.round(air / 100 * 30)).forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="2.2" fill="var(--muted)"/>`; });
      if (ring && air > 0) for (let k = 0; k < 3; k++) {
        const r = 20 + ((t * 60 + k * 40) % 120);
        s += `<circle cx="150" cy="110" r="${r}" fill="none" stroke="var(--accent)" stroke-width="2" opacity="${(op * (1 - r / 150)).toFixed(2)}"/>`;
      }
      s += `<line x1="150" y1="60" x2="150" y2="90" stroke="var(--stroke)" stroke-width="2"/>
        <g transform="rotate(${ang.toFixed(1)} 150 90)"><path d="M130 130 Q130 90 150 90 Q170 90 170 130 Z" fill="#f2c230" ${ST}/><circle cx="150" cy="136" r="5" fill="#7a8699" ${ST}/></g>`;
      if (ring && air === 0) s += `<text x="150" y="172" text-anchor="middle" class="t12b" style="fill:var(--bad)">🔇 看得到在敲，聽不到</text>`;
      sv.innerHTML = s;
    });
    return { seen };
  }

  /* ---------- 聲速賽跑 ---------- */
  function raceSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">在 1000 m 長的空氣、水、鋼鐵的一端敲一下，聲音多久到另一端？</p>'));
    const sv = U.svg(host, '0 0 360 170', '', '聲速賽跑', 'sim');
    let T = 15, start = 0, runT = 15; const seen = {};
    const lanes = () => [['空氣', airV(runT), '#8fb8ff'], ['水', 1500, '#4aa3d8'], ['鋼鐵', 5000, '#7a8699']];
    U.slider(host, '氣溫', { min: 0, max: 40, step: 5, value: T, fmt: v => `${v} °C（空氣中聲速 ${airV(v)} m/s）` }, v => { T = v; onChange(); });
    const row = h('<div class="row"><button type="button" class="btn primary">🔨 敲一下</button></div>');
    row.firstChild.addEventListener('click', () => { start = performance.now(); runT = T; seen.raced = 1; seen['t' + T] = 1; onChange(); });
    host.appendChild(row);
    U.anim(sv, () => {
      const el = start ? (performance.now() - start) / 1000 : 0;
      let s = '';
      lanes().forEach(([n, v, c], i) => {
        const y = 30 + i * 50, pos = start ? Math.min(1, v * el / 1000) : 0;
        s += `<rect x="70" y="${y - 12}" width="260" height="24" rx="5" fill="${c}" opacity=".35" ${ST}/><text x="62" y="${y + 5}" text-anchor="end" class="t14b">${n}</text>`;
        if (start) s += `<circle cx="${70 + 260 * pos}" cy="${y}" r="8" fill="var(--bad)" ${ST}/>`;
        if (start && pos >= 1) s += `<text x="330" y="${y + 26}" text-anchor="end" class="t12b">${(1000 / v).toFixed(2)} 秒（${v} m/s）</text>`;
      });
      s += `<text x="70" y="165" class="t12 mut">🔨 敲這邊</text><text x="330" y="165" text-anchor="end" class="t12 mut">👂 聽這邊（1000 m）</text>`;
      sv.innerHTML = s;
    });
    return { seen };
  }

  /* ---------- 共振音叉（懂、考 用） ---------- */
  function forkPic(host, lit) {
    const fork = (x, on, f) => `<path d="M${x - 10} 30 V90 Q${x - 10} 104 ${x} 104 Q${x + 10} 104 ${x + 10} 90 V30" fill="none" stroke="#7a8699" stroke-width="5"/><line x1="${x}" y1="104" x2="${x}" y2="128" stroke="#7a8699" stroke-width="5"/>
      <rect x="${x - 34}" y="128" width="68" height="20" rx="3" fill="#c9a063" ${ST}/><text x="${x}" y="166" text-anchor="middle" class="t12b">${f}</text>` +
      (on ? `<path d="M${x - 22} 40 q-6 14 0 28 M${x + 22} 40 q6 14 0 28" fill="none" stroke="var(--accent)" stroke-width="2"/>` : '');
    return U.svg(host, '0 0 320 175', fork(80, true, '甲：440 Hz（敲它）') + fork(240, lit, '乙：440 Hz') +
      `<path d="M120 70 q10 -8 20 0 q10 8 20 0 q10 -8 20 0" fill="none" stroke="var(--accent)" stroke-width="2"/>`, '兩支相同頻率的音叉');
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '把手指輕輕放在喉嚨上，說「啊——」。手指會感覺到什麼？',
        options: [{ t: '喉嚨在抖動', ok: true }, { t: '什麼感覺都沒有' }],
        reveal: '<b>喉嚨在抖動</b>。聲音都是從「振動」來的：喉嚨、吉他弦、喇叭，發出聲音時都在抖。' },
      { pic: c => U.svg(c, '0 0 320 70', '<text x="90" y="46" font-size="34">👨‍🚀</text><text x="190" y="46" font-size="34">👩‍🚀</text><text x="160" y="64" text-anchor="middle" class="t12 mut">外太空（沒有空氣）</text>', '兩個太空人'),
        q: '兩個太空人在外太空，面罩靠得很近（沒有碰在一起），不用無線電，大聲喊得到對方嗎？',
        options: [{ t: '喊得到，只要夠大聲' }, { t: '喊不到', ok: true }],
        reveal: '<b>喊不到</b>。為什麼？下一步用抽氣機把空氣抽掉就知道了。' }
    ]);
  }

  function play(p, api) {
    let B, R;
    const tk = U.tasks(p, api, [
      { text: '先<b>敲一次鈴</b>聽聽看，再把空氣<b>抽到 0%</b>，再敲一次。',
        setup() { a.hidden = false; b.hidden = true; },
        check: () => B.seen.r100 && B.seen.r0,
        qs: () => [{ q: '空氣抽光（真空）以後，會怎樣？',
            options: [{ t: '看得到鈴在敲，但聽不到聲音', ok: true, why: '聲音要靠空氣（介質）一個推一個傳過來。沒有介質，聲音就傳不出來。' }, { t: '鈴就不會敲了', why: '鈴錘還在敲，只是聲音傳不出來。' }, { t: '聲音一樣大', why: '把空氣再慢慢放回去敲敲看，聲音大小有變嗎？' }] },
          { q: '真空裡聽不到聲音，為什麼還<b>看得到</b>鈴在敲？',
            options: [{ t: '光不需要介質，在真空裡也能傳', ok: true, why: '所以太陽光能穿過太空照到地球，太陽上的聲音卻傳不過來。' }, { t: '因為鐘罩是透明的', why: '鐘罩透明，所以光能進出。但重點是：光在真空裡也能傳，聲音不行。' }] }] },
      { text: '換到聲速賽跑：按「🔨 敲一下」，比比看聲音在哪一種東西裡跑得最快。',
        setup() { b.hidden = false; a.hidden = true; },
        check: () => R.seen.raced,
        qs: () => [{ q: '聲音在哪一種介質裡跑得最快？',
            options: [{ t: '鋼鐵（固體）', ok: true, why: '一般來說，聲速：<b>固體 ＞ 液體 ＞ 氣體</b>。所以把耳朵貼在鐵軌上，會比在空氣中先聽到火車聲。' }, { t: '水（液體）', why: '看秒數：哪一條最先到？' }, { t: '空氣（氣體）', why: '空氣最慢，要將近 3 秒。' }] }] },
      { text: '把氣溫改成 <b>0 °C</b> 敲一次，再改成 <b>40 °C</b> 敲一次。',
        check: () => R.seen.t0 && R.seen.t40,
        qs: () => [{ q: '氣溫越高，空氣中的聲速會……',
            options: [{ t: '越快', ok: true, why: '空氣中的聲速 ≈ 331 ＋ 0.6 × 氣溫（m/s）。' }, { t: '越慢', why: '看拉桿旁邊的數字：0 °C 和 40 °C 各是多少？' }, { t: '不變', why: '看拉桿旁邊的數字有沒有變。' }] },
          { num: true, q: '氣溫 15 °C 時，空氣中的聲速是多少？', post: 'm/s', answer: 340,
            hint: '331 ＋ 0.6 × 15 ＝ ?', diag: [{ v: 346, msg: '0.6 × 15 ＝ 9，不是 15。' }, { v: 331, msg: '還要加上 0.6 × 15。' }], why: '331＋9＝340 m/s，這是最常用的聲速。' }] }
    ]);
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const a = h('<div></div>'), b = h('<div hidden></div>');
    card.append(a, b, tk.slot);
    B = bellSim(a, () => tk.check());
    R = raceSim(b, () => tk.check());
    tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 5 句話。</p>'));
    U.svg(U.card(p, '① 聲音是由物體振動產生的',
      '<p>喉嚨、琴弦、鼓面、喇叭紙盆……發出聲音時都在<b>振動</b>。振動一停，聲音就停。</p>'),
      '0 0 320 90', `<rect x="40" y="40" width="240" height="10" rx="4" fill="#c9a063" ${ST}/><path d="M60 45 Q160 15 260 45 Q160 75 60 45" fill="none" stroke="var(--accent)" stroke-dasharray="4 3"/>
        <text x="160" y="84" text-anchor="middle" class="t12b">琴弦振動 → 發出聲音</text>`, '振動的琴弦');
    U.card(p, '② 聲音要靠介質傳播，真空不能傳',
      '<p>空氣、水、木頭、鐵都能傳聲音。<br><b>真空</b>沒有介質，聲音傳不過去；但<b>光</b>可以。</p>');
    U.card(p, '③ 聲速：固體 ＞ 液體 ＞ 氣體；氣溫越高越快',
      `<table class="sim-table" style="max-width:360px"><tbody><tr><td>空氣（15 °C）</td><td>約 340 m/s</td></tr><tr><td>水</td><td>約 1500 m/s</td></tr><tr><td>鋼鐵</td><td>約 5000 m/s</td></tr></tbody></table>
       <div class="formula">空氣中聲速 ≈ 331 ＋ 0.6 × 氣溫（°C）</div>`);
    U.svg(U.card(p, '④ 聲波是縱波（疏密波）',
      '<p>振動推擠旁邊的空氣，空氣一疏一密地把能量傳出去。空氣本身沒有跑到你耳朵，傳過來的是<b>能量</b>。</p>'),
      '0 0 320 70', (() => { let s = ''; for (let i = 0; i < 36; i++) { const x = 20 + i * 8 + 3 * Math.sin(i * Math.PI * 2 / 9); s += `<line x1="${x}" y1="14" x2="${x}" y2="56" stroke="#7a8699" stroke-width="2"/>`; } return s; })(), '聲波的疏密');
    forkPic(U.card(p, '⑤ 共振：頻率相同才會一起響',
      '<p>兩支<b>頻率相同</b>的音叉，敲響甲，聲波傳到乙，乙也會跟著振動發聲，這叫<b>共振</b>。<br>頻率不同，就不會共振。</p>'), true);
    const c = h('<div class="card"><h3>✏️ 算一題看看</h3></div>'); p.appendChild(c);
    U.svg(c, '0 0 320 70', '<text x="60" y="46" font-size="34">⚡</text><text x="130" y="44" class="t14b">→ 3 秒後 →</text><text x="240" y="46" font-size="34">🔊</text>', '先看到閃電，3 秒後聽到雷聲');
    U.numq(c, { q: '看到閃電後 <b>3 秒</b>才聽到雷聲。聲速 340 m/s，打雷的地方離你多遠？', post: 'm', answer: 1020,
      hint: '光幾乎一瞬間就到了，所以這 3 秒是聲音跑的時間。距離＝速度×時間。',
      diag: [{ v: 113.3, msg: '是相乘不是相除：340 × 3。' }, { v: 510, msg: '這題不用除以 2，聲音只跑了一趟（不是回聲）。' }],
      why: '340 × 3 ＝ 1020 m，大約 1 公里。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開聲速賽跑',
      bench: host => raceSim(host, () => {}),
      qs: [
        { src: '改寫自 103 年會考',
          pic: c => U.svg(c, '0 0 320 70', '<text x="20" y="46" font-size="32">🚚</text><text x="60" y="34" class="t12">🎵</text><line x1="70" y1="50" x2="250" y2="50" stroke="var(--stroke)" stroke-dasharray="5 4"/><text x="160" y="66" text-anchor="middle" class="t12b">680 m</text><text x="262" y="46" font-size="32">🏠</text>', '垃圾車離家 680 公尺'),
          q: '垃圾車停在離你家 <b>680 m</b> 的地方開始播音樂。聲速 340 m/s，音樂要多久才傳到你家？',
          hint: '時間＝距離÷速度。',
          options: [{ t: '0 秒', why: '聲音要時間才能跑過去。光才是幾乎一瞬間。' }, { t: '1.0 秒', why: '340 m/s 跑 1 秒只有 340 m。' }, { t: '1.5 秒', why: '算算看：680 ÷ 340。' }, { t: '2.0 秒', ok: true, why: '680 ÷ 340 ＝ 2 秒。' }] },
        { src: '基本題',
          q: '小明把耳朵貼在鐵軌上，比站著用耳朵聽空氣，<b>更早</b>聽到遠方火車的聲音。原因是什麼？',
          hint: '想想剛剛的賽跑：鋼鐵和空氣誰比較快？',
          options: [{ t: '聲音在鋼鐵裡傳得比在空氣中快', ok: true, why: '聲速：固體 ＞ 液體 ＞ 氣體。' }, { t: '鐵軌會把聲音變大聲', why: '這題比的是「早」，不是大聲。' },
            { t: '耳朵貼著地面比較靠近火車', why: '只低了一公尺多，對幾百公尺的距離幾乎沒差。' }, { t: '空氣不能傳聲音', why: '空氣可以傳聲音，只是比較慢。' }] },
        { src: '挑戰題・改寫自 110 年會考',
          pic: c => forkPic(c, true),
          q: '兩支頻率都是 440 Hz 的音叉放在桌上。敲甲以後用手按住甲讓它停，還是聽得到乙在響。老師想證明「<b>頻率相同才會共振</b>」，下一步該怎麼做？',
          hint: '要證明「頻率相同才會」，就要做一個頻率「不同」的比較看看。',
          options: [
            { t: '把乙換成 500 Hz 的音叉，敲甲，看乙會不會響', ok: true, why: '只改「頻率」這一個條件。如果頻率不同時乙就不響，才能證明頻率相同是共振的條件。' },
            { t: '把兩支都換成 500 Hz 的音叉，再做一次', why: '兩支還是頻率相同，只能再證明一次「相同會共振」。' },
            { t: '用更大的力氣敲甲', why: '這改變的是響度，不是頻率。' },
            { t: '把兩支音叉靠得更近', why: '這改變的是距離，不是頻率。' }] }
      ]
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    U.mount(document.getElementById('unit'), { unit: 'sci8a-3-2', home: 'index.html', steps: [
      { id: 'guess', label: '猜', title: '先猜猜看：聲音從哪裡來？', render: guess },
      { id: 'play', label: '玩', title: '動手玩：抽掉空氣、聲速賽跑', render: play },
      { id: 'know', label: '懂', title: '收成 5 句話', render: know },
      { id: 'exam', label: '考', title: '會考真的這樣考', render: exam }
    ] });
  });
})();
