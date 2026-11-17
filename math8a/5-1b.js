/* ===== 數學 5-1b 相對次數、累積次數與折線圖 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK;
  const E = [40, 50, 60, 70, 80, 90, 100], V = [1, 2, 4, 6, 4, 3], N = 20;
  const cum = V.reduce((a, v) => (a.push((a.length ? a[a.length - 1] : 0) + v), a), []);
  const pct = v => Math.round(v * 1000 / N) / 10;
  const MODES = {
    f: { t: '次數', vals: V, fmt: v => v, ylab: '人數' },
    r: { t: '相對次數', vals: V.map(pct), fmt: v => v + '%', ylab: '%' },
    c: { t: '累積次數', vals: cum, fmt: v => v, ylab: '累積人數', line: true },
    cr: { t: '累積相對次數', vals: cum.map(pct), fmt: v => v + '%', ylab: '累積 %', line: true }
  };
  function fullTable(host, hi) {
    const col = k => (hi === k ? 'style="background:var(--accent-soft)"' : '');
    const t = h(`<table class="sim-table"><tr><th>成績（分）</th><th ${col('f')}>次數</th><th ${col('r')}>相對次數</th><th ${col('c')}>累積次數</th><th ${col('cr')}>累積相對次數</th></tr>${V.map((v, i) => `<tr><td>${E[i]} ～ ${E[i + 1]}</td><td ${col('f')}>${v}</td><td ${col('r')}>${pct(v)}%</td><td ${col('c')}>${cum[i]}</td><td ${col('cr')}>${pct(cum[i])}%</td></tr>`).join('')}<tr><td>合計</td><td>20</td><td>100%</td><td></td><td></td></tr></table>`);
    t.style.fontSize = '14px'; host.appendChild(t); return t;
  }
  function viewSim(host, on) {
    host.appendChild(h('<p class="sim-h">同一班 20 人的成績，換四種方式看</p>'));
    const ch = h('<div></div>'), pic = h('<div></div>'), tab = h('<div></div>'), read = h('<div class="sim-note"></div>');
    host.append(ch, pic, tab, read);
    let m = 'f'; const seen = { f: 1 };
    const NOTE = { f: '每組有幾人。', r: '每組占全部的百分之幾：次數 ÷ 總數。全部加起來是 100%。', c: '從最低分那組一路加到這一組：「未滿右邊那個分數」的人數。最後一組一定是總數 20。', cr: '累積次數 ÷ 總數。最後一定是 100%。' };
    function draw() {
      const o = MODES[m];
      pic.innerHTML = ''; K.hist(pic, { edges: E, vals: o.vals, fmt: o.fmt, ylab: o.ylab, xlab: '成績（分）', line: o.line, cls: 'sim' });
      tab.innerHTML = ''; fullTable(tab, m);
      read.innerHTML = `<b>${o.t}</b>：${NOTE[m]}${o.line ? '　橘色折線：點畫在每組的<b>右邊界</b>上。' : ''}`;
    }
    U.chips(ch, '看', Object.keys(MODES).map(k => ({ v: k, t: MODES[k].t })), m, v => { m = v; seen[v] = 1; draw(); on(); });
    draw();
    return { seen, get m() { return m; } };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '甲班 20 人有 6 人考 90 分以上，乙班 40 人有 10 人考 90 分以上。哪一班考 90 分以上的「比例」比較高？', options: [{ t: '甲班', ok: true }, { t: '乙班' }, { t: '一樣' }],
        reveal: '<b>甲班</b>：6 ÷ 20 ＝ 30%；乙班：10 ÷ 40 ＝ 25%。人數不同的團體要比較，要看<b>百分比</b>（相對次數），不能只看人數。' },
      { q: '小考成績表裡，<b>未滿 70 分</b>的人數，要怎麼最快知道？', options: [{ t: '把 70 分以下的每一組加起來', ok: true }, { t: '只看 60 ～ 70 那組' }],
        reveal: '要一路加起來。把「從最低那組加到這組」先算好寫在表上，叫<b>累積次數</b>，查表就知道。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: '切到「<b>相對次數</b>」。', check: () => S.m === 'r',
        qs: () => [{ q: '70 ～ 80 分有 6 人，相對次數是 30%。怎麼算的？', options: [{ t: '6 ÷ 20 ＝ 0.3 ＝ 30%', ok: true, why: '相對次數 ＝ 次數 ÷ 總數。' }, { t: '6 × 5 ＝ 30', why: '剛好數字一樣，但道理是「除以總數 20」。總數是 25 人時就不是 ×5 了。' }] }],
        found: '<b>相對次數 ＝ 次數 ÷ 總數</b>。全部加起來是 100%。' },
      { text: '切到「<b>累積次數</b>」。', check: () => S.m === 'c',
        qs: () => [{ q: '70 ～ 80 那組的累積次數是 13，代表什麼？', options: [{ t: '未滿 80 分的有 13 人', ok: true, why: '1 ＋ 2 ＋ 4 ＋ 6 ＝ 13，從最低分一路加到 80 分（不含）。' }, { t: '70 ～ 80 分有 13 人', why: '這組只有 6 人；13 是一路加起來的。' }] },
          { num: true, q: '用累積次數算：<b>80 分以上</b>的有幾人？', post: '人', answer: 7, hint: '總數 20 減掉「未滿 80」的 13。', diag: [{ v: 13, msg: '13 是未滿 80 分的人。' }] }],
        found: '<b>累積次數</b>＝「未滿某分數」的人數。要算「某分數以上」就用<b>總數去減</b>。' },
      { text: '切到「<b>累積相對次數</b>」，看折線。', check: () => S.m === 'cr',
        qs: () => [{ q: '累積相對次數的折線，最後一個點一定是？', options: [{ t: '100%', ok: true, why: '最後一組時，所有人都被加進來了。' }, { t: '最大的那組的百分比', why: '看折線的最右邊。' }] },
          { q: '累積折線有可能往下掉嗎？', options: [{ t: '不可能，只會往上或持平', ok: true, why: '每一組人數 ≥ 0，一路加只會變大或不變。某組 0 人時，那一段是平的。' }, { t: '有可能', why: '累積是一直加，人數不會是負的。' }] }],
        found: '累積的折線<b>只升不降</b>，終點是總數（或 100%）。' }
    ]);
    S = viewSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    fullTable(U.card(p, '① 一張表四種看法', '<p>次數、相對次數、累積次數、累積相對次數，都從「次數」算出來。</p>'), 'r');
    K.hist(U.card(p, '② 相對次數 ＝ 次數 ÷ 總數', '<p>用來比較<b>人數不同</b>的團體。全部加起來 100%。</p>'), { edges: E, vals: MODES.r.vals, fmt: v => v + '%', ylab: '%', xlab: '成績（分）' });
    K.hist(U.card(p, '③ 累積次數 ＝「未滿」右邊界的人數', '<p>從最小那組一路加。折線圖的點畫在每組<b>右邊界</b>，只升不降，最後是總數。</p><p>「某數以上」＝ 總數 − 累積次數。</p>'), { edges: E, vals: cum, ylab: '累積人數', xlab: '成績（分）', line: true });
    K.lineChart(U.card(p, '④ 折線圖：看變化和比大小', '<p>會考常給好幾條折線（不同國家、不同人），問「哪個時候誰最多／最少」。一個時間點一個時間點<b>直著看</b>。</p>'), { xs: ['1 月', '2 月', '3 月'], series: [{ name: '甲', vals: [2, 3, 1], color: '#e07a2f' }, { name: '乙', vals: [1, 2, 3], color: '#2f7de0' }], ymax: 4, step: 1, ylab: '數量' });
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '某班 25 人，有 5 人考 90 分以上。90 分以上的相對次數是多少 %？', post: '%', answer: 20, hint: '5 ÷ 25 × 100。', diag: [{ v: 5, msg: '5 是次數；相對次數要除以總數。' }], why: '5 ÷ 25 ＝ 0.2 ＝ 20%。', onDone() { api.done(); } });
  }

  const TOUR = { xs: [6, 7, 8, 9], series: [{ name: '日本', vals: [2.2, 1.75, 3, 2.2], color: '#2f9e5b' }, { name: '美國', vals: [1.2, 2.35, 2, 2.9], color: '#2f7de0' }, { name: '英國', vals: [0.75, 3, 2.4, 1.75], color: '#e07a2f' }], ymax: 3.5, step: 0.5, ylab: '人數（千人）', xlab: '月分（月）' };

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      qs: [
        { src: '改寫自 110 年會考第 9 題', pic: c => K.lineChart(c, { xs: ['1 月', '2 月', '3 月'], series: [{ name: '甲', vals: [2, 3, 1], color: '#2f9e5b' }, { name: '乙', vals: [1, 2, 3], color: '#2f7de0' }, { name: '丙', vals: [3, 1, 2], color: '#e07a2f' }], ymax: 4, step: 1, ylab: '銷售量（百個）' }),
          q: '上圖為甲、乙、丙三家店 1 ～ 3 月的銷售量折線圖。哪一個月份<b>乙店</b>的銷售量是三家中<b>最少</b>的？', hint: '每個月直著看，比較三個點的高低。',
          options: [{ t: '1 月', ok: true, why: '1 月：甲 2、乙 1、丙 3，乙最少。' }, { t: '2 月', why: '2 月丙只有 1，丙最少。' }, { t: '3 月', why: '3 月乙是 3，最多。' }, { t: '沒有這種月份', why: '看 1 月：乙的點最低。' }] },
        { src: '基本題', pic: c => fullTable(c, 'c'), q: '根據上表，成績<b>未滿 70 分</b>的人數占全班的百分率是多少？', hint: '看 60 ～ 70 那列的累積相對次數。',
          options: [{ t: '20%', why: '20% 只是 60 ～ 70 那一組。' }, { t: '35%', ok: true, why: '累積次數 7，7 ÷ 20 ＝ 35%。' }, { t: '65%', why: '65% 是未滿 80 分。' }, { t: '7%', why: '7 是人數，不是百分率。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '110 年會考 第 9 題', pic: c => K.lineChart(c, TOUR),
        q: '圖為甲城市 6 月到 9 月外國旅客人數的折線圖。根據此圖判斷，哪一個月到甲城市的外國旅客中，旅客人數最少的國家是美國？',
        options: [{ t: '6', why: '6 月英國的點最低（不到 1 千人）。' }, { t: '7', why: '7 月日本的點最低。' }, { t: '8', ok: true, why: '8 月：日本 3、英國約 2.4、美國 2，美國最少。' }, { t: '9', why: '9 月美國的點最高。' }],
        explain: '<p>每個月直著看，找最低的點：<br>6 月最低是英國；7 月最低是日本；<b>8 月最低是美國</b>（2 千人）；9 月最低是英國。答案 (C)。</p>',
        steps: [{ q: '8 月三個點：日本在 3、美國在 2、英國在 2 和 3 中間。哪一國最少？', options: [{ t: '美國', ok: true, why: '圓點（美國）最低。' }, { t: '英國', why: '方點（英國）在 2 和 3 之間，比美國高。' }] }] },
      { stars: 2, src: K.SIM, pic: c => K.table(c, ['每天睡眠（小時）', '累積次數（人）'], [['5 ～ 6', 3], ['6 ～ 7', 10], ['7 ～ 8', 24], ['8 ～ 9', 36], ['9 ～ 10', 40]], 300),
        q: '上表為某班每天睡眠時數的累積次數分配表（每組含左不含右）。睡眠時數「7 小時以上、未滿 8 小時」的人數占全班的百分率為何？',
        options: [{ t: '24%', why: '24 是累積到 8 小時的人數，不是這一組。' }, { t: '35%', ok: true, why: '這組 24 − 10 ＝ 14 人，14 ÷ 40 ＝ 35%。' }, { t: '60%', why: '60% 是「未滿 8 小時」全部的人。' }, { t: '14%', why: '14 是人數，還要除以總數 40。' }],
        explain: '<p>累積次數相減 ＝ 那一組的次數：24 − 10 ＝ 14 人。<br>總數是最後一組的累積次數 40。14 ÷ 40 ＝ 35%。答案 (B)。</p>',
        steps: [
          { num: true, q: '「7 ～ 8」這一組有幾人？（累積次數相減）', post: '人', answer: 14, hint: '24 − 10。', diag: [{ v: 24, msg: '24 是累積的；要減掉前面的 10。' }] },
          { num: true, q: '全班有幾人？', post: '人', answer: 40, hint: '最後一組的累積次數就是總數。' },
          { num: true, q: '14 ÷ 40 ＝ 百分之多少？', post: '%', answer: 35 }
        ] },
      { stars: 3, src: '111 年會考 第 14 題',
        pic: c => K.hist(c, { edges: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126, 132, 138, 144], xl: [0, '', 12, '', 24, '', 36, '', 48, '', 60, '', 72, '', 84, '', 96, '', 108, '', 120, '', 132, '', 144], vals: [5, 5, 10, 40, 80, 100, 80, 80, 65, 45, 40, 30, 25, 20, 18, 16, 14, 12, 10, 9, 8, 8, 7, 6], ylab: '人數（萬人）', xlab: '年薪（萬元）', vline: { i: 10, label: '平均數 60 萬元' }, h: 250 }),
        q: '某國主計處調查 2017 年該國所有受僱員工的年薪資料，並公布調查結果如圖的直方圖所示。（註：由於版面限制，無法顯示年薪 144 萬元以上的受僱員工資料）<br>已知總調查人數為 750 萬人，根據圖中資訊計算，該國受僱員工年薪低於平均數的人數占總調查人數的百分率為下列何者？',
        options: [{ t: '6%', why: '只算了很少幾組。' }, { t: '50%', why: '平均數不是正中間（不是中位數），不能直接說一半。' }, { t: '68%', ok: true, why: '60 萬以下共 510 萬人，510 ÷ 750 ＝ 68%。' }, { t: '73%', why: '再加一次平均數左邊的十根：5 ＋ 5 ＋ 10 ＋ 40 ＋ 80 ＋ 100 ＋ 80 ＋ 80 ＋ 65 ＋ 45。' }],
        explain: '<p>平均數 60 萬元左邊有 10 根長條：5 ＋ 5 ＋ 10 ＋ 40 ＋ 80 ＋ 100 ＋ 80 ＋ 80 ＋ 65 ＋ 45 ＝ 510（萬人）。<br>510 ÷ 750 ＝ 0.68 ＝ 68%。答案 (C)。<br>💡 少數人年薪很高，會把平均數拉高，所以超過一半的人年薪低於平均。</p>',
        steps: [
          { q: '「低於平均數 60 萬元」是哪些長條？', options: [{ t: '60 左邊的 10 根', ok: true, why: '每根寬 6 萬元：0 ～ 6、6 ～ 12、…、54 ～ 60。' }, { t: '60 右邊的全部', why: '那是年薪 60 萬以上。' }] },
          { num: true, q: '5 ＋ 5 ＋ 10 ＋ 40 ＋ 80 ＋ 100 ＋ 80 ＋ 80 ＋ 65 ＋ 45 ＝ ？', post: '萬人', answer: 510 },
          { num: true, q: '510 ÷ 750 ＝ 百分之多少？', post: '%', answer: 68, hint: '510 ÷ 750 ＝ 0.68。' }
        ] }
    ]);
  }

  K.run('5-1b', ['先猜猜看：比例與累積', '動手玩：一張表四種看法', '收成 4 句話', '會考題改寫版', '實戰：會考原題與模擬題'], { guess, play, know, exam, real });
})();
