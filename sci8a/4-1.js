/* ===== 理化 4-1 光的傳播 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const LAMP = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#f2c230" ${ST}/><text x="${x}" y="${y - 14}" text-anchor="middle" class="t12b">燈</text>`;

  /* 影子：點光源、物體、屏幕 */
  function shadowSim(host, on) {
    host.appendChild(h('<p class="sim-h">燈、一根小棒子、一面牆</p>'));
    const sv = U.svg(host, '0 0 360 190', '', '影子', 'sim');
    const read = h('<div class="sim-read"></div>');
    let d = 150; const seen = {};
    function draw() {
      const ox = 30 + d, H = 20, sh = H * 300 / d, top = 95 - sh / 2;
      sv.innerHTML = `<rect x="330" y="10" width="14" height="170" fill="var(--line)" ${ST}/>
        <polygon points="30,95 330,${top} 330,${top + sh}" fill="#f2c230" opacity=".15"/>
        <line x1="30" y1="95" x2="330" y2="${top}" stroke="#d9a400" stroke-width="1.5"/><line x1="30" y1="95" x2="330" y2="${top + sh}" stroke="#d9a400" stroke-width="1.5"/>
        <rect x="${ox - 3}" y="${95 - H / 2}" width="6" height="${H}" fill="#7a8699" ${ST}/>
        <rect x="326" y="${top}" width="8" height="${sh}" fill="#333"/>${LAMP(30, 95)}
        <text x="337" y="188" text-anchor="middle" class="t12b">牆</text>`;
      read.innerHTML = `棒子高 10 cm，離燈 ${d} cm　→　牆上的影子高 <b>${Math.round(10 * 300 / d)} cm</b>`;
    }
    U.slider(host, '棒子離燈多遠', { min: 60, max: 240, step: 30, value: d, fmt: v => v + ' cm' }, v => { d = v; seen[v <= 90 ? 'near' : v >= 210 ? 'far' : 'mid'] = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  /* 針孔成像 */
  function pinholeSim(host, on) {
    host.appendChild(h('<p class="sim-h">針孔成像：蠟燭的光穿過小孔，照在後面的半透明紙上</p>'));
    const sv = U.svg(host, '0 0 360 200', '', '針孔成像', 'sim');
    const read = h('<div class="sim-read"></div>');
    let D = 80, L = 80; const seen = {};
    function draw() {
      const cx = 180 - D, sx = 180 + L, ih = 40 * L / D;
      sv.innerHTML = `<line x1="180" y1="20" x2="180" y2="96" stroke="var(--stroke)" stroke-width="4"/><line x1="180" y1="104" x2="180" y2="185" stroke="var(--stroke)" stroke-width="4"/>
        <rect x="180" y="20" width="${L + 6}" height="165" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>
        <line x1="${sx}" y1="20" x2="${sx}" y2="185" stroke="var(--accent)" stroke-width="3"/>
        <line x1="${cx}" y1="60" x2="${sx}" y2="${100 + ih}" stroke="#d9a400" stroke-width="1.5"/><line x1="${cx}" y1="100" x2="${sx}" y2="100" stroke="#d9a400" stroke-width="1.5"/>
        <rect x="${cx - 5}" y="60" width="10" height="40" fill="#f6e7c1" ${ST}/><path d="M${cx} 60 c-6 -8 -2 -14 0 -20 c3 6 6 12 0 20Z" fill="#f6a54b"/>
        <rect x="${sx - 4}" y="100" width="8" height="${ih}" fill="#f6e7c1" opacity=".85" ${ST}/><path d="M${sx} ${100 + ih} c-5 6 -2 11 0 16 c3 -5 5 -10 0 -16Z" fill="#f6a54b" opacity=".85"/>
        <text x="180" y="14" text-anchor="middle" class="t12b">小孔</text><text x="${cx}" y="196" text-anchor="middle" class="t12">蠟燭</text><text x="${sx}" y="14" text-anchor="middle" class="t12b" style="fill:var(--accent)">紙</text>`;
      read.innerHTML = `紙上的像是<b>倒立</b>的　像高 ＝ 4 cm × ${L} ÷ ${D} ＝ <b>${(4 * L / D).toFixed(1)} cm</b>`;
    }
    U.slider(host, '蠟燭到小孔的距離', { min: 40, max: 120, step: 20, value: D, fmt: v => v / 10 + ' cm' }, v => { D = v; seen.D = 1; draw(); on(); });
    U.slider(host, '紙到小孔的距離', { min: 40, max: 160, step: 20, value: L, fmt: v => v / 10 + ' cm' }, v => { L = v; seen.L = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '晚上開燈，把手靠近燈泡，牆上手的影子會……',
        options: [{ t: '變大', ok: true }, { t: '變小' }, { t: '不變' }],
        reveal: '<b>變大</b>。為什麼？下一步移動棒子看看光是怎麼走的。' },
      { q: '在紙盒上戳一個小洞，對著蠟燭。紙盒裡看到的蠟燭是……',
        options: [{ t: '正的' }, { t: '倒過來的', ok: true }, { t: '什麼都看不到' }],
        reveal: '<b>倒過來的</b>！這叫針孔成像，相機就是從這裡發明的。' }
    ]);
  }

  function play(p, api) {
    let A, B;
    const P = U.panes(p, 2);
    const tk = U.tasks(p, api, [
      { text: '把棒子<b>移到最靠近燈</b>，再<b>移到最靠近牆</b>，看影子大小。', setup() { P.show(0); },
        check: () => A.seen.near && A.seen.far,
        qs: () => [{ q: '棒子越靠近燈，影子會……', options: [{ t: '越大', ok: true, why: '光從燈沿<b>直線</b>射出去，越靠近燈，擋住的範圍張得越開。' }, { t: '越小', why: '把棒子拉到 60 cm 看看影子多大。' }] },
          { q: '為什麼會有影子？', options: [{ t: '光走直線，被東西擋住的地方照不到', ok: true, why: '這就是<b>光的直進性</b>。日食、月食也是同一個道理。' }, { t: '東西會吸走旁邊的光', why: '光是直直走過去被擋住，不是被吸走。' }] }] },
      { text: '換到針孔成像：看看紙上蠟燭的像。', setup() { P.show(1); }, quiet: true, check: () => true,
        qs: () => [{ q: '紙上的像是正的還是倒的？', hint: '看火焰在上面還是下面。',
          options: [{ t: '倒的', ok: true, why: '蠟燭上面的光直直穿過小孔，會跑到紙的下面；下面的光跑到上面。所以上下顛倒，左右也顛倒。' }, { t: '正的', why: '看火焰：在紙上是朝上還是朝下？' }] }] },
      { text: '拉「紙到小孔的距離」，把紙移遠、移近。', check: () => B.seen.L,
        qs: () => [{ q: '紙離小孔越遠，像會……', options: [{ t: '越大', ok: true, why: '光線穿過小孔後一直張開，越遠張得越大。<b>像高 ÷ 物高 ＝ 像距 ÷ 物距</b>。' }, { t: '越小', why: '把紙拉到最遠，看像的高度數字。' }, { t: '不變', why: '看下面像高的數字有沒有變。' }] }] }
    ]);
    A = shadowSim(P.list[0], () => tk.check());
    B = pinholeSim(P.list[1], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.svg(U.card(p, '① 光沿直線前進',
      '<p>在同一種介質裡，光走<b>直線</b>（直進性）。所以有影子、日食、月食。<br><b>月食</b>：地球擋住了照向月球的太陽光。</p>'),
      '0 0 320 90', `<circle cx="40" cy="45" r="24" fill="#f2c230" ${ST}/><circle cx="170" cy="45" r="16" fill="var(--water-line)" ${ST}/><circle cx="280" cy="45" r="7" fill="#555" ${ST}/>
        <text x="40" y="84" text-anchor="middle" class="t12b">太陽</text><text x="170" y="84" text-anchor="middle" class="t12b">地球</text><text x="280" y="84" text-anchor="middle" class="t12b">月球（月食）</text>
        <polygon points="186,33 300,40 300,50 186,57" fill="#000" opacity=".25"/>`, '月食：地球在太陽和月球中間');
    U.card(p, '② 光跑得最快，真空也能傳',
      '<p>光速大約 <b>3 億 m/s</b>（3×10⁸ m/s），1 秒繞地球 7 圈半。<br>打雷時先看到閃電、再聽到雷聲，因為光比聲音快很多。</p>');
    pinholeSim(U.card(p, '③ 針孔成像：倒立的實像',
      '<p>上下、左右都相反（轉了半圈）。<br>像高 ÷ 物高 ＝ 像距 ÷ 物距。紙離小孔越遠，像越大但越暗。</p>'), () => {});
    U.card(p, '④ 看得到東西，是因為光進到眼睛',
      '<p><b>發光體</b>（太陽、燈）自己發光；其他東西是<b>反射</b>光進到我們眼睛，我們才看得到。全黑的房間什麼都看不到。</p>');
    U.card(p, '補充：光年是「距離」', '<p>1 光年＝光走一年的距離（約 9.5 兆公里）。星星離我們幾百光年，我們今天看到的星光，是它幾百年前發出的。</p>');
    const c = h('<div class="card"><h3>✏️ 算一題看看</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '蠟燭高 <b>6 cm</b>，離小孔 <b>20 cm</b>；紙離小孔 <b>10 cm</b>。紙上的像有多高？', post: 'cm', answer: 3,
      hint: '像高 ÷ 6 ＝ 10 ÷ 20。', diag: [{ v: 12, msg: '紙比較近，像應該比較小。像高 ＝ 6 × 10 ÷ 20。' }], why: '6 × 10 ÷ 20 ＝ 3 cm，而且是倒立的。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開針孔成像',
      bench: host => pinholeSim(host, () => {}),
      qs: [
        { src: '改寫自 105 年會考', q: '「月食」主要是發生了什麼事？', hint: '想想知識卡 ① 的圖：誰擋住了誰的光？',
          options: [{ t: '地球擋住了照向月球的太陽光', ok: true, why: '太陽、地球、月球排成一直線，地球在中間，月球進入地球的影子裡。' }, { t: '月球擋住了照向地球的太陽光', why: '這是日食。' },
            { t: '太陽擋住了月球', why: '太陽在最外面發光，不會擋住月球。' }, { t: '雲把月亮遮住了', why: '那只是被雲遮住，不是月食。' }] },
        { src: '基本題', pic: c => U.svg(c, '0 0 320 70', '<text x="40" y="52" font-size="40" font-weight="700">F</text><text x="90" y="42" class="t12">形狀的燈 → 小孔 → 紙上的像？</text>', 'F 形狀的燈'),
          q: '用「F」形狀的燈做針孔成像，從紙的背面看，像會長怎樣？', hint: '針孔成像：上下相反、左右也相反。',
          options: [{ t: '和 F 一樣', why: '針孔成像是倒的。' }, { t: '只有上下顛倒', why: '左右也會相反。' }, { t: '上下、左右都顛倒（像 F 轉了半圈）', ok: true, why: '每一點的光都穿過同一個小孔交叉過去，所以上下左右都相反。' }] },
        { src: '基本題', q: '太陽光大約要 500 秒才照到地球。如果太陽突然熄滅，我們什麼時候會發現？',
          hint: '光從太陽跑到地球要時間。',
          options: [{ t: '馬上就會發現', why: '光雖然很快，也要時間才能跑完這麼遠。' }, { t: '大約 8 分鐘後', ok: true, why: '500 秒 ≈ 8 分 20 秒。我們看到的太陽，其實是 8 分鐘前的樣子。' }, { t: '永遠不會發現', why: '光跑到之後就會發現了。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '105 年會考第 19 題',
        q: '月食現象主要是指下列何種狀況？',
        options: [{ t: '地球遮住月球所反射出的光', why: '如果只是擋住「月球反射的光」，那只有站在被擋住的地方的人看不到；月食是月球本身照不到太陽，全世界看得到月亮的地方都會看到。' },
          { t: '太陽遮住月球所反射出的光', why: '太陽是光源，在最外側，不會擋在地球和月球中間。' },
          { t: '月球遮住太陽射向地球的光', why: '這是<b>日食</b>：月球跑到太陽和地球中間。' },
          { t: '地球遮住太陽射向月球的光', ok: true, why: '太陽→地球→月球排成一直線，月球進到地球的影子裡。' }],
        steps: [{ q: '月食時月亮變暗，是因為月亮跑進了誰的影子裡？', options: [{ t: '地球的影子', ok: true, why: '對，地球擋在太陽和月球中間。' }, { t: '太陽的影子', why: '太陽自己發光，沒有影子。' }, { t: '雲的影子', why: '雲擋住只是「被遮住」，不是月食。' }] },
          { q: '那麼，被地球擋住的是哪一道光？', options: [{ t: '太陽照向月球的光', ok: true, why: '月球照不到太陽光，就變暗了。' }, { t: '月球反射到地球的光', why: '月球本身照不到光，根本沒有光可以反射。' }] }],
        explain: '<p>月食：<b>太陽→地球→月球</b>排成一直線，地球擋住太陽射向月球的光。日食：太陽→月球→地球，月球擋住太陽射向地球的光。兩個都是<b>光直線前進</b>造成的影子。</p>' },
      { stars: 2, src: '112 年會考',
        pic: c => U.svg(c, '0 0 320 110', '<rect x="0" y="86" width="320" height="24" fill="#c9a063"/><text x="40" y="44" font-size="30">🔦</text><text x="150" y="80" font-size="40">🧍</text><text x="270" y="80" font-size="30">👀</text><text x="270" y="102" text-anchor="middle" class="t12b">觀眾</text><text x="40" y="70" text-anchor="middle" class="t12b">聚光燈</text>', '舞臺上的聚光燈、演員和觀眾'),
        q: '舞臺劇演出時，燈光師用聚光燈照射演員，讓觀眾能看見演員的表演。關於觀眾能看見演員的原因，下列敘述何者最合理？',
        options: [{ t: '聚光燈發出的光線照射在演員上，演員<b>吸收</b>這些光線，因此觀眾能看見演員', why: '光如果全被吸收，就沒有光進到觀眾眼睛，演員看起來是黑的。' },
          { t: '聚光燈發出的光線照射在演員上，演員<b>折射</b>這些光線，因此觀眾能看見演員', why: '折射是光「穿過」透明物體時轉彎。演員不是透明的。' },
          { t: '聚光燈發出的光線照射在演員上，演員<b>反射</b>這些光線，因此觀眾能看見演員', ok: true, why: '光打到演員身上「彈」到觀眾眼睛裡。' },
          { t: '觀眾眼睛發出的光線照射在演員上，演員折射這些光線，因此觀眾能看見演員', why: '眼睛是「接收」光，不會發出光。' }],
        steps: [{ q: '演員自己會發光嗎？', options: [{ t: '不會，他不是發光體', ok: true, why: '人不是燈，自己不會發光。' }, { t: '會', why: '關燈時就看不到演員了，所以他自己不會發光。' }] },
          { q: '觀眾眼睛收到的光，是從哪裡來的？', options: [{ t: '聚光燈的光打到演員，再從演員身上彈到觀眾眼睛', ok: true, why: '這就是我們看見「不發光的東西」的方法。' }, { t: '觀眾的眼睛發出光，照到演員', why: '眼睛只接收光，不會發光。' }] },
          { q: '光碰到東西「彈回來」，叫做什麼？', options: [{ t: '反射', ok: true, why: '對。' }, { t: '折射', why: '折射是穿過去時轉彎。' }, { t: '吸收', why: '吸收是光被吃掉，不會彈回來。' }] }],
        explain: '<p>看得見東西，是因為有光進到眼睛。不會發光的東西，要靠光源照到它，再<b>反射</b>到我們眼睛。</p>' },
      { stars: 2, src: '109 年會考',
        pic: c => U.svg(c, '0 0 320 130', `<polyline points="60,90 120,30 230,40 260,100 60,90" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>${[[60, 90, 'X'], [260, 100, 'Y'], [120, 30, ''], [230, 40, '']].map(([x, y, t]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f2c230" stroke="var(--stroke)"/><text x="${x}" y="${y + 20}" text-anchor="middle" class="t14b">${t}</text>`).join('')}`, '星座的大四邊形，有 X、Y 兩顆星'),
        q: '某星座的主要亮星可以連成一個大四邊形，其中包括 X、Y 兩顆恆星，如圖。已知 X 星距離地球約 335 光年，Y 星距離地球約 140 光年，下列敘述何者最合理？',
        options: [{ t: 'Y 星發出的光到達地球需要花 140 天', why: '光年是光走一「年」的距離，所以要花 140 <b>年</b>。' },
          { t: 'X、Y 兩星與太陽系皆位於不同的星系之中', why: '幾百光年對宇宙來說很近，它們都和太陽一樣在<b>銀河系</b>裡（銀河系直徑約 10 萬光年）。' },
          { t: 'X 星發出的光比 Y 星發出的光更快傳到地球', why: '光速都一樣快。X 星比較遠，它的光反而要花比較久才到。' },
          { t: '現在所觀察到的 X 星約是它 335 年前時的情況', ok: true, why: '我們今天看到的光，是 X 星在 335 年前發出的。' }],
        steps: [{ q: '「1 光年」是什麼？', options: [{ t: '光走一年的距離', ok: true, why: '光年是<b>距離</b>的單位，不是時間。' }, { t: '一年的時間', why: '「光年」雖然有年，但它是距離。' }, { t: '光的速度', why: '光速是 3 億 m/s，光年是光以這個速度走一年的距離。' }] },
          { q: 'X 星的光要走多久，才會到達地球？', options: [{ t: '335 年', ok: true, why: '距離 335 光年，光就要走 335 年。' }, { t: '335 天', why: '光年是走一「年」的距離。' }, { t: '一瞬間', why: '光雖然很快，但這距離非常遠。' }] }],
        explain: '<p><b>光年</b>是光走一年的距離。X 星距離 335 光年 → 光要走 335 年才到地球，所以我們看到的是它 335 年前的樣子。</p>' },
      { stars: 3, src: '108 年會考第 34 題',
        q: '某處化學藥品倉庫發生爆炸，網路上出現很多目擊者拍攝的影片。其中一位目擊者拍攝的位置距離爆炸位置約 1.5 km，則有關此目擊者所拍攝的影片，下列描述何者最合理？',
        options: [{ t: '影片中聽到爆炸聲後約經過 4～5 秒才看到此爆炸的爆炸火光', why: '光比聲音快得多，一定是先看到火光。' },
          { t: '影片中看到爆炸火光後約經過 4～5 秒才聽到此爆炸的爆炸聲', ok: true, why: '光幾乎瞬間到達；聲音 1500 ÷ 340 ≈ 4.4 秒後才到。' },
          { t: '影片中聽到爆炸聲後約經過 0.04～0.05 秒才看到此爆炸的爆炸火光', why: '順序反了，而且時間也不對。' },
          { t: '影片中看到爆炸火光後約經過 0.04～0.05 秒才聽到此爆炸的爆炸聲', why: '算算看 1500 ÷ 340，不是 0.04 秒。' }],
        steps: [{ q: '光和聲音，誰先到目擊者那裡？', options: [{ t: '光', ok: true, why: '光速約 3 億 m/s，聲速只有約 340 m/s。' }, { t: '聲音', why: '想想打雷：先看到閃電，還是先聽到雷聲？' }] },
          { num: true, q: '1.5 km ＝ 1500 m。聲速 340 m/s，聲音要跑幾秒？（取到小數一位）', post: '秒', range: [4.3, 4.5], answer: 4.4, hint: '時間 ＝ 距離 ÷ 速度 ＝ 1500 ÷ 340。', diag: [{ v: 0.2, msg: '是 1500 ÷ 340，不是 340 ÷ 1500。' }], why: '1500 ÷ 340 ≈ 4.4 秒。光只要 0.000005 秒，可以當作 0。' }],
        explain: '<p>光速（3×10⁸ m/s）遠大於聲速（約 340 m/s）。光幾乎一瞬間到達，聲音要 1500 ÷ 340 ≈ 4.4 秒，所以<b>先看到火光，約 4～5 秒後才聽到爆炸聲</b>。</p>' }
    ]);
  }

  U.run('4-1', ['先猜猜看：影子和小孔', '動手玩：影子與針孔成像', '收成 4 句話'], { guess, play, know, exam, real });
})();
