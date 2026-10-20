(function (root) {
  var AQ = root.AQ;
  var SP = AQ.SPECIES;
  var METALS = AQ.METALS;
  var COMPOUNDS = AQ.COMPOUNDS;
  var F = AQ.Formula;

  var R = 8.314;
  var ML_PER_WATER_MOL = 18.015 / 0.997;
  var ML_PER_ETOH_MOL = 46.07 / 0.789;
  var GAS_L_PER_MOL = 24.47;
  var CAPACITY = 250;
  var WATER_PER_ML = 0.997 / 18.015;
  var AREA = { cinta: 1.4, papel: 2.2, granallas: 0.6, clavo: 0.35, "lámina": 0.8, alambre: 0.6, trocito: 1, granos: 0.8 };
  var GASES = ["H2(g)", "O2(g)", "CO2(g)"];

  var CATIONS = ["Na+", "K+", "Li+", "NH4+", "Ca2+", "Mg2+", "Ba2+", "Zn2+", "Fe2+", "Cu2+", "Al3+", "Pb2+", "Ag+", "Fe3+", "Ni2+", "Mn2+", "Sn2+"];
  var ANIONS = ["Cl-", "SO4 2-", "NO3-", "I-", "CH3COO-"];
  var BASE_CATIONS = ["Na+", "K+", "Li+", "Ca2+", "Ba2+"];

  var ION_DHF = { "Fe3+": -48.5 };
  Object.keys(METALS).forEach(function (s) { if (METALS[s].ion) ION_DHF[METALS[s].ion] = METALS[s].dHf; });

  var OXIDANTS = [];
  Object.keys(METALS).forEach(function (s) {
    var m = METALS[s];
    if (m.ion && m.E > -1) OXIDANTS.push({ ion: m.ion, E: m.E, e: m.z, product: m.key, metal: s });
  });
  OXIDANTS.push({ ion: "Fe3+", E: 0.77, e: 1, product: "Fe2+", metal: null });

  var COMPOUND_BY_KEY = {};
  COMPOUNDS.forEach(function (c) { COMPOUND_BY_KEY[c.key] = c; });

  function cationOf(c) {
    for (var k in c.ions) if (SP[k].z > 0) return k;
    return null;
  }
  function anionOf(c) {
    for (var k in c.ions) if (SP[k].z < 0) return k;
    return null;
  }

  // Reacciones que ocurren al instante, en este orden, hasta que no queda nada por reaccionar.
  var INSTANT = [
    { id: "neutral", r: { "H+": 1, "OH-": 1 }, p: { "H2O(l)": 1 }, dH: -55.8 },
    { id: "acetic-oh", r: { CH3COOH: 1, "OH-": 1 }, p: { "CH3COO-": 1, "H2O(l)": 1 }, dH: -56.1 },
    { id: "nh4-oh", r: { "NH4+": 1, "OH-": 1 }, p: { NH3: 1, "H2O(l)": 1 }, dH: -3.6 },
    { id: "co2-2oh", r: { "CO2(aq)": 1, "OH-": 2 }, p: { "CO3 2-": 1, "H2O(l)": 1 }, dH: -89 },
    { id: "co2-oh", r: { "CO2(aq)": 1, "OH-": 1 }, p: { "HCO3-": 1 }, dH: -48.2 },
    { id: "hco3-oh", r: { "HCO3-": 1, "OH-": 1 }, p: { "CO3 2-": 1, "H2O(l)": 1 }, dH: -40.9 },
    { id: "h-co3", r: { "H+": 1, "CO3 2-": 1 }, p: { "HCO3-": 1 }, dH: -14.9 },
    { id: "h-hco3", r: { "H+": 1, "HCO3-": 1 }, p: { "CO2(aq)": 1, "H2O(l)": 1 }, dH: -7.6 },
    { id: "acetic-co3", r: { CH3COOH: 1, "CO3 2-": 1 }, p: { "CH3COO-": 1, "HCO3-": 1 }, dH: -15 },
    { id: "acetic-hco3", r: { CH3COOH: 1, "HCO3-": 1 }, p: { "CH3COO-": 1, "CO2(aq)": 1, "H2O(l)": 1 }, dH: -7.8 },
    { id: "h-acetate", r: { "H+": 1, "CH3COO-": 1 }, p: { CH3COOH: 1 }, dH: 0, silent: true },
    { id: "h-nh3", r: { "H+": 1, NH3: 1 }, p: { "NH4+": 1 }, dH: -52.2 },
    { id: "acetic-nh3", r: { CH3COOH: 1, NH3: 1 }, p: { "CH3COO-": 1, "NH4+": 1 }, dH: -52.4 },
    { id: "znoh2-oh", r: { "Zn(OH)2(s)": 1, "OH-": 2 }, p: { "Zn(OH)4 2-": 1 }, dH: -10 },
    { id: "aloh3-oh", r: { "Al(OH)3(s)": 1, "OH-": 1 }, p: { "Al(OH)4-": 1 }, dH: -10 },
    { id: "znoh4-h", r: { "Zn(OH)4 2-": 1, "H+": 2 }, p: { "Zn(OH)2(s)": 1, "H2O(l)": 2 }, dH: -100 },
    { id: "aloh4-h", r: { "Al(OH)4-": 1, "H+": 1 }, p: { "Al(OH)3(s)": 1, "H2O(l)": 1 }, dH: -50 },
    { id: "cu-nh3", r: { "Cu2+": 1, NH3: 4 }, p: { "Cu(NH3)4 2+": 1 }, dH: -90 },
    { id: "cunh3-h", r: { "Cu(NH3)4 2+": 1, "H+": 4 }, p: { "Cu2+": 1, "NH4+": 4 }, dH: -120 },
    { id: "vitc-i2", r: { C6H8O6: 1, I2: 1 }, p: { C6H6O6: 1, "H+": 2, "I-": 2 }, dH: -30 },
    { id: "mno4-fe", r: { "MnO4-": 1, "Fe2+": 5, "H+": 8 }, p: { "Mn2+": 1, "Fe3+": 5, "H2O(l)": 4 }, dH: -300 },
    { id: "mno4-h2o2", r: { "MnO4-": 2, H2O2: 5, "H+": 6 }, p: { "Mn2+": 2, "O2(g)": 5, "H2O(l)": 8 }, dH: -600 },
    { id: "mno4-h2o2-b", r: { "MnO4-": 2, H2O2: 3 }, p: { "MnO2(s)": 2, "O2(g)": 3, "OH-": 2, "H2O(l)": 2 }, dH: -400 },
    { id: "mno4-vitc", r: { "MnO4-": 2, C6H8O6: 5, "H+": 6 }, p: { "Mn2+": 2, C6H6O6: 5, "H2O(l)": 8 }, dH: -500 }
  ];
  COMPOUNDS.forEach(function (c) {
    if (!c.ions["OH-"]) return;
    var nOH = c.ions["OH-"];
    var cat = cationOf(c);
    var p = {};
    p[cat] = c.ions[cat];
    p["H2O(l)"] = nOH + (c.w || 0);
    var r = { "H+": nOH };
    r[c.key] = 1;
    INSTANT.push({ id: "acid-dissolve:" + c.key, r: r, p: p, dH: -40 * nOH, compound: c });
  });

  var INFO = {
    "neutral": ["Neutralización", "Ácido-base", "Los H⁺ del ácido y los OH⁻ de la base se unen y forman agua. Los demás iones quedan disueltos: son la sal. Libera unos 56 kJ por cada mol de agua formada, por eso se calienta."],
    "acetic-oh": ["Neutralización de un ácido débil", "Ácido-base", "La base arranca el H⁺ al ácido acético y se forma acetato. También libera calor."],
    "nh4-oh": ["Se libera amoníaco", "Ácido-base", "El OH⁻ arranca un H⁺ al ion amonio y se forma NH₃, que huele fuerte."],
    "co2-2oh": ["El CO₂ reacciona con la base", "Ácido-base", "El dióxido de carbono es un óxido ácido: con una base forma carbonato."],
    "co2-oh": ["El CO₂ reacciona con la base", "Ácido-base", "Con poca base, el CO₂ forma hidrogenocarbonato."],
    "hco3-oh": ["El hidrogenocarbonato pasa a carbonato", "Ácido-base", "El OH⁻ quita el último H⁺ al ion HCO₃⁻."],
    "h-co3": ["El ácido ataca al carbonato", "Ácido-base", "El primer H⁺ convierte el carbonato en hidrogenocarbonato. Con más ácido se libera CO₂."],
    "h-hco3": ["Ácido + bicarbonato: sale CO₂", "Ácido-base con gas", "Se forma ácido carbónico, que se rompe en agua y dióxido de carbono. El gas escapa del vaso y la balanza marca menos."],
    "acetic-co3": ["El vinagre ataca al carbonato", "Ácido-base", "El ácido acético cede un H⁺ al carbonato."],
    "acetic-hco3": ["Vinagre + bicarbonato: sale CO₂", "Ácido-base con gas", "El ácido acético reacciona con el hidrogenocarbonato y se libera CO₂. Aunque es una reacción química, el vaso se enfría: absorbe energía."],
    "h-nh3": ["Neutralización del amoníaco", "Ácido-base", "El amoníaco capta un H⁺ y forma el ion amonio."],
    "acetic-nh3": ["Neutralización del amoníaco", "Ácido-base", "Ácido débil y base débil forman acetato de amonio."],
    "znoh2-oh": ["El precipitado se redisuelve", "Complejo", "El hidróxido de zinc es anfótero: con exceso de base forma un ion soluble y el sólido desaparece."],
    "aloh3-oh": ["El precipitado se redisuelve", "Complejo", "El hidróxido de aluminio es anfótero: con exceso de base forma [Al(OH)₄]⁻, soluble."],
    "znoh4-h": ["Vuelve a precipitar el hidróxido de zinc", "Ácido-base", "El ácido devuelve el ion complejo a hidróxido."],
    "aloh4-h": ["Vuelve a precipitar el hidróxido de aluminio", "Ácido-base", "El ácido devuelve el ion complejo a hidróxido."],
    "cu-nh3": ["Azul intenso: complejo de cobre", "Complejo", "El amoníaco se une al Cu²⁺ y forma [Cu(NH₃)₄]²⁺, de un azul mucho más intenso."],
    "cunh3-h": ["El ácido rompe el complejo", "Ácido-base", "Los H⁺ se llevan el amoníaco y vuelve el Cu²⁺ azul claro."],
    "vitc-i2": ["La vitamina C decolora el yodo", "Redox", "El ácido ascórbico cede electrones (se oxida) y el yodo pasa a yoduro incoloro (se reduce)."],
    "mno4-fe": ["El permanganato oxida al hierro(II)", "Redox", "El MnO₄⁻ violeta se reduce a Mn²⁺, casi incoloro, y el Fe²⁺ se oxida a Fe³⁺."],
    "mno4-h2o2": ["El permanganato se decolora", "Redox", "El agua oxigenada reduce al permanganato y se desprende oxígeno."],
    "mno4-h2o2-b": ["Aparece un sólido marrón", "Redox", "Sin ácido, el permanganato se reduce solo hasta MnO₂, un sólido pardo."],
    "mno4-vitc": ["La vitamina C decolora el permanganato", "Redox", "El ácido ascórbico es un reductor: reduce el MnO₄⁻ violeta a Mn²⁺."]
  };

  function tf(T, ea) {
    return Math.exp(-(ea * 1000 / R) * (1 / (T + 273.15) - 1 / 298.15));
  }

  function Sim() { this.reset(); }

  Sim.prototype.reset = function () {
    this.n = {};
    this.ind = {};
    this.oil = 0;
    this.T = 25;
    this.time = 0;
    this.form = {};
    this.susp = {};
    this.deposit = {};
    this.mass0 = {};
    this.alActive = 0;
    this.escaped = {};
    this.balloon = null;
    this.airIn = 0;
    this.rate = {};
    this.recent = {};
    this.source = {};
    this.produced = {};
    this.log = [];
    this.logIndex = {};
    this.events = [];
    this.stirUntil = -1;
    this.Q = 0;
    this.dTdt = 0;
    this.metalRate = {};
    this.metalGas = {};
    this.co2FromSolid = -1;
    this.hist = { minPH: null, maxPH: null, maxT: 25, minT: 25, gas: {}, ppt: {}, tests: [], colors: {}, pours: [], indicatorSeen: {} };
    this.undo = [];
    this.cache = null;
  };

  Sim.prototype.get = function (k) { return this.n[k] || 0; };

  Sim.prototype.add = function (k, x) {
    var v = (this.n[k] || 0) + x;
    if (v < 1e-15) delete this.n[k];
    else this.n[k] = v;
  };

  Sim.prototype.volumeL = function () {
    return (this.get("H2O(l)") * ML_PER_WATER_MOL + this.get("C2H5OH") * ML_PER_ETOH_MOL) / 1000;
  };

  Sim.prototype.c = function (k) {
    var V = this.volumeL();
    return V > 0 ? this.get(k) / V : 0;
  };

  Sim.prototype.hasLiquid = function () { return this.volumeL() > 0.0003; };

  Sim.prototype.massOf = function (k) { return this.get(k) * SP[k].M; };

  Sim.prototype.totalMass = function () {
    var m = 0;
    var self = this;
    Object.keys(this.n).forEach(function (k) { m += self.n[k] * SP[k].M; });
    Object.keys(this.ind).forEach(function (k) { m += self.ind[k] * 0.05; });
    m += this.oil * 0.92;
    if (this.balloon) Object.keys(this.balloon).forEach(function (k) { m += self.balloon[k] * SP[k].M; });
    return m;
  };

  Sim.prototype.heatCapacity = function () {
    var cp = 60 + this.get("H2O(l)") * 75.3 + this.get("C2H5OH") * 112 + this.oil * 0.92 * 2.0;
    var self = this;
    Object.keys(this.n).forEach(function (k) { if (SP[k].ph === "s") cp += self.n[k] * SP[k].M * 0.8; });
    return cp;
  };

  Sim.prototype.snapshot = function () {
    var keep = {};
    var self = this;
    Object.keys(this).forEach(function (k) { if (k !== "undo" && k !== "cache") keep[k] = self[k]; });
    return JSON.stringify(keep);
  };

  Sim.prototype.restore = function (json) {
    var data = JSON.parse(json);
    var undo = this.undo;
    this.reset();
    var self = this;
    Object.keys(data).forEach(function (k) { self[k] = data[k]; });
    this.undo = undo;
    this.cache = null;
  };

  Sim.prototype.undoLast = function () {
    if (!this.undo.length) return false;
    this.restore(this.undo.pop());
    return true;
  };

  Sim.prototype.liquidML = function () {
    return this.volumeL() * 1000 + this.oil;
  };

  Sim.prototype.pour = function (id, amount, conc) {
    var r = AQ.REAGENT_BY_ID[id];
    if (!r) return { ok: false, msg: "Reactivo desconocido" };
    var add = {};
    var addML = 0;
    var oil = 0;
    if (r.kind === "solution") {
      add = r.adds(amount, conc == null ? r.defConc : conc);
      addML = amount;
    } else if (r.kind === "solid") {
      add[r.solid] = amount / SP[r.solid].M;
    } else if (r.kind === "metal") {
      add[METALS[r.metal].key] = amount / AQ.MASS[r.metal];
    } else if (r.kind === "indicator") {
      if (r.unit === "mL") {
        add["H2O(l)"] = amount * WATER_PER_ML;
        addML = amount;
      }
    } else if (r.kind === "liquid") {
      addML = amount;
      if (id === "aceite") oil = amount;
      else if (id === "etanol") add.C2H5OH = amount * 0.789 / 46.07;
      else if (id === "jabon") {
        add.jabon = amount * 0.15 / SP.jabon.M;
        add["H2O(l)"] = amount * 0.85 * WATER_PER_ML;
      }
    } else if (r.kind === "action") {
      if (this.balloon) return { ok: false, msg: "Quita el globo para poder soplar." };
      if (!this.hasLiquid()) return { ok: false, msg: "Soplas, pero no hay líquido en el vaso: el aire se va." };
      add["CO2(aq)"] = amount * 0.00012;
    }
    if (this.liquidML() + addML > CAPACITY) return { ok: false, msg: "No cabe: el vaso es de " + CAPACITY + " mL." };

    this.undo.push(this.snapshot());
    if (this.undo.length > 40) this.undo.shift();

    var cpBefore = this.heatCapacity();
    var self = this;
    Object.keys(add).forEach(function (k) { self.add(k, add[k]); });
    this.oil += oil;
    if (r.kind === "indicator") this.ind[r.ind] = (this.ind[r.ind] || 0) + amount;
    var cpAdded = this.heatCapacity() - cpBefore;
    if (cpAdded > 0) this.T = (this.T * cpBefore + 25 * cpAdded) / (cpBefore + cpAdded);

    if (r.kind === "metal") {
      var key = METALS[r.metal].key;
      this.mass0[key] = (this.mass0[key] || 0) + amount;
    }
    if (r.kind === "solid") {
      this.form[r.solid] = r.form || this.form[r.solid] || 1;
      this.susp[r.solid] = 0;
    }
    this.hist.pours.push(id);
    this.equilibrate();
    this.flushHeat();
    this.cache = null;
    return { ok: true };
  };

  Sim.prototype.flushHeat = function () {
    if (!this.Q) return;
    var dT = this.Q / this.heatCapacity();
    this.T += dT;
    this.Q = 0;
    this.dTdt += dT / 2;
    this.hist.maxT = Math.max(this.hist.maxT, this.T);
    this.hist.minT = Math.min(this.hist.minT, this.T);
  };

  Sim.prototype.stir = function () {
    this.stirUntil = this.time + 4;
    var self = this;
    Object.keys(this.n).forEach(function (k) {
      if (SP[k].ph === "s" && !SP[k].metal) self.susp[k] = 1;
    });
  };

  Sim.prototype.stirring = function () { return this.time < this.stirUntil; };

  Sim.prototype.toggleBalloon = function () {
    if (this.balloon) {
      var self = this;
      Object.keys(this.balloon).forEach(function (k) {
        self.escaped[k] = (self.escaped[k] || 0) + self.balloon[k];
        self.recent[k] = (self.recent[k] || 0) + self.balloon[k];
      });
      this.balloon = null;
      this.events.push("Quitas el globo: el gas que había dentro sale junto a la boca del vaso.");
    } else {
      this.undo.push(this.snapshot());
      this.balloon = {};
    }
    this.cache = null;
  };

  Sim.prototype.balloonLiters = function () {
    if (!this.balloon) return 0;
    var t = 0;
    var self = this;
    Object.keys(this.balloon).forEach(function (k) { t += self.balloon[k]; });
    return t * GAS_L_PER_MOL * (this.T + 273.15) / 298.15;
  };

  Sim.prototype.releaseGas = function (k, x, source) {
    if (x <= 0) return;
    if (this.balloon) this.balloon[k] = (this.balloon[k] || 0) + x;
    else this.escaped[k] = (this.escaped[k] || 0) + x;
    this.produced[k] = (this.produced[k] || 0) + x;
    this.hist.gas[k] = (this.hist.gas[k] || 0) + x;
    if (!this.balloon) this.recent[k] = (this.recent[k] || 0) + x;
    if (source) this.source[k] = source;
  };

  // Aplica una reacción con avance x (mol). Los gases salen del vaso (o entran al globo).
  Sim.prototype.apply = function (r, p, x, dH, logId, ctx) {
    var self = this;
    Object.keys(r).forEach(function (k) {
      if (k === "O2(aire)") self.airIn += r[k] * x * 32.0;
      else self.add(k, -r[k] * x);
    });
    Object.keys(p).forEach(function (k) {
      if (SP[k].ph === "g") self.releaseGas(k, p[k] * x, ctx && ctx.source);
      else self.add(k, p[k] * x);
    });
    if (dH) this.Q += -dH * 1000 * x;
    if (logId) this.logReaction(logId, r, p, x, ctx);
  };

  function extentOf(sim, r) {
    var x = Infinity;
    Object.keys(r).forEach(function (k) {
      if (k === "O2(aire)") return;
      x = Math.min(x, sim.get(k) / r[k]);
    });
    return x === Infinity ? 0 : x;
  }

  Sim.prototype.equilibrate = function () {
    if (!this.hasLiquid()) return;
    for (var pass = 0; pass < 30; pass++) {
      var changed = false;
      for (var i = 0; i < INSTANT.length; i++) {
        var rule = INSTANT[i];
        var x = extentOf(this, rule.r);
        if (x > 1e-13) {
          this.apply(rule.r, rule.p, x, rule.dH, rule.silent ? null : rule.id, { rule: rule });
          changed = true;
        }
      }
      for (var j = 0; j < COMPOUNDS.length; j++) {
        if (this.precipitate(COMPOUNDS[j])) changed = true;
      }
      if (!changed) break;
    }
  };

  Sim.prototype.kspOf = function (c) {
    if (c.special === "iodine") {
      var V = this.volumeL();
      var etoh = V > 0 ? this.get("C2H5OH") * ML_PER_ETOH_MOL / 1000 / V : 0;
      return 0.0013 + 0.85 * this.c("I-") + 0.8 * etoh;
    }
    return c.ksp != null ? c.ksp : c.kspEff;
  };

  // g(x) > 0 significa sobresaturado tras precipitar x mol.
  function gOf(sim, c, x, V, lnK) {
    var s = -lnK;
    for (var k in c.ions) {
      var nu = c.ions[k];
      var left = sim.get(k) - nu * x;
      if (left <= 0) return -Infinity;
      s += nu * Math.log(left / V);
    }
    return s;
  }

  Sim.prototype.precipitate = function (c) {
    for (var k in c.ions) if (!this.n[k]) return false;
    var V = this.volumeL();
    var lnK = Math.log(this.kspOf(c));
    if (gOf(this, c, 0, V, lnK) <= 1e-7) return false;
    var hi = Infinity;
    for (var k2 in c.ions) hi = Math.min(hi, this.get(k2) / c.ions[k2]);
    var lo = 0;
    for (var it = 0; it < 80; it++) {
      var mid = (lo + hi) / 2;
      if (gOf(this, c, mid, V, lnK) > 0) lo = mid; else hi = mid;
    }
    var x = lo;
    if (x < 1e-13) return false;
    var r = {};
    var p = {};
    Object.keys(c.ions).forEach(function (ion) { r[ion] = c.ions[ion]; });
    p[c.key] = 1;
    if (c.w) {
      if (c.w > 0) r["H2O(l)"] = c.w;
      else p["H2O(l)"] = -c.w;
    }
    var before = this.get(c.key);
    this.apply(r, p, x, -(c.dH || 0), (c.ppt ? "ppt:" : "cryst:") + c.key, { compound: c });
    var after = this.get(c.key);
    this.susp[c.key] = ((this.susp[c.key] || 0) * before + x) / after;
    if (c.ppt) this.hist.ppt[c.key] = Math.max(this.hist.ppt[c.key] || 0, after);
    return true;
  };

  Sim.prototype.dissolve = function (c, dt) {
    var S = this.get(c.key);
    if (S <= 0) return;
    if (c.carbonate && (this.get("H+") > 0 || this.get("CH3COOH") > 0)) return;
    if (c.ions["OH-"] && this.get("H+") > 0) return;
    var V = this.volumeL();
    var lnK = Math.log(this.kspOf(c));
    if (gOf(this, c, 0, V, lnK) >= -1e-9) return;
    var x;
    if (gOf(this, c, -S, V, lnK) <= 0) x = -S;
    else {
      var lo = -S;
      var hi = 0;
      for (var it = 0; it < 60; it++) {
        var mid = (lo + hi) / 2;
        if (gOf(this, c, mid, V, lnK) > 0) lo = mid; else hi = mid;
      }
      x = hi;
    }
    var tau = (c.tau || (c.ppt ? 0.5 : 1.5)) / (this.stirring() ? 3 : 1);
    var amount = -x * (1 - Math.exp(-dt / tau));
    if (amount < 1e-11 && -x > 1e-11) amount = Math.min(-x, 1e-11);
    if (amount <= 0) return;
    var r = {};
    var p = {};
    r[c.key] = 1;
    Object.keys(c.ions).forEach(function (ion) { p[ion] = c.ions[ion]; });
    if (c.w) {
      if (c.w > 0) p["H2O(l)"] = c.w;
      else r["H2O(l)"] = -c.w;
    }
    if (c.w < 0 && this.get("H2O(l)") < amount) return;
    this.apply(r, p, amount, c.dH || 0, c.ppt ? null : "dissolve:" + c.key, { compound: c });
  };

  Sim.prototype.area = function (key, form) {
    var g = this.massOf(key);
    return Math.pow(Math.max(g, 0), 2 / 3) * form;
  };

  Sim.prototype.kinetics = function (dt) {
    var T = this.T;
    var self = this;
    var V = this.volumeL();

    COMPOUNDS.forEach(function (c) { self.dissolve(c, dt); });

    if (this.get("Al(s)") > 0) {
      var act = 0.05 * this.c("H+") + 0.6 * this.c("OH-") + 0.03 * this.c("Cl-");
      this.alActive = Math.min(1, this.alActive + act * dt * tf(T, 40));
    }

    var water = this.get("H2O(l)");
    Object.keys(METALS).forEach(function (sym) {
      var m = METALS[sym];
      var key = m.key;
      var nM = self.get(key);
      if (nM <= 0 || !m.ion) return;
      var A = self.area(key, AREA[m.form] || 1);
      var passive = m.passive ? self.alActive : 1;
      var used = 0;
      var gas = 0;

      if (m.kWater && water > 0 && !(m.kAcid && self.c("H+") > 1e-4)) {
        var boost = m.kAcid ? 1 : 1 + 4 * self.c("H+") + 0.2 * self.c("CH3COOH");
        var rw = m.kWater * A * tf(T, m.eaWater || 30) * boost;
        var xw = Math.min(rw * dt, nM, self.get("H2O(l)") / m.z * 0.5);
        if (xw > 0) {
          var rr = {}; rr[key] = 1; rr["H2O(l)"] = m.z;
          var pp = {}; pp[m.ion] = 1; pp["OH-"] = m.z; pp["H2(g)"] = m.z / 2;
          self.apply(rr, pp, xw, m.dHf + 55.8 * m.z, "metal-water:" + sym, { source: "metal:" + sym, metal: sym });
          used += xw;
          gas += xw;
        }
      }

      if (m.kAcid) {
        var hPlus = self.c("H+");
        var weak = self.c("CH3COOH");
        var acid = hPlus + 0.03 * weak + 0.03 * self.c("C6H8O6");
        if (acid > 1e-6) {
          var ra = m.kAcid * A * acid * tf(T, 45) * passive;
          var xa = Math.min(ra * dt, self.get(key));
          var hAvail = self.get("H+");
          var weakAvail = self.get("CH3COOH");
          xa = Math.min(xa, (hAvail + weakAvail) / m.z);
          if (xa > 0) {
            var fromH = Math.min(xa * m.z, hAvail);
            var fromWeak = xa * m.z - fromH;
            var ra2 = {}; ra2[key] = 1;
            var pa2 = {}; pa2[m.ion] = 1; pa2["H2(g)"] = m.z / 2;
            if (fromH > 0) ra2["H+"] = fromH / xa;
            if (fromWeak > 0) { ra2.CH3COOH = fromWeak / xa; pa2["CH3COO-"] = fromWeak / xa; }
            self.apply(ra2, pa2, xa, m.dHf, "metal-acid:" + sym, { source: "metal:" + sym, metal: sym, weak: fromH === 0 });
            used += xa;
            gas += xa;
          }
        }
      }

      if (m.kBase && self.get("OH-") > 0) {
        var rb = m.kBase * A * self.c("OH-") * tf(T, 45) * passive;
        var xb = Math.min(rb * dt, self.get(key));
        var rb2 = {}; rb2[key] = 1;
        var pb2 = {}; pb2[m.complex] = 1;
        var nOH = sym === "Al" ? 1 : 2;
        var nW = sym === "Al" ? 3 : 2;
        rb2["OH-"] = nOH; rb2["H2O(l)"] = nW;
        pb2["H2(g)"] = sym === "Al" ? 1.5 : 1;
        xb = Math.min(xb, self.get("OH-") / nOH);
        if (xb > 0) {
          self.apply(rb2, pb2, xb, sym === "Al" ? -402.6 : -120, "metal-base:" + sym, { source: "metal:" + sym, metal: sym });
          used += xb;
          gas += xb;
        }
      }

      if (!m.kWater || m.kWater < 1e-5) {
        OXIDANTS.forEach(function (ox) {
          if (ox.metal === sym) return;
          var cN = self.c(ox.ion);
          if (cN <= 0) return;
          var dE = ox.E - m.E;
          if (dE < 0.05) return;
          var re = 2.5e-4 * A * cN * Math.sqrt(Math.min(1, dE)) * tf(T, 40) * passive;
          var xe = Math.min(re * dt, self.get(key) * m.z, self.get(ox.ion) * ox.e);
          if (xe <= 0) return;
          var rd = {}; rd[key] = 1 / m.z; rd[ox.ion] = 1 / ox.e;
          var pd = {}; pd[m.ion] = 1 / m.z; pd[ox.product] = (pd[ox.product] || 0) + 1 / ox.e;
          var dHe = ION_DHF[m.ion] / m.z - (ION_DHF[ox.ion] - (ION_DHF[ox.product] || 0)) / ox.e;
          self.apply(rd, pd, xe, dHe, "displ:" + sym + ":" + ox.ion, { metal: sym, oxidant: ox });
          if (SP[ox.product].ph === "s") {
            var dep = self.deposit[ox.product] || (self.deposit[ox.product] = { host: key, n: 0 });
            dep.n += xe / ox.e;
          }
          used += xe / m.z;
        });
      }

      if (m.rusts && water > 0) {
        var salt = 1 + 25 * self.c("Cl-");
        var basic = self.c("OH-") > 0.01 ? 0.05 : 1;
        var acidic = self.c("H+") > 1e-3 ? 0.3 : 1;
        var rr3 = 1.5e-8 * A * salt * basic * acidic * tf(T, 40);
        var xr = Math.min(rr3 * dt, self.get(key), self.get("H2O(l)") / 1.5);
        if (xr > 0) {
          self.apply({ "Fe(s)": 1, "O2(aire)": 0.75, "H2O(l)": 1.5 }, { "Fe(OH)3(s)": 1 }, xr, -394, "rust", { metal: sym });
          var rustDep = self.deposit["Fe(OH)3(s)"] || (self.deposit["Fe(OH)3(s)"] = { host: key, n: 0 });
          rustDep.n += xr;
        }
      }

      self.metalRate[sym] = used / dt;
      self.metalGas[sym] = gas / dt;
    });

    COMPOUNDS.forEach(function (c) {
      if (!c.carbonate) return;
      var S = self.get(c.key);
      if (S <= 0) return;
      var acid = self.c("H+") + 0.05 * self.c("CH3COOH");
      if (acid < 1e-6) return;
      var A = self.area(c.key, self.form[c.key] || 3);
      var rate = 5e-4 * A * acid * tf(T, 40);
      var hAvail = self.get("H+");
      var weakAvail = self.get("CH3COOH");
      var x = Math.min(rate * dt, S, (hAvail + weakAvail) / 2);
      if (x <= 0) return;
      var cat = cationOf(c);
      var fromH = Math.min(2 * x, hAvail);
      var fromWeak = 2 * x - fromH;
      var r = {}; r[c.key] = 1;
      var p = {}; p[cat] = c.ions[cat]; p["CO2(aq)"] = 1; p["H2O(l)"] = 1;
      if (fromH > 0) r["H+"] = fromH / x;
      if (fromWeak > 0) { r.CH3COOH = fromWeak / x; p["CH3COO-"] = fromWeak / x; }
      self.apply(r, p, x, -35, "carb-acid:" + c.key, { compound: c, weak: fromH === 0 });
      self.co2FromSolid = self.time + 1;
    });

    var h2o2 = this.get("H2O2");
    if (h2o2 > 0) {
      var papaT = T < 60 ? 1 : Math.exp(-(T - 60) / 5);
      var terms = {
        none: 2e-6,
        "MnO2(s)": 0.5 * Math.pow(this.massOf("MnO2(s)"), 2 / 3),
        "papa(s)": 0.03 * Math.pow(this.massOf("papa(s)"), 2 / 3) * papaT,
        "I-": 2 * this.c("I-"),
        "Fe3+": 0.4 * this.c("Fe3+"),
        "OH-": 0.002 * this.c("OH-")
      };
      var kobs = 0;
      var main = "none";
      Object.keys(terms).forEach(function (t) {
        kobs += terms[t];
        if (terms[t] > terms[main]) main = t;
      });
      kobs *= tf(T, 50);
      var xh = h2o2 * (1 - Math.exp(-kobs * dt));
      if (xh > 0) {
        var src = main === "MnO2(s)" || main === "papa(s)" ? "solid:" + main : "bulk";
        this.apply({ H2O2: 1 }, { "H2O(l)": 1, "O2(g)": 0.5 }, xh, -98.2, "h2o2:" + main, { source: src, catalyst: main });
      }
    }

    if (this.get("H2O2") > 0 && this.get("I-") > 0 && this.get("H+") > 0) {
      var ri = 0.4 * this.c("H+") * this.c("H2O2") * this.c("I-") * V * tf(T, 55);
      var xi = Math.min(ri * dt, this.get("H2O2"), this.get("I-") / 2, this.get("H+") / 2);
      if (xi > 0) this.apply({ H2O2: 1, "I-": 2, "H+": 2 }, { I2: 1, "H2O(l)": 2 }, xi, -150, "iodide-h2o2", {});
    }

    if (this.get("CaCO3(s)") > 0 && this.get("CO2(aq)") > 0 && !this.get("OH-") && this.get("H+") < 1e-9 && this.get("CH3COOH") < 1e-9) {
      var rc = 0.02 * this.get("CaCO3(s)") * Math.min(1, this.c("CO2(aq)") / 0.03);
      var xc = Math.min(rc * dt, this.get("CaCO3(s)"), this.get("CO2(aq)"));
      if (xc > 0) this.apply({ "CaCO3(s)": 1, "CO2(aq)": 1, "H2O(l)": 1 }, { "Ca2+": 1, "HCO3-": 2 }, xc, -20, "caco3-co2", {});
    }

    var co2 = this.get("CO2(aq)");
    if (co2 > 0) {
      var sat = 0.034 * Math.exp(-0.025 * (T - 25)) * V;
      var tau = this.stirring() ? 1 : 2.5;
      var out = co2 > sat ? (co2 - sat) * (1 - Math.exp(-dt / tau)) : co2 * (1 - Math.exp(-dt / 1500));
      if (out > 0) {
        this.apply({ "CO2(aq)": 1 }, { "CO2(g)": 1 }, out, 20.3, null, { source: this.co2FromSolid > this.time ? "solid:carbonate" : "bulk" });
      }
    }
  };

  Sim.prototype.step = function (dt) {
    var before = {};
    var self = this;
    GASES.forEach(function (g) { before[g] = self.produced[g] || 0; });
    var T0 = this.T;
    if (this.hasLiquid()) this.kinetics(dt);
    else {
      Object.keys(METALS).forEach(function (s) { self.metalRate[s] = 0; self.metalGas[s] = 0; });
    }
    this.equilibrate();

    var self2 = this;
    Object.keys(this.susp).forEach(function (k) {
      if (!self2.n[k]) { delete self2.susp[k]; return; }
      if (self2.stirring()) { self2.susp[k] = 1; return; }
      var c = COMPOUND_BY_KEY[k];
      var settle = c && c.ppt ? c.settle || 30 : 3;
      self2.susp[k] *= Math.exp(-dt / settle);
    });
    Object.keys(this.deposit).forEach(function (k) {
      var d = self2.deposit[k];
      d.n = Math.min(d.n, self2.get(k));
      if (d.n <= 1e-12) delete self2.deposit[k];
    });

    var cp = this.heatCapacity();
    this.T += this.Q / cp;
    this.Q = 0;
    var water = this.get("H2O(l)");
    if (this.T > 100 && water > 0) {
      var evap = Math.min(water, (this.T - 100) * cp / 40700);
      this.add("H2O(l)", -evap);
      this.escaped["H2O(g)"] = (this.escaped["H2O(g)"] || 0) + evap;
      this.T = 100;
    }
    var mass = this.totalMass();
    var tauC = 300 + 5 * mass;
    this.T += (25 - this.T) * (1 - Math.exp(-dt / tauC));
    if (this.T < -15) this.T = -15;
    var inst = (this.T - T0) / dt;
    this.dTdt += (inst - this.dTdt) * (1 - Math.exp(-dt / 2));

    GASES.forEach(function (g) {
      var made = (self.produced[g] || 0) - before[g];
      var r = self.rate[g] || 0;
      self.rate[g] = r + (made / dt - r) * (1 - Math.exp(-dt / 1.2));
      if (self.recent[g]) self.recent[g] *= Math.exp(-dt / 8);
    });

    if (this.balloon && this.balloonLiters() > 3) {
      var b = this.balloon;
      Object.keys(b).forEach(function (k) { self.escaped[k] = (self.escaped[k] || 0) + b[k]; });
      this.balloon = null;
      this.events.push("¡El globo ha reventado! Había más de 3 litros de gas dentro.");
    }

    this.hist.maxT = Math.max(this.hist.maxT, this.T);
    this.hist.minT = Math.min(this.hist.minT, this.T);
    this.time += dt;
    this.cache = null;
  };

  Sim.prototype.run = function (seconds) {
    var t = 0;
    while (t < seconds - 1e-9) {
      var dt = Math.min(0.1, seconds - t);
      this.step(dt);
      t += dt;
    }
  };

  // pH a partir del balance de carga con ácidos y bases débiles.
  var SYSTEMS = [
    { keys: ["CH3COOH", "CH3COO-"], charges: [0, -1], pKa: [4.76] },
    { keys: ["NH4+", "NH3"], charges: [1, 0], pKa: [9.25] },
    { keys: ["CO2(aq)", "HCO3-", "CO3 2-"], charges: [0, -1, -2], pKa: [6.35, 10.33] },
    { keys: ["C6H8O6"], charges: [0, -1], pKa: [4.17] },
    { keys: ["SO4 2-"], charges: [-1, -2], pKa: [1.99] },
    { keys: ["Fe3+"], charges: [3, 2], pKa: [2.2] },
    { keys: ["Al3+"], charges: [3, 2], pKa: [5.0] },
    { keys: ["Cu2+"], charges: [2, 1], pKa: [7.5] },
    { keys: ["Zn2+"], charges: [2, 1], pKa: [9.0] },
    { keys: ["Pb2+"], charges: [2, 1], pKa: [7.7] },
    { keys: ["Fe2+"], charges: [2, 1], pKa: [9.5] },
    { keys: ["Sn2+"], charges: [2, 1], pKa: [3.4] },
    { keys: ["H2O2"], charges: [0, -1], pKa: [11.6] }
  ];
  var IN_SYSTEM = { "H+": 1, "OH-": 1 };
  SYSTEMS.forEach(function (s) { s.keys.forEach(function (k) { IN_SYSTEM[k] = 1; }); });

  function avgCharge(sys, h) {
    var w = [1];
    for (var i = 0; i < sys.pKa.length; i++) w.push(w[i] * Math.pow(10, -sys.pKa[i]) / h);
    var sum = 0;
    var q = 0;
    for (var j = 0; j < w.length; j++) { sum += w[j]; q += w[j] * sys.charges[j]; }
    return q / sum;
  }

  AQ.pKw = function (T) { return 14.94 - 0.0416 * T + 0.00016 * T * T; };

  AQ.solvePH = function (conc, T) {
    var spect = 0;
    Object.keys(conc).forEach(function (k) {
      if (IN_SYSTEM[k] || !SP[k] || SP[k].ph !== "aq") return;
      spect += SP[k].z * conc[k];
    });
    var totals = SYSTEMS.map(function (s) {
      var t = 0;
      s.keys.forEach(function (k) { t += conc[k] || 0; });
      return t;
    });
    var kw = Math.pow(10, -AQ.pKw(T == null ? 25 : T));
    function f(ph) {
      var h = Math.pow(10, -ph);
      var s = h - kw / h + spect;
      for (var i = 0; i < SYSTEMS.length; i++) if (totals[i]) s += totals[i] * avgCharge(SYSTEMS[i], h);
      return s;
    }
    var lo = -2;
    var hi = 16;
    for (var it = 0; it < 70; it++) {
      var mid = (lo + hi) / 2;
      if (f(mid) > 0) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  };

  Sim.prototype.pH = function () {
    if (this.get("H2O(l)") * ML_PER_WATER_MOL < 0.3) return null;
    var V = this.volumeL();
    var conc = {};
    var self = this;
    Object.keys(this.n).forEach(function (k) { if (SP[k].ph === "aq") conc[k] = self.n[k] / V; });
    return AQ.solvePH(conc, this.T);
  };

  function hexToRgb(hex) {
    var v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }
  function absorb(rgb) {
    return rgb.map(function (ch) { return -Math.log(Math.max(ch, 6) / 255) / Math.LN10; });
  }

  AQ.indicatorAt = function (id, ph) {
    var stops = AQ.INDICATORS[id].stops;
    if (ph <= stops[0][0]) return { rgb: hexToRgb(stops[0][1]), k: stops[0][2] };
    for (var i = 1; i < stops.length; i++) {
      if (ph <= stops[i][0]) {
        var a = stops[i - 1];
        var b = stops[i];
        var t = (ph - a[0]) / (b[0] - a[0]);
        var ca = hexToRgb(a[1]);
        var cb = hexToRgb(b[1]);
        var ka = a[2];
        var kb = b[2];
        if (ka === 0) ca = cb;
        if (kb === 0) cb = ca;
        return { rgb: ca.map(function (x, j) { return Math.round(x + (cb[j] - x) * t); }), k: ka + (kb - ka) * t };
      }
    }
    var last = stops[stops.length - 1];
    return { rgb: hexToRgb(last[1]), k: last[2] };
  };

  Sim.prototype.color = function (ph) {
    var V = this.volumeL();
    var A = [0, 0, 0];
    if (V <= 0) return { rgb: [255, 255, 255], strength: 0 };
    var self = this;
    var starch = this.c("almidon") > 4e-4;
    Object.keys(this.n).forEach(function (k) {
      var sp = SP[k];
      if (sp.ph !== "aq" || !sp.col) return;
      var col = sp.col;
      if (k === "I2" && starch) col = ["#141c48", 0.0006];
      var ab = absorb(hexToRgb(col[0]));
      var f = self.n[k] / V / col[1];
      for (var j = 0; j < 3; j++) A[j] += ab[j] * f;
    });
    if (ph != null) {
      var mL = V * 1000;
      Object.keys(this.ind).forEach(function (id) {
        var at = AQ.indicatorAt(id, ph);
        if (!at.k) return;
        var ab = absorb(at.rgb);
        var f = (self.ind[id] / mL) / 0.06 * at.k;
        for (var j = 0; j < 3; j++) A[j] += ab[j] * f;
      });
    }
    var rgb = A.map(function (a) { return Math.round(255 * Math.pow(10, -a)); });
    var strength = Math.min(1, Math.max(A[0], A[1], A[2]) / 1.2);
    return { rgb: rgb, strength: strength };
  };

  Sim.prototype.turbidity = function () {
    var V = this.volumeL();
    if (V <= 0) return { alpha: 0, rgb: [255, 255, 255], items: [] };
    var self = this;
    var tot = 0;
    var mix = [0, 0, 0];
    var items = [];
    Object.keys(this.susp).forEach(function (k) {
      var n = self.get(k) * self.susp[k];
      if (n <= 0) return;
      var c = COMPOUND_BY_KEY[k];
      var color = c ? c.color : (AQ.INERT[k] && AQ.INERT[k].color) || "#ffffff";
      var w = (n / V) / 0.004;
      tot += w;
      var rgb = hexToRgb(color);
      for (var j = 0; j < 3; j++) mix[j] += rgb[j] * w;
      items.push(k);
    });
    var starch = this.c("almidon");
    if (starch > 0) {
      var ws = starch / 0.25;
      tot += ws;
      for (var j = 0; j < 3; j++) mix[j] += 248 * ws;
    }
    if (!tot) return { alpha: 0, rgb: [255, 255, 255], items: [] };
    return { alpha: 1 - Math.exp(-tot), rgb: mix.map(function (x) { return Math.round(x / tot); }), items: items };
  };

  Sim.prototype.measure = function () {
    if (this.cache) return this.cache;
    var ph = this.pH();
    var V = this.volumeL();
    var escapedMass = 0;
    var self = this;
    Object.keys(this.escaped).forEach(function (k) { escapedMass += self.escaped[k] * SP[k].M; });
    var col = this.color(ph);
    var m = {
      pH: ph,
      T: this.T,
      dTdt: this.dTdt,
      volume: V * 1000,
      oil: this.oil,
      mass: this.totalMass(),
      escapedMass: escapedMass,
      airIn: this.airIn,
      color: col,
      turbidity: this.turbidity(),
      balloon: this.balloonLiters(),
      gasRate: Object.assign({}, this.rate),
      gasTotal: Object.assign({}, this.produced)
    };
    if (ph != null) {
      this.hist.minPH = this.hist.minPH == null ? ph : Math.min(this.hist.minPH, ph);
      this.hist.maxPH = this.hist.maxPH == null ? ph : Math.max(this.hist.maxPH, ph);
      Object.keys(this.ind).forEach(function (id) {
        var name = AQ.indicatorColorName(id, ph);
        self.hist.colors[id] = self.hist.colors[id] || {};
        self.hist.colors[id][name] = true;
      });
    }
    this.cache = m;
    return m;
  };

  // --- Ecuaciones legibles ---

  function dominant(sim, list, exclude) {
    var best = null;
    var bestV = 0;
    list.forEach(function (k) {
      if (exclude && exclude.indexOf(k) >= 0) return;
      var v = sim.get(k) * Math.abs(SP[k].z);
      if (v > bestV) { best = k; bestV = v; }
    });
    return best;
  }

  function show(k) {
    var sp = SP[k];
    if (!sp) return k;
    if (sp.ph === "s") return sp.f + "(s)";
    if (sp.ph === "g") return sp.f + "(g)";
    if (k === "O2(aire)") return "O₂(g)";
    return sp.f;
  }

  function coefStr(x) {
    var r = Math.round(x * 2) / 2;
    if (Math.abs(r - x) < 1e-6) {
      if (r === 1) return "";
      if (r === 0.5) return "½ ";
      if (r % 1) return Math.floor(r) + "½ ";
      return r + " ";
    }
    return (Math.round(x * 100) / 100) + " ";
  }

  function ionicEq(r, p) {
    var keys = Object.keys(r).concat(Object.keys(p));
    var all = keys.map(function (k) { return r[k] || p[k]; });
    var mult = 1;
    for (var m = 1; m <= 6; m++) {
      if (all.every(function (v) { return Math.abs(v * m - Math.round(v * m)) < 1e-6; })) { mult = m; break; }
    }
    function side(obj) {
      return Object.keys(obj).map(function (k) { return coefStr(obj[k] * mult) + show(k); }).join(" + ");
    }
    return side(r) + " → " + side(p);
  }

  function balanced(left, right) {
    if (left.some(function (x) { return !x; }) || right.some(function (x) { return !x; })) return "";
    try {
      return F.format(F.balance(left.join(" + ") + " -> " + right.join(" + ")));
    } catch (e) {
      return "";
    }
  }

  var salt = AQ.saltFormula;

  Sim.prototype.molecular = function (id, ctx) {
    var parts = id.split(":");
    var kind = parts[0];
    var anion = dominant(this, ANIONS);
    var base = dominant(this, BASE_CATIONS);
    var acid = anion ? salt("H+", anion) : null;
    if (kind === "neutral") return balanced([acid, salt(base, "OH-")], [salt(base, anion), "H2O"]);
    if (kind === "acetic-oh") return balanced(["CH3COOH", salt(base, "OH-")], [salt(base, "CH3COO-"), "H2O"]);
    if (kind === "nh4-oh") return balanced([salt("NH4+", dominant(this, ANIONS, ["CH3COO-"])), salt(base, "OH-")], [salt(base, dominant(this, ANIONS, ["CH3COO-"])), "NH3", "H2O"]);
    if (kind === "h-nh3") return balanced(["NH3", acid], [salt("NH4+", anion)]);
    if (kind === "h-hco3" || kind === "h-co3") {
      var cat = dominant(this, ["Na+", "K+"]) || "Na+";
      if (kind === "h-co3") return balanced([salt(cat, "CO3 2-"), acid], [salt(cat, "HCO3-"), salt(cat, anion)]);
      return balanced([salt(cat, "HCO3-"), acid], [salt(cat, anion), "H2O", "CO2"]);
    }
    if (kind === "acetic-hco3") {
      var cat2 = dominant(this, ["Na+", "K+"]) || "Na+";
      return balanced(["CH3COOH", salt(cat2, "HCO3-")], [salt(cat2, "CH3COO-"), "H2O", "CO2"]);
    }
    if (kind === "co2-2oh") {
      var b2 = dominant(this, BASE_CATIONS) || "Na+";
      return balanced(["CO2", salt(b2, "OH-")], [salt(b2, "CO3 2-"), "H2O"]);
    }
    if (kind === "vitc-i2") return balanced(["C6H8O6", "I2"], ["C6H6O6", "HI"]);
    if (kind === "ppt" || kind === "cryst") {
      var c = ctx.compound;
      var X = cationOf(c);
      var Y = anionOf(c);
      var pA = dominant(this, ANIONS, [Y]);
      var pC = dominant(this, ["H+"].concat(CATIONS), [X]);
      if (!pA || !pC) return "";
      var products = [c.fm, salt(pC, pA)];
      if (c.w < 0) products.push("H2O");
      return balanced([salt(X, pA), salt(pC, Y)], products);
    }
    if (kind === "acid-dissolve") {
      var cc = ctx.rule.compound;
      return balanced([cc.fm, acid], [salt(cationOf(cc), anion), "H2O"]);
    }
    if (kind === "metal-acid") {
      var m = METALS[parts[1]];
      if (ctx.weak) return balanced([m.sym, "CH3COOH"], [salt(m.ion, "CH3COO-"), "H2"]);
      return balanced([m.sym, acid], [salt(m.ion, anion), "H2"]);
    }
    if (kind === "metal-water") {
      var mw = METALS[parts[1]];
      return balanced([mw.sym, "H2O"], [salt(mw.ion, "OH-"), "H2"]);
    }
    if (kind === "metal-base") {
      var mb = METALS[parts[1]];
      var bc = dominant(this, ["Na+", "K+"]) || "Na+";
      return balanced([mb.sym, salt(bc, "OH-"), "H2O"], [salt(bc, mb.complex), "H2"]);
    }
    if (kind === "displ") {
      var md = METALS[parts[1]];
      var ox = ctx.oxidant;
      var an = dominant(this, ANIONS) || "SO4 2-";
      var prod = SP[ox.product].ph === "s" ? ox.metal : salt(ox.product, an);
      return balanced([md.sym, salt(ox.ion, an)], [salt(md.ion, an), prod]);
    }
    if (kind === "carb-acid") {
      var ck = ctx.compound;
      if (ctx.weak) return balanced([ck.fm, "CH3COOH"], [salt(cationOf(ck), "CH3COO-"), "H2O", "CO2"]);
      return balanced([ck.fm, acid], [salt(cationOf(ck), anion), "H2O", "CO2"]);
    }
    if (kind === "h2o2") return "2 H₂O₂ → 2 H₂O + O₂";
    if (kind === "rust") return "4 Fe + 3 O₂ + 6 H₂O → 4 Fe(OH)₃";
    if (kind === "caco3-co2") return "CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂";
    return "";
  };

  function cname(k) { return SP[k] ? SP[k].name : k; }

  function infoFor(id, ctx, sim) {
    var parts = id.split(":");
    var kind = parts[0];
    if (INFO[id]) return { title: INFO[id][0], type: INFO[id][1], why: INFO[id][2] };
    if (kind === "acid-dissolve") return { title: "El ácido disuelve el " + ctx.rule.compound.name, type: "Ácido-base", why: "Los H⁺ neutralizan los OH⁻ del hidróxido y el sólido desaparece." };
    if (kind === "ppt") {
      var c = ctx.compound;
      return { title: "Precipitado: " + c.name, type: "Precipitación (doble desplazamiento)", why: "Los iones " + Object.keys(c.ions).map(function (k) { return SP[k].f; }).join(" y ") + " se encuentran y forman " + c.f + ", muy poco soluble (Ksp ≈ " + c.ksp.toExponential(1).replace("e", "·10^") + "). Aparece como un sólido que enturbia y luego se posa." };
    }
    if (kind === "cryst") return { title: "Disolución saturada: cristaliza " + ctx.compound.name, type: "Cambio físico", why: "Ya no cabe más soluto en esa cantidad de agua: el exceso vuelve a ser sólido." };
    if (kind === "dissolve") {
      var d = ctx.compound;
      var heat = d.dH > 8 ? " Absorbe calor del agua: el vaso se enfría (proceso endotérmico)." : d.dH < -8 ? " Libera calor: el vaso se calienta (proceso exotérmico)." : "";
      var ionic = Object.keys(d.ions).length > 1 || SP[Object.keys(d.ions)[0]].z;
      return { title: "Se disuelve: " + d.name, type: "Disolución (cambio físico)", why: (ionic ? "El sólido se separa en sus iones, rodeados de moléculas de agua." : "Las moléculas se reparten entre las de agua sin romperse.") + " No aparece una sustancia nueva: si evaporas el agua, lo recuperas." + heat };
    }
    if (kind === "metal-acid") {
      var m = AQ.elementBySymbol(parts[1]);
      return { title: m.name + " reacciona con el ácido", type: "Desplazamiento simple (redox)", why: m.name + " está por encima del hidrógeno en la serie de actividad: cede electrones a los H⁺, que se convierten en burbujas de H₂. El metal pasa a la disolución como ion." + (ctx.weak ? " Con un ácido débil va más despacio porque hay pocos H⁺ libres." : "") };
    }
    if (kind === "metal-water") {
      var mw = AQ.elementBySymbol(parts[1]);
      return { title: mw.name + " reacciona con el agua", type: "Redox", why: "Es tan activo que arranca el hidrógeno del agua. Se forma un hidróxido (la disolución queda básica) y gas H₂. Desprende mucho calor." };
    }
    if (kind === "metal-base") {
      var mb = AQ.elementBySymbol(parts[1]);
      return { title: mb.name + " reacciona con la base", type: "Redox (metal anfótero)", why: mb.name + " es anfótero: también lo atacan las bases fuertes. Se forma un ion complejo soluble y se desprende H₂." };
    }
    if (kind === "displ") {
      var md = AQ.elementBySymbol(parts[1]);
      var ox = ctx.oxidant;
      if (!ox.metal) return { title: md.name + " reduce el hierro(III)", type: "Redox", why: "El Fe³⁺ es oxidante: le quita electrones a " + md.name.toLowerCase() + " y pasa a Fe²⁺. Así se graban los circuitos de cobre." };
      var mn = AQ.elementBySymbol(ox.metal);
      return { title: md.name + " desplaza a " + mn.name.toLowerCase(), type: "Desplazamiento simple (redox)", why: md.name + " es más activo que " + mn.name.toLowerCase() + " (E° " + METALS[parts[1]].E.toFixed(2) + " V frente a " + ox.E.toFixed(2) + " V): le cede electrones. " + mn.name + " se deposita como metal y " + md.name.toLowerCase() + " pasa a la disolución." };
    }
    if (kind === "carb-acid") return { title: "El carbonato burbujea con el ácido", type: "Ácido-base con gas", why: "Los carbonatos reaccionan con los ácidos y desprenden CO₂. Así se reconoce la caliza o el mármol." };
    if (kind === "h2o2") {
      var cat = ctx.catalyst;
      var names = { none: "ninguno", "MnO2(s)": "el dióxido de manganeso", "papa(s)": "la catalasa de la papa", "I-": "el ion yoduro", "Fe3+": "el ion hierro(III)", "OH-": "el medio básico" };
      if (cat === "none") return { title: "El agua oxigenada se descompone muy despacio", type: "Descomposición", why: "Sin catalizador tardaría semanas." };
      return { title: "Descomposición catalizada del agua oxigenada", type: "Descomposición", why: "El catalizador (" + names[cat] + ") acelera la reacción sin gastarse. Se forma agua y oxígeno, y libera calor." };
    }
    if (kind === "iodide-h2o2") return { title: "El yoduro se oxida a yodo", type: "Redox", why: "El agua oxigenada oxida el I⁻ incoloro a I₂ pardo. Con ácido va mucho más rápido. Si hay almidón, se vuelve azul oscuro." };
    if (kind === "rust") return { title: "El hierro se oxida: herrumbre", type: "Oxidación", why: "Hace falta hierro, agua y oxígeno del aire. La sal la acelera. El sólido gana masa porque toma oxígeno del aire." };
    if (kind === "caco3-co2") return { title: "El exceso de CO₂ redisuelve el carbonato", type: "Ácido-base", why: "Se forma hidrogenocarbonato de calcio, que sí es soluble: la turbidez desaparece. Así se forman las cuevas en la caliza." };
    return { title: id, type: "Reacción", why: "" };
  }

  Sim.prototype.logReaction = function (id, r, p, x, ctx) {
    var e = this.logIndex[id];
    if (!e) {
      var info = infoFor(id, ctx || {}, this);
      var ionic = ionicEq(r, p);
      if (id.indexOf("dissolve:") === 0) ionic = ionic.replace(/→ (.*)$/, function (_, rest) { return "→ " + rest.split(" + ").map(function (t) { return t + "(aq)"; }).join(" + "); });
      e = { id: id, title: info.title, type: info.type, why: info.why, ionic: ionic, molecular: "", extent: 0, t0: this.time, last: this.time, products: {} };
      try { e.molecular = this.molecular(id, ctx || {}); } catch (err) { e.molecular = ""; }
      if (e.molecular && e.molecular.replace(/\s/g, "") === ionic.replace(/\s/g, "")) e.molecular = "";
      this.logIndex[id] = e;
      this.log.push(e);
    }
    e.extent += x;
    e.last = this.time;
    Object.keys(p).forEach(function (k) {
      if (k === "H2O(l)") return;
      e.products[k] = (e.products[k] || 0) + p[k] * x;
    });
  };

  // --- Pruebas manuales ---

  Sim.prototype.test = function (kind) {
    var self = this;
    var g = {};
    GASES.forEach(function (k) { g[k] = self.recent[k] || 0; });
    var strongest = null;
    var amount = 0;
    Object.keys(g).forEach(function (k) { if (g[k] > amount) { amount = g[k]; strongest = k; } });
    if (amount < 3e-5) strongest = null;
    var out;
    if (kind === "astilla") {
      if (this.balloon) out = { title: "Hay un globo puesto", text: "El gas está atrapado en el globo. Quítalo y acerca la astilla enseguida." };
      else if (strongest === "H2(g)") out = { title: "¡Pop!", text: "Se oye una pequeña explosión: el gas es hidrógeno. Arde con el oxígeno del aire: 2H₂ + O₂ → 2H₂O.", gas: "H2", good: true };
      else if (strongest === "CO2(g)") out = { title: "La llama se apaga", text: "El gas es dióxido de carbono: no arde ni deja arder. Por eso se usa en extintores.", gas: "CO2", good: true };
      else if (strongest === "O2(g)") out = { title: "La llama se aviva", text: "Arde con más fuerza y más brillo: sale oxígeno, que es comburente.", gas: "O2", good: true };
      else if (this.c("C2H5OH") > 4) out = { title: "Prende el vapor", text: "Una llama azulada pálida recorre la superficie: el etanol es inflamable. Apágalo tapando el vaso." };
      else out = { title: "Sigue igual", text: "La astilla arde como antes: no sale ningún gas que se note." };
    } else if (kind === "brasa") {
      if (this.balloon) out = { title: "Hay un globo puesto", text: "Quita el globo primero." };
      else if (strongest === "O2(g)") out = { title: "¡La brasa se reaviva!", text: "Vuelve a prender con llama: es la prueba del oxígeno.", gas: "O2", good: true };
      else if (strongest === "H2(g)") out = { title: "Pequeño pop", text: "La brasa basta para encender el hidrógeno.", gas: "H2", good: true };
      else if (strongest === "CO2(g)") out = { title: "Se apaga del todo", text: "El dióxido de carbono no deja arder.", gas: "CO2", good: true };
      else out = { title: "Se va apagando", text: "La brasa se enfría poco a poco: no hay oxígeno extra." };
    } else if (kind === "papel") {
      var ph = this.pH();
      if (ph == null) out = { title: "El papel sigue seco", text: "No hay líquido que mojar el papel." };
      else {
        var c = AQ.indicatorAt("universal", ph).rgb;
        var name = AQ.indicatorColorName("universal", ph);
        var r = Math.round(Math.min(14, Math.max(0, ph)));
        out = { title: "Papel indicador: " + name, text: "Comparando con la escala de colores, pH ≈ " + r + ". " + (r < 7 ? "Es ácido." : r > 7 ? "Es básico." : "Es neutro."), color: "rgb(" + c.join(",") + ")", good: true };
      }
    } else if (kind === "oler") {
      var notes = [];
      if (this.c("NH3") > 0.01) notes.push("olor fuerte y picante a amoníaco");
      if (this.c("CH3COOH") > 0.05) notes.push("olor a vinagre");
      if (this.c("C2H5OH") > 0.3) notes.push("olor a alcohol");
      if (this.c("I2") > 0.002 || this.get("I2(s)") > 0) notes.push("olor suave a yodo");
      out = { title: notes.length ? "Huele" : "Sin olor especial", text: "Abanicas el vapor hacia ti con la mano, sin acercar la nariz: " + (notes.length ? notes.join(", ") + "." : "no notas nada en especial.") };
    }
    out.kind = kind;
    this.hist.tests.push({ kind: kind, gas: out.gas || null, time: this.time });
    return out;
  };

  // --- Lo que se ve ---

  function colorWord(rgb, strength) {
    if (strength < 0.08) return null;
    var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var l = (max + min) / 2;
    var d = max - min;
    if (d < 0.08) return l < 0.25 ? "casi negro" : l < 0.6 ? "grisáceo" : null;
    var h;
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
    var dark = l < 0.22;
    var word;
    if (h < 15 || h >= 345) word = "rojo";
    else if (h < 40) word = l < 0.45 ? "marrón" : "naranja";
    else if (h < 65) word = l < 0.4 ? "pardo" : "amarillo";
    else if (h < 160) word = "verde";
    else if (h < 195) word = "verde azulado";
    else if (h < 255) word = "azul";
    else if (h < 290) word = "violeta";
    else word = "rosa";
    if (dark && word === "azul") word = "azul muy oscuro";
    var soft = strength < 0.3 ? " pálido" : "";
    return word + soft;
  }
  AQ.colorWord = colorWord;

  Sim.prototype.describe = function () {
    var m = this.measure();
    var out = [];
    var self = this;
    var liquid = this.hasLiquid();
    var solids = Object.keys(this.n).filter(function (k) { return SP[k].ph === "s" && self.massOf(k) > 1e-3; });
    if (!liquid && !this.oil) {
      if (!solids.length) return ["El vaso está vacío. Elige algo de la estantería y échalo."];
      out.push("Solo hay sólidos secos en el vaso. Sin un líquido que los disuelva, casi nunca reaccionan entre sí.");
    }
    if (!liquid && this.oil) out.push("Solo hay aceite: sin agua no se forman iones y casi nada reacciona.");

    Object.keys(METALS).forEach(function (sym) {
      var m2 = METALS[sym];
      if (!self.get(m2.key)) return;
      var rate = self.metalRate[sym] || 0;
      var gasRate = self.metalGas[sym] || 0;
      var name = AQ.elementBySymbol(sym).name.toLowerCase();
      if (m2.floats && liquid && rate > 2e-5) {
        out.push("El " + name + " flota, se funde en una bolita brillante y corre por la superficie silbando." + (sym === "K" ? " El hidrógeno arde con llama lila." : sym === "Na" && rate > 2e-4 ? " A ratos se enciende con llama amarilla." : ""));
      } else if (gasRate > 5e-6) out.push("El " + name + " se está consumiendo: salen muchas burbujas de su superficie.");
      else if (gasRate > 3e-7) out.push("Del " + name + " salen burbujitas poco a poco.");
      else if (rate > 3e-7) out.push("El " + name + " se va disolviendo poco a poco en el líquido.");
    });
    Object.keys(this.deposit).forEach(function (k) {
      var d = self.deposit[k];
      if (d.n < 3e-6) return;
      var host = SP[d.host] ? SP[d.host].name : "metal";
      var still = self.get(d.host) > 0;
      if (k === "Fe(OH)3(s)") out.push("Aparecen manchas de herrumbre anaranjada sobre el clavo.");
      else if (k === "Cu(s)") out.push(still ? "El " + host + " se cubre de una capa rojiza de cobre." : "Queda un polvo rojizo de cobre en el fondo.");
      else if (k === "Ag(s)") out.push(still ? "Sobre el " + host + " crecen cristales grises brillantes de plata." : "Queda plata gris en el fondo.");
      else out.push("Sobre el " + host + " se deposita " + SP[k].name + ".");
    });

    var total = 0;
    GASES.forEach(function (g) { total += m.gasRate[g] || 0; });
    if (total > 2e-4) out.push("Burbujeo muy intenso" + (this.c("jabon") > 0.002 ? ": la espuma sube y se desborda." : "."));
    else if (total > 2e-5) out.push("Se desprenden muchas burbujas de gas.");
    else if (total > 1e-6) out.push("Se ven algunas burbujas.");

    if (liquid) {
      var word = colorWord(m.color.rgb, m.color.strength);
      out.push(word ? "El líquido es de color " + word + "." : "El líquido es incoloro.");
      if (m.turbidity.alpha > 0.5) out.push("Está turbio: hay un sólido en suspensión (" + m.turbidity.items.map(function (k) { return SP[k].f; }).join(", ") + ").");
      else if (m.turbidity.alpha > 0.12) out.push("Se nota algo turbio.");
    }
    var settled = solids.filter(function (k) {
      var c = COMPOUND_BY_KEY[k];
      return c && c.ppt && self.hist.ppt[k] && (self.susp[k] || 0) < 0.5 && self.get(k) > 2e-6;
    });
    if (settled.length) out.push("En el fondo se ha posado un sólido: " + settled.map(function (k) { return COMPOUND_BY_KEY[k].name + " (" + COMPOUND_BY_KEY[k].f + ")"; }).join(", ") + ".");
    var undissolved = solids.filter(function (k) {
      var c = COMPOUND_BY_KEY[k];
      return c && !c.ppt;
    });
    if (undissolved.length && liquid) {
      var saturated = undissolved.filter(function (k) { return self.saturated(COMPOUND_BY_KEY[k]); });
      if (saturated.length) out.push("Queda " + saturated.map(function (k) { return COMPOUND_BY_KEY[k].name; }).join(" y ") + " sin disolver: la disolución está saturada.");
      else out.push("Se está disolviendo: " + undissolved.map(function (k) { return COMPOUND_BY_KEY[k].name; }).join(", ") + ".");
    }
    if (this.oil > 0 && liquid) out.push("El aceite flota formando una capa aparte: no se mezcla con el agua.");
    if (this.get("S(s)") && liquid) out.push("El azufre no se moja: queda flotando.");

    if (m.dTdt > 0.04) out.push("El vaso se está calentando.");
    else if (m.dTdt < -0.04) out.push("El vaso se está enfriando.");
    if (m.T > 45) out.push("Está muy caliente al tacto (" + m.T.toFixed(0) + " °C).");
    else if (m.T < 12) out.push("Está muy frío; por fuera se empaña (" + m.T.toFixed(0) + " °C).");
    if (m.T >= 99.5 && liquid) out.push("¡Hierve! Sale vapor.");
    if (this.balloon) out.push(m.balloon > 0.02 ? "El globo se está inflando (" + (m.balloon * 1000).toFixed(0) + " mL de gas)." : "El globo está puesto, todavía desinflado.");
    if (!out.length) out.push("No se observa ningún cambio.");
    return out;
  };

  Sim.prototype.visibleLog = function () {
    return this.log.filter(function (e) { return e.extent > 3e-7; });
  };

  Sim.prototype.saturated = function (c) {
    if (!this.get(c.key)) return false;
    var V = this.volumeL();
    return gOf(this, c, 0, V, Math.log(this.kspOf(c))) > -0.02;
  };

  Sim.prototype.contents = function () {
    var V = this.volumeL();
    var self = this;
    var list = Object.keys(this.n).map(function (k) {
      var sp = SP[k];
      return { key: k, f: sp.f, name: sp.name, ph: sp.ph, mol: self.n[k], g: self.n[k] * sp.M, conc: sp.ph === "aq" && V > 0 ? self.n[k] / V : null };
    });
    list.sort(function (a, b) { return b.g - a.g; });
    return list;
  };

  AQ.Sim = Sim;
  AQ.Engine = {
    INSTANT: INSTANT,
    OXIDANTS: OXIDANTS,
    ionicEq: ionicEq,
    CAPACITY: CAPACITY,
    GAS_L_PER_MOL: GAS_L_PER_MOL
  };
})(typeof window !== "undefined" ? window : globalThis);
