/* ===== 理化 5-2 熱量、比熱 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const SUB = { water: { n: '水', s: 1, c: 'var(--water-line)' }, oil: { n: '沙拉油', s: 0.5, c: '#d9a400' }, sand: { n: '沙子', s: 0.2, c: '#a8743a' } };
  const PWR = 200;   // 每分鐘給 200 卡

  function heatSim(host, on) {
    host.appendChild(h('<p class="sim-h">兩杯東西放在一樣的加熱器上（每分鐘都給 200 卡），從 20 °C 開始加熱 5 分鐘</p>'));
    const cup = [{ k: 'water', m: 100 }, { k: 'sand', m: 100 }];
    const sv = U.svg(host, '0 0 360 200', '', '加熱比賽', 'sim');
    const runs = []; let start = 0, snap = null;
    ['甲杯', '乙杯'].forEach((t, i) => {
      U.chips(host, t, Object.keys(SUB).map(v => ({ v, t: SUB[v].n })), cup[i].k, v => { cup[i].k = v; });
      U.chips(host, '　質量', [100, 200].map(v => ({ v, t: v + ' g' })), cup[i].m, v => { cup[i].m = v; });
    });
    const row = h('<div class="row"><button type="button" class="btn primary">🔥 加熱 5 分鐘</button></div>');
    const read = h('<div class="sim-read">選好兩杯，按「加熱」。</div>');
    row.firstChild.addEventListener('click', () => { snap = cup.map(c => Object.assign({}, c)); start = performance.now(); });
    host.append(row, read);
    const X = t => 40 + t * 60, Yt = T => 180 - (T - 20) / 60 * 160;
    U.anim(sv, () => {
      let s = `<line x1="40" y1="20" x2="40" y2="180" class="g-axis"/><line x1="40" y1="180" x2="350" y2="180" class="g-axis"/>`;
      for (let m = 0; m <= 5; m++) s += `<text x="${X(m)}" y="194" text-anchor="middle" class="g-num">${m}</text>`;
      for (let T = 20; T <= 80; T += 20) s += `<text x="34" y="${Yt(T) + 4}" text-anchor="end" class="g-num">${T}</text><line x1="40" y1="${Yt(T)}" x2="350" y2="${Yt(T)}" class="g-grid"/>`;
      s += `<text x="350" y="174" text-anchor="end" class="g-lab">加熱時間（分）</text><text x="44" y="14" class="g-lab">溫度（°C）</text>`;
      if (snap) {
        const t = Math.min(5, (performance.now() - start) / 600);
        snap.forEach((c, i) => {
          const rate = PWR / (c.m * SUB[c.k].s), T = Math.min(80, 20 + rate * t), te = (T - 20) / rate;
          s += `<line x1="${X(0)}" y1="${Yt(20)}" x2="${X(te)}" y2="${Yt(T)}" stroke="${SUB[c.k].c}" stroke-width="3" ${i ? 'stroke-dasharray="7 4"' : ''}/>
            <text x="${X(te) + 4}" y="${Yt(T) - 4}" class="t12b">${i ? '乙' : '甲'}：${SUB[c.k].n} ${c.m} g</text>`;
        });
        if (t >= 5 && !snap.done) {
          snap.done = true;
          const res = snap.map(c => Math.round(PWR * 5 / (c.m * SUB[c.k].s)));
          read.innerHTML = snap.map((c, i) => `${i ? '乙' : '甲'}（${SUB[c.k].n} ${c.m} g）升高 <b>${res[i]} °C</b>`).join('　') + '<br><span class="small muted">兩杯都吸收了 200 × 5 ＝ 1000 卡的熱量</span>';
          runs.push(snap.map(c => c.k + c.m).sort().join('|')); on();
        }
      }
      sv.innerHTML = s;
    });
    return { has: k => runs.includes(k) };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '夏天中午的海邊，赤腳踩在<b>沙灘</b>上和泡在<b>海水</b>裡，哪一個比較燙？',
        options: [{ t: '沙灘', ok: true }, { t: '海水' }, { t: '一樣' }],
        reveal: '<b>沙灘燙多了</b>！明明曬的是同一個太陽。' },
      { q: '用同一個瓦斯爐，把<b>一鍋</b>水和<b>半鍋</b>水從 20 °C 煮到 100 °C，哪一個比較快？',
        options: [{ t: '一鍋' }, { t: '半鍋', ok: true }, { t: '一樣快' }],
        reveal: '<b>半鍋</b>。水越多，需要的熱量越多。下一步來比賽。' }
    ]);
  }

  function play(p, api) {
    let A;
    const P = U.panes(p, 1);
    const tk = U.tasks(p, api, [
      { text: '甲杯選<b>水 100 g</b>，乙杯選<b>沙子 100 g</b>，按加熱。', check: () => A.has('sand100|water100'),
        qs: () => [{ q: '吸收一樣多的熱量，誰的溫度升得比較快？', options: [{ t: '沙子', ok: true, why: '沙子的<b>比熱</b>小，一點點熱量就升溫很多。水的比熱很大，不容易變熱。所以沙灘比海水燙。' }, { t: '水', why: '看兩條線：哪一條爬得比較陡？' }] }] },
      { text: '兩杯都選<b>水</b>，甲杯 <b>100 g</b>、乙杯 <b>200 g</b>，按加熱。', check: () => A.has('water100|water200'),
        qs: () => [{ q: '200 g 的水升溫和 100 g 比起來……', options: [{ t: '只有一半', ok: true, why: '質量變 2 倍，要升高同樣的溫度，需要的熱量也要 2 倍。' }, { t: '一樣', why: '看兩個升溫的數字。' }, { t: '變 2 倍', why: '水比較多，應該比較難熱。' }] }] },
      { text: '算算看：熱量 ＝ 質量 × 比熱 × 升高的溫度。', quiet: true, check: () => true,
        qs: () => [{ num: true, q: '100 g 的水，從 20 °C 加熱到 30 °C，需要多少卡？（水的比熱 1 卡／g°C）', post: '卡', answer: 1000,
          hint: '100 × 1 × (30 － 20)。', diag: [{ v: 3000, msg: '升高的溫度是 30 － 20 ＝ 10，不是 30。' }, { v: 100, msg: '還要乘上升高的 10 °C。' }], why: '100 × 1 × 10 ＝ 1000 卡。' }] }
    ]);
    A = heatSim(P.list[0], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.card(p, '① 熱量：從高溫流到低溫的能量', '<p>熱量會從<b>高溫</b>的物體傳到<b>低溫</b>的物體，直到溫度一樣（熱平衡）。<br>單位：<b>卡（cal）</b>。1 g 的水升高 1 °C 需要 1 卡。</p>');
    U.card(p, '② 比熱：1 g 升高 1 °C 要多少熱量', `<table class="sim-table" style="max-width:360px"><tbody><tr><td>水</td><td>1 卡／g°C</td></tr><tr><td>沙拉油</td><td>約 0.5</td></tr><tr><td>沙子</td><td>約 0.2</td></tr><tr><td>鐵</td><td>約 0.11</td></tr></tbody></table>
      <p>比熱越<b>大</b>，越<b>不容易</b>變熱、也不容易變冷。水的比熱特別大。</p>`);
    U.card(p, '③ 熱量 ＝ 質量 × 比熱 × 溫度變化', '<div class="formula">H ＝ m × s × ΔT</div><p>同樣的熱量：質量越大、比熱越大 → 溫度變化越小。</p>');
    U.card(p, '④ 生活中的比熱', '<p>海邊白天晚上溫差小，沙漠溫差大（水的比熱大）。<br>汽車用水當冷卻液；暖暖包、熱水袋用水來保溫。</p>');
    const c = h('<div class="card"><h3>✏️ 算一題看看</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '<b>200 g</b> 的水升高 <b>5 °C</b>，需要多少卡？', post: '卡', answer: 1000, hint: '200 × 1 × 5。',
      diag: [{ v: 40, msg: '是相乘：200 × 1 × 5。' }], why: '200 × 1 × 5 ＝ 1000 卡。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開加熱比賽',
      bench: host => heatSim(host, () => {}),
      qs: [
        { src: '改寫自 106 年會考',
          q: '甲、乙、丙三塊<b>鋁塊</b>，質量 甲 ＞ 乙 ＞ 丙，原本溫度一樣。讓它們各吸收<b>相同的熱量</b>，哪一塊溫度升最多？',
          hint: '同一種材料（比熱一樣），熱量一樣。質量越大，升溫越多還是越少？',
          options: [{ t: '甲', why: '甲最重，同樣的熱量分給更多的鋁，升溫最少。' }, { t: '乙', why: '乙在中間。' }, { t: '丙', ok: true, why: 'H ＝ m × s × ΔT，H 和 s 一樣時，m 越小，ΔT 越大。' }, { t: '一樣', why: '質量不同，升溫就不同。' }] },
        { src: '改寫自 110 年會考',
          q: '用同樣的加熱器加熱<b>質量相同</b>的甲、乙兩種物質。甲升高 10 °C 要 2 分鐘，乙升高 10 °C 要 4 分鐘。乙的比熱是甲的幾倍？',
          hint: '加熱器一樣 → 加熱時間越長，吸收的熱量越多。',
          options: [{ t: '0.5 倍', why: '乙需要比較多熱量，比熱應該比較大。' }, { t: '1 倍', why: '時間不一樣，吸收的熱量就不一樣。' }, { t: '2 倍', ok: true, why: '乙吸收的熱量是甲的 2 倍才升高一樣的溫度，比熱就是 2 倍。' }, { t: '4 倍', why: '時間是 2 倍，不是 4 倍。' }] },
        { src: '基本題',
          q: '為什麼海邊的白天和晚上溫差，比沙漠小很多？',
          hint: '水的比熱大，代表什麼？',
          options: [{ t: '水的比熱大，吸熱、放熱時溫度都變化不大', ok: true, why: '白天水吸了很多熱卻升溫不多，晚上放熱也降溫不多。' }, { t: '海邊的太陽比較弱', why: '太陽是一樣的。' }, { t: '沙子的比熱比較大', why: '沙子的比熱比水小很多。' }] }
      ]
    });
  }

  U.run('5-2', ['先猜猜看：誰比較燙？', '動手玩：加熱比賽', '收成 4 句話'], { guess, play, know, exam });
})();
