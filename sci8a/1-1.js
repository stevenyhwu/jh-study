/* ===== 理化 1-1 實驗室的基本操作 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';

  /* 放大的量筒（20～36 mL）。level: 真正水面；eye: 眼睛比水面高多少 px（null 不畫眼睛） */
  const Y = ml => 205 - (ml - 20) * 12;
  function cyl(level, eye) {
    const ym = Y(level);
    let s = `<path d="M100 ${ym - 5} Q140 ${ym + 5} 180 ${ym - 5} V210 H100 Z" fill="var(--water)"/>
      <path d="M100 ${ym - 5} Q140 ${ym + 5} 180 ${ym - 5}" fill="none" stroke="var(--water-line)" stroke-width="2"/>
      <path d="M100 8 V210 H180 V8" fill="none" ${ST}/>`;
    for (let ml = 20; ml <= 36; ml++) {
      const big = ml % 5 === 0;
      s += `<line x1="${big ? 164 : 171}" y1="${Y(ml)}" x2="180" y2="${Y(ml)}" stroke="var(--stroke)" stroke-width="${big ? 1.5 : 1}"/>`;
      if (big) s += `<text x="186" y="${Y(ml) + 4}" class="t12b">${ml}</text>`;
    }
    let seen = level;
    if (eye != null) {
      const ye = ym - eye, yc = ym - eye * 40 / 180;
      seen = Math.round((20 + (205 - yc) / 12) * 10) / 10;
      s += `<line x1="318" y1="${ye}" x2="140" y2="${ym}" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <circle cx="180" cy="${yc}" r="4" fill="var(--bad)"/><circle cx="140" cy="${ym}" r="3" fill="var(--stroke)"/>
        <text x="322" y="${ye + 7}" font-size="22">👁</text>`;
    }
    return { s, seen };
  }

  /* ---------------- 猜 ---------------- */
  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => U.svg(c, '0 0 320 110',
          `<rect x="120" y="60" width="80" height="40" rx="14" fill="var(--water)" ${ST}/><rect x="150" y="44" width="20" height="18" fill="var(--line)" ${ST}/>
           <path d="M160 44 C150 30 158 22 160 10 C164 22 172 30 160 44Z" fill="#f6a54b" stroke="#d64545" stroke-width="1.5"/>
           <text x="160" y="86" text-anchor="middle" class="t12b">酒精</text>`, '點著的酒精燈'),
        q: '實驗做完了，<b>酒精燈</b>要怎麼熄滅？',
        options: [{ t: '用嘴巴吹熄' }, { t: '用燈蓋蓋上去', ok: true }, { t: '倒水澆熄' }],
        reveal: '用<b>燈蓋</b>蓋熄。用嘴吹，火可能被吹進瓶子裡，很危險；酒精比水輕，澆水反而讓火跟著流出來。' },
      { pic: c => U.svg(c, '0 0 360 220', cyl(26, null).s +
          '<text x="250" y="40" font-size="20">👁</text><text x="276" y="38" class="t12">從上面看</text><text x="250" y="150" font-size="20">👁</text><text x="276" y="148" class="t12">跟水面一樣高</text><text x="250" y="212" font-size="20">👁</text><text x="276" y="210" class="t12">從下面看</text>', '量筒與三種眼睛高度', 'sim'),
        q: '看<b>量筒</b>的刻度時，眼睛要放在哪裡，讀到的才準？',
        options: [{ t: '從上面往下看' }, { t: '跟水面一樣高', ok: true }, { t: '從下面往上看' }],
        reveal: '眼睛要<b>跟水面一樣高</b>。為什麼太高太低都不準？下一步自己移動眼睛看看。' }
    ]);
  }

  /* ---------------- 玩 ---------------- */
  // 模擬一：移動眼睛讀量筒
  function eyeSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">量筒裡的水，真正是 26.0 mL</p>'));
    const sv = U.svg(host, '0 0 360 220', '', '量筒讀數', 'sim');
    const read = h('<div class="sim-read"></div>');
    let e = 80; const seen = {};
    function draw() {
      const c = cyl(26, e); sv.innerHTML = c.s;
      const k = e > 0 ? '從上面往下看（俯視）' : e < 0 ? '從下面往上看（仰視）' : '跟水面一樣高（平視）';
      read.innerHTML = `${k}　紅點讀到：<b>${c.seen.toFixed(1)} mL</b>`;
      seen[Math.sign(e)] = 1;
    }
    U.slider(host, '眼睛的高度', { min: -100, max: 100, step: 10, value: e, fmt: v => v > 0 ? '（高）' : v < 0 ? '（低）' : '（剛好）' }, v => { e = v; draw(); onChange(); });
    host.appendChild(read); draw();
    return { level: () => e, seenAll: () => seen[1] && seen[-1] && seen[0] };
  }
  // 模擬二：加到剛好 30.0 mL
  function fillSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">目標：加到剛好 30.0 mL</p>'));
    const sv = U.svg(host, '0 0 360 220', '', '量筒', 'sim');
    const read = h('<div class="sim-read"></div>'), note = h('<div class="sim-note"></div>');
    let t = 0; // 單位 0.1 mL
    const start = () => { t = 280 + 2 * Math.floor(Math.random() * 4); };
    function draw() {
      sv.innerHTML = cyl(t / 10, 0).s + `<line x1="92" y1="${Y(30)}" x2="60" y2="${Y(30)}" stroke="var(--good)" stroke-width="2"/><text x="56" y="${Y(30) + 4}" text-anchor="end" class="t12b" style="fill:var(--good)">目標 30.0</text>`;
      read.innerHTML = `現在：<b>${(t / 10).toFixed(1)} mL</b>`;
    }
    const row = h('<div class="row"><button type="button" class="btn">🥛 用燒杯倒一點</button><button type="button" class="btn">💧 用滴管滴一滴</button></div>');
    const add = d => {
      t += d;
      if (t > 300) { note.innerHTML = `倒到 ${(t / 10).toFixed(1)} mL，<b>超過了！</b>只好倒掉重來。`; start(); }
      else note.innerHTML = t === 300 ? '剛剛好 30.0 mL！' : (d > 5 ? '燒杯一倒就是一大口。' : '滴管一次只加一點點。');
      draw(); onChange();
    };
    row.children[0].addEventListener('click', () => add(12 + 2 * Math.floor(Math.random() * 8)));
    row.children[1].addEventListener('click', () => add(2));
    host.append(row, read, note); start(); draw();
    return { ok: () => t === 300 };
  }

  const SAFE = [
    { t: '用火柴點燃酒精燈', bin: 0, why: '用火柴或點火槍點才安全。' },
    { t: '拿一個點著的酒精燈，去點另一個酒精燈', bin: 1, why: '燈一斜，酒精會流出來燒起來。' },
    { t: '用燈蓋把酒精燈蓋熄', bin: 0, why: '蓋住就沒有空氣，火就熄了。' },
    { t: '用嘴巴把酒精燈吹熄', bin: 1, why: '火可能被吹進瓶子裡。' },
    { t: '想聞氣體時，用手在瓶口搧一搧', bin: 0, why: '搧一點點過來聞就好。' },
    { t: '把鼻子直接湊到瓶口用力聞', bin: 1, why: '一下吸進太多，可能有毒或太刺激。' },
    { t: '加熱試管時，試管口對著旁邊的同學', bin: 1, why: '液體可能噴出來，管口不可以對著任何人。' },
    { t: '稀釋濃硫酸：把硫酸慢慢倒進水裡', bin: 0, why: '「酸入水」。反過來把水倒進酸，會劇烈發熱噴濺。' }
  ];

  function play(p, api) {
    let A, B, sorted = false;
    const tk = U.tasks(p, api, [
      { text: '拉「眼睛的高度」，從最高拉到最低，看紅點讀到的數字怎麼變。最後停在<b>讀數正確</b>的位置。',
        setup() { a.hidden = false; b.hidden = c.hidden = true; },
        check: () => A.seenAll() && A.level() === 0,
        qs: () => [{ q: '眼睛太高（從上面往下看）時，讀到的數字會……', hint: '把眼睛拉到最高，看紅點在哪。',
            options: [{ t: '比真正的大', ok: true, why: '俯視讀數偏大，仰視讀數偏小，只有平視才準。' }, { t: '比真正的小', why: '把眼睛拉到最高，紅點讀到多少？真正的是 26.0。' }, { t: '一樣', why: '拉拉看，數字有在變喔。' }] },
          { q: '水面是彎彎凹下去的。要讀哪裡的刻度？', hint: '看圖上黑點的位置。',
            options: [{ t: '凹下去的最低點', ok: true, why: '讀水面中央<b>最低</b>的地方。' }, { t: '靠近玻璃、翹起來的最高點', why: '邊邊是水沿著玻璃爬上去的，不算。' }] }] },
      { text: '現在要量取<b>剛好 30.0 mL</b>。用燒杯和滴管，把水加到目標線。',
        setup() { b.hidden = false; a.hidden = c.hidden = true; },
        check: () => B.ok(),
        qs: () => [{ q: '快到刻度的時候，應該改用什麼來加？',
            options: [{ t: '滴管', ok: true, why: '滴管一次只加一點點，才不會衝過頭。' }, { t: '燒杯', why: '燒杯一倒就是一大口，很容易超過。' }] }] },
      { text: '實驗室安全：下面每一張卡片的做法，<b>可以</b>還是<b>不可以</b>？',
        setup() { c.hidden = false; a.hidden = b.hidden = true; }, quiet: true,
        check: () => sorted, found: '這些規則都是為了同一件事：不要讓火、藥品、熱的東西傷到人。' }
    ]);
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const a = h('<div></div>'), b = h('<div hidden></div>'), c = h('<div hidden></div>');
    card.append(a, b, c, tk.slot);
    A = eyeSim(a, () => tk.check());
    B = fillSim(b, () => tk.check());
    U.sort(c, { bins: ['✅ 可以', '⛔ 不可以'], items: SAFE, onDone() { sorted = true; tk.check(); } });
    tk.start();
  }

  /* ---------------- 懂 ---------------- */
  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.svg(U.card(p, '① 讀量筒：眼睛平視，看凹面最低點',
      '<p>眼睛跟水面<b>一樣高</b>，讀水面<b>凹下去最低</b>的地方。</p><p>從上面看（俯視）→ 讀到的<b>偏大</b>。<br>從下面看（仰視）→ 讀到的<b>偏小</b>。</p>'),
      '0 0 360 220', cyl(26, 0).s, '平視讀量筒', 'sim');
    U.svg(U.card(p, '② 快到刻度，改用滴管',
      '<p>先用燒杯倒到<b>接近</b>目標，最後一點點用<b>滴管</b>慢慢加。</p>'),
      '0 0 320 120', `<rect x="40" y="30" width="60" height="70" rx="4" fill="var(--water)" ${ST}/><text x="70" y="116" text-anchor="middle" class="t12b">燒杯：大口</text>
        <path d="M228 20 h14 v50 l-7 26 l-7 -26 Z" fill="var(--water)" ${ST}/><ellipse cx="235" cy="16" rx="12" ry="9" fill="var(--bad-soft)" ${ST}/><text x="235" y="116" text-anchor="middle" class="t12b">滴管：一滴一滴</text>`, '燒杯和滴管');
    U.svg(U.card(p, '③ 酒精燈：火柴點、燈蓋熄',
      '<p>用<b>火柴</b>點火，不可以用另一個酒精燈來點。<br>用<b>燈蓋</b>蓋熄，不可以用嘴吹。<br>酒精不要裝太滿（最多大約三分之二）。</p>'),
      '0 0 320 120', `<rect x="60" y="64" width="80" height="40" rx="14" fill="var(--water)" ${ST}/><rect x="90" y="48" width="20" height="18" fill="var(--line)" ${ST}/>
        <path d="M100 48 C90 34 98 26 100 14 C104 26 112 34 100 48Z" fill="#f6a54b" stroke="#d64545" stroke-width="1.5"/>
        <path d="M200 40 h44 v30 h-44 Z" fill="var(--line)" ${ST}/><text x="222" y="92" text-anchor="middle" class="t12b">燈蓋</text><text x="100" y="118" text-anchor="middle" class="t12b">酒精燈</text>`, '酒精燈和燈蓋');
    U.svg(U.card(p, '④ 不對人、用手搧、酸入水',
      '<p>加熱試管：管口<b>不對著人</b>。<br>聞氣體：<b>用手搧</b>過來聞。<br>稀釋濃硫酸：<b>酸慢慢倒進水裡</b>，不可以反過來。</p>'),
      '0 0 320 120', `<rect x="40" y="50" width="70" height="56" rx="4" fill="var(--water)" ${ST}/><text x="75" y="84" text-anchor="middle" class="t12b">水</text>
        <rect x="150" y="14" width="44" height="40" rx="4" fill="var(--warn-soft)" ${ST} transform="rotate(-35 172 34)"/><text x="206" y="30" class="t12b">濃硫酸</text>
        <path d="M150 52 Q120 46 96 52" fill="none" stroke="var(--accent)" stroke-width="2.5" marker-end="url(#ar)"/>
        <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="var(--accent)"/></marker></defs>
        <text x="206" y="84" class="t12b" style="fill:var(--accent)">酸 → 水 ✔</text>`, '把酸倒進水裡');
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.svg(c, '0 0 360 220', cyl(26, 80).s, '俯視讀量筒', 'sim');
    U.choice(c, { q: '小明像上圖這樣<b>從上面往下看</b>，讀到 27.5 mL。量筒裡真正的水量是……',
      hint: '俯視讀到的數字偏大還是偏小？',
      options: [{ t: '比 27.5 mL 少', ok: true, why: '俯視會讀得偏大，所以真正的水比 27.5 少。' }, { t: '剛好 27.5 mL', why: '只有平視才會讀到剛好。' }, { t: '比 27.5 mL 多', why: '俯視是讀「偏大」，真正的應該更少。' }],
      onDone() { api.done(); } });
  }

  /* ---------------- 考 ---------------- */
  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開「加到 30.0 mL」的量筒',
      bench: host => fillSim(host, () => {}),
      qs: [
        { src: '改寫自 107 年會考',
          pic: c => U.svg(c, '0 0 360 220', cyl(29, null).s + `<line x1="92" y1="${Y(30)}" x2="60" y2="${Y(30)}" stroke="var(--good)" stroke-width="2"/><text x="56" y="${Y(30) + 4}" text-anchor="end" class="t12b" style="fill:var(--good)">要到 30.0</text>`, '量筒已經裝到 29 mL', 'sim'),
          q: '小瑩想用量筒量取 <b>30.0 mL</b> 的溶液，現在已經倒到圖中的位置。接下來用哪一種器材加溶液，<b>最能避免超過</b> 30.0 mL？',
          hint: '打開上面的量筒試試：燒杯和滴管，哪個不會衝過頭？',
          options: [{ t: '燒杯', why: '燒杯一倒就是一大口。' }, { t: '滴管', ok: true, why: '只差一點點的時候，用滴管一滴一滴加最安全。' }, { t: '錐形瓶', why: '錐形瓶和燒杯一樣，很難只倒一點點。' }, { t: '另一個量筒', why: '量筒倒出來也是一大口。' }] },
        { src: '改寫自 112 年會考',
          pic: c => U.svg(c, '0 0 320 150',
            `<rect x="110" y="40" width="100" height="70" rx="4" fill="var(--water)" ${ST}/><line x1="160" y1="6" x2="160" y2="90" stroke="var(--bad)" stroke-width="4" stroke-linecap="round"/>
             <line x1="96" y1="112" x2="224" y2="112" stroke="var(--stroke)" stroke-width="2"/>
             <path d="M160 132 C152 124 158 118 160 112 C163 118 168 124 160 132Z" fill="#f6a54b" stroke="#d64545"/><rect x="140" y="132" width="40" height="16" rx="6" fill="var(--line)" ${ST}/>
             <text x="170" y="20" class="t12b">溫度計</text><text x="230" y="80" class="t12b">水</text><text x="230" y="144" class="t12b">酒精燈</text>`, '用酒精燈加熱燒杯裡的水，溫度計吊在水中'),
          q: '用酒精燈加熱燒杯裡的水，並用溫度計量水溫。下列哪一個做法<b>正確</b>？',
          hint: '我們要量的是「水」的溫度。杯底、火焰旁邊的溫度跟水一樣嗎？',
          options: [
            { t: '把溫度計吊在水中，不碰到杯底', ok: true, why: '杯底比水熱，碰到杯底量到的就不是水溫。' },
            { t: '調整支架，讓酒精燈的火焰靠近溫度計', why: '這樣量到的是火的熱，不是水溫，溫度計還可能破掉。' },
            { t: '拿溫度計攪拌，讓水溫均勻', why: '溫度計很容易敲破，要攪拌請用玻璃棒。' },
            { t: '把酒精燈的酒精裝滿，讓火焰大小固定', why: '酒精裝太滿容易溢出來著火，最多大約三分之二。' }] },
        { src: '改寫自 105 年會考',
          q: '小萍要把濃硫酸加水稀釋。哪一個做法才安全？',
          hint: '口訣：酸入水。',
          options: [
            { t: '把水一口氣倒進濃硫酸裡', why: '水倒進濃硫酸會瞬間產生大量的熱，酸會噴出來。' },
            { t: '把濃硫酸慢慢倒進水裡，一邊攪拌', ok: true, why: '「酸入水」，而且要慢慢倒。過程中溶液的溫度會<b>升高</b>。' },
            { t: '先把濃硫酸加熱，再加水', why: '加熱只會更危險。' },
            { t: '兩杯同時倒進第三個杯子', why: '還是會劇烈發熱，沒有比較安全。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  const tool = k => {
    const g = {
      drop: '<path d="M22 8 h10 v34 l-5 18 l-5 -18 Z" fill="var(--water)" stroke="currentColor"/><ellipse cx="27" cy="7" rx="8" ry="6" fill="#d64545" stroke="currentColor"/>',
      tube: '<path d="M20 6 V52 Q27 62 34 52 V6" fill="var(--water)" stroke="currentColor"/>',
      flask: '<path d="M22 6 h10 v16 l14 30 H8 l14 -30 Z" fill="var(--water)" stroke="currentColor"/>',
      beaker: '<path d="M6 10 V56 H48 V10" fill="var(--water)" stroke="currentColor"/><path d="M6 10 l-3 -3" stroke="currentColor"/>'
    }[k];
    return `<svg viewBox="0 0 54 64" width="46" height="54" style="vertical-align:middle">${g}</svg>`;
  };
  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '107 年會考第 1 題',
        pic: c => U.svg(c, '0 0 360 220', cyl(28.4, null).s + `<line x1="92" y1="${Y(30)}" x2="60" y2="${Y(30)}" stroke="var(--good)" stroke-width="2"/><text x="56" y="${Y(30) + 4}" text-anchor="end" class="t12b" style="fill:var(--good)">要到 30.0</text>`, '量筒中的溶液接近 30 mL', 'sim'),
        q: '小瑩想以量筒量取 30.0 mL 的溶液，如圖為量筒中目前已量取的溶液體積。小瑩使用下列哪一種器材裝取溶液後，再加入量筒內，最能避免體積超出 30.0 mL？',
        options: [{ t: tool('drop') + ' 滴管', ok: true, why: '滴管一次只加一滴，只差一點點時最不會超過。' }, { t: tool('tube') + ' 試管', why: '試管倒出來一次就是一大口。' }, { t: tool('flask') + ' 錐形瓶', why: '錐形瓶很難只倒一點點。' }, { t: tool('beaker') + ' 燒杯', why: '燒杯一倒就是一大口，容易超過。' }],
        steps: [{ q: '現在離 30.0 mL 還差多少？', options: [{ t: '只差一點點（不到 2 mL）', ok: true, why: '已經接近刻度了。' }, { t: '還差很多', why: '看圖，水面已經快到 30 了。' }] },
          { q: '只差一點點時，要用哪種器材才能「一點一點」加？', options: [{ t: '滴管', ok: true, why: '一滴一滴加。' }, { t: '燒杯', why: '燒杯一倒就是一大口。' }] }],
        explain: '<p>量取液體：先用燒杯倒到接近刻度，最後用<b>滴管</b>一滴一滴加到刻度，眼睛平視凹面最低點。</p>' },
      { stars: 2, src: '銜接題',
        pic: c => U.svg(c, '0 0 360 220', cyl(26, 80).s, '眼睛從上方往下看量筒', 'sim'),
        q: '小明像圖中這樣，眼睛<b>高於</b>液面去讀量筒的刻度，讀到 27.5 mL。關於這個讀數，下列何者正確？',
        options: [{ t: '讀數偏大，真正的體積比 27.5 mL 少', ok: true, why: '俯視讀數偏大。' }, { t: '讀數偏小，真正的體積比 27.5 mL 多', why: '那是仰視（眼睛太低）的情形。' }, { t: '讀數正確', why: '只有平視才正確。' }, { t: '要看量筒的大小才知道', why: '和量筒大小無關，看眼睛的位置。' }],
        steps: [{ q: '眼睛高於液面，叫做……', options: [{ t: '俯視', ok: true, why: '從上往下看。' }, { t: '仰視', why: '仰視是從下往上看。' }] },
          { q: '俯視時，視線碰到刻度的點會比真正的液面高還是低？', options: [{ t: '高，所以讀數偏大', ok: true, why: '看圖上的紅點。' }, { t: '低，所以讀數偏小', why: '看圖上的紅點，在液面上方。' }] }],
        explain: '<p>讀量筒要<b>平視凹面最低點</b>。俯視 → 讀數偏大；仰視 → 讀數偏小。</p>' },
      { stars: 2, src: '105 年會考第 53 題（選項圖改成文字）',
        q: '小萍要配製稀硫酸。步驟一的兩個燒杯內，一杯裝有密度 1.8 g/cm³、重量百分濃度 98% 的濃硫酸 100 mL，另一杯裝有蒸餾水，開始前兩杯溫度均為 25 °C。步驟一：手持其中一杯，倒入另一杯中；步驟二：以溫度計測量混合後的溫度。若要符合實驗安全與合理的實驗結果，步驟一<b>手持燒杯中裝的液體</b>以及步驟二<b>測量到的溫度</b>，下列何者合理？',
        options: [{ t: '手持濃硫酸；溫度低於 25 °C', why: '稀釋濃硫酸會放出大量的熱，溫度會上升。' }, { t: '手持濃硫酸；溫度高於 25 °C', ok: true, why: '「酸入水」：把濃硫酸倒入水中；稀釋放熱，溫度上升。' }, { t: '手持蒸餾水；溫度高於 25 °C', why: '把水倒進濃硫酸，會劇烈放熱噴濺，很危險。' }, { t: '手持蒸餾水；溫度低於 25 °C', why: '倒法危險，而且溫度是上升。' }],
        steps: [{ q: '稀釋濃硫酸時，要把什麼倒進什麼？', options: [{ t: '把濃硫酸慢慢倒進水裡', ok: true, why: '口訣：酸入水。' }, { t: '把水倒進濃硫酸裡', why: '水倒進濃硫酸會瞬間沸騰噴濺。' }] },
          { q: '濃硫酸稀釋時，會吸熱還是放熱？', options: [{ t: '放熱，溫度上升', ok: true, why: '所以要慢慢加、邊加邊攪拌。' }, { t: '吸熱，溫度下降', why: '濃硫酸稀釋會放出大量的熱。' }] }],
        explain: '<p>稀釋濃硫酸：<b>濃硫酸慢慢倒入水中</b>（酸入水），會<b>放熱</b>使溫度上升。反過來把水倒入濃硫酸，會劇烈沸騰噴濺。</p>' }
    ]);
  }

  document.addEventListener('DOMContentLoaded', () => {
    U.mount(document.getElementById('unit'), { unit: 'sci8a-1-1', home: 'index.html', steps: [
      { id: 'guess', label: '猜', title: '先猜猜看：實驗室裡該怎麼做？', render: guess },
      { id: 'play', label: '玩', title: '動手玩：量筒與安全', render: play },
      { id: 'know', label: '懂', title: '收成 4 句話', render: know },
      { id: 'exam', label: '考', title: '會考真的這樣考', render: exam },
      { id: 'real', label: '實戰', title: '會考實戰：照原題做做看', render: real }
    ] });
  });
})();
