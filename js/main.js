/* =============================================================
   DY Hair · 全站公共脚本（纯英文官网）
   纯原生 JavaScript，无框架、无依赖
   -------------------------------------------------------------
   包含 4 个功能：
   1. 图片未上传时静默隐藏破图（前台不显示任何占位提示文字）
   2. 图片点击放大灯箱（上一张 / 下一张、ESC 关闭；自动跳过未上传与被隐藏的图）
   3. 移动端汉堡菜单
   4. 滚动淡入动画
   破图处理、灯箱、淡入均支持 JS 动态生成的内容，
   动态渲染完成后调用 window.DY.refresh() 即可接管新节点。
   说明：本版为纯英文官网，没有语言切换、localStorage 语言记忆与 .zh/.en 节点。
   ============================================================= */
(function () {
  'use strict';

  /* ===== 1. 图片缺失静默处理 =====
     图片路径是占位路径（images/xxx.jpg），文件不存在时只隐藏破图，
     页面显示干净的深色块，不出现任何文件名或替换提示文字。
     把真实图片放进 images/ 目录后会自动正常显示，无需修改任何代码。
     替换指引保留在各页面图片上方的 HTML 注释中（不影响前台显示）。 */
  function markPlaceholder(img) {
    var box = img.closest ? img.closest('.media') : null;
    if (!box) return;
    box.classList.add('is-placeholder');   // 仅用于隐藏破图，不显示文字
  }
  function unmarkPlaceholder(img) {
    var box = img.closest ? img.closest('.media') : null;
    if (box && img.naturalWidth > 0) box.classList.remove('is-placeholder');
  }
  // load / error 事件不冒泡，用捕获阶段在 document 上统一监听，
  // 这样由 JS 动态生成的产品卡片图片也能自动生效
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') markPlaceholder(e.target);
  }, true);
  document.addEventListener('load', function (e) {
    if (e.target && e.target.tagName === 'IMG') unmarkPlaceholder(e.target);
  }, true);
  // 兼容「脚本执行前就已经加载失败」的静态图片
  Array.prototype.forEach.call(document.querySelectorAll('.media img'), function (img) {
    if (img.complete && img.naturalWidth === 0) markPlaceholder(img);
  });

  /* ===== 2. 图片点击放大灯箱 =====
     任何图片加上 data-lightbox 属性即可被放大预览
     可选：data-caption-en 设置英文说明文字 */
  // items 每次打开灯箱时重新收集，兼容产品页由 JS 动态生成的卡片
  var items = Array.prototype.slice.call(document.querySelectorAll('img[data-lightbox]'));
  function rescan() {
    items = Array.prototype.slice.call(document.querySelectorAll('img[data-lightbox]'));
  }
  // 产品页初始 DOM 里没有图片（卡片由脚本生成），但有 DY_PRODUCTS，同样需要创建灯箱
  if (items.length || window.DY_PRODUCTS) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image preview');
    lb.innerHTML =
      '<button class="lb-close" type="button" aria-label="Close">&times;</button>' +
      '<button class="lb-prev" type="button" aria-label="Previous">&#8249;</button>' +
      '<button class="lb-next" type="button" aria-label="Next">&#8250;</button>' +
      '<img class="lb-img" alt="" src="">' +
      '<div class="lb-counter"></div>' +
      '<div class="lb-caption"></div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('.lb-img');
    var lbCap = lb.querySelector('.lb-caption');
    var lbCounter = lb.querySelector('.lb-counter');
    var current = 0;
    var active = [];   // 当前可预览的图片（已成功加载的）

    // 灯箱里的大图同样静默处理：加载失败只隐藏图片，不显示任何提示文字
    lbImg.addEventListener('error', function () { lbImg.style.display = 'none'; });
    lbImg.addEventListener('load', function () {
      if (lbImg.naturalWidth > 0) lbImg.style.display = 'block';
    });

    // 判断某张图是否不可预览：被筛选隐藏、已确认加载失败（未上传）
    function isMissing(el) {
      var box = el.closest ? el.closest('.media') : null;
      var hidden = el.getClientRects && el.getClientRects().length === 0;
      return hidden ||
             (box && box.classList.contains('is-placeholder')) ||
             (el.complete && el.naturalWidth === 0);
    }
    // 每次打开灯箱时重新收集可预览的图片，未上传的占位图自动跳过
    function refreshActive() {
      active = items.filter(function (el) { return !isMissing(el); });
    }

    function render() {
      var el = active[current];
      if (!el) return;
      lbImg.style.display = 'block';
      lbImg.src = el.getAttribute('src');
      lbCap.textContent = el.getAttribute('data-caption-en') || el.getAttribute('alt') || '';
      lbCounter.textContent = (current + 1) + ' / ' + active.length;
      // 只有一张可预览图片时隐藏左右箭头
      var multi = active.length > 1 ? 'block' : 'none';
      lb.querySelector('.lb-prev').style.display = multi;
      lb.querySelector('.lb-next').style.display = multi;
    }

    function open(i) {
      if (i < 0) return;
      refreshActive();
      var idx = active.indexOf(items[i]);
      if (idx === -1) return;   // 这张图还没上传，不弹出空白预览
      current = idx;
      render();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';   // 打开时锁定页面滚动
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.removeAttribute('src');
    }
    function step(n) {
      if (!active.length) return;
      current = (current + n + active.length) % active.length;
      render();
    }

    // 事件委托：动态生成的产品卡片图片无需重新绑定即可点开放大
    document.addEventListener('click', function (e) {
      var img = e.target && e.target.closest ? e.target.closest('img[data-lightbox]') : null;
      if (!img) return;
      // 图片若包在 <a> 链接里（如产品分类卡片），点图片只放大预览、不跳转
      e.preventDefault();
      rescan();
      open(items.indexOf(img));
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    // 点击黑色遮罩（非图片区域）关闭
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target === lbCap || e.target === lbCounter) close();
    });
    // 键盘：ESC 关闭，左右方向键切换
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ===== 3. 移动端汉堡菜单 ===== */
  var navToggle = document.querySelector('[data-nav-toggle]');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    // 点击导航链接后自动收起菜单
    Array.prototype.forEach.call(document.querySelectorAll('.main-nav a'), function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* ===== 4. 滚动淡入动画（可选装饰，不影响内容） ===== */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null;
  if ('IntersectionObserver' in window && !reduce) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
  }
  function observe(el) {
    if (el.getAttribute('data-dy-observed')) return;   // 避免重复观察
    el.setAttribute('data-dy-observed', '1');
    if (io) io.observe(el); else el.classList.add('in-view');
  }
  function refresh() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), observe);
  }
  refresh();
  // 供分类页等页面在动态生成内容后调用：window.DY.refresh()
  window.DY = { refresh: refresh };
})();
