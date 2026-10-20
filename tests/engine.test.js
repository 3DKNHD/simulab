const test = require("node:test");
const assert = require("node:assert");
const AQ = require("./load");
const SP = AQ.SPECIES;

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, (msg || "") + ` esperado ${b} ± ${tol}, salió ${a}`);

function atoms(side) {
  const out = { charge: 0 };
  for (const [k, n] of Object.entries(side)) {
    const counts = AQ.Formula.parse(SP[k].fm);
    for (const [el, c] of Object.entries(counts)) out[el] = (out[el] || 0) + c * n;
    out.charge += (SP[k].z || 0) * n;
  }
  return out;
}

test("todas las reacciones instantáneas conservan átomos y carga", () => {
  for (const rule of AQ.Engine.INSTANT) {
    const a = atoms(rule.r);
    const b = atoms(rule.p);
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      near(a[k] || 0, b[k] || 0, 1e-9, `${rule.id} (${k})`);
    }
  }
});

test("los compuestos se disuelven en iones con la misma masa", () => {
  for (const c of AQ.COMPOUNDS) {
    let ions = 0;
    for (const [k, n] of Object.entries(c.ions)) ions += SP[k].M * n;
    ions += (c.w || 0) * SP["H2O(l)"].M;
    near(ions, SP[c.key].M, 0.05, c.key);
  }
});

function sim() { return new AQ.Sim(); }

function lavoisier(s, run) {
  const before = s.totalMass();
  run();
  const m = s.measure();
  near(m.mass + m.escapedMass - m.airIn, before, 1e-6, "Lavoisier");
}

test("pH de ácidos, bases y sales", () => {
  let s = sim(); s.pour("hcl", 50, 0.1); near(s.pH(), 1.0, 0.02);
  s = sim(); s.pour("naoh", 50, 0.01); near(s.pH(), 12.0, 0.05);
  s = sim(); s.pour("vinagre", 50); near(s.pH(), 2.42, 0.05);
  s = sim(); s.pour("nh3", 50, 0.1); near(s.pH(), 11.13, 0.05);
  s = sim(); s.pour("agua", 50); near(s.pH(), 7.0, 0.01);
  s = sim(); s.pour("agua", 50); s.pour("bicarbonato", 0.5); s.run(10); near(s.pH(), 8.3, 0.1);
  s = sim(); s.pour("vinagre", 25); s.pour("naoh", 10.4, 1); near(s.pH(), 4.76, 0.1, "tampón acetato");
});

test("neutralización: pH 7 y el vaso se calienta lo que dice la entalpía", () => {
  const s = sim();
  s.pour("hcl", 50, 1);
  s.pour("naoh", 50, 1);
  near(s.pH(), 7, 0.2);
  const expected = 0.05 * 55800 / s.heatCapacity();
  near(s.T - 25, expected, 0.3);
});

test("precipitados clásicos", () => {
  let s = sim(); s.pour("pbno3", 10); s.pour("ki", 25); near(s.get("PbI2(s)"), 0.001, 2e-5);
  s = sim(); s.pour("agno3", 10); s.pour("hcl", 5, 0.1); near(s.get("AgCl(s)"), 0.0005, 1e-6);
  s = sim(); s.pour("bacl2", 10); s.pour("h2so4", 5, 0.5); near(s.get("BaSO4(s)"), 0.001, 1e-6);
  s = sim(); s.pour("cuso4", 10, 0.1); s.pour("naoh", 5, 1); near(s.get("Cu(OH)2(s)"), 0.001, 1e-6);
});

test("el hidróxido de zinc se redisuelve con exceso de base", () => {
  const s = sim();
  s.pour("hcl", 25, 1);
  s.pour("zn", 0.3);
  s.run(2500);
  assert.ok(!s.get("Zn(s)"), "el zinc debe gastarse");
  s.pour("naoh", 25, 1);
  assert.ok(s.get("Zn(OH)2(s)") > 0.002);
  s.pour("naoh", 25, 2);
  assert.ok(s.get("Zn(OH)2(s)") < 1e-6);
  assert.ok(s.get("Zn(OH)4 2-") > 0.004);
});

test("serie de actividad frente al ácido", () => {
  const gas = (id) => {
    const s = sim();
    s.pour("hcl", 50, 1);
    s.pour(id, 0.5);
    s.run(60);
    return s.hist.gas["H2(g)"] || 0;
  };
  const mg = gas("mg"), zn = gas("zn"), fe = gas("fe"), cu = gas("cu");
  assert.ok(mg > zn && zn > fe && fe > cu, `Mg ${mg} > Zn ${zn} > Fe ${fe} > Cu ${cu}`);
  assert.strictEqual(cu, 0);
});

test("la herrumbre conserva la masa contando el oxígeno del aire", () => {
  const s = sim();
  s.pour("agua", 50);
  s.pour("nacl", 1);
  s.pour("fe", 2);
  lavoisier(s, () => s.run(2000));
  assert.ok(s.get("Fe(OH)3(s)") > 1e-5);
});

test("magnesio con ácido: hidrógeno, calor y masa perdida", () => {
  const s = sim();
  s.pour("hcl", 50, 1);
  s.pour("mg", 0.24);
  lavoisier(s, () => s.run(200));
  near(s.hist.gas["H2(g)"], 0.24 / 24.305, 1e-4);
  assert.ok(s.hist.maxT > 35);
  assert.ok(s.measure().escapedMass > 0.015);
});

