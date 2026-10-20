(function () {
  var AQ = window.AQ;
  var UI = AQ.UI;
  var esc = UI.esc;

  var CATS = ["Todos", "Básicos", "Ácidos", "Bases", "Sales", "Metales", "Indicadores", "Casa", "Otros", "Acciones"];
  var SPEEDS = [0, 1, 10, 60];
  var PHASE = { aq: "disuelto", s: "sólido", l: "líquido", g: "gas" };
  function typeClass(t) {
    if (/Precipit/.test(t)) return "ppt";
    if (/redox|Redox|Oxidación/.test(t)) return "redox";
    if (/gas/.test(t)) return "gas";
    if (/Ácido/.test(t)) return "acid";
    if (/Complejo/.test(t)) return "cplx";
    if (/Descomposición/.test(t)) return "gas";
    return "diss";
  }

  var Lab = AQ.Lab = {
    sim: new AQ.Sim(),
    speed: 1,
    selected: "agua",
    choice: {},
    cat: "Todos",
    query: "",
    tab: "ves",
    root: null
  };

  function choiceOf(r) {
    var c = Lab.choice[r.id];
    if (!c) c = Lab.choice[r.id] = { amount: r.def, conc: r.defConc };
    return c;
  }

  Lab.selectReagent = function (id) {
    if (!AQ.REAGENT_BY_ID[id]) return;
    Lab.selected = id;
    Lab.cat = "Todos";
    Lab.query = "";
    if (Lab.root) { renderShelf(); renderDose(); scrollToSelected(); }
  };

  Lab.mount = function (root) {
    Lab.root = root;
    root.innerHTML =
      '<div class="lab">' +
      '<aside class="shelf panel">' +
      '<div class="panel-head"><h2>Estantería</h2><span class="muted small">Elige y dosifica</span></div>' +
      '<input class="search" id="shelf-q" type="search" placeholder="Buscar: ácido, cobre, NaOH…" autocomplete="off">' +
      '<div class="chips" id="shelf-cats"></div>' +
      '<div class="bottles" id="shelf-list"></div>' +
      '<div class="dose" id="dose"></div>' +
      "</aside>" +
      '<section class="bench panel">' +
      '<div class="instruments" id="inst"></div>' +
      '<div class="stage"><canvas id="beaker" aria-label="Vaso de precipitados"></canvas><div class="test-pop" id="test-pop" hidden></div></div>' +
      '<div class="bench-bar">' +
      '<div class="speed" id="speed"></div>' +
      '<div class="actions" id="actions">' +
      '<button data-act="stir" title="Remover con la varilla">Agitar</button>' +
      '<button data-act="balloon" id="btn-balloon" title="Tapar la boca del vaso con un globo">Poner globo</button>' +
      '<button data-act="astilla" title="Acercar una astilla encendida a la boca del vaso">Astilla encendida</button>' +
      '<button data-act="brasa" title="Acercar una astilla con brasa (sin llama)">Astilla con brasa</button>' +
      '<button data-act="papel" title="Mojar una tira de papel indicador universal">Papel indicador</button>' +
      '<button data-act="oler" title="Abanicar el vapor hacia la nariz">Oler</button>' +
      '<button data-act="undo" class="ghost" title="Deshacer el último paso">Deshacer</button>' +
      '<button data-act="empty" class="ghost danger" title="Tirar el contenido y lavar el vaso">Vaciar</button>' +
      "</div></div>" +
      "</section>" +
      '<aside class="notebook panel">' +
      '<div id="guide"></div>' +
      '<div class="tabs" id="nb-tabs">' +
      '<button data-tab="ves">Qué ves</button><button data-tab="rx">Reacciones</button><button data-tab="cont">Contenido</button>' +
      "</div>" +
      '<div class="nb-body" id="nb"></div>' +
      "</aside>" +
      "</div>";

    var q = root.querySelector("#shelf-q");
    q.value = Lab.query;
    q.addEventListener("input", function () { Lab.query = q.value; renderShelf(); });
    root.querySelector("#shelf-cats").addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (!b) return;
      Lab.cat = b.dataset.cat;
      renderShelf();
    });
    root.querySelector("#shelf-list").addEventListener("click", function (e) {
      var b = e.target.closest("[data-id]");
      if (!b) return;
      Lab.selected = b.dataset.id;
      renderShelf();
      renderDose();
    });
    root.querySelector("#shelf-list").addEventListener("dblclick", function (e) {
      var b = e.target.closest("[data-id]");
      if (b) pour();
    });
    root.querySelector("#dose").addEventListener("click", onDoseClick);
    root.querySelector("#dose").addEventListener("change", onDoseInput);
    root.querySelector("#speed").addEventListener("click", function (e) {
      var b = e.target.closest("[data-speed]");
      if (!b) return;
      Lab.speed = Number(b.dataset.speed);
      renderSpeed();
    });
    root.querySelector("#actions").addEventListener("click", onAction);
    root.querySelector("#nb-tabs").addEventListener("click", function (e) {
      var b = e.target.closest("[data-tab]");
      if (!b) return;
      Lab.tab = b.dataset.tab;
      lastNb = "";
      renderTabs();
      renderNotebook(true);
    });
    root.querySelector("#guide").addEventListener("click", function (e) {
      if (AQ.Practices) AQ.Practices.onGuideClick(e, Lab);
    });

    Lab.view = new AQ.BeakerView(root.querySelector("#beaker"), Lab.sim);
    renderShelf();
    renderDose();
    renderSpeed();
    renderTabs();
    lastNb = "";
    lastGuide = "";
    lastInst = "";
    Lab.refresh(true);
    onResize = function () { Lab.view.resize(); };
    window.addEventListener("resize", onResize);
    running = true;
    lastT = performance.now();
    acc = 0;
    requestAnimationFrame(loop);
  };

  Lab.unmount = function () {
    running = false;
    window.removeEventListener("resize", onResize);
    Lab.root = null;
  };

  var running = false;
  var lastT = 0;
  var acc = 0;
  var onResize = null;
  var lastNb = "";
  var lastGuide = "";
  var lastInst = "";

  function loop(now) {
    if (!running) return;
    var dt = Math.min(0.1, (now - lastT) / 1000);
    lastT = now;
    var sim = Lab.sim;
    if (Lab.speed > 0) sim.run(Math.min(8, dt * Lab.speed));
    drainEvents();
    Lab.view.frame(dt, Lab.speed);
    acc += dt;
    if (acc > 0.25) {
      acc = 0;
      Lab.refresh(false);
    }
    requestAnimationFrame(loop);
  }

  function drainEvents() {
    var ev = Lab.sim.events;
    while (ev.length) UI.toast(ev.shift(), "warn");
  }

  Lab.refresh = function (force) {
    if (!Lab.root) return;
    renderInstruments();
    if (AQ.Practices) AQ.Practices.check(Lab.sim);
    renderGuide();
    renderNotebook(force);
    var bb = Lab.root.querySelector("#btn-balloon");
    if (bb) bb.textContent = Lab.sim.balloon ? "Quitar globo" : "Poner globo";
  };

  // --- Estantería ---

  function matches(r) {
    if (Lab.cat !== "Todos" && r.cat !== Lab.cat) return false;
    var q = Lab.query.trim().toLowerCase();
    if (!q) return true;
    var hay = (r.name + " " + r.f + " " + r.desc + " " + r.cat).toLowerCase();
    return q.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
  }

  function bottleIcon(r) {
    var col = r.kind === "metal" ? AQ.METALS[r.metal].color : r.color || "#ddd";
    var shape = r.kind === "solid" ? "jar" : r.kind === "metal" ? "metal" : r.kind === "indicator" ? "dropper" : r.kind === "action" ? "straw" : "bottle";
    return '<span class="bicon ' + shape + '" style="--c:' + col + '"></span>';
  }

  function renderShelf() {
    var root = Lab.root;
    root.querySelector("#shelf-cats").innerHTML = CATS.map(function (c) {
      return '<button class="chip' + (c === Lab.cat ? " on" : "") + '" data-cat="' + c + '">' + c + "</button>";
    }).join("");
    var list = AQ.REAGENTS.filter(matches);
    root.querySelector("#shelf-list").innerHTML = list.length ? list.map(function (r) {
      return '<button class="bottle' + (r.id === Lab.selected ? " on" : "") + '" data-id="' + r.id + '" title="' + esc(r.desc) + '">' +
        bottleIcon(r) +
        '<span class="bname">' + esc(r.name) + '<small>' + esc(r.f) + "</small></span>" +
        (r.hazards ? '<span class="bhz">' + r.hazards.map(function (h) { return '<i style="--hz:' + UI.HAZARDS[h].color + '" title="' + UI.HAZARDS[h].label + '"></i>'; }).join("") + "</span>" : "") +
        "</button>";
    }).join("") : '<p class="muted small pad">No hay nada con ese nombre.</p>';
  }

  function scrollToSelected() {
    var el = Lab.root.querySelector(".bottle.on");
    if (el) el.scrollIntoView({ block: "nearest" });
  }

  function renderDose() {
    var r = AQ.REAGENT_BY_ID[Lab.selected];
    var c = choiceOf(r);
    var html = '<div class="dose-head">' + bottleIcon(r) + "<div><strong>" + esc(r.name) + '</strong><div class="muted small">' + esc(r.f) + "</div></div></div>" +
      '<p class="small">' + esc(r.desc) + "</p>" +
      (r.hazards ? '<div class="hzs">' + UI.hazardBadges(r.hazards) + "</div>" : "");
    if (r.concs) {
      html += '<label class="lbl">Concentración</label><div class="chips">' + r.concs.map(function (v) {
        return '<button class="chip' + (v === c.conc ? " on" : "") + '" data-conc="' + v + '">' + UI.conc(r, v) + "</button>";
      }).join("") + "</div>";
    }
    html += '<label class="lbl">' + (r.kind === "action" ? "Cuántos" : "Cantidad") + '</label><div class="chips">' + r.amounts.map(function (v) {
      return '<button class="chip' + (v === c.amount ? " on" : "") + '" data-amount="' + v + '">' + UI.amount(r, v) + "</button>";
    }).join("") + "</div>";
    if (r.kind !== "action" && r.unit !== "gotas") {
      html += '<div class="custom"><input type="number" min="0" step="any" id="dose-custom" value="' + c.amount + '"><span>' + (r.kind === "solution" || r.kind === "liquid" || r.unit === "mL" ? "mL" : "g") + "</span></div>";
    }
    html += '<button class="pour" data-pour="1">' + (r.kind === "action" ? "Soplar" : "Echar al vaso") + "</button>";
    html += '<p class="muted tiny">' + doseNote(r, c) + "</p>";
    Lab.root.querySelector("#dose").innerHTML = html;
  }

  function doseNote(r, c) {
    if (r.kind === "solution" && r.concs) {
      var mol = c.amount * c.conc / 1000;
      if (r.concUnit === "%") return "≈ " + UI.sci(c.amount * c.conc / 100 * 1.01 / 34.01) + " mol de H₂O₂.";
      return "Contiene " + UI.sci(mol) + " mol de soluto.";
    }
    if (r.kind === "solid" && AQ.SPECIES[r.solid]) return "Son " + UI.sci(c.amount / AQ.SPECIES[r.solid].M) + " mol (M = " + UI.num(AQ.SPECIES[r.solid].M, 2) + " g/mol).";
    if (r.kind === "metal") return "Son " + UI.sci(c.amount / AQ.MASS[r.metal]) + " mol de " + r.metal + ".";
    return "";
  }

  function onDoseClick(e) {
    var r = AQ.REAGENT_BY_ID[Lab.selected];
    var c = choiceOf(r);
    var t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.conc) { c.conc = Number(t.dataset.conc); renderDose(); }
    else if (t.dataset.amount) { c.amount = Number(t.dataset.amount); renderDose(); }
    else if (t.dataset.pour) pour();
  }

  function onDoseInput(e) {
    if (e.target.id !== "dose-custom") return;
    var v = Number(e.target.value);
    if (!(v > 0)) return;
    choiceOf(AQ.REAGENT_BY_ID[Lab.selected]).amount = v;
    renderDose();
  }

  function pour() {
    var r = AQ.REAGENT_BY_ID[Lab.selected];
    var c = choiceOf(r);
    var res = Lab.sim.pour(r.id, c.amount, c.conc);
    if (!res.ok) { UI.toast(res.msg, "warn"); return; }
    Lab.view.pourFx(r, c.amount);
    Lab.refresh(true);
  }

  // --- Mesa ---

  function renderSpeed() {
    Lab.root.querySelector("#speed").innerHTML = '<span class="muted small">Tiempo</span>' + SPEEDS.map(function (s) {
      return '<button class="chip' + (s === Lab.speed ? " on" : "") + '" data-speed="' + s + '">' + (s === 0 ? "❚❚" : s + "×") + "</button>";
    }).join("") + '<span class="clock" id="clock"></span>';
  }

  function onAction(e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var sim = Lab.sim;
    var act = b.dataset.act;
    if (act === "stir") {
      if (!sim.hasLiquid()) { UI.toast("No hay líquido que remover."); return; }
      sim.stir();
    } else if (act === "balloon") sim.toggleBalloon();
    else if (act === "undo") {
      if (!sim.undoLast()) UI.toast("No hay nada que deshacer.");
      Lab.view.foam = 0;
    } else if (act === "empty") {
      sim.reset();
      Lab.view.bubbles.length = 0;
      Lab.view.foam = 0;
      Lab.view.alkali = {};
      if (AQ.Practices) AQ.Practices.onEmpty();
    } else {
      var res = sim.test(act);
      Lab.view.testFx(res);
      showTest(res);
    }
    Lab.refresh(true);
  }

  var popTimer = null;
  function showTest(res) {
    var pop = Lab.root.querySelector("#test-pop");
    pop.hidden = false;
    pop.className = "test-pop" + (res.good ? " good" : "");
    pop.innerHTML = (res.color ? '<span class="strip" style="background:' + res.color + '"></span>' : "") +
      "<strong>" + esc(res.title) + "</strong><p>" + esc(res.text) + "</p>";
    clearTimeout(popTimer);
    popTimer = setTimeout(function () { pop.hidden = true; }, 6500);
  }

  function gasML(sim) {
    var t = 0;
    Object.keys(sim.produced).forEach(function (k) { if (k !== "H2O(g)") t += sim.produced[k]; });
    return t * AQ.Engine.GAS_L_PER_MOL * 1000;
  }

  function renderInstruments() {
    var sim = Lab.sim;
    var m = sim.measure();
    var trend = m.dTdt > 0.03 ? ' <i class="up">▲</i>' : m.dTdt < -0.03 ? ' <i class="down">▼</i>' : "";
    var ph = m.pH == null ? "—" : UI.fixed(Math.max(0, Math.min(14, m.pH)), 2);
    var phCls = m.pH == null ? "" : m.pH < 6.5 ? "acid" : m.pH > 7.5 ? "base" : "neutral";
    var gas = gasML(sim);
    var html =
      inst("Temperatura", UI.fixed(m.T, 1) + " °C" + trend, "Termómetro digital") +
      inst("pH", '<span class="ph ' + phCls + '">' + ph + "</span>", m.pH == null ? "Sin líquido" : m.pH < 6.5 ? "ácido" : m.pH > 7.5 ? "básico" : "neutro") +
      inst("Volumen", UI.num(m.volume + m.oil, 1) + " mL", m.oil ? "incluye " + UI.num(m.oil, 1) + " mL de aceite" : "de " + AQ.Engine.CAPACITY + " mL") +
      inst("Masa", UI.fixed(m.mass, 2) + " g", m.escapedMass > 0.0005 ? "escaparon " + UI.mass(m.escapedMass) : "sin contar el vaso") +
      inst("Gas producido", gas < 0.05 ? "0 mL" : UI.num(gas, gas < 10 ? 1 : 0) + " mL", gasNames(sim));
    if (html !== lastInst) {
      Lab.root.querySelector("#inst").innerHTML = html;
      lastInst = html;
    }
    var clock = Lab.root.querySelector("#clock");
    if (clock) clock.textContent = formatTime(sim.time);
  }

  function gasNames(sim) {
    var list = Object.keys(sim.produced).filter(function (k) { return k !== "H2O(g)" && sim.produced[k] > 1e-6; });
    if (!list.length) return "a 25 °C y 1 atm";
    return list.map(function (k) { return AQ.SPECIES[k].f.replace("(g)", ""); }).join(", ");
  }

  function inst(label, value, sub) {
    return '<div class="inst"><span class="ilbl">' + label + '</span><span class="ival">' + value + '</span><span class="isub">' + esc(sub || "") + "</span></div>";
  }

  function formatTime(t) {
    var s = Math.floor(t);
    var m = Math.floor(s / 60);
    var h = Math.floor(m / 60);
    s = s % 60;
    m = m % 60;
    return (h ? h + " h " : "") + (h || m ? m + " min " : "") + s + " s";
  }

  // --- Cuaderno ---

  function renderTabs() {
    Array.prototype.forEach.call(Lab.root.querySelectorAll("#nb-tabs button"), function (b) {
      b.classList.toggle("on", b.dataset.tab === Lab.tab);
    });
  }

  function renderGuide() {
    var html = AQ.Practices ? AQ.Practices.guideHTML(Lab.sim) : "";
    if (html === lastGuide) return;
    lastGuide = html;
    Lab.root.querySelector("#guide").innerHTML = html;
  }

  function renderNotebook(force) {
    var sim = Lab.sim;
    var html;
    if (Lab.tab === "ves") {
      html = '<ul class="obs">' + sim.describe().map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>";
      html += historyHTML(sim);
    } else if (Lab.tab === "rx") html = reactionsHTML(sim);
    else html = contentsHTML(sim);
    if (!force && html === lastNb) return;
    var nb = Lab.root.querySelector("#nb");
    var open = {};
    Array.prototype.forEach.call(nb.querySelectorAll("details[data-k]"), function (d) { open[d.dataset.k] = d.open; });
    nb.innerHTML = html;
    Array.prototype.forEach.call(nb.querySelectorAll("details[data-k]"), function (d) {
      if (open[d.dataset.k] != null) d.open = open[d.dataset.k];
    });
    lastNb = html;
  }

  function historyHTML(sim) {
    var pl = sim.hist.pourLog;
    if (!pl.length) return '<p class="muted small">Consejo: empieza con agua y luego añade lo que quieras. Puedes acelerar el tiempo para ver reacciones lentas.</p>';
    var items = pl.slice(-12).map(function (p) {
      var r = AQ.REAGENT_BY_ID[p.id];
      return "<li><span class=\"muted\">" + formatTime(p.t) + "</span> " + esc(UI.amount(r, p.amount)) + " de " + esc(r.name.toLowerCase()) + (r.concs ? " " + esc(UI.conc(r, p.conc)) : "") + "</li>";
    }).join("");
    return '<h4 class="sub">Lo que has echado</h4><ol class="pours">' + items + "</ol>";
  }

  function reactionsHTML(sim) {
    var log = sim.visibleLog();
    if (!log.length) return '<p class="muted">Todavía no ha ocurrido ninguna reacción química. Mezclar no siempre basta: tienen que existir partículas que reaccionen entre sí.</p>';
    return log.slice().reverse().map(function (e) {
      var live = sim.time - e.last < 1.5;
      var cls = typeClass(e.type);
      return '<details class="rx" data-k="' + esc(e.id) + '">' +
        '<summary><span class="tag ' + cls + '">' + esc(e.type) + "</span>" + (live ? '<span class="live" title="Ocurriendo ahora">●</span>' : "") +
        "<strong>" + esc(e.title) + "</strong>" +
        '<div class="eq">' + esc(e.molecular || e.ionic) + "</div></summary>" +
        (e.molecular ? '<div class="eq ionic"><span class="muted tiny">Iónica neta:</span> ' + esc(e.ionic) + "</div>" : "") +
        "<p>" + esc(e.why) + "</p>" +
        '<p class="muted tiny">Avance: ' + UI.sci(e.extent) + " mol · empezó a los " + formatTime(e.t0) + "</p>" +
        "</details>";
    }).join("");
  }

  function contentsHTML(sim) {
    var list = sim.contents();
    var water = sim.get("H2O(l)");
    if (!list.length && !sim.oil) return '<p class="muted">El vaso está vacío.</p>';
    var rows = list.filter(function (x) { return x.key !== "H2O(l)" && x.mol > 1e-10; }).map(function (x) {
      var amt = x.conc != null ? UI.sci(x.conc) + " mol/L" : UI.mass(x.g);
      return "<tr><td class=\"f\">" + esc(x.f) + "</td><td>" + esc(x.name) + '</td><td class="muted">' + PHASE[x.ph] + "</td><td class=\"num\">" + amt + "</td></tr>";
    }).join("");
    var head = water ? '<p class="small">Agua: ' + UI.num(water * 18.015, 2) + " g (" + UI.sci(water) + " mol)</p>" : "";
    if (sim.oil) head += '<p class="small">Aceite: ' + UI.num(sim.oil, 1) + " mL (capa aparte)</p>";
    var ind = Object.keys(sim.ind);
    if (ind.length) head += '<p class="small">Indicadores: ' + ind.map(function (k) { return esc(AQ.INDICATORS[k].name); }).join(", ") + "</p>";
    var gases = Object.keys(sim.escaped).filter(function (k) { return sim.escaped[k] > 1e-7; });
    var foot = gases.length ? '<p class="muted tiny">Gas que se ha ido al aire: ' + gases.map(function (k) { return esc(AQ.SPECIES[k].f) + " " + UI.mass(sim.escaped[k] * AQ.SPECIES[k].M); }).join(", ") + "</p>" : "";
    if (sim.balloon) {
      var bg = Object.keys(sim.balloon).filter(function (k) { return sim.balloon[k] > 1e-7; });
      if (bg.length) foot += '<p class="muted tiny">En el globo: ' + bg.map(function (k) { return esc(AQ.SPECIES[k].f) + " " + UI.mass(sim.balloon[k] * AQ.SPECIES[k].M); }).join(", ") + "</p>";
    }
    return head + (rows ? '<table class="cont"><thead><tr><th>Fórmula</th><th>Especie</th><th>Estado</th><th>Cantidad</th></tr></thead><tbody>' + rows + "</tbody></table>" : "") + foot +
      '<p class="muted tiny">Los compuestos iónicos disueltos aparecen separados en sus iones, que es como están realmente en el agua.</p>';
  }
})();
