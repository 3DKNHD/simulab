(function () {
  var AQ = window.AQ;
  var UI = AQ.UI = {};

  UI.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  UI.num = function (x, max, min) {
    return Number(x).toLocaleString("es", { maximumFractionDigits: max == null ? 2 : max, minimumFractionDigits: min || 0 });
  };

  UI.fixed = function (x, d) {
    return Number(x).toLocaleString("es", { maximumFractionDigits: d, minimumFractionDigits: d });
  };

  var SUPS = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };

  UI.sci = function (x, digits) {
    if (x === 0) return "0";
    var a = Math.abs(x);
    if (a >= 0.01 && a < 10000) return UI.num(x, a < 0.1 ? 4 : a < 10 ? 3 : 1);
    var e = Math.floor(Math.log10(a));
    var m = x / Math.pow(10, e);
    return UI.num(m, digits == null ? 2 : digits) + "·10" + String(e).split("").map(function (c) { return SUPS[c]; }).join("");
  };

  UI.mass = function (g) {
    if (g < 0.001) return UI.sci(g * 1000) + " mg";
    if (g < 1) return UI.num(g * 1000, 1) + " mg";
    return UI.num(g, 3) + " g";
  };

  UI.amount = function (r, a) {
    var unit = r.unit || (r.kind === "solution" || r.kind === "liquid" ? "mL" : r.kind === "action" ? "" : "g");
    if (r.kind === "solution" && a === 0.05) return "1 gota";
    if (unit === "gotas") return a + (a === 1 ? " gota" : " gotas");
    if (unit === "soplidos") return a + (a === 1 ? " soplido" : " soplidos");
    return UI.num(a, 2) + " " + unit;
  };

  UI.conc = function (r, c) {
    if (r.concUnit === "%") return UI.num(c) + " %";
    return UI.num(c, 2) + " mol/L";
  };

  UI.HAZARDS = {
    corrosivo: { label: "Corrosivo", color: "#b23a2f" },
    "tóxico": { label: "Tóxico", color: "#6b2a7a" },
    inflamable: { label: "Inflamable", color: "#d0601c" },
    comburente: { label: "Comburente", color: "#c08a12" },
    nocivo: { label: "Nocivo", color: "#8a6a2a" },
    irritante: { label: "Irritante", color: "#8a6a2a" },
    ambiental: { label: "Peligro ambiental", color: "#2f6b45" }
  };

  UI.hazardBadges = function (list) {
    return (list || []).map(function (h) {
      var hz = UI.HAZARDS[h];
      return '<span class="hz" style="--hz:' + hz.color + '">' + hz.label + "</span>";
    }).join("");
  };

  UI.toast = function (msg, kind) {
    var host = document.getElementById("toasts");
    if (!host) {
      host = document.createElement("div");
      host.id = "toasts";
      document.body.appendChild(host);
    }
    var t = document.createElement("div");
    t.className = "toast" + (kind ? " " + kind : "");
    t.textContent = msg;
    host.appendChild(t);
    setTimeout(function () { t.classList.add("out"); }, 3600);
    setTimeout(function () { t.remove(); }, 4100);
  };

  UI.rng = function (seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  };

  UI.hash = function (str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };

  UI.rgba = function (rgb, a) {
    return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
  };

  UI.hexRgb = function (hex) {
    var v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  };

  UI.textOn = function (hex) {
    var c = UI.hexRgb(hex);
    var l = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
    return l > 0.6 ? "#1c2430" : "#ffffff";
  };
})();
