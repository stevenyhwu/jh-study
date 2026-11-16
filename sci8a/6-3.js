/* ===== 理化 6-3 物質結構與原子 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1"';
  const EL = ['', ['H', '氫'], ['He', '氦'], ['Li', '鋰'], ['Be', '鈹'], ['B', '硼'], ['C', '碳'], ['N', '氮'], ['O', '氧'], ['F', '氟'], ['Ne', '氖']];

  function atomSvg(pp, nn, ee) {
    let s = '<circle cx="180" cy="100" r="40" fill="none" stroke="var(--line)" stroke-dasharray="3 3"/><circle cx="180" cy="100" r="80" fill="none" stroke="var(--line)" stroke-dasharray="3 3"/>';
    const kinds = []; let a1 = pp, b1 = nn;
    for (let i = 0; i < pp + nn; i++) { if ((i % 2 === 0 && a1 > 0) || b1 === 0) { kinds.push(1); a1--; } else { kinds.push(0); b1--; } }
    kinds.forEach((isP, i) => {
      const ang = i * 2.4, r = 3.2 * Math.sqrt(i);
      s += `<circle cx="${180 + r * Math.cos(ang)}" cy="${100 + r * Math.sin(ang)}" r="6" fill="${isP ? '#e53935' : '#9e9e9e'}" ${ST}/>`;
    });
    for (let i = 0; i < ee; i++) {
      const ring = i < 2 ? 40 : 80, k = i < 2 ? i : i - 2, n = i < 2 ? Math.min(ee, 2) : ee - 2, a = (k / n) * Math.PI * 2 - Math.PI / 2;
      s += `<circle cx="${180 + ring * Math.cos(a)}" cy="${100 + ring * Math.sin(a)}" r="5" fill="#1e88e5" ${ST}/>`;
    }
    return s + `<text x="20" y="20" class="t12b" style="fill:#e53935">● 質子（＋）</text><text x="20" y="38" class="t12b" style="fill:#757575">● 中子（不帶電）</text><text x="20" y="56" class="t12b" style="fill:#1e88e5">● 電子（－）</text>`;
  }

  function atomSim(host, on) {
    host.appendChild(h('<p class="sim-h">原子組合器：加減質子、中子、電子</p>'));
    let pp = 1, nn = 0, ee = 1; const seen = {};
    const sv = U.svg(host, '0 0 360 200', '', '原子', 'sim');
    const read = h('<div class="sim-read"></div>');
    const ctl = h('<div class="row"></div>');
    [['質子', 'p'], ['中子', 'n'], ['電子', 'e']].forEach(([t, k]) => {
      const g = h(`<span class="chips"><span class="chips-l">${t}</span><button type="button" class="btn">－</button><button type="button" class="btn">＋</button></span>`);
      const lim = { p: [1, 10], n: [0, 12], e: [0, 10] }[k];
      const set = d => { const v = { p: pp, n: nn, e: ee }[k] + d; if (v < lim[0] || v > lim[1]) return; if (k === 'p') pp = v; if (k === 'n') nn = v; if (k === 'e') ee = v; draw(); on(); };
      g.children[1].addEventListener('click', () => set(-1)); g.children[2].addEventListener('click', () => set(1));
      ctl.appendChild(g);
    });
    host.append(ctl, read);
    function draw() {
      sv.innerHTML = atomSvg(pp, nn, ee);
      const [sym, nm] = EL[pp], ch = pp - ee, A = pp + nn;
      read.innerHTML = `元素：<b>${nm}（${sym}）</b>，原子序 ${pp}　質量數＝${pp}＋${nn}＝<b>${A}</b>　` +
        (ch === 0 ? '電中性的<b>原子</b>' : `<b>離子</b>，帶 ${Math.abs(ch)} 個${ch > 0 ? '正' : '負'}電（${sym}${Math.abs(ch) > 1 ? Math.abs(ch) : ''}${ch > 0 ? '⁺' : '⁻'}）`) + `<br>寫法：<b><sup>${A}</sup><sub>${pp}</sub>${sym}</b>`;
      if (pp === 6 && ee === 6 && nn === 6) seen.c12 = 1;
      if (pp === 6 && ee === 6 && nn === 8) seen.c14 = 1;
      if (ch !== 0) seen.ion = 1;
    }
    draw();
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '如果把原子放大到一座<b>足球場</b>那麼大，中間的原子核大概有多大？',
        options: [{ t: '像一顆籃球' }, { t: '像一隻螞蟻', ok: true }, { t: '佔了半個球場' }],
        reveal: '<b>像一隻螞蟻</b>！原子裡幾乎是空的，但大部分質量都在那小小的原子核。' },
      { q: '決定一個原子是「碳」還是「氧」的，是哪一種粒子的數量？',
        options: [{ t: '質子', ok: true }, { t: '中子' }, { t: '電子' }],
        reveal: '<b>質子</b>。下一步自己組原子看看。' }
    ]);
  }

  function play(p, api) {
    let A;
    const P = U.panes(p, 1);
    const tk = U.tasks(p, api, [
      { text: '組一個<b>碳原子</b>：6 個質子、6 個中子、6 個電子。', check: () => A.seen.c12,
        qs: () => [{ q: '一直加質子時，元素的名字會跟著變。決定元素種類的是……', options: [{ t: '質子數（就是原子序）', ok: true, why: '質子數＝<b>原子序</b>。6 個質子就一定是碳。' }, { t: '中子數', why: '加減中子看看，元素名字有變嗎？' }, { t: '電子數', why: '加減電子看看，元素名字有變嗎？' }] }] },
      { text: '碳原子再加 <b>2 個中子</b>（變成 8 個）。', check: () => A.seen.c14,
        qs: () => [{ q: '多了 2 個中子，它還是碳嗎？', options: [{ t: '還是碳，只是質量數從 12 變成 14', ok: true, why: '質子數相同、中子數不同的原子，叫<b>同位素</b>。碳-14 可以用來推算化石的年代。' }, { t: '變成氮了', why: '看元素名字：質子數沒變，所以還是碳。' }] }] },
      { text: '加或減<b>電子</b>，讓它不再是電中性。', check: () => A.seen.ion,
        qs: () => [{ q: '原子多了 1 個電子，會變成……', options: [{ t: '帶 1 個負電的離子', ok: true, why: '電子帶負電，多一個就帶負電；少一個就帶正電。原子變成了<b>離子</b>，但元素種類不變。' }, { t: '帶 1 個正電的離子', why: '電子帶的是負電。' }, { t: '另一種元素', why: '只有質子數改變，元素才會變。' }] }] }
    ]);
    A = atomSim(P.list[0], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.card(p, '① 原子說：物質由原子組成', '<p>道耳頓提出：物質都是由很小的<b>原子</b>組成；同一種元素的原子性質相同；化合物是不同的原子以固定比例結合。（後來發現原子還可以再分成更小的粒子）</p>');
    U.svg(U.card(p, '② 原子＝原子核（質子＋中子）＋ 電子', `<table class="sim-table"><thead><tr><th>粒子</th><th>帶電</th><th>位置</th><th>質量</th></tr></thead><tbody>
      <tr><td>質子</td><td>＋1</td><td>原子核</td><td>重</td></tr><tr><td>中子</td><td>不帶電</td><td>原子核</td><td>重（和質子差不多）</td></tr><tr><td>電子</td><td>－1</td><td>核外</td><td>很輕（約質子的 1/1840）</td></tr></tbody></table>`), '0 0 360 200', atomSvg(6, 6, 6), '碳原子');
    U.card(p, '③ 原子序與質量數', `<div class="formula">原子序 ＝ 質子數 ＝ 電中性時的電子數</div><div class="formula">質量數 ＝ 質子數 ＋ 中子數</div>
      <p>寫法：<b><sup>12</sup><sub>6</sub>C</b> → 左上質量數 12、左下原子序 6，中子數＝12－6＝6。</p>`);
    U.card(p, '④ 同位素與離子', '<p><b>同位素</b>：質子數相同、中子數不同（例：碳-12、碳-14），化學性質幾乎一樣。<br><b>離子</b>：原子得到或失去電子而帶電，例如 Na⁺（少 1 個電子）、Cl⁻（多 1 個電子）。</p>');
    const c = h('<div class="card"><h3>✏️ 算一題看看</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '鈉原子的原子序是 11，質量數是 23。它有幾個中子？', post: '個', answer: 12, hint: '中子數＝質量數－質子數。',
      diag: [{ v: 34, msg: '是相減：23－11。' }, { v: 11, msg: '11 是質子數。中子數＝23－11。' }], why: '23－11＝12 個中子。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開原子組合器',
      bench: host => atomSim(host, () => {}),
      qs: [
        { src: '改寫自 104 年會考',
          q: '原子由質子、中子、電子組成。關於這三種粒子，哪一個說法正確？', hint: '看知識卡 ② 的表格。',
          options: [{ t: '質子帶正電，位在原子核裡', ok: true, why: '質子（＋）和中子（不帶電）在原子核；電子（－）在外面。' }, { t: '電子帶正電，位在原子核裡', why: '電子帶負電，在原子核外面。' },
            { t: '中子帶負電', why: '中子不帶電。' }, { t: '電子的質量和質子差不多', why: '電子很輕，大約只有質子的 1/1840。' }] },
        { src: '改寫自 105 年會考',
          q: '一個氯原子有 <b>17 個質子</b>、<b>18 個中子</b>。它的質量數和電子數各是多少？', hint: '質量數＝質子＋中子；電中性的原子，電子數＝質子數。',
          options: [{ t: '質量數 35，電子 17 個', ok: true, why: '17＋18＝35；電中性時電子數＝質子數＝17。' }, { t: '質量數 17，電子 18 個', why: '質量數要把質子和中子加起來。' },
            { t: '質量數 35，電子 18 個', why: '電子數要和質子數一樣才會電中性。' }, { t: '質量數 18，電子 17 個', why: '18 是中子數。' }] },
        { src: '改寫自 103 年會考',
          q: '碳-12 和碳-14 是碳的兩種<b>同位素</b>。它們哪裡不一樣？', hint: '碳-12 和碳-14 的數字代表質量數。',
          options: [{ t: '中子數不同', ok: true, why: '兩個都有 6 個質子（所以都是碳），中子分別是 6 和 8 個。' }, { t: '質子數不同', why: '質子數不同就不是同一種元素了。' }, { t: '電子數不同', why: '電中性時兩者電子數都是 6。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  const tbl = html => c => c.appendChild(h(`<table class="sim-table" style="max-width:420px">${html}</table>`));
  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '103 年會考第 12 題',
        q: '關於 1 個鎵原子（Ga）形成鎵離子（Ga³⁺）的敘述，下列何者正確？',
        options: [{ t: '鎵原子失去 3 個電子形成鎵離子', ok: true, why: '少了 3 個帶負電的電子，就帶 3 個正電。' }, { t: '鎵原子失去 3 個質子形成鎵離子', why: '質子數一變就不是鎵了；形成離子只會改變電子數。' },
          { t: '鎵原子得到 3 個電子形成鎵離子', why: '得到電子會帶負電，Ga³⁺ 是正電。' }, { t: '鎵離子得到 3 個質子形成鎵離子', why: '形成離子時質子數不變。' }],
        steps: [{ q: '原子變成離子時，改變的是哪一種粒子的數目？', options: [{ t: '電子', ok: true, why: '質子數不變（元素才不會變）。' }, { t: '質子', why: '質子數變了就是別的元素。' }] },
          { q: 'Ga³⁺ 帶 3 個正電，是得到還是失去 3 個電子？', options: [{ t: '失去', ok: true, why: '少了負電，就變成帶正電。' }, { t: '得到', why: '得到電子會帶負電。' }] }],
        explain: '<p>形成離子時<b>只有電子數改變</b>。失去電子 → 帶正電（陽離子），得到電子 → 帶負電（陰離子）。Ga → Ga³⁺：失去 3 個電子。</p>' },
      { stars: 2, src: '104 年會考第 20 題',
        pic: tbl('<thead><tr><th>粒子的名稱</th><th>帶電情形</th><th>在原子中的位置</th></tr></thead><tbody><tr><td>①</td><td></td><td>④</td></tr><tr><td></td><td>③</td><td>位於原子核內</td></tr><tr><td>②</td><td>不帶電</td><td></td></tr></tbody>'),
        q: '某原子由質子、電子與中子三種粒子所組成，表列出這些粒子的部分資訊（未依照順序），根據這些資訊，判斷表格①、②、③與④填入的內容，何者是合理的？',
        options: [{ t: '①：質子', why: '② 不帶電是中子；第二列在原子核內又不是中子，是質子；所以 ① 是電子。' }, { t: '②：電子', why: '② 不帶電，是中子。' }, { t: '③：帶負電', why: '第二列是質子，帶正電。' }, { t: '④：位於原子核外', ok: true, why: '① 是電子，電子在原子核外。' }],
        steps: [{ q: '② 不帶電，它是哪一種粒子？', options: [{ t: '中子', ok: true, why: '只有中子不帶電。' }, { t: '電子', why: '電子帶負電。' }] },
          { q: '第二列的粒子在原子核內，又不是中子，它是？', options: [{ t: '質子（帶正電）', ok: true, why: '所以 ③ 是帶正電。' }, { t: '電子', why: '電子在原子核外。' }] },
          { q: '剩下 ① 是什麼？它在哪裡？', options: [{ t: '電子，在原子核外', ok: true, why: '所以 ④ 是位於原子核外。' }, { t: '質子，在原子核內', why: '質子已經是第二列了。' }] }],
        explain: '<p>② 不帶電 → 中子；在原子核內又不是中子 → 質子（③ 帶正電）；剩下 ① 是電子，④ 位於<b>原子核外</b>。</p>' },
      { stars: 2, src: '105 年會考第 37 題',
        pic: tbl('<thead><tr><th></th><th>甲</th><th>乙</th><th>丙</th><th>丁</th></tr></thead><tbody><tr><td>氯原子 Cl</td><td>35</td><td>18</td><td>17</td><td>17</td></tr><tr><td>氫離子 H⁺</td><td>1</td><td>0</td><td>1</td><td>0</td></tr></tbody>'),
        q: '表列出氯原子（Cl）和氫離子（H⁺）的質子數、中子數、電子數和質量數（未依照順序），依表中所列的數值判斷，關於代號甲、乙、丙或丁的說明，下列何者正確？',
        options: [{ t: '甲為質子數', why: '甲最大（35），是質量數 ＝ 質子 ＋ 中子。' }, { t: '乙為中子數', ok: true, why: '氯：35 － 17 ＝ 18 個中子；氫離子沒有中子。' }, { t: '丙為電子數', why: 'H⁺ 失去了唯一的電子，電子數是 0；丙的 H⁺ 是 1，所以丙是質子數。' }, { t: '丁為質量數', why: '丁的數字比甲小很多，不是質量數。' }],
        steps: [{ q: '四個數字裡，哪一個最大？', options: [{ t: '質量數（質子＋中子）', ok: true, why: '所以甲（35）是質量數。' }, { t: '電子數', why: '質量數是兩種粒子加起來，最大。' }] },
          { q: 'H⁺ 是氫原子失去 1 個電子。H⁺ 的質子數和電子數各是多少？', options: [{ t: '質子 1，電子 0', ok: true, why: '所以 H⁺ 那一列是 1 的（丙）是質子數，是 0 的有乙、丁。' }, { t: '質子 0，電子 1', why: '失去的是電子，質子還在。' }] },
          { q: '氯原子是電中性的，質子數＝電子數＝17。乙（18）是什麼？', options: [{ t: '中子數', ok: true, why: '35 － 17 ＝ 18。' }, { t: '電子數', why: '氯原子的電子數是 17（和質子一樣）。' }] }],
        explain: '<p>甲最大 → 質量數；H⁺ 有 1 個質子、0 個電子 → 丙＝質子數；氯原子質子＝電子＝17 → 丁＝電子數；乙＝35－17＝18 → <b>中子數</b>。</p>' },
      { stars: 3, src: '108 年會考第 9 題',
        pic: tbl('<thead><tr><th>粒子</th><th>原子序</th><th>電子數</th></tr></thead><tbody><tr><td>甲</td><td>8</td><td>8</td></tr><tr><td>乙</td><td>9</td><td>10</td></tr><tr><td>丙</td><td>10</td><td>10</td></tr><tr><td>丁</td><td>12</td><td>10</td></tr></tbody>'),
        q: '已知甲、乙、丙、丁四種粒子為原子或單原子離子，其單一粒子的原子序與電子數如表所示。關於此四種粒子的敘述，下列何者正確？',
        options: [{ t: '甲、丙均呈電中性', ok: true, why: '甲、丙的質子數（原子序）和電子數相等。' }, { t: '乙、丙是相同的原子', why: '原子序不同（9 和 10），是不同的元素。' },
          { t: '乙、丁的帶電量相同', why: '乙：9－10 ＝ －1；丁：12－10 ＝ ＋2，不一樣。' }, { t: '甲、丁的質子數均大於電子數', why: '甲的質子數＝電子數（8＝8）。' }],
        steps: [{ q: '原子序等於什麼？', options: [{ t: '質子數', ok: true, why: '原子序＝質子數。' }, { t: '電子數', why: '只有電中性時電子數才等於原子序。' }] },
          { q: '帶電量 ＝ 質子數 － 電子數。乙和丁各帶多少電？', options: [{ t: '乙 －1、丁 ＋2', ok: true, why: '9－10＝－1；12－10＝＋2。' }, { t: '乙 ＋1、丁 －2', why: '質子比電子少 → 帶負電。' }] },
          { q: '哪兩個是電中性？', options: [{ t: '甲和丙', ok: true, why: '質子數＝電子數。' }, { t: '乙和丁', why: '它們的質子數和電子數不相等。' }] }],
        explain: '<p>原子序＝質子數。帶電量＝質子數－電子數：甲 0、乙 －1、丙 0、丁 ＋2。所以<b>甲、丙電中性</b>；四個原子序都不同，是四種元素。</p>' }
    ]);
  }

  U.run('6-3', ['先猜猜看：原子裡面有什麼？', '動手玩：原子組合器', '收成 4 句話'], { guess, play, know, exam, real });
})();
