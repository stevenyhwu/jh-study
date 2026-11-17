/* ===== 數學 4-3b 應用問題（生活情境） ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, M = K.M, X2 = K.X2, ST = K.ST;

  /* 降價：售價 40 − x、杯數 100 + 5x，面積＝收入 */
  function priceSim(host, on) {
    host.appendChild(h('<p class="sim-h">飲料原價 40 元，每天賣 100 杯。每降 1 元，多賣 5 杯。</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let x = 0; const seen = {};
    function draw() {
      const pr = 40 - x, n = 100 + 5 * x, w = n * 1.25, hh = pr * 3.2; seen[x] = 1;
      pic.innerHTML = '';
      U.svg(pic, '0 0 330 180', `<rect x="50" y="${160 - hh}" width="${w}" height="${hh}" fill="#f6c26b" fill-opacity=".6" ${ST}/>
        <rect x="50" y="${160 - 128}" width="125" height="128" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>
        <text x="${50 + w / 2}" y="${160 - hh / 2 + 5}" text-anchor="middle" class="t14b">收入 ${pr * n}</text>
        <text x="44" y="${160 - hh / 2 + 5}" text-anchor="end" class="t12b">${pr} 元</text><text x="${50 + w / 2}" y="176" text-anchor="middle" class="t12b">${n} 杯</text>
        <text x="52" y="${160 - 128 - 5}" class="t12">虛線：原本 40 元 × 100 杯</text>`, '售價乘以杯數的長方形', 'sim');
      const A = pr * n;
      read.innerHTML = `降價 x ＝ <b>${x}</b> 元　→　售價 ${pr} 元 × ${n} 杯 ＝ <b>${A}</b> 元${A === 4375 ? '　<b style="color:var(--good)">✔ 剛好 4375</b>' : ''}`;
    }
    host.appendChild(pic);
    U.slider(host, '降價 x 元', { min: 0, max: 20, step: 1, value: 0 }, v => { x = v; draw(); on(); });
    host.appendChild(read); draw();
    return { seen, get x() { return x; } };
  }

  /* 握手：n 個點兩兩連線 */
  function handSvg(n) {
    const cx = 110, cy = 100, r = 78, P = [];
    for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    let s = '';
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) s += `<line x1="${P[i][0]}" y1="${P[i][1]}" x2="${P[j][0]}" y2="${P[j][1]}" stroke="var(--accent)" stroke-width="1" opacity=".55"/>`;
    P.forEach(q => { s += `<circle cx="${q[0]}" cy="${q[1]}" r="7" fill="#f6c26b" ${ST}/>`; });
    return s;
  }
  function handPic(host, n) { const sv = U.svg(host, '0 0 220 200', handSvg(n), n + ' 個人兩兩握手', 'u4-pic'); sv.style.maxWidth = '220px'; return sv; }
  function handSim(host, on) {
    host.appendChild(h('<p class="sim-h">n 個人，每兩個人握手一次。一條線＝握一次手。</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let n = 3;
    function draw() {
      pic.innerHTML = ''; U.svg(pic, '0 0 220 200', handSvg(n), '握手連線', 'sim').style.maxWidth = '240px';
      const c = n * (n - 1) / 2;
      read.innerHTML = `n ＝ <b>${n}</b> 人　每人跟其他 ${n - 1} 人握手：${n} × ${n - 1} ＝ ${n * (n - 1)}，每次握手被算了兩遍 → ÷ 2 ＝ <b>${c}</b> 次${c === 45 ? '　<b style="color:var(--good)">✔ 剛好 45</b>' : ''}`;
    }
    host.appendChild(pic);
    U.slider(host, '人數 n', { min: 2, max: 12, step: 1, value: n }, v => { n = v; draw(); on(); });
    host.appendChild(read); draw();
    return { get n() { return n; } };
  }

  function calPic(host) {
    return K.table(host, ['日', '一', '二', '三', '四', '五', '六'], [['', '', '1', '2', '3', '4', '5'], ['6', '7', '8', '<b>9</b>', '10', '11', '12'], ['13', '14', '15', '<b>16</b>', '17', '18', '19'], ['20', '21', '22', '23', '24', '25', '26']], 320);
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '飲料店降價，來買的客人變多了。一天的收入一定會增加嗎？', options: [{ t: '不一定', ok: true }, { t: '一定會，因為賣比較多杯' }],
        reveal: '<b>不一定</b>。收入 ＝ 售價 × 杯數。杯數變多、售價卻變低，兩個一起變，要算了才知道。' },
      { pic: c => handPic(c, 5), q: '5 個人，每兩個人握手一次，總共握幾次？', options: [{ t: '10 次', ok: true }, { t: '20 次' }, { t: '25 次' }],
        reveal: '<b>10 次</b>。每人跟其他 4 人握：5 × 4 ＝ 20，可是「甲握乙」和「乙握甲」是同一次，所以除以 2。數數看圖上有幾條線。' }
    ]);
  }

  function play(p, api) {
    let A, B;
    const P = U.panes(p, 2);
    const tk = U.tasks(p, api, [
      { text: '拉「降價」，找出一天收入剛好 <b>4375</b> 元的降價金額。（有兩個，都要找到）', setup() { P.show(0); }, check: () => A.seen[5] && A.seen[15] && (A.x === 5 || A.x === 15),
        qs: () => [{ q: '設降價 x 元，方程式是哪一個？', options: [{ t: '(40 − x)(100 + 5x) ＝ 4375', ok: true, why: '售價變成 40 − x，杯數變成 100 ＋ 5x，相乘就是收入。' }, { t: '(40 − x)(100 + x) ＝ 4375', why: '每降 1 元多賣 <b>5</b> 杯，降 x 元多賣 5x 杯。' }, { t: '40 × 100 − x ＝ 4375', why: '售價和杯數兩個都會變。' }] },
          { q: '降 5 元和降 15 元，收入都是 4375。兩個答案都可以嗎？', options: [{ t: '都可以；如果想讓客人更划算，選降 15 元', ok: true, why: '兩個解都合理時，要看題目<b>另外的條件</b>（例如「讓客人得到最多優惠」「庫存要賣快一點」）。' }, { t: '只有 5 可以', why: '代進去：25 元 × 175 杯 ＝ 4375，也成立。' }] }],
        found: '<b>收入 ＝ 單價 × 數量</b>，兩個都要用 x 寫出來。兩個解都合理時，再看題目的額外條件。' },
      { text: '換到握手：拉人數，找出握手剛好 <b>45</b> 次的人數。', setup() { P.show(1); }, check: () => B.n === 10,
        qs: () => [{ q: `握手次數的方程式是 ${M(K.frac('n(n − 1)', '2') + ' ＝ 45')}，也就是 ${M('n<sup>2</sup> − n − 90 ＝ 0')}。解是 n ＝ 10 或 n ＝ −9，答案是？`, options: [{ t: '10 人（−9 不合）', ok: true, why: '人數不能是負的。' }, { t: '10 人或 9 人', why: 'n ＝ −9 是負的，不是 9。' }] }],
        found: `n 個人（隊）兩兩一次：${M(K.frac('n(n − 1)', '2'))} 次。握手、單循環比賽、兩兩連線都是這個式子。` }
    ]);
    A = priceSim(P.list[0], () => tk.check());
    B = handSim(P.list[1], () => tk.check());
    P.end(tk.slot); p.insertBefore(p.querySelector('.u4-task'), P.list[0].parentElement); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    K.table(U.card(p, '① 降價題：單價和數量都用 x 寫', '<p>原價 40 元賣 100 杯，每降 1 元多賣 5 杯。設降 x 元：</p>'), ['', '原本', '降 x 元後'], [['單價', '40', '40 − x'], ['數量', '100', '100 + 5x'], ['收入', '4000', '(40 − x)(100 + 5x)']], 360);
    handPic(U.card(p, '② 兩兩一次：n(n − 1) ÷ 2', `<p>5 個人握手：5 × 4 ÷ 2 ＝ 10 次。</p><p>如果是「<b>互</b>寄卡片」「主客場各一場」，每一對算兩次，就<b>不用除以 2</b>：n(n − 1)。</p>`), 5);
    calPic(U.card(p, '③ 月曆題：上下差 7，左右差 1', `<p>月曆上，正下方的數比上面大 7。</p><p>例：上下相鄰兩數乘積 144 → ${M('x(x + 7) ＝ 144')} → x ＝ 9，兩數是 9、16。</p>`));
    K.table(U.card(p, '④ 兩個解都是正的，怎麼選？', '<p>回去看題目有沒有多一句條件。</p>'), ['題目多說了', '怎麼選'], [['讓顧客得到最多優惠', '選降價多的'], ['每人費用不得低於某個數', '代回去檢查哪個符合'], ['人數不超過某個數', '選比較小的']], 360);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '8 支球隊打單循環賽（每兩隊比一場），總共要比幾場？', pre: '', post: '場', answer: 28, hint: '8 × 7 ÷ 2。', diag: [{ v: 56, msg: '甲對乙、乙對甲是同一場，要除以 2。' }, { v: 64, msg: '自己不會跟自己比：是 8 × 7，不是 8 × 8。' }],
      why: '8 × 7 ÷ 2 ＝ 28。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '會考很少單獨考這個小節，這兩題是基本題。答錯可以再選。',
      qs: [
        { src: '基本題', q: '若干支球隊打單循環賽（每兩隊比一場），總共比了 21 場。共有幾支球隊？', hint: 'n(n − 1) ÷ 2 ＝ 21 → n² − n − 42 ＝ 0。',
          options: [{ t: '6', why: '6 × 5 ÷ 2 ＝ 15。' }, { t: '7', ok: true, why: '(n − 7)(n + 6) ＝ 0 → n ＝ 7。檢查：7 × 6 ÷ 2 ＝ 21 ✔' }, { t: '8', why: '8 × 7 ÷ 2 ＝ 28。' }, { t: '42', why: '42 是 n(n − 1) 的值，不是隊數。' }] },
        { src: '基本題', pic: calPic, q: '月曆上，某個數和它<b>正下方</b>的數相乘是 144。比較大的那個數是多少？', hint: '正下方的數比它大 7：x(x + 7) ＝ 144。',
          options: [{ t: '9', why: '9 是比較小的那個；題目問比較大的。' }, { t: '12', why: '12 × 12 ＝ 144，可是上下兩數差 7，不會一樣。' }, { t: '16', ok: true, why: 'x² + 7x − 144 ＝ 0 → (x + 16)(x − 9) ＝ 0 → x ＝ 9，下面是 16。' }, { t: '18', why: '18 × 8 ＝ 144，可是差 10，不是上下相鄰。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: K.SIM, q: '班上同學過年時，每兩個人都<b>互相</b>寄一張賀卡給對方，全班總共寄出 90 張。這個班有幾個人？',
        options: [{ t: '9', why: '9 × 8 ＝ 72。' }, { t: '10', ok: true, why: '每人寄給其他 n − 1 人：n(n − 1) ＝ 90 → n ＝ 10。' }, { t: '30', why: '30 × 29 遠大於 90。' }, { t: '45', why: '45 是 90 ÷ 2，可是「互寄」不用除以 2。' }],
        explain: '<p>每個人要寄給其他 n − 1 人，共 n(n − 1) 張（甲寄乙、乙寄甲是不同的兩張，<b>不用除以 2</b>）。<br>n(n − 1) ＝ 90 → n² − n − 90 ＝ 0 → (n − 10)(n + 9) ＝ 0 → n ＝ 10。答案 (B)。</p>',
        steps: [
          { q: '甲寄給乙、乙寄給甲，是幾張賀卡？', options: [{ t: '2 張，所以不用除以 2', ok: true, why: '跟握手不一樣：握手一次兩人都算到，賀卡是各寄各的。' }, { t: '1 張', why: '「互相」寄，兩個方向各一張。' }] },
          { q: `方程式 ${M('n(n − 1) ＝ 90')} → ${M('(n − 10)(n + 9) ＝ 0')}，人數是？`, options: [{ t: '10', ok: true, why: '人數是正的。' }, { t: '9', why: 'n + 9 ＝ 0 → n ＝ −9，不合。' }] }
        ] },
      { stars: 2, src: K.SIM, q: '某款 T 恤每件賺 20 元時，每天可賣 30 件。老闆發現每件少賺 1 元，每天就多賣 5 件。若老闆希望一天賺 800 元，並且<b>讓顧客得到較多優惠</b>，則每件應降價多少元？',
        options: [{ t: '4', why: '降 4 元也能賺 800，但題目要「讓顧客得到較多優惠」。' }, { t: '10', ok: true, why: '降 4 元或 10 元都賺 800；降 10 元顧客比較划算。' }, { t: '14', why: '14 是兩個解的和。' }, { t: '20', why: '降 20 元就沒賺錢了。' }],
        explain: '<p>設降價 x 元：每件賺 20 − x，每天賣 30 ＋ 5x 件。<br>(20 − x)(30 + 5x) ＝ 800 → 600 + 70x − 5x² ＝ 800 → 5x² − 70x + 200 ＝ 0 → x² − 14x + 40 ＝ 0<br>→ (x − 4)(x − 10) ＝ 0 → x ＝ 4 或 10。要讓顧客優惠多，選 10。答案 (B)。</p>',
        steps: [
          { q: '降價 x 元後，「每件賺的錢」和「每天賣的件數」是？', options: [{ t: '20 − x 元、30 + 5x 件', ok: true, why: '每降 1 元多賣 5 件。' }, { t: '20 − x 元、30 + x 件', why: '每降 1 元多賣 5 件，不是 1 件。' }] },
          { q: `${M('(20 − x)(30 + 5x) ＝ 800')} 整理後是 ${M(X2 + ' − 14x + 40 ＝ 0')}。解是？`, options: [{ t: 'x ＝ 4 或 x ＝ 10', ok: true, why: '(x − 4)(x − 10) ＝ 0。' }, { t: 'x ＝ −4 或 x ＝ −10', why: '乘起來 ＋40、加起來 −14 → 兩個數是 −4、−10，所以 x ＝ 4 或 10。' }] },
          { q: '4 和 10 都能賺 800 元。題目說「讓顧客得到較多優惠」，選哪一個？', options: [{ t: '10', ok: true, why: '降越多，顧客越划算。' }, { t: '4', why: '降 4 元比較少。' }] }
        ] },
      { stars: 3, src: K.SIM, q: '某旅行社的團體行程：20 人成行，每人 500 元；每多 1 人報名，<b>每個人</b>的費用都減少 10 元，但每人費用不得低於 350 元。若某團總共收到 12000 元，則此團共有多少人？',
        options: [{ t: '10', why: '10 是「多出來的人數」，題目問全團人數。' }, { t: '25', why: '25 人：25 × 450 ＝ 11250，不是 12000。' }, { t: '30', ok: true, why: '多 10 人：30 人 × 400 元 ＝ 12000 ✔，而且 400 ≥ 350。' }, { t: '40', why: '40 人時每人 300 元，低於 350，不合。' }],
        explain: '<p>設多了 x 人：人數 20 ＋ x，每人 500 − 10x 元。<br>(20 + x)(500 − 10x) ＝ 12000 → 10000 + 300x − 10x² ＝ 12000 → x² − 30x + 200 ＝ 0<br>→ (x − 10)(x − 20) ＝ 0 → x ＝ 10 或 20。<br>x ＝ 20 時每人 300 元 ＜ 350，不合。所以 x ＝ 10，共 30 人。答案 (C)。</p>',
        steps: [
          { q: '設多了 x 人。人數和每人費用是？', options: [{ t: '20 + x 人、500 − 10x 元', ok: true, why: '每多 1 人，每人減 10 元。' }, { t: '20 + x 人、500 − x 元', why: '每多 1 人減 <b>10</b> 元。' }] },
          { q: `${M('(20 + x)(500 − 10x) ＝ 12000')} 整理後是 ${M(X2 + ' − 30x + 200 ＝ 0')}。解是？`, options: [{ t: 'x ＝ 10 或 x ＝ 20', ok: true, why: '(x − 10)(x − 20) ＝ 0。' }, { t: 'x ＝ 5 或 x ＝ 40', why: '5 ＋ 40 ＝ 45，加起來要是 30。' }] },
          { q: '「每人費用不得低於 350 元」。x ＝ 20 時每人 500 − 200 ＝ 300 元。所以？', options: [{ t: 'x ＝ 20 不合，x ＝ 10，共 30 人', ok: true, why: 'x ＝ 10 時每人 400 元，符合。' }, { t: '兩個都可以', why: '300 元低於 350 元，違反題目條件。' }] }
        ] }
    ], '會考沒有單獨考這個小節的原題，這三題是照會考的出題方式寫的模擬題。由簡單排到難，卡住就按「🪜 拆解」。');
  }

  K.run('4-3b', ['先猜猜看', '動手玩：降價與握手', '收成 4 句話', '基本題', '實戰：會考題型模擬題'], { guess, play, know, exam, real });
})();
