/* 柏达官网原型交互脚本 */

/* ---------- 产品数据（来自 Notion 产品库实际导入，原型示例 12 款） ----------
   原定义在 sensors.html 内联；首页 Hero 选型台也要用，故提到公共脚本。
   未核实的参数一律空字符串（页面渲染为 "—"），禁止编造。 */
window.PRODUCTS = [
  { model: "SC2498T", type: t("2D 平面/垂直"), typeNorm: "2D", series: t("汽车锁存霍尔"), feature: t("2D 平面感应"), voltage: "2.7~40", current: "4.1mA", output: t("开漏输出"), bop: "30", brp: "-80", pkg: "SOT23", temp: "-40~150°C" },
  { model: "SC25898", type: t("1D 垂直"), typeNorm: "1D", series: t("汽车锁存霍尔"), feature: t("2 线 PCB-Less 电流输出，工厂编程，集成电容"), voltage: "4.0~24", current: "4.1mA", output: t("电流输出"), bop: "80", brp: "-80", pkg: "SIP3 / TS2", temp: "-40~150°C" },
  { model: "SC25896", type: t("1D 垂直"), typeNorm: "1D", series: t("汽车锁存霍尔"), feature: t("2 线 PCB-Less 电流输出，工厂编程"), voltage: "4.0~24", current: "6.0mA", output: t("电流输出"), bop: "80", brp: "-80", pkg: "SIP3 / TS2", temp: "-40~150°C" },
  { model: "SC2943", type: t("1D 垂直"), typeNorm: "1D", series: t("汽车锁存霍尔"), feature: t("60V 耐压，高灵敏度，限流保护 40mA"), voltage: "2.7~40", current: "1.2mA", output: t("开漏输出"), bop: "30", brp: "-30", pkg: "SOT23 / SIP3", temp: "-40~150°C" },
  { model: "SC2919", type: t("1D 垂直"), typeNorm: "1D", series: t("汽车锁存霍尔"), feature: t("250V 超高耐压，车用 48V 系统直供电"), voltage: "4.0~125", current: "1.5mA", output: t("开漏输出"), bop: "70", brp: "-70", pkg: "SOT23 / SIP3", temp: "-40~150°C" },
  { model: "SC2948", type: t("1D 垂直"), typeNorm: "1D", series: t("汽车锁存霍尔"), feature: t("60V 耐压，低灵敏度，限流保护 40mA"), voltage: "2.7~40", current: "1.2mA", output: t("开漏输出"), bop: "80", brp: "-80", pkg: "SOT23 / SIP3", temp: "-40~150°C" },
  { model: "SC2002", type: t("1D 垂直"), typeNorm: "1D", series: t("低成本锁存霍尔"), feature: t("带微功耗模式，电池级的启动电压"), voltage: "1.8~5.5", current: "1.2mA", output: t("开漏输出"), bop: "20", brp: "-20", pkg: "SOT23-3L / SOT23-5L", temp: "-40~125°C" },
  { model: "SC2401", type: t("1D 垂直"), typeNorm: "1D", series: t("低成本锁存霍尔"), feature: t("超高灵敏度"), voltage: "", current: "", output: t("开漏输出"), bop: "-9", brp: "9", pkg: "SOT23 / SIP3", temp: "" },
  { model: "SC2402", type: t("1D 垂直"), typeNorm: "1D", series: t("低成本锁存霍尔"), feature: t("高灵敏度，适合对成本有极致要求的场景"), voltage: "", current: "", output: t("开漏输出"), bop: "-20", brp: "20", pkg: "SOT23 / SIP3", temp: "" },
  { model: "SC2403", type: t("2D 平面/垂直"), typeNorm: "2D", series: t("低成本锁存霍尔"), feature: t("高可靠性"), voltage: "", current: "", output: t("开漏输出"), bop: "30", brp: "-30", pkg: "SOT23 / SIP3", temp: "" },
  { model: "SC2202", type: "1D", typeNorm: "1D", series: t("低成本锁存霍尔"), feature: t("内置 10k 上拉；开漏输出；高斩波频率；抗振动/噪声"), voltage: "2.5~24", current: "1.6mA", output: t("内置上拉"), bop: "-20", brp: "20", pkg: "SIP3 / SOT23", temp: "-40~125°C" },
  { model: "SC1245", type: t("1D 垂直"), typeNorm: "1D", series: t("低成本锁存霍尔"), feature: t("高压低成本，适用于大功率电机"), voltage: "", current: "", output: t("开漏输出"), bop: "-50", brp: "50", pkg: "SIP3", temp: "-40~125°C" }
];

