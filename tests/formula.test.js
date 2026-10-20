const test = require("node:test");
const assert = require("node:assert");
const AQ = require("./load");
const F = AQ.Formula;

test("masa molar con paréntesis e hidratos", () => {
  assert.ok(Math.abs(F.molarMass("H2O") - 18.015) < 0.01);
  assert.ok(Math.abs(F.molarMass("Ca(OH)2") - 74.09) < 0.01);
  assert.ok(Math.abs(F.molarMass("CuSO4·5H2O") - 249.68) < 0.02);
  assert.ok(Math.abs(F.molarMass("Al₂(SO₄)₃") - 342.15) < 0.02);
});

test("fórmulas inválidas dan un error claro", () => {
  assert.throws(() => F.parse("Xx2"), F.Error);
  assert.throws(() => F.parse("Ca(OH2"), F.Error);
});

test("balancea ecuaciones típicas", () => {
  const cases = {
    "H2 + O2 -> H2O": "2 H₂ + O₂ → 2 H₂O",
    "Fe + O2 -> Fe2O3": "4 Fe + 3 O₂ → 2 Fe₂O₃",
    "C3H8 + O2 -> CO2 + H2O": "C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O",
    "Al + H2SO4 -> Al2(SO4)3 + H2": "2 Al + 3 H₂SO₄ → Al₂(SO₄)₃ + 3 H₂",
    "KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O": "2 KMnO₄ + 16 HCl → 2 KCl + 2 MnCl₂ + 5 Cl₂ + 8 H₂O"
  };
  for (const [eq, expected] of Object.entries(cases)) assert.strictEqual(F.format(F.balance(eq)), expected);
});

test("detecta ecuaciones imposibles", () => {
  assert.throws(() => F.balance("H2 -> O2"), F.Error);
});

test("configuraciones electrónicas con excepciones", () => {
  assert.strictEqual(AQ.elementBySymbol("Cr").config, "[Ar] 4s¹ 3d⁵");
  assert.strictEqual(AQ.elementBySymbol("Cu").config, "[Ar] 4s¹ 3d¹⁰");
  assert.strictEqual(AQ.elementBySymbol("Fe").config, "[Ar] 4s² 3d⁶");
  assert.deepStrictEqual(AQ.elementBySymbol("Na").shells, [2, 8, 1]);
  assert.strictEqual(AQ.ELEMENTS.length, 118);
});

test("posiciones en la tabla", () => {
  const pos = (s) => { const e = AQ.elementBySymbol(s); return [e.group, e.period]; };
  assert.deepStrictEqual(pos("He"), [18, 1]);
  assert.deepStrictEqual(pos("Al"), [13, 3]);
  assert.deepStrictEqual(pos("Hf"), [4, 6]);
  assert.deepStrictEqual(pos("Og"), [18, 7]);
  assert.strictEqual(AQ.elementBySymbol("La").fRow, 1);
});

test("fórmulas de sales a partir de iones", () => {
  assert.strictEqual(AQ.saltFormula("Al3+", "SO4 2-"), "Al2(SO4)3");
  assert.strictEqual(AQ.saltFormula("Ca2+", "OH-"), "Ca(OH)2");
  assert.strictEqual(AQ.saltFormula("Na+", "CH3COO-"), "CH3COONa");
  assert.strictEqual(AQ.saltFormula("H+", "Cl-"), "HCl");
});
