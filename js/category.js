/* =============================================================
   DY Hair · 分类产品页共用渲染脚本（纯英文官网）
   被 7 个 category-*.html 共同引用，纯原生 JavaScript
   -------------------------------------------------------------
   职责：读取 <body data-category-page="分类id">，从 js/products-data.js
        取出该分类的全部款式，按页渲染成产品卡片，底部生成页码按钮。
   卡片、计数器与页码按钮只输出英文；数据里的中文名称字段不渲染。
   【加产品】只改 js/products-data.js，本文件无需改动。
   【放图】把图片按 images/product-<分类id>-<序号>.jpg 放进 images/ 即显示。
   【每页数量】改下面的 PAGE_SIZE 即可（当前每页 12 款）。
   【页码网址】category-xxx.html?page=2 可直接打开第 2 页，刷新、前进后退都保持。
   脚本顺序必须是：products-data.js → main.js → category.js
   ============================================================= */
(function () {
  'use strict';

  var DATA = window.DY_PRODUCTS;
  var page = document.querySelector('[data-category-page]');
  if (!DATA || !page) return;

  var cat = page.getAttribute('data-category-page');
  var list = DATA.items.filter(function (it) { return it.cat === cat; });
  var grid = document.querySelector('[data-category-grid]');
  var pager = document.querySelector('[data-category-pager]');
  var counter = document.querySelector('[data-category-count]');
  var toolbar = document.querySelector('.category-toolbar');
  if (!grid) return;

  var PAGE_SIZE = 12;                                   // 每页显示的款数
  var totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  var current = readPageFromUrl();                     // 当前页码，支持 ?page=N

  // 转义，避免产品名里的特殊字符破坏 HTML
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  // 生成一张产品卡片，结构与产品中心页完全一致（只输出英文名称）
  function card(it) {
    var img = DATA.image(it.id);
    return '<a class="product-card" href="product-detail.html?item=' + esc(it.id) + '" data-reveal>' +
      '<div class="media"><img src="' + esc(img) + '" alt="' + esc(it.en) + '" ' +
      'loading="lazy" decoding="async" data-lightbox ' +
      'data-caption-en="' + esc(it.en) + ' · Real Product Shot"></div>' +
      '<div class="product-body">' +
      '<span class="product-code">' + esc(it.code) + ' / 100% VIRGIN HAIR</span>' +
      '<h3>' + esc(it.en) + '</h3>' +
      '<p>100% human virgin hair · dyeable &amp; restylable · custom length &amp; color</p>' +
      '<span class="product-link">View Details</span>' +
      '</div></a>';
  }

  /* ===== 1. 页码与网址同步 ===== */
  // 从网址读页码，超出范围自动收敛到最后一页
  function readPageFromUrl() {
    var m = /(?:^|[?&])page=(\d+)/.exec(location.search);
    var n = m ? parseInt(m[1], 10) : 1;
    if (!isFinite(n) || n < 1) n = 1;
    return Math.min(n, totalPages);
  }

  // 生成带页码的网址，保留其它可能存在的参数；第 1 页不带参数，网址更干净
  function urlForPage(n) {
    var parts = location.search.replace(/^\?/, '').split('&').filter(function (s) {
      return !!s && !/^page=/.test(s);
    });
    if (n > 1) parts.push('page=' + n);
    return location.pathname + (parts.length ? '?' + parts.join('&') : '') + location.hash;
  }

  // 本地双击 file:// 预览时 history 可能不可用，忽略即可，分页本身照常工作
  function writeUrl(n, push) {
    if (!window.history || !window.history.pushState) return;
    try {
      window.history[push ? 'pushState' : 'replaceState']({ dyPage: n }, '', urlForPage(n));
    } catch (e) { /* 静默降级 */ }
  }

  /* ===== 2. 页码条 ===== */
  // 页数较多时只显示「首页 + 当前页附近 + 末页」，中间用省略号
  function pageNumbers() {
    var out = [], i;
    if (totalPages <= 7) {
      for (i = 1; i <= totalPages; i++) out.push(i);
      return out;
    }
    out.push(1);
    var from = Math.max(2, current - 2);
    var to = Math.min(totalPages - 1, current + 2);
    if (from > 2) out.push('...');
    for (i = from; i <= to; i++) out.push(i);
    if (to < totalPages - 1) out.push('...');
    out.push(totalPages);
    return out;
  }

  // 上一页 / 下一页按钮（英文标签）
  function arrow(dir, target, disabled) {
    var label = dir === 'prev' ? 'Prev' : 'Next';
    var sign = dir === 'prev' ? '&lsaquo;' : '&rsaquo;';
    return '<button type="button" class="pager-arrow pager-' + dir + '" data-page="' + target + '"' +
      (disabled ? ' disabled' : '') + '>' +
      (dir === 'prev' ? sign + ' ' : '') + label + (dir === 'next' ? ' ' + sign : '') + '</button>';
  }

  function renderPager() {
    if (!pager) return;
    if (totalPages <= 1) { pager.hidden = true; pager.innerHTML = ''; return; }
    pager.hidden = false;
    var html = arrow('prev', current - 1, current <= 1);
    pageNumbers().forEach(function (n) {
      if (n === '...') {
        html += '<span class="pager-dots">&hellip;</span>';
        return;
      }
      html += '<button type="button" class="pager-num' + (n === current ? ' active' : '') +
        '" data-page="' + n + '"' + (n === current ? ' aria-current="page"' : '') +
        '>' + n + '</button>';
    });
    html += arrow('next', current + 1, current >= totalPages);
    pager.innerHTML = html;
  }

  /* ===== 3. 计数器与渲染 ===== */
  function renderCounter(from, slice) {
    if (!counter) return;
    if (!list.length) {
      counter.textContent = 'No styles yet';
      return;
    }
    var range = (from + 1) + '–' + (from + slice.length);
    counter.textContent = list.length + ' styles · page ' + current + ' of ' +
      totalPages + ' · showing ' + range;
  }

  // 换页后滚回产品区顶部，避免停在上一页的中间位置
  function scrollToGrid() {
    var target = toolbar || grid;
    var top = target.getBoundingClientRect().top +
      (window.pageYOffset || document.documentElement.scrollTop || 0) - 96;
    if (top < 0) top = 0;
    try { window.scrollTo({ top: top, behavior: 'smooth' }); }
    catch (e) { window.scrollTo(0, top); }
  }

  // 每页只显示本页的款式（替换内容，而不是追加）
  function render(scroll) {
    var from = (current - 1) * PAGE_SIZE;
    var slice = list.slice(from, from + PAGE_SIZE);
    grid.innerHTML = slice.map(card).join('');
    renderCounter(from, slice);
    renderPager();
    // 通知公共脚本接管新生成的图片（灯箱 / 破图静默 / 滚动淡入）
    if (window.DY && window.DY.refresh) window.DY.refresh();
    if (scroll) scrollToGrid();
  }

  function goTo(n, fromHistory) {
    n = Math.min(Math.max(n, 1), totalPages);
    if (n === current && !fromHistory) return;
    current = n;
    if (!fromHistory) writeUrl(n, true);
    render(true);
  }

  render(false);

  // 页码按钮用事件委托，换页重建后无需重新绑定
  if (pager) {
    pager.addEventListener('click', function (e) {
      var el = e.target;
      while (el && el !== pager && (!el.getAttribute || !el.getAttribute('data-page'))) {
        el = el.parentNode;
      }
      if (!el || el === pager || el.disabled) return;
      goTo(parseInt(el.getAttribute('data-page'), 10), false);
    });
  }

  // 浏览器前进 / 后退
  window.addEventListener('popstate', function () {
    current = readPageFromUrl();
    render(true);
  });
})();
