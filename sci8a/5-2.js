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

  /* ---------------- 5 實戰 ---------------- */
  const tbl = html => c => c.appendChild(h(`<table class="sim-table" style="max-width:420px">${html}</table>`));
  const METAL = tbl('<thead><tr><th>金屬塊</th><th>甲</th><th>乙</th><th>丙</th><th>丁</th></tr></thead><tbody><tr><td>材質</td><td>鐵</td><td>鐵</td><td>鋁</td><td>鋁</td></tr><tr><td>初始溫度（°C）</td><td>80</td><td>60</td><td>80</td><td>60</td></tr><tr><td>質量（g）</td><td>100</td><td>200</td><td>100</td><td>200</td></tr><tr><td>比熱（cal／g·°C）</td><td>0.113</td><td>0.113</td><td>0.217</td><td>0.217</td></tr></tbody>');
  function real(p, api) {
    U.real(p, api, [
      { stars: 2, src: '110 年會考第 18 題',
        pic: tbl('<thead><tr><th>物體</th><th>質量（g）</th><th>上升溫度（°C）</th><th>加熱所需的時間（s）</th></tr></thead><tbody><tr><td>甲</td><td>100</td><td>20</td><td>120</td></tr><tr><td>乙</td><td>300</td><td>10</td><td>X</td></tr></tbody>'),
        q: '由相同材質組成的甲、乙兩物體，兩者均為固態，分別以相同的穩定熱源均勻加熱，其質量、上升溫度與加熱所需的時間如表所示。若甲、乙兩物體在加熱過程中，溫度均未達到熔點，熱源所提供的熱量均被兩者完全吸收，則表中的 X 應為多少？',
        options: [{ t: '60', why: '乙的質量是 3 倍、升溫是一半，需要的熱量是 1.5 倍，時間要更長。' }, { t: '120', why: '質量和升溫都不一樣，熱量不會剛好相同。' }, { t: '180', ok: true, why: '乙需要的熱量是甲的 1.5 倍，時間也是 1.5 倍：120 × 1.5 ＝ 180 秒。' }, { t: '360', why: '360 是只看質量 3 倍的結果，忘了乙只升高一半的溫度。' }],
        steps: [{ q: '熱源一樣，加熱時間越長代表……', options: [{ t: '吸收的熱量越多（時間和熱量成正比）', ok: true, why: '每秒給的熱量一樣。' }, { t: '比熱越小', why: '時間反映的是吸收了多少熱量。' }] },
          { q: '同材質（比熱相同），熱量 ∝ 質量 × 升溫。甲是 100 × 20 ＝ 2000，乙是 300 × 10 ＝ ?', options: [{ t: '3000', ok: true, why: '乙需要的熱量是甲的 3000 ÷ 2000 ＝ 1.5 倍。' }, { t: '2000', why: '300 × 10 ＝ 3000。' }] },
          { num: true, q: '熱量是 1.5 倍，時間也是 1.5 倍：X ＝ 120 × 1.5 ＝ ?', post: '秒', answer: 180, why: '180 秒。' }],
        explain: '<p>H ＝ m × s × ΔT，同材質 s 相同、熱源相同 → 時間 ∝ m × ΔT。甲：100 × 20 ＝ 2000；乙：300 × 10 ＝ 3000。2000 : 3000 ＝ 120 : X，X ＝ <b>180 秒</b>。</p>' },
      { stars: 2, src: '103 年會考題組', pic: METAL,
        q: '今取四個不同條件的金屬塊甲、乙、丙、丁，四者條件的資訊如表所示。四個金屬塊放置在室溫 20 °C 的環境下一段時間後，四者的溫度均降為 20 °C。甲、乙、丙、丁四個金屬塊由初始溫度降至 20 °C 時，何者所<b>散失的熱量最多</b>？',
        options: [{ t: '甲', why: '甲：100 × 0.113 × 60 ≈ 678 卡。' }, { t: '乙', why: '乙：200 × 0.113 × 40 ≈ 904 卡。' }, { t: '丙', why: '丙：100 × 0.217 × 60 ≈ 1302 卡。' }, { t: '丁', ok: true, why: '丁：200 × 0.217 × 40 ≈ 1736 卡，最多。' }],
        steps: [{ q: '散失的熱量用哪一條公式算？', options: [{ t: 'H ＝ 質量 × 比熱 × 溫度變化', ok: true, why: '降溫時放出的熱量也用這條。' }, { t: 'H ＝ 質量 × 溫度', why: '還要乘比熱，而且是溫度「變化」。' }] },
          { q: '甲從 80 °C 降到 20 °C，溫度變化是多少？乙從 60 °C 降到 20 °C 呢？', options: [{ t: '甲 60 °C、乙 40 °C', ok: true, why: '80－20＝60，60－20＝40。' }, { t: '甲 80 °C、乙 60 °C', why: '要算「變化」：初始溫度減掉 20。' }] },
          { num: true, q: '丁：200 × 0.217 × 40 ＝ ?（算到整數）', post: '卡', range: [1735, 1737], answer: 1736, hint: '200 × 40 ＝ 8000，8000 × 0.217 ＝ ?', why: '1736 卡，比甲、乙、丙都多。' }],
        explain: '<p>H ＝ m s ΔT：甲 678、乙 904、丙 1302、<b>丁 1736</b>（卡）。鋁的比熱大、丁的質量又大，雖然降溫只有 40 °C，放出的熱量還是最多。</p>' },
      { stars: 3, src: '106 年會考第 30 題',
        pic: tbl('<thead><tr><th>鋁塊</th><th>最初溫度（°C）</th><th>最後溫度（°C）</th></tr></thead><tbody><tr><td>甲</td><td>－10</td><td>50</td></tr><tr><td>乙</td><td>10</td><td>50</td></tr><tr><td>丙</td><td>30</td><td>50</td></tr></tbody>'),
        q: '在一大氣壓下，甲、乙、丙三鋁塊質量分別為 M甲、M乙、M丙，已知三者最初的溫度不同，<b>吸收相同熱量</b>後，到達相同的溫度，如表所示。若三鋁塊在升溫過程中均為固態且無熱量散失，則 M甲：M乙：M丙 為下列何者？',
        options: [{ t: '1：1：3', why: '甲升溫 60、乙 40、丙 20，質量要和升溫成反比。' }, { t: '1：2：3', why: '要用 1/60 : 1/40 : 1/20 來算。' }, { t: '2：3：6', ok: true, why: '1/60 : 1/40 : 1/20，同乘 120 → 2 : 3 : 6。' }, { t: '3：2：1', why: '這是升溫的比 60 : 40 : 20，質量要倒過來（反比）。' }],
        steps: [{ q: '三塊各升高了幾度？', options: [{ t: '甲 60、乙 40、丙 20', ok: true, why: '50－(－10)＝60，50－10＝40，50－30＝20。' }, { t: '甲 40、乙 40、丙 20', why: '50 －（－10）＝ 60，負負得正。' }] },
          { q: '熱量相同、比熱相同（都是鋁），質量和升溫是什麼關係？', options: [{ t: '反比：升溫越多，質量越小', ok: true, why: 'm × ΔT 要一樣。' }, { t: '正比', why: '同樣的熱量給比較輕的鋁塊，它升溫比較多。' }] },
          { q: '所以 M甲 : M乙 : M丙 ＝ 1/60 : 1/40 : 1/20，同乘 120 等於……', options: [{ t: '2 : 3 : 6', ok: true, why: '120/60 ＝ 2，120/40 ＝ 3，120/20 ＝ 6。' }, { t: '6 : 3 : 2', why: '120 ÷ 60 ＝ 2，不是 6。' }] }],
        explain: '<p>H ＝ m s ΔT，H 和 s 都相同 → m ∝ 1/ΔT。ΔT：甲 60、乙 40、丙 20 → m 比 ＝ 1/60 : 1/40 : 1/20 ＝ <b>2 : 3 : 6</b>。注意甲從 －10 °C 開始，升了 60 °C。</p>' }
    ]);
  }

  U.run('5-2', ['先猜猜看：誰比較燙？', '動手玩：加熱比賽', '收成 4 句話'], { guess, play, know, exam, real });
})();
