/* =============================================================
   DY Hair 德宇发制品 · 全站产品数据（唯一的产品清单）
   纯原生 JavaScript，无框架、无依赖
   ------------------------------------------------------------
   【加一款产品】只需在下面「产品清单」区复制一行、改 4 个地方：

       p('分类id', '产品编号', '中文名称', 'English Name');

   官网为纯英文版，只显示第 4 个参数（英文名称）；
   第 3 个参数是保留的中文名称，前台不渲染，方便以后需要时恢复双语。
   图片会自动对应 images/product-<产品编号>.jpg
   例如：p('hair-weft', 'hair-weft-03', '无痕发帘', 'Invisible Weft');
         → 图片就放 images/product-hair-weft-03.jpg
   产品编号自动生成为 DW-W03，详情页会自动认识它，不用再改别的文件。

   【每个分类默认 50 款】文件最下面的 7 行 batch() 已全部启用，
   每个分类自动补齐到 50 款，共 350 个款式位。想少放几款，
   把对应那一行的数字改小，或在行首加 // 注释掉即可。例如：

       batch('hair-weft', 50, '发帘款式', 'Hair Weft Style');

   这一行会自动把发帘补齐到 50 款（已有款式不会被覆盖），
   编号 hair-weft-01 ~ -50，图片依次放：
       images/product-hair-weft-01.jpg
       images/product-hair-weft-02.jpg
       ……
       images/product-hair-weft-50.jpg
   每个分类最多支持 99 款。7 个分类都启用就有 350 款，页面会自动分批显示。

   【分类 id 请勿修改】下面 7 个 id 与 7 个独立分类页的文件名一一对应。
   【图片命名】全部小写英文 + 数字 + 连字符，扩展名必须是 .jpg（不要用 .png / .JPG）。
   ============================================================= */
