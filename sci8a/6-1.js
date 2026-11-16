/* ===== 理化 6-1 元素與化合物 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const A = { r: '#e53935', w: '#f5f5f5', b: '#333', u: '#1e88e5' };
  // 粒子圖：mols = [[顏色, 顏色...], ...]，每個分子排成一串
  function box(mols) {
    let s = '<svg viewBox="0 0 120 80" width="150" height="100" style="display:block;margin:0 auto"><rect x="2" y="2" width="116" height="76" rx="6" fill="var(--bg)" stroke="var(--stroke)"/>';
    mols.forEach((m, i) => { const x = 18 + (i % 4) * 27, y = 22 + Math.floor(i / 4) * 34; m.forEach((c, j) => { s += `<circle cx="${x + j * 8}" cy="${y + (j % 2) * 3}" r="6" fill="${A[c]}" stroke="#555" stroke-width="1"/>`; }); });
    return s + '</svg>';
  }
  const rep = (m, n) => Array.from({ length: n }, () => m);

  function electroSim(host, on) {
    host.appendChild(h('<p class="sim-h">電解水：在水裡通電，兩支試管收集產生的氣體</p>'));
    const sv = U.svg(host, '0 0 360 200', '', '電解水', 'sim');
    const read = h('<div class="sim-read">按「通電」。</div>');
    let start = 0, test = {}; const seen = {};
    const row = h('<div class="row"><button type="button" class="btn primary">⚡ 通電</button><button type="button" class="btn">🔥 點火測負極的氣體</button><button type="button" class="btn">🪵 線香測正極的氣體</button></div>');
    row.children[0].addEventListener('click', () => { start = performance.now(); test = {}; });
    row.children[1].addEventListener('click', () => { if (seen.run) { test.h = 1; seen.th = 1; read.innerHTML = '負極的氣體一點火就「啵」一聲燒起來，管壁出現小水珠 → 是<b>氫氣</b>。'; on(); } });
    row.children[2].addEventListener('click', () => { if (seen.run) { test.o = 1; seen.to = 1; read.innerHTML = '正極的氣體讓線香燒得更旺 → 是<b>氧氣</b>。'; on(); } });
    host.append(row, read);
    U.anim(sv, () => {
      const f = start ? Math.min(1, (performance.now() - start) / 4000) : 0, gh = 100 * f, go = 50 * f;
      let s = `<rect x="60" y="130" width="240" height="60" fill="var(--water)"/><path d="M60 120 V190 H300 V120" fill="none" ${ST}/>
        <rect x="110" y="20" width="30" height="150" rx="6" fill="var(--water)" ${ST}/><rect x="220" y="20" width="30" height="150" rx="6" fill="var(--water)" ${ST}/>
        <rect x="111" y="21" width="28" height="${gh}" fill="var(--bg)"/><rect x="221" y="21" width="28" height="${go}" fill="var(--bg)"/>
        <text x="125" y="190" text-anchor="middle" class="t12b">負極（−）</text><text x="235" y="190" text-anchor="middle" class="t12b">正極（＋）</text>`;
      if (start) s += `<text x="80" y="${30 + gh / 2}" text-anchor="end" class="t12b">${Math.round(20 * f)} mL</text><text x="290" y="${30 + go / 2}" class="t12b">${Math.round(10 * f)} mL</text>`;
      if (test.h) s += `<text x="125" y="14" text-anchor="middle" font-size="14">💥 氫氣</text>`;
      if (test.o) s += `<text x="235" y="14" text-anchor="middle" font-size="14">🔥 氧氣</text>`;
      if (f >= 1 && !seen.run) { seen.run = 1; read.innerHTML = '負極收集到 <b>20 mL</b>，正極 <b>10 mL</b>。接著測試看看是什麼氣體。'; on(); }
      sv.innerHTML = s;
    });
    return { seen };
  }

  const PIC = [
    { t: box(rep(['r', 'r'], 6)), bin: 0, why: '只有一種原子（兩兩一組），例如氧氣 O₂。' },
    { t: box(rep(['r', 'w', 'w'], 6)), bin: 1, why: '每個分子都一樣，由兩種原子組成，例如水 H₂O。' },
    { t: box([['r', 'r'], ['u', 'u'], ['r', 'r'], ['u', 'u'], ['u', 'u'], ['u', 'u']]), bin: 2, why: '有兩種不同的分子混在一起，例如空氣（氧氣＋氮氣）。' },
    { t: box(rep(['b'], 8)), bin: 0, why: '只有一種原子，例如鐵、銅這些金屬。' },
    { t: box(rep(['b', 'r', 'r'], 6)), bin: 1, why: '分子都一樣，由兩種原子組成，例如二氧化碳 CO₂。' },
    { t: box([['r', 'w', 'w'], ['b', 'r', 'r'], ['r', 'w', 'w'], ['r', 'w', 'w'], ['b', 'r', 'r'], ['r', 'w', 'w']]), bin: 2, why: '有兩種不同的分子（水和二氧化碳）混在一起，例如汽水。' }
  ].map(o => Object.assign(o, { hint: '先看：裡面的分子都長一樣嗎？一樣的話，再看一個分子裡有幾種顏色的原子。' }));

  function guess(p, api) {
    U.guess(p, api, [
      { q: '水（H₂O）可以再分解成更簡單的東西嗎？',
        options: [{ t: '可以，分解成氫氣和氧氣', ok: true }, { t: '不行，水已經是最簡單的了' }],
        reveal: '<b>可以</b>！通電就能把水拆成氫氣和氧氣。' },
      { q: '那氧氣還能再分解成更簡單的東西嗎？',
        options: [{ t: '可以' }, { t: '不行', ok: true }],
        reveal: '<b>不行</b>。氧是一種「元素」，用一般的化學方法沒辦法再分。' }
    ]);
  }

  function play(p, api) {
    let E, sorted = false;
    const P = U.panes(p, 2);
    const tk = U.tasks(p, api, [
      { text: '電解水：按「通電」，等氣體收集好。', setup() { P.show(0); }, check: () => E.seen.run,
        qs: () => [{ q: '負極和正極收集到的氣體體積比大約是多少？', options: [{ t: '2 : 1', ok: true, why: '負極 20 mL、正極 10 mL。' }, { t: '1 : 1', why: '看兩支試管的數字。' }, { t: '1 : 2', why: '負極比較多喔。' }] }] },
      { text: '兩支試管都測一測：<b>點火</b>和<b>線香</b>。', check: () => E.seen.th && E.seen.to,
        qs: () => [{ q: '這個實驗說明了什麼？', options: [{ t: '水是化合物，可以分解成氫和氧兩種元素', ok: true, why: '水由氫、氧兩種元素組成，體積比 2 : 1，所以化學式寫 H₂O。' }, { t: '水是元素', why: '元素不能再分解，但水被分解了。' }, { t: '水是氫氣和氧氣的混合物', why: '水的性質和氫氣、氧氣完全不同，是化合物，不是混在一起。' }] }] },
      { text: '看粒子圖分類：每一張是<b>元素</b>、<b>化合物</b>，還是<b>混合物</b>？', setup() { P.show(1); }, quiet: true, check: () => sorted,
        found: '判斷順序：<b>①分子都一樣嗎？</b>不一樣 → 混合物。<b>②一樣的話，有幾種原子？</b>一種 → 元素；兩種以上 → 化合物。' }
    ]);
    E = electroSim(P.list[0], () => tk.check());
    U.sort(P.list[1], { bins: ['元素', '化合物', '混合物'], items: PIC, onDone() { sorted = true; tk.check(); } });
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    const pic = (c, m) => c.insertAdjacentHTML('beforeend', box(m));
    pic(U.card(p, '① 元素：只有一種原子，不能再分解', '<p>例如氧（O）、氫（H）、碳（C）、鐵（Fe）、銅（Cu）。目前已知的元素有一百多種。</p>'), rep(['r', 'r'], 6));
    pic(U.card(p, '② 化合物：兩種以上元素，以固定比例結合', '<p>例如水 H₂O（氫：氧＝2：1）、二氧化碳 CO₂、食鹽。<br>化合物可以用化學方法（例如電解）分解，性質和組成它的元素完全不同。</p>'), rep(['r', 'w', 'w'], 6));
    pic(U.card(p, '③ 混合物：好幾種物質混在一起', '<p>例如空氣、海水、汽水。每種物質還保有自己的性質，比例可以改變。<br><b>元素和化合物</b>合稱<b>純物質</b>。</p>'), [['r', 'r'], ['u', 'u'], ['r', 'r'], ['u', 'u'], ['u', 'u'], ['u', 'u']]);
    U.card(p, '④ 元素符號', `<p>用拉丁文名稱的字母表示：第一個字母<b>大寫</b>，第二個<b>小寫</b>。</p>
      <table class="sim-table" style="max-width:380px"><tbody><tr><td>H 氫</td><td>He 氦</td><td>C 碳</td><td>N 氮</td><td>O 氧</td></tr><tr><td>Na 鈉</td><td>Mg 鎂</td><td>Al 鋁</td><td>S 硫</td><td>Cl 氯</td></tr><tr><td>Ca 鈣</td><td>Fe 鐵</td><td>Cu 銅</td><td>Ag 銀</td><td>Au 金</td></tr></tbody></table>`);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '二氧化碳（CO₂）是元素、化合物，還是混合物？', hint: '它由幾種元素組成？',
      options: [{ t: '化合物', ok: true, why: '由碳和氧兩種元素組成。' }, { t: '元素', why: '元素只有一種原子，CO₂ 有兩種。' }, { t: '混合物', why: '每個 CO₂ 分子都一樣，是純物質。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開電解水',
      bench: host => electroSim(host, () => {}),
      qs: [
        { src: '改寫自 114 年會考',
          q: '小志舉例：元素 → 氧氣；化合物 → 水；混合物 → 空氣。這三個例子中，所含<b>原子種類</b>的多寡，哪一個排列正確？',
          hint: '氧氣有幾種原子？水呢？空氣裡有氮氣、氧氣、二氧化碳、水氣……',
          options: [{ t: '空氣 ＞ 水 ＞ 氧氣', ok: true, why: '氧氣只有 O；水有 H、O；空氣裡有 N、O、C、H、Ar 等很多種。' }, { t: '水 ＞ 空氣 ＞ 氧氣', why: '空氣是很多種氣體混合的，原子種類更多。' },
            { t: '氧氣 ＞ 水 ＞ 空氣', why: '氧氣只有一種原子，最少。' }, { t: '三個一樣多', why: '數數看每一個有幾種原子。' }] },
        { src: '改寫自 107 年會考',
          pic: c => U.svg(c, '0 0 320 150', `<rect x="10" y="10" width="300" height="130" rx="10" fill="var(--bg)" ${ST}/><text x="22" y="30" class="t12b">純物質</text>
            <rect x="120" y="26" width="180" height="104" rx="10" fill="var(--line)" ${ST}/><text x="132" y="46" class="t12b">？（灰色）</text>
            <rect x="180" y="62" width="110" height="56" rx="10" fill="var(--card)" ${ST}/><text x="235" y="94" text-anchor="middle" class="t12b">氧化物</text><text x="60" y="90" text-anchor="middle" class="t12">元素</text>`, '純物質包含灰色區域，灰色區域包含氧化物'),
          q: '小瑞依物質的組成畫了分類圖：被包住的，也屬於外面那一類。例如「氧化物」也是純物質。灰色的那一類最可能是什麼？',
          hint: '氧化物（例如 CO₂、H₂O）由幾種元素組成？',
          options: [{ t: '元素', why: '氧化物有兩種元素，不屬於元素。' }, { t: '化合物', ok: true, why: '氧化物是含氧的化合物；化合物又屬於純物質。' }, { t: '混合物', why: '混合物不在純物質裡面。' }] },
        { src: '基本題',
          q: '下列哪一個是<b>元素</b>？', hint: '只有一種原子。',
          options: [{ t: '氧氣', ok: true, why: '只由氧原子組成。' }, { t: '水', why: '水由氫和氧組成，是化合物。' }, { t: '食鹽水', why: '食鹽和水混在一起，是混合物。' }, { t: '二氧化碳', why: '由碳和氧組成，是化合物。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  const cardsOpt = (e, c) => `<span style="display:inline-flex;gap:8px;vertical-align:middle"><span style="border:1px solid var(--line);border-radius:6px;padding:2px 8px">元素：${e}</span><span style="border:1px solid var(--line);border-radius:6px;padding:2px 8px">化合物：${c}</span></span>`;
  function nestPic(c) {
    U.svg(c, '0 0 320 150', `<rect x="10" y="10" width="300" height="130" rx="10" fill="var(--bg)" stroke="var(--stroke)" stroke-width="1.5"/><text x="22" y="30" class="t12b">純物質</text>
      <rect x="120" y="26" width="180" height="104" rx="10" fill="var(--line)" stroke="var(--stroke)" stroke-width="1.5"/>
      <rect x="180" y="62" width="110" height="56" rx="10" fill="var(--card)" stroke="var(--stroke)" stroke-width="1.5"/><text x="235" y="94" text-anchor="middle" class="t12b">氧化物</text>`, '純物質包含灰色範圍，灰色範圍包含氧化物').style.maxWidth = '340px';
  }
  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '104 年會考第 35 題',
        q: '老師在上「元素與化合物」的課程時，要求學生分組討論後，在小卡上分別寫出元素和化合物各一個例子，下列哪一組的舉例最符合老師的要求？',
        options: [{ t: cardsOpt('氧氣', '臭氧'), why: '臭氧（O₃）只含氧原子，也是元素。' }, { t: cardsOpt('氮氣', '氨氣'), ok: true, why: '氮氣（N₂）只有氮，是元素；氨氣（NH₃）有氮和氫，是化合物。' },
          { t: cardsOpt('乙醇', '乙酸'), why: '乙醇、乙酸都含碳、氫、氧，兩個都是化合物。' }, { t: cardsOpt('碳酸鈣', '碳酸氫鈉'), why: '兩個都由好幾種元素組成，都是化合物。' }],
        steps: [{ q: '判斷「元素」的方法是？', options: [{ t: '只由一種原子組成', ok: true, why: '例如 O₂、O₃、N₂ 都只有一種原子。' }, { t: '名字裡有「氣」', why: '氨氣、二氧化碳氣也有「氣」，卻是化合物。' }] },
          { q: '氨氣（NH₃）是元素還是化合物？', options: [{ t: '化合物', ok: true, why: '有氮、氫兩種原子。' }, { t: '元素', why: 'NH₃ 裡有 N 和 H 兩種。' }] }],
        explain: '<p>元素只含<b>一種</b>原子（O₂、O₃、N₂），化合物含<b>兩種以上</b>（NH₃、乙醇、碳酸鈣）。只有 (B) 一個元素、一個化合物。</p>' },
      { stars: 2, src: '114 年會考第 4 題',
        pic: c => c.appendChild(h('<table class="sim-table" style="max-width:320px"><thead><tr><th>類別</th><th>例子</th></tr></thead><tbody><tr><td>元素</td><td>硫磺</td></tr><tr><td>化合物</td><td>笑氣</td></tr><tr><td>混合物</td><td>花岡岩</td></tr></tbody></table>')),
        q: '小志將物質分成元素、化合物和混合物三類，並舉例如表。表中各例子所含<b>原子種類</b>多寡的比較，下列何者正確？',
        options: [{ t: '笑氣 ＞ 硫磺', ok: true, why: '笑氣是化合物（至少兩種原子），硫磺是元素（只有一種）。' }, { t: '硫磺 ＞ 笑氣', why: '硫磺是元素，只有一種原子，最少。' }, { t: '硫磺 ＞ 花岡岩', why: '花岡岩是混合物，含很多種物質和原子。' }, { t: '三個例子都一樣多', why: '元素只有一種原子，化合物、混合物都更多。' }],
        steps: [{ q: '元素（硫磺）含幾種原子？', options: [{ t: '1 種', ok: true, why: '只有硫（S）。' }, { t: '2 種以上', why: '元素只有一種原子。' }] },
          { q: '化合物（笑氣）含幾種原子？', options: [{ t: '2 種以上', ok: true, why: '化合物由兩種以上元素組成（笑氣是 N₂O：氮和氧）。' }, { t: '1 種', why: '化合物至少兩種。' }] }],
        explain: '<p>元素：1 種原子（硫磺 S）。化合物：2 種以上（笑氣 N₂O）。混合物：好幾種物質混合，原子種類通常更多（花岡岩）。所以<b>笑氣 ＞ 硫磺</b>。</p>' },
      { stars: 2, src: '107 年會考第 22 題', pic: nestPic,
        q: '圖為小瑞依據物質組成來分類，畫出數種物質的相互關係，被包含在大範圍者，亦屬於大範圍的一種物質，例如：氧化物（被包含者）亦屬於純物質的一種。圖中<b>灰色範圍</b>最可能為下列哪一類？',
        options: [{ t: '元素', why: '氧化物含氧和另一種元素，不是元素。' }, { t: '化合物', ok: true, why: '氧化物 ⊂ 化合物 ⊂ 純物質。' }, { t: '混合物', why: '混合物不屬於純物質。' }, { t: '聚合物', why: '氧化物（如 CO₂、H₂O）不是聚合物。' }],
        steps: [{ q: '氧化物（例如 CO₂、H₂O）由幾種元素組成？', options: [{ t: '2 種以上', ok: true, why: '一定有氧，再加上其他元素。' }, { t: '1 種', why: 'CO₂ 有碳和氧。' }] },
          { q: '那麼包住氧化物、又被純物質包住的那一類是？', options: [{ t: '化合物', ok: true, why: '化合物是純物質的一種，氧化物是化合物的一種。' }, { t: '元素', why: '元素只有一種原子，包不住氧化物。' }] }],
        explain: '<p>純物質分成元素和化合物。氧化物含兩種以上元素 → 是<b>化合物</b>的一種。所以灰色範圍是化合物。</p>' }
    ]);
  }

  U.run('6-1', ['先猜猜看：還能再分嗎？', '動手玩：電解水與粒子分類', '收成 4 句話'], { guess, play, know, exam, real });
})();
