// ============================================================
// 带娃去哪儿 —— 页面逻辑 v4（Liquid Glass · 扁平图标）
// 界面1 首页：星标+黑标题 / 胶囊导航 / 玻璃网格 / 悬浮＋与麦克风
// 界面2 详情：返回箭头 + 胶囊跳转 + 白色浮起内容卡 + 安排出行/稍后再去
// 数据：js/data.js（CAMP_SPOTS/CAMP_META）、js/spot_coords.js、js/articles_index.js
// ============================================================
(function () {
  "use strict";

  var spots = window.CAMP_SPOTS || [];
  var meta = window.CAMP_META || {};
  var coordsMap = window.SPOT_COORDS || {};
  var lib = window.ARTICLES_INDEX || [];

  // ---------- 扁平图标（单色 SVG，随 currentColor） ----------
  var ICONS = {
    pin: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
    spark: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
    nav: '<svg class="ic" viewBox="0 0 24 24"><path d="M21 3 3 10.53l7.47 2.99L13.5 21z"/></svg>',
    bus: '<svg class="ic" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v11a2 2 0 0 1-1 1.74V20h-2v-2H6v2H4v-2.26A2 2 0 0 1 3 16V5a2 2 0 0 1 2-2zm1 3v5h10V6H6zm1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>',
    car: '<svg class="ic" viewBox="0 0 24 24"><path d="M5 11l1.5-4.5A2 2 0 0 1 8.42 5h7.16a2 2 0 0 1 1.9 1.38L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3.3a.5.5 0 0 0-.47-.34H8.77a.5.5 0 0 0-.47.34L7.2 11zM7.5 16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>',
    train: '<svg class="ic" viewBox="0 0 24 24"><path d="M8 2h8a3 3 0 0 1 3 3v10a3 3 0 0 1-1.8 2.74L19 20h-2l-1.5-2h-7L7 20H5l1.8-2.26A3 3 0 0 1 5 15V5a3 3 0 0 1 3-3zm-1 4v5h10V6H7zm1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>',
    parking: '<svg class="ic" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4 4v10h2v-3h3a3.5 3.5 0 0 0 0-7H9zm2 2h3a1.5 1.5 0 0 1 0 3h-3V9z"/></svg>',
    ticket: '<svg class="ic" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6zm9 2v8h-2V8h2z"/></svg>',
    clipboard: '<svg class="ic" viewBox="0 0 24 24"><path d="M9 2h6a1 1 0 0 1 1 1v1h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3V3a1 1 0 0 1 1-1zm1 2v2h4V4h-4zM7 11h10v2H7v-2zm0 4h10v2H7v-2z"/></svg>',
    tent: '<svg class="ic" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 3 2 21h7l3-7 3 7h7L12 3zm0 5.8L9.4 15h5.2L12 8.8z"/></svg>',
    kid: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM9 9h6v6h-2v6h-2v-6H9V9z"/></svg>',
    bulb: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 1 4 12.74V17H8v-2.26A7 7 0 0 1 12 2zM9 18h6v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1z"/></svg>',
    doc: '<svg class="ic" viewBox="0 0 24 24"><path d="M6 2h8l4 4v16H6V2zm8 1.5V7h3.5L14 3.5zM8 12h8v1.5H8V12zm0 3.5h8V17H8v-1.5z"/></svg>',
    star: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.7L12 17.2 6 20.5l1.3-6.7-5-4.7 6.8-.8z"/></svg>',
    check: '<svg class="ic" viewBox="0 0 24 24"><path d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6 12-12-1.4-1.4z"/></svg>',
    // 天气（扁平）
    sun: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM11 1h2v4h-2V1zM11 19h2v4h-2v-4zM1 11h4v2H1v-2zM19 11h4v2h-4v-2zM4.2 5.6l1.4-1.4 2.8 2.8-1.4 1.4-2.8-2.8zM15.6 17l1.4-1.4 2.8 2.8-1.4 1.4-2.8-2.8zM4.2 18.4l2.8-2.8 1.4 1.4-2.8 2.8-1.4-1.4zM15.6 7l2.8-2.8 1.4 1.4-2.8 2.8L15.6 7z"/></svg>',
    cloud: '<svg class="ic" viewBox="0 0 24 24"><path d="M6 19a5 5 0 0 1-.9-9.92A7 7 0 0 1 19 10.1 4.5 4.5 0 0 1 18 19H6z"/></svg>',
    rain: '<svg class="ic" viewBox="0 0 24 24"><path d="M6 15a5 5 0 0 1-.9-9.92A7 7 0 0 1 19 6.1 4.5 4.5 0 0 1 18 15H6zM8 17h2.2L9 21H7l1-4zm4 0h2.2L13 21h-2l1-4zm4 0h2.2L17 21h-2l1-4z"/></svg>',
    snow: '<svg class="ic" viewBox="0 0 24 24"><path d="M6 15a5 5 0 0 1-.9-9.92A7 7 0 0 1 19 6.1 4.5 4.5 0 0 1 18 15H6zM8 18h2v2H8v-2zm4 1h2v2h-2v-2zm4-1h2v2h-2v-2z"/></svg>',
    storm: '<svg class="ic" viewBox="0 0 24 24"><path d="M6 15a5 5 0 0 1-.9-9.92A7 7 0 0 1 19 6.1 4.5 4.5 0 0 1 18 15H6zm6 1-3 5h2l-1 4 4-6h-2l1-3h-1z"/></svg>',
    fog: '<svg class="ic" viewBox="0 0 24 24"><path d="M6 13a5 5 0 0 1-.9-9.92A7 7 0 0 1 19 4.1 4.5 4.5 0 0 1 18 13H6zM4 16h16v2H4v-2zm2 4h12v2H6v-2z"/></svg>',
    // 地点类型
    home: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 3 3 11h2v9h6v-6h2v6h6v-9h2L12 3z"/></svg>',
    tree: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 2 5.5 11H8l-3.5 6H11v5h2v-5h6.5L16 11h2.5L12 2z"/></svg>',
    water: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 2s6 7.2 6 11a6 6 0 0 1-12 0c0-3.8 6-11 6-11z"/></svg>',
  };
  function ic(name) {
    return ICONS[name] || "";
  }
  var ICON_SPARK = ICONS.spark;

  // ---------- 本地存储 ----------
  function load(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }
  // origin: {text, coords:[lat,lng]|null, src:"gps"|"preset"|"text"|""}
  var origin = load("camp_origin", { text: "", coords: null, src: "" });
  var trips = load("camp_trips", []);
  var favs = load("camp_favs", []);
  var CHECK_DEFAULT = ["帐篷 / 天幕", "野餐垫", "防晒 + 驱蚊", "饮用水 + 小零食", "湿巾 + 垃圾袋", "换洗衣物"];
  var checklist = load("camp_checklist", CHECK_DEFAULT.map(function (t) {
    return { t: t, done: false };
  }));

  // ---------- 小工具 ----------
  function $(sel) {
    return document.querySelector(sel);
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function daysUntil(dateStr) {
    var t = new Date(todayStr() + "T00:00:00");
    var d = new Date(dateStr + "T00:00:00");
    return Math.round((d - t) / 86400000);
  }
  function weekdayCN(dateStr) {
    var names = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return names[new Date(dateStr + "T00:00:00").getDay()];
  }
  function spotById(id) {
    for (var i = 0; i < spots.length; i++) if (spots[i].id === id) return spots[i];
    return null;
  }
  function spotCoords(s) {
    return coordsMap[s.id] || null;
  }
  function distKm(a, b) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (b[0] - a[0]) * rad, dLng = (b[1] - a[1]) * rad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function fmtKm(d) {
    return d < 10 ? d.toFixed(1) : String(Math.round(d));
  }

  // ---------- 地图链接 ----------
  function amapNav(spot, mode) {
    var c = spotCoords(spot);
    var to = c ? (c[1] + "," + c[0] + "," + spot.name) : spot.name; // 高德用 经度,纬度,名称
    return "https://uri.amap.com/navigation?to=" + encodeURIComponent(to) +
      "&mode=" + (mode || "car") + "&src=camp_kidz&coordinate=gaode&callnative=1";
  }
  function baiduRouteUrl(spot, mode) {
    return "https://api.map.baidu.com/direction?" +
      "origin=" + encodeURIComponent(origin.text || "广州市中心") +
      "&destination=" + encodeURIComponent(spot.name) +
      "&mode=" + mode +
      "&region=" + encodeURIComponent(spot.city || meta.city || "广州") +
      "&output=html&src=web_camp_kidz";
  }

  // ---------- Toast ----------
  var toastTimer = null;
  function toast(msg) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("show");
    }, 2200);
  }

  // ---------- 视图切换（胶囊） ----------
  function switchTab(name) {
    ["rec", "all", "lib", "trip"].forEach(function (t) {
      var pane = $("#tab-" + t);
      if (pane) pane.hidden = t !== name;
    });
    var pills = document.querySelectorAll("#viewPills .pill");
    for (var i = 0; i < pills.length; i++) {
      pills[i].classList.toggle("on", pills[i].getAttribute("data-tab") === name);
    }
    window.scrollTo(0, 0);
    if (name === "rec") renderHome();
    if (name === "trip") renderChecklist();
  }

  // ---------- 出发点 / 定位 ----------
  var PRESET_COORDS = {
    "珠江新城": [23.119, 113.323],
    "体育西路": [23.136, 113.323],
    "公园前": [23.129, 113.262],
    "客村": [23.093, 113.321],
    "天河公园": [23.117, 113.372],
    "番禺广场": [22.946, 113.385],
    "增城荔城": [23.290, 113.830],
    "从化街口": [23.548, 113.587],
    "佛山千灯湖": [23.030, 113.146],
    "科学城": [23.170, 113.430],
  };
  function renderLoc() {
    var st = $("#locStatus");
    if (st) st.textContent = origin.coords
      ? "已按「" + origin.text + "」的距离排序"
      : (origin.text ? "出发点：" + origin.text + "（无坐标，未按距离）" : "还没定位，按默认顺序");
    var inp = $("#originInput");
    if (inp && origin.src !== "gps") inp.value = origin.text || "";
    var hint = $("#originHint");
    if (hint) hint.textContent = origin.coords
      ? "推荐已按距离从近到远"
      : "选快捷地点或填地址，推荐就按「离你最近」排序";
  }
  function setOrigin(o) {
    origin = o;
    save("camp_origin", origin);
    renderLoc();
    renderHome();
    renderSpots();
  }
  function locate() {
    if (!navigator.geolocation) {
      var p0 = $("#originPanel");
      if (p0) p0.hidden = false;
      var h0 = $("#originHint");
      if (h0) h0.textContent = "此环境不支持定位，选快捷地点或填地址";
      return;
    }
    var st = $("#locStatus");
    if (st) st.textContent = "定位中…";
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        setOrigin({
          text: "我的位置",
          coords: [
            Math.round(pos.coords.latitude * 10000) / 10000,
            Math.round(pos.coords.longitude * 10000) / 10000,
          ],
          src: "gps",
        });
      },
      function (err) {
        var p = $("#originPanel");
        if (p) p.hidden = false;
        var h = $("#originHint");
        var tips = {
          1: "定位权限被拒绝——点地址栏锁/ⓘ 图标允许「位置」后重试；或选快捷地点",
          2: "系统定位不可用（Windows「设置→隐私→位置」可能被关闭）——选快捷地点即可",
          3: "定位超时，重试或选快捷地点",
        };
        if (h) h.textContent = tips[err && err.code] || "定位失败，选快捷地点或填地址";
        if (st) st.textContent = "定位失败，可用快捷地点";
      },
      { timeout: 8000, maximumAge: 600000 }
    );
  }

  // ---------- 距离排序 ----------
  var DEFAULT_CENTER = [23.129, 113.264];
  function recList() {
    var shown = spots.filter(function (s) {
      return (s.province || "广东") === "广东";
    });
    var ref = origin.coords || DEFAULT_CENTER;
    shown = shown
      .map(function (s) {
        var c = spotCoords(s);
        return { s: s, d: c ? distKm(ref, c) : Infinity };
      })
      .sort(function (a, b) { return a.d - b.d; })
      .map(function (x) {
        x.s._dist = origin.coords ? x.d : null;
        return x.s;
      });
    return shown;
  }

  // ---------- 首页卡片 ----------
  function spotIcon(s) {
    var t = (s.tags || []).join(",");
    if (t.indexOf("玩水溯溪") >= 0) return ic("water");
    if (t.indexOf("室内") >= 0) return ic("home");
    if (t.indexOf("可搭帐篷") >= 0) return ic("tent");
    return ic("tree");
  }
  function distBadge(s) {
    if (s._dist == null || s._dist === Infinity) return "";
    return '<span class="dist-badge">' + ic("pin") + "距你约 " + fmtKm(s._dist) + " km</span>";
  }
  function featuredCard(s) {
    if (!s) return "";
    var faved = favs.indexOf(s.id) >= 0;
    return (
      '<article class="mcard featured m-mint" data-id="' + esc(s.id) + '">' +
      '<div class="mcard-head"><span class="mcard-kicker">今日推荐</span>' +
      (faved ? '<span class="mcard-count">' + ic("star") + "已收藏</span>" : "") + "</div>" +
      '<h3 class="mcard-title">' + esc(s.name) + "</h3>" +
      distBadge(s) +
      '<p class="q-text">' + ICON_SPARK + esc(s.why || "") + "</p>" +
      '<div class="mcard-actions">' +
      '<a class="btn-create" target="_blank" rel="noopener" href="' + amapNav(s, "car") + '">' + ic("nav") + "去那里</a>" +
      '<button class="pill small act-detail" data-id="' + esc(s.id) + '">详情</button>' +
      "</div></article>"
    );
  }
  function wxCard() {
    return (
      '<article class="mcard m-blue">' +
      '<div class="mcard-head"><span class="mcard-kicker">周末天气</span></div>' +
      '<div class="wx-rows" id="wxRows"><p class="wx-empty">加载中…</p></div>' +
      "</article>"
    );
  }
  function tripsCard() {
    var next = null;
    for (var i = 0; i < trips.length; i++) {
      if (!trips[i].done && daysUntil(trips[i].date) >= 0) { next = trips[i]; break; }
    }
    var line;
    if (next) {
      var s = spotById(next.spotId) || { name: next.spotId };
      var d = daysUntil(next.date);
      var when = d === 0 ? "今天出发" : d === 1 ? "明天" : d + " 天后";
      line = "<p><b>" + esc(s.name) + "</b>　" + esc(next.date) + "（" + when + "）</p>";
    } else {
      line = '<p class="dim">还没有安排，点右下角 ＋ 新建</p>';
    }
    return (
      '<article class="mcard m-peach" data-goto="trip">' +
      '<div class="mcard-head"><span class="mcard-kicker">我的行程</span>' +
      '<span class="mcard-count">' + trips.length + "</span></div>" + line + "</article>"
    );
  }
  function miniCard(s) {
    return (
      '<article class="mcard mini" data-id="' + esc(s.id) + '">' +
      "<h4>" + esc(s.name) + "</h4>" +
      distBadge(s) +
      '<p class="mini-why">' + esc(s.why || "") + "</p>" +
      "</article>"
    );
  }
  function renderHome() {
    var list = recList();
    var grid = $("#homeGrid");
    if (grid) {
      grid.innerHTML = featuredCard(list[0]) + wxCard() + tripsCard();
    }
    var near = $("#nearGrid");
    if (near) near.innerHTML = list.slice(1, 7).map(miniCard).join("");
    paintWx();
  }
  function bindHomeGrids() {
    ["#homeGrid", "#nearGrid"].forEach(function (sel) {
      var box = $(sel);
      if (!box) return;
      box.addEventListener("click", function (e) {
        var go = e.target.closest("[data-goto]");
        if (go) { switchTab(go.getAttribute("data-goto")); return; }
        var card = e.target.closest("[data-id]");
        if (!card) return;
        var s = spotById(card.getAttribute("data-id"));
        if (s && !e.target.closest("a")) openDetail(s);
      });
    });
  }

  // ---------- 出行清单（行程页内） ----------
  function renderChecklist() {
    var box = $("#checklistBox");
    if (!box) return;
    var done = checklist.filter(function (x) { return x.done; }).length;
    box.innerHTML =
      '<div class="mcard-head"><span class="mcard-count">' + done + "/" + checklist.length + "</span></div>" +
      '<ul class="todo-list">' +
      checklist.map(function (it, i) {
        return '<li data-i="' + i + '"' + (it.done ? ' class="done"' : "") + '><span class="tick"></span>' + esc(it.t) + "</li>";
      }).join("") +
      "</ul>";
  }
  function bindChecklist() {
    var box = $("#checklistBox");
    if (!box) return;
    box.addEventListener("click", function (e) {
      var li = e.target.closest(".todo-list li");
      if (!li) return;
      var i = Number(li.getAttribute("data-i"));
      checklist[i].done = !checklist[i].done;
      save("camp_checklist", checklist);
      renderChecklist();
    });
  }

  // ---------- 天气（周末） ----------
  var wxData = null;
  function wxIcon(code) {
    if (code <= 1) return ic("sun");
    if (code === 2) return ic("cloud");
    if (code === 3) return ic("cloud");
    if (code === 45 || code === 48) return ic("fog");
    if (code >= 51 && code <= 57) return ic("rain");
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return ic("rain");
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return ic("snow");
    if (code >= 95) return ic("storm");
    return ic("cloud");
  }
  function weatherBadge() {
    var lat = 23.1291, lng = 113.2644;
    var url =
      "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
      "&longitude=" + lng +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      "&timezone=Asia%2FShanghai&forecast_days=7";
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var daily = j.daily || {};
        var sat = new Date();
        while (sat.getDay() !== 6) sat = new Date(sat.getTime() + 86400000);
        var rows = [];
        for (var i = 0; i < 7; i++) {
          var ds = daily.time[i];
          var dt = new Date(ds + "T00:00:00");
          if (dt >= sat && dt < new Date(sat.getTime() + 2 * 86400000) && dt.getDay() !== 1) {
            var ok = (daily.precipitation_probability_max[i] || 0) < 40 &&
              daily.temperature_2m_max[i] <= 34.5 && daily.temperature_2m_max[i] >= 9.5;
            rows.push({
              emoji: wxIcon(daily.weather_code[i] || 0),
              date: ds.slice(5) + " " + weekdayCN(ds),
              val: Math.round(daily.temperature_2m_min[i]) + "~" + Math.round(daily.temperature_2m_max[i]) + "℃ 降雨" +
                (daily.precipitation_probability_max[i] || 0) + "%",
              ok: ok,
            });
          }
        }
        wxData = rows;
        paintWx();
      })
      .catch(function () {
        wxData = [{ emoji: ic("cloud"), date: "--", val: "天气获取失败（需联网）", ok: false }];
        paintWx();
      });
  }
  function paintWx() {
    var box = $("#wxRows");
    if (!box || !wxData) return;
    box.innerHTML = wxData.map(function (r) {
      return '<div class="wx-row"><span class="wx-emoji">' + r.emoji + "</span>" +
        '<span class="wx-date">' + esc(r.date) + "</span>" +
        '<span class="wx-pill ' + (r.ok ? "ok" : "no") + '">' + (r.ok ? "适合" : "欠佳") + "</span></div>" +
        '<div class="wx-val">' + esc(r.val) + "</div>";
    }).join("");
  }

  // ---------- 地区下拉（全部 tab） ----------
  var regionFilter = "";
  function renderRegionOptions() {
    var sel = $("#regionSelect");
    if (!sel) return;
    var gd = spots.filter(function (s) {
      return (s.province || "广东") === "广东";
    });
    var districts = [];
    var cities = [];
    gd.forEach(function (s) {
      if ((s.city || "").indexOf("广州") >= 0) {
        if (s.district && districts.indexOf(s.district) < 0) districts.push(s.district);
      } else if (s.city && cities.indexOf(s.city) < 0) cities.push(s.city);
    });
    districts.sort(function (a, b) { return a.localeCompare(b, "zh"); });
    cities.sort(function (a, b) { return a.localeCompare(b, "zh"); });
    var html = '<option value="">全部地区</option>';
    if (districts.length) {
      html += '<optgroup label="广州各区">' + districts.map(function (d) {
        return '<option value="d:' + esc(d) + '">' + esc(d) + "</option>";
      }).join("") + "</optgroup>";
    }
    if (cities.length) {
      html += '<optgroup label="省内其他城市">' + cities.map(function (c) {
        return '<option value="c:' + esc(c) + '">' + esc(c) + "</option>";
      }).join("") + "</optgroup>";
    }
    sel.innerHTML = html;
  }
  function matchRegion(s) {
    if (!regionFilter) return true;
    var want = regionFilter.slice(2);
    if (regionFilter.charAt(0) === "d") {
      return (s.district || "").indexOf(want) >= 0;
    }
    return (s.city || "").indexOf(want) >= 0;
  }

  // ---------- 全部地点 ----------
  var activeFilters = {};
  var searchKw = "";
  var sortBy = "default";
  var FILTER_DEFS = [
    { key: "免费", label: "免费入园" },
    { key: "可搭帐篷", label: "可搭帐篷" },
    { key: "可野餐", label: "可野餐" },
    { key: "玩水溯溪", label: "玩水溯溪" },
    { key: "室内", label: "室内遛娃" },
    { key: "可明火", label: "可明火" },
    { key: "地铁直达", label: "地铁直达" },
    { key: "有停车场", label: "有停车场" },
    { key: "需预约", label: "需预约" },
  ];
  function filteredSpots() {
    var provinceShown = spots.filter(function (s) {
      return (s.province || "广东") === "广东";
    });
    var list = provinceShown.filter(function (s) {
      if (!matchRegion(s)) return false;
      for (var k in activeFilters) {
        if (activeFilters[k] && s.tags.indexOf(k) === -1) return false;
      }
      if (searchKw) {
        var hay = (s.name + " " + (s.aliases || []).join(" ") + " " + s.district + " " +
          (s.kids ? s.kids.highlights.join(" ") : "")).toLowerCase();
        if (hay.indexOf(searchKw.toLowerCase()) === -1) return false;
      }
      return true;
    });
    if (sortBy === "cheap") {
      list.sort(function (a, b) {
        return (a.cost.free === b.cost.free) ? a.name.localeCompare(b.name) : (a.cost.free ? -1 : 1);
      });
    } else if (origin.coords) {
      list.sort(function (a, b) {
        var ca = spotCoords(a), cb = spotCoords(b);
        var da = ca ? distKm(origin.coords, ca) : Infinity;
        var db = cb ? distKm(origin.coords, cb) : Infinity;
        return da - db;
      });
    }
    return list;
  }
  function renderFilters() {
    var box = $("#filterChips");
    if (!box) return;
    box.innerHTML = FILTER_DEFS.map(function (f) {
      var on = !!activeFilters[f.key];
      return '<button class="pill small' + (on ? " on" : "") + '" data-key="' + f.key + '">' + f.label + "</button>";
    }).join("");
  }
  function spotCard(s) {
    var tags = (s.tags || []).map(function (t) {
      return '<span class="tag">' + esc(t) + "</span>";
    }).join("");
    var metro = s.metro && s.metro.direct
      ? ic("train") + esc(s.metro.lines.join("/")) + " " + esc(s.metro.station) + esc(s.metro.exit || "")
      : ic("train") + "地铁不直达";
    var cost = s.cost && s.cost.free ? "免费入园" : (s.cost && s.cost.entry) || "";
    return (
      '<article class="card" data-id="' + esc(s.id) + '">' +
      '<div class="card-head"><h3>' + esc(s.name) + "</h3>" +
      '<span class="district">' + esc(s.district) + "</span></div>" +
      '<div class="tags">' + tags + "</div>" +
      '<p class="brief why">' + ICON_SPARK + esc(s.why || "") + "</p>" +
      '<p class="brief">' + metro + "　|　" + ic("ticket") + esc(cost) + "　|　信息日期 " + esc(s.infoDate) + "</p>" +
      '<p class="brief dim">' + ic("kid") + esc((s.kids && s.kids.highlights[0]) || "") + "</p>" +
      '<div class="card-actions">' +
      '<button class="btn-create small act-detail">看详情</button>' +
      '<a class="btn-save small" target="_blank" rel="noopener" href="' + baiduRouteUrl(s, "transit") + '">公交路线</a>' +
      '<a class="btn-save small" target="_blank" rel="noopener" href="' + baiduRouteUrl(s, "driving") + '">驾车路线</a>' +
      "</div></article>"
    );
  }
  function renderSpots() {
    var list = filteredSpots();
    var outside = spots.filter(function (s) { return (s.province || "广东") !== "广东"; }).length;
    var extra = outside > 0 ? "，另有 " + outside + " 个省外地点已入库暂不展示" : "";
    var count = $("#spotCount");
    if (count) {
      count.textContent = "共 " + list.length + " 个地点（信息整理自公开游记文章，" + extra + "）";
    }
    var grid = $("#spotGrid");
    if (grid) {
      grid.innerHTML = list.length
        ? list.map(spotCard).join("")
        : '<p class="empty">没有符合条件的地点，试试取消筛选～</p>';
    }
  }

  // ---------- 详情（界面2） ----------
  var currentSpot = null;
  function ul(arr) {
    return "<ul>" + arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
  }
  function dImg(s, cls) {
    return '<figure class="d-img ' + cls + '">' + spotIcon(s) + "<figcaption>实景见原文</figcaption></figure>";
  }
  function openDetail(s) {
    currentSpot = s;
    var body = $("#detailBody");
    function sec(title, html) {
      return "<h4>" + title + "</h4>" + html;
    }
    var metroHtml = s.metro
      ? sec(ic("train") + "地铁", "<p>" + (s.metro.direct
        ? esc(s.metro.lines.join("、")) + " " + esc(s.metro.station) + " " + esc(s.metro.exit || "") + "，" + esc(s.metro.note || "")
        : "地铁不直达，" + esc(s.metro.note || "")) + "</p>")
      : "";
    var parkHtml = s.parking
      ? sec(ic("parking") + "停车", "<p>" + (s.parking.available ? "有停车场，" + esc(s.parking.fee || "") + "。" : "没有停车场。") + esc(s.parking.note || "") + "</p>")
      : "";
    var travelHtml = s.travel
      ? sec(ic("car") + "出行建议", "<p>推荐「" + esc(s.travel.recommend) + "」：" + esc(s.travel.reason) + "</p>")
      : "";
    var costHtml = s.cost
      ? sec(ic("ticket") + "费用", "<p>门票：" + esc(s.cost.entry) + "。" + esc(s.cost.summary || "") + "</p>" +
        (s.cost.extras && s.cost.extras.length ? ul(s.cost.extras) : ""))
      : "";
    var bookHtml = s.booking
      ? sec(ic("clipboard") + "预约", "<p>" + (s.booking.required ? "需要预约：" : "无需预约。") + esc(s.booking.method || "") + "</p>" +
        (s.booking.note ? "<p class='dim'>" + esc(s.booking.note) + "</p>" : ""))
      : "";
    var campHtml = s.camping
      ? sec(ic("tent") + "露营/野餐", "<p>" + esc(s.camping.level) + "；帐篷：" + esc(s.camping.tents) + "</p><p>" + esc(s.camping.note) + "</p>")
      : "";
    var kidsHtml = s.kids
      ? sec(ic("kid") + "适合孩子", ul(s.kids.highlights) + "<p>⏰ " + esc(s.kids.bestTime || "") +
        (s.kids.ages ? "　|　适合年龄：" + esc(s.kids.ages) : "") + "</p>")
      : "";
    var tipsHtml = s.tips && s.tips.length ? sec(ic("bulb") + "小贴士", ul(s.tips)) : "";
    var artsHtml = sec(ic("doc") + "原文出处", s.articles.map(function (a) {
      return '<p><a target="_blank" rel="noopener" href="' + esc(a.url) + '">' + esc(a.title) + "</a>（" + esc(a.date) + "）</p>";
    }).join(""));
    var navHtml = sec(ic("nav") + "地图导航",
      '<div class="nav-links">' +
      '<a class="btn-create small" target="_blank" rel="noopener" href="' + amapNav(s, "car") + '">' + ic("nav") + "高德·驾车</a> " +
      '<a class="btn-create small" target="_blank" rel="noopener" href="' + amapNav(s, "bus") + '">' + ic("bus") + "高德·公交</a> " +
      '<a class="btn-save small" target="_blank" rel="noopener" href="' + baiduRouteUrl(s, "transit") + '">百度路线</a></div>');
    body.innerHTML =
      '<section id="d-sec-intro" class="d-card d-hero">' +
      '<h4 class="d-name">' + esc(s.name) + "</h4>" +
      '<p class="d-meta">' + esc(s.district) + " · 信息日期 " + esc(s.infoDate) + "</p>" +
      '<blockquote class="d-quote">' + ICON_SPARK + esc(s.why || "") + "</blockquote>" +
      '<div class="d-imgs">' + dImg(s, "g1") + dImg(s, "g2") + "</div>" +
      "</section>" +
      '<section id="d-sec-info" class="d-card d-sec">' +
      navHtml + metroHtml + parkHtml + travelHtml + costHtml + bookHtml + campHtml + kidsHtml + tipsHtml +
      "</section>" +
      '<section id="d-sec-src" class="d-card d-sec">' + artsHtml + "</section>";
    updateFavBtn();
    $("#tripForm").hidden = true;
    $("#tripToggle").hidden = false;
    $("#detailModal").showModal();
  }
  function updateFavBtn() {
    var btn = $("#favToggle");
    if (!btn || !currentSpot) return;
    var on = favs.indexOf(currentSpot.id) >= 0;
    btn.classList.toggle("on", on);
    btn.innerHTML = on ? ic("check") + "已收藏" : ic("star") + "稍后再去";
  }
  function toggleFav() {
    if (!currentSpot) return;
    var id = currentSpot.id;
    var i = favs.indexOf(id);
    if (i >= 0) favs.splice(i, 1);
    else favs.push(id);
    save("camp_favs", favs);
    updateFavBtn();
    renderHome();
    toast(i >= 0 ? "已取消收藏" : "已加入「稍后再去」");
  }

  // ---------- 行程与提醒 ----------
  function addTrip() {
    if (!currentSpot) return;
    var date = $("#tripDate").value;
    if (!date) {
      $("#tripMsg").textContent = "请先选日期";
      return;
    }
    trips.push({
      spotId: currentSpot.id,
      date: date,
      note: $("#tripNote").value.trim(),
      done: false,
    });
    save("camp_trips", trips);
    $("#tripMsg").textContent = "已加入行程";
    $("#tripForm").hidden = true;
    $("#tripToggle").hidden = false;
    renderTrips();
    renderReminders();
    renderHome();
  }
  function renderTrips() {
    var box = $("#tripList");
    if (!box) return;
    if (!trips.length) {
      box.innerHTML = '<p class="dim">还没有安排。打开任意地点详情，选个日期加入行程。</p>';
      return;
    }
    box.innerHTML = trips.map(function (t, i) {
      var s = spotById(t.spotId) || { name: t.spotId };
      var d = daysUntil(t.date);
      var when = d === 0 ? "今天出发" : d === 1 ? "明天" : d > 1 ? d + " 天后" : "已过";
      return (
        '<div class="trip-row' + (t.done ? " done" : "") + '">' +
        "<span><b>" + esc(s.name) + "</b>　" + esc(t.date) + "（" + weekdayCN(t.date) + "，" + when + "）" +
        (t.note ? "　" + esc(t.note) : "") + "</span>" +
        '<span><button class="mini" data-trip="' + i + '" data-op="done">' + (t.done ? "取消完成" : "完成") + "</button> " +
        '<button class="mini" data-trip="' + i + '" data-op="del">删除</button></span>' +
        "</div>"
      );
    }).join("");
  }
  function renderReminders() {
    var box = $("#remindBar");
    if (!box) return;
    var items = [];
    trips.forEach(function (t) {
      if (t.done) return;
      var d = daysUntil(t.date);
      if (d < 0) return;
      var s = spotById(t.spotId) || { name: t.spotId };
      if (d === 0) {
        items.push(ic("tent") + " <b>今天出发：" + esc(s.name) + "</b>！带好野餐垫、防晒、驱蚊、换洗衣物和小零食" +
          (t.note ? "（" + esc(t.note) + "）" : ""));
      } else if (d <= 3 && s.booking && s.booking.required) {
        items.push(ic("clipboard") + " <b>" + (d === 1 ? "明天" : d + " 天后") + "要去 " + esc(s.name) + "</b>，记得提前预约：" +
          esc((s.booking.method || "").slice(0, 40)) + "…");
      }
    });
    box.innerHTML = items.map(function (x) {
      return '<div class="remind">' + x + "</div>";
    }).join("");
  }

  // ---------- 文章库 ----------
  var libShown = 20;
  function libFiltered() {
    var kw = ($("#libSearch").value || "").trim().toLowerCase();
    var region = $("#libRegion").value;
    return lib.filter(function (a) {
      if (region === "gd" && !a.gd) return false;
      if (region === "out" && a.gd) return false;
      if (kw && (a.t || "").toLowerCase().indexOf(kw) < 0 && (a.cs || "").toLowerCase().indexOf(kw) < 0) return false;
      return true;
    });
  }
  function renderLibrary() {
    var gd = lib.filter(function (a) { return a.gd; }).length;
    var count = $("#libCount");
    if (count) count.textContent = "共 " + lib.length + " 篇 · 广东 " + gd + " · 省外 " + (lib.length - gd);
    var list = libFiltered();
    var box = $("#libList");
    if (box) {
      box.innerHTML = list.slice(0, libShown).map(function (a) {
        return '<li><a target="_blank" rel="noopener" href="' + a.u + '">' + esc(a.t) + "</a>" +
          '<span class="lib-meta">' + (a.d || "") + (a.cs ? " · " + esc(a.cs) : "") + "</span></li>";
      }).join("");
    }
    var more = $("#libMore");
    if (more) {
      more.hidden = list.length <= libShown;
      more.textContent = "加载更多（已显示 " + Math.min(libShown, list.length) + " / " + list.length + "）";
    }
  }

  // ---------- 快速新建行程（＋） ----------
  function openQuickTrip() {
    var sel = $("#qtSpot");
    if (sel && !sel.options.length) {
      sel.innerHTML = recList().map(function (s) {
        return '<option value="' + esc(s.id) + '">' + esc(s.name) + "</option>";
      }).join("");
    }
    var d = $("#qtDate");
    if (d && !d.value) {
      var t = new Date();
      t.setDate(t.getDate() + 7);
      d.value = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
    }
    var msg = $("#qtMsg");
    if (msg) msg.textContent = "";
    $("#quickTrip").showModal();
  }
  function quickAdd() {
    var id = $("#qtSpot").value;
    var date = $("#qtDate").value;
    if (!id || !date) {
      $("#qtMsg").textContent = "请选地点和日期";
      return;
    }
    trips.push({ spotId: id, date: date, note: $("#qtNote").value.trim(), done: false });
    save("camp_trips", trips);
    $("#quickTrip").close();
    renderTrips();
    renderReminders();
    renderHome();
    toast("已加入行程");
  }

  // ---------- 语音搜索（不支持时降级到搜索框） ----------
  function voiceFallback(reason) {
    switchTab("all");
    var inp = $("#searchInput");
    if (inp) { try { inp.focus(); } catch (e) {} }
    var tips = {
      "not-allowed": "需要麦克风权限：在浏览器地址栏允许「麦克风」后重试",
      "service-not-allowed": "需要麦克风权限：系统设置里允许后重试",
      "no-speech": "没听到声音，再试一次或直接输入关键词",
      network: "语音服务需要联网，可改用关键词搜索",
    };
    toast(tips[reason] || "当前浏览器不支持语音识别（微信内置浏览器不支持），已帮你切到搜索框");
  }
  function voiceSearch() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      voiceFallback("unsupported");
      return;
    }
    var r = new SR();
    r.lang = "zh-CN";
    r.interimResults = false;
    var got = false;
    toast("正在聆听…说出想找的地点");
    r.onresult = function (e) {
      got = true;
      var t = e.results[0][0].transcript;
      switchTab("all");
      $("#searchInput").value = t;
      searchKw = t;
      renderSpots();
      toast("已搜索：" + t);
    };
    r.onerror = function (e) {
      if (!got) voiceFallback(e && e.error);
    };
    r.onend = function () {
      if (!got) { /* 静默结束，不打扰 */ }
    };
    try { r.start(); } catch (e) {
      voiceFallback("start-failed");
    }
  }

  // ---------- 事件绑定 ----------
  function bind() {
    // 胶囊视图切换
    $("#viewPills").addEventListener("click", function (e) {
      var btn = e.target.closest(".pill");
      if (btn && btn.getAttribute("data-tab")) switchTab(btn.getAttribute("data-tab"));
    });
    // 定位
    $("#btnLocate").addEventListener("click", locate);
    $("#btnOriginEdit").addEventListener("click", function () {
      var p = $("#originPanel");
      p.hidden = !p.hidden;
    });
    $("#originSave").addEventListener("click", function () {
      var text = $("#originInput").value.trim();
      if (!text) return;
      var c = PRESET_COORDS[text] || null;
      setOrigin({ text: text, coords: c, src: c ? "preset" : "text" });
      $("#originPanel").hidden = true;
    });
    $("#originQuick").addEventListener("click", function (e) {
      var chip = e.target.closest(".oq-chip");
      if (!chip) return;
      var name = chip.getAttribute("data-origin");
      setOrigin({ text: name, coords: PRESET_COORDS[name] || null, src: "preset" });
      $("#originPanel").hidden = true;
    });
    // 地区下拉
    $("#regionSelect").addEventListener("change", function () {
      regionFilter = this.value;
      renderSpots();
    });
    // 筛选
    $("#filterChips").addEventListener("click", function (e) {
      var btn = e.target.closest(".pill");
      if (!btn) return;
      var k = btn.getAttribute("data-key");
      activeFilters[k] = !activeFilters[k];
      renderFilters();
      renderSpots();
    });
    $("#searchInput").addEventListener("input", function (e) {
      searchKw = e.target.value.trim();
      renderSpots();
    });
    $("#sortSelect").addEventListener("change", function (e) {
      sortBy = e.target.value;
      renderSpots();
    });
    $("#spotGrid").addEventListener("click", function (e) {
      var card = e.target.closest(".card");
      if (!card) return;
      var s = spotById(card.getAttribute("data-id"));
      if (!s) return;
      if (e.target.closest(".act-detail")) openDetail(s);
      else if (!e.target.closest("a")) openDetail(s);
    });
    // 详情弹窗
    $("#detailClose").addEventListener("click", function () {
      $("#detailModal").close();
    });
    document.querySelectorAll(".d-pills [data-jump]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = document.getElementById(btn.getAttribute("data-jump"));
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    $("#tripToggle").addEventListener("click", function () {
      $("#tripForm").hidden = false;
      $("#tripToggle").hidden = true;
      $("#tripDate").focus();
    });
    $("#tripCancel").addEventListener("click", function () {
      $("#tripForm").hidden = true;
      $("#tripToggle").hidden = false;
    });
    $("#tripAdd").addEventListener("click", addTrip);
    $("#favToggle").addEventListener("click", toggleFav);
    // 行程列表
    $("#tripList").addEventListener("click", function (e) {
      var btn = e.target.closest(".mini");
      if (!btn) return;
      var i = Number(btn.getAttribute("data-trip"));
      var op = btn.getAttribute("data-op");
      if (op === "del") trips.splice(i, 1);
      if (op === "done") trips[i].done = !trips[i].done;
      save("camp_trips", trips);
      renderTrips();
      renderReminders();
      renderHome();
    });
    // 文章库
    $("#libSearch").addEventListener("input", function () { libShown = 20; renderLibrary(); });
    $("#libRegion").addEventListener("change", function () { libShown = 20; renderLibrary(); });
    $("#libMore").addEventListener("click", function () { libShown += 40; renderLibrary(); });
    // 悬浮按钮
    $("#fabAdd").addEventListener("click", openQuickTrip);
    $("#fabMic").addEventListener("click", voiceSearch);
    // 快速行程
    $("#qtClose").addEventListener("click", function () { $("#quickTrip").close(); });
    $("#qtAdd").addEventListener("click", quickAdd);
  }

  // ---------- 启动 ----------
  (function init() {
    var box = $("#originQuick");
    if (box) {
      box.innerHTML = '<span class="oq-label">快捷：</span>' + Object.keys(PRESET_COORDS).map(function (o) {
        return '<button class="oq-chip" data-origin="' + o + '">' + o + "</button>";
      }).join("");
    }
    var ma = $("#metaAccount");
    if (ma) ma.textContent = meta.account || "";
    renderLoc();
    renderRegionOptions();
    renderHome();
    bindHomeGrids();
    renderChecklist();
    bindChecklist();
    renderFilters();
    renderSpots();
    renderTrips();
    renderReminders();
    renderLibrary();
    weatherBadge();
    bind();
  })();
})();
