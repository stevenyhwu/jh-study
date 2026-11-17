/* ===== 數學 2-2a 根式的化簡 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, Q = MK2, M = K.M, R = K.sqrt;

  /* 面積 n 的大正方形，切成 k × k 個小正方形（每個面積 m）→ 邊長 ＝ k × √m */
  function tileSvg(k, m, n) {
    const S = 200, u = S / k, x0 = 30, y0 = 24;
    let s = '';
    for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) s += `<rect x="${x0 + i * u}" y="${y0 + j * u}" width="${u}" height="${u}" fill="${(i + j) % 2 ? '#9fd3a8' : '#f6c26b'}" fill-opacity=".6" stroke="var(--stroke)"/>`;
    if (k <= 6) for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) s += `<text x="${x0 + i * u + u / 2}" y="${y0 + j * u + u / 2 + 4}" text-anchor="middle" class="t12">${m}</text>`;
    s += `<rect x="${x0}" y="${y0}" width="${S}" height="${S}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    for (let i = 0; i < k; i++) s += `<text x="${x0 + i * u + u / 2}" y="${y0 - 6}" text-anchor="middle" class="t12b" style="fill:var(--accent)">${m === 1 ? 1 : '√' + m}</text>`;
    s += `<text x="${x0 + S + 8}" y="${y0 + S / 2}" class="t12b">面積 ${n}</text><text x="${x0 + S + 8}" y="${y0 + S / 2 + 18}" class="t12">＝ ${k * k} 塊 × ${m}</text>`;
    return { vb: `0 0 ${x0 + S + 90} ${y0 + S + 10}`, inner: s };
  }
  function tilePic(host, n, k, cls) { const t = tileSvg(k, n / (k * k), n); const sv = U.svg(host, t.vb, t.inner, '根式化簡', cls || 'u4-pic'); sv.style.maxWidth = '320px'; return sv; }

  function simpSim(host, on) {
    host.appendChild(h('<p class="sim-h">把面積 n 的正方形，切成一樣大的小正方形</p>'));
    const c1 = h('<div></div>'), c2 = h('<div></div>'), pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let n = 12, k = 1;
    function draw() {
      pic.innerHTML = '';
      if (n % (k * k)) {
        tilePic(pic, n, 1, 'sim');
        read.innerHTML = `${n} ÷ ${k * k} 除不盡，切不成 ${k} × ${k}。換一個。`;
        return;
      }
      tilePic(pic, n, k, 'sim');
      const m = n / (k * k), best = Q.simp(n).s === k;
      read.innerHTML = `${R(n)} ＝ ${R(k * k + ' × ' + m)} ＝ ${R(k * k)} × ${R(m)} ＝ <b>${Q.rootTxt(k, m)}</b><br>${k === 1 ? '還沒切。' : best ? '<b style="color:var(--good)">✔ 最簡了：根號裡已經沒有平方數因數。</b>' : `<span style="color:${K.NEG}">還可以再化簡：${m} 裡面還有平方數。</span>`}`;
    }
    U.chips(c1, 'n', [8, 12, 18, 20, 27, 48, 50, 72].map(v => ({ v, t: '√' + v })), n, v => { n = v; k = 1; ks.set(1); draw(); on(); });
    const ks = U.chips(c2, '切成 k × k', [1, 2, 3, 4, 5, 6].map(v => ({ v, t: `${v}×${v}（${v * v}）` })), k, v => { k = v; draw(); on(); });
    host.append(c1, c2, pic, read); draw();
    return { get n() { return n; }, get k() { return k; }, get best() { return n % (k * k) === 0 && Q.simp(n).s === k; } };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: `${R(4)} × ${R(3)} 和 ${R(12)} 一樣大嗎？`, options: [{ t: '一樣', ok: true }, { t: '不一樣' }],
        reveal: `√4 × √3 ＝ 2 × 1.732 ≈ 3.464，√12 ≈ 3.464，<b>一樣</b>。所以 √12 可以寫成 <b>2√3</b>，比較簡單。` },
      { q: `${R(18)} 寫成最簡單的樣子是？`, options: [{ t: `9${R(2)}` }, { t: `3${R(2)}`, ok: true }, { t: `2${R(3)}` }],
        reveal: `18 ＝ 9 × 2，√9 ＝ 3 搬出來：<b>3√2</b>。注意是 √9 ＝ 3 跑出來，不是 9 跑出來。` }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: `選 ${R(12)}，試試切成 2 × 2。`, check: () => S.n === 12 && S.k === 2,
        qs: () => [{ q: '切成 4 塊，每塊面積 3。每塊的邊長是 √3，大正方形的邊長是？', options: [{ t: `2${R(3)}`, ok: true, why: '一邊排了 2 個 √3。' }, { t: `4${R(3)}`, why: '4 是塊數，一邊只有 2 塊。' }] }],
        found: `${R('a × b')} ＝ ${R('a')} × ${R('b')}。找到<b>平方數</b>因數，就把它開出來：√12 ＝ √4 × √3 ＝ 2√3。` },
      { text: `選 ${R(72)}，找出能切成「最大」的 k × k。`, check: () => S.n === 72 && S.best,
        qs: () => [{ q: '切 2 × 2 得到 2√18、切 3 × 3 得到 3√8，為什麼都不是最簡？', options: [{ t: '18 和 8 裡面還有平方數（9、4）', ok: true, why: '要找<b>最大</b>的平方因數 36：√72 ＝ 6√2。' }, { t: '因為係數太小', why: '看根號裡：18 ＝ 9 × 2 還能再開。' }] }],
        found: '要找<b>最大的平方數因數</b>，一次化到底。根號裡沒有平方數因數，才叫<b>最簡根式</b>。' },
      { text: '不用模擬了，練一練。', quiet: true, check: () => true,
        qs: () => [
          { q: `${R(45)} ＝ ？`, options: [{ t: `3${R(5)}`, ok: true, why: '45 ＝ 9 × 5。' }, { t: `5${R(3)}`, why: '45 ＝ 9 × 5，開出來的是 √9 ＝ 3。' }, { t: `9${R(5)}`, why: '√9 ＝ 3。' }] },
          { q: `${R('1/3')}（分母有根號不算最簡）怎麼寫？`, options: [{ t: `${R(3)} / 3`, ok: true, why: '分子分母同乘 √3：1/√3 ＝ √3/3。' }, { t: `1 / 3`, why: '根號不能直接拿掉。' }, { t: `${R(3)}`, why: '√3 ≈ 1.73，1/√3 ≈ 0.58，不一樣。' }] }],
        found: '最簡根式：①根號裡沒有平方數因數 ②根號裡沒有分數 ③分母沒有根號（<b>分母有理化</b>：上下同乘那個根號）。' }
    ]);
    S = simpSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    tilePic(U.card(p, '① 根號可以拆開', `<p>${R('a × b')} ＝ ${R('a')} × ${R('b')}</p><p>√12 ＝ √4 × √3 ＝ 2√3</p>`), 12, 2);
    K.table(U.card(p, '② 找最大的平方因數', '<p>平方數：4、9、16、25、36、49、64、81、100…</p>'), ['根式', '拆', '最簡'], [['√50', '25 × 2', '5√2'], ['√48', '16 × 3', '4√3'], ['√135', '9 × 15', '3√15'], ['√200', '100 × 2', '10√2']], 340);
    tilePic(U.card(p, '③ 最簡根式的條件', '<p>①根號裡沒有平方數因數<br>②根號裡沒有分數<br>③分母沒有根號</p><p>√72 ＝ 6√2 才是最簡（不是 2√18）。</p>'), 72, 6);
    K.table(U.card(p, '④ 分母有理化', '<p>上下同乘分母的根號，讓分母變整數。</p>'), ['原式', '同乘', '結果'], [['1/√3', '√3', '√3/3'], ['6/√2', '√2', '6√2/2 ＝ 3√2'], ['√(2/5)', '√5', '√10/5']], 340);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: `${R(50)} ＝ □${R(2)}，□ ＝ ？`, pre: '□ ＝', answer: 5, hint: '50 ＝ 25 × 2。', diag: [{ v: 25, msg: '√25 ＝ 5 才是跑出來的數。' }], why: '√50 ＝ √25 × √2 ＝ 5√2', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      benchLabel: '想切切看？打開正方形切塊模擬',
      bench: host => simpSim(host, () => {}),
      qs: [
        { src: '改寫自 112 年會考第 4 題', q: `化簡 ${R(75)} 的結果為下列何者？`, hint: '75 ＝ 25 × 3。',
          options: [{ t: `3${R(5)}`, why: '75 ＝ 25 × 3，開出來是 5。' }, { t: `5${R(3)}`, ok: true, why: '√25 × √3 ＝ 5√3。' }, { t: `25${R(3)}`, why: '√25 ＝ 5，不是 25。' }, { t: `15${R(5)}`, why: '75 ＝ 25 × 3。' }] },
        { src: '改寫自 108 年會考第 5 題', q: `若 ${R(20)} ＝ 2${R('a')}，${R(27)} ＝ 3${R('b')}，則 a ＋ b 之值為何？`, hint: '20 ＝ 4 × 5，27 ＝ 9 × 3。',
          options: [{ t: '8', ok: true, why: 'a ＝ 5、b ＝ 3，a ＋ b ＝ 8。' }, { t: '5', why: 'b 也要算：27 ＝ 9 × 3，b ＝ 3。' }, { t: '47', why: 'a、b 是根號裡剩下的數。' }, { t: '13', why: '√20 ＝ 2√5，a ＝ 5（不是 10）。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '112 年會考 第 4 題', q: `化簡 ${R(135)} 的結果為下列何者？`,
        options: [{ t: `3${R(5)}`, why: '3√5 ＝ √45，不是 √135。' }, { t: `27${R(5)}`, why: '135 ＝ 27 × 5，但 27 不是平方數。' }, { t: `3${R(15)}`, ok: true, why: '135 ＝ 9 × 15，√9 ＝ 3。' }, { t: `9${R(15)}`, why: '√9 ＝ 3，不是 9。' }],
        explain: '<p>135 ＝ 9 × 15，9 是平方數：√135 ＝ √9 × √15 ＝ 3√15。15 ＝ 3 × 5 沒有平方因數，已是最簡。答案 (C)。</p>',
        steps: [
          { q: '135 裡面最大的平方數因數是？', options: [{ t: '9', ok: true, why: '135 ＝ 9 × 15。' }, { t: '27', why: '27 不是平方數。' }, { t: '25', why: '135 ÷ 25 除不盡。' }] },
          { num: true, q: '√9 ＝ ？', pre: '', answer: 3, why: '所以 √135 ＝ 3√15。' }
        ] },
      { stars: 2, src: '108 年會考 第 5 題', q: `若 ${R(44)} ＝ 2${R('a')}，${R(54)} ＝ 3${R('b')}，則 a ＋ b 之值為何？`,
        options: [{ t: '13', why: 'a ＝ 11，b 再算：54 ＝ 9 × 6。' }, { t: '17', ok: true, why: 'a ＝ 11、b ＝ 6。' }, { t: '24', why: 'a、b 是根號裡「剩下」的數。' }, { t: '40', why: '44 ＝ 4 × 11，a ＝ 11。' }],
        explain: '<p>√44 ＝ √(4 × 11) ＝ 2√11 → a ＝ 11。<br>√54 ＝ √(9 × 6) ＝ 3√6 → b ＝ 6。<br>a ＋ b ＝ 17。答案 (B)。</p>',
        steps: [
          { num: true, q: '44 ＝ 4 × □，□ ＝ ？', pre: '□ ＝', answer: 11, why: '√44 ＝ 2√11，a ＝ 11。' },
          { num: true, q: '54 ＝ 9 × □，□ ＝ ？', pre: '□ ＝', answer: 6, why: '√54 ＝ 3√6，b ＝ 6。' },
          { num: true, q: 'a ＋ b ＝ ？', pre: '', answer: 17 }
        ] },
      { stars: 3, src: K.SIM, q: `若 a 為正整數，且 ${R('48a')} 也是正整數，則 a 最小是多少？`,
        options: [{ t: '2', why: '√96 不是整數（96 ＝ 16 × 6）。' }, { t: '3', ok: true, why: '48 ＝ 16 × 3，乘 3 變 144 ＝ 12²。' }, { t: '4', why: '√192 ＝ 8√3，不是整數。' }, { t: '48', why: '48 可以，但不是最小。' }],
        explain: '<p>48 ＝ 16 × 3。√48 ＝ 4√3，只差根號裡的 3。<br>a ＝ 3 時，48a ＝ 144 ＝ 12²，√144 ＝ 12 是整數。比 3 小的 1、2 都不行。答案 (B)。</p>',
        steps: [
          { q: '先化簡 √48 ＝ ？', options: [{ t: `4${R(3)}`, ok: true, why: '48 ＝ 16 × 3。' }, { t: `2${R(12)}`, why: '12 裡還有 4，要化到底。' }] },
          { q: '4√3 × √a 要變整數，a 最小要是？', options: [{ t: '3', ok: true, why: '√3 × √3 ＝ 3，整個變 4 × 3 ＝ 12。' }, { t: '16', why: '16 是已經開出來的部分。' }] }
        ] }
    ]);
  }

  K.run('2-2a', ['先猜猜看：√12 能更簡單嗎？', '動手玩：把正方形切小塊', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