/* ---------- 移动端菜单 ---------- */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  /* ---------- 滚动渐显 ---------- */
  setupReveal();

  /* ---------- 按钮涟漪微交互 ---------- */
  setupRipple();

  /* ---------- 首页 Hero 选型台（浮于首屏右半部分） ---------- */
  setupHeroPicker();

  /* ---------- 选型清单（演示：localStorage 存储） ---------- */
  updateCartBadge();

  document.querySelectorAll('.btn-add').forEach(function (btn) {
    // 已在清单中的标记为已添加
    var model = btn.getAttribute('data-model');
    if (model && getCart().indexOf(model) !== -1) {
      btn.classList.add('added');
      btn.textContent = t('已加入');
    }
    btn.addEventListener('click', function () {
      var m = btn.getAttribute('data-model');
      var cart = getCart();
      var idx = cart.indexOf(m);
      if (idx === -1) {
        cart.push(m);
        btn.classList.add('added');
        btn.textContent = t('已加入');
        showToast('已加入选型清单：' + m);
      } else {
        cart.splice(idx, 1);
        btn.classList.remove('added');
        btn.textContent = t('加入清单');
        showToast('已从选型清单移除：' + m);
      }
      localStorage.setItem('boda_cart', JSON.stringify(cart));
      updateCartBadge();
    });
  });

  /* ---------- 表格筛选（传感器页演示） ---------- */
  var searchInput = document.getElementById('modelSearch');
  var typeSelect = document.getElementById('typeFilter');
  var outSelect = document.getElementById('outputFilter');
  var sensSelect = document.getElementById('sensFilter');
  var tempSelect = document.getElementById('tempFilter');
  var countEl = document.getElementById('filterCount');
  var tbody = document.getElementById('productTbody');
  if (tbody && window.PRODUCTS) {
    /* URL 参数预填：顶部全局搜索跳转带入关键词 */
    if (searchInput) {
      var m = location.search.match(/[?&]model=([^&]*)/);
      if (m) {
        try { searchInput.value = decodeURIComponent(m[1]); } catch (e) { searchInput.value = m[1]; }
      }
    }
    /* URL 参数预填：首页 Hero 选型台深链带入系列 / 输出形式 */
    var pSeries = param('series');
    if (pSeries) {
      window.SERIES_FILTER = pSeries;
      document.querySelectorAll('#seriesBar .subcat').forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-series') === pSeries);
      });
    }
    var pOutput = param('output');
    if (pOutput && outSelect) { outSelect.value = pOutput; }
    /* 首页 Hero 选型台透传的感应方向 / 灵敏度 / 温度等级 */
    var pType = param('type');
    if (pType && typeSelect) { typeSelect.value = pType; }
    var pSens = param('sens');
    if (pSens && sensSelect) { sensSelect.value = pSens; }
    var pTemp = param('temp');
    if (pTemp && tempSelect) { tempSelect.value = pTemp; }
    var render = function () {
      var kw = (searchInput && searchInput.value || '').trim().toLowerCase();
      var type = typeSelect ? typeSelect.value : '';
      var out = outSelect ? outSelect.value : '';
      var sens = sensSelect ? sensSelect.value : '';
      var temp = tempSelect ? tempSelect.value : '';
      var series = window.SERIES_FILTER || '';
      var rows = window.PRODUCTS.filter(function (p) {
        var hitKw = !kw || p.model.toLowerCase().indexOf(kw) !== -1
          || (p.feature || '').toLowerCase().indexOf(kw) !== -1
          || (p.pkg || '').toLowerCase().indexOf(kw) !== -1;
        var hitType = !type || p.typeNorm === type;
        var hitOut = !out || p.output === out;
        var hitSens = !sens || sensBand(p) === sens;
        var hitTemp = !temp || p.temp === temp;
        var hitSeries = !series || p.series === series;
        return hitKw && hitType && hitOut && hitSens && hitTemp && hitSeries;
      });
      var html = rows.map(function (p) {
        var cell = function (v) {
          return v ? '<td class="num">' + esc(v) + '</td>' : '<td class="empty-cell">—</td>';
        };
        return '<tr>'
          + '<td><span class="model">' + esc(p.model) + '</span></td>'
          + (p.feature ? '<td class="feat">' + esc(p.feature) + '</td>' : '<td class="feat empty-cell">—</td>')
          + '<td>' + esc(p.type) + '</td>'
          + cell(p.voltage) + cell(p.current)
          + '<td>' + esc(p.output) + '</td>'
          + cell(p.bop) + cell(p.brp)
          + '<td>' + esc(p.pkg) + '</td>'
          + cell(p.temp)
          + '<td><button class="btn-add" data-model="' + esc(p.model) + t('">加入清单</button></td>')
          + '</tr>';
      }).join('');
      if (!rows.length) {
        html = '<tr><td colspan="11"><div class="empty-state">'
          + '<div class="box"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8C8C8C" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></div>'
          + t('<h4>该品类型号数据同步中</h4><p>原型阶段暂未导入此品类数据，正式版上线时从产品库全量加载；也可直接来电让我们协助选型</p></div></td></tr>');
      }
      tbody.innerHTML = html;
      if (countEl) { countEl.innerHTML = t('共 <b>') + rows.length + t('</b> 款型号'); }
      // 重新绑定加入按钮状态
      bindCartButtons();
    };
    var inputs = [searchInput, typeSelect, outSelect, sensSelect, tempSelect];
    inputs.forEach(function (el) {
      if (el) {
        el.addEventListener('input', render);
        el.addEventListener('change', render);
      }
    });
    // 静态原型：先展示骨架屏微交互，再填入真实型号（模拟云端拉取）
    setTimeout(render, 220);
  }

  /* ---------- 联系表单：邮件通道（无后端也能真实送达） ----------
     背景：站点是纯静态托管，没有服务端可写库。改为构造 mailto 把内容送到业务邮箱，
     保证"客户填完 → 老板收得到"这条链今天就能跑通；等云数据库开通后再换成落库 + 后台。
     ⚠️ 不伪造成功：mailto 是否真的唤起客户端前端无法判定，故同时明文展示内容供复制。 */
  var form = document.getElementById('inquiryForm');
  if (form) {
    var MAIL_TO = '2099166018@qq.com';
    var fallback = document.getElementById('inquiryFallback');
    var fallbackBox = document.getElementById('inquiryFallbackBox');
    var copyBtn = document.getElementById('inquiryCopy');

    // 文案取自 DOM（构建器已本地化），不用 window.t —— i18n.js 词典覆盖不全，缺词会静默退回中文
    var msg = function (id, dft) {
      var el = document.getElementById(id);
      return el && el.textContent ? el.textContent.trim() : dft;
    };
    // 字段名也取自页面 label：与当前语言天然一致，无需维护第二套词典
    var labelOf = function (n) {
      var ctl = form.querySelector('[name="' + n + '"]');
      if (!ctl) return n;
      var g = ctl.closest('.form-group');
      var lab = g && g.querySelector('label');
      return lab ? lab.textContent.replace('*', '').trim() : n;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (n) {
        var el = form.querySelector('[name="' + n + '"]');
        return el ? String(el.value || '').trim() : '';
      };
      var lines = [
        labelOf('name') + '：' + get('name'),
        labelOf('company') + '：' + get('company'),
        labelOf('phone') + '：' + get('phone'),
        labelOf('category') + '：' + get('category'),
        labelOf('detail') + '：' + (get('detail') || '—'),
        '',
        '—— ' + (location.href || '')
      ];
      var body = lines.join('\n');
      var subject = '[PCB-LESS 询价] ' + (get('company') || get('name')) + ' · ' + get('category');

      // 明文兜底：无论 mailto 是否唤起，都把内容摊开，客户可复制走
      if (fallback && fallbackBox) {
        fallbackBox.value = MAIL_TO + '\n' + subject + '\n\n' + body;
        fallback.hidden = false;
      }
      window.location.href = 'mailto:' + MAIL_TO +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      showToast(msg('i18nToastSent', '已打开邮件客户端，请直接发送'));
    });

    if (copyBtn && fallbackBox) {
      copyBtn.addEventListener('click', function () {
        var ok = false;
        try {
          fallbackBox.removeAttribute('readonly');
          fallbackBox.select();
          ok = document.execCommand('copy');
          fallbackBox.setAttribute('readonly', 'readonly');
        } catch (err) { ok = false; }
        if (!ok && navigator.clipboard) {
          navigator.clipboard.writeText(fallbackBox.value);
          ok = true;
        }
        showToast(ok ? msg('i18nToastCopied', '已复制') : msg('i18nToastManual', '请手动全选复制'));
      });
    }
  }
});

