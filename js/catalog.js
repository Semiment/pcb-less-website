/* 通用产品目录渲染器
 * 数据来自 js/catalog-data.js（window.CATALOG）
 * 页面只需提供 5 个钩子容器：
 *   [data-catalog="key"]            品类 Tab 条
 *   [data-catalog-search="key"]     搜索框
 *   [data-catalog-count="key"]      计数
 *   [data-catalog-head="key"]       表头 <thead>
 *   [data-catalog-body="key"]       表体 <tbody>
 */
(function () {
  /* 文案取自 js/i18n.js 的全局 t()；该文件未被显式引用，却是这里唯一的翻译来源，
     缺失时退化为「原样返回」而不是抛 ReferenceError 把整张表渲染崩掉。 */
  var t = (typeof window !== 'undefined' && typeof window.t === 'function')
    ? window.t : function (s) { return s; };
  var DATA = window.CATALOG || {};
  var CART_KEY = 'boda_cart';
  var PAGE = 40;

  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function dash(v) {
    var s = String(v === null || v === undefined ? '' : v).trim();
    return (s === '' || s === '-' || s === '—' || s === 'null') ? '—' : s;
  }
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; }
  }
  function setCart(c) {
    localStorage.setItem(CART_KEY, JSON.stringify(c));
    var badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = c.length;
      badge.classList.toggle('show', c.length > 0);
    }
  }

  /* 列选择：在该范围内统计每个字段的「有值覆盖率」，
   * 只保留覆盖 >= 35% 的列，最多 9 列。
   * 这样切到「全部」时不会并出几十列的超宽表，切到具体品类时又能显示它的专属参数。 */
  function colsFor(cfg, grp) {
    var rows = cfg.rows.filter(function (r) { return !grp || (r.grp || r.cat) === grp; });
    var order = [], cnt = {};
    rows.forEach(function (r) {
      for (var k in r.spec) {
        if (!(k in cnt)) { cnt[k] = 0; order.push(k); }
        var v = String(r.spec[k] === null || r.spec[k] === undefined ? '' : r.spec[k]).trim();
        if (v && v !== '—' && v !== '-') cnt[k]++;
      }
    });
    var n = rows.length || 1;
    var keep = order.filter(function (k) { return cnt[k] / n >= 0.35; });
    return keep.slice(0, 9);
  }

  function setup(key) {
    var cfg = DATA[key];
    if (!cfg || !cfg.rows) return;
    var tabBar = document.querySelector('[data-catalog="' + key + '"]');
    var input = document.querySelector('[data-catalog-search="' + key + '"]');
    var countEl = document.querySelector('[data-catalog-count="' + key + '"]');
    var thead = document.querySelector('[data-catalog-head="' + key + '"]');
    var tbody = document.querySelector('[data-catalog-body="' + key + '"]');
    if (!tbody) return;

    var state = { grp: '', q: '', limit: PAGE };

    /* --- 大类 Tab --- */
    var groups = [], gseen = {};
    cfg.rows.forEach(function (r) {
      if (!gseen[r.grp || r.cat]) { gseen[r.grp || r.cat] = 1; groups.push(r.grp || r.cat); }
    });
    if (tabBar) {
      var html = t('<button class="subcat on" data-grp="">全部 ') + cfg.rows.length + '</button>';
      groups.forEach(function (g) {
        var n = cfg.rows.filter(function (r) { return (r.grp || r.cat) === g; }).length;
        html += '<button class="subcat" data-grp="' + esc(g) + '">' + esc(g) + ' ' + n + '</button>';
      });
      tabBar.innerHTML = html;
      tabBar.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('.subcat') : null;
        if (!b) return;
        state.grp = b.getAttribute('data-grp') || '';
        state.limit = PAGE;
        [].forEach.call(tabBar.querySelectorAll('.subcat'), function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        draw();
      });
    }

    if (input) {
      /* ⚠️ 变量名不可叫 t：var 会提升到 setup 函数作用域，遮蔽外层 IIFE 的翻译函数 t()，
         导致 draw() 里所有 t('…') 抛「t is not a function」、整张表渲染不出来（2026-09-29 冒烟实测） */
      var debounce = null;
      input.addEventListener('input', function () {
        clearTimeout(debounce);
        debounce = setTimeout(function () { state.q = input.value.trim(); state.limit = PAGE; draw(); }, 140);
      });
    }

    function matched() {
      var q = state.q.toLowerCase();
      return cfg.rows.filter(function (r) {
        if (state.grp && (r.grp || r.cat) !== state.grp) return false;
        if (!q) return true;
        if (r.model.toLowerCase().indexOf(q) !== -1) return true;
        if ((r.cat || '').toLowerCase().indexOf(q) !== -1) return true;
        if ((r.desc || '').toLowerCase().indexOf(q) !== -1) return true;
        var hit = false;
        for (var k in r.spec) {
          if (String(r.spec[k]).toLowerCase().indexOf(q) !== -1) { hit = true; break; }
        }
        if (hit) return true;
        if (r.feats) {
          for (var i = 0; i < r.feats.length; i++) {
            if (r.feats[i].toLowerCase().indexOf(q) !== -1) return true;
          }
        }
        return false;
      });
    }

    function draw() {
      var list = matched();
      var cols = colsFor(cfg, state.grp);
      var shown = list.slice(0, state.limit);

      if (thead) {
        thead.innerHTML = t('<tr><th>型号</th>')
          + cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('')
          + t('<th>操作</th></tr>');
      }

      if (!shown.length) {
        tbody.innerHTML = '<tr><td colspan="' + (cols.length + 2) + '">'
          + t('<div class="empty-state">没有匹配的型号，试试更短的关键词或切换品类。</div></td></tr>');
      } else {
        tbody.innerHTML = shown.map(function (r) {
          var cart = getCart();
          var inCart = cart.indexOf(r.model) !== -1;
          var cells = cols.map(function (c) {
            return '<td>' + esc(dash(r.spec[c])) + '</td>';
          }).join('');
          var doc = r.pdf
            ? '<a class="btn btn-sm btn-ghost" href="' + esc(r.pdf) + t('" target="_blank" rel="noopener">规格书</a> ')
            : '';
          return '<tr>'
            + '<td><strong>' + esc(r.model) + '</strong>'
            + (r.cat && r.cat !== r.grp ? ' <span class="tag">' + esc(r.cat) + '</span>' : '')
            + (r.desc ? '<div class="cell-sub">' + esc(r.desc) + '</div>' : '') + '</td>'
            + cells
            + '<td>' + doc
            + '<button class="btn btn-sm btn-add' + (inCart ? ' added' : '') + '" data-model="'
            + esc(r.model) + '">' + (inCart ? t('已加入') : t('加入清单')) + '</button></td>'
            + '</tr>';
        }).join('');
        if (list.length > shown.length) {
          tbody.innerHTML += '<tr><td colspan="' + (cols.length + 2) + '">'
            + t('<button class="btn btn-sm btn-ghost more-btn">显示更多（剩余 ')
            + (list.length - shown.length) + t(' 款）</button></td></tr>');
        }
      }

      /* 标记已由本渲染器接管，避免 app.js 的 bindCartButtons 二次绑定
       *（否则点一次会同时触发t("加入")和t("移除")） */
      [].forEach.call(tbody.querySelectorAll('.btn-add'), function (b) { b._bound = true; });

      if (countEl) {
        countEl.textContent = t('共 ') + list.length + t(' 款')
          + (list.length > shown.length ? t('，已显示 ') + shown.length : '');
      }
    }

    /* 事件委托：加入清单 / 显示更多 */
    tbody.addEventListener('click', function (e) {
      var more = e.target.closest ? e.target.closest('.more-btn') : null;
      if (more) { state.limit += PAGE; draw(); return; }
      var btn = e.target.closest ? e.target.closest('.btn-add') : null;
      if (!btn) return;
      var m = btn.getAttribute('data-model');
      var cart = getCart();
      var i = cart.indexOf(m);
      if (i === -1) {
        cart.push(m); btn.classList.add('added'); btn.textContent = t('已加入');
      } else {
        cart.splice(i, 1); btn.classList.remove('added'); btn.textContent = t('加入清单');
      }
      setCart(cart);
    });

    /* --- URL 深链：?cat=<系列名>&q=<关键词>（由品牌/品类菜单直接定位到下行数据） ---
       容错：参数值在当前页匹配不到任何 Tab / 型号时保持默认视图，不影响常规浏览。
       例：sensors.html?cat=开关霍尔 / sensors.html?q=SC2402 */
    var qs = (function () {
      var o = {};
      try {
        location.search.replace(/^\?/, '').split('&').forEach(function (kv) {
          if (!kv) return;
          var p = kv.split('=');
          o[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || '').replace(/\+/g, ' '));
        });
      } catch (e) { /* 容错：任何解析异常都退化为「无参数」 */ }
      return o;
    })();
    if (qs.q && input) { input.value = qs.q; state.q = input.value.trim(); }

    draw();

    if (qs.cat && tabBar) {
      var hitBtn = null;
      [].forEach.call(tabBar.querySelectorAll('.subcat'), function (b) {
        if (b.getAttribute('data-grp') === qs.cat) hitBtn = b;
      });
      if (hitBtn) {
        hitBtn.click();                     // 复用已有 click 处理，Tab 状态与表格同步
        if (tabBar.scrollIntoView) tabBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function boot() {
    ['sensors', 'motor', 'power'].forEach(function (k) {
      if (document.querySelector('[data-catalog-body="' + k + '"]')) setup(k);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