(function (global) {
  'use strict';

  /* ===== 7 个一级分类（id 固定，名称可改） ===== */
  var CATEGORIES = [
    { id: 'hair-weft',       num: '01', zh: '发帘',     en: 'Hair Weft',               code: 'W' },
    { id: 'hair-bulk',       num: '02', zh: '发把',     en: 'Hair Bulk',               code: 'B' },
    { id: 'hair-extensions', num: '03', zh: '接发',     en: 'Hair Extensions',         code: 'E' },
    { id: 'ponytail',        num: '04', zh: '马尾',     en: 'Ponytail',                code: 'P' },
    { id: 'lace-closure',    num: '05', zh: '蕾丝发块', en: 'Lace Closure',            code: 'C' },
    { id: 'lace-wigs',       num: '06', zh: '蕾丝发套', en: 'Lace Wigs',               code: 'L' },
    { id: 'medical-wigs',    num: '07', zh: '定制头套', en: 'Customized Medical Wigs',  code: 'M' }
  ];

  /* ===== 产品清单（每行一款，复制任意一行加产品即可） =====
     第 5 个参数（内部货号，如 DW-W01）可以省略，会自动按「分类字母 + 序号」生成 */
  var ITEMS = [];
  function p(cat, id, zh, en, code) {
    ITEMS.push({ cat: cat, id: id, zh: zh, en: en, code: code || '' });
  }

  /* hair-weft */
  p('hair-weft', 'hair-weft-01', '经典机织发帘', 'Classic Machine Weft');
  p('hair-weft', 'hair-weft-02', '手工编织发帘', 'Hand-tied Weft');

  /* hair-bulk */
  p('hair-bulk', 'hair-bulk-01', '顺发发把', 'Aligned Bulk Hair');
  p('hair-bulk', 'hair-bulk-02', '自然发把', 'Natural Bulk Hair');

  /* hair-extensions */
  p('hair-extensions', 'hair-extensions-01', '夹片接发', 'Clip-in Extensions');
  p('hair-extensions', 'hair-extensions-02', '胶带接发', 'Tape-in Extensions');
  p('hair-extensions', 'hair-extensions-03', '棒棒发', 'I-Tip Hair');
  p('hair-extensions', 'hair-extensions-04', '指甲发', 'U-Tip Hair');
  p('hair-extensions', 'hair-extensions-05', '平板发', 'Flat-Tip Hair');
  p('hair-extensions', 'hair-extensions-06', '钢丝发', 'Nano Ring Hair');
  p('hair-extensions', 'hair-extensions-07', '鱼线发', 'Micro Ring Hair');

  /* ponytail */
  p('ponytail', 'ponytail-01', '缠绕式马尾', 'Wrap-around Ponytail');
  p('ponytail', 'ponytail-03', '抓夹马尾', 'Claw Clip Ponytail');
  p('ponytail', 'ponytail-04', '拉绳马尾', 'Drawstring Ponytail');

  /* lace-closure */
  p('lace-closure', 'lace-closure-01', '4×4 蕾丝发块', '4x4 Lace Closure');
  p('lace-closure', 'lace-closure-02', '5×5 蕾丝发块', '5x5 Lace Closure');
  p('lace-closure', 'lace-closure-03', '2×6 蕾丝发块', '2x6 Lace Closure');
  p('lace-closure', 'lace-closure-04', '13×4 蕾丝发块', '13x4 Lace Closure');
  p('lace-closure', 'lace-closure-05', '13×6 蕾丝发块', '13x6 Lace Closure');
  p('lace-closure', 'lace-closure-06', '360 蕾丝发块', '360 Lace Closure');
  p('lace-closure', 'lace-closure-07', '6×6 蕾丝发块', '6x6 Lace Closure');
  p('lace-closure', 'lace-closure-08', '7×7 蕾丝发块', '7x7 Lace Closure');
  p('lace-closure', 'lace-closure-09', '6×9 蕾丝发块', '6x9 Lace Closure');
  p('lace-closure', 'lace-closure-10', '4×6 蕾丝发块', '4x6 Lace Closure');

  /* lace-wigs */
  p('lace-wigs', 'lace-wigs-01', '全蕾丝发套', 'Full Lace Wig');
  p('lace-wigs', 'lace-wigs-02', '前蕾丝发套', 'Lace Front Wig');

  /* medical-wigs */
  p('medical-wigs', 'medical-wigs-01', '医疗用定制头套', 'Customized Medical Wig');
  p('medical-wigs', 'medical-wigs-02', '来样定制头套', 'Sample-based Custom Wig');

  /* ===== 批量占位：把某个分类一次补齐到 N 款 =====
     已有编号自动跳过，不会覆盖上面手写的款式名称。
     7 行默认全部启用；想停用某个分类，在该行最前面加 // 即可。 */
  function batch(cat, total, zh, en) {
    var used = {};
    ITEMS.forEach(function (it) { if (it.cat === cat) used[it.id] = true; });
    for (var i = 1; i <= total; i++) {
      var no = ('0' + i).slice(-2);
      var id = cat + '-' + no;
      if (used[id]) continue;
      p(cat, id, zh + ' ' + no, en + ' ' + no);
    }
  }

  batch('hair-weft',       50, '发帘款式',     'Hair Weft Style');
  batch('hair-bulk',       50, '发把款式',     'Hair Bulk Style');
  batch('hair-extensions', 50, '接发款式',     'Hair Extension Style');
  batch('ponytail',        50, '马尾款式',     'Ponytail Style');
  batch('lace-closure',    50, '蕾丝发块款式', 'Lace Closure Style');
  batch('lace-wigs',       50, '蕾丝发套款式', 'Lace Wig Style');
  batch('medical-wigs',    50, '定制头套款式', 'Custom Wig Style');

  /* ===== 自动补全产品编号（没写 code 的按「分类字母 + 序号」生成） ===== */
  ITEMS.forEach(function (it) {
    if (it.code) return;
    var letter = 'X';
    CATEGORIES.forEach(function (c) { if (c.id === it.cat) letter = c.code; });
    var m = /-(\d+)$/.exec(it.id);
    it.code = 'DW-' + letter + (m ? m[1] : '01');
  });

  /* ===== 对外提供的数据接口（products.html 与 product-detail.html 共用） ===== */
  global.DY_PRODUCTS = {
    categories: CATEGORIES,
    items: ITEMS,
    image: function (id) { return 'images/product-' + id + '.jpg'; },
    byId: function (id) {
      for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return ITEMS[i];
      return null;
    },
    category: function (id) {
      for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
      return null;
    }
  };
})(typeof window !== 'undefined' ? window : this);
