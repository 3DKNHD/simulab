(function () {
  var AQ = window.AQ;
  var UI = AQ.UI;
  var esc = UI.esc;
  var F = AQ.Formula;

  var TOOLS = [
    { id: "balance", name: "Balancear ecuaciones" },
    { id: "molar", name: "Masa molar y moles" },
    { id: "titration", name: "Curva de valoración" },
    { id: "states", name: "Estados de la materia" },
    { id: "flame", name: "Ensayo a la llama" }
  ];

  var T = AQ.Tools = { tool: "balance", root: null, raf: null };

  T.mount = function (root) {
    T.root = root;
    root.innerHTML = '<div class="page"><div class="page-head"><h2>Herramientas</h2></div>' +
      '<div class="chips tool-tabs" id="tool-tabs"></div><div class="tool panel" id="tool"></div></div>';
    root.querySelector("#tool-tabs").addEventListener("click", function (e) {
      var b = e.target.closest("[data-tool]");
      if (!b) return;
      T.tool = b.dataset.tool;
      render();
    });
    render();
  };

  T.unmount = function () {
    stopAnim();
    T.root = null;
  };

  function stopAnim() {
    if (T.raf) cancelAnimationFrame(T.raf);
    T.raf = null;
  }

  function render() {
    stopAnim();
    T.root.querySelector("#tool-tabs").innerHTML = TOOLS.map(function (t) {
      return '<button class="chip' + (t.id === T.tool ? " on" : "") + '" data-tool="' + t.id + '">' + t.name + "</button>";
    }).join("");
    var host = T.root.querySelector("#tool");
    ({ balance: balanceTool, molar: molarTool, titration: titrationTool, states: statesTool, flame: flameTool })[T.tool](host);
  }

  // --- Balanceador ---

  var EXAMPLES = ["H2 + O2 -> H2O", "Fe + O2 -> Fe2O3", "CH4 + O2 -> CO2 + H2O", "Al + HCl -> AlCl3 + H2", "C3H8 + O2 -> CO2 + H2O", "Cu + AgNO3 -> Cu(NO3)2 + Ag", "KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O", "Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O"];

  function balanceTool(host) {
    host.innerHTML = '<p class="muted small">Escribe los reactivos y productos separados por «+» y una flecha «->» o «=». Respeta mayúsculas: Co es cobalto, CO es monóxido de carbono.</p>' +
      '<div class="row"><input class="search grow" id="bal-in" value="' + esc(EXAMPLES[2]) + '" spellcheck="false"><button class="pour" id="bal-go">Balancear</button></div>' +
      '<div class="chips">' + EXAMPLES.map(function (x) { return '<button class="chip" data-ex="' + esc(x) + '">' + esc(F.pretty(x.replace("->", "→"))) + "</button>"; }).join("") + "</div>" +
      '<div id="bal-out"></div>';
    var input = host.querySelector("#bal-in");
    function go() {
      var out = host.querySelector("#bal-out");
      try {
        var b = F.balance(input.value);
        var mass = function (list) { return list.reduce(function (a, t) { return a + t.coef * F.molarMass(t.formula); }, 0); };
        out.innerHTML = '<div class="big-eq">' + esc(F.format(b)) + "</div>" +
          '<table class="cont"><thead><tr><th>Elemento</th><th>Reactivos</th><th>Productos</th></tr></thead><tbody>' +
          b.atoms.map(function (a) { return "<tr><td>" + a.el + '</td><td class="num">' + a.left + '</td><td class="num">' + a.right + ' ✓</td></tr>'; }).join("") +
          "</tbody></table>" +
          '<p class="small">Masa de reactivos: ' + UI.num(mass(b.left), 2) + " g · Masa de productos: " + UI.num(mass(b.right), 2) + " g. Se conserva, como dice la ley de Lavoisier.</p>";
      } catch (err) {
        out.innerHTML = '<p class="note">' + esc(err.message) + "</p>";
      }
    }
    host.querySelector("#bal-go").addEventListener("click", go);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    host.querySelector(".chips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-ex]");
      if (!b) return;
      input.value = b.dataset.ex;
      go();
    });
    go();
  }

  // --- Masa molar ---

  var NA = 6.02214076e23;

  function molarTool(host) {
    host.innerHTML = '<div class="row"><input class="search grow" id="mm-in" value="CuSO4·5H2O" spellcheck="false"></div>' +
      '<div id="mm-out"></div>' +
      '<h4 class="sub">Convertir</h4><div class="conv">' +
      '<label>Masa (g)<input type="number" step="any" id="cv-g" value="10"></label>' +
      '<label>Moles (mol)<input type="number" step="any" id="cv-n"></label>' +
      '<label>Partículas<input type="text" id="cv-p" readonly></label>' +
      "</div><p class=\"muted tiny\">n = m / M · N = n · Nₐ (Nₐ = 6,022·10²³ partículas por mol)</p>";
    var input = host.querySelector("#mm-in");
    var g = host.querySelector("#cv-g");
    var n = host.querySelector("#cv-n");
    var p = host.querySelector("#cv-p");
    var M = 0;
    function update(from) {
      if (!M) return;
      var mol = from === "n" ? Number(n.value) : Number(g.value) / M;
      if (from !== "n") n.value = +mol.toPrecision(5);
      if (from === "n") g.value = +(mol * M).toPrecision(5);
      p.value = UI.sci(mol * NA, 3);
    }
    function calc() {
      var out = host.querySelector("#mm-out");
      try {
        var atoms = F.parse(input.value);
        M = F.molarMass(input.value);
        var rows = Object.keys(atoms).map(function (el) {
          var m = atoms[el] * AQ.MASS[el];
          return "<tr><td>" + el + '</td><td class="num">' + atoms[el] + '</td><td class="num">' + UI.num(AQ.MASS[el], 3) + '</td><td class="num">' + UI.num(m, 3) + '</td><td><span class="bar"><i style="width:' + (100 * m / M).toFixed(1) + '%"></i></span> ' + UI.num(100 * m / M, 1) + " %</td></tr>";
        }).join("");
        out.innerHTML = '<div class="big-eq">M(' + esc(F.pretty(input.value)) + ") = " + UI.num(M, 3) + " g/mol</div>" +
          '<table class="cont"><thead><tr><th>Elemento</th><th>Átomos</th><th>Masa atómica</th><th>Aporta (g/mol)</th><th>Composición</th></tr></thead><tbody>' + rows + "</tbody></table>";
        update("g");
      } catch (err) {
        M = 0;
        out.innerHTML = '<p class="note">' + esc(err.message) + "</p>";
      }
    }
    input.addEventListener("input", calc);
    g.addEventListener("input", function () { update("g"); });
    n.addEventListener("input", function () { update("n"); });
    calc();
  }

  // --- Valoración ---

  var PAIRS = [
    { id: "hcl-naoh", name: "HCl con NaOH", analyte: "HCl", titrant: "NaOH", conc: function (na, nt, V) { return { "Cl-": na / V, "Na+": nt / V }; } },
    { id: "ac-naoh", name: "CH₃COOH con NaOH", analyte: "CH₃COOH", titrant: "NaOH", conc: function (na, nt, V) { return { CH3COOH: na / V, "Na+": nt / V }; } },
    { id: "nh3-hcl", name: "NH₃ con HCl", analyte: "NH₃", titrant: "HCl", conc: function (na, nt, V) { return { NH3: na / V, "Cl-": nt / V }; } },
    { id: "naoh-hcl", name: "NaOH con HCl", analyte: "NaOH", titrant: "HCl", conc: function (na, nt, V) { return { "Na+": na / V, "Cl-": nt / V }; } }
  ];
  var BANDS = [
    { id: "metilo", lo: 3.1, hi: 4.4 },
    { id: "bromotimol", lo: 6.0, hi: 7.6 },
    { id: "feno", lo: 8.2, hi: 10 }
  ];
  var tit = { pair: "hcl-naoh", Va: 25, Ca: 0.1, Ct: 0.1, V: 12.5, ind: "feno" };

  function titPH(pair, Vt) {
    var V = (tit.Va + Vt) / 1000;
    return AQ.solvePH(pair.conc(tit.Va * tit.Ca / 1000, Vt * tit.Ct / 1000, V), 25);
  }

  function titrationTool(host) {
    host.innerHTML = '<div class="row wrap">' +
      '<label>Valoración <select id="ti-pair">' + PAIRS.map(function (p) { return '<option value="' + p.id + '"' + (p.id === tit.pair ? " selected" : "") + ">" + p.name + "</option>"; }).join("") + "</select></label>" +
      '<label>Concentración del analito <select id="ti-ca">' + [0.05, 0.1, 0.5, 1].map(function (c) { return '<option' + (c === tit.Ca ? " selected" : "") + ">" + c + "</option>"; }).join("") + "</select> mol/L</label>" +
      '<label>Indicador <select id="ti-ind">' + BANDS.map(function (b) { return '<option value="' + b.id + '"' + (b.id === tit.ind ? " selected" : "") + ">" + AQ.INDICATORS[b.id].name + "</option>"; }).join("") + "</select></label>" +
      "</div>" +
      '<div class="titr"><div id="ti-plot"></div><div class="ti-side"><div class="mini-beaker" id="ti-beaker"><i></i></div><div id="ti-read"></div></div></div>' +
      '<label class="slider">Volumen añadido de valorante (0,1 mol/L): <input type="range" id="ti-v" min="0" max="50" step="0.05" value="' + tit.V + '"><b id="ti-vv"></b></label>' +
      '<p class="muted small" id="ti-note"></p>';
    host.querySelector("#ti-pair").addEventListener("change", function (e) { tit.pair = e.target.value; draw(); });
    host.querySelector("#ti-ca").addEventListener("change", function (e) { tit.Ca = Number(e.target.value); draw(); });
    host.querySelector("#ti-ind").addEventListener("change", function (e) { tit.ind = e.target.value; draw(); });
    host.querySelector("#ti-v").addEventListener("input", function (e) { tit.V = Number(e.target.value); draw(); });
    function draw() {
      var pair = PAIRS.filter(function (p) { return p.id === tit.pair; })[0];
      var Veq = tit.Va * tit.Ca / tit.Ct;
      var maxV = Math.max(50, Math.ceil(Veq * 2 / 10) * 10);
      var slider = host.querySelector("#ti-v");
      slider.max = maxV;
      if (tit.V > maxV) tit.V = maxV;
      var W = 560, H = 320, L = 40, B = 30;
      var x = function (v) { return L + v / maxV * (W - L - 10); };
      var y = function (p) { return H - B - p / 14 * (H - B - 10); };
      var pts = [];
      for (var v = 0; v <= maxV; v += maxV / 400) pts.push(x(v).toFixed(1) + "," + y(titPH(pair, v)).toFixed(1));
      var svg = '<svg viewBox="0 0 ' + W + " " + H + '" class="plot">';
      BANDS.forEach(function (b) {
        var on = b.id === tit.ind;
        svg += '<rect x="' + L + '" y="' + y(b.hi) + '" width="' + (W - L - 10) + '" height="' + (y(b.lo) - y(b.hi)) + '" fill="' + (on ? "rgba(196,98,45,0.18)" : "rgba(0,0,0,0.04)") + '"/>';
        if (on) svg += '<text x="' + (W - 14) + '" y="' + (y(b.hi) + 12) + '" text-anchor="end" class="ax">viraje ' + esc(AQ.INDICATORS[b.id].name.toLowerCase()) + "</text>";
      });
      for (var p = 0; p <= 14; p += 2) svg += '<line x1="' + L + '" x2="' + (W - 10) + '" y1="' + y(p) + '" y2="' + y(p) + '" class="grid"/><text x="' + (L - 6) + '" y="' + (y(p) + 4) + '" text-anchor="end" class="ax">' + p + "</text>";
      for (var vv = 0; vv <= maxV; vv += 10) svg += '<text x="' + x(vv) + '" y="' + (H - 10) + '" text-anchor="middle" class="ax">' + vv + "</text>";
      svg += '<text x="' + (W - 10) + '" y="' + (H - 10) + '" text-anchor="end" class="ax">mL</text><text x="8" y="16" class="ax">pH</text>';
      svg += '<line x1="' + x(Veq) + '" x2="' + x(Veq) + '" y1="10" y2="' + (H - B) + '" class="eqline"/>';
      svg += '<text x="' + (x(Veq) + 4) + '" y="22" class="ax">equivalencia ' + UI.num(Veq, 1) + " mL</text>";
      svg += '<polyline points="' + pts.join(" ") + '" class="curve"/>';
      var cur = titPH(pair, tit.V);
      svg += '<circle cx="' + x(tit.V) + '" cy="' + y(cur) + '" r="6" class="dot"/>';
      svg += "</svg>";
      host.querySelector("#ti-plot").innerHTML = svg;
      host.querySelector("#ti-vv").textContent = UI.num(tit.V, 2) + " mL";
      var c = AQ.indicatorAt(tit.ind, cur);
      var rgb = c.k ? c.rgb.map(function (v) { return Math.round(255 - (255 - v) * Math.min(1, c.k * 0.8)); }) : [226, 238, 244];
      host.querySelector("#ti-beaker i").style.background = "rgb(" + rgb.join(",") + ")";
      host.querySelector("#ti-read").innerHTML = '<div class="ival">pH ' + UI.fixed(cur, 2) + '</div><div class="muted small">' + esc(AQ.INDICATORS[tit.ind].name) + ": " + esc(AQ.indicatorColorName(tit.ind, cur)) + "</div>";
      var eqPH = titPH(pair, Veq);
      var weak = pair.id === "ac-naoh" || pair.id === "nh3-hcl";
      var note = "En el punto de equivalencia (" + UI.num(Veq, 1) + " mL) el pH es " + UI.fixed(eqPH, 2) + ". ";
      if (weak) note += "Como el analito es débil, el pH de equivalencia no es 7: la sal que se forma " + (pair.id === "ac-naoh" ? "(acetato) es básica" : "(cloruro de amonio) es ácida") + ". A mitad de camino (" + UI.num(Veq / 2, 1) + " mL) el pH es " + UI.fixed(titPH(pair, Veq / 2), 2) + ", que coincide con el pKa: es una disolución reguladora.";
      else note += "Ácido y base fuertes: el salto de pH es muy grande y casi cualquier indicador sirve.";
      var band = BANDS.filter(function (b) { return b.id === tit.ind; })[0];
      var good = eqPH > band.lo - 1.2 && eqPH < band.hi + 1.2;
      note += " " + (good ? "El indicador elegido vira cerca de la equivalencia: buena elección." : "Este indicador vira lejos de la equivalencia: darías un resultado erróneo.");
      host.querySelector("#ti-note").textContent = note;
    }
    draw();
  }

  // --- Estados de la materia ---

  var SUBST = [
    { id: "agua", name: "Agua", mp: 0, bp: 100, color: "#4b8fd0" },
    { id: "etanol", name: "Etanol", mp: -114, bp: 78, color: "#7aa86a" },
    { id: "o2", name: "Oxígeno", mp: -218.8, bp: -183, color: "#d06a4b" },
    { id: "hg", name: "Mercurio", mp: -38.8, bp: 356.7, color: "#8b96a3" },
    { id: "fe", name: "Hierro", mp: 1538, bp: 2861, color: "#9a7a62" },
    { id: "nacl", name: "Sal (NaCl)", mp: 801, bp: 1465, color: "#b28ad0" }
  ];
  var st = { s: "agua", T: 25 };

  function statesTool(host) {
    host.innerHTML = '<div class="row wrap"><div class="chips" id="st-s">' + SUBST.map(function (s) { return '<button class="chip' + (s.id === st.s ? " on" : "") + '" data-s="' + s.id + '">' + s.name + "</button>"; }).join("") + "</div></div>" +
      '<div class="states"><canvas id="st-c" width="380" height="260"></canvas><div id="st-curve"></div></div>' +
      '<label class="slider">Temperatura: <input type="range" id="st-T"><b id="st-Tv"></b></label><p class="small" id="st-txt"></p>';
    var parts = [];
    var canvas = host.querySelector("#st-c");
    var ctx = canvas.getContext("2d");
    var slider = host.querySelector("#st-T");
    function subst() { return SUBST.filter(function (s) { return s.id === st.s; })[0]; }
    function setup() {
      var s = subst();
      var lo = Math.max(-273, s.mp - 150), hi = s.bp + 150;
      slider.min = Math.round(lo);
      slider.max = Math.round(hi);
      slider.step = 1;
      if (st.T < lo || st.T > hi) st.T = Math.round((s.mp + s.bp) / 2);
      slider.value = st.T;
      parts = [];
      for (var i = 0; i < 48; i++) {
        var gx = i % 8, gy = Math.floor(i / 8);
        parts.push({ hx: 120 + gx * 18, hy: 140 + gy * 18, x: 120 + gx * 18, y: 140 + gy * 18, vx: Math.random() - 0.5, vy: Math.random() - 0.5 });
      }
      Array.prototype.forEach.call(host.querySelectorAll("#st-s .chip"), function (b) { b.classList.toggle("on", b.dataset.s === st.s); });
      info();
    }
    function phase(s) { return st.T < s.mp ? "sólido" : st.T < s.bp ? "líquido" : "gas"; }
    function info() {
      var s = subst();
      var ph = phase(s);
      host.querySelector("#st-Tv").textContent = st.T + " °C";
      var txt = { "sólido": "Sólido: las partículas están ordenadas y unidas; solo vibran en su sitio. Tiene forma y volumen propios.", "líquido": "Líquido: las partículas siguen juntas pero se deslizan unas sobre otras. Tiene volumen propio pero toma la forma del recipiente.", "gas": "Gas: las partículas están muy separadas y se mueven rápido en todas direcciones. Ocupa todo el recipiente." }[ph];
      host.querySelector("#st-txt").innerHTML = "<strong>" + esc(s.name) + " a " + st.T + " °C: " + ph + ".</strong> " + txt + " Funde a " + UI.num(s.mp, 1) + " °C y hierve a " + UI.num(s.bp, 1) + " °C. Durante un cambio de estado la temperatura no sube: la energía se usa en separar las partículas.";
      var lo = Number(slider.min), hi = Number(slider.max);
      var W = 300, H = 220;
      var tx = function (T) { return 30 + (T - lo) / (hi - lo) * (H - 50); };
      var px = [10, 60, 110, 170, 240, 290];
      var py = [lo, s.mp, s.mp, s.bp, s.bp, hi].map(function (T) { return H - 20 - (tx(T) - 30); });
      var path = px.map(function (x, i) { return x + "," + py[i]; }).join(" ");
      var curT = H - 20 - (tx(st.T) - 30);
      var mx = st.T <= s.mp ? 10 + (st.T - lo) / (s.mp - lo) * 50 : st.T <= s.bp ? 110 + (st.T - s.mp) / (s.bp - s.mp) * 60 : 240 + (st.T - s.bp) / (hi - s.bp) * 50;
      host.querySelector("#st-curve").innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" class="plot"><text x="4" y="14" class="ax">T (°C)</text><text x="' + (W - 4) + '" y="' + (H - 4) + '" text-anchor="end" class="ax">calor →</text>' +
        '<polyline points="' + path + '" class="curve"/>' +
        '<text x="85" y="' + (py[1] - 6) + '" text-anchor="middle" class="ax">fusión ' + UI.num(s.mp, 0) + "°</text>" +
        '<text x="205" y="' + (py[3] - 6) + '" text-anchor="middle" class="ax">ebullición ' + UI.num(s.bp, 0) + "°</text>" +
        '<circle cx="' + mx.toFixed(1) + '" cy="' + curT.toFixed(1) + '" r="6" class="dot"/></svg>';
    }
    function frame() {
      var s = subst();
      var ph = phase(s);
      var speed = Math.sqrt(Math.max(1, st.T + 273.15) / 300);
      ctx.clearRect(0, 0, 380, 260);
      ctx.strokeStyle = "#9aa7ad";
      ctx.strokeRect(20, 10, 340, 240);
      if (ph === "líquido") {
        ctx.fillStyle = "rgba(120,170,210,0.12)";
        ctx.fillRect(21, 120, 338, 129);
      }
      parts.forEach(function (p) {
        if (ph === "sólido") {
          p.x += ((p.hx + (Math.random() - 0.5) * 3 * speed) - p.x) * 0.5;
          p.y += ((p.hy + (Math.random() - 0.5) * 3 * speed) - p.y) * 0.5;
        } else {
          var v = ph === "gas" ? 4 * speed : 1.2 * speed;
          p.vx += (Math.random() - 0.5) * 0.4;
          p.vy += (Math.random() - 0.5) * 0.4 + (ph === "líquido" ? 0.08 : 0);
          var m = Math.hypot(p.vx, p.vy) || 1;
          p.vx = p.vx / m * v;
          p.vy = p.vy / m * v;
          p.x += p.vx;
          p.y += p.vy;
          var top = ph === "líquido" ? 128 : 18;
          if (p.x < 28 || p.x > 352) { p.vx *= -1; p.x = Math.max(28, Math.min(352, p.x)); }
          if (p.y < top || p.y > 242) { p.vy *= -1; p.y = Math.max(top, Math.min(242, p.y)); }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.beginPath();
        ctx.arc(p.x - 2, p.y - 2, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
      T.raf = requestAnimationFrame(frame);
    }
    host.querySelector("#st-s").addEventListener("click", function (e) {
      var b = e.target.closest("[data-s]");
      if (!b) return;
      st.s = b.dataset.s;
      st.T = 25;
      setup();
    });
    slider.addEventListener("input", function () { st.T = Number(slider.value); info(); });
    setup();
    frame();
  }

  // --- Ensayo a la llama ---

  var FLAMES = [
    { sym: "Li", salt: "LiCl", color: "#e8283c", name: "rojo carmín", lines: [670.8, 610.4, 460.3] },
    { sym: "Na", salt: "NaCl", color: "#ffb21a", name: "amarillo anaranjado intenso", lines: [589.0, 589.6] },
    { sym: "K", salt: "KCl", color: "#b58ad8", name: "lila (violeta pálido)", lines: [766.5, 769.9, 404.4] },
    { sym: "Ca", salt: "CaCl₂", color: "#ff6a2a", name: "rojo anaranjado (ladrillo)", lines: [422.7, 554, 606, 618, 622] },
    { sym: "Sr", salt: "SrCl₂", color: "#ff1f3a", name: "rojo intenso", lines: [460.7, 606, 646, 662, 682] },
    { sym: "Ba", salt: "BaCl₂", color: "#b8e05a", name: "verde manzana", lines: [455.4, 493.4, 513.7, 524, 553.5] },
    { sym: "Cu", salt: "CuCl₂", color: "#2fd6a8", name: "verde azulado", lines: [427.5, 465, 510.5, 515.3, 521.8, 578.2] }
  ];

  function nmToRgb(nm) {
    var r = 0, g = 0, b = 0;
    if (nm < 440) { r = -(nm - 440) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
    else r = 1;
    var f = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (780 - nm) / 80 : 1;
    return "rgb(" + [r, g, b].map(function (c) { return Math.round(255 * Math.pow(c * f, 0.8)); }).join(",") + ")";
  }

  var fl = { sym: "Na" };

  function flameTool(host) {
    host.innerHTML = '<p class="muted small">Se moja un hilo de nicromo limpio en la sal y se acerca a la llama azul de un mechero. Los electrones del metal absorben energía, suben de nivel y, al volver, emiten luz de longitudes de onda concretas: cada elemento tiene su «huella».</p>' +
      '<div class="chips" id="fl-s">' + FLAMES.map(function (f) { return '<button class="chip" data-s="' + f.sym + '">' + f.salt + "</button>"; }).join("") + "</div>" +
      '<div class="flame-wrap"><div class="burner"><div class="flame" id="fl-f"><i></i></div><div class="tube"></div></div><div class="grow"><div id="fl-txt"></div><div class="spectrum" id="fl-spec"></div><div class="spec-ax"><span>400 nm</span><span>500</span><span>600</span><span>700 nm</span></div></div></div>';
    function draw() {
      var f = FLAMES.filter(function (x) { return x.sym === fl.sym; })[0];
      Array.prototype.forEach.call(host.querySelectorAll("#fl-s .chip"), function (b) { b.classList.toggle("on", b.dataset.s === fl.sym); });
      host.querySelector("#fl-f").style.setProperty("--fc", f.color);
      var el = AQ.elementBySymbol(f.sym);
      host.querySelector("#fl-txt").innerHTML = "<h3>" + esc(el.name) + " (" + f.salt + ")</h3><p>Llama de color <strong>" + f.name + "</strong>.</p>";
      host.querySelector("#fl-spec").innerHTML = f.lines.map(function (nm) {
        var pct = (nm - 380) / 400 * 100;
        var c = nmToRgb(nm);
        return '<i style="left:' + pct.toFixed(2) + "%;background:" + c + ";color:" + c + '" title="' + nm + ' nm"></i>';
      }).join("");
    }
    host.querySelector("#fl-s").addEventListener("click", function (e) {
      var b = e.target.closest("[data-s]");
      if (!b) return;
      fl.sym = b.dataset.s;
      draw();
    });
    draw();
  }
})();
