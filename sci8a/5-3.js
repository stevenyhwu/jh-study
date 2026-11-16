/* ===== 理化 5-3 熱對物質的影響 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  // 加熱時間（分）→ 溫度：冰升溫 0～1、熔化 1～4、水升溫 4～8、沸騰 8～12
  const tempAt = t => t <= 1 ? -20 + 20 * t : t <= 4 ? 0 : t <= 8 ? (t - 4) * 25 : 100;
  const stateAt = t => t < 1 ? '冰（固態）' : t < 4 ? '冰和水一起（正在熔化）' : t < 8 ? '水（液態）' : '水在沸騰（液態變成氣態）';

  function curveGraph(t) {
    const X = m => 40 + m * 25, Y = T => 170 - (T + 20) * 1.25;
    let s = `<line x1="40" y1="10" x2="40" y2="170" class="g-axis"/><line x1="40" y1="${Y(0)}" x2="345" y2="${Y(0)}" stroke="var(--line)"/><line x1="40" y1="170" x2="345" y2="170" class="g-axis"/>`;
    [-20, 0, 50, 100].forEach(T => { s += `<text x="34" y="${Y(T) + 4}" text-anchor="end" class="g-num">${T}</text>`; });
    let d = ''; for (let m = 0; m <= 12; m += 0.25) d += (d ? 'L' : 'M') + X(m) + ' ' + Y(tempAt(m));
    s += `<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="3"/><text x="${X(2.5)}" y="${Y(0) - 8}" text-anchor="middle" class="t12b">熔化</text><text x="${X(10)}" y="${Y(100) - 8}" text-anchor="middle" class="t12b">沸騰</text>
      <text x="345" y="186" text-anchor="end" class="g-lab">加熱時間（分）</text><text x="44" y="10" class="g-lab">溫度（°C）</text>`;
    if (t != null) s += `<circle cx="${X(t)}" cy="${Y(tempAt(t))}" r="6" fill="var(--bad)" ${ST}/>`;
    return s;
  }

  function iceSim(host, on) {
    host.appendChild(h('<p class="sim-h">一杯 −20 °C 的冰塊，用小火一直加熱</p>'));
    const sv = U.svg(host, '0 0 360 190', '', '冰的加熱曲線', 'sim');
    const read = h('<div class="sim-read"></div>');
    let t = 0; const seen = {};
    function draw() { sv.innerHTML = curveGraph(t); read.innerHTML = `加熱 ${t} 分鐘　溫度 <b>${tempAt(t)} °C</b>　狀態：<b>${stateAt(t)}</b>　（爐火一直開著，一直在吸熱）`; }
    U.slider(host, '加熱時間', { min: 0, max: 12, step: 0.5, value: t, fmt: v => v + ' 分' }, v => { t = v; seen[v >= 1.5 && v <= 3.5 ? 'melt' : v >= 8.5 ? 'boil' : 'x'] = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  function ringSim(host, on) {
    host.appendChild(h('<p class="sim-h">金屬球和金屬環：常溫時球剛好穿得過環</p>'));
    const sv = U.svg(host, '0 0 360 150', '', '球與環', 'sim');
    const read = h('<div class="sim-read"></div>');
    let st = 'room'; const seen = {};
    function draw() {
      const r = st === 'hot' ? 34 : 30;
      sv.innerHTML = `<circle cx="120" cy="75" r="40" fill="none" stroke="#7a8699" stroke-width="10"/><line x1="120" y1="115" x2="120" y2="148" stroke="#7a8699" stroke-width="6"/>
        <circle cx="${st === 'hot' ? 250 : 120}" cy="75" r="${r}" fill="${st === 'hot' ? '#e57373' : '#9aa5b8'}" ${ST}/>
        <text x="120" y="20" text-anchor="middle" class="t12b">環（內徑 31 mm）</text><text x="${st === 'hot' ? 250 : 120}" y="${75 + 4}" text-anchor="middle" class="t12b">${st === 'hot' ? '32' : '30'} mm</text>`;
      read.innerHTML = st === 'hot' ? '球加熱後<b>膨脹變大</b>，<b>卡住穿不過</b>環了。' : st === 'cool' ? '球冷卻後<b>收縮</b>回原來大小，<b>又穿得過</b>了。' : '常溫：球（直徑 30 mm）剛好穿過環。';
    }
    U.chips(host, '球', [{ v: 'room', t: '常溫' }, { v: 'hot', t: '用火加熱' }, { v: 'cool', t: '放進冷水' }], st, v => { st = v; seen[v] = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '冰塊正在融化的時候，一直加熱，冰水的溫度會……',
        options: [{ t: '一直升高' }, { t: '停在 0 °C 不動', ok: true }],
        reveal: '<b>停在 0 °C</b>，直到冰全部融化。那熱量跑去哪了？' },
      { q: '鐵軌每一段之間為什麼要留一點<b>縫</b>？',
        options: [{ t: '省材料' }, { t: '夏天鐵軌會變長', ok: true }, { t: '讓雨水流走' }],
        reveal: '<b>夏天會變長</b>。東西熱了會膨脹，沒留縫鐵軌會擠彎。' }
    ]);
  }

  function play(p, api) {
    let A, B;
    const P = U.panes(p, 2);
    const tk = U.tasks(p, api, [
      { text: '拉「加熱時間」到 <b>1.5～3.5 分</b>（冰正在融化）。', setup() { P.show(0); }, check: () => A.seen.melt,
        qs: () => [{ q: '冰熔化時，爐火一直在加熱，溫度卻停在 0 °C。熱量跑去哪了？', options: [{ t: '用來把冰變成水', ok: true, why: '熔化需要<b>吸熱</b>，熱量用來改變狀態，所以溫度不變。這個溫度叫<b>熔點</b>（冰是 0 °C）。' }, { t: '熱量消失了', why: '能量不會消失，只是用在別的地方。' }, { t: '爐火其實熄了', why: '爐火一直開著。' }] }] },
      { text: '再拉到 <b>8.5 分以後</b>（水在沸騰）。', check: () => A.seen.boil,
        qs: () => [{ q: '水沸騰時，溫度停在幾度？', options: [{ t: '100 °C', ok: true, why: '這叫<b>沸點</b>（一大氣壓下水是 100 °C）。沸騰時一樣吸熱、溫度不變，熱量用來讓水變成水蒸氣。' }, { t: '一直往上升', why: '看圖：沸騰那一段是平的。' }] }] },
      { text: '換到球與環：把球<b>加熱</b>，再<b>放進冷水</b>。', setup() { P.show(1); }, check: () => B.seen.hot && B.seen.cool,
        qs: () => [{ q: '這個實驗說明什麼？', options: [{ t: '物體受熱膨脹、遇冷收縮', ok: true, why: '<b>熱脹冷縮</b>。所以鐵軌要留縫、電線夏天會比較垂。' }, { t: '金屬加熱會變輕', why: '質量沒有變，是體積變了。' }] }] }
    ]);
    A = iceSim(P.list[0], () => tk.check()); B = ringSim(P.list[1], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.svg(U.card(p, '① 三態變化：往右吸熱，往左放熱', '<p>固 → 液：<b>熔化</b>（吸熱）；液 → 固：<b>凝固</b>（放熱）。<br>液 → 氣：<b>汽化</b>（蒸發、沸騰，吸熱）；氣 → 液：<b>凝結</b>（放熱）。<br>固 → 氣：<b>昇華</b>（乾冰、樟腦丸，吸熱）。</p>'),
      '0 0 320 90', `<rect x="10" y="30" width="70" height="34" rx="8" fill="#cfe8ff" ${ST}/><rect x="125" y="30" width="70" height="34" rx="8" fill="var(--water)" ${ST}/><rect x="240" y="30" width="70" height="34" rx="8" fill="var(--bg)" ${ST}/>
        <text x="45" y="52" text-anchor="middle" class="t14b">固</text><text x="160" y="52" text-anchor="middle" class="t14b">液</text><text x="275" y="52" text-anchor="middle" class="t14b">氣</text>
        <text x="102" y="24" text-anchor="middle" class="t12">熔化 →</text><text x="102" y="80" text-anchor="middle" class="t12">← 凝固</text><text x="218" y="24" text-anchor="middle" class="t12">汽化 →</text><text x="218" y="80" text-anchor="middle" class="t12">← 凝結</text>`, '三態變化');
    U.svg(U.card(p, '② 熔化、沸騰時溫度不變', '<p>熔化、沸騰時一直吸熱，但溫度停住：熱量用來<b>改變狀態</b>。<br>純物質的<b>熔點、沸點</b>是固定的，可以用來辨認物質。</p>'), '0 0 360 190', curveGraph(null), '冰的加熱曲線');
    ringSim(U.card(p, '③ 熱脹冷縮', '<p>大部分物質受熱<b>體積變大</b>、遇冷變小，但<b>質量不變</b>（所以受熱後密度變小）。<br>例子：鐵軌留縫、橋的伸縮縫、溫度計、熱氣球。</p>'), () => {});
    U.card(p, '④ 水的例外', '<p>水在 <b>4 °C</b> 時體積最小、密度最大。結冰時體積反而<b>變大</b>，所以冰會浮在水面上，冬天湖面結冰、底下的魚還能活。</p>');
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '冰塊放在手心上融化，手覺得冰冰的。為什麼？', hint: '熔化是吸熱還是放熱？',
      options: [{ t: '冰熔化要吸熱，從手上吸走了熱量', ok: true, why: '熔化吸熱，熱量從手流到冰。' }, { t: '冰熔化會放出冷氣', why: '沒有「冷氣」這種東西，是熱量被吸走了。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開冰的加熱曲線',
      bench: host => iceSim(host, () => {}),
      qs: [
        { src: '改寫自 113 年會考', pic: c => U.svg(c, '0 0 360 190', curveGraph(null), '冰的加熱曲線').style.maxWidth = '380px',
          q: '上圖是把冰塊持續加熱時溫度的變化。1～4 分鐘這一段是平的，代表什麼？',
          hint: '這段的溫度是 0 °C。冰在幹嘛？',
          options: [{ t: '冰正在熔化，溫度停在熔點 0 °C', ok: true, why: '熔化時吸熱但溫度不變。' }, { t: '加熱器關掉了', why: '題目說持續加熱。' },
            { t: '冰和水蒸氣一起存在', why: '0 °C 這段是冰和「水」一起存在。' }, { t: '水已經全部變成氣體', why: '那是後面沸騰那一段。' }] },
        { src: '改寫自 106 年會考',
          pic: c => c.appendChild(h(`<table class="sim-table" style="max-width:360px"><thead><tr><th></th><th>熔點</th><th>沸點</th></tr></thead><tbody>
            <tr><td>鐵</td><td>1535 °C</td><td>2750 °C</td></tr><tr><td>氮</td><td>−210 °C</td><td>−196 °C</td></tr><tr><td>汞</td><td>−39 °C</td><td>357 °C</td></tr><tr><td>乙醇</td><td>−114 °C</td><td>78 °C</td></tr></tbody></table>`)),
          q: '在室溫 25 °C 時，下列哪一個說法正確？',
          hint: '溫度在熔點以下是固體，熔點和沸點之間是液體，沸點以上是氣體。',
          options: [{ t: '汞是液體', ok: true, why: '25 °C 在汞的熔點 −39 和沸點 357 之間，所以是液體（溫度計常用汞）。' }, { t: '氮是液體', why: '25 °C 比氮的沸點 −196 °C 高很多，是氣體。' },
            { t: '鐵是液體', why: '25 °C 比鐵的熔點低，是固體。' }, { t: '乙醇是氣體', why: '25 °C 比乙醇的沸點 78 °C 低，是液體。' }] },
        { src: '基本題', q: '夏天的電線比冬天看起來更「垂」，原因是什麼？', hint: '熱脹冷縮。',
          options: [{ t: '夏天溫度高，電線受熱膨脹變長', ok: true, why: '熱脹冷縮。架電線時會故意留一點鬆，冬天才不會繃斷。' }, { t: '夏天電線比較重', why: '質量不會因為溫度改變。' }, { t: '夏天用電多，電線被拉長', why: '主要是溫度造成的膨脹。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  const tbl = html => c => c.appendChild(h(`<table class="sim-table" style="max-width:400px">${html}</table>`));
  function t1Pic(c) {
    U.svg(c, '0 0 320 170', `<line x1="40" y1="10" x2="40" y2="150" class="g-axis"/><line x1="40" y1="150" x2="310" y2="150" class="g-axis"/>
      <path d="M40 140 L100 100 L190 100 L280 30" fill="none" stroke="var(--accent)" stroke-width="3"/>
      <line x1="40" y1="100" x2="100" y2="100" stroke="var(--muted)" stroke-dasharray="3 3"/><line x1="100" y1="100" x2="100" y2="150" stroke="var(--muted)" stroke-dasharray="3 3"/><line x1="190" y1="100" x2="190" y2="150" stroke="var(--muted)" stroke-dasharray="3 3"/>
      <text x="34" y="104" text-anchor="end" class="t12b">T₁</text><text x="100" y="164" text-anchor="middle" class="t12b">t₁</text><text x="190" y="164" text-anchor="middle" class="t12b">t₂</text>
      <text x="310" y="164" text-anchor="end" class="g-lab">時間</text><text x="44" y="14" class="g-lab">溫度（°C）</text>`, '冰塊加熱的溫度—時間圖，T1 處有一段水平').style.maxWidth = '340px';
  }
  function flaskPic(c) {
    U.svg(c, '0 0 320 175', `<defs><clipPath id="fk53"><circle cx="160" cy="76" r="50"/><rect x="149" y="118" width="22" height="34"/></clipPath></defs>
      <rect x="100" y="84" width="120" height="70" fill="var(--water)" clip-path="url(#fk53)"/>
      <circle cx="160" cy="76" r="50" fill="none" stroke="var(--stroke)" stroke-width="2"/><path d="M149 122 V152 M171 122 V152" stroke="var(--stroke)" stroke-width="2"/>
      <rect x="146" y="152" width="28" height="12" rx="2" fill="#8a5a2b"/><rect x="120" y="6" width="80" height="18" rx="6" fill="#cfe8ff" stroke="var(--stroke)"/>
      ${[0, 1, 2, 3, 4].map(i => `<circle cx="${140 + i * 10}" cy="${132 - i * 9}" r="3" fill="none" stroke="var(--stroke)"/>`).join('')}
      <text x="208" y="19" class="t12b">冰塊</text><text x="226" y="60" class="t12">空氣和水蒸氣</text><text x="226" y="110" class="t12">水（冒出氣泡）</text><text x="186" y="168" class="t12">瓶塞（燒瓶倒置）</text>`, '倒置的燒瓶，上方放冰塊，水中冒出氣泡').style.maxWidth = '320px';
  }
  function real(p, api) {
    U.real(p, api, [
      { stars: 2, src: '106 年會考第 15 題',
        pic: tbl('<thead><tr><th>物質</th><th>熔點（°C）</th><th>沸點（°C）</th></tr></thead><tbody><tr><td>鐵</td><td>1535</td><td>2750</td></tr><tr><td>氮</td><td>－210</td><td>－196</td></tr><tr><td>水</td><td>0</td><td>100</td></tr><tr><td>鋁</td><td>660</td><td>2467</td></tr></tbody>'),
        q: '表為四種物質在一大氣壓下的熔點及沸點。在一大氣壓下，下列何者的溫度<b>最高</b>？',
        options: [{ t: '液態的鐵', ok: true, why: '液態的鐵溫度在 1535～2750 °C 之間，一定最高。' }, { t: '液態的氮', why: '液態的氮在 －210～－196 °C，非常冷。' }, { t: '固態的水', why: '固態的水（冰）在 0 °C 以下。' }, { t: '固態的鋁', why: '固態的鋁在 660 °C 以下，比液態的鐵（至少 1535 °C）低。' }],
        steps: [{ q: '物質是「液態」時，溫度在哪個範圍？', options: [{ t: '熔點和沸點之間', ok: true, why: '高於熔點才會熔化，低於沸點才不會沸騰。' }, { t: '熔點以下', why: '熔點以下是固態。' }] },
          { q: '「固態」時呢？', options: [{ t: '熔點以下', ok: true, why: '還沒熔化。' }, { t: '沸點以上', why: '沸點以上是氣態。' }] },
          { q: '液態的鐵至少 1535 °C；固態的鋁最多幾度？', options: [{ t: '660 °C', ok: true, why: '所以液態的鐵比較高。' }, { t: '2467 °C', why: '那是鋁的沸點，固態的鋁要在熔點 660 °C 以下。' }] }],
        explain: '<p>固態：低於熔點；液態：熔點～沸點之間；氣態：高於沸點。液態鐵 1535～2750 °C、液態氮 －210～－196 °C、冰 ＜ 0 °C、固態鋁 ＜ 660 °C → <b>液態的鐵</b>最高。</p>' },
      { stars: 2, src: '113 年會考第 27 題', pic: t1Pic,
        q: '在一大氣壓下，將一塊質量 100 g 的冰塊置於燒杯中，以穩定熱源均勻加熱，其溫度與加熱時間的關係如圖。根據此圖判斷下列何者正確？',
        options: [{ t: 'T₁ 的數值為 0', ok: true, why: '冰在熔化時溫度停在熔點 0 °C，就是那段水平線。' }, { t: 't₁ 可以表示冰塊的熔點', why: 't₁ 是「時間」，熔點是「溫度」，要看縱軸的 T₁。' },
          { t: '當時間大於 t₂，燒杯中的水只會以氣態存在', why: 't₂ 之後冰剛熔完，是液態的水在升溫。' }, { t: '在 t₁～t₂ 期間，燒杯中的水是以固體與氣體共存的狀態', why: '這段是熔化，是固體（冰）和液體（水）共存。' }],
        steps: [{ q: '冰塊加熱，溫度第一次停住不動，是在做什麼？', options: [{ t: '熔化', ok: true, why: '冰變成水。' }, { t: '沸騰', why: '沸騰在 100 °C，要等水先升溫。' }] },
          { q: '冰的熔點是幾度？', options: [{ t: '0 °C', ok: true, why: '所以 T₁ ＝ 0。' }, { t: '100 °C', why: '100 °C 是沸點。' }] },
          { q: 't₁～t₂ 熔化期間，燒杯裡有什麼？', options: [{ t: '冰和水（固液共存）', ok: true, why: '一邊熔化，一邊還有沒熔完的冰。' }, { t: '冰和水蒸氣', why: '熔化是固體變液體。' }] }],
        explain: '<p>水平段＝熔化，溫度停在<b>熔點 0 °C</b>（T₁ ＝ 0），這段是冰水共存。t₁、t₂ 是時間，不能表示熔點；t₂ 之後是液態水升溫。</p>' },
      { stars: 2, src: '103 年會考題組', pic: c => c.appendChild(h(`<table class="sim-table" style="max-width:420px"><thead><tr><th>金屬塊</th><th>甲</th><th>乙</th><th>丙</th><th>丁</th></tr></thead><tbody><tr><td>材質</td><td>鐵</td><td>鐵</td><td>鋁</td><td>鋁</td></tr><tr><td>初始溫度（°C）</td><td>80</td><td>60</td><td>80</td><td>60</td></tr><tr><td>質量（g）</td><td>100</td><td>200</td><td>100</td><td>200</td></tr></tbody></table>`)),
        q: '四個金屬塊甲、乙、丙、丁的資訊如表。放在室溫 20 °C 的環境下一段時間後，四者的溫度均降為 20 °C。降到 20 °C 後，四個金屬塊的體積分別為 V甲、V乙、V丙、V丁，下列推斷何者正確？',
        options: [{ t: 'V甲 ＝ V乙，V丙 ＝ V丁', why: '溫度一樣了，但質量不一樣，同材質的體積就不一樣。' }, { t: 'V甲 ＝ V丙，V乙 ＝ V丁', why: '鐵和鋁密度不同，質量一樣體積也不一樣。' },
          { t: 'V甲 ＞ V乙，V丙 ＞ V丁', why: '降到同溫後，比的是質量：乙比甲重一倍。' }, { t: 'V甲 ＜ V乙，V丙 ＜ V丁', ok: true, why: '同材質、同溫度時，密度一樣，質量越大體積越大。' }],
        steps: [{ q: '降到 20 °C 以後，四塊的溫度一樣了。初始溫度還會影響現在的體積嗎？', options: [{ t: '不會，現在的溫度都一樣', ok: true, why: '熱脹冷縮只看「現在」的溫度。' }, { t: '會，原本比較熱的比較大', why: '都冷卻到 20 °C 了，已經縮回去。' }] },
          { q: '同一種材質、同樣溫度，質量 200 g 和 100 g 的，哪個體積大？', options: [{ t: '200 g 的', ok: true, why: '密度一樣，質量是 2 倍，體積也是 2 倍（想想 1-3 密度）。' }, { t: '一樣大', why: '同材質密度相同，體積 ＝ 質量 ÷ 密度。' }] }],
        explain: '<p>都降到 20 °C 後，溫度相同。同材質、同溫度 → 密度相同 → 體積 ＝ 質量 ÷ 密度，質量大的體積大：<b>V甲 ＜ V乙、V丙 ＜ V丁</b>。</p>' },
      { stars: 3, src: '114 年會考第 40 題', pic: flaskPic,
        q: '在燒瓶中裝水並加熱到沸騰後，停止加熱，塞住瓶口，翻轉倒置燒瓶，使瓶內的空氣位於上方。此時拿一袋冰塊放在燒瓶的上方，瓶內的氣壓會改變，而水會由下而上開始冒出氣泡，是一種物理變化，如圖。根據上述說明，關於冰塊降溫造成此現象的解釋，下列何者最合理？',
        options: [{ t: '瓶內的水蒸氣凝結，接著藉由水汽化達到新的平衡', ok: true, why: '冰塊讓上方的水蒸氣凝結成水，氣體變少；水就汽化（沸騰）來補充。' }, { t: '瓶內的水蒸氣蒸發，接著藉由水汽化達到新的平衡', why: '水蒸氣已經是氣體，遇冷是「凝結」不是蒸發。' },
          { t: '瓶內的氣壓降低，接著藉由水分解反應產生氣體達到新的平衡', why: '題目說是物理變化，水沒有分解成氫和氧（那是化學變化）。' }, { t: '瓶內的氣壓升高，接著藉由水分解反應產生氣體達到新的平衡', why: '降溫讓水蒸氣凝結，氣壓是降低；而且不是水分解。' }],
        steps: [{ q: '冰塊放在燒瓶上方，上方的水蒸氣遇冷會怎樣？', options: [{ t: '凝結成小水滴', ok: true, why: '氣體 → 液體，叫凝結（放熱）。' }, { t: '蒸發', why: '蒸發是液體變氣體。' }] },
          { q: '水蒸氣變成水，瓶內的氣體變多還是變少？', options: [{ t: '變少，氣壓降低', ok: true, why: '氣壓低了，水比較容易沸騰。' }, { t: '變多', why: '水蒸氣變成液體，氣體就少了。' }] },
          { q: '水冒出的氣泡是什麼？這是物理還是化學變化？', options: [{ t: '水汽化成的水蒸氣，是物理變化', ok: true, why: '水只是變成氣體，沒有變成新物質。' }, { t: '水分解成的氫氣和氧氣，是化學變化', why: '題目說是物理變化，而且冰塊不會讓水分解。' }] }],
        explain: '<p>冰塊使上方的水蒸氣<b>凝結</b> → 瓶內氣體變少、氣壓下降 → 水在較低溫就能<b>汽化（沸騰）</b>補充水蒸氣。整個過程只有狀態改變，是物理變化。</p>' }
    ]);
  }

  U.run('5-3', ['先猜猜看：熱量跑去哪了？', '動手玩：加熱冰塊、熱脹冷縮', '收成 4 句話'], { guess, play, know, exam, real });
})();
