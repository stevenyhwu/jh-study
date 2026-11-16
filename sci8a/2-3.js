/* ===== 理化 2-3 混合物的分離 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const SAND = '#a8743a', SALT = '#ffffff';
  const grains = (x, y, n, cols, color) => { let s = ''; for (let i = 0; i < n; i++) s += `<rect x="${x + (i % cols) * 8}" y="${y - Math.floor(i / cols) * 8}" width="6.5" height="6.5" rx="1.5" fill="${typeof color === 'function' ? color(i) : color}" stroke="var(--stroke)" stroke-width=".7"/>`; return s; };

  /* ---------- 分開鹽和沙 ---------- */
  function sepSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">一堆混在一起的鹽（白）和沙（咖啡色）</p>'));
    const sv = U.svg(host, '0 0 360 200', '', '分離鹽和沙', 'sim');
    const note = h('<div class="sim-note"></div>');
    let st = 'mix';
    function draw() {
      let s = `<text x="62" y="16" text-anchor="middle" class="t12b">燒杯</text><text x="180" y="16" text-anchor="middle" class="t12b">漏斗＋濾紙</text><text x="298" y="16" text-anchor="middle" class="t12b">蒸發皿</text>`;
      // 燒杯
      if (st === 'wet') s += `<rect x="20" y="70" width="84" height="80" fill="var(--water)"/>` + grains(26, 141, 9, 9, SAND) + '<text x="62" y="170" text-anchor="middle" class="t12">鹽溶掉了，沙沉在底下</text>';
      if (st === 'mix') s += grains(26, 141, 18, 9, i => i % 2 ? SAND : SALT) + '<text x="62" y="170" text-anchor="middle" class="t12">鹽和沙混在一起</text>';
      s += `<path d="M20 30 V150 H104 V30" fill="none" ${ST}/>`;
      // 漏斗
      const f = st === 'filtered' || st === 'done';
      s += `<path d="M140 30 L220 30 L186 86 V104 H174 V86 Z" fill="var(--card)" ${ST}/><path d="M146 34 L214 34 L180 84Z" fill="var(--bg)" stroke="var(--muted)" stroke-dasharray="3 3"/>`;
      if (f) s += grains(160, 62, 9, 5, SAND) + '<text x="232" y="56" class="t12">← 沙</text>';
      if (st === 'filtered') s += `<rect x="150" y="130" width="60" height="30" fill="var(--water)"/><text x="180" y="186" text-anchor="middle" class="t12">濾液：鹽水（透明）</text>`;
      s += `<path d="M150 110 V160 H210 V110" fill="none" ${ST}/>`;
      // 蒸發皿
      s += `<path d="M258 120 Q298 160 338 120" fill="var(--card)" ${ST}/>`;
      if (st === 'done') s += grains(274, 126, 6, 6, SALT) + '<text x="298" y="170" text-anchor="middle" class="t12">水蒸乾，鹽跑出來了</text><text x="180" y="186" text-anchor="middle" class="t12 mut">（濾液已倒去加熱）</text>';
      sv.innerHTML = s;
    }
    const acts = {
      water() { if (st === 'mix') { st = 'wet'; say('加水攪一攪：鹽溶進水裡看不見了，沙不會溶。'); } else say('已經加過水了。'); },
      filter() {
        if (st === 'mix') say('乾的鹽和沙都是一顆一顆的，<b>全部卡在濾紙上</b>，還是分不開。要先讓其中一種「不見」。');
        else if (st === 'wet') { st = 'filtered'; say('過濾：沙被濾紙擋住，鹽水穿過濾紙流下去。'); }
        else say('已經過濾好了。');
      },
      heat() {
        if (st === 'mix') say('現在沒有水，加熱也沒有用。');
        else if (st === 'wet') { st = 'mix'; say('直接加熱：水蒸乾了，鹽又跑出來，<b>跟沙混在一起</b>，回到原點。少了哪一步？'); }
        else if (st === 'filtered') { st = 'done'; say('把濾液加熱：水蒸發掉，白色的鹽留在蒸發皿裡。<b>分開成功！</b>'); }
      },
      reset() { st = 'mix'; say(''); }
    };
    function say(t) { note.innerHTML = t; }
    const row = h('<div class="row"><button type="button" class="btn" data-a="water">💧 加水攪拌</button><button type="button" class="btn" data-a="filter">🧻 過濾</button><button type="button" class="btn" data-a="heat">🔥 加熱蒸發</button><button type="button" class="btn" data-a="reset">重來</button></div>');
    row.addEventListener('click', e => { const a = e.target.dataset && e.target.dataset.a; if (!a) return; acts[a](); draw(); onChange(); });
    host.append(row, note); draw();
    return { ok: () => st === 'done' };
  }

  /* ---------- 濾紙層析 ---------- */
  const PIG = { y: { c: '#f2c230', rf: .85, n: '黃' }, r: { c: '#e0457b', rf: .55, n: '紅' }, b: { c: '#3b6fd9', rf: .3, n: '藍' } };
  const PEN = { k: { n: '黑色筆', c: '#222', p: ['b', 'r', 'y'] }, g: { n: '綠色筆', c: '#2e9e4f', p: ['b', 'y'] }, v: { n: '紫色筆', c: '#7b4bc4', p: ['b', 'r'] } };
  function strip(x, pen, pos, prog) {  // prog 0～1；pos 'up' 筆點在水面上，'down' 泡在水裡
    const y0 = pos === 'up' ? 168 : 190, front = 180 - prog * 150;
    let s = `<rect x="${x}" y="20" width="50" height="180" fill="#fafafa" ${ST}/>`;
    if (prog > 0) s += `<rect x="${x}" y="${front}" width="50" height="${180 - front}" fill="var(--water)" opacity=".45"/>`;
    if (pos === 'up') {
      if (prog === 0) s += `<ellipse cx="${x + 25}" cy="${y0}" rx="9" ry="4" fill="${PEN[pen].c}"/>`;
      else PEN[pen].p.forEach(k => { const y = y0 - PIG[k].rf * prog * 138; s += `<ellipse cx="${x + 25}" cy="${y}" rx="${9 + prog * 6}" ry="${4 + prog * 3}" fill="${PIG[k].c}" opacity=".9"/>`; });
    } else s += `<ellipse cx="${x + 25}" cy="${y0}" rx="${9 + prog * 14}" ry="${4 + prog * 5}" fill="${PEN[pen].c}" opacity="${1 - prog * .85}"/>`;
    return s;
  }
  function chromSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">濾紙層析：把筆點在濾紙上，下端泡進水裡</p>'));
    const sv = U.svg(host, '0 0 360 220', '', '濾紙層析', 'sim');
    const note = h('<div class="sim-note"></div>');
    let pen = 'k', pos = 'up', prog = 0, running = false; const runs = {};
    function draw() {
      const tint = pos === 'down' && prog > 0 ? `<rect x="110" y="180" width="140" height="26" fill="${PEN[pen].c}" opacity="${prog * .35}"/>` : '';
      sv.innerHTML = strip(155, pen, pos, prog) + `<rect x="110" y="180" width="140" height="26" fill="var(--water)" opacity=".7"/>${tint}<path d="M110 150 V206 H250 V150" fill="none" ${ST}/>
        <line x1="110" y1="180" x2="250" y2="180" stroke="var(--water-line)" stroke-width="2"/><text x="256" y="184" class="t12">水面</text>`;
    }
    const reset = () => { if (running) return; prog = 0; note.innerHTML = ''; draw(); };
    U.chips(host, '哪一枝筆', Object.keys(PEN).map(v => ({ v, t: PEN[v].n })), pen, v => { if (!running) { pen = v; reset(); } });
    U.chips(host, '筆點的位置', [{ v: 'up', t: '在水面上方' }, { v: 'down', t: '泡在水裡' }], pos, v => { if (!running) { pos = v; reset(); } });
    const row = h('<div class="row"><button type="button" class="btn primary">▶ 開始（水往上爬）</button></div>');
    row.firstChild.addEventListener('click', () => {
      if (running) return; running = true; prog = 0; const t0 = performance.now();
      const timer = setInterval(() => {
        prog = Math.min(1, (performance.now() - t0) / 2600); draw();
        if (prog < 1 && sv.isConnected) return;
        clearInterval(timer);
        running = false; runs[pen + pos] = 1;
        note.innerHTML = pos === 'up' ? `${PEN[pen].n}分出了：${PEN[pen].p.map(k => PIG[k].n).reverse().join('、')}（由上到下）。` : '筆點泡在水裡，墨水直接<b>溶進水裡</b>散掉了，濾紙上什麼都沒分出來。';
        onChange();
      }, 40);
    });
    host.append(row, note); draw();
    return { ran: k => !!runs[k] };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => U.svg(c, '0 0 320 70', grains(88, 50, 36, 18, i => (i * 7) % 3 ? SAND : SALT), '混在一起的鹽和沙'),
        q: '鹽和沙混在一起了。用什麼方法分開最聰明？',
        options: [{ t: '用鑷子一顆一顆挑' }, { t: '加水 → 過濾 → 把水蒸乾', ok: true }, { t: '用磁鐵吸' }],
        reveal: '<b>加水 → 過濾 → 蒸乾</b>。因為鹽會溶在水裡，沙不會。三個步驟的順序可以亂換嗎？下一步試試看。' },
      { pic: c => U.svg(c, '0 0 320 60', '<path d="M60 30 H240" stroke="#222" stroke-width="7" stroke-linecap="round"/><text x="254" y="35" class="t12b">黑色水性筆</text>', '一條黑色的線'),
        q: '黑色水性筆的墨水，裡面只有「黑色」一種顏色嗎？',
        options: [{ t: '是，黑色就是黑色' }, { t: '不是，是好幾種顏色混出來的', ok: true }],
        reveal: '<b>是好幾種顏色混出來的</b>。只要一張濾紙和一點水，就能把它們拆開。' }
    ]);
  }

  function play(p, api) {
    let A, B;
    const tk = U.tasks(p, api, [
      { text: '把鹽和沙分開：三個按鈕，試出正確的順序，讓<b>沙留在濾紙、鹽留在蒸發皿</b>。',
        setup() { a.hidden = false; b.hidden = true; },
        check: () => A.ok(),
        qs: () => [{ q: '過濾的時候，為什麼沙會被擋住，鹽卻可以穿過濾紙？',
            options: [{ t: '沙不溶於水，顆粒太大過不去；鹽溶在水裡，跟著水穿過去', ok: true, why: '過濾分開的是「<b>溶的</b>」和「<b>不溶的</b>」。' }, { t: '因為沙比較重', why: '重不重不是重點。先不加水直接過濾試試看，鹽過得去嗎？' }, { t: '因為濾紙會吸住沙', why: '濾紙只是有很小的洞，大顆粒過不去。' }] },
          { q: '鹽水是透明的，看不到鹽。要怎麼把鹽拿回來？',
            options: [{ t: '加熱，把水蒸發掉', ok: true, why: '水變成水蒸氣跑掉，鹽留下來變成晶體，這叫<b>結晶</b>。' }, { t: '再過濾一次', why: '鹽已經溶在水裡，會跟著水一起穿過濾紙。' }] }] },
      { text: '層析：選<b>黑色筆</b>、筆點<b>在水面上方</b>，按「開始」。',
        setup() { b.hidden = false; a.hidden = true; },
        check: () => B.ran('kup'),
        qs: () => [{ q: '黑色墨水被分成幾種顏色？',
            options: [{ t: '3 種', ok: true, why: '藍、紅、黃。每種顏色的色素跟著水往上爬的<b>速度不一樣</b>，所以被拉開了。所以黑色墨水是<b>混合物</b>。' }, { t: '1 種', why: '看濾紙上，由下到上有幾團不同的顏色？' }, { t: '2 種', why: '再數一次：最上面、中間、下面。' }] }] },
      { text: '現在把筆點改成<b>泡在水裡</b>，再按一次「開始」。',
        check: () => B.ran('kdown') || B.ran('gdown') || B.ran('vdown'),
        qs: () => [{ q: '做層析時，為什麼筆點一定要<b>高於水面</b>？',
            options: [{ t: '不然墨水會直接溶進水裡散掉，沒辦法跟著水往上爬', ok: true, why: '要讓水「經過」筆點，帶著色素一起往上爬，才分得開。' }, { t: '這樣比較好看', why: '看剛剛的結果：筆點泡在水裡時，濾紙上有分出顏色嗎？' }, { t: '因為水會把濾紙弄破', why: '濾紙下端本來就要泡在水裡。' }] }] }
    ]);
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const a = h('<div></div>'), b = h('<div hidden></div>');
    card.append(a, b, tk.slot);
    A = sepSim(a, () => tk.check());
    B = chromSim(b, () => tk.check());
    tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.svg(U.card(p, '① 分開混合物，靠的是「性質不一樣」',
      '<p>混合物裡的東西各自保有原來的性質。<br>找到一個<b>不一樣的地方</b>（會不會溶、沸點高低、跑得快慢），就能用物理方法把它們分開。</p>'),
      '0 0 320 90', grains(40, 40, 8, 4, SALT) + grains(200, 40, 8, 4, SAND) + '<text x="56" y="66" text-anchor="middle" class="t12b">鹽：會溶於水</text><text x="216" y="66" text-anchor="middle" class="t12b">沙：不溶於水</text>', '鹽會溶，沙不會溶');
    U.svg(U.card(p, '② 過濾：把「不溶的」擋下來',
      '<p>不溶的固體留在<b>濾紙</b>上；溶在水裡的跟著水流下去，流下來的液體叫<b>濾液</b>。</p>'),
      '0 0 320 140', `<path d="M110 14 L210 14 L168 78 V100 H152 V78 Z" fill="var(--card)" ${ST}/>` + grains(140, 44, 10, 5, SAND) + `<rect x="130" y="112" width="60" height="20" fill="var(--water)"/><path d="M130 100 V132 H190 V100" fill="none" ${ST}/>
        <text x="222" y="40" class="t12b">濾紙上：沙</text><text x="200" y="126" class="t12b">濾液：鹽水</text>`, '過濾');
    U.svg(U.card(p, '③ 結晶：把「溶掉的」拿回來',
      '<p>把水<b>蒸發</b>掉，或讓熱的濃溶液<b>降溫</b>，溶質就會變回固體跑出來。</p><p class="small muted">曬鹽場就是用太陽把海水蒸乾。</p>'),
      '0 0 320 100', `<path d="M100 40 Q160 96 220 40" fill="var(--card)" ${ST}/>` + grains(132, 58, 7, 7, SALT) + '<path d="M130 26 q-6 -8 0 -16 M160 26 q-6 -8 0 -16 M190 26 q-6 -8 0 -16" fill="none" stroke="var(--muted)" stroke-width="2"/><text x="160" y="92" text-anchor="middle" class="t12b">水蒸發，鹽留下</text>', '蒸發皿裡的鹽');
    U.svg(U.card(p, '④ 層析：跑得快慢不同，就被拉開',
      '<p>水沿著濾紙往上爬，帶著色素一起走。每種色素<b>爬的速度不同</b>，就分成一段一段。<br>記得：筆點要在<b>水面上方</b>。</p>'),
      '100 0 160 220', strip(155, 'k', 'up', 1) + `<rect x="110" y="180" width="140" height="26" fill="var(--water)" opacity=".7"/><path d="M110 150 V206 H250 V150" fill="none" ${ST}/>`, '黑色墨水分成黃、紅、藍').style.maxWidth = '200px';
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.svg(c, '0 0 320 90', `<rect x="120" y="20" width="80" height="50" fill="var(--water)"/><path d="M120 10 V70 H200 V10" fill="none" ${ST}/><text x="160" y="50" text-anchor="middle" class="t12b">糖水</text><text x="160" y="86" text-anchor="middle" class="t12 mut">透明，看不到糖</text>`, '一杯透明的糖水');
    U.choice(c, { q: '一杯糖水，想把裡面的<b>糖</b>拿回來。要用哪一種方法？', hint: '糖已經溶在水裡了。它會被濾紙擋住嗎？',
      options: [{ t: '加熱，把水蒸發掉（結晶）', ok: true, why: '糖溶在水裡，要把水趕走，糖才會留下來。' }, { t: '過濾', why: '溶掉的糖會跟著水穿過濾紙，濾紙上什麼都沒有。' }, { t: '濾紙層析', why: '層析是用來分開不同的色素。' }],
      onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '第 1、2 題是基本題，第 3 題是從真正的會考題改寫的。答錯可以再選，不用怕。',
      benchLabel: '想試試看？打開鹽和沙的分離實驗',
      bench: host => sepSim(host, () => {}),
      qs: [
        { src: '基本題',
          q: '下列哪一組混合物，可以用「<b>加水 → 過濾</b>」分開？',
          hint: '過濾能分開的，是一個「會溶」、一個「不會溶」。',
          options: [{ t: '糖 和 食鹽', why: '兩個都會溶在水裡，都會穿過濾紙。' }, { t: '沙 和 粉筆灰', why: '兩個都不溶，都會被濾紙擋住。' },
            { t: '糖 和 粉筆灰', ok: true, why: '糖會溶、粉筆灰不會溶。粉筆灰留在濾紙上，糖水流下去。' }, { t: '酒精 和 水', why: '兩個都是液體，而且互相溶在一起，濾紙擋不住。' }] },
        { src: '基本題',
          pic: c => U.svg(c, '40 0 280 220', `<rect x="80" y="20" width="50" height="180" fill="#fafafa" ${ST}/><ellipse cx="105" cy="62" rx="14" ry="7" fill="${PIG.y.c}"/><ellipse cx="105" cy="132" rx="14" ry="7" fill="${PIG.b.c}"/><text x="105" y="216" text-anchor="middle" class="t14b">甲筆</text>
            <rect x="210" y="20" width="50" height="180" fill="#fafafa" ${ST}/><ellipse cx="235" cy="132" rx="14" ry="7" fill="${PIG.b.c}"/><text x="235" y="216" text-anchor="middle" class="t14b">乙筆</text>
            <text x="140" y="66" class="t12b">黃</text><text x="140" y="136" class="t12b">藍</text><text x="270" y="136" class="t12b">藍</text>`, '甲筆分出黃和藍，乙筆只有藍').style.maxWidth = '300px',
          q: '用濾紙層析檢查甲、乙兩枝筆的墨水，結果如圖（水由下往上爬）。哪一個說法正確？',
          hint: '分出幾段，就至少有幾種色素。越上面的，表示爬得越快。',
          options: [{ t: '甲筆的墨水至少含有兩種色素，是混合物', ok: true, why: '甲分出黃、藍兩段，所以是兩種以上的色素混在一起。' }, { t: '乙筆的墨水含有黃色色素', why: '乙的濾紙上只有藍色。' },
            { t: '藍色色素爬得比黃色快', why: '黃色在比較上面，表示黃色爬得比較快。' }, { t: '兩枝筆的墨水成分完全相同', why: '甲有黃色，乙沒有。' }] },
        { src: '挑戰題・改寫自 112 年會考',
          pic: c => c.appendChild(h(`<table class="sim-table" style="max-width:360px"><thead><tr><th></th><th>甲</th><th>乙</th><th>丙</th></tr></thead>
            <tbody><tr><td>放進水裡</td><td>會溶</td><td>不溶</td><td>不溶</td></tr><tr><td>沸點</td><td>1465 °C</td><td>238 °C</td><td>340 °C</td></tr></tbody></table>`)),
          q: '甲、乙、丙是三種固體純物質，性質如表。有一包混合物同時含有甲、乙、丙。<br>步驟一：<b>加水後過濾</b>。步驟二：把留在濾紙上的固體<b>加熱</b>。哪一個推論合理？',
          hint: '步驟一：誰會溶、跟著水流下去？誰留在濾紙上？步驟二：留下來的兩種，誰的沸點比較低、會先變成氣體跑掉？',
          options: [
            { t: '步驟一之後，留在濾紙上的只有乙', why: '乙和丙都不溶於水，兩個都會留在濾紙上。' },
            { t: '步驟一的濾液裡有甲，把水蒸乾就能得到甲', ok: true, why: '只有甲會溶，所以甲跟著水穿過濾紙。乙和丙留在濾紙上，再利用沸點不同（加熱到 238～340 °C 之間，乙先跑掉）分開。' },
            { t: '步驟二加熱時，丙會比乙先變成氣體', why: '乙的沸點 238 °C 比丙的 340 °C 低，乙會先變成氣體。' },
            { t: '只做步驟一，就能把甲、乙、丙三種完全分開', why: '過濾只能分成「溶的」和「不溶的」兩堆。乙和丙還混在一起。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  function flowPic(c) {
    const box = (x, y, t) => `<rect x="${x}" y="${y}" width="74" height="30" rx="6" fill="var(--card)" stroke="var(--stroke)"/><text x="${x + 37}" y="${y + 20}" text-anchor="middle" class="t14b">${t}</text>`;
    U.svg(c, '0 0 340 150', box(10, 60, '◆▲○') + box(150, 20, '◆▲') + box(150, 100, '○') + box(266, 4, '◆') + box(266, 52, '▲') +
      `<path d="M84 72 L148 38 M84 78 L148 112" stroke="var(--stroke)" stroke-width="1.5"/><text x="104" y="98" class="t12b">步驟一</text>
       <path d="M224 30 L264 20 M224 40 L264 66" stroke="var(--stroke)" stroke-width="1.5"/><text x="226" y="88" class="t12b">步驟二</text><text x="10" y="140" class="t12 mut">◆▲○ 代表甲、乙、丙（未依順序）</text>`, '分離甲乙丙的兩個步驟流程圖').style.maxWidth = '360px';
    c.appendChild(h('<table class="sim-table" style="max-width:360px"><thead><tr><th></th><th>甲</th><th>乙</th><th>丙</th></tr></thead><tbody><tr><td>對水的溶解情形</td><td>可溶</td><td>可溶</td><td>難溶</td></tr><tr><td>沸點</td><td>1465 °C</td><td>238 °C</td><td>340 °C</td></tr></tbody></table>'));
  }
  function real(p, api) {
    U.real(p, api, [
      { stars: 2, src: '模擬題（會考常見題型）',
        q: '一包混合物裡有食鹽、細沙和鐵粉。下列哪一個步驟順序，最能把三種物質分開？',
        options: [{ t: '用磁鐵吸出鐵粉 → 加水攪拌後過濾 → 把濾液加熱蒸乾', ok: true, why: '鐵粉會被磁鐵吸；沙不溶留在濾紙；鹽溶在水裡，蒸乾得到。' }, { t: '加水攪拌後過濾 → 把濾液加熱蒸乾 → 用磁鐵從蒸乾的鹽裡吸出鐵粉', why: '鐵粉不溶於水，過濾時就和沙一起留在濾紙上了，濾液裡沒有鐵粉，蒸乾後也吸不到。' },
          { t: '直接加熱 → 過濾', why: '加熱乾的混合物不會讓它們分開。' }, { t: '直接過濾 → 用磁鐵', why: '沒加水，鹽和沙都會卡在濾紙上。' }],
        steps: [{ q: '哪一個物質會被磁鐵吸起來？', options: [{ t: '鐵粉', ok: true, why: '鐵會被磁鐵吸引。' }, { t: '食鹽', why: '食鹽不會被磁鐵吸。' }] },
          { q: '鹽和沙要怎麼分開？', options: [{ t: '加水溶解鹽 → 過濾留下沙 → 蒸乾濾液得到鹽', ok: true, why: '利用「溶不溶於水」不同。' }, { t: '直接過濾', why: '要先加水讓鹽溶掉。' }] }],
        explain: '<p>分離混合物要找<b>性質的差異</b>：鐵會被磁鐵吸 → 磁鐵；鹽溶於水、沙不溶 → 加水過濾；鹽溶在濾液 → 蒸發結晶。</p>' },
      { stars: 2, src: '模擬題（會考常見題型）',
        pic: c => U.svg(c, '40 0 280 220', `<rect x="80" y="20" width="50" height="180" fill="#fafafa" stroke="var(--stroke)"/><ellipse cx="105" cy="62" rx="14" ry="7" fill="${PIG.y.c}"/><ellipse cx="105" cy="100" rx="14" ry="7" fill="${PIG.r.c}"/><ellipse cx="105" cy="140" rx="14" ry="7" fill="${PIG.b.c}"/><text x="105" y="216" text-anchor="middle" class="t14b">待測墨水</text>
          <rect x="210" y="20" width="50" height="180" fill="#fafafa" stroke="var(--stroke)"/><ellipse cx="235" cy="62" rx="14" ry="7" fill="${PIG.y.c}"/><ellipse cx="235" cy="140" rx="14" ry="7" fill="${PIG.b.c}"/><text x="235" y="216" text-anchor="middle" class="t14b">A 牌墨水</text>`, '待測墨水分出黃紅藍，A 牌分出黃藍').style.maxWidth = '300px',
        q: '用濾紙層析比較兩種墨水，結果如圖（水由下往上爬）。下列推論何者最合理？',
        options: [{ t: '待測墨水含有 A 牌墨水沒有的紅色色素', ok: true, why: '待測墨水多了一段紅色。' }, { t: '兩種墨水的成分完全相同', why: '待測墨水多了紅色。' }, { t: 'A 牌墨水是純物質', why: 'A 牌分出兩種色素，是混合物。' }, { t: '藍色色素在濾紙上爬得最快', why: '藍色在最下面，爬得最慢。' }],
        steps: [{ q: '濾紙上分出幾段，代表什麼？', options: [{ t: '至少有幾種色素', ok: true, why: '每一段是一種色素。' }, { t: '墨水有幾滴', why: '和滴幾滴無關。' }] },
          { q: '待測墨水和 A 牌比，多了哪一段？', options: [{ t: '紅色', ok: true, why: '中間那段紅色只有待測墨水有。' }, { t: '黃色', why: '兩邊都有黃色。' }] }],
        explain: '<p>層析分出幾段＝至少幾種色素；位置越高＝爬得越快。待測墨水有黃、紅、藍，A 牌只有黃、藍 → 待測墨水<b>多了紅色色素</b>。兩者都是混合物。</p>' },
      { stars: 3, src: '112 年會考第 41 題（流程圖依原題重畫）', pic: flowPic,
        q: '有甲、乙、丙三種固體純物質，三者對水的溶解情形及沸點如表所示。有一份參雜甲、乙、丙的混合物，可經由兩步驟（加熱、加水過濾）而分離出甲、乙、丙，如圖所示。依據上述資訊，下列推論何者最合理？',
        options: [{ t: '◆可能是甲，步驟一是加水過濾', ok: true, why: '步驟一先加水過濾，難溶的丙（○）被分出來；甲、乙在濾液中，再加熱讓沸點低的乙先跑掉，留下甲。◆、▲可能是甲或乙。' },
          { t: '◆可能是丙，步驟一是加水過濾', why: '丙難溶於水，加水過濾第一步就被分出來，是 ○。' },
          { t: '○可能是甲，步驟二需加熱至 300 °C，才可使乙、丙分離', why: '步驟一分出來的單獨一個（○）應該是難溶的丙，不是甲。' },
          { t: '○可能是丙，步驟二需加熱至 1500 °C，才可使甲、乙分離', why: '○ 是丙沒錯，但只要加熱超過乙的沸點 238 °C 讓乙跑掉就好，不需要 1500 °C。' }],
        steps: [{ q: '甲、乙、丙中，哪一個「難溶於水」？', options: [{ t: '丙', ok: true, why: '加水過濾時，丙會留在濾紙上被分出來。' }, { t: '甲', why: '看表：甲可溶。' }] },
          { q: '步驟一分出了單獨的 ○ 和一堆 ◆▲。步驟一應該是？○ 是誰？', options: [{ t: '加水過濾；○ 是丙', ok: true, why: '先把難溶的丙濾出來。' }, { t: '加熱；○ 是乙', why: '三種中只有丙「難溶於水」，所以能被「加水過濾」單獨分出來的是丙。' }] },
          { q: '步驟二要把甲和乙分開，加熱時誰會先變成氣體？', options: [{ t: '乙（沸點 238 °C 比較低）', ok: true, why: '留下甲，所以 ◆、▲ 可能是甲或乙。' }, { t: '甲', why: '甲的沸點 1465 °C 很高。' }] }],
        explain: '<p>步驟一<b>加水過濾</b>：難溶的丙（○）留在濾紙上；甲、乙溶在濾液中（◆▲）。步驟二<b>加熱</b>：乙（238 °C）先汽化離開，留下甲。所以 ◆ 可能是甲。</p>' }
    ], '第 3 題是真正的會考題；這一節會考題比較少，第 1、2 題是照會考題型出的模擬題。卡住就按「🪜 拆解」。');
  }

  document.addEventListener('DOMContentLoaded', () => {
    U.mount(document.getElementById('unit'), { unit: 'sci8a-2-3', home: 'index.html', steps: [
      { id: 'guess', label: '猜', title: '先猜猜看：混在一起怎麼辦？', render: guess },
      { id: 'play', label: '玩', title: '動手玩：分離與層析', render: play },
      { id: 'know', label: '懂', title: '收成 4 句話', render: know },
      { id: 'exam', label: '考', title: '這一節這樣考', render: exam },
      { id: 'real', label: '實戰', title: '會考實戰：照原題做做看', render: real }
    ] });
  });
})();
