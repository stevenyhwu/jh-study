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

  /* ---------------- 5 實戰 ---------------- */
  function setupPic(c) {
    U.svg(c, '0 0 320 170', `<rect x="110" y="60" width="100" height="70" fill="var(--water)" stroke="var(--stroke)" stroke-width="1.5"/><line x1="96" y1="132" x2="224" y2="132" stroke="var(--stroke)" stroke-width="2"/>
      <line x1="230" y1="10" x2="230" y2="150" stroke="var(--stroke)" stroke-width="3"/><line x1="230" y1="20" x2="168" y2="20" stroke="var(--stroke)" stroke-width="2"/>
      <rect x="164" y="20" width="8" height="108" rx="4" fill="var(--card)" stroke="var(--stroke)"/><circle cx="168" cy="126" r="5" fill="#e53935"/>
      <path d="M160 152 c-8 -10 -3 -18 0 -22 c4 6 9 12 0 22Z" fill="#f6a54b" stroke="#d64545"/><rect x="140" y="152" width="40" height="14" rx="5" fill="var(--line)" stroke="var(--stroke)"/>
      <text x="60" y="100" class="t12b">水</text><text x="180" y="40" class="t12b">溫度計</text><text x="250" y="150" class="t12">支架</text><text x="190" y="164" class="t12">酒精燈</text>
      <path d="M150 128 L120 116" stroke="var(--bad)" stroke-width="1.5"/><text x="70" y="120" class="t12b" style="fill:var(--bad)">碰到杯底</text>`, '溫度計碰到杯底的加熱裝置').style.maxWidth = '340px';
  }
  function skinPic(c) {
    const person = (x, air, skin, side) => `<text x="${x}" y="20" text-anchor="middle" class="t12b">氣溫</text><text x="${x}" y="36" text-anchor="middle" class="t12b">${air}°C</text>
      <circle cx="${x}" cy="54" r="10" fill="none" stroke="var(--stroke)" stroke-width="1.5"/><path d="M${x} 64 V104 M${x} 74 L${x - 22} 96 M${x} 74 L${x + 22} 96 M${x} 104 L${x - 14} 136 M${x} 104 L${x + 14} 136" stroke="var(--stroke)" stroke-width="1.5" fill="none"/>
      <text x="${side < 0 ? x - 26 : x + 26}" y="100" text-anchor="${side < 0 ? 'end' : 'start'}" class="t14b" style="fill:var(--bad)">${skin}°C</text>`;
    U.svg(c, '0 0 320 140', person(90, 27, 33, -1) + person(210, 17, 30, 1) + '<text x="150" y="138" text-anchor="middle" class="t12 mut">手部皮膚溫度</text>', '氣溫 27 度時手部皮膚 33 度，氣溫 17 度時 30 度').style.maxWidth = '320px';
    c.appendChild(h(`<table class="sim-table" style="max-width:260px"><thead><tr><th>品牌</th><th>開始熔化的溫度</th></tr></thead><tbody><tr><td>甲</td><td>27 °C</td></tr><tr><td>乙</td><td>31 °C</td></tr><tr><td>丙</td><td>35 °C</td></tr><tr><td>丁</td><td>39 °C</td></tr></tbody></table>`));
  }
  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '銜接題',
        q: '新聞說：「美國某地今天最高溫 104 °F。」換成攝氏大約是多少？（°F ＝ °C × 9 ÷ 5 ＋ 32）',
        options: [{ t: '約 20 °C', why: '20 °C ＝ 68 °F，太低了。' }, { t: '約 40 °C', ok: true, why: '(104 － 32) × 5 ÷ 9 ＝ 40 °C，非常熱。' }, { t: '約 72 °C', why: '72 是 104－32，還要再乘 5/9。' }, { t: '約 104 °C', why: '華氏和攝氏的數字不一樣，要換算。' }],
        steps: [{ q: '先把 32 扣掉：104 － 32 ＝ ?', options: [{ t: '72', ok: true, why: '對。' }, { t: '136', why: '是減 32，不是加。' }] },
          { num: true, q: '再乘 5 ÷ 9：72 × 5 ÷ 9 ＝ ?', post: '°C', answer: 40, hint: '72 ÷ 9 ＝ 8，8 × 5 ＝ ?', why: '40 °C。' }],
        explain: '<p>倒過來算：°C ＝ (°F － 32) × 5 ÷ 9 ＝ (104 － 32) × 5 ÷ 9 ＝ 40 °C。</p>' },
      { stars: 2, src: '112 年會考第 6 題', pic: setupPic,
        q: '阿東進行「水溫與加熱時間的關係」實驗，其裝置如圖所示。老師看到實驗裝置後，建議他改善測量水溫的方式，阿東進行下列哪一個改善方式最合適？',
        options: [{ t: '將溫度計懸吊在水中，不接觸杯底', ok: true, why: '杯底直接被火加熱，比水熱，碰到杯底就量不到真正的水溫。' }, { t: '調整支架使酒精燈的火焰靠近溫度計', why: '這樣量到的是火的溫度，溫度計還可能破。' },
          { t: '拿溫度計攪拌杯中的水，使水溫均勻', why: '溫度計很脆弱，不能拿來攪拌，要用玻璃棒。' }, { t: '將酒精燈的酒精裝滿，使火焰大小固定', why: '酒精裝太滿容易溢出起火，最多約 2/3，而且和量水溫無關。' }],
        steps: [{ q: '我們要量的是什麼的溫度？', options: [{ t: '水', ok: true, why: '實驗是「水溫」與加熱時間。' }, { t: '杯底', why: '要量的是水溫。' }] },
          { q: '圖中的溫度計碰到杯底。杯底的溫度和水溫一樣嗎？', options: [{ t: '不一樣，杯底直接被火燒，比較熱', ok: true, why: '所以要讓溫度計懸在水中。' }, { t: '一樣', why: '杯底直接接觸火焰，會比水熱。' }] }],
        explain: '<p>量水溫時，玻璃泡要<b>完全浸在水中、不碰杯底杯壁</b>，等液柱穩定再讀。</p>' },
      { stars: 3, src: '109 年會考第 19 題', pic: skinPic,
        q: '小樺在氣溫 27 °C 及 17 °C 時的手部皮膚溫度分別如圖所示。表是四種不同品牌零食開始熔化的溫度。正常體溫的情況下，若小樺希望「在 27 °C 及 17 °C 兩種氣溫下，零食拿在手上都<b>不會</b>熔化，但放入口中卻<b>都會</b>熔化」，則下列哪一品牌最符合他的期待？',
        options: [{ t: '甲', why: '27 °C 比手的 33 °C 低，拿在手上就熔化了。' }, { t: '乙', why: '31 °C 比 33 °C 低，氣溫 27 °C 時拿在手上會熔化。' }, { t: '丙', ok: true, why: '35 °C：比兩種情況的手（33、30 °C）都高，又比口中（約 37 °C）低。' }, { t: '丁', why: '39 °C 比口中的體溫（約 37 °C）還高，放進嘴巴也不會熔化。' }],
        steps: [{ q: '拿在手上「不會熔化」，熔化溫度要比手的溫度高還是低？手最熱是幾度？', options: [{ t: '要比手高；手最熱是 33 °C', ok: true, why: '所以熔化溫度要高於 33 °C。' }, { t: '要比手低；手最冷是 30 °C', why: '溫度沒到熔點才不會熔化，所以熔點要比手的溫度「高」。' }] },
          { q: '放入口中「會熔化」，熔化溫度要比口中溫度（體溫約 36～37 °C）……', options: [{ t: '低', ok: true, why: '溫度超過熔點才會熔化。' }, { t: '高', why: '要比口中低，放進去才會熔。' }] },
          { q: '所以熔化溫度要在幾度之間？', options: [{ t: '33 °C ～ 36 °C 之間', ok: true, why: '只有丙（35 °C）符合。' }, { t: '30 °C ～ 33 °C 之間', why: '氣溫 27 °C 時手是 33 °C，熔點要比 33 高。' }] }],
        explain: '<p>不在手上熔化 → 熔點 ＞ 手溫最高的 33 °C；在口中熔化 → 熔點 ＜ 體溫（36～37 °C）。所以 33 ＜ 熔點 ＜ 36，選<b>丙（35 °C）</b>。</p>' }
    ], '第 2、3 題是真正的會考題（圖是重畫的），第 1 題是暖身的銜接題。卡住就按「🪜 拆解」。');
  }

  U.run('5-1', ['先猜猜看：手量得準嗎？', '動手玩：手感與溫度計', '收成 4 句話', '常見題型'], { guess, play, know, exam, real });
})();