test("desplazamientos según el potencial", () => {
  let s = sim(); s.pour("cuso4", 50, 0.5); s.pour("fe", 2); s.run(60);
  assert.ok(s.get("Cu(s)") > 1e-3 && s.get("Fe2+") > 1e-3);
  s = sim(); s.pour("agno3", 25); s.pour("cu", 1); s.run(120);
  assert.ok(s.get("Ag(s)") > 5e-4);
  s = sim(); s.pour("feso4", 25); s.pour("cu", 1); s.run(120);
  assert.ok(!s.get("Fe(s)"), "el cobre no desplaza al hierro");
});

test("el aluminio necesita cloruro para atacar al sulfato de cobre", () => {
  const s = sim();
  s.pour("cuso4", 50, 0.5);
  s.pour("al", 0.25);
  s.run(120);
  assert.ok(!s.get("Cu(s)"));
  s.pour("nacl", 3);
  s.run(120);
  assert.ok(s.get("Cu(s)") > 1e-3);
});

test("disoluciones exo y endotérmicas", () => {
  let s = sim(); s.pour("agua", 50); s.pour("nh4no3", 10); s.run(20);
  assert.ok(s.hist.minT < 15, "el nitrato de amonio enfría");
  s = sim(); s.pour("agua", 50); s.pour("naohs", 2); s.run(20);
  assert.ok(s.hist.maxT > 33, "la sosa calienta");
  s = sim(); s.pour("vinagre", 50); s.pour("bicarbonato", 2); s.run(20);
  assert.ok(s.hist.minT < 24, "vinagre y bicarbonato enfrían");
});

test("saturación del cloruro de sodio", () => {
  const s = sim();
  s.pour("agua", 10);
  s.pour("nacl", 5);
  s.run(30);
  near(s.massOf("NaCl(s)"), 5 - 3.6, 0.1);
});

test("volcán: la masa baja porque el CO₂ escapa, y no baja con globo", () => {
  let s = sim();
  s.pour("vinagre", 50);
  s.pour("bicarbonato", 2);
  lavoisier(s, () => s.run(30));
  assert.ok(s.measure().escapedMass > 0.8);
  s = sim();
  s.pour("vinagre", 50);
  s.toggleBalloon();
  const m0 = s.totalMass() + 2;
  s.pour("bicarbonato", 2);
  s.run(30);
  near(s.totalMass(), m0, 1e-6);
  assert.ok(s.balloonLiters() > 0.4);
});

test("agua de cal: se enturbia con CO₂ y se aclara con mucho", () => {
  const s = sim();
  s.pour("cal", 25);
  s.pour("soplar", 3);
  assert.ok(s.get("CaCO3(s)") > 3e-4);
  s.pour("soplar", 15);
  s.run(200);
  assert.ok(s.get("CaCO3(s)") < 3e-4);
});

test("agua oxigenada: catalizadores", () => {
  const o2 = (id, g) => {
    const s = sim();
    s.pour("h2o2", 25, 3);
    if (id) s.pour(id, g);
    s.run(20);
    return s.hist.gas["O2(g)"] || 0;
  };
  const none = o2(null), mn = o2("mno2", 0.5), papa = o2("papa", 2);
  assert.ok(mn > papa && papa > none * 100, `MnO2 ${mn} > papa ${papa} > nada ${none}`);
  const s = sim(); s.pour("h2o2", 25, 3); s.pour("mno2", 0.5); s.run(20);
  near(s.get("MnO2(s)") * SP["MnO2(s)"].M, 0.5, 1e-9, "el catalizador no se gasta");
  assert.ok(s.test("brasa").gas === "O2");
});

test("sodio en agua con fenolftaleína", () => {
  const s = sim();
  s.pour("agua", 50);
  s.pour("feno", 3);
  s.pour("na", 0.05);
  s.run(30);
  assert.ok(s.pH() > 12);
  const c = s.color(s.pH());
  assert.ok(c.rgb[0] > c.rgb[1] + 40, "rosa");
});

test("almidón, yodo y vitamina C", () => {
  const s = sim();
  s.pour("agua", 50);
  s.pour("almidon", 0.5);
  s.run(5);
  s.pour("lugol", 0.5);
  let c = s.color(s.pH());
  assert.ok(c.rgb[2] > c.rgb[0] && c.strength > 0.5, "azul oscuro");
  s.pour("vitc", 0.5);
  s.run(10);
  c = s.color(s.pH());
  assert.ok(c.strength < 0.05, "se decolora");
});

test("pruebas de gases", () => {
  const s = sim();
  s.pour("hcl", 50, 1);
  s.pour("mg", 0.1);
  s.run(3);
  assert.strictEqual(s.test("astilla").gas, "H2");
  const v = sim();
  v.pour("vinagre", 50);
  v.pour("bicarbonato", 2);
  v.run(4);
  assert.strictEqual(v.test("astilla").gas, "CO2");
});

test("deshacer devuelve el estado anterior", () => {
  const s = sim();
  s.pour("hcl", 25, 1);
  s.pour("naoh", 25, 1);
  s.undoLast();
  near(s.pH(), 0, 0.05);
  assert.ok(!s.get("Na+"));
});

test("las reacciones de traza no aparecen en el registro", () => {
  const s = sim();
  s.pour("hcl", 50, 1);
  s.pour("marmol", 2);
  s.run(60);
  const ids = s.visibleLog().map((e) => e.id);
  assert.deepStrictEqual(ids.filter((i) => i.startsWith("h-co3")), []);
});
