(function () {
  var AQ = window.AQ;
  var state = {
    view: "inicio",
    symbol: "Na",
    query: "",
    family: "todos",
    phase: "todos",
    beaker: [],
    pourNote: "",
    exp: null,
    step: 0,
    quiz: null,
    acid: 25,
    base: 10,
    matter: "agua",
    temp: 25,
    salt: "na"
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function mass(n) {
    return Number(n).toLocaleString("es", { maximumFractionDigits: 3 });
  }

  function bubbles(n) {
    var html = "";
    var total = (n || 0) * 4;
    for (var i = 0; i < total; i++) {
      html += '<i class="bubble" style="left:' + (12 + (i * 17) % 70) + "%;animation-delay:" + (i * 0.18) + 's"></i>';
    }
    return html;
  }

  function stageHTML(v) {
    if (!v) return '<div class="stage stage-empty">El vaso está vacío.</div>';
    if (v.vessel === "burner") {
      return '<div class="stage"><div><div class="flame" style="background:' + esc(v.flame || "#ffb15a") + '"></div><div class="burner-base"></div></div><span class="caption">' + esc(v.caption || "Mechero") + "</span></div>";
    }
    if (v.vessel === "chunk") {
      return '<div class="stage"><div class="chunk' + (v.glow ? " glow" : "") + '" style="background:' + esc(v.color || "#c5ccd1") + '">' + (v.rust ? '<i class="rust" style="left:12px;top:20px;background:' + esc(v.rustColor || "#c4622d") + '"></i><i class="rust" style="left:48px;top:28px"></i>' : "") + '</div><span class="caption">' + esc(v.label || "") + "</span></div>";
    }
    if (v.vessel === "gasjar") {
      return '<div class="stage"><div class="gasjar" style="background:' + esc(v.tint || "#eef6ff") + '">' + esc(v.label || "") + "</div></div>";
    }
    if (v.vessel === "tubes") {
      return '<div class="stage"><div class="rack">' + v.tubes.map(function (t) {
        return '<div class="tube"><div class="tube-glass"><div class="tube-liq" style="height:62%;background:' + esc(t.color) + '">' + bubbles(t.bubbles) + "</div></div>" + esc(t.name) + "</div>";
      }).join("") + "</div></div>";
    }
    if (v.vessel === "cell") {
      return '<div class="stage"><div class="cell"><div class="electrode"><span>H₂ · cátodo</span>' + (v.on ? bubbles(2) : "") + '</div><div class="electrode"><span>O₂ · ánodo</span>' + (v.on ? bubbles(1) : "") + "</div></div>" + (v.tested ? '<span class="caption">2 volúmenes de H₂ por 1 de O₂</span>' : "") + "</div>";
    }
    if (v.vessel === "balance") {
      return '<div class="stage"><div class="balance"><div class="pan"><b>' + esc(v.before) + '</b><div>antes</div></div><div class="beam"></div><div class="pan"><b>' + esc(v.after) + '</b><div>después</div></div></div><span class="caption">' + esc(v.note || "") + "</span></div>";
    }
    if (v.vessel === "particles") {
      var cls = v.mode === "gas" ? "fast" : v.mode === "liquid" || v.mode === "melt" ? "mid" : "";
      var dots = "";
      for (var i = 0; i < 16; i++) dots += '<i class="dot ' + cls + '" style="background:' + esc(v.color) + ";animation-delay:" + (i * 0.05) + 's"></i>';
      return '<div class="stage"><div class="particles">' + dots + '</div><span class="caption">' + esc(v.label || "") + "</span></div>";
    }
    var liquid = v.liquid === "transparent" ? "transparent" : (v.liquid || "#d5e6ef");
    return '<div class="stage"><div class="beaker"><div class="lip"></div><div class="beaker-glass"><div class="fill" style="height:' + Math.round((v.level || 0.6) * 100) + "%;background:" + esc(liquid) + '">' + (v.top ? '<div class="top-layer" style="height:' + Math.round((v.topSize || 0.3) * 100) + "%;background:" + esc(v.top) + '"></div>' : "") + (v.precipitate ? '<div class="ppt" style="background:' + esc(v.precipitate) + '"></div>' : "") + bubbles(v.bubbles) + "</div>" + (v.solid ? '<div class="deposit" style="background:' + esc(v.solid) + ";height:14px\"></div>" : "") + (v.deposit ? '<div class="deposit" style="background:' + esc(v.deposit) + '"></div>' : "") + '</div></div>' + (v.gas ? '<span class="gas-tag">' + esc(v.gas) + "</span>" : "") + (v.flame ? '<div class="flame" style="position:absolute;width:36px;height:54px;right:28px;bottom:40px;background:' + esc(v.flame) + '"></div>' : "") + "</div>";
  }

  function shellSVG(el) {
    if (el.z > 20) return "<p class=\"muted\">La configuración de los metales de transición se escribe con subniveles. En secundaria se dibujan las capas sobre todo hasta el calcio.</p>";
    var cx = 90;
    var cy = 90;
    var radii = [22, 40, 58, 74];
    var svg = '<svg class="shells" viewBox="0 0 180 180" role="img" aria-label="Capas de ' + esc(el.name) + '">';
    svg += '<circle cx="90" cy="90" r="12" fill="#1f6f78"></circle>';
    svg += '<text x="90" y="94" text-anchor="middle" fill="#fff" font-size="10" font-family="Outfit,sans-serif">' + esc(el.symbol) + "</text>";
    el.shells.forEach(function (count, idx) {
      var r = radii[idx];
      svg += '<circle cx="90" cy="90" r="' + r + '" fill="none" stroke="#d9cbb3"></circle>';
      var shown = Math.min(count, 8);
      for (var i = 0; i < shown; i++) {
        var ang = (-Math.PI / 2) + (i * 2 * Math.PI / shown);
        var x = cx + r * Math.cos(ang);
        var y = cy + r * Math.sin(ang);
        svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.3" fill="#c4622d"></circle>';
      }
      if (count > 8) {
        svg += '<text x="' + (cx + r + 2) + '" y="' + cy + '" font-size="9" fill="#5c6b7c">' + count + "</text>";
      }
    });
    svg += "</svg>";
    return svg;
  }

  function filtered() {
    var q = state.query.trim().toLowerCase();
    return AQ.ELEMENTS.filter(function (el) {
      if (state.family !== "todos" && el.family !== state.family) return false;
      if (state.phase !== "todos" && el.state !== state.phase) return false;
      if (!q) return true;
      return el.name.toLowerCase().indexOf(q) >= 0 || el.symbol.toLowerCase().indexOf(q) >= 0 || String(el.z) === q;
    });
  }

  function tableHTML() {
    var list = filtered();
    var html = '<div class="scroll"><div class="ptable">';
    for (var g = 1; g <= 18; g++) html += '<div class="gh" style="grid-column:' + (g + 1) + ';grid-row:1">' + g + "</div>";
    for (var p = 1; p <= 4; p++) html += '<div class="pl" style="grid-column:1;grid-row:' + (p + 1) + '">' + p + "</div>";
    list.forEach(function (el) {
      var bg = AQ.CATEGORIES[el.category];
      var fg = el.category === "metal alcalinotérreo" || el.category === "metal de transición" || el.category === "metal del bloque p" ? "#1c2430" : "#fff";
      html += '<button type="button" class="el' + (el.symbol === state.symbol ? " is-on" : "") + '" style="grid-column:' + (el.group + 1) + ";grid-row:" + (el.period + 1) + ";background:" + bg + ";color:" + fg + '" data-act="element" data-symbol="' + el.symbol + '"><small>' + el.z + "</small><b>" + el.symbol + "</b></button>";
    });
    html += "</div></div>";
    html += '<div class="legend">';
    Object.keys(AQ.CATEGORIES).forEach(function (name) {
      html += '<span class="swatch"><i style="background:' + AQ.CATEGORIES[name] + '"></i>' + esc(name) + "</span>";
    });
    html += "</div>";
    if (!list.length) html += '<p class="muted">Ningún elemento coincide con la búsqueda.</p>';
    return html;
  }

  function detailHTML() {
    var el = AQ.elementBySymbol(state.symbol) || AQ.ELEMENTS[10];
    var valence = el.shells[el.shells.length - 1];
    return '<div class="panel"><div class="symbol-row"><div><p class="kicker">' + esc(el.category) + "</p><h2>" + esc(el.name) + '</h2></div><div class="formula">' + esc(el.symbol) + "</div></div>" +
      '<div class="facts"><div class="fact"><span>Número atómico</span><b>' + el.z + '</b></div><div class="fact"><span>Masa atómica</span><b>' + mass(el.mass) + '</b></div><div class="fact"><span>Grupo / periodo</span><b>' + el.group + " · " + el.period + '</b></div><div class="fact"><span>Estado a 25 °C</span><b>' + esc(el.state) + "</b></div></div>" +
      shellSVG(el) +
      "<p class=\"muted\">Configuración: " + esc(el.config) + ". Electrones en la última capa: " + valence + ".</p>" +
      "<p style=\"margin-top:8px\">" + esc(el.about) + "</p><p class=\"muted\" style=\"margin-top:6px\">" + esc(el.uses) + "</p></div>";
  }

  function beakerHTML() {
    var res = AQ.observeBeaker(state.beaker);
    var chips = state.beaker.length
      ? '<div class="poured">' + state.beaker.map(function (token, index) {
        return '<button type="button" data-act="unpour" data-i="' + index + '">' + esc(AQ.pieceName(token)) + " · quitar</button>";
      }).join("") + "</div>"
      : '<p class="muted">Todavía no has echado nada.</p>';
    var tray = AQ.TRAY.map(function (group) {
      return "<h3 style=\"margin:12px 0 6px\">" + group.title + "</h3><div class=\"shelf\">" + group.ids.map(function (id) {
        var reagent = AQ.REAGENTS[id];
        var on = state.beaker.indexOf(id) >= 0;
        return '<button type="button" class="bottle' + (on ? " is-on" : "") + '" data-act="pour" data-id="' + id + '"><i class="bottle-liquid" style="background:' + reagent.color + '"></i><span><b>' + esc(reagent.name) + "</b><small>" + esc(reagent.formula) + "</small></span></button>";
      }).join("") + "</div>";
    }).join("");
    var dropOn = state.beaker.indexOf("feno") >= 0;
    var selected = AQ.elementBySymbol(state.symbol);
    var alreadyIn = selected && state.beaker.indexOf(selected.symbol) >= 0;
    return '<div class="panel"><div class="row"><button type="button" class="btn" data-act="pour-selected"' + (alreadyIn ? " disabled" : "") + ">" + (alreadyIn ? "Ya está en el vaso" : "Echar " + esc(selected.name.toLowerCase()) + " al vaso") + "</button></div><h2>Vaso</h2><p class=\"muted\">Primero el elemento. Después echa otro, o algo de la bandeja.</p>" +
      chips +
      (state.pourNote ? '<p class="muted">' + esc(state.pourNote) + "</p>" : "") +
      stageHTML(res.visual) +
      '<div class="result"><p class="kicker">' + esc(res.type) + "</p><h3>" + esc(res.title) + "</h3><p>" + esc(res.observation) + "</p><p>" + esc(res.explanation) + "</p>" +
      (res.equation ? '<p class="eq">' + esc(res.equation) + "</p>" : "") +
      (res.conserve ? "<p class=\"muted\">" + esc(res.conserve) + "</p>" : "") +
      (res.safety ? '<p class="banner danger">' + esc(res.safety) + "</p>" : "") +
      (res.ph != null ? "<p>pH aproximado: <b>" + Number(res.ph).toLocaleString("es", { maximumFractionDigits: 1 }) + "</b></p>" : "") +
      "</div>" +
      '<details style="margin-top:8px"><summary>Serie de actividad simplificada</summary><p class="series">K &gt; Na &gt; Ca &gt; Mg &gt; Al &gt; Zn &gt; Fe &gt; H &gt; Cu &gt; Ag. Un metal desplaza a los que están debajo. Los que están encima del hidrógeno sueltan H₂ si echas ácido diluido.</p></details>' +
      '<div class="row"><button type="button" class="btn secondary" data-act="empty-beaker"' + (state.beaker.length ? "" : " disabled") + ">Vaciar vaso</button></div>" +
      "<h3 style=\"margin-top:16px\">Echar otra cosa</h3><p class=\"muted\">También puedes volver a la tabla y echar otro elemento.</p>" +
      tray +
      '<div class="shelf" style="margin-top:8px"><button type="button" class="bottle' + (dropOn ? " is-on" : "") + '" data-act="pour" data-id="feno"><i class="bottle-liquid" style="background:' + AQ.DROPS.color + '"></i><span><b>' + AQ.DROPS.name + "</b><small>" + AQ.DROPS.formula + "</small></span></button></div></div>";
  }

  function inicioHTML() {
    return '<p class="kicker">Secundaria</p><h2 style="font-size:42px;margin:4px 0 8px">Echa un elemento al vaso</h2><p class="lead">Elige un elemento de la tabla, échalo al vaso y después añade otros elementos o lo que hay en la bandeja. El vaso muestra lo que ocurre, sin botones de calentar ni de ensayos fijos.</p>' +
      '<div class="cards">' +
      card("tabla", "01", "Vaso", "Selecciona un elemento, échalo y sigue añadiendo cosas a mano.") +
      card("experimentos", "02", "Experimentos", "Guiones de clase: gases, sales, llama, masa y electrólisis.") +
      card("herramientas", "03", "Herramientas", "pH de una neutralización, estados y colores de la llama.") +
      "</div>" +
      '<p class="banner">Simulación para estudiar. No sustituye a un docente ni a las normas del laboratorio. No indica cómo preparar sustancias peligrosas.</p>';
  }

  function card(view, n, title, text) {
    return '<button type="button" class="card" data-act="view" data-view="' + view + '"><span class="kicker">' + n + "</span><strong>" + title + "</strong><span>" + text + "</span></button>";
  }

  function tablaHTML() {
    return '<div class="work"><div class="panel"><div class="toolbar"><input class="search" id="buscar" placeholder="Busca por nombre, símbolo o número" value="' + esc(state.query) + '">' +
      chip("family", "todos", "Todos") + chip("family", "metal", "Metales") + chip("family", "no-metal", "No metales") + chip("family", "metaloide", "Metaloides") + chip("family", "noble", "Gases nobles") +
      chip("phase", "todos", "Cualquier estado") + chip("phase", "sólido", "Sólidos") + chip("phase", "líquido", "Líquidos") + chip("phase", "gas", "Gases") +
      '</div><div id="tabla">' + tableHTML() + '</div><p class="muted" style="margin-top:8px">Toca un elemento y échalo al vaso. Luego echa otro, o algo de la bandeja.</p></div>' +
      '<div class="work-side">' + beakerHTML() + detailHTML() + "</div></div>";
  }

  function chip(kind, value, label) {
    var on = state[kind] === value;
    return '<button type="button" class="chip' + (on ? " is-on" : "") + '" data-act="chip" data-kind="' + kind + '" data-value="' + value + '">' + label + "</button>";
  }

  function expList() {
    return '<h2 style="font-size:36px">Experimentos de clase</h2><p class="lead">Cada uno se avanza paso a paso y termina con una pregunta.</p><div class="exp-list" style="margin-top:12px">' + AQ.EXPERIMENTS.map(function (exp) {
      return '<button type="button" class="card exp-card" data-act="experiment" data-id="' + exp.id + '"><span class="kicker">' + esc(exp.kicker) + "</span><b>" + esc(exp.title) + "</b><span>" + esc(exp.summary) + "</span></button>";
    }).join("") + "</div>";
  }

  function expPlayer() {
    var exp = AQ.EXPERIMENTS.filter(function (item) { return item.id === state.exp; })[0];
    if (!exp) return expList();
    var done = state.step >= exp.steps.length;
    var step = done ? exp.steps[exp.steps.length - 1] : exp.steps[state.step];
    var dots = exp.steps.map(function (_, i) { return '<i class="' + (i <= state.step ? "on" : "") + '"></i>'; }).join("");
    var quiz = "";
    if (done) {
      quiz = '<div class="quiz"><h3>Comprueba</h3><p>' + esc(exp.quiz.q) + "</p>" + exp.quiz.options.map(function (opt, i) {
        var cls = "";
        if (state.quiz != null) cls = i === exp.quiz.answer ? " good" : (i === state.quiz ? " bad" : "");
        return '<button type="button" data-act="quiz" data-i="' + i + '" class="' + cls + '">' + esc(opt) + "</button>";
      }).join("") + (state.quiz != null ? "<p>" + esc(exp.quiz.why) + "</p>" : "") + "</div>";
    }
    return '<button type="button" class="btn ghost" data-act="exp-back">Todos los experimentos</button><p class="kicker" style="margin-top:8px">' + esc(exp.kicker) + "</p><h2 style=\"font-size:36px\">" + esc(exp.title) + '</h2><div class="steps">' + dots + "</div>" +
      '<div class="layout"><div class="panel">' + stageHTML(step.visual) + '<p class="banner">' + esc(exp.safety) + '</p></div><div class="panel"><h3>' + esc(done ? "Cierre" : step.title) + "</h3><p style=\"margin-top:8px\">" + esc(done ? exp.summary : step.body) + "</p>" + quiz +
      '<div class="row"><button type="button" class="btn secondary" data-act="exp-prev"' + (state.step === 0 ? " disabled" : "") + '>Atrás</button><button type="button" class="btn" data-act="exp-next"' + (done ? " disabled" : "") + ">" + (state.step === exp.steps.length - 1 ? "Comprobar" : "Siguiente") + "</button></div></div></div>";
  }

  function phModel() {
    var c = 0.1;
    var na = c * state.acid / 1000;
    var nb = c * state.base / 1000;
    var v = (state.acid + state.base) / 1000;
    if (v === 0) return { empty: true, na: 0, nb: 0 };
    var out = { na: na * 1000, nb: nb * 1000, empty: false };
    if (Math.abs(na - nb) < 1e-12) {
      out.ph = 7;
      out.excess = "Ninguno: están en proporción justa";
    } else if (na > nb) {
      out.ph = -Math.log10((na - nb) / v);
      out.excess = "Ácido";
    } else {
      out.ph = 14 + Math.log10((nb - na) / v);
      out.excess = "Base";
    }
    return out;
  }

  function phColor(ph) {
    if (ph <= 2) return "#e23b3b";
    if (ph <= 4) return "#f08a2c";
    if (ph <= 6) return "#e6c229";
    if (ph <= 8) return "#3eae5a";
    if (ph <= 10) return "#2a9d8f";
    if (ph <= 12) return "#3a7ca5";
    return "#6c4ab6";
  }

  function matterState(item, temp) {
    if (item.sublime && temp >= 80 && temp < item.mp) return { name: "Sublimando", mode: "gas", text: "Parte del sólido pasa directo a vapor morado, sin quedarse líquido. Eso es sublimación." };
    if (temp < item.mp) return { name: "Sólido", mode: "solid", text: "Las partículas solo vibran. Sigue siendo la misma sustancia." };
    if (temp === item.mp) return { name: "Fusión", mode: "melt", text: "Sólido y líquido a la vez. Mientras tanto, la temperatura no sube: el calor se usa en cambiar de estado." };
    if (temp < item.bp) return { name: "Líquido", mode: "liquid", text: "Las partículas se desplazan, aún cerca unas de otras." };
    if (temp === item.bp) return { name: "Ebullición", mode: "gas", text: "Hierve. La temperatura se mantiene hasta que todo pasa a gas." };
    return { name: "Gas", mode: "gas", text: "Las partículas ocupan todo el recipiente." };
  }

  function toolsHTML() {
    var model = phModel();
    var pct = model.empty ? 0 : Math.max(0, Math.min(100, model.ph / 14 * 100));
    var item = AQ.MATTER.filter(function (m) { return m.id === state.matter; })[0];
    var st = matterState(item, state.temp);
    var salt = AQ.SALTS.filter(function (s) { return s.id === state.salt; })[0];
    return '<h2 style="font-size:36px">Herramientas</h2><div class="split-tools" style="margin-top:12px"><div class="panel"><p class="kicker">Neutralización</p><h3>Ácido y base 0,10 mol/L</h3><p class="muted">HCl y NaOH, los dos a la misma concentración.</p><label>Ácido: <b id="acid-label">' + state.acid + ' mL</b></label><input id="acid" type="range" min="0" max="50" value="' + state.acid + '"><label>Base: <b id="base-label">' + state.base + ' mL</b></label><input id="base" type="range" min="0" max="50" value="' + state.base + '"><div id="ph-box">' + phBox(model, pct) + "</div></div>" +
      '<div class="panel"><p class="kicker">Estados</p><h3>Calentar y enfriar</h3><div class="tests">' + AQ.MATTER.map(function (m) {
        return '<button type="button" class="chip' + (m.id === state.matter ? " is-on" : "") + '" data-act="matter" data-id="' + m.id + '">' + esc(m.name) + "</button>";
      }).join("") + '</div><p>' + esc(item.formula) + " · fusión " + item.mp + " °C · ebullición " + item.bp + ' °C</p><input id="temp" type="range" min="' + item.min + '" max="' + item.max + '" value="' + state.temp + '"><div id="matter-box">' + matterBox(item, st) + "</div></div></div>" +
      '<div class="panel" style="margin-top:12px"><p class="kicker">Ensayo a la llama</p><h3>Elige el ion</h3><div class="tests">' + AQ.SALTS.map(function (s) {
        return '<button type="button" class="chip' + (s.id === state.salt ? " is-on" : "") + '" data-act="salt" data-id="' + s.id + '">' + esc(s.name) + "</button>";
      }).join("") + '</div><div id="salt-box">' + saltBox(salt) + "</div></div>";
  }

  function phBox(model, pct) {
    if (model.empty) return "<p>Sube algún volumen para preparar la mezcla.</p>";
    var feno = model.ph >= 8.2 ? "rosa" : "incolora";
    return stageHTML({ vessel: "beaker", liquid: phColor(model.ph), level: 0.55 }) + '<div class="ph-bar"><em style="left:' + pct + '%"></em></div><p>pH ≈ <b>' + model.ph.toLocaleString("es", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "</b>. Exceso: " + esc(model.excess) + ".</p><p class=\"muted\">Moles de HCl: " + model.na.toLocaleString("es", { maximumFractionDigits: 2 }) + " mmol. Moles de NaOH: " + model.nb.toLocaleString("es", { maximumFractionDigits: 2 }) + " mmol. Fenolftaleína: " + feno + ".</p>";
  }

  function matterBox(item, st) {
    return stageHTML({ vessel: "particles", mode: st.mode, color: item.color, label: st.name + " · " + state.temp + " °C" }) + "<p><b>" + esc(st.name) + "</b> a " + state.temp + " °C. " + esc(st.text) + "</p><p class=\"muted\">" + esc(item.note) + "</p>";
  }

  function saltBox(salt) {
    return stageHTML({ vessel: "burner", flame: salt.color, caption: salt.name }) + "<p>" + esc(salt.formula) + ". " + esc(salt.tip) + "</p>";
  }

  function pourInto(token) {
    if (state.beaker.indexOf(token) >= 0) {
      state.pourNote = "Eso ya está en el vaso.";
      return;
    }
    if (state.beaker.length >= 4) {
      state.pourNote = "El vaso admite cuatro cosas. Quita una para echar otra.";
      return;
    }
    state.beaker.push(token);
    state.pourNote = "";
  }

  function render() {
    var root = document.getElementById("app");
    var html = "";
    if (state.view === "inicio") html = inicioHTML();
    else if (state.view === "tabla") html = tablaHTML();
    else if (state.view === "experimentos") html = state.exp ? expPlayer() : expList();
    else html = toolsHTML();
    root.innerHTML = html;
    document.querySelectorAll("[data-nav]").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.dataset.nav === state.view);
    });
  }

  function patchSearch() {
    var box = document.getElementById("tabla");
    if (box) box.innerHTML = tableHTML();
  }

  document.addEventListener("click", function (event) {
    var nav = event.target.closest("[data-nav]");
    if (nav) {
      state.view = nav.dataset.nav;
      render();
      return;
    }
    var el = event.target.closest("[data-act]");
    if (!el) return;
    var act = el.dataset.act;
    if (act === "view") state.view = el.dataset.view;
    else if (act === "element") state.symbol = el.dataset.symbol;
    else if (act === "chip") state[el.dataset.kind] = el.dataset.value;
    else if (act === "pour-selected") pourInto(state.symbol);
    else if (act === "pour") pourInto(el.dataset.id);
    else if (act === "unpour") state.beaker.splice(Number(el.dataset.i), 1);
    else if (act === "empty-beaker") {
      state.beaker = [];
      state.pourNote = "";
    } else if (act === "experiment") {
      state.exp = el.dataset.id; state.step = 0; state.quiz = null;
    } else if (act === "exp-back") state.exp = null;
    else if (act === "exp-next") state.step += 1;
    else if (act === "exp-prev") state.step = Math.max(0, state.step - 1);
    else if (act === "quiz") state.quiz = Number(el.dataset.i);
    else if (act === "matter") {
      state.matter = el.dataset.id;
      var item = AQ.MATTER.filter(function (m) { return m.id === state.matter; })[0];
      state.temp = Math.min(item.max, Math.max(item.min, 25));
      if (item.id === "oxigeno") state.temp = -160;
      if (item.id === "galio") state.temp = 25;
    } else if (act === "salt") state.salt = el.dataset.id;
    else return;
    render();
  });

  document.addEventListener("input", function (event) {
    if (event.target.id === "buscar") {
      state.query = event.target.value;
      patchSearch();
      return;
    }
    if (event.target.id === "acid" || event.target.id === "base") {
      state.acid = Number(document.getElementById("acid").value);
      state.base = Number(document.getElementById("base").value);
      document.getElementById("acid-label").textContent = state.acid + " mL";
      document.getElementById("base-label").textContent = state.base + " mL";
      var model = phModel();
      var pct = model.empty ? 0 : Math.max(0, Math.min(100, model.ph / 14 * 100));
      document.getElementById("ph-box").innerHTML = phBox(model, pct);
      return;
    }
    if (event.target.id === "temp") {
      state.temp = Number(event.target.value);
      var item = AQ.MATTER.filter(function (m) { return m.id === state.matter; })[0];
      document.getElementById("matter-box").innerHTML = matterBox(item, matterState(item, state.temp));
    }
  });

  render();
})();
