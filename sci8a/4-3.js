/* ===== 理化 4-3 光的折射 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const RAD = Math.PI / 180;
  const N = { water: 1.33, glass: 1.5 }, NN = { water: '水', glass: '玻璃' };

  function refractSim(host, on) {
    host.appendChild(h('<p class="sim-h">光從一種東西斜斜射進另一種東西</p>'));
    const sv = U.svg(host, '0 0 360 200', '', '光的折射', 'sim');
    const read = h('<div class="sim-read"></div>');
    let a = 40, m = 'water', dir = 'in'; const seen = {};
    function draw() {
      const n = N[m], top = dir === 'in' ? '空氣' : NN[m], bot = dir === 'in' ? NN[m] : '空氣';
      const s2 = dir === 'in' ? Math.sin(a * RAD) / n : Math.sin(a * RAD) * n;
      const tir = s2 > 1, b = tir ? null : Math.asin(s2) / RAD;
      const sx = 180 - 95 * Math.sin(a * RAD), sy = 100 - 95 * Math.cos(a * RAD);
      let s = `<rect x="20" y="100" width="320" height="95" fill="${dir === 'in' ? 'var(--water)' : 'var(--bg)'}"/><rect x="20" y="5" width="320" height="95" fill="${dir === 'in' ? 'var(--bg)' : 'var(--water)'}"/>
        <line x1="20" y1="100" x2="340" y2="100" stroke="var(--stroke)" stroke-width="1.5"/><line x1="180" y1="8" x2="180" y2="192" stroke="var(--muted)" stroke-dasharray="5 4"/>
        <text x="28" y="22" class="t14b">${top}</text><text x="28" y="188" class="t14b">${bot}</text>
        <line x1="${sx}" y1="${sy}" x2="180" y2="100" stroke="var(--bad)" stroke-width="3"/>`;
      if (tir) s += `<line x1="180" y1="100" x2="${180 + 95 * Math.sin(a * RAD)}" y2="${sy}" stroke="var(--bad)" stroke-width="3"/><text x="250" y="140" class="t12b">全部反射回來（全反射）</text>`;
      else s += `<line x1="180" y1="100" x2="${180 + 95 * Math.sin(b * RAD)}" y2="${100 + 95 * Math.cos(b * RAD)}" stroke="var(--bad)" stroke-width="3"/>
        <text x="${180 - 26}" y="70" text-anchor="end" class="t12b">${a}°</text><text x="${186}" y="${150}" class="t12b">${Math.round(b)}°</text>`;
      sv.innerHTML = s;
      read.innerHTML = tir ? `入射角 ${a}° 太大了，光出不去，<b>全部反射</b>回${top}裡。` :
        `入射角 <b>${a}°</b> → 折射角 <b>${Math.round(b)}°</b>　` + (a === 0 ? '垂直射入：<b>不轉彎</b>' : b < a ? '折射角變小：光<b>偏向法線</b>' : '折射角變大：光<b>偏離法線</b>');
    }
    U.slider(host, '入射角', { min: 0, max: 80, step: 10, value: a, fmt: v => v + '°' }, v => { a = v; seen['a' + v] = 1; draw(); on(); });
    U.chips(host, '材料', [{ v: 'water', t: '水' }, { v: 'glass', t: '玻璃' }], m, v => { m = v; seen[v] = 1; draw(); on(); });
    U.chips(host, '方向', [{ v: 'in', t: '空氣 → 水／玻璃' }, { v: 'out', t: '水／玻璃 → 空氣' }], dir, v => { dir = v; seen[v] = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  function coinSim(host, on) {
    host.appendChild(h('<p class="sim-h">杯底有一枚硬幣，眼睛的位置固定不動</p>'));
    const sv = U.svg(host, '0 0 360 190', '', '杯底的硬幣', 'sim');
    const read = h('<div class="sim-read"></div>');
    let w = false; const seen = {};
    function draw() {
      let s = `<text x="72" y="26" font-size="22">👁</text>`;
      if (w) s += `<rect x="162" y="72" width="98" height="98" fill="var(--water)"/><line x1="162" y1="72" x2="260" y2="72" stroke="var(--water-line)" stroke-width="2"/>`;
      s += `<path d="M160 70 V172 H262 V70" fill="none" stroke="var(--stroke)" stroke-width="3"/><ellipse cx="248" cy="167" rx="9" ry="3.5" fill="#d9a400" ${ST}/>`;
      if (w) s += `<line x1="248" y1="167" x2="175" y2="72" stroke="var(--bad)" stroke-width="2.5"/><line x1="175" y1="72" x2="88" y2="22" stroke="var(--bad)" stroke-width="2.5"/>
          <line x1="175" y1="72" x2="248" y2="114" stroke="var(--bad)" stroke-dasharray="4 4"/><ellipse cx="248" cy="114" rx="9" ry="3.5" fill="#d9a400" opacity=".5" ${ST}/>
          <text x="270" y="118" class="t12b">看起來在這裡</text><text x="270" y="170" class="t12">真正在這裡</text>`;
      else s += `<line x1="88" y1="22" x2="262" y2="138" stroke="var(--muted)" stroke-dasharray="4 4"/><text x="200" y="40" class="t12b">杯子擋住了，看不到硬幣</text>`;
      sv.innerHTML = s;
      read.innerHTML = w ? '加水以後：光從水射到空氣時轉彎，硬幣<b>看得到了</b>，而且看起來<b>變淺</b>。' : '沒有水：眼睛的視線被杯子邊擋住，<b>看不到</b>硬幣。';
    }
    U.chips(host, '杯子', [{ v: false, t: '空杯' }, { v: true, t: '倒滿水' }], w, v => { w = v; if (v) seen.water = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => U.svg(c, '0 0 320 110', `<rect x="110" y="20" width="100" height="85" fill="none" ${ST}/><rect x="111" y="50" width="98" height="54" fill="var(--water)"/>
          <line x1="130" y1="5" x2="160" y2="50" stroke="#c9a063" stroke-width="5"/><line x1="160" y1="50" x2="176" y2="96" stroke="#c9a063" stroke-width="5"/>`, '插在水裡的筷子'),
        q: '筷子斜斜插進一杯水裡，從旁邊看，筷子在水面的地方好像「斷掉、折彎了」。筷子真的彎了嗎？',
        options: [{ t: '真的彎了' }, { t: '沒有，是光的路線轉彎了', ok: true }],
        reveal: '<b>筷子沒彎，是光轉彎了</b>。光從水跑到空氣時會改變方向。' },
      { q: '站在游泳池邊看，池水看起來比實際……',
        options: [{ t: '比較深' }, { t: '比較淺', ok: true }, { t: '一樣' }],
        reveal: '<b>比較淺</b>！所以池邊會寫「水深 1.5 m」提醒你。下一步看看為什麼。' }
    ]);
  }

  function play(p, api) {
    let A, B;
    const P = U.panes(p, 2);
    const tk = U.tasks(p, api, [
      { text: '拉「入射角」，試試 <b>0°</b> 和其他幾個角度，看光進到水裡怎麼走。', setup() { P.show(0); },
        check: () => A.seen.a0 && Object.keys(A.seen).filter(k => k[0] === 'a').length >= 3,
        qs: () => [{ q: '光從空氣<b>斜斜</b>射進水裡，會往哪邊轉？', hint: '看折射角比入射角大還是小。',
            options: [{ t: '偏向法線（折射角變小）', ok: true, why: '光在水裡跑得比較慢，所以斜射進去會偏向法線。' }, { t: '偏離法線（折射角變大）', why: '看數字：折射角比入射角小。' }, { t: '不轉彎', why: '只有 0°（垂直）才不轉彎。' }] },
          { q: '入射角 0°（垂直射進去）時呢？', options: [{ t: '直直進去，不轉彎', ok: true, why: '垂直入射時，光的速度變了，但方向不變。' }, { t: '一樣會轉彎', why: '把入射角拉到 0° 看看。' }] }] },
      { text: '方向換成「<b>水／玻璃 → 空氣</b>」，再試幾個角度；材料也換成玻璃看看。',
        check: () => A.seen.out && A.seen.glass,
        qs: () => [{ q: '光從水射到空氣時，會往哪邊轉？', options: [{ t: '偏離法線（折射角變大）', ok: true, why: '和進去時剛好相反。角度太大時光甚至出不去，全部反射回來（全反射，光纖就是用這個原理）。' }, { t: '偏向法線', why: '看數字：出來時折射角比入射角大。' }] }] },
      { text: '換到杯底的硬幣：把杯子<b>倒滿水</b>。', setup() { P.show(1); }, check: () => B.seen.water,
        qs: () => [{ q: '加水以後，硬幣看起來在哪裡？', options: [{ t: '比真正的位置高（變淺）', ok: true, why: '光從水射進空氣時偏離法線，眼睛順著光往回看，就以為硬幣在比較高的地方。' }, { t: '比真正的位置低', why: '看半透明的硬幣在哪裡。' }, { t: '一樣', why: '看圖上兩個硬幣的位置。' }] }] }
    ]);
    A = refractSim(P.list[0], () => tk.check()); B = coinSim(P.list[1], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.card(p, '① 折射：光換一種介質時轉彎', '<p>光在不同介質裡速度不同：空氣 ＞ 水 ＞ 玻璃。<br><b>斜斜</b>射入才會轉彎；<b>垂直</b>射入不轉彎。</p>');
    refractSim(U.card(p, '② 進去偏向法線，出來偏離法線', '<p>空氣 → 水、玻璃：<b>偏向</b>法線（折射角變小）。<br>水、玻璃 → 空氣：<b>偏離</b>法線（折射角變大）。</p>'), () => {});
    coinSim(U.card(p, '③ 水中的東西看起來變淺', '<p>筷子看起來折彎、池水看起來變淺、杯底的硬幣「浮起來」，都是折射。</p>'), () => {});
    U.card(p, '④ 生活中的折射', '<p>彩虹、放大鏡、眼鏡、相機鏡頭都是利用折射。<br>看水裡的魚，真正的魚在你看到的位置<b>下面</b>一點。</p>');
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '用魚叉射水中的魚，要瞄準你看到的魚的哪裡？', hint: '水中的東西看起來比較淺。真正的魚比看到的深還是淺？',
      options: [{ t: '下面一點', ok: true, why: '看到的魚比真正的位置高，所以要往下瞄。' }, { t: '上面一點', why: '看到的魚已經比真正的高了，再往上就更偏了。' }, { t: '正對著', why: '光轉彎了，看到的位置不是真正的位置。' }],
      onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開光的折射',
      bench: host => refractSim(host, () => {}),
      qs: [
        { src: '基本題', q: '光從空氣斜射進一塊玻璃，哪一個說法正確？', hint: '空氣 → 玻璃：偏向還是偏離法線？',
          options: [{ t: '光偏向法線，折射角比入射角小', ok: true, why: '光進到比較「慢」的玻璃，會偏向法線。' }, { t: '光偏離法線，折射角比入射角大', why: '那是從玻璃射出到空氣的情形。' },
            { t: '光不會轉彎', why: '斜射一定會轉彎，只有垂直射入才不轉彎。' }, { t: '光全部反射回空氣', why: '從空氣進到玻璃不會全反射。' }] },
        { src: '基本題', q: '為什麼游泳池看起來比實際淺？', hint: '池底的光從水射到空氣時，往哪邊轉？',
          options: [{ t: '池底的光射出水面時偏離法線，眼睛以為池底比較高', ok: true, why: '眼睛會順著進到眼睛的光往回看，所以池底看起來被「抬高」了。' }, { t: '水會把光吸收', why: '吸收只會讓它變暗，不會讓它看起來變淺。' },
            { t: '光在水面全部反射', why: '如果全部反射，就看不到池底了。' }, { t: '因為水是藍色的', why: '顏色和深度看起來怎樣無關。' }] },
        { src: '基本題', pic: c => coinSim(c, () => {}),
          q: '空杯裡的硬幣剛好被杯緣擋住看不到。眼睛不動，把杯子倒滿水，結果會怎樣？',
          hint: '點上面的「倒滿水」試試看。',
          options: [{ t: '看得到硬幣了', ok: true, why: '光從水射出水面時轉彎，繞過了杯緣進到眼睛。' }, { t: '還是看不到', why: '倒水進去看看。' }, { t: '硬幣看起來變深了', why: '看起來是變淺。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  // 小光路圖：上空氣、下水；kind: in 偏向法線, out 偏離法線, straight 不轉彎, back 反射
  const mini = kind => {
    const end = { in: [92, 92], out: [118, 70], straight: [104, 96], back: [104, 4] }[kind];
    return `<svg viewBox="0 0 140 100" width="130" height="92" style="vertical-align:middle;display:block"><rect x="0" y="50" width="140" height="50" fill="var(--water)"/><line x1="0" y1="50" x2="140" y2="50" stroke="var(--stroke)"/>
      <line x1="70" y1="2" x2="70" y2="98" stroke="var(--muted)" stroke-dasharray="3 3"/><text x="4" y="14" font-size="10" fill="currentColor">空氣</text><text x="4" y="94" font-size="10" fill="currentColor">水</text>
      <line x1="36" y1="4" x2="70" y2="50" stroke="#d64545" stroke-width="2.5"/><line x1="70" y1="50" x2="${end[0]}" y2="${end[1]}" stroke="#d64545" stroke-width="2.5"/></svg>`;
  };
  function real(p, api) {
    U.real(p, api, [
      { stars: 2, src: '111 年會考第 14 題',
        q: '下列選項中的四個活動，光線在哪一個活動中<b>不會</b>改變光的傳播方向？',
        options: [{ t: '利用「針孔」成像觀察日食', ok: true, why: '光直直穿過小孔，沒有轉彎（光的直進）。' }, { t: '利用「放大鏡」觀察校園中的花朵', why: '放大鏡是凸透鏡，光穿過時會<b>折射</b>轉彎。' },
          { t: '利用「汽車後照鏡」觀察後方的車輛位置', why: '後照鏡是凸面鏡，光會<b>反射</b>改變方向。' }, { t: '利用「三稜鏡」將陽光分散成七種不同顏色的光', why: '三稜鏡讓光<b>折射</b>，不同色光轉彎程度不同才分開。' }],
        steps: [{ q: '放大鏡讓光怎麼了？', options: [{ t: '折射（穿過時轉彎）', ok: true, why: '放大鏡是凸透鏡。' }, { t: '沒有改變', why: '如果光沒轉彎，東西就不會放大。' }] },
          { q: '汽車後照鏡讓光怎麼了？', options: [{ t: '反射（彈回來，方向改變）', ok: true, why: '鏡子都是反射光。' }, { t: '沒有改變', why: '光打到鏡子會彈回來。' }] },
          { q: '針孔成像時，光穿過小孔會轉彎嗎？', options: [{ t: '不會，直直穿過去', ok: true, why: '所以像才會上下左右顛倒。' }, { t: '會', why: '小孔沒有玻璃，光在空氣中直直走。' }] }],
        explain: '<p>改變光方向的方式：<b>反射</b>（鏡子）、<b>折射</b>（透鏡、三稜鏡、水）。針孔成像只靠<b>光的直進</b>，光沒有轉彎。</p>' },
      { stars: 2, src: '模擬題（會考常見題型）',
        q: '光從空氣<b>斜斜</b>射入水中，下列哪一張光路圖最合理？（虛線是法線）',
        options: [{ t: mini('in'), ok: true, why: '空氣進到水，偏向法線，折射角變小。' }, { t: mini('out'), why: '這張是偏離法線，那是光從水射到空氣時的走法。' }, { t: mini('straight'), why: '只有垂直射入才不轉彎。' }, { t: mini('back'), why: '這是反射，題目問的是射「入」水中的光。' }],
        steps: [{ q: '光從空氣射進水中，會偏向法線還是偏離法線？', options: [{ t: '偏向法線', ok: true, why: '光在水中比較慢，進去時偏向法線。' }, { t: '偏離法線', why: '那是從水出來時。' }] },
          { q: '偏向法線，代表折射角比入射角……', options: [{ t: '小', ok: true, why: '折射光更靠近虛線。' }, { t: '大', why: '偏向法線就是更靠近法線，角變小。' }] }],
        explain: '<p>空氣 → 水、玻璃：<b>偏向法線</b>（折射角 ＜ 入射角）。水、玻璃 → 空氣：<b>偏離法線</b>。垂直入射不轉彎。</p>' },
      { stars: 3, src: '模擬題（會考常見題型）',
        pic: c => U.svg(c, '0 0 320 130', `<rect x="0" y="50" width="320" height="80" fill="var(--water)"/><line x1="0" y1="50" x2="320" y2="50" stroke="var(--water-line)" stroke-width="2"/>
          <text x="40" y="38" font-size="24">👁</text><text x="200" y="88" font-size="22" opacity=".45">🐟</text><text x="236" y="84" class="t12b">看到的魚</text><text x="40" y="120" class="t12">池塘</text>`, '從岸上看水中的魚'),
        q: '小明站在池邊，看到水中有一條魚（如圖）。關於魚真正的位置和原因，下列何者正確？',
        options: [{ t: '在看到的位置<b>下方</b>，因為光從水射入空氣時<b>偏離</b>法線', ok: true, why: '光出水面時偏離法線，眼睛順著光往回看，以為魚在比較高的地方。' },
          { t: '在看到的位置下方，因為光從水射入空氣時偏向法線', why: '位置對，原因錯：水 → 空氣是偏離法線。' },
          { t: '在看到的位置<b>上方</b>，因為光從水射入空氣時偏離法線', why: '水中的東西看起來變「淺」，真正的位置比較深（下方）。' },
          { t: '在看到的位置上方，因為光從水射入空氣時偏向法線', why: '位置和原因都反了。' }],
        steps: [{ q: '讓我們看到魚的光，是從哪裡跑到哪裡？', options: [{ t: '從水裡跑到空氣（再進眼睛）', ok: true, why: '光從魚身上反射出來，穿出水面進到眼睛。' }, { t: '從眼睛跑到水裡', why: '眼睛不會發光。' }] },
          { q: '光從水射入空氣，會偏向還是偏離法線？', options: [{ t: '偏離法線', ok: true, why: '和射入時相反。' }, { t: '偏向法線', why: '那是從空氣進到水裡時。' }] },
          { q: '眼睛順著進來的光往回看，看到的魚比真正的位置……', options: [{ t: '高（淺）', ok: true, why: '所以真正的魚在看到的位置下方。' }, { t: '低（深）', why: '想想杯底的硬幣：加水後看起來浮起來了。' }] }],
        explain: '<p>光從水射入空氣<b>偏離法線</b>，眼睛沿著折射光反方向看回去，看到的是比較高的「虛像」。所以水中物體看起來變淺，真正的位置在<b>下方</b>。</p>' }
    ], '第 1 題是真正的會考題；這一節會考比較少單獨出題，第 2、3 題是照會考題型出的模擬題。由簡單排到難，卡住就按「🪜 拆解」。');
  }

  U.run('4-3', ['先猜猜看：筷子斷掉了嗎？', '動手玩：光轉彎了', '收成 4 句話'], { guess, play, know, exam, real });
})();