/* ---------- 工具函数 ---------- */
/* 灵敏度分级：按工作点 Bop 的绝对值分档（口径对齐公司自有描述——
   SC2943「高灵敏度」Bop=30、SC2401「超高灵敏度」Bop=9、SC2948「低灵敏度」Bop=80）。
   注：产品库里个别记录（SC2401 / SC2402 / SC2202 / SC1245）的 Bop·Brp 正负号方向与其余
   记录相反，取绝对值可规避该数据标注差异；原始值仍按库中数据原样展示，不擅自改写。 */
function sensBand(p) {
  var b = Math.abs(parseFloat(p && p.bop));
  if (isNaN(b)) return '';
  if (b <= 30) return t('高');
  if (b <= 70) return t('标准');
  return t('低');
}
function setupReveal() {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  // 环境不支持 IntersectionObserver 时直接显示，避免内容永久隐藏
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  items.forEach(function (el) { io.observe(el); });
}

/* 按钮涟漪：点击位置扩散的圆形反馈，点击后自动移除，不影响导航与既有 hover */
function setupRipple() {
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var r = document.createElement('span');
      r.className = 'ripple';
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size / 2) + 'px';
      r.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(r);
      setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 380);
    });
  });
}

function siteSearch(e) {
  e.preventDefault();
  var input = e.target.querySelector('.hs-input');
  var kw = (input && input.value || '').trim();
  if (!kw) return false;
  window.location.href = 'sensors.html?model=' + encodeURIComponent(kw);
  return false;
}
/* 读取 URL 查询参数（已解码），没有则返回空串 */
function param(key) {
  var m = location.search.match(new RegExp('[?&]' + key + '=([^&]*)'));
  if (!m) return '';
  try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
}
/* ---------- 首页 Hero 选型台 ----------
   纯前端演示：基于已导入的 12 款真实数据实时统计匹配数，
   并把条件透传到 sensors.html（该页已支持 type / series / output / sens / temp 参数预填）。 */
