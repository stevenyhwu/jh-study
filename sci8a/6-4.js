/* ===== 理化 6-4 週期表 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1"';
  // [原子序, 符號, 名稱, 週期, 族, 類別]  類別：a 鹼金屬, e 鹼土金屬, m 其他金屬, n 非金屬, x 鹵素, g 惰性氣體
  const T = [[1, 'H', '氫', 1, 1, 'n'], [2, 'He', '氦', 1, 18, 'g'],
    [3, 'Li', '鋰', 2, 1, 'a'], [4, 'Be', '鈹', 2, 2, 'e'], [5, 'B', '硼', 2, 13, 'n'], [6, 'C', '碳', 2, 14, 'n'], [7, 'N', '氮', 2, 15, 'n'], [8, 'O', '氧', 2, 16, 'n'], [9, 'F', '氟', 2, 17, 'x'], [10, 'Ne', '氖', 2, 18, 'g'],
    [11, 'Na', '鈉', 3, 1, 'a'], [12, 'Mg', '鎂', 3, 2, 'e'], [13, 'Al', '鋁', 3, 13, 'm'], [14, 'Si', '矽', 3, 14, 'n'], [15, 'P', '磷', 3, 15, 'n'], [16, 'S', '硫', 3, 16, 'n'], [17, 'Cl', '氯', 3, 17, 'x'], [18, 'Ar', '氬', 3, 18, 'g'],
    [19, 'K', '鉀', 4, 1, 'a'], [20, 'Ca', '鈣', 4, 2, 'e']];
  const COL = { a: '#ffb3a7', e: '#ffd8a8', m: '#d0d7e2', n: '#c8e6c9', x: '#b3e5fc', g: '#e1bee7' };
  const KIND = { a: '鹼金屬：很活潑，遇水劇烈反應、放出氫氣', e: '鹼土金屬：活潑，但比鹼金屬溫和', m: '金屬', n: '非金屬', x: '鹵素：很活潑的非金屬，會和金屬結合成鹽', g: '惰性氣體（鈍氣）：非常穩定，幾乎不和別人反應' };
  const colOf = g => g <= 2 ? g - 1 : g - 11;   // 1,2,13～18 → 0～7

  function tableSim(host, on) {
    host.appendChild(h('<p class="sim-h">週期表（前 20 個元素）：點一個元素看看</p>'));
    const sv = U.svg(host, '0 0 360 196', '', '週期表', 'sim');
    const read = h('<div class="sim-read">點一個格子。</div>');
    host.appendChild(read);
    const clicked = new Set(); let sel = null;
    function draw() {
      let s = '';
      [1, 2, 13, 14, 15, 16, 17, 18].forEach(g => { s += `<text x="${22 + colOf(g) * 42}" y="12" text-anchor="middle" class="g-num">${g}</text>`; });
      [1, 2, 3, 4].forEach(r => { s += `<text x="358" y="${16 + r * 42}" text-anchor="end" class="g-num">${r}</text>`; });
      T.forEach(([z, sym, nm, per, g, k]) => {
        const x = 2 + colOf(g) * 42, y = 18 + (per - 1) * 42, on2 = sel && (sel[4] === g || sel[3] === per);
        s += `<g data-z="${z}" style="cursor:pointer"><rect x="${x}" y="${y}" width="40" height="40" rx="4" fill="${COL[k]}" stroke="${sel && sel[0] === z ? 'var(--bad)' : on2 ? 'var(--accent)' : 'var(--stroke)'}" stroke-width="${sel && sel[0] === z ? 3 : on2 ? 2 : 1}"/>
          <text x="${x + 4}" y="${y + 11}" font-size="9" fill="#333">${z}</text><text x="${x + 20}" y="${y + 26}" text-anchor="middle" font-size="14" font-weight="700" fill="#222">${sym}</text><text x="${x + 20}" y="${y + 37}" text-anchor="middle" font-size="9" fill="#333">${nm}</text></g>`;
      });
      sv.innerHTML = s;
    }
    sv.addEventListener('click', e => {
      const g = e.target.closest('[data-z]'); if (!g) return;
      sel = T.find(r => r[0] === +g.dataset.z); clicked.add(sel[1]); draw();
      const [z, sym, nm, per, gr, k] = sel;
      read.innerHTML = `<b>${nm}（${sym}）</b>　原子序 ${z}　第 <b>${per}</b> 週期（橫列）　第 <b>${gr}</b> 族（直行）<br>${KIND[k]}`;
      on();
    });
    draw();
    return { has: list => list.every(x => clicked.has(x)), count: list => list.filter(x => clicked.has(x)).length };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '週期表上一百多種元素，是照什麼順序排的？',
        options: [{ t: '照發現的時間' }, { t: '照原子序（質子數）', ok: true }, { t: '照英文字母' }],
        reveal: '<b>照原子序</b>。而且排一排，會發現每隔幾個，性質就「重複」一次。' },
      { q: '鈉（Na）丟進水裡會劇烈反應，甚至著火。和鈉在週期表<b>同一直行</b>的鉀（K），丟進水裡會……',
        options: [{ t: '也會劇烈反應', ok: true }, { t: '完全不反應' }],
        reveal: '<b>也會劇烈反應</b>（而且更激烈）。同一直行的元素，性質很像。' }
    ]);
  }

  function play(p, api) {
    let A;
    const P = U.panes(p, 1);
    const tk = U.tasks(p, api, [
      { text: '點<b>鋰（Li）、鈉（Na）、鉀（K）</b>。', check: () => A.has(['Li', 'Na', 'K']),
        qs: () => [{ q: '這三個在週期表上的位置有什麼共同點？性質呢？', options: [{ t: '都在第 1 族（同一直行），性質很像', ok: true, why: '同一<b>族</b>的元素，化學性質相似。第 1 族（氫除外）叫<b>鹼金屬</b>，都很活潑。' }, { t: '都在同一橫列', why: '看讀數：它們的週期不一樣，族一樣。' }] }] },
      { text: '點<b>氦（He）、氖（Ne）、氬（Ar）</b>。', check: () => A.has(['He', 'Ne', 'Ar']),
        qs: () => [{ q: '第 18 族的元素有什麼特性？', options: [{ t: '非常穩定，幾乎不和其他物質反應', ok: true, why: '叫<b>惰性氣體</b>（鈍氣）。氦灌氣球、氖做霓虹燈、氬充在燈泡裡。' }, { t: '非常活潑', why: '看讀數上的說明。' }] }] },
      { text: '點第 3 週期（第 3 橫列）裡至少 <b>4 個</b>元素，從左邊點到右邊。', check: () => A.count(['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar']) >= 4,
        qs: () => [{ q: '同一橫列（週期）從左到右，有什麼規律？', options: [{ t: '原子序越來越大，從金屬變成非金屬', ok: true, why: '週期表左邊大多是<b>金屬</b>，右邊是<b>非金屬</b>，最右邊是惰性氣體。' }, { t: '性質都一樣', why: '鈉是很活潑的金屬，氯是非金屬，氬是惰性氣體，差很多。' }] }] }
    ]);
    A = tableSim(P.list[0], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.card(p, '① 週期表依原子序排列', '<p>俄國的門得列夫最早排出週期表。現在的週期表照<b>原子序</b>由小到大排，橫的叫<b>週期</b>，直的叫<b>族</b>。</p>');
    tableSim(U.card(p, '② 同一族，化學性質相似', '<p>點點看：同一直行的元素會一起亮。</p>'), () => {});
    U.card(p, '③ 左邊金屬、右邊非金屬', '<p>週期表大部分是金屬，在<b>左邊和中間</b>；非金屬在<b>右上方</b>；最右一行是惰性氣體。</p>');
    U.card(p, '④ 四個要記的族', `<table class="sim-table"><tbody><tr><td>第 1 族</td><td>鹼金屬（鋰、鈉、鉀）：很活潑，遇水劇烈反應</td></tr><tr><td>第 2 族</td><td>鹼土金屬（鎂、鈣）</td></tr>
      <tr><td>第 17 族</td><td>鹵素（氟、氯）：很活潑的非金屬</td></tr><tr><td>第 18 族</td><td>惰性氣體（氦、氖、氬）：很穩定</td></tr></tbody></table>`);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '氟（F）和氯（Cl）在同一族。下列哪一個說法正確？', hint: '同族的元素……',
      options: [{ t: '它們的化學性質相似', ok: true, why: '同族化學性質相似，兩個都是鹵素。' }, { t: '它們的原子序相同', why: '氟 9、氯 17，不一樣。' }, { t: '它們都是金屬', why: '鹵素是非金屬。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開週期表',
      bench: host => tableSim(host, () => {}),
      qs: [
        { src: '改寫自 104 年會考',
          q: '新聞報導：「鉀遇到水會激烈反應，甚至爆炸。」下列哪些元素碰到水，最可能有類似的反應？', hint: '在週期表上，誰的性質和鉀最像？',
          options: [{ t: '和鉀同一族的金屬元素', ok: true, why: '同族化學性質相似。鋰、鈉和鉀同在第 1 族，遇水都會劇烈反應。' }, { t: '和鉀同一週期的元素', why: '同一週期從金屬到非金屬都有，性質差很多。' },
            { t: '和氯同一族的元素', why: '那是鹵素，是非金屬。' }, { t: '所有的金屬', why: '鐵、銅碰到水不會劇烈反應。' }] },
        { src: '改寫自 113 年會考',
          q: '從週期表上，<b>不能</b>直接知道元素的哪一項資訊？', hint: '週期表每一格上有什麼？',
          options: [{ t: '元素的價格', ok: true, why: '週期表上有原子序、符號、名稱、位置（族和週期）等，但沒有價格。' }, { t: '元素的原子序', why: '每一格都寫著原子序。' },
            { t: '元素屬於第幾族', why: '從它在第幾直行就知道。' }, { t: '哪些元素性質相似', why: '同一族的性質相似。' }] },
        { src: '基本題',
          q: '霓虹燈裡常充入氖氣（Ne）。氖屬於週期表哪一族？有什麼特性？', hint: '看最右邊那一行。',
          options: [{ t: '第 18 族，非常穩定', ok: true, why: '氖是惰性氣體，通電會發出紅橘色的光。' }, { t: '第 1 族，非常活潑', why: '第 1 族是鹼金屬。' }, { t: '第 17 族，有毒', why: '第 17 族是鹵素。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  function regionPic(c) {
    let s = '';
    const cell = (x, y, f) => `<rect x="${x}" y="${y}" width="16" height="14" fill="${f}" stroke="var(--stroke)" stroke-width=".6"/>`;
    for (let r = 0; r < 7; r++) for (let g = 0; g < 18; g++) {
      const ok = r === 0 ? (g === 0 || g === 17) : r < 3 ? (g < 2 || g > 11) : true;
      if (!ok) continue;
      const f = g === 17 ? '#e1bee7' : g < 2 ? '#ffd8a8' : g < 12 ? '#d0d7e2' : '#c8e6c9';
      s += cell(12 + g * 16.5, 10 + r * 15, f);
    }
    s += `<text x="25" y="128" class="t14b">甲</text><text x="110" y="128" class="t14b">乙</text><text x="240" y="128" class="t14b">丙</text><text x="296" y="128" class="t14b">丁</text>
      <path d="M28 116 V108 M115 116 V100 M245 116 V70 M301 116 V40" stroke="var(--stroke)" stroke-dasharray="2 2"/>`;
    U.svg(c, '0 0 320 135', s, '週期表外框，甲在最左邊、乙在中間、丙在右邊、丁在最右一行').style.maxWidth = '360px';
  }
  function partPic(c) {
    const cell = (x, y, z, sym, m) => `<rect x="${x}" y="${y}" width="58" height="44" rx="4" fill="var(--card)" stroke="var(--stroke)"/><text x="${x + 4}" y="${y + 12}" font-size="10" fill="currentColor">${z}</text><text x="${x + 29}" y="${y + 30}" text-anchor="middle" class="t14b">${sym}</text><text x="${x + 54}" y="${y + 12}" text-anchor="end" font-size="9" fill="currentColor">${m}</text>`;
    U.svg(c, '0 0 200 200', cell(130, 4, 2, 'He', '4.0') + cell(70, 52, 9, 'F', '19.0') + cell(130, 52, 10, 'Ne', '20.2') + cell(70, 100, 17, 'Cl', '35.5') + cell(130, 100, 18, 'Ar', '39.9') + cell(70, 148, 35, 'Br', '79.9') + cell(130, 148, 36, 'Kr', '83.8') +
      '<text x="4" y="40" font-size="10" fill="currentColor">左上：原子序</text><text x="4" y="54" font-size="10" fill="currentColor">右上：原子量</text>', '週期表第 17、18 族的一部分').style.maxWidth = '220px';
  }
  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '108 年會考第 15 題', pic: regionPic,
        q: '「這輛槽車所載運的物質為<b>鈍氣</b>，危險性較低……」上述為某槽車發生交通事故時，消防人員所說的一段話。根據上述內容，槽車所載運的化學物質最可能會在圖中元素週期表的甲、乙、丙和丁哪一個區域內？',
        options: [{ t: '甲', why: '最左邊是鹼金屬、鹼土金屬，很活潑。' }, { t: '乙', why: '中間是過渡金屬。' }, { t: '丙', why: '右邊是非金屬（例如氧、氯），不是鈍氣。' }, { t: '丁', ok: true, why: '最右邊一行（第 18 族）是鈍氣（惰性氣體）。' }],
        steps: [{ q: '鈍氣又叫什麼？在第幾族？', options: [{ t: '惰性氣體，第 18 族', ok: true, why: '氦、氖、氬……很穩定。' }, { t: '鹼金屬，第 1 族', why: '鹼金屬非常活潑，危險性很高。' }] },
          { q: '第 18 族在週期表的哪裡？', options: [{ t: '最右邊一行', ok: true, why: '就是丁。' }, { t: '最左邊一行', why: '最左邊是第 1 族。' }] }],
        explain: '<p>鈍氣（惰性氣體）是週期表<b>最右邊的第 18 族</b>，化學性質很穩定，所以危險性較低。</p>' },
      { stars: 2, src: '104 年會考第 12 題',
        q: '一則新聞報導：「一輛載運廢土的砂石車突然起火，消防人員灑水灌救，反而造成爆炸。原來是廢土中含有鋁粉，遇到熱水會激烈反應，甚至會爆炸。鋁為活性很大的物質……。」下列哪一類的元素碰到水會進行和上述鋁粉碰到熱水相似的反應？',
        options: [{ t: '與氬同一族的非金屬元素都會', why: '氬是惰性氣體，同族的都很穩定，不和水反應。' }, { t: '與氬同一週期的非金屬元素都會', why: '同週期的性質差很多，不能一概而論。' }, { t: '與鉀同一族的金屬元素都會', ok: true, why: '鉀所在的第 1 族（鹼金屬）活性都很大，遇水會激烈反應。' }, { t: '與鉀同一週期的金屬元素都會', why: '同一週期的元素化學性質不一定相似。' }],
        steps: [{ q: '週期表上，化學性質相似的元素排在哪裡？', options: [{ t: '同一族（同一直行）', ok: true, why: '同族化學性質相似。' }, { t: '同一週期（同一橫列）', why: '同週期從金屬變到非金屬，性質差很多。' }] },
          { q: '氬和鉀，哪一個是活性很大、會和水反應的？', options: [{ t: '鉀', ok: true, why: '鉀是鹼金屬，非常活潑。' }, { t: '氬', why: '氬是惰性氣體，很穩定。' }] }],
        explain: '<p><b>同族元素化學性質相似</b>。鉀屬於第 1 族鹼金屬，活性很大、遇水激烈反應，所以「與鉀同一族的金屬元素」都會有類似反應。</p>' },
      { stars: 3, src: '113 年會考第 4 題', pic: partPic,
        q: '圖為元素週期表的一部分，<b>無法</b>從圖中知道下列何項資訊？',
        options: [{ t: '氯原子與氬原子的質子數分別為多少', why: '原子序＝質子數，圖上有寫：17 和 18。' }, { t: '氖原子與氪原子是否有相似的化學性質', why: '它們在同一族（第 18 族），所以性質相似。' },
          { t: '氦原子與氪原子在自然界中含量何者比較多', ok: true, why: '週期表上沒有「在自然界的含量」這種資訊。' }, { t: '1 莫耳的氯氣（Cl₂）與 1 莫耳的溴（Br₂）何者質量比較大', why: '圖上有原子量（Br 79.9 ＞ Cl 35.5）就能比較。（莫耳是下學期才學，這裡知道「圖上有原子量」就夠了）' }],
        steps: [{ q: '週期表每一格上有寫哪些資訊？', options: [{ t: '原子序、元素符號、原子量', ok: true, why: '位置還能看出它在第幾族、第幾週期。' }, { t: '在地球上有多少', why: '週期表上沒有這個。' }] },
          { q: '「同一族性質相似」能從圖上知道嗎？', options: [{ t: '能，看它們是不是在同一直行', ok: true, why: 'Ne 和 Kr 都在最右一行。' }, { t: '不能', why: '同一直行就是同一族。' }] }],
        explain: '<p>週期表可以看出<b>原子序（質子數）、原子量、族與週期</b>（同族性質相似），但看不出元素在<b>自然界的含量</b>。</p>' }
    ]);
  }

  U.run('6-4', ['先猜猜看：元素怎麼排？', '動手玩：點點週期表', '收成 4 句話'], { guess, play, know, exam, real });
})();
