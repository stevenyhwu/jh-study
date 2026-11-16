/* ===== 理化 6-2 生活中常見的元素 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const E = {
    Fe: { n: '鐵', st: '固體', c: '#8a94a6', shiny: 1, cond: 1, hit: 'bend', metal: 1 },
    Cu: { n: '銅', st: '固體', c: '#d9824a', shiny: 1, cond: 1, hit: 'bend', metal: 1 },
    Al: { n: '鋁', st: '固體', c: '#c3ccd8', shiny: 1, cond: 1, hit: 'bend', metal: 1 },
    Hg: { n: '汞（水銀）', st: '液體', c: '#b8c0cc', shiny: 1, cond: 1, hit: 'liquid', metal: 1 },
    S: { n: '硫', st: '固體', c: '#f2d330', shiny: 0, cond: 0, hit: 'break', metal: 0 },
    C: { n: '碳（石墨）', st: '固體', c: '#444', shiny: 0, cond: 1, hit: 'break', metal: 0 },
    I: { n: '碘', st: '固體', c: '#4a3a5c', shiny: 0, cond: 0, hit: 'break', metal: 0 }
  };

  function testSim(host, on) {
    host.appendChild(h('<p class="sim-h">元素測試台：選一種元素，測導電、用鐵鎚敲敲看</p>'));
    let k = 'Fe', cond = false, hit = false; const done = {};
    U.chips(host, '元素', Object.keys(E).map(v => ({ v, t: E[v].n })), k, v => { k = v; cond = hit = false; draw(); });
    const sv = U.svg(host, '0 0 360 160', '', '元素測試台', 'sim');
    const read = h('<div class="sim-read"></div>');
    const row = h('<div class="row"><button type="button" class="btn">🔋 測導電</button><button type="button" class="btn">🔨 敲敲看</button></div>');
    row.children[0].addEventListener('click', () => { cond = true; mark(); });
    row.children[1].addEventListener('click', () => { hit = true; mark(); });
    host.append(row, read);
    function mark() { done[k] = done[k] || {}; if (cond) done[k].c = 1; if (hit) done[k].h = 1; draw(); on(); }
    function draw() {
      const e = E[k], lit = cond && e.cond;
      let s = `<path d="M30 40 H120 M240 40 H330 V130 H30 V40" fill="none" stroke="var(--stroke)" stroke-width="2"/><rect x="40" y="120" width="40" height="20" fill="var(--card)" ${ST}/><text x="60" y="134" text-anchor="middle" class="t12">電池</text>
        <circle cx="300" cy="130" r="14" fill="${lit ? '#ffe066' : 'var(--card)'}" ${ST}/>${lit ? '<text x="300" y="108" text-anchor="middle" class="t12b">💡 亮了</text>' : ''}`;
      const sample = e.hit === 'liquid' ? `<ellipse cx="180" cy="44" rx="56" ry="12" fill="${e.c}" ${ST}/>` :
        hit && e.hit === 'bend' ? `<path d="M120 36 Q180 58 240 36 V46 Q180 68 120 46Z" fill="${e.c}" ${ST}/>` :
        hit && e.hit === 'break' ? `<rect x="120" y="30" width="34" height="20" fill="${e.c}" ${ST} transform="rotate(-12 137 40)"/><rect x="164" y="34" width="30" height="18" fill="${e.c}" ${ST} transform="rotate(10 179 43)"/><rect x="204" y="30" width="36" height="20" fill="${e.c}" ${ST} transform="rotate(-6 222 40)"/>` :
        `<rect x="120" y="30" width="120" height="20" rx="3" fill="${e.c}" ${ST}/>`;
      s += sample + (e.shiny ? `<path d="M140 34 l10 0" stroke="#fff" stroke-width="3" opacity=".9"/>` : '') + `<text x="180" y="86" text-anchor="middle" class="t14b">${e.n}</text>`;
      sv.innerHTML = s;
      const res = [];
      res.push(`常溫：${e.st}`, e.shiny ? '有金屬光澤' : '沒有金屬光澤');
      if (cond) res.push(e.cond ? '<b>會導電</b>' : '<b>不導電</b>');
      if (hit) res.push(e.hit === 'bend' ? '<b>敲扁了沒碎</b>（有延展性）' : e.hit === 'break' ? '<b>一敲就碎</b>（很脆）' : '是液體，敲不到');
      read.innerHTML = res.join('　');
    }
    draw();
    return { full: ks => ks.every(x => done[x] && done[x].c && done[x].h), any: ks => ks.some(x => done[x] && (done[x].c || done[x].h)) };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '家裡的電線，裡面那一條會導電的芯，通常是用什麼做的？',
        options: [{ t: '銅', ok: true }, { t: '塑膠' }, { t: '木頭' }],
        reveal: '<b>銅</b>。外面包的塑膠是為了「不」導電，保護我們不觸電。' },
      { q: '鉛筆芯（石墨）是金屬嗎？它會導電嗎？',
        options: [{ t: '是金屬，會導電' }, { t: '不是金屬，但會導電', ok: true }, { t: '不是金屬，不會導電' }],
        reveal: '<b>不是金屬，卻會導電</b>！是個有名的例外。' }
    ]);
  }

  function play(p, api) {
    let A;
    const P = U.panes(p, 1);
    const tk = U.tasks(p, api, [
      { text: '把<b>鐵、銅、鋁</b>都「測導電」和「敲敲看」。', check: () => A.full(['Fe', 'Cu', 'Al']),
        qs: () => [{ q: '這三種金屬有什麼共同點？', options: [{ t: '有光澤、會導電、敲了會扁不會碎', ok: true, why: '金屬的共同特性：<b>金屬光澤、導電導熱、延展性</b>（可以敲成薄片、拉成細絲）。' }, { t: '一敲就碎', why: '敲敲看：它們是變扁還是碎掉？' }] }] },
      { text: '再測<b>硫</b>和<b>碘</b>。', check: () => A.full(['S', 'I']),
        qs: () => [{ q: '硫和碘跟金屬有什麼不同？', options: [{ t: '不導電、一敲就碎、沒有金屬光澤', ok: true, why: '這是<b>非金屬</b>的特性。' }, { t: '一樣會導電', why: '測導電時燈有亮嗎？' }] }] },
      { text: '最後測<b>石墨</b>和<b>汞</b>。', check: () => A.full(['C']) && A.any(['Hg']),
        qs: () => [{ q: '這兩個有什麼特別的地方？', options: [{ t: '石墨是非金屬卻會導電；汞是金屬卻是液體', ok: true, why: '兩個都是例外。汞是常溫下唯一的液態金屬，以前用來做溫度計。' }, { t: '兩個都是一般的金屬', why: '石墨敲了會碎，不是金屬。' }] }] }
    ]);
    A = testSim(P.list[0], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.card(p, '① 金屬的特性', '<p>有<b>金屬光澤</b>、容易<b>導電、導熱</b>、有<b>延展性</b>（敲成薄片、拉成細絲）。<br>常溫下大多是固體，只有<b>汞</b>是液體。</p>');
    U.card(p, '② 非金屬的特性', '<p>大多沒有光澤、<b>不容易導電導熱</b>，固體的非金屬<b>很脆</b>。<br>常溫下有固體（碳、硫、碘）、液體（溴）、氣體（氧、氮、氦）。<br>例外：<b>石墨</b>會導電。</p>');
    U.card(p, '③ 常見的金屬元素', `<table class="sim-table"><tbody><tr><td>鐵</td><td>便宜、堅固 → 建築、工具（容易生鏽）</td></tr><tr><td>銅</td><td>導電好 → 電線</td></tr>
      <tr><td>鋁</td><td>輕、不易鏽 → 飲料罐、鋁箔、飛機</td></tr><tr><td>金、銀</td><td>漂亮、不易起變化 → 飾品</td></tr></tbody></table>`);
    U.card(p, '④ 常見的非金屬元素', `<table class="sim-table"><tbody><tr><td>氧</td><td>呼吸、燃燒需要</td></tr><tr><td>氮</td><td>不活潑 → 食品包裝充氮</td></tr>
      <tr><td>氦</td><td>很輕又不會燃燒 → 氣球、飛船</td></tr><tr><td>碳</td><td>石墨（鉛筆芯）、鑽石，都是碳</td></tr><tr><td>氯</td><td>消毒自來水、游泳池</td></tr></tbody></table>`);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '鋁可以做成薄薄的鋁箔紙，是利用金屬的哪一種特性？', hint: '敲敲看時，金屬會怎樣？',
      options: [{ t: '延展性', ok: true, why: '延展性讓金屬可以壓成薄片、拉成細絲。' }, { t: '導電性', why: '鋁箔包食物用的不是導電。' }, { t: '金屬光澤', why: '光澤是亮亮的，和能不能變薄無關。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開元素測試台',
      bench: host => testSim(host, () => {}),
      qs: [
        { src: '改寫自 110 年會考',
          q: '小英依照「<b>會不會導電</b>」把元素分成兩組：鐵、銅、鋁、石墨一組；硫、碘一組。下列說法哪一個正確？',
          hint: '石墨是金屬嗎？',
          options: [{ t: '這樣分不能剛好分出金屬和非金屬，因為石墨是非金屬卻會導電', ok: true, why: '石墨是非金屬中的例外。' }, { t: '第一組全部都是金屬', why: '石墨是碳，是非金屬。' },
            { t: '第二組會導電', why: '硫和碘都不導電。' }, { t: '導電是化學性質', why: '導電不需要變成新物質，是物理性質。' }] },
        { src: '基本題', q: '以前的溫度計常用<b>汞</b>，主要是因為汞有什麼特性？', hint: '溫度計裡面要裝什麼狀態的東西？',
          options: [{ t: '是常溫下唯一的液態金屬，受熱膨脹均勻', ok: true, why: '溫度計需要液體，汞是液體又容易看清楚。（汞有毒，現在多改用酒精或電子溫度計）' }, { t: '汞很便宜', why: '主要原因是它在常溫下是液體。' }, { t: '汞是非金屬', why: '汞是金屬。' }] },
        { src: '基本題', q: '慶生的氣球裡常灌<b>氦氣</b>，而不是灌比它更輕的氫氣。為什麼？', hint: '想想 2-1 的氫氣測試：點火會怎樣？',
          options: [{ t: '氫氣會燃燒爆炸，氦氣不會燃燒，比較安全', ok: true, why: '氦是很穩定的惰性氣體，不會燃燒。' }, { t: '氦氣比氫氣輕', why: '氫氣其實比氦氣更輕。' }, { t: '氫氣有顏色', why: '兩種都是無色的。' }] }
      ]
    });
  }

  U.run('6-2', ['先猜猜看：誰會導電？', '動手玩：元素測試台', '收成 4 句話'], { guess, play, know, exam });
})();
