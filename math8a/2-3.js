/* ===== 2-3 畢氏定理：可可貓的三角形巧克力（5 關） =====
   先數三個正方形巧克力的格數 → 發現 a²+b²=c² → 算邊長 → 判斷直角 → 方格/坐標距離 → 外送應用 */
(function () {
  'use strict';
  const R = String.raw;
  const { pythag, dotGrid, coord, raw } = Viz;
  const challenge = s => `<span class="chal">⭐ 挑戰題</span> ${s}`;
  const formula = (f, tip) => `<div class="formula">${f}</div>${tip ? `<div class="tip">${tip}</div>` : ''}`;
  const rad = (q, k, r, hint) => ({ type: 'num', q, fields: [{ answer: k }, { pre: '√', answer: r }], hint });
  const tri = (h, a, b, la, lb, lc) => pythag(h, a, b, { squares: false, la, lb, lc });

  /* =========================================================
     第 1 關：三個正方形的祕密
     ========================================================= */
  const S1 = { id: 's1', badge: '🔺', title: '第 1 關　三個正方形的祕密', steps: [
    { say: '可可貓切了一塊<b>直角三角形</b>巧克力（左下角是直角 ∟），<br>又在三條邊上各黏了一片正方形巧克力。',
      scene: (h) => { pythag(h, 3, 4, { la: '3', lb: '4' }); },
      ask: { type: 'num', q: '數數看兩片小的正方形：', fields: [{ pre: '🟧 橘子（下面）', answer: 9, post: '格' }, { pre: '　🟩 抹茶（左邊）', answer: 16, post: '格' }], hint: '橘子是 3×3，抹茶是 4×4。' } },
    { say: '斜斜的那片草莓正方形，也畫好格子了，數數看：',
      scene: (h) => { pythag(h, 3, 4, { la: '3', lb: '4', sq: ['9', '16', ''] }); },
      ask: { type: 'num', q: '🟥 草莓正方形有幾格？', fields: [{ answer: 25, post: '格' }], hint: '它是一個斜放的 5×5 正方形。' } },
    { say: '把三個數字放在一起看：9、16、25……',
      scene: (h) => { pythag(h, 3, 4, { la: '3', lb: '4', sq: ['9', '16', '25'] }); },
      ask: { type: 'choice', q: '你發現什麼了？', options: [
        { t: '9＋16＝25：兩片小的加起來，剛好等於大的！', ok: true, why: '太厲害了！這就是 2500 年前畢達哥拉斯發現的祕密。' },
        { t: '三片一樣大', why: '9、16、25 不一樣大喔。' },
        { t: '沒有關係', why: '試試把兩個小的加起來：9＋16＝？' }] } },
    { say: '換一塊大一點的：兩股是 6 和 8。',
      scene: (h) => { pythag(h, 6, 8, { la: '6', lb: '8' }); },
      ask: { type: 'num', fields: [{ pre: '🟧 6×6＝', answer: 36 }, { pre: '　🟩 8×8＝', answer: 64 }, { pre: '　🟥 草莓＝', answer: 100, post: '格' }], hint: '草莓＝兩片小的加起來。' } },
    { say: '草莓正方形有 100 格，它的邊長（也就是三角形最長的邊）是？',
      scene: (h) => { pythag(h, 6, 8, { la: '6', lb: '8', lc: '?', sq: ['36', '64', '100'] }); },
      ask: { type: 'num', fields: [{ pre: '最長邊＝', answer: 10, diag: [{ v: 14, msg: '6＋8 不對喔！邊長要用格數開根號：√100。' }, { v: 50, msg: '100÷2 不對，正方形邊長是開根號：√100。' }] }] },
      after: '👉 <b>不能直接把邊相加</b>（6＋8≠10），要用正方形的格數來算！' },
    { say: '如果不是直角三角形呢？這塊三角形的角張得比直角還開：',
      scene: (h) => { raw(h, 320, 170, `<polygon points="200,140 290,140 60,40" fill="#fff7e8" stroke="#5b3a26" stroke-width="2.5"/><path d="M188,140 A12,12 0 0 0 194,129" fill="none" stroke="#d6452f" stroke-width="2"/><text x="245" y="160" text-anchor="middle" class="ruler-t">3</text><text x="118" y="104" text-anchor="middle" class="ruler-t">4</text><text x="178" y="76" text-anchor="middle" class="ruler-t">?</text><text x="214" y="126" class="ruler-t" style="font-style:normal;font-size:13px">比直角大</text>`); },
      ask: { type: 'choice', q: '最長邊還會是 5 嗎？', options: [
        { t: '不會，角張得更開，對面的邊會比 5 長', ok: true, why: R`對！所以 \(3^2+4^2=5^2\) 這個規律<b>只對直角三角形成立</b>。` },
        { t: '會，一定是 5', why: '想像把角越張越開，對面那條邊會越拉越長喔。' }] } },
    { say: R`把發現寫成公式：直角三角形的兩條短邊叫<b>兩股</b>（a、b），直角對面最長的邊叫<b>斜邊</b>（c）。`,
      scene: (h) => { tri(h, 4, 3, 'a', 'b', 'c（斜邊）'); },
      ask: { type: 'choice', q: '斜邊在哪裡？', options: [
        { t: '直角的對面，最長的那條', ok: true, why: '對！斜邊一定是直角三角形裡最長的邊。' },
        { t: '最下面那條', why: '要看直角 ∟ 在哪裡，斜邊是直角的「對面」。' },
        { t: '任何一條都可以', why: '斜邊是直角對面那條，只有一條。' }] },
      after: '這就是<b>畢氏定理</b>：' + formula(R`\(a^2+b^2=c^2\)`, '兩股的平方和 ＝ 斜邊的平方（兩片小正方形 ＝ 大正方形）') }
  ] };

  /* =========================================================
     第 2 關：用公式算邊長
     ========================================================= */
  const S2 = { id: 's2', badge: '📐', title: '第 2 關　算出第三邊', steps: [
    { say: '兩股是 5 和 12，斜邊是多少？',
      scene: (h) => { tri(h, 12, 5, '12', '5', 'c'); },
      ask: { type: 'num', fields: [{ pre: R`\(c^2=5^2+12^2=\)`, answer: 169 }, { pre: R`　\(c=\)`, answer: 13, diag: [{ v: 17, msg: '5＋12 不對喔！要開根號：√169。' }] }] } },
    { say: '知道斜邊，求股：斜邊 10、一股 6，另一股是？<br>大正方形 <b>減掉</b> 一個小正方形！',
      scene: (h) => { tri(h, 6, 8, '6', '?', '10'); },
      ask: { type: 'num', fields: [{ pre: R`\(b^2=10^2-6^2=\)`, answer: 64, diag: [{ v: 136, msg: '求「股」要用減的：100−36。斜邊的正方形是最大的那片。' }] }, { pre: R`　\(b=\)`, answer: 8 }] },
      after: '👉 <b>求斜邊用加，求股用減。</b>' },
    { say: '答案不一定是整數！兩股都是 1：',
      scene: (h) => { tri(h, 4, 4, '1', '1', 'c'); },
      ask: { type: 'choice', q: R`\(c^2=1^2+1^2=2\)，所以 \(c=\)？`, options: [
        { t: R`\(\sqrt2\)`, ok: true, why: '開不完就用根號表示，這就是 2-1 學的 √2！' },
        { t: '2', why: R`\(c^2=2\)，\(c\) 是自己乘自己等於 2 的數：\(\sqrt2\)。` },
        { t: '1', why: '斜邊一定比股長喔。' }] } },
    { say: '用 2-2 的化簡：兩股 2 和 4。',
      scene: (h) => { tri(h, 4, 2, '4', '2', 'c'); },
      ask: rad(R`\(c=\sqrt{2^2+4^2}=\sqrt{20}=\)？`, 2, 5, '20＝2×2×5，一對 2 搬出去。') },
    { say: R`⚠️ 陷阱題：一個直角三角形的三邊是 \(y\)、12、5。`,
      ask: { type: 'choice', q: R`\(y\) 一定是 13 嗎？`, options: [
        { t: R`不一定！\(y\) 也可能是股，那 12 就是斜邊`, ok: true, why: R`如果 \(y\) 是斜邊：\(y=13\)；如果 12 是斜邊：\(y=\sqrt{144-25}=\sqrt{119}\)。<b>沒說誰是斜邊，就要想兩種！</b>` },
        { t: '一定是 13', why: '題目沒說 y 是斜邊喔！如果 12 是斜邊呢？' }] } },
    { say: challenge('直角三角形兩股 6、8，斜邊 10。斜邊上的高 h 是多少？'),
      scene: (h) => { raw(h, 320, 220, `<polygon points="40,190 280,190 40,10" fill="#fff7e8" stroke="#5b3a26" stroke-width="2.5"/><rect x="40" y="178" width="12" height="12" fill="none" stroke="#5b3a26"/><line x1="40" y1="190" x2="126.4" y2="74.8" stroke="#d6452f" stroke-width="2.5" stroke-dasharray="6 4"/><text x="160" y="210" text-anchor="middle" class="ruler-t">8</text><text x="26" y="104" text-anchor="middle" class="ruler-t">6</text><text x="190" y="88" text-anchor="middle" class="ruler-t">10</text><text x="92" y="146" class="ruler-t" fill="#d6452f">h</text>`); },
      ask: { type: 'num', fields: [{ pre: '面積＝6×8÷2＝', answer: 24 }, { pre: '　h＝', answer: 4.8 }], hint: '面積也可以用「斜邊 × 高 ÷ 2」：10×h÷2＝24。' },
      after: '👉 同一個面積，用兩種底和高算，就能找出高！' },
    { say: challenge('正方形巧克力的對角線：'),
      scene: (h) => { raw(h, 300, 180, `<rect x="90" y="20" width="130" height="130" rx="4" fill="#8a5a3c" stroke="#5b3a26" stroke-width="2"/><line x1="90" y1="150" x2="220" y2="20" stroke="#ffe08a" stroke-width="3" stroke-dasharray="7 5"/><text x="155" y="172" text-anchor="middle" class="ruler-t">5</text><text x="78" y="88" text-anchor="end" class="ruler-t">5</text><text x="170" y="78" class="region-label" font-size="16">?</text>`); },
      ask: rad('邊長 5 的正方形，對角線長＝？', 5, 2, '對角線把正方形切成兩個直角三角形：√(25＋25)＝√50。') ,
      after: R`👉 邊長 \(a\) 的正方形，對角線是 \(\sqrt2\,a\)。` }
  ] };

  /* =========================================================
     第 3 關：是不是直角三角形？
     ========================================================= */
  const S3 = { id: 's3', badge: '✅', title: '第 3 關　是不是直角？', steps: [
    { say: R`反過來也成立：如果 <b>最長邊² ＝ 另外兩邊平方和</b>，它就是直角三角形！<br>三邊 4、5、6 是直角三角形嗎？`,
      ask: { type: 'num', fields: [{ pre: R`\(4^2+5^2=\)`, answer: 41 }, { pre: R`　\(6^2=\)`, answer: 36 }] },
      after: '41 ≠ 36，所以 4、5、6 <b>不是</b>直角三角形。' },
    { say: '三邊 7、24、25 呢？',
      ask: { type: 'num', fields: [{ pre: R`\(7^2+24^2=\)`, answer: 625 }, { pre: R`　\(25^2=\)`, answer: 625 }] },
      after: '一樣！所以 7、24、25 是直角三角形 ✔' },
    { say: R`常見的「畢氏三兄弟」背起來，考試超快：<br>（3, 4, 5）、（5, 12, 13）、（8, 15, 17）、（7, 24, 25）<br>它們<b>放大或縮小</b>也可以！`,
      ask: { type: 'choice', q: '下面哪一組也是直角三角形的三邊？', options: [
        { t: '6、8、10', ok: true, why: '就是 (3,4,5) 放大 2 倍。' },
        { t: '6、8、12', why: '36＋64＝100，可是 12²＝144。' },
        { t: '3、4、6', why: '9＋16＝25，6²＝36，不一樣。' }] } },
    { say: '小數也可以放大縮小：',
      ask: { type: 'choice', q: '1.5、2、2.5 是直角三角形嗎？', options: [
        { t: '是，它是 (3,4,5) 的一半', ok: true, why: R`\(1.5^2+2^2=2.25+4=6.25=2.5^2\) ✔` },
        { t: '不是，小數不能當邊長', why: '邊長可以是小數喔！算算看 1.5²＋2²。' }] } },
    { say: challenge('小心偽裝！'),
      ask: { type: 'choice', q: '下列哪一組<b>不是</b>直角三角形的三邊？', options: [
        { t: R`\(3^2\)、\(4^2\)、\(5^2\)（也就是 9、16、25）`, ok: true, why: R`邊長是 9、16、25：\(81+256=337\)，但 \(25^2=625\)，不相等！<b>是 3、4、5 才對，不是它們的平方</b>。` },
        { t: '9、40、41', why: '81＋1600＝1681＝41²，是直角三角形。' },
        { t: '8、15、17', why: '畢氏三兄弟之一！64＋225＝289＝17²。' },
        { t: '1.2、1.6、2', why: '(3,4,5) 乘 0.4：1.44＋2.56＝4＝2²。' }] } },
    { say: challenge(R`直角三角形三邊是 \(x\)、\(x+1\)、5，其中 \(x+1\) 是斜邊。`),
      ask: { type: 'num', q: R`\(x=\)？`, fields: [{ answer: 12 }], hint: '想想畢氏三兄弟：5、12、13，13 比 12 大 1！' } }
  ] };

  /* =========================================================
     第 4 關：方格和坐標上的距離
     ========================================================= */
  const S4 = { id: 's4', badge: '🗺️', title: '第 4 關　方格上的距離', steps: [
    { say: '在方格紙上畫一條斜線，怎麼量長度？<br>把它當成<b>直角三角形的斜邊</b>！',
      scene: (h) => { dotGrid(h, 2, 2, [{ from: [0, 0], to: [2, 1], legs: true, lx: '2', ly: '1' }]); },
      ask: { type: 'num', fields: [{ pre: '橫走', answer: 2, post: '格' }, { pre: '　直走', answer: 1, post: '格' }, { pre: '　斜線²＝', answer: 5 }] },
      after: R`斜線長 \(=\sqrt{2^2+1^2}=\sqrt5\)。` },
    { say: '從左下角到右上角：',
      scene: (h) => { dotGrid(h, 2, 2, [{ from: [0, 0], to: [2, 2], legs: true, lx: '2', ly: '2' }]); },
      ask: rad('斜線長＝√8＝？', 2, 2, '8＝2×2×2') },
    { say: '這 9 個點（2×2 的方格），任兩點連線，可能有哪些長度？',
      scene: (h) => { dotGrid(h, 2, 2, []); },
      ask: { type: 'choice', q: '下列哪一個長度<b>不可能</b>出現？', options: [
        { t: R`\(\sqrt3\)`, ok: true, why: R`橫、直只能走 0、1、2 格，平方和只可能是 1、2、4、5、8，湊不出 3。` },
        { t: R`\(\sqrt5\)`, why: '橫 2、直 1 就是 √5。' },
        { t: R`\(2\sqrt2\)`, why: '對角線：橫 2、直 2，√8＝2√2。' },
        { t: R`\(\sqrt2\)`, why: '一小格的對角線就是 √2。' }] } },
    { say: R`坐標平面也一樣！A(1, 1)、B(4, 5)：`,
      scene: (h) => { coord(h, { xr: [-1, 6], yr: [-1, 6], pts: [{ p: [1, 1], t: 'A(1,1)', dy: 14 }, { p: [4, 5], t: 'B(4,5)' }], segs: [{ a: [1, 1], b: [4, 5], legs: true, lx: '?', ly: '?' }] }); },
      ask: { type: 'num', fields: [{ pre: '橫差 4−1＝', answer: 3 }, { pre: '　直差 5−1＝', answer: 4 }, { pre: '　AB＝', answer: 5 }] } },
    { say: R`有負數也不怕：A(−2, 3)、B(4, −5)。<br>橫差＝4−(−2)，直差＝3−(−5)。`,
      scene: (h) => { coord(h, { xr: [-3, 5], yr: [-6, 4], pts: [{ p: [-2, 3], t: 'A' }, { p: [4, -5], t: 'B', dx: 8, dy: 10 }], segs: [{ a: [-2, 3], b: [4, -5], legs: true }] }); },
      ask: { type: 'num', fields: [{ pre: '橫差＝', answer: 6, diag: [{ v: 2, msg: '4−(−2)＝4＋2＝6。' }] }, { pre: '　直差＝', answer: 8, diag: [{ v: 2, msg: '3−(−5)＝3＋5＝8。' }] }, { pre: '　AB＝', answer: 10 }] },
      after: formula(R`\(\overline{AB}=\sqrt{(x_1-x_2)^2+(y_1-y_2)^2}\)`, '橫差的平方＋直差的平方，再開根號') },
    { say: challenge('點 P(−3, 4) 到原點 O(0, 0) 的距離：'),
      scene: (h) => { coord(h, { xr: [-4, 2], yr: [-1, 5], pts: [{ p: [-3, 4], t: 'P' }, { p: [0, 0], t: 'O', dx: 6, dy: 14 }], segs: [{ a: [-3, 4], b: [0, 0], legs: true }] }); },
      ask: { type: 'num', fields: [{ pre: R`\(\overline{PO}=\)`, answer: 5 }] } },
    { say: challenge(R`A(2, −1)，B 點和 A 的距離是 5。`),
      ask: { type: 'choice', q: 'B 點<b>不可能</b>是哪一個？', options: [
        { t: '(6, 4)', ok: true, why: R`橫差 4、直差 5：\(\sqrt{16+25}=\sqrt{41}\ne5\)。` },
        { t: '(5, 3)', why: '橫差 3、直差 4，距離 5 ✔' },
        { t: '(−2, 2)', why: '橫差 4、直差 3，距離 5 ✔' },
        { t: '(2, 4)', why: '橫差 0、直差 5，距離 5 ✔' }] } }
  ] };

  /* =========================================================
     第 5 關：可可貓外送（應用題）
     ========================================================= */
  const mapSvg = (h, inner, w, hh) => raw(h, w || 320, hh || 220, inner);
  const S5 = { id: 's5', badge: '🛵', title: '第 5 關　可可貓外送', steps: [
    { say: '可可貓騎車外送：從店裡往<b>東</b> 6 公里，再往<b>北</b> 8 公里，到了客人家。',
      scene: (h) => { mapSvg(h, `<line x1="50" y1="190" x2="230" y2="190" stroke="#f6a54b" stroke-width="4"/><line x1="230" y1="190" x2="230" y2="30" stroke="#8cc084" stroke-width="4"/><line x1="50" y1="190" x2="230" y2="30" stroke="#d6452f" stroke-width="3" stroke-dasharray="7 5"/><text x="40" y="208" font-size="22">🏪</text><text x="226" y="26" font-size="22">🏠</text><text x="140" y="210" text-anchor="middle" class="ruler-t">東 6</text><text x="246" y="112" class="ruler-t">北 8</text><text x="124" y="100" class="ruler-t" fill="#d6452f">直線？</text><text x="290" y="40" class="ruler-t" style="font-style:normal;font-size:13px">↑北</text>`); },
      ask: { type: 'num', q: '店到客人家的<b>直線距離</b>是幾公里？', fields: [{ answer: 10, post: '公里', diag: [{ v: 14, msg: '6＋8 是騎車走的路，直線要用畢氏定理：√(36＋64)。' }] }] },
      after: '👉 東西向、南北向互相垂直，剛好形成<b>直角</b>！' },
    { say: '可可貓爬梯子掛招牌：梯子長 5 公尺，梯子的腳離牆 3 公尺。',
      scene: (h) => { mapSvg(h, `<rect x="40" y="20" width="16" height="180" fill="#e9cfa6" stroke="#5b3a26"/><line x1="20" y1="200" x2="300" y2="200" stroke="#5b3a26" stroke-width="2"/><line x1="56" y1="40" x2="176" y2="200" stroke="#8a5a3c" stroke-width="6" stroke-linecap="round"/><rect x="56" y="188" width="12" height="12" fill="none" stroke="#5b3a26"/><text x="116" y="216" text-anchor="middle" class="ruler-t">3 公尺</text><text x="130" y="110" class="ruler-t">梯子 5 公尺</text><text x="66" y="124" class="ruler-t" fill="#d6452f">高？</text>`); },
      ask: { type: 'num', q: '梯子頂端離地多高？', fields: [{ answer: 4, post: '公尺', diag: [{ v: 34, msg: '求股要用減的：25−9＝16，再開根號。' }] }], hint: '斜邊是梯子 5，一股是 3：√(25−9)。' } },
    { say: R`外送地圖題：<br>・圖書館：從店往北 500 公尺，再往東 100 公尺<br>・郵局：從店往西 300 公尺，再往北 20 公尺<br>・車站：在郵局東邊 40 公尺<br>把店當作原點 (0, 0)，東是 x、北是 y：`,
      scene: (h) => { coord(h, { xr: [-6, 2], yr: [-1, 6], pts: [{ p: [0, 0], t: '店', dx: 6, dy: 14 }, { p: [1, 5], t: '圖書館', dx: -40, dy: -12 }, { p: [-3, 0.2], t: '郵局', dx: -18, dy: -12 }, { p: [-2.6, 0.2], t: '車站', dx: 4, dy: 16 }] }); },
      ask: { type: 'num', q: '寫出坐標（單位：公尺）：', fields: [{ pre: '圖書館 (', answer: 100 }, { pre: ',', answer: 500, post: ')' }, { pre: '　車站 (', answer: -260 }, { pre: ',', answer: 20, post: ')' }], hint: '車站在郵局 (−300, 20) 的東邊 40：x 加 40。' } },
    { say: R`圖書館 (100, 500)、車站 (−260, 20)，算直線距離：`,
      scene: (h) => { coord(h, { xr: [-6, 2], yr: [-1, 6], pts: [{ p: [1, 5], t: '圖書館', dx: -40, dy: -12 }, { p: [-2.6, 0.2], t: '車站', dx: 4, dy: 16 }], segs: [{ a: [-2.6, 0.2], b: [1, 5], legs: true }] }); },
      ask: { type: 'num', fields: [{ pre: '橫差＝', answer: 360 }, { pre: '　直差＝', answer: 480 }, { pre: '　距離＝', answer: 600, post: '公尺' }], hint: '360 和 480 都是 120 的倍數：3×120、4×120，所以斜邊是 5×120。' },
      after: '👉 數字很大時，先找公因數，常常會變成畢氏三兄弟！' },
    { say: challenge('等腰三角形巧克力：底 10 公分，兩腰都是 13 公分。'),
      scene: (h) => { mapSvg(h, `<polygon points="40,180 280,180 160,30" fill="#f28fad" stroke="#5b3a26" stroke-width="2.5"/><line x1="160" y1="30" x2="160" y2="180" stroke="#5b3a26" stroke-width="2" stroke-dasharray="6 4"/><rect x="160" y="168" width="12" height="12" fill="none" stroke="#5b3a26"/><text x="100" y="198" text-anchor="middle" class="ruler-t">5</text><text x="220" y="198" text-anchor="middle" class="ruler-t">5</text><text x="82" y="100" class="ruler-t">13</text><text x="226" y="100" class="ruler-t">13</text><text x="166" y="110" class="ruler-t">高？</text>`, 320, 210); },
      ask: { type: 'num', fields: [{ pre: '高＝', answer: 12 }, { pre: '　面積＝', answer: 60, post: '平方公分' }], hint: '從頂點往下切一半，變成 5、?、13 的直角三角形。' } },
    { say: challenge('正方體禮盒，邊長 2。從左下前角到右上後角的對角線 PQ：'),
      scene: (h) => { mapSvg(h, `<polygon points="60,80 200,80 200,200 60,200" fill="#e9cfa6" fill-opacity=".5" stroke="#5b3a26" stroke-width="2"/><polygon points="60,80 110,40 250,40 200,80" fill="#e9cfa6" fill-opacity=".8" stroke="#5b3a26" stroke-width="2"/><polygon points="200,80 250,40 250,160 200,200" fill="#c9a77a" fill-opacity=".6" stroke="#5b3a26" stroke-width="2"/><line x1="60" y1="200" x2="250" y2="160" stroke="#f6a54b" stroke-width="3" stroke-dasharray="6 4"/><line x1="60" y1="200" x2="250" y2="40" stroke="#d6452f" stroke-width="3"/><text x="44" y="214" class="ruler-t">P</text><text x="256" y="36" class="ruler-t">Q</text><text x="130" y="216" class="ruler-t">2</text><text x="160" y="196" class="ruler-t" fill="#c0561f">底面對角線</text>`, 320, 230); },
      ask: rad(R`底面對角線 \(=\sqrt{2^2+2^2}=\sqrt8\)；再和高 2 組成直角三角形：PQ＝\(\sqrt{8+4}=\)？`, 2, 3, '√12＝√(2×2×3)') ,
      after: R`👉 邊長 \(a\) 的正方體，對角線是 \(\sqrt3\,a\)。用了兩次畢氏定理！` }
  ] };

  /* =========================================================
     第 6 關：接力與立體（多個直角三角形、數線上的 √2、梯子下滑、長方體、螞蟻）
     ========================================================= */
  const relay = (h, l2) => raw(h, 320, 230, `<polygon points="40,200 160,200 160,40" fill="#fff7e8" stroke="#5b3a26" stroke-width="2.5"/><polygon points="40,200 160,40 280,130" fill="#f6a54b" fill-opacity=".35" stroke="#5b3a26" stroke-width="2.5"/><rect x="148" y="188" width="12" height="12" fill="none" stroke="#5b3a26"/><polygon points="160,40 169.6,47.2 162.4,56.8 152.8,49.6" fill="none" stroke="#5b3a26"/><text x="100" y="218" text-anchor="middle" class="ruler-t">3</text><text x="174" y="124" class="ruler-t">4</text><text x="86" y="112" class="ruler-t" fill="#c0561f">${l2 || '?'}</text><text x="232" y="78" class="ruler-t">12</text><text x="226" y="178" class="ruler-t" fill="#d6452f">AD＝?</text><text x="30" y="214" class="ruler-t">A</text><text x="160" y="32" class="ruler-t">C</text><text x="288" y="134" class="ruler-t">D</text>`);
  const rootLine = (h) => raw(h, 330, 200, `<line x1="20" y1="170" x2="315" y2="170" stroke="var(--ink)" stroke-width="2"/><g class="ruler-t" style="font-style:normal;font-size:13px"><text x="40" y="190" text-anchor="middle">0</text><text x="120" y="190" text-anchor="middle">1</text><text x="200" y="190" text-anchor="middle">2</text><text x="280" y="190" text-anchor="middle">3</text></g><line x1="40" y1="164" x2="40" y2="176" stroke="var(--muted)"/><line x1="120" y1="164" x2="120" y2="176" stroke="var(--muted)"/><line x1="200" y1="164" x2="200" y2="176" stroke="var(--muted)"/><line x1="280" y1="164" x2="280" y2="176" stroke="var(--muted)"/><polygon points="40,170 120,170 120,90" fill="#f6a54b" fill-opacity=".35" stroke="#5b3a26" stroke-width="2"/><rect x="110" y="160" width="10" height="10" fill="none" stroke="#5b3a26"/><path d="M120,90 A113,113 0 0 1 153,170" fill="none" stroke="#d6452f" stroke-width="2" stroke-dasharray="5 4"/><circle cx="153" cy="170" r="6" fill="#d6452f"/><text x="153" y="152" text-anchor="middle" class="ruler-t" fill="#d6452f">?</text><text x="130" y="132" class="ruler-t">1</text><text x="70" y="122" class="ruler-t">√2</text><text x="40" y="60" class="ruler-t" style="font-style:normal;font-size:13px">用圓規以 0 為中心，把斜邊轉下來</text>`);
  const ladder = (h) => raw(h, 320, 230, `<rect x="40" y="10" width="14" height="200" fill="#e9cfa6" stroke="#5b3a26"/><line x1="20" y1="210" x2="310" y2="210" stroke="#5b3a26" stroke-width="2"/><line x1="54" y1="26" x2="104" y2="210" stroke="#8a5a3c" stroke-width="6" stroke-linecap="round"/><line x1="54" y1="140" x2="174" y2="210" stroke="#8a5a3c" stroke-width="6" stroke-linecap="round" opacity=".45" stroke-dasharray="10 6"/><text x="80" y="226" text-anchor="middle" class="ruler-t">5</text><text x="18" y="90" class="ruler-t" style="font-size:13px">原本</text><text x="96" y="112" class="ruler-t">13</text><text x="150" y="168" class="ruler-t" style="font-style:normal;font-size:13px">滑下來以後</text><text x="104" y="226" class="ruler-t" fill="#d6452f">→ 移動？</text>`);
  const boxSvg = (h) => raw(h, 320, 230, `<polygon points="70,60 150,60 150,210 70,210" fill="#e9cfa6" fill-opacity=".5" stroke="#5b3a26" stroke-width="2"/><polygon points="70,60 120,30 200,30 150,60" fill="#e9cfa6" fill-opacity=".8" stroke="#5b3a26" stroke-width="2"/><polygon points="150,60 200,30 200,180 150,210" fill="#c9a77a" fill-opacity=".6" stroke="#5b3a26" stroke-width="2"/><line x1="70" y1="210" x2="200" y2="180" stroke="#f6a54b" stroke-width="3" stroke-dasharray="6 4"/><line x1="70" y1="210" x2="200" y2="30" stroke="#d6452f" stroke-width="3"/><text x="110" y="226" class="ruler-t">4</text><text x="180" y="210" class="ruler-t">3</text><text x="210" y="110" class="ruler-t">12</text><text x="210" y="190" class="ruler-t" fill="#c0561f" style="font-size:13px">底面對角線</text>`);
  const antSvg = (h) => raw(h, 330, 200, `<polygon points="30,80 90,80 90,170 30,170" fill="#e9cfa6" fill-opacity=".5" stroke="#5b3a26" stroke-width="2"/><polygon points="30,80 60,55 120,55 90,80" fill="#e9cfa6" fill-opacity=".8" stroke="#5b3a26" stroke-width="2"/><polygon points="90,80 120,55 120,145 90,170" fill="#c9a77a" fill-opacity=".6" stroke="#5b3a26" stroke-width="2"/><text x="20" y="186" class="ruler-t">A</text><text x="122" y="50" class="ruler-t">B</text><text x="54" y="190" class="ruler-t">2</text><text x="146" y="112" font-size="26">➜</text><rect x="190" y="40" width="60" height="120" fill="#e9cfa6" fill-opacity=".5" stroke="#5b3a26" stroke-width="2"/><line x1="190" y1="100" x2="250" y2="100" stroke="#5b3a26" stroke-dasharray="4 3"/><line x1="190" y1="160" x2="250" y2="40" stroke="#d6452f" stroke-width="3"/><text x="180" y="176" class="ruler-t">A</text><text x="254" y="38" class="ruler-t">B</text><text x="220" y="178" class="ruler-t">2</text><text x="258" y="104" class="ruler-t">2＋2</text><text x="190" y="28" class="ruler-t" style="font-style:normal;font-size:13px">攤平兩個面</text>`);
  const S6 = { id: 's6', badge: '🧗', title: '第 6 關　接力與立體', steps: [
    { say: '兩個直角三角形連在一起：三角形 ABC 的斜邊 AC，剛好是三角形 ACD 的一股。<b>接力</b>算下去！',
      scene: (h) => { relay(h); },
      ask: { type: 'num', q: '① 先算第一個的斜邊 AC：', fields: [{ pre: 'AC＝', answer: 5 }] } },
    { say: '② 再用 AC＝5 當第二個三角形的股：',
      scene: (h) => { relay(h, '5'); },
      ask: { type: 'num', q: 'AD＝？', fields: [{ answer: 13, diag: [{ v: 17, msg: '5＋12 不對喔！要用畢氏定理：√(5²＋12²)。' }] }] },
      after: '👉 <b>接力題：先找出兩個三角形「共用的邊」，算出它，再算下一個。</b>' },
    { say: R`在數線上找 \(\sqrt2\) 的位置：畫一個兩股都是 1 的直角三角形，斜邊就是 \(\sqrt2\)；再用圓規把斜邊「轉」到數線上。`,
      scene: (h) => { rootLine(h); },
      ask: { type: 'choice', q: '紅點大約在哪裡？', options: [
        { t: '1.41 左右（1 和 2 之間）', ok: true, why: R`\(\sqrt2\approx1.414\)，2-1 算過的！` },
        { t: '剛好 2', why: R`斜邊比 1 長、但比 1＋1＝2 短。\(\sqrt2\approx1.414\)。` },
        { t: '0.5', why: '斜邊是最長的邊，一定比股（1）長。' }] },
      after: R`同樣的方法，兩股 2 和 1 的斜邊是 \(\sqrt5\)，就能在數線上畫出 \(\sqrt5\)。` },
    { say: '梯子長 13 公尺，靠在牆上，梯腳離牆 5 公尺。',
      scene: (h) => { ladder(h); },
      ask: { type: 'num', q: '梯子頂端離地多高？', fields: [{ answer: 12, post: '公尺' }], hint: '√(13²−5²)' } },
    { say: '梯子頂端往下滑了 7 公尺，現在頂端高 12−7＝5 公尺。梯子長度不變，還是 13。',
      scene: (h) => { ladder(h); },
      ask: { type: 'num', fields: [{ pre: '現在梯腳離牆', answer: 12, post: '公尺' }, { pre: '　梯腳移動了', answer: 7, post: '公尺' }], hint: '√(13²−5²)＝12；12−5' },
      after: '頂端滑 7，底端也剛好移動 7（只是剛好，不是每次都一樣）。' },
    { say: '長方體盒子長 4、寬 3、高 12，最長能放進多長的細棒？（從底部一角到頂部對角）',
      scene: (h) => { boxSvg(h); },
      ask: { type: 'num', fields: [{ pre: '底面對角線＝', answer: 5 }, { pre: '　細棒最長＝', answer: 13 }], hint: '底面：√(4²＋3²)＝5；再和高 12：√(5²＋12²)' },
      after: '👉 <b>立體的斜線：先算底面對角線，再和高組成直角三角形</b>（用兩次畢氏定理）。' },
    { say: '螞蟻在邊長 2 的正方體<b>表面</b>爬，從 A 到 B 最短要爬多遠？（不能穿過盒子！）',
      scene: (h) => { antSvg(h); },
      ask: { type: 'choice', q: '把盒子的兩個面攤平，會變成什麼？', options: [
        { t: '長 4、寬 2 的長方形，直直連 A 到 B', ok: true, why: '攤平以後，兩點之間直線最短！' },
        { t: '還是正方體，要沿著邊走', why: '沿著邊走是 2＋2＋2＝6，不是最短。攤平後走斜線比較短。' }] } },
    { say: '攤平後的長方形長 4、寬 2：',
      scene: (h) => { antSvg(h); },
      ask: rad(R`最短距離 \(=\sqrt{4^2+2^2}=\sqrt{20}=\)？`, 2, 5, '20＝2×2×5') },
    { say: challenge('坐標平面上 A(2, 4)，B 點在 x 軸上，而且 AB＝5。'),
      scene: (h) => { coord(h, { xr: [-2, 6], yr: [-1, 5], pts: [{ p: [2, 4], t: 'A(2,4)' }, { p: [-1, 0], t: '?', dy: 14 }, { p: [5, 0], t: '?', dy: 14 }], segs: [{ a: [-1, 0], b: [2, 4], legs: true }, { a: [5, 0], b: [2, 4] }] }); },
      ask: { type: 'num', q: 'B 點的 x 坐標可能是？' + '<div class="muted small">（兩個答案，順序可對調；負的按 ±）</div>', groups: [[0], [1]], fields: [{ answer: -1 }, { pre: '或', answer: 5 }], hint: '直差是 4、斜邊 5 → 橫差 3。往左 3 或往右 3。' } },
    { say: challenge('直角三角形周長 12、斜邊 5。兩股是 x、y：x＋y＝7、x²＋y²＝25。'),
      ask: { type: 'num', q: R`用 1-1 的公式：\((x+y)^2=x^2+y^2+2xy\)，所以 \(2xy=49-25\)。三角形面積 \(\frac{xy}{2}=\)？`, fields: [{ answer: 6 }], hint: '2xy＝24 → xy＝12 → 面積 12÷2' } }
  ] };

  const STAGES = [S1, S2, S3, S4, S5, S6];
  document.addEventListener('DOMContentLoaded', () => Lesson.mount('math8a-2-3', STAGES, { signed: true }));
})();
