(function () {
  var AQ = window.AQ;
  var UI = AQ.UI;
  var esc = UI.esc;

  var MODES = [
    { id: "cat", name: "Familia" },
    { id: "state", name: "Estado" },
    { id: "en", name: "Electronegatividad" },
    { id: "mass", name: "Masa atómica" },
    { id: "mp", name: "Punto de fusión" }
  ];
  var STATE_COLOR = { "sólido": "#c9b79c", "líquido": "#6fa8dc", "gas": "#f2d27a", "desconocido": "#ddd6ca" };

  var Table = AQ.Table = { mode: "cat", T: 25, query: "", selected: 1, root: null };

  function stateAt(el, T) {
    if (el.mp == null || el.bp == null) return el.mp == null && el.bp == null ? "desconocido" : el.state;
    if (T < el.mp) return "sólido";
    if (T < el.bp) return "líquido";
    return "gas";
  }

  function ramp(t, a, b) {
    t = Math.max(0, Math.min(1, t));
    var ca = UI.hexRgb(a), cb = UI.hexRgb(b);
    return "rgb(" + ca.map(function (v, i) { return Math.round(v + (cb[i] - v) * t); }).join(",") + ")";
  }

  function colorOf(el) {
    var m = Table.mode;
    if (m === "cat") return AQ.CATEGORIES[el.cat].color;
    if (m === "state") return STATE_COLOR[stateAt(el, Table.T)];
    if (m === "en") return el.en == null ? "#e6e0d6" : ramp((el.en - 0.7) / 3.3, "#f6e7c4", "#1f6f78");
    if (m === "mass") return ramp(Math.log(el.mass) / Math.log(300), "#f4efe4", "#c4622d");
    if (m === "mp") return el.mp == null ? "#e6e0d6" : ramp((el.mp + 273) / 3900, "#dceefb", "#b4321f");
    return "#eee";
  }

  function legend() {
    var m = Table.mode;
    if (m === "cat") return Object.keys(AQ.CATEGORIES).map(function (k) {
      return '<span class="lg"><i style="background:' + AQ.CATEGORIES[k].color + '"></i>' + AQ.CATEGORIES[k].name + "</span>";
    }).join("");
    if (m === "state") return ["sólido", "líquido", "gas", "desconocido"].map(function (s) {
      return '<span class="lg"><i style="background:' + STATE_COLOR[s] + '"></i>' + s + "</span>";
    }).join("") + '<label class="tslider">Temperatura: <input type="range" id="tb-T" min="-273" max="4000" step="1" value="' + Table.T + '"><b>' + Table.T + " °C</b></label>";
    var ranges = { en: ["0,7 (Fr)", "4,0 (F)", "#f6e7c4", "#1f6f78"], mass: ["1 u", "≈ 300 u", "#f4efe4", "#c4622d"], mp: ["−273 °C", "3600 °C", "#dceefb", "#b4321f"] };
    var r = ranges[m];
    return '<span class="lg grad">' + r[0] + '<i style="background:linear-gradient(90deg,' + r[2] + "," + r[3] + ')"></i>' + r[1] + "</span>";
  }

  Table.mount = function (root) {
    Table.root = root;
    root.innerHTML =
      '<div class="ptable-wrap">' +
      '<div class="ptable-head">' +
      '<div><h2>Tabla periódica</h2><p class="muted small">118 elementos. Toca uno para ver su estructura y propiedades.</p></div>' +
      '<input type="search" class="search" id="tb-q" placeholder="Buscar por nombre o símbolo" autocomplete="off">' +
      "</div>" +
      '<div class="chips" id="tb-modes"></div>' +
      '<div class="legend" id="tb-legend"></div>' +
      '<div class="ptable-body"><div class="ptable" id="tb-grid"></div><aside class="el-detail panel" id="tb-detail"></aside></div>' +
      "</div>";
    root.querySelector("#tb-modes").addEventListener("click", function (e) {
      var b = e.target.closest("[data-mode]");
      if (!b) return;
      Table.mode = b.dataset.mode;
      render();
    });
    root.querySelector("#tb-legend").addEventListener("input", function (e) {
      if (e.target.id !== "tb-T") return;
      Table.T = Number(e.target.value);
      e.target.nextSibling.textContent = Table.T + " °C";
      paint();
    });
    var q = root.querySelector("#tb-q");
    q.value = Table.query;
    q.addEventListener("input", function () { Table.query = q.value; paint(); });
    root.querySelector("#tb-grid").addEventListener("click", function (e) {
      var c = e.target.closest("[data-z]");
      if (!c) return;
      Table.selected = Number(c.dataset.z);
      paint();
      renderDetail();
    });
    root.querySelector("#tb-detail").addEventListener("click", function (e) {
      var b = e.target.closest("[data-lab]");
      if (!b) return;
      AQ.Lab.selectReagent(b.dataset.lab);
      location.hash = "#laboratorio";
    });
    render();
  };

  Table.unmount = function () { Table.root = null; };

  function render() {
    Table.root.querySelector("#tb-modes").innerHTML = '<span class="muted small">Colorear por:</span>' + MODES.map(function (m) {
      return '<button class="chip' + (m.id === Table.mode ? " on" : "") + '" data-mode="' + m.id + '">' + m.name + "</button>";
    }).join("");
    Table.root.querySelector("#tb-legend").innerHTML = legend();
    buildGrid();
    paint();
    renderDetail();
  }

  function buildGrid() {
    var html = "";
    AQ.ELEMENTS.forEach(function (el) {
      var col, row;
      if (el.fRow) { col = el.fIndex + 3; row = el.fRow + 9; }
      else { col = el.group; row = el.period + 1; }
      html += '<button class="cell" data-z="' + el.z + '" style="grid-column:' + col + ";grid-row:" + row + '">' +
        '<span class="z">' + el.z + '</span><span class="sym">' + el.symbol + '</span><span class="nm">' + esc(el.name) + "</span>" +
        "</button>";
    });
    html += '<div class="fmark" style="grid-column:3;grid-row:7">57–71</div><div class="fmark" style="grid-column:3;grid-row:8">89–103</div>';
    html += '<div class="gap" style="grid-row:9;grid-column:1/-1"></div>';
    for (var g = 1; g <= 18; g++) html += '<div class="gnum" style="grid-column:' + g + ';grid-row:1">' + g + "</div>";
    Table.root.querySelector("#tb-grid").innerHTML = html;
  }

  function paint() {
    var q = Table.query.trim().toLowerCase();
    Array.prototype.forEach.call(Table.root.querySelectorAll(".cell"), function (c) {
      var el = AQ.ELEMENTS[Number(c.dataset.z) - 1];
      var bg = colorOf(el);
      c.style.background = bg;
      c.style.color = textOn(bg);
      var hit = !q || el.name.toLowerCase().indexOf(q) >= 0 || el.symbol.toLowerCase() === q || String(el.z) === q;
      c.classList.toggle("dim", !hit);
      c.classList.toggle("on", el.z === Table.selected);
      c.classList.toggle("lab", !!AQ.ELEMENT_REAGENT[el.symbol]);
    });
  }

  function textOn(color) {
    var rgb = color[0] === "#" ? UI.hexRgb(color) : color.match(/\d+/g).map(Number);
    var l = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return l > 0.55 ? "#1c2430" : "#ffffff";
  }

  function bohr(el) {
    var sh = el.shells;
    var size = 220;
    var c = size / 2;
    var step = Math.min(14, 88 / sh.length);
    var out = '<svg viewBox="0 0 ' + size + " " + size + '" class="bohr" role="img" aria-label="Modelo de capas">';
    out += '<circle cx="' + c + '" cy="' + c + '" r="13" fill="' + AQ.CATEGORIES[el.cat].color + '"/>';
    out += '<text x="' + c + '" y="' + (c + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#1c2430">' + el.symbol + "</text>";
    sh.forEach(function (n, i) {
      var r = 22 + (i + 1) * step;
      out += '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke="#9aa7ad" stroke-width="0.8"/>';
      var show = Math.min(n, 32);
      out += '<g class="orbit" style="animation-duration:' + (8 + i * 5) + 's;transform-origin:' + c + "px " + c + 'px">';
      for (var k = 0; k < show; k++) {
        var a = k / show * Math.PI * 2;
        out += '<circle cx="' + (c + Math.cos(a) * r).toFixed(1) + '" cy="' + (c + Math.sin(a) * r).toFixed(1) + '" r="2.6" fill="#1f6f78"/>';
      }
      out += "</g>";
    });
    return out + "</svg>";
  }

  function prop(label, value) {
    return value == null || value === "" ? "" : "<div><dt>" + label + "</dt><dd>" + value + "</dd></div>";
  }

  function renderDetail() {
    var el = AQ.ELEMENTS[Table.selected - 1];
    var lab = AQ.ELEMENT_REAGENT[el.symbol];
    var note = AQ.elementLabNote(el);
    var valence = el.shells[el.shells.length - 1];
    var place = el.fRow ? (el.fRow === 1 ? "Lantánidos" : "Actínidos") + ", periodo " + el.period : "Grupo " + el.group + ", periodo " + el.period;
    var html =
      '<div class="el-top" style="--c:' + AQ.CATEGORIES[el.cat].color + '">' +
      '<div class="el-card"><span class="z">' + el.z + '</span><span class="sym">' + el.symbol + '</span><span class="m">' + UI.num(el.mass, 3) + "</span></div>" +
      "<div><h3>" + esc(el.name) + '</h3><div class="muted small">' + esc(el.category) + " · " + place + "</div>" +
      (el.radioactive ? '<span class="hz" style="--hz:#6b2a7a">Radiactivo</span>' : "") + "</div></div>" +
      bohr(el) +
      '<div class="config"><span class="muted tiny">Configuración electrónica</span><div>' + esc(el.config) + '</div><div class="muted tiny">Capas: ' + el.shells.join(", ") + " · " + valence + " electrón" + (valence === 1 ? "" : "es") + " en la última capa</div></div>" +
      '<dl class="props">' +
      prop("Masa atómica", UI.num(el.mass, 4) + " u") +
      prop("Estado a 25 °C", el.state) +
      prop("Electronegatividad", el.en == null ? null : UI.num(el.en, 2) + " (Pauling)") +
      prop("Punto de fusión", el.mp == null ? null : UI.num(el.mp, 1) + " °C") +
      prop("Punto de ebullición", el.bp == null ? null : UI.num(el.bp, 1) + " °C") +
      prop("Estados de oxidación", esc(el.ox)) +
      prop("Protones / electrones", el.z + " / " + el.z) +
      prop("Neutrones (isótopo común)", Math.max(0, Math.round(el.mass) - el.z)) +
      "</dl>" +
      "<p>" + esc(el.about) + "</p>" +
      (el.uses ? '<p class="small"><strong>Usos:</strong> ' + esc(el.uses) + "</p>" : "") +
      (lab ? '<button class="pour" data-lab="' + lab + '">Llevar al laboratorio</button>' : '<p class="note small">' + esc(note) + "</p>");
    Table.root.querySelector("#tb-detail").innerHTML = html;
  }
})();
