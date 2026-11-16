/* ===== 理化 5-1 溫度與溫度計 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const toF = c => Math.round((c * 9 / 5 + 32) * 10) / 10;

  function thermoSim(host, on) {
    host.appendChild(h('<p class="sim-h">把溫度計放進水裡，改變水溫</p>'));
    const sv = U.svg(host, '0 0 360 220', '', '溫度計', 'sim');
    const read = h('<div class="sim-read"></div>');
    let T = 20; const seen = {};
    const Y = c => 190 - (c + 10) * 1.5;   // −10～110 °C
    function draw() {
      let s = `<rect x="40" y="120" width="110" height="80" fill="${T >= 60 ? '#f3a3a3' : T <= 5 ? '#cfe8ff' : 'var(--water)'}" opacity=".8"/><path d="M40 100 V200 H150 V100" fill="none" ${ST}/>
        <rect x="170" y="8" width="20" height="190" rx="10" fill="var(--card)" ${ST}/><circle cx="180" cy="200" r="13" fill="#e53935" ${ST}/>
        <rect x="176" y="${Y(T)}" width="8" height="${200 - Y(T)}" fill="#e53935"/>`;
      for (let c = -10; c <= 110; c += 10) {
        s += `<line x1="190" y1="${Y(c)}" x2="${c % 50 === 0 ? 204 : 198}" y2="${Y(c)}" stroke="var(--stroke)"/><line x1="170" y1="${Y(c)}" x2="${c % 50 === 0 ? 156 : 162}" y2="${Y(c)}" stroke="var(--stroke)"/>`;
        if (c % 20 === 0) s += `<text x="208" y="${Y(c) + 4}" class="t12">${c}</text><text x="152" y="${Y(c) + 4}" text-anchor="end" class="t12 mut">${toF(c)}</text>`;
      }
      s += `<text x="232" y="16" class="t12b">°C（攝氏）</text><text x="150" y="16" text-anchor="end" class="t12b mut">°F（華氏）</text>
        <line x1="190" y1="${Y(0)}" x2="250" y2="${Y(0)}" stroke="var(--accent)" stroke-dasharray="3 3"/><text x="254" y="${Y(0) + 4}" class="t12" style="fill:var(--accent)">冰水：0 °C ＝ 32 °F</text>
        <line x1="190" y1="${Y(100)}" x2="250" y2="${Y(100)}" stroke="var(--bad)" stroke-dasharray="3 3"/><text x="254" y="${Y(100) + 4}" class="t12" style="fill:var(--bad)">沸水：100 °C ＝ 212 °F</text>`;
      sv.innerHTML = s;
      read.innerHTML = `水溫 <b>${T} °C</b> ＝ ${T} × 9 ÷ 5 ＋ 32 ＝ <b>${toF(T)} °F</b>`;
    }
    U.slider(host, '水溫', { min: -10, max: 110, step: 5, value: T, fmt: v => v + ' °C' }, v => { T = v; seen['t' + v] = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { seen, T: () => T };
  }

  function handSim(host, on) {
    host.appendChild(h('<p class="sim-h">三盆水：熱水（40 °C）、溫水（25 °C）、冷水（10 °C）</p>'));
    const sv = U.svg(host, '0 0 360 150', '', '三盆水', 'sim');
    let step = 0; const seen = {};
    const bowl = (x, c, t) => `<path d="M${x - 45} 70 Q${x} 130 ${x + 45} 70 Z" fill="${c}" ${ST}/><text x="${x}" y="140" text-anchor="middle" class="t12b">${t}</text>`;
    function draw() {
      let s = bowl(60, '#f3a3a3', '熱水 40 °C') + bowl(180, 'var(--water)', '溫水 25 °C') + bowl(300, '#cfe8ff', '冷水 10 °C');
      if (step === 1) s += `<text x="60" y="64" text-anchor="middle" font-size="26">🤚</text><text x="300" y="64" text-anchor="middle" font-size="26">✋</text><text x="180" y="30" text-anchor="middle" class="t12b">泡 1 分鐘……</text>`;
      if (step === 2) s += `<text x="165" y="64" text-anchor="middle" font-size="26">🤚</text><text x="195" y="64" text-anchor="middle" font-size="26">✋</text>
        <text x="100" y="26" text-anchor="middle" class="t14b" style="fill:var(--accent)">左手：好冷！</text><text x="260" y="26" text-anchor="middle" class="t14b" style="fill:var(--bad)">右手：好熱！</text>`;
      sv.innerHTML = s;
    }
    const row = h('<div class="row"><button type="button" class="btn">① 左手泡熱水、右手泡冷水</button><button type="button" class="btn">② 兩手一起放進溫水</button></div>');
    row.children[0].addEventListener('click', () => { step = 1; draw(); });
    row.children[1].addEventListener('click', () => { if (step >= 1) { step = 2; seen.done = 1; draw(); on(); } });
    host.appendChild(row); draw();
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '左手先泡熱水、右手先泡冷水，再一起放進同一盆溫水。兩隻手的感覺會……',
        options: [{ t: '一樣，都是溫的' }, { t: '左手覺得冷、右手覺得熱', ok: true }],
        reveal: '<b>左手冷、右手熱</b>，明明是同一盆水！所以要量溫度，不能靠手。' },
      { q: '美國的天氣預報說今天 <b>86 度</b>。那邊的天氣是……',
        options: [{ t: '熱到不能出門，快燒起來了' }, { t: '大約 30 °C，夏天的熱', ok: true }],
        reveal: '<b>大約 30 °C</b>。美國用的是「華氏溫度」，數字和我們的攝氏不一樣。' }
    ]);
  }

  function play(p, api) {
    let A, B;
    const P = U.panes(p, 2);
    const tk = U.tasks(p, api, [
      { text: '試試手的感覺：先按 ①，再按 ②。', setup() { P.show(1); }, check: () => B.seen.done,
        qs: () => [{ q: '同一盆溫水，兩手感覺不一樣。這告訴我們什麼？', options: [{ t: '手的感覺不可靠，要用溫度計量', ok: true, why: '手感受的是「比原來冷還是熱」，不是真正的溫度。' }, { t: '溫水的溫度一邊高一邊低', why: '是同一盆水，溫度是一樣的。' }] }] },
      { text: '換到溫度計：把水溫從 0 °C 拉到 100 °C，看紅色液柱。', setup() { P.show(0); }, check: () => A.seen.t0 && A.seen.t100,
        qs: () => [{ q: '溫度升高，液柱為什麼會往上爬？', options: [{ t: '液體受熱會膨脹，體積變大', ok: true, why: '溫度計就是利用液體（酒精或水銀）<b>熱脹冷縮</b>的性質做成的。管子很細，一點點膨脹就看得出來。' }, { t: '熱氣把液體往上推', why: '玻璃管是密封的，是液體本身變大了。' }] }] },
      { text: '把水溫拉到 <b>20 °C</b>，看右邊兩種刻度。', check: () => A.T() === 20,
        qs: () => [{ num: true, q: '20 °C 等於多少 °F？', post: '°F', answer: 68, hint: '20 × 9 ÷ 5 ＋ 32。',
          diag: [{ v: 36, msg: '還要再加 32：20 × 9 ÷ 5 ＝ 36，36 ＋ 32 ＝ ?' }, { v: 52, msg: '要先乘 9/5 再加 32：20 × 9 ÷ 5 ＋ 32。' }], why: '36 ＋ 32 ＝ 68 °F。' }] }
    ]);
    A = thermoSim(P.list[0], () => tk.check()); B = handSim(P.list[1], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.card(p, '① 溫度＝冷熱的程度；手感不可靠', '<p>手只能感覺「比剛才熱還是冷」，所以要用<b>溫度計</b>來量。</p>');
    U.card(p, '② 溫度計：利用液體熱脹冷縮', '<p>常用<b>酒精</b>（染紅色）或<b>水銀</b>。使用時：玻璃泡要完全泡在水裡、<b>不碰杯底杯壁</b>、等液柱不動再讀、眼睛平視。</p>');
    thermoSim(U.card(p, '③ 攝氏和華氏', `<p><b>攝氏</b>：冰水 0 °C、沸水 100 °C，中間分 100 格。<br><b>華氏</b>：冰水 32 °F、沸水 212 °F，中間分 180 格。</p>
      <div class="formula">°F ＝ °C × 9 ÷ 5 ＋ 32</div>`), () => {});
    U.card(p, '④ 溫度不等於熱量', '<p>一杯 80 °C 的熱水和一浴缸 40 °C 的溫水，杯子的<b>溫度</b>比較高，但浴缸的水能放出的<b>熱量</b>多得多。下一節會講熱量。</p>');
    const c = h('<div class="card"><h3>✏️ 算一題看看</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '正常體溫 <b>37 °C</b>，等於多少 °F？', post: '°F', answer: 98.6, hint: '37 × 9 ÷ 5 ＝ 66.6，再加 32。',
      diag: [{ v: 66.6, msg: '還要加 32。' }], why: '66.6 ＋ 32 ＝ 98.6 °F。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這一節會考比較少單獨出題，下面是常見的基本題。答錯可以再選。',
      benchLabel: '想試試看？打開溫度計',
      bench: host => thermoSim(host, () => {}),
      qs: [
        { src: '基本題', q: '溫度計裡的紅色液柱會隨溫度上升，主要是利用什麼原理？', hint: '液體受熱會怎樣？',
          options: [{ t: '液體受熱膨脹、遇冷收縮', ok: true, why: '熱脹冷縮。' }, { t: '液體受熱會變色', why: '紅色是染的，不會因為溫度改變。' }, { t: '玻璃受熱會變短', why: '玻璃也會膨脹，但膨脹得比液體少很多。' }] },
        { src: '基本題', q: '下列哪一個溫度最高？', hint: '先把華氏換成攝氏，或把攝氏換成華氏再比。',
          options: [{ t: '100 °F', why: '100 °F 只有大約 38 °C。' }, { t: '50 °C', ok: true, why: '50 °C ＝ 122 °F，比 100 °F 高。' }, { t: '32 °F', why: '32 °F 就是 0 °C。' }, { t: '45 °C', why: '45 °C 比 50 °C 低。' }] },
        { src: '基本題', q: '用溫度計量燒杯中熱水的溫度，哪一個做法正確？', hint: '想想 1-1 的會考題。',
          options: [{ t: '玻璃泡浸在水中，不碰杯底，等液柱停止再讀', ok: true, why: '杯底比水熱，碰到就量不準；液柱還在動時也讀不準。' }, { t: '一放進去馬上讀', why: '液柱還在上升，要等它停下來。' }, { t: '讓玻璃泡碰著杯底比較穩', why: '杯底直接被加熱，比水溫高。' }, { t: '拿出水面再讀', why: '一拿出來溫度就開始下降了。' }] }
      ]
    });
  }

  U.run('5-1', ['先猜猜看：手量得準嗎？', '動手玩：手感與溫度計', '收成 4 句話', '常見題型'], { guess, play, know, exam });
})();
