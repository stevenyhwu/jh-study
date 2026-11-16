/* ===== 理化 2-2 溶液與濃度 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const SOL = { 0: 13, 10: 21, 20: 32, 30: 46, 40: 64, 50: 86, 60: 110, 70: 138, 80: 169 };  // 硝酸鉀 g/100 g 水
  const r1 = x => Math.round(x * 10) / 10;

  /* ---------- 濃度調配 ---------- */
  function concSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">調一杯糖水</p>'));
    const sv = U.svg(host, '0 0 360 170', '', '糖水', 'sim');
    const read = h('<div class="sim-read"></div>');
    let s = 20, w = 100;
    function draw() {
      const tot = s + w, c = s / tot * 100, hh = 20 + tot * 0.36, bw = 300;
      sv.innerHTML = `<rect x="130" y="${128 - hh}" width="100" height="${hh}" fill="var(--water)"/><rect x="130" y="${128 - hh}" width="100" height="${hh}" fill="#b5651d" opacity="${Math.min(.85, c / 45)}"/>
        <path d="M130 14 V128 H230 V14" fill="none" ${ST}/>
        <rect x="30" y="142" width="${bw * s / tot}" height="18" fill="#f6c453" ${ST}/><rect x="${30 + bw * s / tot}" y="142" width="${bw * w / tot}" height="18" fill="var(--water)" ${ST}/>
        <text x="${30 + bw * s / tot / 2}" y="155" text-anchor="middle" class="t12b">${s ? '糖' : ''}</text><text x="${30 + bw * s / tot + bw * w / tot / 2}" y="155" text-anchor="middle" class="t12b">水</text>`;
      read.innerHTML = `糖 ${s} g ÷（糖 ${s} g＋水 ${w} g）＝ ${s} ÷ ${tot} ＝ <b>${r1(c)}%</b>`;
    }
    U.slider(host, '糖（溶質）', { min: 0, max: 50, step: 5, value: s, fmt: v => v + ' g' }, v => { s = v; draw(); onChange(); });
    U.slider(host, '水（溶劑）', { min: 50, max: 200, step: 10, value: w, fmt: v => v + ' g' }, v => { w = v; draw(); onChange(); });
    host.appendChild(read); draw();
    return { is20: () => s * 5 === s + w && s > 0 };
  }

  /* ---------- 溶解度圖 ---------- */
  const GX = t => 196 + t / 80 * 148, GY = g => 168 - g / 180 * 146;
  function graph(T, dis, added) {
    let s = `<line x1="196" y1="18" x2="196" y2="168" class="g-axis"/><line x1="196" y1="168" x2="348" y2="168" class="g-axis"/>`;
    for (let t = 0; t <= 80; t += 20) s += `<text x="${GX(t)}" y="181" text-anchor="middle" class="g-num">${t}</text><line x1="${GX(t)}" y1="18" x2="${GX(t)}" y2="168" class="g-grid"/>`;
    for (let g = 0; g <= 180; g += 60) s += `<text x="191" y="${GY(g) + 4}" text-anchor="end" class="g-num">${g}</text><line x1="196" y1="${GY(g)}" x2="348" y2="${GY(g)}" class="g-grid"/>`;
    s += `<polyline points="${Object.keys(SOL).map(t => GX(+t) + ',' + GY(SOL[t])).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="3"/>
      <text x="348" y="196" text-anchor="end" class="g-lab">溫度（°C）</text><text x="170" y="11" class="g-lab">100 g 水最多溶幾 g</text>`;
    if (T != null) {
      if (added > dis) s += `<circle cx="${GX(T)}" cy="${GY(Math.min(added, 180))}" r="5" fill="none" stroke="var(--bad)" stroke-width="2"/><line x1="${GX(T)}" y1="${GY(Math.min(added, 180)) + 5}" x2="${GX(T)}" y2="${GY(dis) - 6}" stroke="var(--bad)" stroke-dasharray="3 3"/>`;
      s += `<circle cx="${GX(T)}" cy="${GY(dis)}" r="6" fill="#f6c453" ${ST}/>`;
    }
    return s;
  }
  function solSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">100 g 的水，加硝酸鉀（一種白色的鹽）</p>'));
    const sv = U.svg(host, '0 0 360 200', '', '溶解度實驗', 'sim');
    const read = h('<div class="sim-read"></div>');
    let T = 20, added = 0; const st = { sat20: false, cleared: false, recry: false };
    function draw() {
      const max = SOL[T], dis = Math.min(added, max), pile = added - dis;
      let s = `<rect x="30" y="50" width="120" height="118" fill="var(--water)"/><rect x="30" y="50" width="120" height="118" fill="#f6c453" opacity="${Math.min(.5, dis / 340)}"/><path d="M30 26 V168 H150 V26" fill="none" ${ST}/>`;
      const n = Math.round(pile / 5);
      for (let i = 0; i < n; i++) s += `<rect x="${36 + (i % 12) * 9.2}" y="${158 - Math.floor(i / 12) * 9}" width="8" height="8" rx="1.5" fill="#fff" stroke="var(--stroke)" stroke-width=".8"/>`;
      s += `<text x="90" y="16" text-anchor="middle" class="t12b">${T} °C</text><text x="90" y="188" text-anchor="middle" class="t12">${pile > 0 ? '底下有溶不掉的' : added ? '全部溶掉了' : '清水'}</text>`;
      sv.innerHTML = s + graph(T, dis, added);
      read.innerHTML = `一共加了 <b>${added} g</b>　→　溶掉 <b>${dis} g</b>` + (pile > 0 ? `，沉在底下 <b>${pile} g</b>（溶不下去了＝<b>飽和</b>）` : added ? '（還可以再溶＝未飽和）' : '');
      if (T === 20 && pile > 0) { if (st.cleared) st.recry = true; st.sat20 = true; }
      if (T > 20 && pile === 0 && added > 32) st.cleared = true;
    }
    U.slider(host, '溫度', { min: 0, max: 80, step: 10, value: T, fmt: v => v + ' °C' }, v => { T = v; draw(); onChange(); });
    const row = h('<div class="row"><button type="button" class="btn primary">🥄 加一匙（10 g）</button><button type="button" class="btn">重來</button></div>');
    row.children[0].addEventListener('click', () => { if (added < 180) added += 10; draw(); onChange(); });
    row.children[1].addEventListener('click', () => { added = 0; draw(); onChange(); });
    host.append(row, read); draw();
    return st;
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '一杯水，一直加糖、一直攪。糖可以<b>無限</b>溶下去嗎？',
        options: [{ t: '可以，攪久一點就會溶' }, { t: '不行，加到某個量就溶不下去了', ok: true }],
        reveal: '<b>不行</b>。水能溶的量有上限，超過就會沉在杯底。' },
      { q: '把 <b>20 g</b> 的糖加進 <b>100 g</b> 的水。這杯糖水的濃度是 20% 嗎？',
        options: [{ t: '是，剛好 20%' }, { t: '不是，比 20% 小', ok: true }, { t: '不是，比 20% 大' }],
        reveal: '<b>比 20% 小</b>（大約 16.7%）。很多人會算錯，下一步自己調一杯就知道為什麼。' }
    ]);
  }

  function play(p, api) {
    let A, B;
    const tk = U.tasks(p, api, [
      { text: '拉糖和水的拉桿，調出一杯<b>剛好 20%</b> 的糖水。',
        setup() { a.hidden = false; b.hidden = true; },
        check: () => A.is20(),
        qs: () => [{ q: '算濃度的時候，下面（分母）要放什麼？', hint: '看算式：糖 ÷（糖＋水）。',
            options: [{ t: '糖和水加起來（整杯糖水）', ok: true, why: '濃度是「糖占<b>整杯</b>的幾分之幾」。所以 20 g 糖要配 80 g 水，整杯 100 g，才是 20%。' }, { t: '只有水', why: '如果只除以水，20 g 糖＋100 g 水會算成 20%，但實驗台顯示的是 16.7%。' }, { t: '只有糖', why: '糖 ÷ 糖 永遠是 100%，不對喔。' }] }] },
      { text: '溫度停在 <b>20 °C</b>。一匙一匙加硝酸鉀，加到杯底出現<b>溶不掉</b>的為止。',
        setup() { b.hidden = false; a.hidden = true; },
        check: () => B.sat20,
        qs: () => [{ q: '20 °C 時，100 g 的水最多大約可以溶多少硝酸鉀？', hint: '看下面那行字：「溶掉幾 g」。',
            options: [{ t: '大約 32 g', ok: true, why: '這個上限叫做<b>溶解度</b>。溶到上限的溶液叫<b>飽和溶液</b>，再加也只會沉在底下。' }, { t: '大約 10 g', why: '10 g 是一匙的量。看「溶掉」的數字停在多少。' }, { t: '加多少就溶多少', why: '杯底已經有溶不掉的了。' }] }] },
      { text: '先<b>加熱</b>：把溫度拉高，直到杯底的固體全部溶掉。然後再<b>降溫</b>回到 20 °C。',
        check: () => B.recry,
        qs: () => [{ q: '溫度越高，硝酸鉀的溶解度會……', hint: '看右邊的藍色曲線，越往右是越高還是越低？',
            options: [{ t: '越大（可以溶更多）', ok: true, why: '大部分的固體都是這樣：水越熱，溶得越多。' }, { t: '越小', why: '加熱時，杯底的固體是變多還是變少？' }, { t: '不變', why: '拉溫度時，黃色的點有在移動喔。' }] },
          { q: '降溫以後，杯底又跑出白色的固體。那是什麼？',
            options: [{ t: '原本溶在水裡的硝酸鉀，溶不住又跑出來', ok: true, why: '溫度降低，溶解度變小，多出來的就變回固體。這叫做<b>結晶</b>。' }, { t: '水結成的冰', why: '20 °C 水不會結冰。' }, { t: '空氣中掉進去的灰塵', why: '它的量剛好等於「加進去的」減掉「20 °C 能溶的」。' }] }] }
    ]);
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const a = h('<div></div>'), b = h('<div hidden></div>');
    card.append(a, b, tk.slot);
    A = concSim(a, () => tk.check());
    B = solSim(b, () => tk.check());
    tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.svg(U.card(p, '① 溶液＝溶質＋溶劑',
      '<p>糖水裡：<b>糖</b>是被溶掉的（溶質），<b>水</b>是負責溶的（溶劑），整杯<b>糖水</b>叫溶液。</p><p>質量可以直接加：20 g 糖＋80 g 水＝100 g 糖水。</p>'),
      '0 0 320 60', `<rect x="20" y="16" width="56" height="26" fill="#f6c453" ${ST}/><rect x="76" y="16" width="224" height="26" fill="var(--water)" ${ST}/>
        <text x="48" y="34" text-anchor="middle" class="t12b">糖 20</text><text x="188" y="34" text-anchor="middle" class="t12b">水 80</text><text x="160" y="56" text-anchor="middle" class="t12 mut">整杯糖水 100 g</text>`, '糖 20 加水 80');
    U.card(p, '② 重量百分濃度＝溶質 ÷ 溶液 × 100%',
      `<div class="formula">濃度 ＝ 溶質 ÷（溶質＋溶劑）× 100%</div><p>分母是<b>整杯</b>，不是只有水。<br>20 g 糖＋80 g 水 → 20 ÷ 100 ＝ 20%。<br>20 g 糖＋100 g 水 → 20 ÷ 120 ＝ 16.7%。</p>
       <p class="small muted">酒類常用「體積百分濃度」；很稀的東西用 ppm（百萬分之一）。</p>`).remove();
    U.svg(U.card(p, '③ 溶解度：100 g 水最多能溶多少',
      '<p>在固定溫度下，100 g 水<b>最多</b>能溶的量，叫<b>溶解度</b>。<br>剛好溶到上限 → <b>飽和溶液</b>。<br>還能再溶 → 未飽和溶液。</p><p>20 °C 時硝酸鉀的溶解度約 32 g／100 g 水。</p>'),
      '0 0 320 120', `<rect x="40" y="30" width="90" height="70" fill="var(--water)"/><path d="M40 16 V100 H130 V16" fill="none" ${ST}/><text x="85" y="116" text-anchor="middle" class="t12b">未飽和</text>
        <rect x="190" y="30" width="90" height="70" fill="var(--water)"/><path d="M190 16 V100 H280 V16" fill="none" ${ST}/>` +
        [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${198 + i * 11}" y="90" width="8" height="8" fill="#fff" stroke="var(--stroke)" stroke-width=".8"/>`).join('') + '<text x="235" y="116" text-anchor="middle" class="t12b">飽和（底下有剩）</text>', '未飽和與飽和');
    U.svg(U.card(p, '④ 固體：越熱溶越多；降溫會結晶',
      '<p>大部分固體，<b>溫度越高，溶解度越大</b>。<br>熱的飽和溶液降溫，溶不住的部分會變回固體跑出來（<b>結晶</b>）。</p><p class="small muted">氣體相反：越熱越溶不住。所以汽水放熱了，氣就跑光。</p>'),
      '164 0 196 200', graph(null), '硝酸鉀的溶解度曲線');
    const c = h('<div class="card"><h3>✏️ 算一題看看</h3></div>'); p.appendChild(c);
    U.svg(c, '0 0 320 60', `<rect x="20" y="16" width="28" height="26" fill="#f0f0f0" ${ST}/><rect x="48" y="16" width="252" height="26" fill="var(--water)" ${ST}/>
      <text x="34" y="34" text-anchor="middle" class="t12b" style="fill:#333">鹽</text><text x="174" y="34" text-anchor="middle" class="t12b">水 90 g</text><text x="34" y="56" text-anchor="middle" class="t12 mut">10 g</text>`, '鹽 10 公克加水 90 公克');
    U.numq(c, { q: '把 <b>10 g</b> 的食鹽溶在 <b>90 g</b> 的水裡。這杯食鹽水的重量百分濃度是多少？', post: '%', answer: 10,
      hint: '整杯食鹽水是 10＋90＝100 g。鹽占其中多少？',
      diag: [{ v: 11.1, msg: '你用 10 ÷ 90 了。分母要是<b>整杯</b>：10＋90＝100。' }, { v: 11, msg: '你用 10 ÷ 90 了。分母要是<b>整杯</b>：10＋90＝100。' }, { v: 0.1, msg: '10 ÷ 100＝0.1，再換成百分比：×100% ＝ ?' }],
      why: '10 ÷（10＋90）＝10 ÷ 100＝10%。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開硝酸鉀的溶解實驗',
      bench: host => solSim(host, () => {}),
      qs: [
        { src: '改寫自 109 年會考',
          pic: c => { U.svg(c, '164 0 196 200', graph(40, 64, 64), '硝酸鉀的溶解度曲線，40 度時為 64').style.maxWidth = '300px'; },
          q: '上圖是硝酸鉀的溶解度曲線，40 °C 時是 <b>64 g／100 g 水</b>。曉明在 40 °C 的 <b>10 g</b> 水裡加入 <b>8 g</b> 硝酸鉀，充分攪拌後會看到什麼？',
          hint: '100 g 水最多溶 64 g。那水只有 10 g（十分之一）的時候，最多溶多少？',
          options: [
            { t: '全部溶解，還沒有飽和', why: '10 g 水最多只能溶 6.4 g，8 g 放不下。' },
            { t: '溶掉 6.4 g，杯底剩下 1.6 g', ok: true, why: '水變成十分之一，能溶的也變十分之一：64 ÷ 10 ＝ 6.4 g。多出來的 8－6.4＝1.6 g 沉在底下。' },
            { t: '溶掉 64 g', why: '64 g 是 <b>100 g</b> 水能溶的量。這裡只有 10 g 水，而且只加了 8 g。' },
            { t: '完全不會溶解', why: '硝酸鉀會溶，只是有上限。' }] },
        { src: '改寫自 108 年會考',
          q: '有一種熱敷袋裡面裝的是醋酸鈉水溶液。用完冷卻後，裡面會有析出的<b>結晶</b>而變硬；把它放進熱水裡加熱，結晶又<b>溶回去</b>，變回澄清的液體。這說明醋酸鈉的溶解度和溫度有什麼關係？',
          hint: '和硝酸鉀一樣：加熱時，杯底的固體變多還是變少？',
          options: [{ t: '溫度升高，溶解度變大', ok: true, why: '加熱後結晶又溶回去，表示熱的時候能溶更多。' }, { t: '溫度升高，溶解度變小', why: '如果變小，加熱時結晶應該更多才對。' },
            { t: '溶解度和溫度沒有關係', why: '冷的時候有結晶、熱的時候沒有，表示有關係。' }] },
        { src: '挑戰題・改寫自 103 年會考',
          q: '室溫時，食鹽的溶解度是 <b>36 g／100 g 水</b>。小梅把 <b>50 g</b> 食鹽放進 <b>100 g</b> 水裡，充分攪拌後<b>過濾</b>。濾出來的食鹽水，重量百分濃度大約是多少？',
          hint: '第一步：100 g 水最多溶多少鹽？（沒溶掉的被濾紙擋住了。）第二步：濃度＝溶質 ÷ 整杯溶液。',
          options: [
            { t: '26.5%', ok: true, why: '只有 36 g 溶得進去，剩下 14 g 被濾掉。溶液＝36＋100＝136 g，濃度＝36 ÷ 136 ≈ 26.5%。' },
            { t: '33.3%', why: '這是 50 ÷ 150。但 50 g 鹽沒有全部溶掉，沒溶的不算在溶液裡。' },
            { t: '36.0%', why: '這是 36 ÷ 100。分母要用<b>整杯溶液</b>：36＋100＝136。' },
            { t: '50.0%', why: '50 g 的鹽沒有全部溶掉，而且分母也不是只有水。' }] }
      ]
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    U.mount(document.getElementById('unit'), { unit: 'sci8a-2-2', home: 'index.html', steps: [
      { id: 'guess', label: '猜', title: '先猜猜看：糖水的祕密', render: guess },
      { id: 'play', label: '玩', title: '動手玩：調濃度、找上限', render: play },
      { id: 'know', label: '懂', title: '收成 4 句話', render: know },
      { id: 'exam', label: '考', title: '會考真的這樣考', render: exam }
    ] });
  });
})();
