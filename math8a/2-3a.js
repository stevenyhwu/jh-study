/* ===== 數學 2-3a 畢氏定理求邊長 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, Q = MK2, R = K.sqrt;

  function triSim(host, on) {
    host.appendChild(h('<p class="sim-h">直角三角形三邊各畫一個正方形，面積有什麼關係？</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let a = 3, b = 4;
    function draw() {
      pic.innerHTML = ''; Q.triPic(pic, a, b, { max: 300 }, 'sim');
      const c2 = a * a + b * b;
      read.innerHTML = `綠 ${a}² ＝ ${a * a}，黃 ${b}² ＝ ${b * b}，紫（斜邊上）＝ <b>${c2}</b><br>${a * a} ＋ ${b * b} ＝ ${c2}　→　斜邊 ＝ <b>${Q.rootOf(c2)}</b>`;
    }
    host.appendChild(pic);
    U.slider(host, '股 a（橫）', { min: 1, max: 12, step: 1, value: a }, v => { a = v; draw(); on(); });
    U.slider(host, '股 b（直）', { min: 1, max: 12, step: 1, value: b }, v => { b = v; draw(); on(); });
    host.appendChild(read); draw();
    return { is: (x, y) => (a === x && b === y) || (a === y && b === x) };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => Q.triPic(c, 3, 4, { squares: false, hideC: true }), q: '直角三角形兩股 3 和 4，斜邊多長？', options: [{ t: '7' }, { t: '5', ok: true }, { t: '6' }],
        reveal: '斜邊是 <b>5</b>，比 3 ＋ 4 短。為什麼剛好是 5？下一步用正方形找出來。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: '調成兩股 <b>6</b> 和 <b>8</b>。', check: () => S.is(6, 8),
        qs: () => [{ q: '36 ＋ 64 ＝ 100。斜邊是？', options: [{ t: '10', ok: true, why: '斜邊上正方形面積 100，邊長 √100 ＝ 10。' }, { t: '100', why: '100 是面積，邊長要開根號。' }] }],
        found: '<b>畢氏定理</b>：兩股的平方和 ＝ 斜邊的平方，a² ＋ b² ＝ c²。' },
      { text: '調成兩股 <b>1</b> 和 <b>2</b>。', check: () => S.is(1, 2),
        qs: () => [{ q: '1 ＋ 4 ＝ 5，斜邊是？', options: [{ t: R(5), ok: true, why: '不是完全平方數，就留根號。' }, { t: '5', why: '5 是面積。' }, { t: '3', why: '斜邊不是兩股相加。' }] }],
        found: '斜邊不一定是整數，用根號表示就好。' },
      { text: '反過來：已知斜邊求股（不用模擬了）。', quiet: true, check: () => true,
        qs: () => [{ num: true, q: '斜邊 13、一股 5，另一股 ＝ √(13² − 5²) ＝ ？', pre: '', answer: 12, diag: [{ v: 8, msg: '不是 13 − 5，要先平方：169 − 25。' }], why: '√144 ＝ 12' }],
        found: '求股：<b>b ＝ √(c² − a²)</b>（大的平方減小的平方）。' }
    ]);
    S = triSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  const rect = (host, w, hh, lab) => { const u = 50, s = `<rect x="20" y="20" width="${w * u}" height="${hh * u}" fill="#9fd3a8" fill-opacity=".4" stroke="var(--ink)" stroke-width="2"/><line x1="20" y1="${20 + hh * u}" x2="${20 + w * u}" y2="20" stroke="#d9534f" stroke-width="2.5"/><text x="${20 + w * u / 2}" y="${36 + hh * u}" text-anchor="middle" class="t14b">${w}</text><text x="10" y="${24 + hh * u / 2}" text-anchor="middle" class="t14b">${hh}</text><text x="${24 + w * u / 2}" y="${14 + hh * u / 2}" class="t14b" style="fill:#d9534f">${lab}</text>`; const sv = U.svg(host, `0 0 ${w * u + 40} ${hh * u + 44}`, s, '長方形對角線', 'u4-pic'); sv.style.maxWidth = '260px'; };
  const hexPic = host => U.svg(host, '0 0 260 200', `<polygon points="130,40 70,70 70,130 130,160 190,130 190,70" fill="none" stroke="var(--ink)" stroke-width="2"/>
    <line x1="70" y1="70" x2="190" y2="70" stroke="var(--ink)" stroke-dasharray="4 3"/><line x1="70" y1="130" x2="190" y2="130" stroke="var(--ink)" stroke-dasharray="4 3"/>
    <line x1="70" y1="70" x2="190" y2="130" stroke="var(--muted)" stroke-dasharray="2 3"/><line x1="70" y1="130" x2="190" y2="70" stroke="var(--muted)" stroke-dasharray="2 3"/>
    <circle cx="130" cy="100" r="3" fill="var(--ink)"/><text x="136" y="96" class="t14b">P</text>
    <text x="52" y="70" class="t14b">A</text><text x="196" y="70" class="t14b">D</text><text x="52" y="138" class="t14b">B</text><text x="196" y="138" class="t14b">C</text>
    <text x="124" y="32" class="t14b">Q</text><text x="124" y="180" class="t14b">R</text>`, '六邊形 QABRCD', 'u4-pic');

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    Q.triPic(U.card(p, '① 畢氏定理', '<p>直角三角形：<b>a² ＋ b² ＝ c²</b>（c 是斜邊，直角對面那條）</p>'), 3, 4);
    Q.triPic(U.card(p, '② 求股', '<p>b ＝ √(c² − a²)<br>斜邊 13、股 5 → √(169 − 25) ＝ 12</p>'), 5, 12, { squares: false });
    K.table(U.card(p, '③ 常見的畢氏數', '<p>背起來，看到馬上認出。</p>'), ['兩股', '斜邊'], [['3、4', '5'], ['6、8', '10'], ['5、12', '13'], ['8、15', '17']], 260);
    rect(U.card(p, '④ 長方形的對角線', '<p>長 4、寬 2 → 對角線 √(16 ＋ 4) ＝ √20 ＝ 2√5</p>'), 4, 2, '2√5');
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '長 8、寬 6 的長方形，對角線多長？', pre: '', answer: 10, hint: '√(64 ＋ 36)。', diag: [{ v: 14, msg: '不是相加，要用畢氏定理。' }], why: '√100 ＝ 10', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      benchLabel: '想驗算？打開畢氏定理模擬',
      bench: host => triSim(host, () => {}),
      qs: [
        { src: '改寫自 109 年會考第 17 題', pic: c => rect(c, 4, 2, '?'), q: '長方形 ABCD 中，AB ＝ 2、AD ＝ 4，對角線 AC 長多少？', hint: '√(4² ＋ 2²)。',
          options: [{ t: '6', why: '不是相加。' }, { t: `2${R(5)}`, ok: true, why: '√20 ＝ 2√5。' }, { t: `2${R(3)}`, why: '對角線是斜邊，要用加的。' }, { t: '20', why: '20 是平方，要開根號。' }] },
        { src: K.SIM, q: '一把 10 公尺的梯子靠在牆上，梯腳離牆 6 公尺，梯子頂端離地多高？', hint: '梯子是斜邊。',
          options: [{ t: '8 公尺', ok: true, why: '√(100 − 36) ＝ 8。' }, { t: '4 公尺', why: '不是 10 − 6。' }, { t: `2${R(34)} 公尺`, why: '梯子是斜邊，要用減的。' }, { t: '16 公尺', why: '比梯子還長不合理。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: K.SIM, pic: c => Q.triPic(c, 5, 12, { squares: false, lc: '13', la: '5', lb: '?' }), q: '直角三角形斜邊 13、一股 5，另一股長為何？',
        options: [{ t: '8', why: '不是 13 − 5。' }, { t: '12', ok: true, why: '√(169 − 25) ＝ √144 ＝ 12。' }, { t: R(194), why: '已知斜邊，要用減的。' }, { t: '18', why: '股一定比斜邊短。' }],
        explain: '<p>另一股 ＝ √(13² − 5²) ＝ √144 ＝ 12。答案 (B)。</p>',
        steps: [{ num: true, q: '13² − 5² ＝ ？', pre: '', answer: 144 }, { num: true, q: '√144 ＝ ？', pre: '', answer: 12 }] },
      { stars: 2, src: K.SIM, q: '等腰三角形兩腰各 5、底邊 6，它的面積是多少？',
        options: [{ t: '15', why: '高不是 5，要先算高。' }, { t: '12', ok: true, why: '高 ＝ √(25 − 9) ＝ 4，面積 6 × 4 ÷ 2 ＝ 12。' }, { t: '24', why: '三角形面積要除以 2。' }, { t: '30', why: '底 × 腰不是面積。' }],
        explain: '<p>從頂點畫高，底邊被平分成 3 和 3。高 ＝ √(5² − 3²) ＝ 4。面積 ＝ 6 × 4 ÷ 2 ＝ 12。答案 (B)。</p>',
        steps: [
          { q: '從頂點往底邊畫高，底邊被分成？', options: [{ t: '3 和 3', ok: true, why: '等腰三角形的高平分底邊。' }, { t: '5 和 1', why: '高平分底邊。' }] },
          { num: true, q: '高 ＝ √(5² − 3²) ＝ ？', pre: '', answer: 4 },
          { num: true, q: '面積 ＝ 6 × 4 ÷ 2 ＝ ？', pre: '', answer: 12 }
        ] },
      { stars: 3, src: '109 年會考 第 17 題', pic: hexPic, q: '如圖，P 點為矩形 ABCD 兩對角線的交點，將 P 點分別以 AD、BC 為對稱軸畫出對稱點 Q、R，形成六邊形 QABRCD。若 AB ＝ 2，AD ＝ 4，則六邊形 QABRCD 的周長為何？',
        options: [{ t: '12', why: 'QA 不是 2，要算 PA。' }, { t: `4 ＋ 2${R(6)}`, why: 'PA 是對角線的一半。' }, { t: `4 ＋ 4${R(3)}`, why: '對角線 √(16 ＋ 4) ＝ 2√5。' }, { t: `4 ＋ 4${R(5)}`, ok: true, why: '四條斜邊都 ＝ √5，加上 AB、CD。' }],
        explain: '<p>對角線 AC ＝ √(4² ＋ 2²) ＝ 2√5，P 是中點，PA ＝ PD ＝ √5。<br>Q 是 P 對 AD 的對稱點，QA ＝ PA ＝ √5、QD ＝ √5；同理 RB ＝ RC ＝ √5。<br>周長 ＝ AB ＋ CD ＋ 4√5 ＝ 4 ＋ 4√5。答案 (D)。</p>',
        steps: [
          { q: '對角線 AC ＝ ？', options: [{ t: `2${R(5)}`, ok: true, why: '√(16 ＋ 4) ＝ √20。' }, { t: '6', why: '用畢氏定理。' }] },
          { q: 'P 是對角線中點，PA ＝ ？', options: [{ t: R(5), ok: true, why: '2√5 的一半。' }, { t: '2', why: 'PA 是對角線的一半。' }] },
          { q: 'Q 是 P 對 AD 的對稱點，QA ＝ ？', options: [{ t: `${R(5)}（和 PA 一樣）`, ok: true, why: '對稱後長度不變。' }, { t: '2', why: '對稱後長度不變。' }] },
          { q: '周長 ＝ QA ＋ AB ＋ BR ＋ RC ＋ CD ＋ DQ ＝ ？', options: [{ t: `4 ＋ 4${R(5)}`, ok: true, why: '2 ＋ 2 ＋ 4 個 √5。' }, { t: `4${R(5)}`, why: '別忘了 AB、CD。' }] }
        ] }
    ]);
  }

  K.run('2-3a', ['先猜猜看：3、4 的斜邊', '動手玩：三個正方形', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
