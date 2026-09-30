/* ================= 顶部大菜单（Products / Applications 式） =================
   形态对齐 allegromicro.com：顶级项悬停展开全宽面板，左栏切换右栏内容，
   窄屏（≤1200px，与 CSS 断点一致）降级为手风琴。
   面板 HTML 静态写在页面里（非 JS 生成），保证无脚本时链接仍可访问。 */
(function () {
  var header = document.querySelector('.site-header');
  var nav = document.querySelector('.main-nav');
  if (!header || !nav) return;

  var items = [].slice.call(nav.querySelectorAll('.nav-item.has-mega'));
  if (!items.length) return;

  var desktop = window.matchMedia('(min-width: 1201px)');
  var closeTimer = null;

  function setOpen(item, open) {
    item.classList.toggle('open', open);
    var btn = item.querySelector('.nav-btn');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAll(except) {
    items.forEach(function (it) { if (it !== except) setOpen(it, false); });
  }
  function closeAllNow() { clearTimeout(closeTimer); closeAll(null); }

  items.forEach(function (item) {
    var mega = item.querySelector('.mega');
    if (!mega) return;

    /* ---- 左栏（rail）↔ 右栏面板联动 ---- */
    var railBtns = [].slice.call(mega.querySelectorAll('.mega-rail-item'));
    var panels = [].slice.call(mega.querySelectorAll('.mega-panel'));

    function activate(railBtn) {
      var id = railBtn.getAttribute('data-panel');
      railBtns.forEach(function (b) {
        b.classList.toggle('on', b === railBtn);
      });
      panels.forEach(function (p) {
        p.classList.toggle('on', p.getAttribute('data-panel') === id);
      });
    }
    railBtns.forEach(function (b) {
      b.addEventListener('mouseenter', function () { activate(b); });
      b.addEventListener('focus', function () { activate(b); });
      b.addEventListener('click', function () { activate(b); });
    });
    if (railBtns.length) activate(railBtns[0]);

    /* ---- 顶级项 ---- */
    var btn = item.querySelector('.nav-btn');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var willOpen = !item.classList.contains('open');
        closeAll(item);
        setOpen(item, willOpen);
      });
    }

    item.addEventListener('mouseenter', function () {
      if (!desktop.matches) return;
      clearTimeout(closeTimer);
      closeAll(item);
      setOpen(item, true);
    });
    item.addEventListener('mouseleave', function () {
      if (!desktop.matches) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () { setOpen(item, false); }, 130);
    });
    item.addEventListener('focusin', function () {
      if (!desktop.matches) return;
      clearTimeout(closeTimer);
      closeAll(item);
      setOpen(item, true);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') closeAllNow();
  });
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) closeAllNow();
  });
  window.addEventListener('resize', function () {
    if (!desktop.matches) closeAllNow();
  });

  /* 汉堡收起时同步关掉大菜单（延后一拍，确保读到汉堡切换后的状态） */
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      window.setTimeout(function () {
        if (!nav.classList.contains('open')) closeAllNow();
      }, 0);
    });
  }
})();
