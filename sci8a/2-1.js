/* ===== 理化 2-1 認識物質 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const stateOf = T => T < 0 ? 0 : T <= 100 ? 1 : 2;
  const SN = ['固態（冰）', '液態（水）', '氣態（水蒸氣）'];
  const SD = ['粒子排得整整齊齊，只在原地抖動', '粒子靠在一起，但可以滑來滑去', '粒子離得很遠，到處亂飛'];

  /* ---------- 粒子模擬 ---------- */
  function particleSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">一盒水的粒子（放大好幾億倍）</p>'));
    const W = 360, H = 200, N = 36;
    const sv = U.svg(host, `0 0 ${W} ${H}`, '', '粒子模擬', 'sim');
    const read = h('<div class="sim-read"></div>');
    let T = -20; const seen = {};
    const ps = [];
    for (let i = 0; i < N; i++) ps.push({ gx: 111 + (i % 9) * 17, gy: 139 + Math.floor(i / 9) * 17, x: 0, y: 0, vx: 0, vy: 0 });
    ps.forEach(p => { p.x = p.gx; p.y = p.gy; });
    const kick = (p, v) => { const a = Math.random() * 6.283; p.vx = v * Math.cos(a); p.vy = v * Math.sin(a); };
    function setT(v) {
      const before = stateOf(T); T = v; const st = stateOf(T);
      if (st !== before) ps.forEach(p => kick(p, st === 2 ? 3 : 1));
      seen[st] = 1;
      read.innerHTML = `溫度 <b>${T} °C</b>　→　<b>${SN[st]}</b><br>${SD[st]}。　粒子數：<b>${N} 個</b>（一個都沒少，也沒變成別的）`;
      onChange();
    }
    U.slider(host, '溫度', { min: -20, max: 120, step: 5, value: T, fmt: v => v + ' °C' }, setT);
    host.appendChild(read);
    (function tick() {
      if (!sv.isConnected) return;
      if (sv.getClientRects().length) {
        const st = stateOf(T);
        let s = `<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="8" fill="var(--bg)" ${ST}/>`;
        ps.forEach(p => {
          if (st === 0) {
            const j = 0.8 + (T + 20) / 20 * 1.6;
            p.x = p.gx + (Math.random() - .5) * j; p.y = p.gy + (Math.random() - .5) * j;
          } else {
            const sp = st === 1 ? 0.6 + T / 100 * 0.9 : 3 + (T - 100) / 10;
            const v = Math.hypot(p.vx, p.vy) || 1;
            if (Math.random() < .08) kick(p, sp); else { p.vx *= sp / v; p.vy *= sp / v; }
            p.x += p.vx; p.y += p.vy;
            const top = st === 1 ? 138 : 14;
            if (st === 1 && p.y < top) { p.y += 2.5; p.vy = Math.abs(p.vy); }
            if (p.x < 14) { p.x = 14; p.vx = Math.abs(p.vx); } if (p.x > W - 14) { p.x = W - 14; p.vx = -Math.abs(p.vx); }
            if (p.y < top && st === 2) { p.y = top; p.vy = Math.abs(p.vy); } if (p.y > H - 14) { p.y = H - 14; p.vy = -Math.abs(p.vy); }
          }
          s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="6.5" fill="var(--water-line)" stroke="var(--stroke)" stroke-width="1"/>`;
        });
        sv.innerHTML = s;
      }
      requestAnimationFrame(tick);
    })();
    setT(T);
    return { all: () => seen[0] && seen[1] && seen[2] };
  }

  /* ---------- 兩瓶氣體 ---------- */
  function gasSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">兩瓶剛做好的氣體，哪一瓶是什麼？</p>'));
    const sv = U.svg(host, '0 0 360 200', '', '兩瓶氣體', 'sim');
    const done = { a: {}, b: {} };
    let cur = 'a';
    function bottle(x, k, title, sub) {
      const d = done[k];
      let s = `<path d="M${x + 28} 40 h34 v26 l22 26 v78 h-78 v-78 l22 -26 Z" fill="${d.lime ? (k === 'b' ? '#eef0f2' : 'var(--water)') : 'var(--card)'}" ${ST}/>
        <text x="${x + 45}" y="16" text-anchor="middle" class="t14b">${title}</text><text x="${x + 45}" y="31" text-anchor="middle" class="t12 mut">${sub}</text>`;
      if (d.lime) s += `<text x="${x + 45}" y="150" text-anchor="middle" class="t12b">${k === 'b' ? '變白色混濁' : '沒有變化'}</text>`;
      if (d.stick) {
        s += `<line x1="${x + 45}" y1="44" x2="${x + 45}" y2="112" stroke="#8a5a2b" stroke-width="3"/>`;
        s += k === 'a' ? `<path d="M${x + 45} 124 C${x + 31} 108 ${x + 41} 96 ${x + 45} 80 C${x + 51} 96 ${x + 60} 108 ${x + 45} 124Z" fill="#f6a54b" stroke="#d64545" stroke-width="1.5"/><text x="${x + 45}" y="190" text-anchor="middle" class="t12b" style="fill:var(--good)">線香燒得更旺 🔥</text>`
          : `<path d="M${x + 45} 110 q-8 -8 0 -16 q8 -8 0 -16" fill="none" stroke="var(--muted)" stroke-width="2"/><text x="${x + 45}" y="190" text-anchor="middle" class="t12b" style="fill:var(--bad)">線香熄滅了 💨</text>`;
      }
      if (cur === k) s += `<rect x="${x - 6}" y="2" width="102" height="194" rx="10" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 4"/>`;
      return s;
    }
    const draw = () => { sv.innerHTML = bottle(50, 'a', '甲瓶', '雙氧水＋二氧化錳') + bottle(220, 'b', '乙瓶', '大理石＋鹽酸'); };
    U.chips(host, '選一瓶', [{ v: 'a', t: '甲瓶' }, { v: 'b', t: '乙瓶' }], cur, v => { cur = v; draw(); });
    const row = h('<div class="row"><button type="button" class="btn">🔥 放入點燃的線香</button><button type="button" class="btn">🥛 倒入澄清石灰水</button></div>');
    row.children[0].addEventListener('click', () => { done[cur].stick = 1; draw(); onChange(); });
    row.children[1].addEventListener('click', () => { done[cur].lime = 1; draw(); onChange(); });
    host.appendChild(row); draw();
    return { all: () => done.a.stick && done.b.stick && done.a.lime && done.b.lime };
  }

  const CH = [
    { t: '🧊 冰塊融化成水', bin: 0, why: '還是水，只是從固體變液體。' },
    { t: '🔥 紙燒成灰', bin: 1, why: '紙變成灰和煙，是新的東西，變不回紙了。' },
    { t: '🔩 鐵釘生鏽', bin: 1, why: '鐵變成鐵鏽，是另一種物質。' },
    { t: '🍬 糖溶在水裡', bin: 0, why: '糖還在（喝起來是甜的），只是散開看不見。' },
    { t: '🔨 玻璃杯打破', bin: 0, why: '碎片還是玻璃，只有形狀變了。' },
    { t: '🥛 牛奶放到酸掉', bin: 1, why: '味道、氣味都變了，產生了新的物質。' },
    { t: '♨️ 水煮開變成水蒸氣', bin: 0, why: '還是水，只是變成氣體。' },
    { t: '🕯️ 蠟燭燃燒', bin: 1, why: '蠟燒掉變成二氧化碳和水蒸氣，是新的物質。' }
  ];

  function guess(p, api) {
    U.guess(p, api, [
      { q: '🧊 冰塊融化成水。冰和水，是<b>同一種東西</b>嗎？',
        options: [{ t: '是，只是樣子不同', ok: true }, { t: '不是，變成別的東西了' }],
        reveal: '<b>是同一種東西</b>，都是水。把水放回冷凍庫又會變回冰。' },
      { q: '🔥 一張紙燒成灰。紙和灰，是<b>同一種東西</b>嗎？',
        options: [{ t: '是，只是樣子不同' }, { t: '不是，變成別的東西了', ok: true }],
        reveal: '<b>不是</b>。灰再也變不回紙了。同樣是「變」，這兩種變法差在哪裡？下一步放大來看。' }
    ]);
  }

  function play(p, api) {
    let A, C, sorted = false;
    const tk = U.tasks(p, api, [
      { text: '拉「溫度」，從最冷一路拉到最熱，看粒子怎麼變。',
        setup() { a.hidden = false; b.hidden = c.hidden = true; },
        check: () => A.all(),
        qs: () => [{ q: '冰 → 水 → 水蒸氣，粒子本身有沒有變成別的東西？', hint: '看下面的字：粒子數有變嗎？',
            options: [{ t: '沒有，只是排列和動的方式不一樣', ok: true, why: '粒子還是同樣的 36 個。只是越熱動得越快、離得越遠。' }, { t: '有，變成三種不同的粒子', why: '再拉一次看看：粒子的樣子和數量有變嗎？' }] },
          { q: '哪一種狀態的粒子，彼此離得最遠、動得最快？',
            options: [{ t: '氣態', ok: true, why: '所以氣體可以被壓縮，也會自己散開充滿整個容器。' }, { t: '液態', why: '液態的粒子還靠在一起。' }, { t: '固態', why: '固態的粒子只在原地抖動。' }] }],
        found: '沒有產生新的東西，只是樣子改變，這種變化叫<b>物理變化</b>。' },
      { text: '下面每一張卡片：是<b>物理變化</b>（還是原來的東西），還是<b>化學變化</b>（變成新的東西）？', quiet: true,
        setup() { b.hidden = false; a.hidden = c.hidden = true; },
        check: () => sorted, found: '判斷的方法只有一個：<b>有沒有產生新的物質</b>。' },
      { text: '兩瓶氣體各做兩個測試：<b>放線香</b>、<b>倒石灰水</b>（兩瓶都要做）。',
        setup() { c.hidden = false; a.hidden = b.hidden = true; },
        check: () => C.all(),
        qs: () => [{ q: '甲瓶讓線香燒得更旺。甲瓶裡是什麼氣體？',
            options: [{ t: '氧氣', ok: true, why: '氧氣會<b>幫助燃燒</b>（助燃性）。雙氧水加二氧化錳會產生氧氣。' }, { t: '二氧化碳', why: '二氧化碳會讓火熄滅。' }, { t: '氮氣', why: '氮氣不會讓火燒得更旺。' }] },
          { q: '乙瓶讓線香熄滅、又讓澄清石灰水變混濁。乙瓶裡是什麼氣體？',
            options: [{ t: '二氧化碳', ok: true, why: '二氧化碳<b>不助燃</b>，而且會讓澄清石灰水變白色混濁。大理石加鹽酸會產生二氧化碳。' }, { t: '氧氣', why: '氧氣會讓火更旺，不會熄滅。' }] }] }
    ]);
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const a = h('<div></div>'), b = h('<div hidden></div>'), c = h('<div hidden></div>');
    card.append(a, b, c, tk.slot);
    A = particleSim(a, () => tk.check());
    U.sort(b, { bins: ['物理變化', '化學變化'], items: CH, onDone() { sorted = true; tk.check(); } });
    C = gasSim(c, () => tk.check());
    tk.start();
  }

  const dots = (x, y, cols, rows, gap, jit) => { let s = ''; for (let i = 0; i < cols * rows; i++) s += `<circle cx="${x + (i % cols) * gap + (jit ? (i * 37 % 7 - 3) * jit : 0)}" cy="${y + Math.floor(i / cols) * gap + (jit ? (i * 53 % 7 - 3) * jit : 0)}" r="4" fill="var(--water-line)" stroke="var(--stroke)" stroke-width=".8"/>`; return s; };
  function pie() {
    const arc = (a0, a1, c) => { const P = a => [80 + 60 * Math.sin(a * 6.2832), 75 - 60 * Math.cos(a * 6.2832)]; const [x0, y0] = P(a0), [x1, y1] = P(a1); return `<path d="M80 75 L${x0} ${y0} A60 60 0 ${a1 - a0 > .5 ? 1 : 0} 1 ${x1} ${y1}Z" fill="${c}" ${ST}/>`; };
    return arc(0, .78, '#8fb8ff') + arc(.78, .99, '#f3a3a3') + arc(.99, 1, '#ffd27a') +
      `<text x="92" y="100" text-anchor="middle" class="t14b">約 78%</text><text x="50" y="56" text-anchor="middle" class="t12b">約 21%</text>
       <rect x="170" y="30" width="14" height="14" fill="#8fb8ff" ${ST}/><rect x="170" y="60" width="14" height="14" fill="#f3a3a3" ${ST}/><rect x="170" y="90" width="14" height="14" fill="#ffd27a" ${ST}/>`;
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 5 句話。</p>'));
    U.svg(U.card(p, '① 固、液、氣：粒子沒變，只是排法和動法不同',
      '<p><b>固態</b>：排整齊、原地抖動 → 形狀固定。<br><b>液態</b>：靠在一起、可以滑動 → 會流動。<br><b>氣態</b>：離很遠、到處飛 → 會充滿容器。</p>'),
      '0 0 320 110', `<rect x="10" y="10" width="90" height="74" rx="6" fill="var(--bg)" ${ST}/>${dots(31, 40, 4, 3, 13)}<text x="55" y="102" text-anchor="middle" class="t12b">固態</text>
        <rect x="115" y="10" width="90" height="74" rx="6" fill="var(--bg)" ${ST}/>${dots(128, 50, 6, 2, 13, 1)}<text x="160" y="102" text-anchor="middle" class="t12b">液態</text>
        <rect x="220" y="10" width="90" height="74" rx="6" fill="var(--bg)" ${ST}/>${dots(236, 24, 3, 2, 30, 2.5)}<text x="265" y="102" text-anchor="middle" class="t12b">氣態</text>`, '三態的粒子');
    U.svg(U.card(p, '② 物理變化 vs 化學變化：有沒有產生新物質',
      '<p><b>物理變化</b>：還是原來的東西（融化、蒸發、溶解、打破）。<br><b>化學變化</b>：變成<b>新的物質</b>（燃燒、生鏽、腐敗）。</p>'),
      '0 0 320 110', `<text x="50" y="34" text-anchor="middle" font-size="24">🧊</text><text x="100" y="34" text-anchor="middle" class="t14b">→</text><text x="150" y="34" text-anchor="middle" font-size="24">💧</text><text x="240" y="32" text-anchor="middle" class="t12b">都是水：物理變化</text>
        <text x="50" y="86" text-anchor="middle" font-size="24">📄</text><text x="100" y="86" text-anchor="middle" class="t14b">→</text><text x="150" y="86" text-anchor="middle" font-size="24">🔥</text><text x="240" y="84" text-anchor="middle" class="t12b">變成灰：化學變化</text>`, '冰變水與紙燒成灰');
    U.svg(U.card(p, '③ 純物質只有一種東西，混合物是混在一起的',
      '<p><b>純物質</b>（純水、氧氣、鐵）：熔點、沸點是<b>固定</b>的。純水一定在 100 °C 沸騰。<br><b>混合物</b>（空氣、糖水、海水）：好幾種東西混在一起，沸點<b>不固定</b>。</p>'),
      '0 0 320 150', `<line x1="40" y1="10" x2="40" y2="120" class="g-axis"/><line x1="40" y1="120" x2="300" y2="120" class="g-axis"/>
        <path d="M40 110 L120 50 L290 50" fill="none" stroke="var(--accent)" stroke-width="3"/><path d="M40 110 L120 46 L290 22" fill="none" stroke="#d9824a" stroke-width="3" stroke-dasharray="6 4"/>
        <text x="36" y="54" text-anchor="end" class="g-num">100</text><text x="296" y="68" text-anchor="end" class="t12b" style="fill:var(--accent)">純水：停在 100 °C</text><text x="296" y="16" text-anchor="end" class="t12b" style="fill:#d9824a">糖水：一直往上</text>
        <text x="300" y="138" text-anchor="end" class="g-lab">加熱時間</text><text x="4" y="12" class="g-lab">溫度</text>`, '純水和糖水加熱的溫度變化');
    U.svg(U.card(p, '④ 空氣是混合物：氮最多，氧第二',
      '<p>氮氣約 <b>78%</b>：很不活潑，不可燃也不助燃，常用來填充食品包裝。<br>氧氣約 <b>21%</b>：呼吸要用，會助燃。<br>剩下 1%：氬、二氧化碳等。</p>'),
      '0 0 320 150', pie() + '<text x="190" y="42" class="t12b">氮氣</text><text x="190" y="72" class="t12b">氧氣</text><text x="190" y="102" class="t12b">其他（氬、二氧化碳…）</text>', '空氣的組成');
    U.svg(U.card(p, '⑤ 氧氣助燃；二氧化碳滅火、讓石灰水混濁',
      '<p><b>氧氣</b>：雙氧水＋二氧化錳。難溶於水 → 用<b>排水集氣法</b>收集。<br><b>二氧化碳</b>：大理石＋鹽酸。比空氣重、不助燃；使<b>澄清石灰水變混濁</b>。</p><p class="small muted">二氧化錳只是讓反應變快（催化劑），自己不會被用掉。</p>'),
      '0 0 320 110', `<text x="80" y="40" text-anchor="middle" font-size="26">🔥</text><text x="80" y="70" text-anchor="middle" class="t14b">氧氣</text><text x="80" y="90" text-anchor="middle" class="t12">火更旺</text>
        <text x="240" y="40" text-anchor="middle" font-size="26">💨</text><text x="240" y="70" text-anchor="middle" class="t14b">二氧化碳</text><text x="240" y="90" text-anchor="middle" class="t12">火熄滅、石灰水變濁</text>`, '氧氣與二氧化碳');
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '🍬 把糖放進水裡攪一攪，糖「不見了」。這是哪一種變化？', hint: '喝一口，還是甜的嗎？糖有變成別的東西嗎？',
      options: [{ t: '物理變化', ok: true, why: '糖還在，只是散開成很小的粒子看不見。把水蒸乾，糖又會跑出來。' }, { t: '化學變化', why: '糖水還是甜的，表示糖沒有變成別的東西。' }],
      onDone() { api.done(); } });
  }

  function exam(p, api) {
    const tube = (x, name, rise) => `<rect x="${x}" y="30" width="26" height="110" rx="12" fill="var(--card)" ${ST}/><rect x="${x + 1}" y="${140 - rise}" width="24" height="${rise}" fill="var(--water)"/>
      <text x="${x + 13}" y="22" text-anchor="middle" class="t14b">${name}</text>`;
    U.exam(p, api, {
      benchLabel: '想試試看？打開兩瓶氣體的實驗',
      bench: host => gasSim(host, () => {}),
      qs: [
        { src: '改寫自 106 年會考',
          pic: c => U.svg(c, '0 0 320 100', `<rect x="20" y="22" width="50" height="34" rx="3" fill="#d9824a" ${ST}/><text x="90" y="44" class="t14b">→</text><rect x="112" y="34" width="80" height="10" rx="2" fill="#d9824a" ${ST}/><text x="100" y="78" text-anchor="middle" class="t12b">甲：用鐵鎚敲成薄片</text>
            <rect x="214" y="22" width="34" height="34" rx="3" fill="#d9824a" ${ST}/><text x="258" y="44" class="t14b">→</text><rect x="276" y="22" width="34" height="34" rx="3" fill="#3a2a22" ${ST}/><text x="262" y="78" text-anchor="middle" class="t12b">乙：加熱後表面變黑</text>`, '銅塊的兩種操作'),
          q: '對兩塊銅塊分別做兩種操作：<b>甲</b>是用鐵鎚敲成薄片，<b>乙</b>是用火加熱到表面變成黑色。哪一種操作造成的改變是<b>化學變化</b>？',
          hint: '有沒有產生「新的物質」？薄片還是銅嗎？黑色的那層還是銅嗎？',
          options: [{ t: '兩種都是', why: '敲扁的銅還是銅，只是形狀變了。' }, { t: '兩種都不是', why: '加熱後表面的黑色物質已經不是銅了（是氧化銅）。' }, { t: '只有甲是', why: '敲扁只是形狀改變，是物理變化。' },
            { t: '只有乙是', ok: true, why: '甲只有形狀變 → 物理變化。乙的銅和氧氣結合變成黑色的新物質 → 化學變化。' }] },
        { src: '改寫自 103 年會考',
          pic: c => U.svg(c, '0 0 320 150', pie() + '<text x="190" y="42" class="t12b">甲</text><text x="190" y="72" class="t12b">乙</text><text x="190" y="102" class="t12b">其他氣體</text>', '空氣組成圓餅圖'),
          q: '上圖是地表附近空氣的組成。關於占最多的<b>甲</b>氣體，哪一個說明正確？',
          hint: '空氣裡最多的是哪一種氣體？大約 78%。',
          options: [{ t: '有助燃性，是動植物呼吸需要的氣體', why: '這是氧氣，它只占約 21%，是圖中的乙。' },
            { t: '不可燃也不助燃，常用來填充食品包裝', ok: true, why: '甲是氮氣。它很不活潑，充在包裝裡可以避免食物變質。' },
            { t: '會讓澄清石灰水變混濁', why: '這是二氧化碳，在空氣中只有一點點。' }, { t: '是由好幾種氣體混合成的', why: '甲是單獨一種氣體（氮氣）。「其他氣體」那一小塊才是好幾種混在一起。' }] },
        { src: '挑戰題・改寫自 107 年會考',
          pic: c => U.svg(c, '0 0 320 170', `<rect x="20" y="118" width="280" height="40" fill="var(--water)"/><path d="M20 100 V158 H300 V100" fill="none" ${ST}/>` + tube(60, '甲', 90) + tube(147, '乙', 45) + tube(234, '丙', 4), '三支倒插在水裡的試管，水上升的高度不同'),
          q: '三支試管原本分別裝滿甲、乙、丙三種氣體，倒插進水裡一段時間後，水跑進試管的高度如圖（甲最多、丙幾乎沒有）。哪一個判斷正確？',
          hint: '氣體溶到水裡，試管裡的氣體變少，水就會跑進來。用排水集氣法時，我們希望氣體「不要」溶到水裡。',
          options: [
            { t: '溶解度：甲＞乙＞丙；甲最適合用排水集氣法', why: '前半對了。但甲很容易溶到水裡，用排水法會收集不到。' },
            { t: '溶解度：甲＞乙＞丙；丙最適合用排水集氣法', ok: true, why: '水進去越多，表示氣體溶掉越多。丙幾乎不溶於水，最適合排水集氣（氧氣就是這樣收集的）。' },
            { t: '溶解度：甲＜乙＜丙；甲最適合用排水集氣法', why: '甲的試管進水最多，代表甲溶掉最多。' },
            { t: '溶解度：甲＜乙＜丙；丙最適合用排水集氣法', why: '後半對了，但溶解度的順序反了：進水最多的甲溶解度最大。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  function airPic(c) {
    U.svg(c, '0 0 320 150', pie() + '<text x="190" y="42" class="t12b">氮氣 78.1%</text><text x="190" y="72" class="t12b">氧氣 20.9%</text><text x="190" y="102" class="t12b">氬氣 0.9%</text><text x="190" y="124" class="t12b">其他 0.1%</text>', '乾燥空氣的組成').style.maxWidth = '340px';
  }
  function cyclePic(c) {
    U.svg(c, '0 0 340 110', `<text x="40" y="40" text-anchor="middle" class="t14b">X（甲）</text><text x="170" y="40" text-anchor="middle" class="t14b">X（乙）</text><text x="300" y="40" text-anchor="middle" class="t14b">X（丙）</text>
      <path d="M78 34 H128" stroke="var(--stroke)" stroke-width="1.5" marker-end="url(#a21)"/><text x="103" y="26" text-anchor="middle" class="t12">升溫</text>
      <path d="M208 34 H258" stroke="var(--stroke)" stroke-width="1.5" marker-end="url(#a21)"/><text x="233" y="26" text-anchor="middle" class="t12">降溫</text>
      <path d="M300 48 V80 H40 V52" fill="none" stroke="var(--stroke)" stroke-width="1.5" marker-end="url(#a21)"/><text x="170" y="98" text-anchor="middle" class="t12">升溫</text>
      <defs><marker id="a21" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="var(--stroke)"/></marker></defs>`, '純物質 X 的三種狀態變化').style.maxWidth = '360px';
  }
  function tubesPic(c) {
    const tube = (x, name, rise) => `<rect x="${x}" y="30" width="26" height="110" rx="12" fill="var(--card)" stroke="var(--stroke)" stroke-width="1.5"/><rect x="${x + 1}" y="${140 - rise}" width="24" height="${rise}" fill="var(--water)"/><text x="${x + 13}" y="22" text-anchor="middle" class="t14b">${name}</text>`;
    U.svg(c, '0 0 320 170', `<rect x="20" y="118" width="280" height="40" fill="var(--water)"/><path d="M20 100 V158 H300 V100" fill="none" stroke="var(--stroke)" stroke-width="1.5"/>` + tube(60, '甲', 90) + tube(147, '乙', 45) + tube(234, '丙', 4), '三支倒插試管').style.maxWidth = '320px';
    c.appendChild(h('<table class="sim-table" style="max-width:380px"><thead><tr><th>學生</th><th>溶解度（mL／100 mL 水）</th><th>使用排水集氣法</th></tr></thead><tbody><tr><td>阿文</td><td>甲＞乙＞丙</td><td>甲最適用</td></tr><tr><td>阿明</td><td>甲＞乙＞丙</td><td>丙最適用</td></tr><tr><td>小薰</td><td>甲＜乙＜丙</td><td>甲最適用</td></tr><tr><td>小玉</td><td>甲＜乙＜丙</td><td>丙最適用</td></tr></tbody></table>'));
  }
  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '108 年會考第 10 題', pic: airPic,
        q: '圖為地球地表附近乾燥空氣的組成百分率圖，此圖中，所有能與<b>點燃的線香</b>發生化學反應的氣體百分率之總和，約為多少？',
        options: [{ t: '20.9%', ok: true, why: '能讓線香繼續燃燒（助燃）的只有氧氣，約 20.9%。' }, { t: '21.8%', why: '21.8% 是氧＋氬，但氬是惰性氣體，不和線香反應。' }, { t: '78.1%', why: '那是氮氣，不可燃也不助燃。' }, { t: '79.0%', why: '那是氮＋氬，兩者都不和線香反應。' }],
        steps: [{ q: '點燃的線香要燒得起來，需要哪一種氣體？', options: [{ t: '氧氣（助燃）', ok: true, why: '燃燒需要氧氣。' }, { t: '氮氣', why: '氮氣不助燃。' }] },
          { q: '空氣中氧氣大約占多少？', options: [{ t: '20.9%', ok: true, why: '看圖。' }, { t: '78.1%', why: '那是氮氣。' }] }],
        explain: '<p>燃燒是和<b>氧氣</b>的化學反應。氮氣不可燃也不助燃，氬氣是惰性氣體。所以只有氧氣約 <b>20.9%</b>。</p>' },
      { stars: 2, src: '111 年會考第 9 題',
        q: '製作蛋糕時，常會在白色的鮮奶油中加入些許色素混合，使其顏色變化增加美觀，而鮮奶油仍維持原本的性質。做好的蛋糕需妥善冷藏，以防止鮮奶油腐壞變質。關於上述鮮奶油「變色」和鮮奶油「變質」兩者的說明，下列何者最合理？',
        options: [{ t: '兩者都是化學變化', why: '加色素只是混在一起，鮮奶油的性質沒變。' }, { t: '兩者都不是化學變化', why: '腐壞變質產生了新的物質（味道、氣味都變了）。' }, { t: '只有後者是化學變化', ok: true, why: '變色是混合（物理變化）；變質產生新物質（化學變化）。' }, { t: '只有前者是化學變化', why: '剛好反了。' }],
        steps: [{ q: '加色素後，題目說鮮奶油「仍維持原本的性質」。有產生新物質嗎？', options: [{ t: '沒有，是物理變化', ok: true, why: '只是混在一起。' }, { t: '有', why: '題目說性質沒變。' }] },
          { q: '鮮奶油腐壞變質呢？', options: [{ t: '產生新物質，是化學變化', ok: true, why: '和牛奶放到酸掉一樣。' }, { t: '只是顏色改變，是物理變化', why: '腐壞會變味、變臭，是新物質。' }] }],
        explain: '<p>判斷依據：<b>有沒有產生新物質</b>。加色素只是混合（物理變化）；腐壞產生新物質（化學變化）。</p>' },
      { stars: 2, src: '105 年會考第 11 題', pic: cyclePic,
        q: '在固定壓力改變溫度的實驗中，測得純物質 X 的甲、乙、丙三種不同狀態，如圖所示。甲、乙、丙分別為物質三態中的哪一種？',
        options: [{ t: '甲：固態，乙：液態，丙：氣態', why: '那從丙（氣態）升溫會變回甲（固態）嗎？升溫不會讓氣體變固體。' }, { t: '甲：固態，乙：氣態，丙：液態', why: '丙（液態）升溫應該變成氣態，不會變回固態。' },
          { t: '甲：液態，乙：固態，丙：氣態', why: '甲（液態）升溫不會變成固態。' }, { t: '甲：液態，乙：氣態，丙：固態', ok: true, why: '液態升溫→氣態；氣態降溫→固態；固態升溫→液態，全部說得通。' }],
        steps: [{ q: '物質「升溫」時，狀態通常怎麼變？', options: [{ t: '固→液→氣（粒子越動越快）', ok: true, why: '升溫往「氣」的方向走。' }, { t: '氣→液→固', why: '那是降溫。' }] },
          { q: '丙「升溫」變成甲，甲「升溫」變成乙。所以三個中誰最「冷」的狀態？', options: [{ t: '丙（固態）', ok: true, why: '丙 → 甲 → 乙 都是升溫，所以丙固、甲液、乙氣。' }, { t: '乙', why: '乙要「降溫」才變成丙，乙是最熱的。' }] }],
        explain: '<p>升溫：固 → 液 → 氣。丙升溫變甲、甲升溫變乙 → <b>丙固態、甲液態、乙氣態</b>；乙降溫直接變丙（氣→固，凝華）也合理。</p>' },
      { stars: 3, src: '107 年會考第 23 題', pic: tubesPic,
        q: '實驗課時，阿文一組四人取分別充滿 1 大氣壓甲、乙、丙氣體的三支試管，倒插入盛有 100 mL 水的相同燒杯中，拔開橡皮塞，經一段時間後觀察試管的情況，如圖所示。若不考慮水的蒸發，則表內四人對於甲、乙、丙三種氣體在水中溶解度的比較，與收集氣體方法的判斷，何者正確？',
        options: [{ t: '阿文', why: '溶解度比較對了；但甲最容易溶於水，不適合排水集氣。' }, { t: '阿明', ok: true, why: '水進去越多代表氣體溶得越多：甲＞乙＞丙；丙幾乎不溶，最適合排水集氣。' }, { t: '小薰', why: '溶解度順序反了。' }, { t: '小玉', why: '後半對，但溶解度順序反了。' }],
        steps: [{ q: '試管裡的水上升得越高，代表什麼？', options: [{ t: '氣體溶到水裡越多（溶解度大）', ok: true, why: '氣體變少，水就被壓進來。' }, { t: '氣體越重', why: '和輕重無關，是氣體溶掉了。' }] },
          { q: '排水集氣法適合收集哪一種氣體？', options: [{ t: '難溶於水的', ok: true, why: '不然氣體會溶到水裡，收集不到。' }, { t: '易溶於水的', why: '易溶的氣體會溶掉。' }] }],
        explain: '<p>上升高度：甲＞乙＞丙 → 溶解度 <b>甲＞乙＞丙</b>。排水集氣要用<b>難溶於水</b>的氣體 → 丙最適用。選阿明。</p>' }
    ]);
  }

  document.addEventListener('DOMContentLoaded', () => {
    U.mount(document.getElementById('unit'), { unit: 'sci8a-2-1', home: 'index.html', steps: [
      { id: 'guess', label: '猜', title: '先猜猜看：還是同一種東西嗎？', render: guess },
      { id: 'play', label: '玩', title: '動手玩：粒子、變化、氣體', render: play },
      { id: 'know', label: '懂', title: '收成 5 句話', render: know },
      { id: 'exam', label: '考', title: '會考真的這樣考', render: exam },
      { id: 'real', label: '實戰', title: '會考實戰：照原題做做看', render: real }
    ] });
  });
})();
