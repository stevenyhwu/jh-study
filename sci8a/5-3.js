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

  U.run('5-3', ['先猜猜看：熱量跑去哪了？', '動手玩：加熱冰塊、熱脹冷縮', '收成 4 句話'], { guess, play, know, exam });
})();
