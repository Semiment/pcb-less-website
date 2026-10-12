/* 产品页：视图切换（卡片 / 列表）+ 浮动选型清单计数
   —— 纯行为增强。卡片与表格都由后端静态输出在 HTML 里，GEO 不依赖本脚本（AI 爬虫不执行 JS）。 */
(function () {
  var LIST_ON = 'pv-list-on';

  /* 视图切换：作用域限定在各自的 .pv-sec，同页多张表互不干扰 */
  document.addEventListener('click', function (ev) {
    var btn = ev.target && ev.target.closest ? ev.target.closest('.pv-btn') : null;
    if (!btn) return;
    var sec = btn.closest('.pv-sec');
    if (!sec) return;
    var wantList = btn.getAttribute('data-view') === 'list';
    sec.classList.toggle(LIST_ON, wantList);
    var btns = sec.querySelectorAll('.pv-btn');
    for (var i = 0; i < btns.length; i++) {
      var isList = btns[i].getAttribute('data-view') === 'list';
      btns[i].classList.toggle('on', isList === wantList);
    }
  });

  /* 浮动清单：跟随 app.js 既有的 localStorage boda_cart，不重复绑定加入/移除逻辑 */
  function cartCount() {
    try {
      return (JSON.parse(localStorage.getItem('boda_cart') || '[]')).length;
    } catch (err) {
      return 0;
    }
  }

  function syncFab() {
    var fab = document.querySelector('.cart-fab');
    if (!fab) return;
    var n = cartCount();
    var badge = fab.querySelector('.cart-n');
    if (badge) badge.textContent = n;
    fab.classList.toggle('show', n > 0);
  }

  document.addEventListener('click', function () { setTimeout(syncFab, 50); });
  window.addEventListener('storage', syncFab);
  syncFab();

  /* 点浮动清单 → 滚到本页「选型支持」区（含电话） */
  document.addEventListener('click', function (ev) {
    var fab = ev.target && ev.target.closest ? ev.target.closest('.cart-fab') : null;
    if (!fab) return;
    var target = document.querySelector('.quick-pick');
    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
