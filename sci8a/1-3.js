/* ===== 理化 1-3 密度：猜 → 玩 → 懂 → 考 ===== */
(function () {
  'use strict';
  const { h, choice, numq } = Unit4;
  const M = Bench.MAT;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const pic = (host, vb, inner, label) => {
    const s = h(`<svg class="u4-pic" viewBox="${vb}" role="img" aria-label="${label}"></svg>`);
    s.innerHTML = inner; host.appendChild(s); return s;
  };

  /* ---------------- 1 猜 ---------------- */
  function guess(p, api) {
    p.appendChild(h('<p class="muted">先猜猜看，猜錯也沒關係，這一步不算分。</p>'));

    const c1 = h('<div class="card"></div>'); p.appendChild(c1);
    const t1 = Bench.tank(c1, [
      { label: '鐵塊', color: M.fe.color, w: 46, h: 46, d: M.fe.d },
      { label: '木塊', color: M.wood.color, w: 46, h: 46, d: M.wood.d }]);
    choice(c1, {
      graded: false,
      q: '一樣大的<b>鐵塊</b>和<b>木塊</b>，同時放進水裡，會怎樣？',
      options: [{ t: '鐵塊沉下去，木塊浮起來', ok: true }, { t: '兩個都沉下去' }, { t: '兩個都浮起來' }],
      onDone(op, fb) {
        t1.drop();
        fb.className = 'feedback show ' + (op.ok ? 'good' : '');
        fb.innerHTML = (op.ok ? '<b>猜對了！</b>' : '<b>看結果：</b>') + '鐵塊沉、木塊浮。你可能會想：「因為鐵比較重嘛。」那下一題呢？';
        c2.hidden = false;
      }
    });

    const c2 = h('<div class="card" hidden></div>'); p.appendChild(c2);
    const t2 = Bench.tank(c2, [
      { label: '小鐵釘（很輕）', color: M.fe.color, w: 7, h: 30, d: M.fe.d },
      { label: '大木頭（很重）', color: M.wood.color, w: 120, h: 50, d: M.wood.d }]);
    choice(c2, {
      graded: false,
      q: '一根很輕的<b>小鐵釘</b>，和一塊很重的<b>大木頭</b>。放進水裡會怎樣？',
      options: [{ t: '大木頭比較重，所以木頭沉、鐵釘浮' }, { t: '鐵釘沉下去，大木頭浮起來', ok: true }, { t: '兩個都沉下去' }],
      onDone(op, fb) {
        t2.drop();
        fb.className = 'feedback show ' + (op.ok ? 'good' : '');
        fb.innerHTML = (op.ok ? '<b>猜對了！</b>' : '<b>看結果：</b>') +
          '鐵釘那麼輕卻沉了，木頭那麼重卻浮著。<br>所以<b>沉不沉，不是看「誰比較重」</b>。那到底是看什麼？下一步自己動手找答案。';
        api.done();
      }
    });
  }

  /* ---------------- 2 玩 ---------------- */
  function play(p, api) {
    const task = h('<div class="card u4-task"></div>'); p.appendChild(task);
    const bc = h('<div class="card"></div>'); p.appendChild(bc);
    const bench = Bench.density(bc, { mat: 'fe', V: 50 });
    let ti = 0, asked = false, cut = false;

    const T = [
      { text: '選一種材料（例如<b>鐵</b>），拉「大小」換 <b>3 種不同大小</b>，每一種都按「📌 記錄這一筆」。',
        check() { return Object.values(bench.groups()).find(g => g.length >= 3); },
        qs(g) {
          return [{
            q: `看上面的圖，${g[0].name}的這幾個點排成什麼樣子？`,
            hint: '用手指順著點比一比，從左下角開始。',
            options: [
              { t: '排成一條斜斜的直線', ok: true, why: '越大塊就越重，而且是「整整齊齊」一起變大。' },
              { t: '排成彎彎的曲線', why: '再看一次圖，點和點之間是直的還是彎的？' },
              { t: '亂亂的，沒有規則', why: '再看一次圖，是不是可以用一把尺連起來？' }],
            then() {
              bench.showRatio(true);
              found(`表格多了黃色的一欄「<b>質量÷體積</b>」。<br>同一種材料，不管大塊小塊，這個數字<b>都一樣</b>（${g[0].name}都是 ${M[g[0].key].d}）。`);
            }
          }];
        } },
      { text: '換<b>另一種材料</b>，再記錄 <b>2 筆</b>（兩種不同大小）。',
        check() { const gs = Object.values(bench.groups()).filter(g => g.length >= 2); return gs.length >= 2 ? gs : null; },
        qs(gs) {
          const a = gs[0][0], b = gs[gs.length - 1][0];
          const hi = M[a.key].d > M[b.key].d ? a : b, lo = hi === a ? b : a;
          return [{
            q: '現在圖上有兩條線。哪一條比較<b>陡</b>（爬得比較快）？',
            hint: '陡＝往右走一點點，就往上爬很多。',
            options: [a, b].map(x => ({
              t: x.name + ' 的線', ok: x === hi,
              why: x === hi ? `${hi.name}的「質量÷體積」是 ${M[hi.key].d}，${lo.name}是 ${M[lo.key].d}。<b>數字越大，線越陡</b>：同樣大小，${hi.name}比較重。`
                : '比比看：同樣往右走到 50，哪一條線爬得比較高？'
            }))
          }];
        } },
      { text: '按「✂ 切一半」，把現在這一塊切成一半。看看天平和量筒的數字。',
        check() { return cut; },
        qs() {
          return [{
            q: '切一半以後，質量變一半，體積也變一半。那「質量÷體積」呢？',
            hint: '看表格黃色那一欄，切之前和切之後各是多少？',
            options: [
              { t: '沒有變', ok: true, why: '切開還是同一種東西，所以這個數字不會變。' },
              { t: '也變成一半', why: '質量和體積「一起」變一半，相除之後呢？看看表格。' },
              { t: '變成兩倍', why: '看看表格黃色那一欄，切之前和切之後的數字。' }]
          }, {
            q: '最後一個發現：每種材料都點點看，看 ③ 水槽。<b>會浮起來</b>的材料，「質量÷體積」都是……',
            hint: '木頭是 0.6、冰塊是 0.9，它們會浮。鋁 2.7、鐵 7.9、銅 8.9 會沉。水剛好是 1。',
            options: [
              { t: '比 1 小', ok: true, why: '水的「質量÷體積」剛好是 1。比水小就浮，比水大就沉，<b>跟東西大塊小塊沒有關係</b>。這就是鐵釘沉、大木頭浮的原因！' },
              { t: '比 1 大', why: '點「木頭」和「冰塊」，再記錄一筆，看黃色那一欄。' },
              { t: '不一定，要看大小', why: '把木頭拉到最大、鐵拉到最小試試看，結果有變嗎？' }]
          }];
        } }
    ];

    function found(html) { bench.slot.appendChild(h(`<div class="u4-found">🔎 <b>發現：</b>${html}</div>`)); }
    function showTask() {
      asked = false; bench.slot.innerHTML = '';
      task.innerHTML = `<div class="u4-taskno">任務 ${ti + 1} / ${T.length}</div><div class="u4-tasktext">${T[ti].text}</div>`;
      check();
    }
    function check() {
      if (asked || ti >= T.length) return;
      const r = T[ti].check();
      if (!r) return;
      asked = true;
      task.querySelector('.u4-tasktext').insertAdjacentHTML('beforeend', ' <b style="color:var(--good)">✔ 做到了</b>');
      bench.say('任務做到了！回答下面框框裡的問題。');
      ask(T[ti].qs(r), 0);
      bench.slot.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
    function ask(qs, i) {
      if (i >= qs.length) { finish(); return; }
      choice(bench.slot, { q: qs[i].q, options: qs[i].options, hint: qs[i].hint, onDone() { if (qs[i].then) qs[i].then(); ask(qs, i + 1); } });
    }
    function finish() {
      const last = ti === T.length - 1;
      const b = h(`<div class="row"><button type="button" class="btn primary">${last ? '下一步：懂 →' : '下一個任務 →'}</button></div>`);
      if (last) {
        api.done();
        found('你剛剛自己發現了 4 件事。下一步把它們整理成 4 句話。');
        b.firstChild.addEventListener('click', () => api.next());
      } else {
        b.firstChild.addEventListener('click', () => { ti++; showTask(); task.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
      }
      bench.slot.appendChild(b);
    }
    bench.on('record', check);
    bench.on('cut', () => { cut = ti === 2 || cut; check(); });
    showTask();
  }

  /* ---------------- 3 懂 ---------------- */
  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    const card = (title, body) => {
      const c = h(`<div class="card u4-know"><div><h3>${title}</h3>${body}</div><div class="pic"></div></div>`);
      p.appendChild(c); return c.querySelector('.pic');
    };

    // ① 定義
    let s = '';
    [['木頭', M.wood.color, '0.6 g'], ['水', 'var(--water)', '1 g'], ['鋁', M.al.color, '2.7 g'], ['鐵', M.fe.color, '7.9 g'], ['銅', M.cu.color, '8.9 g']].forEach((x, i) => {
      const cx = 32 + i * 64;
      s += `<rect x="${cx - 18}" y="30" width="36" height="36" rx="3" fill="${x[1]}" ${ST}/>
        <text x="${cx}" y="20" text-anchor="middle" class="b-lab">${x[0]}</text>
        <text x="${cx}" y="84" text-anchor="middle" class="b-lab">${x[2]}</text>`;
    });
    s += '<text x="160" y="104" text-anchor="middle" class="g-lab">每一塊都是 1 cm³（一樣大）</text>';
    pic(card('① 密度＝質量 ÷ 體積',
      `<p>你剛剛算的「質量÷體積」，名字就叫<b>密度</b>。<br>意思是：<b>1 cm³（一小格）有多重</b>。</p>
       <div class="formula">密度 ＝ 質量 ÷ 體積</div>
       <p class="small muted">單位寫成 g/cm³，念作「公克每立方公分」。量筒上的 1 mL 就是 1 cm³。</p>`),
      '0 0 320 110', s, '一樣大的五種材料，質量不同');

    // ② 同物質密度相同
    pic(card('② 同一種東西，密度都一樣',
      '<p>大鐵塊、小鐵塊、切一半的鐵塊，密度都是 7.9。<br>所以<b>密度可以用來認東西</b>：算出來是 7.9，就知道它是鐵。</p>'),
      '0 0 320 120',
      `<rect x="50" y="52" width="26" height="26" rx="3" fill="${M.fe.color}" ${ST}/>
       <rect x="196" y="22" width="56" height="56" rx="3" fill="${M.fe.color}" ${ST}/>
       <text x="63" y="96" text-anchor="middle" class="g-num">79 g ÷ 10 cm³</text><text x="63" y="113" text-anchor="middle" class="b-lab">＝ 7.9</text>
       <text x="224" y="96" text-anchor="middle" class="g-num">395 g ÷ 50 cm³</text><text x="224" y="113" text-anchor="middle" class="b-lab">＝ 7.9</text>`,
      '小鐵塊和大鐵塊的密度都是 7.9');

    // ③ M-V 圖
    Bench.mvGraph(card('③ 圖上的線越陡，密度越大',
      '<p>把質量和體積畫成圖：同一種東西的點，會排成<b>一條通過左下角的直線</b>。<br>線越陡，代表同樣大小它越重，也就是<b>密度越大</b>。</p>'),
      [...Bench.pts('cu', [20, 60]), ...Bench.pts('al', [20, 60]), ...Bench.pts('wood', [20, 60])], { lines: true });

    // ④ 浮沉
    Bench.tank(card('④ 密度比水小會浮，比水大會沉',
      '<p>水的密度是 <b>1</b> g/cm³。<br>比 1 小 → 浮；比 1 大 → 沉。<br><b>跟東西有多大、有多重沒關係。</b></p>'),
      [{ label: '木頭', sub: '0.6', color: M.wood.color, w: 40, h: 40, d: .6 }, { label: '冰塊', sub: '0.9', color: M.ice.color, w: 40, h: 40, d: .9 },
       { label: '鋁', sub: '2.7', color: M.al.color, w: 40, h: 40, d: 2.7 }, { label: '鐵', sub: '7.9', color: M.fe.color, w: 40, h: 40, d: 7.9 }],
      { settled: true });

    // 小檢查
    const c = h('<div class="card"><h3>✏️ 算一題看看</h3></div>'); p.appendChild(c);
    pic(c, '0 0 320 96',
      `<rect x="26" y="20" width="46" height="46" rx="3" fill="${M.al.color}" ${ST}/>
       <text x="49" y="86" text-anchor="middle" class="b-lab">不知道是什麼金屬</text>
       <text x="130" y="38" class="b-lab">天平：質量 54 g</text><text x="130" y="60" class="b-lab">量筒：體積 20 cm³</text>`,
      '一塊金屬，質量 54 公克，體積 20 立方公分');
    numq(c, {
      q: '一塊金屬，質量 <b>54 g</b>，體積 <b>20 cm³</b>。它的密度是多少？',
      pre: '54 ÷ 20 ＝', post: 'g/cm³', answer: 2.7,
      hint: '密度＝質量÷體積。54 ÷ 20，可以想成 5.4 ÷ 2。',
      diag: [{ v: 1080, msg: '是「除」不是「乘」：54 <b>÷</b> 20。' }, { v: 0.37, msg: '順序反了。<b>質量放前面</b>：54 ÷ 20。' }, { v: 34, msg: '不是相減，是相除：54 ÷ 20。' }],
      why: '密度是 2.7 g/cm³，跟上面第 ① 張圖對一下，就知道它是<b>鋁</b>。',
      onDone() { api.done(); }
    });
  }

  /* ---------------- 4 考 ---------------- */
  function exam(p, api) {
    p.appendChild(h('<p class="muted">這 3 題都是從真正的會考題改寫的。答錯可以再選，不用怕。</p>'));
    const d = h('<details class="card u4-open"><summary>🔬 想試試看？打開實驗台</summary><div></div></details>');
    p.appendChild(d);
    d.addEventListener('toggle', () => { if (d.open && !d.dataset.r) { d.dataset.r = 1; Bench.density(d.lastElementChild, { showRatio: true }); } });

    let left = 3;
    const ok = () => { if (--left === 0) api.done(); };
    const qcard = (n, src) => { const c = h(`<div class="card"><h3>第 ${n} 題 <span class="u4-src">（${src}）</span></h3></div>`); p.appendChild(c); return c; };

    // 104-11
    const c1 = qcard(1, '改寫自 104 年會考');
    Bench.mvGraph(c1, [10, 20, 40, 60, 80].map(V => ({ key: 'x', name: '', color: '#b9a7e8', V, M: 2.7 * V })), {}).style.maxWidth = '360px';
    choice(c1, {
      q: '小莉有 5 顆大小不同的實心金屬球。她用<b>排水法</b>量每顆球的體積，用<b>天平</b>量質量，再把結果畫成上面的圖。<br>她發現 5 個點剛好連成<b>一條通過原點的直線</b>。哪一個說法最能解釋這件事？',
      hint: '打開上面的實驗台：同一種材料記錄 3 筆，點會怎麼排？換另一種材料，還在同一條線上嗎？',
      options: [
        { t: '這些金屬球的密度相同', ok: true, why: '在同一條通過原點的直線上，代表每一顆的「質量÷體積」都一樣，也就是密度相同（很可能是同一種金屬）。', },
        { t: '這些金屬球的形狀相同', why: '形狀一樣，但如果材料不同（例如鐵球和鋁球），點就不會在同一條線上。' },
        { t: '這些金屬球的質量相同', why: '看圖：5 個點的高度都不一樣，表示質量不同。' },
        { t: '量體積的方法相同', why: '用同樣的方法量鐵和鋁，還是會得到兩條不同的線。' }],
      onDone: ok
    });

    // 114-2
    const c2 = qcard(2, '改寫自 114 年會考');
    pic(c2, '0 0 320 80',
      `<path d="M40 52 C34 34 52 20 70 24 C86 16 104 30 100 46 C108 60 88 70 70 66 C54 72 42 66 40 52Z" fill="#a9a397" ${ST}/>
       <text x="120" y="42" class="b-lab">形狀不規則的小石頭</text><text x="120" y="60" class="g-num">凹凹凸凸，沒有固定的長、寬、高</text>`, '形狀不規則的小石頭').style.maxWidth = '360px';
    choice(c2, {
      q: '小陞想量出這顆<b>形狀不規則的小石頭</b>的密度。他應該選哪兩樣器材？',
      hint: '密度＝質量÷體積。質量用什麼量？這種形狀的體積又要怎麼量？看看實驗台的 ① 和 ②。',
      options: [
        { t: '直尺 和 天平', why: '天平可以量質量。可是石頭凹凹凸凸，用直尺量不出體積。' },
        { t: '天平 和 裝水的量筒', ok: true, why: '天平量質量；把石頭放進量筒，水面上升多少，石頭的體積就是多少（排水法）。兩個相除就是密度。' },
        { t: '裝水的量筒 和 溫度計', why: '量筒可以量體積，但還少了「質量」。溫度計量不出質量。' },
        { t: '直尺 和 碼表', why: '這兩樣都量不到質量，也量不到這顆石頭的體積。' }],
      onDone: ok
    });

    // 111-38
    const c3 = qcard(3, '挑戰題・改寫自 111 年會考');
    pic(c3, '0 0 320 100',
      `<circle cx="60" cy="50" r="40" fill="${M.cu.color}" ${ST}/><circle cx="60" cy="50" r="24" fill="var(--card)" ${ST}/>
       <text x="60" y="54" text-anchor="middle" class="g-num">空的</text>
       <text x="118" y="34" class="b-lab">空心銅球（切開來看）</text>
       <text x="118" y="54" class="g-num">外殼是純銅，裡面是空的（真空）</text>
       <text x="118" y="72" class="g-num">純銅的密度：8.96 g/cm³</text>`, '空心銅球的剖面').style.maxWidth = '360px';
    choice(c3, {
      q: '一顆密閉的<b>空心銅球</b>，放進水裡會完全沉下去。小詩用排水法量出它的體積 V，用天平量出質量 M，再算 D＝M÷V。<br>她的測量和計算都沒有錯，但 D 和純銅的密度 8.96 明顯不同。哪一個說法最合理？',
      hint: '想像兩顆外表一樣大的銅球，一顆實心、一顆空心。排開的水一樣多（V 一樣），但哪一顆比較輕？',
      options: [
        { t: 'D 比 8.96 大，因為空心的部分也有質量', why: '空心的部分是真空，裡面什麼都沒有，質量是 0。' },
        { t: 'D 比 8.96 小，因為 V 把空心的部分也算進去了', ok: true, why: '排水法量到的是「整顆球」的體積，包含空心。體積算多了、質量沒有變多，所以 M÷V 會比純銅的 8.96 小。' },
        { t: 'D 比 8.96 大，因為銅球泡在水裡會變重', why: '東西泡在水裡，質量不會改變。' },
        { t: 'D 比 8.96 小，因為銅泡水以後質量變小了', why: '東西泡在水裡，質量不會改變。變的是別的東西：想想 V 量到的是什麼。' }],
      onDone: ok
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    Unit4.mount(document.getElementById('unit'), {
      unit: 'sci8a-1-3', home: 'index.html',
      steps: [
        { id: 'guess', label: '猜', title: '先猜猜看：誰會沉下去？', render: guess },
        { id: 'play', label: '玩', title: '動手玩：密度實驗台', render: play },
        { id: 'know', label: '懂', title: '收成 4 句話', render: know },
        { id: 'exam', label: '考', title: '會考真的這樣考', render: exam }
      ]
    });
  });
})();
