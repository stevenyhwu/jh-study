/* ===== 數學 5-1a 次數分配表與直方圖 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK;
  const DATA = [45, 52, 58, 61, 63, 66, 68, 70, 72, 74, 75, 77, 79, 80, 82, 85, 88, 91, 93, 98];
  const group = (w) => { const e = []; for (let x = 40; x <= 100; x += w) e.push(x); const v = e.slice(0, -1).map(a => DATA.filter(d => d >= a && d < a + w).length); return { e, v }; };

  function dataBox(host, hiLo, hiHi) {
    const d = h(`<div class="sim-read" style="line-height:1.9">${DATA.map(x => `<span style="display:inline-block;min-width:2.2em;text-align:center;border-radius:6px;${x >= hiLo && x < hiHi ? 'background:var(--accent-soft);color:var(--accent);font-weight:700' : ''}">${x}</span>`).join('')}</div>`);
    host.appendChild(d); return d;
  }
  function histSim(host, on) {
    host.appendChild(h('<p class="sim-h">20 位同學的數學小考成績：選組距，點長條看是哪些人</p>'));
    const dHost = h('<div></div>'), ch = h('<div></div>'), pic = h('<div></div>'), tab = h('<div></div>'), read = h('<div class="sim-note"></div>');
    host.append(dHost, ch, pic, tab, read);
    let w = 10, sel = -1; const st = { seen: {} };
    function draw() {
      const g = group(w);
      dHost.innerHTML = ''; dataBox(dHost, sel >= 0 ? g.e[sel] : -1, sel >= 0 ? g.e[sel] + w : -1);
      pic.innerHTML = '';
      const sv = K.hist(pic, { edges: g.e, vals: g.v, hi: sel >= 0 ? [sel] : [], ylab: '人數', xlab: '成績（分）', cls: 'sim' });
      sv.querySelectorAll('rect').forEach((r, i) => { r.style.cursor = 'pointer'; r.addEventListener('click', () => { sel = i; st.sel = [w, i]; draw(); on(); }); });
      tab.innerHTML = '';
      K.table(tab, ['成績（分）', '次數（人）'], g.v.map((v, i) => [`${g.e[i]} ～ ${g.e[i + 1]}`, sel === i ? `<b>${v}</b>` : v]).concat([['合計', 20]]), 300);
      read.innerHTML = sel >= 0 ? `${g.e[sel]} 分以上、未滿 ${g.e[sel] + w} 分：<b>${g.v[sel]} 人</b>（上面的成績已標出來）` : '點一根長條看看。';
    }
    U.chips(ch, '組距', [{ v: 10, t: '10 分' }, { v: 20, t: '20 分' }], w, v => { w = v; sel = -1; st.seen[v] = 1; draw(); on(); });
    st.seen[10] = 1; draw();
    st.w = () => w;
    return st;
  }

  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => dataBox(c, -1, -1), q: '這是 20 位同學的成績。一眼看出「大部分人考幾分左右」容易嗎？', options: [{ t: '不容易，數字太亂', ok: true }, { t: '很容易' }],
        reveal: '一堆數字很難看出重點。把它們<b>分組</b>、數一數每組有幾個人，再畫成長條，一眼就看懂了。' },
      { q: '剛好考 <b>80 分</b>的人，要算在「70 ～ 80」組還是「80 ～ 90」組？', options: [{ t: '70 ～ 80' }, { t: '80 ～ 90', ok: true }],
        reveal: '<b>80 ～ 90</b>。分組的規則是「<b>80 分以上、未滿 90 分</b>」：左邊的數算進來，右邊的不算。這樣每個人只會被數一次。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: '組距 10 分：點「70 ～ 80」那根長條。', check: () => S.sel && S.sel[0] === 10 && S.sel[1] === 3,
        qs: () => [{ q: '79 分在這組，80 分不在。為什麼？', options: [{ t: '這組是「70 分以上、未滿 80 分」', ok: true, why: '80 分算在下一組（80 ～ 90）。' }, { t: '80 分被漏掉了', why: '點「80 ～ 90」那根看看。' }] },
          { q: '人數最多的是哪一組？', options: [{ t: '70 ～ 80', ok: true, why: '6 人，長條最高。' }, { t: '90 ～ 100', why: '那組只有 3 人。' }] }],
        found: '<b>次數分配表</b>：把資料分組，數每組有幾個（次數）。<b>直方圖</b>：把次數畫成一根根<b>連在一起</b>的長條。' },
      { text: '改成組距 <b>20</b> 分，看看表和圖怎麼變。', check: () => S.w() === 20,
        qs: () => [{ q: '組距變大以後……', options: [{ t: '組數變少，每組人數變多，細節看不清楚', ok: true, why: '組距太大像「近視」，太小又太零碎，要選適中的。' }, { t: '總人數變多了', why: '看表的合計：還是 20 人。' }] }],
        found: '組距改變，<b>總人數不變</b>；所有組的次數加起來 ＝ 總數。' },
      { text: '不用模擬：讀直方圖。', quiet: true, check: () => true,
        qs: () => [{ num: true, q: '組距 10 分時，<b>60 分以上</b>（含 60 分）共有幾人？', pre: '', post: '人', answer: 17, hint: '把 60 ～ 70、70 ～ 80、80 ～ 90、90 ～ 100 四組加起來：4 ＋ 6 ＋ 4 ＋ 3。', diag: [{ v: 13, msg: '60 ～ 70 那組也要算。' }, { v: 3, msg: '那是不及格（未滿 60）的人數。' }], why: '或是 20 − 3 ＝ 17（總數減掉未滿 60 的）。' }],
        found: '問「某範圍有幾人」→ 把那幾組的次數<b>加起來</b>，或用總數去減。' }
    ]);
    S = histSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    const g = group(10);
    K.table(U.card(p, '① 次數分配表', '<p>把資料分組（每組的寬度叫<b>組距</b>），數每組有幾個（<b>次數</b>）。</p>'), ['成績（分）', '次數'], g.v.map((v, i) => [`${g.e[i]} ～ ${g.e[i + 1]}`, v]).concat([['合計', 20]]), 260);
    K.hist(U.card(p, '② 直方圖', '<p>橫軸是分組，縱軸是次數。長條<b>連在一起</b>（因為分數是連續的），這是跟長條圖不一樣的地方。</p>'), { edges: g.e, vals: g.v, ylab: '人數', xlab: '成績（分）' });
    K.table(U.card(p, '③ 「以上、未滿」：左含右不含', '<p>「70 ～ 80」＝ 70 分以上、未滿 80 分。剛好在邊界的數，算在<b>右邊那組</b>。</p>'), ['成績', '算在哪組'], [['70', '70 ～ 80'], ['79', '70 ～ 80'], ['80', '80 ～ 90']], 240);
    K.table(U.card(p, '④ 讀圖兩招', '<p>會考的直方圖題，多半是這兩種。</p>'), ['問法', '怎麼做'], [['某範圍有幾個', '把那幾根長條的數字加起來'], ['總數已知、少一根', '總數減掉其他的'], ['有正有負', '正的加、負的減（正負抵消）']], 340);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    K.hist(c, { edges: g.e, vals: g.v, ylab: '人數', xlab: '成績（分）' });
    U.numq(c, { q: '看上面的直方圖：<b>未滿 70 分</b>的有幾人？', post: '人', answer: 7, hint: '40 ～ 50、50 ～ 60、60 ～ 70 三組加起來。', diag: [{ v: 3, msg: '60 ～ 70 也是「未滿 70」。' }, { v: 13, msg: '那是 70 分以上的人數。' }], why: '1 ＋ 2 ＋ 4 ＝ 7。', onDone() { api.done(); } });
  }

  const POP = { edges: [0, 10, 20, 30, 40, 50, 60, 70, 80, '90+'], vals: [-109, -108, -186, -202, -215, -162, -109, 112, 204], ylab: '人口變動數（萬人）', xlab: '年齡（歲）', h: 260 };

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的，數字比較好算。答錯可以再選。',
      qs: [
        { src: '改寫自 114 年會考第 7 題', pic: c => K.hist(c, { edges: [0, 20, 40, 60, '60+'], xl: [0, 20, 40, 60, ''], vals: [-30, -50, 20, 40], ylab: '人口變動（萬人）', xlab: '年齡（歲）' }), q: '上圖為某鎮預估 30 年後的人口變動直方圖，正數表示會增加、負數表示會減少。該鎮 <b>40 歲以上</b>的人口，30 年後會增加或減少多少萬人？',
          hint: '40 歲以上是右邊兩根：40 ～ 60（＋20）和 60 歲以上（＋40）。',
          options: [{ t: '增加 60 萬人', ok: true, why: '20 ＋ 40 ＝ 60。' }, { t: '減少 20 萬人', why: '那是把四組全部加起來（−30 − 50 ＋ 20 ＋ 40）；題目只問 40 歲以上。' }, { t: '增加 40 萬人', why: '40 ～ 60 那組（＋20）也是 40 歲以上。' }, { t: '減少 80 萬人', why: '那是 40 歲以下的變化。' }] },
        { src: '基本題', pic: c => K.hist(c, { edges: [40, 50, 60, 70, 80, 90, 100], vals: [2, 3, 0, 9, 6, 4], labels: false, ylab: '人數', xlab: '成績（分）' }), q: '全班 30 人的成績直方圖，<b>60 ～ 70 分</b>那根長條被墨水蓋住了，其他各組人數如圖：2、3、？、9、6、4。60 ～ 70 分有幾人？',
          hint: '30 減掉其他五組的總和。',
          options: [{ t: '4', why: '2 ＋ 3 ＋ 9 ＋ 6 ＋ 4 ＝ 24，30 − 24 ＝ ？' }, { t: '6', ok: true, why: '30 − (2 ＋ 3 ＋ 9 ＋ 6 ＋ 4) ＝ 30 − 24 ＝ 6。' }, { t: '8', why: '再加一次其他五組：24。' }, { t: '24', why: '24 是其他五組的總和。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: K.SIM, pic: c => K.hist(c, { edges: [140, 145, 150, 155, 160, 165, 170], vals: [3, 5, 9, 8, 4, 1], ylab: '人數', xlab: '身高（公分）' }),
        q: '上圖為某班 30 位學生身高的直方圖。身高 <b>155 公分以上</b>的學生有幾人？',
        options: [{ t: '5', why: '155 ～ 160 那組（8 人）也是 155 以上。' }, { t: '8', why: '還有 160 ～ 165、165 ～ 170 兩組。' }, { t: '13', ok: true, why: '8 ＋ 4 ＋ 1 ＝ 13。' }, { t: '17', why: '那是未滿 155 公分的人數。' }],
        explain: '<p>155 公分以上 ＝ 155 ～ 160、160 ～ 165、165 ～ 170 三組：8 ＋ 4 ＋ 1 ＝ 13 人。答案 (C)。</p>',
        steps: [{ q: '「155 公分以上」包含哪幾組？', options: [{ t: '155 ～ 160、160 ～ 165、165 ～ 170', ok: true, why: '從 155 那組開始往右全部。' }, { t: '只有 155 ～ 160', why: '「以上」是 155 和比它大的全部。' }] }] },
      { stars: 2, src: '114 年會考 第 7 題', pic: c => K.hist(c, POP),
        q: '圖為某國預估 50 年後的人口變動數直方圖，各組的數值若為正數表示該組人口 50 年後會增加，若為負數表示該組人口 50 年後會減少。根據此圖預估該國 <b>60 歲以上</b>的人口，50 年後會增加或減少多少人？（註：80 ～ 90+ 為年齡 80 歲以上的人口）',
        options: [{ t: '增加 207 萬人', ok: true, why: '−109 ＋ 112 ＋ 204 ＝ 207。' }, { t: '增加 425 萬人', why: '112 ＋ 204 ＋ 109 ＝ 425：把 −109（減少）當成增加了。' }, { t: '減少 109 萬人', why: '只看了 60 ～ 70 一組。' }, { t: '減少 271 萬人', why: '再看一次：60 歲以上是最右邊三根。' }],
        explain: '<p>60 歲以上 ＝ 60 ～ 70、70 ～ 80、80 歲以上三組：<br>(−109) ＋ 112 ＋ 204 ＝ 207（萬人），是正的 → 增加 207 萬人。答案 (A)。<br>💡 有正有負時，負的那組要「減」，不能只把看到的數字加起來。</p>',
        steps: [
          { q: '60 歲以上是哪幾根長條？', options: [{ t: '60 ～ 70、70 ～ 80、80 以上（−109、112、204）', ok: true, why: '從 60 開始往右的三根。' }, { t: '70 ～ 80、80 以上（112、204）', why: '60 ～ 70 歲也是 60 歲以上。' }] },
          { num: true, signed: true, q: '(−109) ＋ 112 ＋ 204 ＝ ？', post: '萬人', answer: 207, diag: [{ v: 425, msg: '−109 是減少，要減掉，不是加上。' }, { v: 316, msg: '60 ～ 70 那組（−109）也要算。' }] }
        ] },
      { stars: 3, src: K.SIM, pic: c => K.hist(c, { edges: [0, 2, 4, 6, 8, 10], vals: [6, 10, 0, 8, 4], labels: false, ylab: '人數', xlab: '每週運動（小時）' }),
        q: '某班調查每週運動時數，畫成直方圖（每組含左不含右），其中「4 ～ 6 小時」那根長條遺失了。已知全班 40 人，其他各組依序為 6、10、？、8、4 人。若每週運動<b>未滿 6 小時</b>的人數占全班的百分率為 p%，則 p 為多少？',
        options: [{ t: '40', why: '4 ～ 6 那組也是未滿 6 小時。' }, { t: '55', why: '先算出 4 ～ 6 那組：40 − 28 ＝ 12。' }, { t: '70', ok: true, why: '6 ＋ 10 ＋ 12 ＝ 28，28 ÷ 40 ＝ 70%。' }, { t: '30', why: '30% 是 6 小時以上的人。' }],
        explain: '<p>遺失的那組：40 − (6 ＋ 10 ＋ 8 ＋ 4) ＝ 12 人。<br>未滿 6 小時 ＝ 0 ～ 2、2 ～ 4、4 ～ 6 三組：6 ＋ 10 ＋ 12 ＝ 28 人。<br>28 ÷ 40 ＝ 0.7 ＝ 70%。答案 (C)。</p>',
        steps: [
          { num: true, q: '遺失的「4 ～ 6 小時」有幾人？', post: '人', answer: 12, hint: '40 − (6 ＋ 10 ＋ 8 ＋ 4)。' },
          { num: true, q: '未滿 6 小時 ＝ 前三組，共幾人？', post: '人', answer: 28, diag: [{ v: 16, msg: '4 ～ 6 那組（12 人）也算。' }] },
          { num: true, q: '28 人占 40 人的百分之多少？', post: '%', answer: 70, hint: '28 ÷ 40 × 100。' }
        ] }
    ]);
  }

  K.run('5-1a', ['先猜猜看：一堆數字怎麼看？', '動手玩：分組畫直方圖', '收成 4 句話', '會考題改寫版', '實戰：會考原題與模擬題'], { guess, play, know, exam, real });
})();