function setupHeroPicker() {
  var picker = document.querySelector('.hero-picker');
  if (!picker) return;
  var chips = picker.querySelectorAll('.hp-chip');
  var countEl = document.getElementById('hpCount');
  var goEl = document.getElementById('hpGo');
  var resetEl = picker.querySelector('.hp-reset');
  var data = window.PRODUCTS || [];
  /* 三组筛选面全部对应传感器页已有的筛选控件，且每个选项都有真实数据支撑。
     sens 为派生维度（按 |Bop| 分级），其余直接取产品字段。 */
  var KEYS = ['typeNorm', 'output', 'sens'];
  var QKEY = { typeNorm: 'type' };   // 跳转到传感器页时的参数名映射
  var state = { typeNorm: '', output: '', sens: '' };
  function val(p, k) { return k === 'sens' ? sensBand(p) : p[k]; }

  function active() {
    return KEYS.some(function (k) { return !!state[k]; });
  }
  function render() {
    var n = data.filter(function (p) {
      return KEYS.every(function (k) { return !state[k] || val(p, k) === state[k]; });
    }).length;
    if (countEl) countEl.textContent = n;
    if (resetEl) resetEl.classList.toggle('show', active());
    if (goEl) {
      var qs = KEYS.filter(function (k) { return state[k]; })
        .map(function (k) { return (QKEY[k] || k) + '=' + encodeURIComponent(state[k]); });
      goEl.setAttribute('href', 'sensors.html' + (qs.length ? '?' + qs.join('&') : ''));
    }
    chips.forEach(function (b) {
      var k = b.getAttribute('data-k');
      var on = !!state[k] && state[k] === b.getAttribute('data-v');
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  picker.addEventListener('click', function (e) {
    if (e.target.closest('.hp-reset')) {
      state = { typeNorm: '', output: '', sens: '' };
      render();
      return;
    }
    var b = e.target.closest('.hp-chip');
    if (!b) return;
    var k = b.getAttribute('data-k');
    if (!k) return;
    var v = b.getAttribute('data-v');
    state[k] = (state[k] === v) ? '' : v;   // 再点一次取消
    render();
  });
  render();
}
function getCart() {
  try { return JSON.parse(localStorage.getItem('boda_cart') || '[]'); }
  catch (e) { return []; }
}
function updateCartBadge() {
  var badge = document.querySelector('.cart-badge');
  if (badge) {
    var n = getCart().length;
    badge.textContent = n;
    badge.classList.toggle('show', n > 0);
  }
}
function bindCartButtons() {
  document.querySelectorAll('.btn-add').forEach(function (btn) {
    if (btn._bound) return;
    btn._bound = true;
    var model = btn.getAttribute('data-model');
    if (model && getCart().indexOf(model) !== -1) {
      btn.classList.add('added');
      btn.textContent = t('已加入');
    }
    btn.addEventListener('click', function () {
      var m = btn.getAttribute('data-model');
      var cart = getCart();
      var idx = cart.indexOf(m);
      if (idx === -1) {
        cart.push(m);
        btn.classList.add('added');
        btn.textContent = t('已加入');
        showToast('已加入选型清单：' + m);
      } else {
        cart.splice(idx, 1);
        btn.classList.remove('added');
        btn.textContent = t('加入清单');
        showToast('已从选型清单移除：' + m);
      }
      localStorage.setItem('boda_cart', JSON.stringify(cart));
      updateCartBadge();
    });
  });
}
var toastTimer = null;
function showToast(msg) {
  var t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
