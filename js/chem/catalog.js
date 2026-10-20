(function (root) {
  var AQ = root.AQ = root.AQ || {};

  // f: fórmula visible, fm: fórmula para la masa molar, z: carga, ph: fase.
  // col: [color, concentración mol/L a la que se ve ese color].
  var SP = {
    "H2O(l)": { f: "H₂O", fm: "H2O", ph: "l", name: "agua" },
    "H+": { f: "H⁺", fm: "H", z: 1, name: "ion hidrógeno" },
    "OH-": { f: "OH⁻", fm: "OH", z: -1, name: "ion hidróxido" },
    "Na+": { f: "Na⁺", fm: "Na", z: 1, name: "ion sodio" },
    "K+": { f: "K⁺", fm: "K", z: 1, name: "ion potasio" },
    "Li+": { f: "Li⁺", fm: "Li", z: 1, name: "ion litio" },
    "NH4+": { f: "NH₄⁺", fm: "NH4", z: 1, name: "ion amonio" },
    "Ca2+": { f: "Ca²⁺", fm: "Ca", z: 2, name: "ion calcio" },
    "Mg2+": { f: "Mg²⁺", fm: "Mg", z: 2, name: "ion magnesio" },
    "Ba2+": { f: "Ba²⁺", fm: "Ba", z: 2, name: "ion bario" },
    "Cu2+": { f: "Cu²⁺", fm: "Cu", z: 2, name: "ion cobre(II)", col: ["#3d8fe0", 0.25] },
    "Zn2+": { f: "Zn²⁺", fm: "Zn", z: 2, name: "ion zinc" },
    "Fe2+": { f: "Fe²⁺", fm: "Fe", z: 2, name: "ion hierro(II)", col: ["#b9dca0", 0.2] },
    "Fe3+": { f: "Fe³⁺", fm: "Fe", z: 3, name: "ion hierro(III)", col: ["#d99a2b", 0.08] },
    "Al3+": { f: "Al³⁺", fm: "Al", z: 3, name: "ion aluminio" },
    "Ag+": { f: "Ag⁺", fm: "Ag", z: 1, name: "ion plata" },
    "Pb2+": { f: "Pb²⁺", fm: "Pb", z: 2, name: "ion plomo(II)" },
    "Ni2+": { f: "Ni²⁺", fm: "Ni", z: 2, name: "ion níquel(II)", col: ["#6cc28c", 0.25] },
    "Sn2+": { f: "Sn²⁺", fm: "Sn", z: 2, name: "ion estaño(II)" },
    "Mn2+": { f: "Mn²⁺", fm: "Mn", z: 2, name: "ion manganeso(II)", col: ["#f4e2e8", 0.5] },
    "Cl-": { f: "Cl⁻", fm: "Cl", z: -1, name: "ion cloruro" },
    "I-": { f: "I⁻", fm: "I", z: -1, name: "ion yoduro" },
    "NO3-": { f: "NO₃⁻", fm: "NO3", z: -1, name: "ion nitrato" },
    "SO4 2-": { f: "SO₄²⁻", fm: "SO4", z: -2, name: "ion sulfato" },
    "CO3 2-": { f: "CO₃²⁻", fm: "CO3", z: -2, name: "ion carbonato" },
    "HCO3-": { f: "HCO₃⁻", fm: "HCO3", z: -1, name: "ion hidrogenocarbonato" },
    "CH3COO-": { f: "CH₃COO⁻", fm: "CH3COO", z: -1, name: "ion acetato" },
    "MnO4-": { f: "MnO₄⁻", fm: "MnO4", z: -1, name: "ion permanganato", col: ["#8b1e8f", 0.0015] },
    "Zn(OH)4 2-": { f: "[Zn(OH)₄]²⁻", fm: "Zn(OH)4", z: -2, name: "ion tetrahidroxozincato" },
    "Al(OH)4-": { f: "[Al(OH)₄]⁻", fm: "Al(OH)4", z: -1, name: "ion tetrahidroxoaluminato" },
    "Cu(NH3)4 2+": { f: "[Cu(NH₃)₄]²⁺", fm: "Cu(NH3)4", z: 2, name: "ion tetraamincobre(II)", col: ["#2a3fc0", 0.04] },
    "CH3COOH": { f: "CH₃COOH", fm: "CH3COOH", name: "ácido acético" },
    "NH3": { f: "NH₃", fm: "NH3", name: "amoníaco" },
    "CO2(aq)": { f: "CO₂(aq)", fm: "CO2", name: "dióxido de carbono disuelto" },
    "H2O2": { f: "H₂O₂", fm: "H2O2", name: "peróxido de hidrógeno" },
    "I2": { f: "I₂", fm: "I2", name: "yodo disuelto", col: ["#9a4f12", 0.004] },
    "C6H8O6": { f: "C₆H₈O₆", fm: "C6H8O6", name: "ácido ascórbico (vitamina C)" },
    "C6H6O6": { f: "C₆H₆O₆", fm: "C6H6O6", name: "ácido deshidroascórbico" },
    "sacarosa": { f: "C₁₂H₂₂O₁₁", fm: "C12H22O11", name: "sacarosa (azúcar)" },
    "almidon": { f: "(C₆H₁₀O₅)ₙ", fm: "C6H10O5", name: "almidón en suspensión" },
    "C2H5OH": { f: "C₂H₅OH", fm: "C2H5OH", name: "etanol" },
    "jabon": { f: "C₁₇H₃₅COONa", fm: "C18H35O2Na", name: "jabón" },
    "H2(g)": { f: "H₂", fm: "H2", ph: "g", name: "hidrógeno" },
    "O2(g)": { f: "O₂", fm: "O2", ph: "g", name: "oxígeno" },
    "CO2(g)": { f: "CO₂", fm: "CO2", ph: "g", name: "dióxido de carbono" },
    "H2O(g)": { f: "H₂O", fm: "H2O", ph: "g", name: "vapor de agua" },
    "O2(aire)": { f: "O₂(aire)", fm: "O2", ph: "g", name: "oxígeno del aire" }
  };

  // Sólidos con equilibrio de solubilidad. sol: g por 100 mL a 25 °C; ksp: producto de solubilidad.
  // w: moles de agua que libera al disolverse (hidratos) o que consume (negativo).
  // dH: kJ/mol de disolución. settle: segundos que tarda en posarse.
  var COMPOUNDS = [
    { key: "NaCl(s)", f: "NaCl", name: "cloruro de sodio", ions: { "Na+": 1, "Cl-": 1 }, sol: 36.0, dH: 3.9, color: "#f6f6f2" },
    { key: "NaOH(s)", f: "NaOH", name: "hidróxido de sodio", ions: { "Na+": 1, "OH-": 1 }, sol: 111, dH: -44.5, color: "#f4f4ef" },
    { key: "NH4NO3(s)", f: "NH₄NO₃", fm: "NH4NO3", name: "nitrato de amonio", ions: { "NH4+": 1, "NO3-": 1 }, sol: 213, dH: 25.7, color: "#f7f7f3" },
    { key: "CaCl2(s)", f: "CaCl₂", fm: "CaCl2", name: "cloruro de calcio", ions: { "Ca2+": 1, "Cl-": 2 }, sol: 81, dH: -81.3, color: "#f4f4f0" },
    { key: "NaHCO3(s)", f: "NaHCO₃", fm: "NaHCO3", name: "hidrogenocarbonato de sodio", ions: { "Na+": 1, "HCO3-": 1 }, sol: 9.6, dH: 18.0, color: "#f7f7f2" },
    { key: "Na2CO3(s)", f: "Na₂CO₃", fm: "Na2CO3", name: "carbonato de sodio", ions: { "Na+": 2, "CO3 2-": 1 }, sol: 30.7, dH: -26.7, color: "#f5f5f0" },
    { key: "CuSO4·5H2O(s)", f: "CuSO₄·5H₂O", fm: "CuSO4.5H2O", name: "sulfato de cobre(II) pentahidratado", ions: { "Cu2+": 1, "SO4 2-": 1 }, w: 5, sol: 32, dH: 11.5, color: "#2f74d8" },
    { key: "KI(s)", f: "KI", name: "yoduro de potasio", ions: { "K+": 1, "I-": 1 }, sol: 144, dH: 20.3, color: "#f6f6f1" },
    { key: "sacarosa(s)", f: "C₁₂H₂₂O₁₁", fm: "C12H22O11", name: "azúcar", ions: { sacarosa: 1 }, sol: 200, dH: 5.4, color: "#fbfaf6" },
    { key: "C6H8O6(s)", f: "C₆H₈O₆", fm: "C6H8O6", name: "vitamina C", ions: { C6H8O6: 1 }, sol: 33, dH: 5, color: "#fbf3d8" },
    { key: "almidon(s)", f: "(C₆H₁₀O₅)ₙ", fm: "C6H10O5", name: "almidón", ions: { almidon: 1 }, sol: 50, dH: 0, color: "#f8f5ec" },
    { key: "I2(s)", f: "I₂", fm: "I2", name: "yodo sólido", ions: { I2: 1 }, special: "iodine", dH: 22.6, color: "#3a2f45", tau: 25 },
    { key: "Ca(OH)2(s)", f: "Ca(OH)₂", fm: "Ca(OH)2", name: "hidróxido de calcio", ions: { "Ca2+": 1, "OH-": 2 }, ksp: 4.6e-5, dH: -16.2, color: "#f7f7f4", settle: 40, ppt: true },
    { key: "AgCl(s)", f: "AgCl", name: "cloruro de plata", ions: { "Ag+": 1, "Cl-": 1 }, ksp: 1.8e-10, dH: 65.5, color: "#f3f3ee", settle: 25, ppt: true },
    { key: "AgI(s)", f: "AgI", name: "yoduro de plata", ions: { "Ag+": 1, "I-": 1 }, ksp: 8.5e-17, dH: 112, color: "#efe1a0", settle: 30, ppt: true },
    { key: "PbI2(s)", f: "PbI₂", fm: "PbI2", name: "yoduro de plomo(II)", ions: { "Pb2+": 1, "I-": 2 }, ksp: 9.8e-9, dH: 46, color: "#f2c12e", settle: 30, ppt: true, sparkle: true },
    { key: "PbCl2(s)", f: "PbCl₂", fm: "PbCl2", name: "cloruro de plomo(II)", ions: { "Pb2+": 1, "Cl-": 2 }, ksp: 1.9e-4, dH: 23, color: "#f4f4f0", settle: 20, ppt: true },
    { key: "PbSO4(s)", f: "PbSO₄", fm: "PbSO4", name: "sulfato de plomo(II)", ions: { "Pb2+": 1, "SO4 2-": 1 }, ksp: 2.5e-8, dH: 11, color: "#f4f4f1", settle: 40, ppt: true },
    { key: "BaSO4(s)", f: "BaSO₄", fm: "BaSO4", name: "sulfato de bario", ions: { "Ba2+": 1, "SO4 2-": 1 }, ksp: 1.1e-10, dH: 26, color: "#f6f6f4", settle: 60, ppt: true },
    { key: "CaSO4(s)", f: "CaSO₄", fm: "CaSO4", name: "sulfato de calcio", ions: { "Ca2+": 1, "SO4 2-": 1 }, ksp: 2.4e-4, dH: -18, color: "#f5f5f2", settle: 30, ppt: true },
    { key: "Ag2SO4(s)", f: "Ag₂SO₄", fm: "Ag2SO4", name: "sulfato de plata", ions: { "Ag+": 2, "SO4 2-": 1 }, ksp: 7.5e-5, dH: 17, color: "#f4f4ef", settle: 30, ppt: true },
    { key: "CaCO3(s)", f: "CaCO₃", fm: "CaCO3", name: "carbonato de calcio", ions: { "Ca2+": 1, "CO3 2-": 1 }, ksp: 3.4e-9, dH: -12, color: "#f6f6f2", settle: 40, ppt: true, carbonate: true },
    { key: "BaCO3(s)", f: "BaCO₃", fm: "BaCO3", name: "carbonato de bario", ions: { "Ba2+": 1, "CO3 2-": 1 }, ksp: 2.6e-9, dH: 4, color: "#f6f6f3", settle: 40, ppt: true, carbonate: true },
    { key: "MgCO3(s)", f: "MgCO₃", fm: "MgCO3", name: "carbonato de magnesio", ions: { "Mg2+": 1, "CO3 2-": 1 }, ksp: 6.8e-6, dH: -25, color: "#f6f6f2", settle: 40, ppt: true, carbonate: true },
    { key: "CuCO3(s)", f: "CuCO₃", fm: "CuCO3", name: "carbonato de cobre(II)", ions: { "Cu2+": 1, "CO3 2-": 1 }, ksp: 1.4e-10, dH: 0, color: "#5fb3a5", settle: 40, ppt: true, carbonate: true },
    { key: "ZnCO3(s)", f: "ZnCO₃", fm: "ZnCO3", name: "carbonato de zinc", ions: { "Zn2+": 1, "CO3 2-": 1 }, ksp: 1.5e-10, dH: 0, color: "#f4f4f1", settle: 40, ppt: true, carbonate: true },
    { key: "FeCO3(s)", f: "FeCO₃", fm: "FeCO3", name: "carbonato de hierro(II)", ions: { "Fe2+": 1, "CO3 2-": 1 }, ksp: 3.1e-11, dH: 0, color: "#c9d3b0", settle: 40, ppt: true, carbonate: true },
    { key: "Ag2CO3(s)", f: "Ag₂CO₃", fm: "Ag2CO3", name: "carbonato de plata", ions: { "Ag+": 2, "CO3 2-": 1 }, ksp: 8.5e-12, dH: 0, color: "#ede4ba", settle: 30, ppt: true, carbonate: true },
    { key: "Cu(OH)2(s)", f: "Cu(OH)₂", fm: "Cu(OH)2", name: "hidróxido de cobre(II)", ions: { "Cu2+": 1, "OH-": 2 }, ksp: 2.2e-20, dH: 50, color: "#4f9de0", settle: 70, ppt: true, gel: true },
    { key: "Fe(OH)2(s)", f: "Fe(OH)₂", fm: "Fe(OH)2", name: "hidróxido de hierro(II)", ions: { "Fe2+": 1, "OH-": 2 }, ksp: 4.9e-17, dH: 40, color: "#6f8a5a", settle: 60, ppt: true, gel: true },
    { key: "Fe(OH)3(s)", f: "Fe(OH)₃", fm: "Fe(OH)3", name: "hidróxido de hierro(III)", ions: { "Fe3+": 1, "OH-": 3 }, ksp: 2.8e-39, dH: 80, color: "#a8582a", settle: 60, ppt: true, gel: true },
    { key: "Mg(OH)2(s)", f: "Mg(OH)₂", fm: "Mg(OH)2", name: "hidróxido de magnesio", ions: { "Mg2+": 1, "OH-": 2 }, ksp: 5.6e-12, dH: 2.8, color: "#f6f6f4", settle: 60, ppt: true, gel: true },
    { key: "Zn(OH)2(s)", f: "Zn(OH)₂", fm: "Zn(OH)2", name: "hidróxido de zinc", ions: { "Zn2+": 1, "OH-": 2 }, ksp: 3e-17, dH: 30, color: "#f5f6f6", settle: 60, ppt: true, gel: true },
    { key: "Al(OH)3(s)", f: "Al(OH)₃", fm: "Al(OH)3", name: "hidróxido de aluminio", ions: { "Al3+": 1, "OH-": 3 }, ksp: 1.3e-33, dH: 60, color: "#eef2f5", settle: 80, ppt: true, gel: true },
    { key: "Pb(OH)2(s)", f: "Pb(OH)₂", fm: "Pb(OH)2", name: "hidróxido de plomo(II)", ions: { "Pb2+": 1, "OH-": 2 }, ksp: 1.4e-20, dH: 30, color: "#f5f5f3", settle: 50, ppt: true },
    { key: "Ni(OH)2(s)", f: "Ni(OH)₂", fm: "Ni(OH)2", name: "hidróxido de níquel(II)", ions: { "Ni2+": 1, "OH-": 2 }, ksp: 5.5e-16, dH: 30, color: "#7fc29a", settle: 60, ppt: true, gel: true },
    { key: "Sn(OH)2(s)", f: "Sn(OH)₂", fm: "Sn(OH)2", name: "hidróxido de estaño(II)", ions: { "Sn2+": 1, "OH-": 2 }, ksp: 5e-26, dH: 30, color: "#f5f5f3", settle: 50, ppt: true },
    { key: "Mn(OH)2(s)", f: "Mn(OH)₂", fm: "Mn(OH)2", name: "hidróxido de manganeso(II)", ions: { "Mn2+": 1, "OH-": 2 }, ksp: 1.9e-13, dH: 30, color: "#e5d6bf", settle: 50, ppt: true },
    { key: "Ag2O(s)", f: "Ag₂O", fm: "Ag2O", name: "óxido de plata", ions: { "Ag+": 2, "OH-": 2 }, w: -1, ksp: 4e-16, dH: 40, color: "#4a3a2c", settle: 30, ppt: true }
  ];

  // Sólidos que no se disuelven ni se equilibran (catalizadores, inertes, metales).
  var INERT = {
    "MnO2(s)": { f: "MnO₂", fm: "MnO2", name: "dióxido de manganeso", color: "#2a2420" },
    "papa(s)": { f: "papa", fm: "C6H10O5", name: "papa rallada (catalasa)", color: "#e3cf9a" },
    "C(s)": { f: "C", fm: "C", name: "carbón", color: "#2a2a2a" },
    "S(s)": { f: "S", fm: "S", name: "azufre", color: "#e9d443", floats: true },
    "Si(s)": { f: "Si", fm: "Si", name: "silicio", color: "#8d8580" }
  };

  // E: potencial estándar de reducción (V). kAcid/kWater: constantes de velocidad del simulador.
  // dHf: entalpía de formación del ion acuoso (kJ/mol).
  var METALS = {
    Li: { ion: "Li+", z: 1, E: -3.04, kWater: 6e-4, dHf: -278.5, color: "#d9d4cc", floats: true, form: "trocito" },
    K: { ion: "K+", z: 1, E: -2.93, kWater: 8e-3, dHf: -252.4, color: "#e2ddd3", floats: true, form: "trocito", flame: "#c9a0ff" },
    Ca: { ion: "Ca2+", z: 2, E: -2.87, kWater: 2e-4, dHf: -542.8, color: "#dcd6cc", form: "granos" },
    Na: { ion: "Na+", z: 1, E: -2.71, kWater: 3e-3, dHf: -240.1, color: "#e9e4da", floats: true, form: "trocito", flame: "#ffcf3a" },
    Mg: { ion: "Mg2+", z: 2, E: -2.37, kAcid: 7e-4, kWater: 2e-7, eaWater: 75, dHf: -466.9, color: "#d6d9d4", form: "cinta" },
    Al: { ion: "Al3+", z: 3, E: -1.66, kAcid: 2.2e-4, kBase: 2.5e-4, dHf: -531.0, color: "#dfe3e6", form: "papel", passive: true, complex: "Al(OH)4-" },
    Zn: { ion: "Zn2+", z: 2, E: -0.76, kAcid: 6e-5, kBase: 1e-5, dHf: -153.9, color: "#b9c1c8", form: "granallas", complex: "Zn(OH)4 2-" },
    Fe: { ion: "Fe2+", z: 2, E: -0.44, kAcid: 1.5e-5, dHf: -89.1, color: "#7d8792", form: "clavo", rusts: true },
    Ni: { ion: "Ni2+", z: 2, E: -0.26, kAcid: 3e-6, dHf: -54.0, color: "#b6b9b9", form: "lámina" },
    Sn: { ion: "Sn2+", z: 2, E: -0.14, kAcid: 4e-6, dHf: -8.8, color: "#cfd2d5", form: "granallas" },
    Pb: { ion: "Pb2+", z: 2, E: -0.13, kAcid: 1e-6, dHf: -1.7, color: "#8a9099", form: "lámina" },
    Cu: { ion: "Cu2+", z: 2, E: 0.34, dHf: 64.8, color: "#c87a4a", form: "lámina", deposit: "#b5562e" },
    Ag: { ion: "Ag+", z: 1, E: 0.80, dHf: 105.6, color: "#e3e5e8", form: "alambre", deposit: "#cfd3d9", crystals: true },
    Au: { ion: null, z: 3, E: 1.50, dHf: 0, color: "#e6bf3c", form: "lámina" }
  };

  Object.keys(METALS).forEach(function (sym) {
    var m = METALS[sym];
    m.sym = sym;
    m.key = sym + "(s)";
    SP[m.key] = { f: sym, fm: sym, ph: "s", name: AQ.elementBySymbol(sym).name.toLowerCase(), metal: sym };
  });
  Object.keys(INERT).forEach(function (key) {
    var it = INERT[key];
    SP[key] = { f: it.f, fm: it.fm, ph: "s", name: it.name, inert: true };
  });
  COMPOUNDS.forEach(function (c) {
    c.fm = c.fm || c.f;
    c.M = AQ.Formula.molarMass(c.fm);
    SP[c.key] = { f: c.f, fm: c.fm, ph: "s", name: c.name, compound: c };
    if (c.sol != null) {
      var s = c.sol * 10 / c.M;
      var k = 1;
      Object.keys(c.ions).forEach(function (ion) { k *= Math.pow(c.ions[ion] * s, c.ions[ion]); });
      c.kspEff = k;
    }
  });
  Object.keys(SP).forEach(function (k) {
    SP[k].key = k;
    SP[k].z = SP[k].z || 0;
    SP[k].ph = SP[k].ph || "aq";
    SP[k].M = AQ.Formula.molarMass(SP[k].fm);
  });

  // Partes de las fórmulas para construir sales: base y si es un ion poliatómico.
  var ION_PARTS = {
    "H+": "H", "Na+": "Na", "K+": "K", "Li+": "Li", "NH4+": "NH4|", "Ca2+": "Ca", "Mg2+": "Mg", "Ba2+": "Ba",
    "Cu2+": "Cu", "Zn2+": "Zn", "Fe2+": "Fe", "Fe3+": "Fe", "Al3+": "Al", "Ag+": "Ag", "Pb2+": "Pb", "Ni2+": "Ni",
    "Sn2+": "Sn", "Mn2+": "Mn", "Cl-": "Cl", "I-": "I", "NO3-": "NO3|", "SO4 2-": "SO4|", "CO3 2-": "CO3|",
    "HCO3-": "HCO3|", "CH3COO-": "CH3COO|", "OH-": "OH|", "MnO4-": "MnO4|", "Zn(OH)4 2-": "Zn(OH)4|", "Al(OH)4-": "Al(OH)4|"
  };

  function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

  AQ.saltFormula = function (cation, anion) {
    var c = ION_PARTS[cation];
    var a = ION_PARTS[anion];
    if (!c || !a) return null;
    var cz = SP[cation].z;
    var az = -SP[anion].z;
    var g = gcd(cz, az);
    var nc = az / g;
    var na = cz / g;
    var cb = c.split("|")[0];
    var ab = a.split("|")[0];
    var cpoly = c.indexOf("|") >= 0;
    var apoly = a.indexOf("|") >= 0;
    if (cation === "H+" && anion === "CH3COO-") return "CH3COOH";
    if (cation === "H+" && anion === "OH-") return "H2O";
    if (anion === "CH3COO-" && nc === 1 && na === 1) return "CH3COO" + cb;
    var left = nc > 1 ? (cpoly ? "(" + cb + ")" + nc : cb + nc) : cb;
    var right = na > 1 ? (apoly ? "(" + ab + ")" + na : ab + na) : ab;
    return left + right;
  };

  AQ.SPECIES = SP;
  AQ.COMPOUNDS = COMPOUNDS;
  AQ.INERT = INERT;
  AQ.METALS = METALS;

  AQ.INDICATORS = {
    feno: { name: "Fenolftaleína", stops: [[0, "#ffffff", 0], [8.0, "#ffffff", 0], [8.6, "#f6a8d0", 0.45], [9.4, "#e0459a", 1], [12, "#c8177f", 1.15], [14, "#c8177f", 1.15]],
      names: [[8.2, "incolora"], [9.6, "rosa"], [99, "fucsia"]] },
    universal: { name: "Indicador universal", stops: [[0, "#c81e2b", 1], [2, "#d8262b", 1], [3, "#ef6a26", 1], [4.5, "#f29a22", 1], [5.5, "#f2c21f", 1], [6.3, "#d6d82a", 1], [7, "#5bb547", 1], [8, "#2a9d7c", 1], [9, "#2c7fb8", 1], [10, "#3a52a8", 1], [12, "#5b3a9a", 1], [14, "#6a2c8a", 1]],
      names: [[3, "rojo"], [4.5, "naranja"], [6.3, "amarillo"], [7.6, "verde"], [8.6, "verde azulado"], [10.5, "azul"], [99, "morado"]] },
    tornasol: { name: "Tornasol", stops: [[0, "#d2364a", 1], [4.5, "#d2364a", 1], [6.5, "#8a4fa0", 1], [8.3, "#3a5fc0", 1], [14, "#3a5fc0", 1]],
      names: [[5, "rojo"], [8, "violeta"], [99, "azul"]] },
    metilo: { name: "Naranja de metilo", stops: [[0, "#d62a2a", 1], [3.1, "#e0402a", 1], [3.8, "#f08a2a", 1], [4.4, "#f3c42f", 1], [14, "#f3c42f", 1]],
      names: [[3.4, "rojo"], [4.2, "naranja"], [99, "amarillo"]] },
    bromotimol: { name: "Azul de bromotimol", stops: [[0, "#e8c92a", 1], [6.0, "#e8c92a", 1], [6.8, "#5aa84a", 1], [7.6, "#2d5fb8", 1], [14, "#2d5fb8", 1]],
      names: [[6.2, "amarillo"], [7.4, "verde"], [99, "azul"]] },
    lombarda: { name: "Col lombarda", stops: [[0, "#c8173f", 1], [2, "#d81f4a", 1], [4, "#e0457a", 1], [5.5, "#b25aa8", 1], [7, "#7a4fb0", 1], [8, "#4a5fc8", 1], [9, "#3a8aa8", 1], [10, "#3fa860", 1], [12, "#9cc23a", 1], [13.5, "#e6d02a", 1], [14, "#e6d02a", 1]],
      names: [[3, "rojo"], [4.8, "rosa"], [6.4, "violeta"], [8.4, "azul"], [9.6, "verde azulado"], [11.5, "verde"], [99, "amarillo"]] }
  };

  AQ.indicatorColorName = function (id, ph) {
    var list = AQ.INDICATORS[id].names;
    for (var i = 0; i < list.length; i++) if (ph < list[i][0]) return list[i][1];
    return list[list.length - 1][1];
  };

  var WATER_PER_ML = 0.997 / 18.015;

  function sol(map, c) {
    return function (mL, conc) {
      var k = (conc == null ? c : conc) * mL / 1000;
      var out = { "H2O(l)": mL * WATER_PER_ML };
      Object.keys(map).forEach(function (s) { out[s] = map[s] * k; });
      return out;
    };
  }

  // kind: solution (mL + concentración), solid (g), metal (g), indicator (gotas o mL), liquid (mL), action.
  AQ.REAGENTS = [
    { id: "agua", name: "Agua destilada", f: "H₂O", cat: "Básicos", kind: "solution", amounts: [1, 5, 10, 25, 50, 100], def: 50, color: "#d8ecf6", adds: sol({}, 0), desc: "Disolvente neutro. Casi no conduce la electricidad." },
    { id: "hcl", name: "Ácido clorhídrico", f: "HCl", cat: "Ácidos", kind: "solution", concs: [0.1, 0.5, 1, 2], defConc: 1, amounts: [0.05, 1, 5, 10, 25, 50], def: 25, color: "#eef3d8", adds: sol({ "H+": 1, "Cl-": 1 }), hazards: ["corrosivo"], desc: "Ácido fuerte: en agua se separa por completo en H⁺ y Cl⁻." },
    { id: "h2so4", name: "Ácido sulfúrico", f: "H₂SO₄", cat: "Ácidos", kind: "solution", concs: [0.05, 0.5, 1], defConc: 0.5, amounts: [0.05, 1, 5, 10, 25, 50], def: 25, color: "#f1f1e2", adds: sol({ "H+": 2, "SO4 2-": 1 }), hazards: ["corrosivo"], desc: "Ácido fuerte diprótico: cada molécula aporta dos H⁺." },
    { id: "vinagre", name: "Vinagre", f: "CH₃COOH 5 %", cat: "Ácidos", kind: "solution", amounts: [1, 5, 10, 25, 50], def: 25, color: "#f4eed0", adds: sol({ CH3COOH: 0.83 }, 1), desc: "Ácido acético al 5 % (0,83 mol/L). Ácido débil: solo una pequeña parte suelta H⁺." },
    { id: "naoh", name: "Hidróxido de sodio", f: "NaOH", cat: "Bases", kind: "solution", concs: [0.1, 0.5, 1, 2], defConc: 1, amounts: [0.05, 1, 5, 10, 25, 50], def: 25, color: "#f3f1ea", adds: sol({ "Na+": 1, "OH-": 1 }), hazards: ["corrosivo"], desc: "Base fuerte (sosa cáustica). Aporta iones OH⁻." },
    { id: "nh3", name: "Amoníaco", f: "NH₃(aq)", cat: "Bases", kind: "solution", concs: [0.1, 1], defConc: 1, amounts: [0.05, 1, 5, 10, 25], def: 10, color: "#eef4f4", adds: sol({ NH3: 1 }), hazards: ["corrosivo"], desc: "Base débil, como el amoníaco de limpieza. Huele fuerte." },
    { id: "cal", name: "Agua de cal", f: "Ca(OH)₂ sat.", cat: "Bases", kind: "solution", amounts: [5, 10, 25, 50], def: 25, color: "#f1f4f4", adds: sol({ "Ca2+": 0.02, "OH-": 0.04 }, 1), hazards: ["irritante"], desc: "Disolución saturada de hidróxido de calcio. Se enturbia con CO₂: sirve para detectarlo." },
    { id: "naohs", name: "Sosa en lentejas", f: "NaOH(s)", cat: "Bases", kind: "solid", solid: "NaOH(s)", amounts: [0.1, 0.5, 1, 2, 5], def: 1, color: "#f4f4ef", hazards: ["corrosivo"], desc: "Hidróxido de sodio sólido. Al disolverse desprende mucho calor." },
    { id: "bicarbonato", name: "Bicarbonato de sodio", f: "NaHCO₃", cat: "Bases", kind: "solid", solid: "NaHCO3(s)", amounts: [0.1, 0.5, 1, 2, 5, 10], def: 2, color: "#f7f7f2", desc: "Polvo blanco de cocina. Base débil que suelta CO₂ con los ácidos." },
    { id: "na2co3", name: "Carbonato de sodio", f: "Na₂CO₃", cat: "Bases", kind: "solid", solid: "Na2CO3(s)", amounts: [0.1, 0.5, 1, 2, 5], def: 1, color: "#f5f5f0", hazards: ["irritante"], desc: "Sosa Solvay. Más básico que el bicarbonato." },
    { id: "caoh2", name: "Cal apagada", f: "Ca(OH)₂", cat: "Bases", kind: "solid", solid: "Ca(OH)2(s)", amounts: [0.1, 0.5, 1, 2], def: 0.5, color: "#f7f7f4", hazards: ["irritante"], desc: "Hidróxido de calcio. Se disuelve muy poco (unos 1,7 g por litro)." },
    { id: "nacl", name: "Sal común", f: "NaCl", cat: "Sales", kind: "solid", solid: "NaCl(s)", amounts: [0.1, 0.5, 1, 2, 5, 10, 20], def: 1, color: "#f6f6f2", desc: "Cloruro de sodio. Se disuelven unos 36 g en 100 mL de agua." },
    { id: "cuso4s", name: "Sulfato de cobre", f: "CuSO₄·5H₂O", cat: "Sales", kind: "solid", solid: "CuSO4·5H2O(s)", amounts: [0.1, 0.5, 1, 2, 5], def: 1, color: "#2f74d8", hazards: ["nocivo", "ambiental"], desc: "Cristales azules. El color lo dan los iones Cu²⁺ rodeados de agua." },
    { id: "cuso4", name: "Sulfato de cobre (disolución)", f: "CuSO₄(aq)", cat: "Sales", kind: "solution", concs: [0.1, 0.5], defConc: 0.5, amounts: [1, 5, 10, 25, 50], def: 25, color: "#5aa0e6", adds: sol({ "Cu2+": 1, "SO4 2-": 1 }), hazards: ["nocivo", "ambiental"], desc: "Disolución azul de iones Cu²⁺." },
    { id: "agno3", name: "Nitrato de plata", f: "AgNO₃(aq)", cat: "Sales", kind: "solution", concs: [0.1], defConc: 0.1, amounts: [0.05, 1, 5, 10, 25], def: 10, color: "#f2f3f2", adds: sol({ "Ag+": 1, "NO3-": 1 }), hazards: ["corrosivo", "ambiental"], desc: "Reactivo para detectar haluros: con Cl⁻ da un sólido blanco." },
    { id: "pbno3", name: "Nitrato de plomo(II)", f: "Pb(NO₃)₂(aq)", cat: "Sales", kind: "solution", concs: [0.1], defConc: 0.1, amounts: [0.05, 1, 5, 10, 25], def: 10, color: "#f3f3f1", adds: sol({ "Pb2+": 1, "NO3-": 2 }), hazards: ["tóxico", "ambiental"], desc: "Disolución incolora. Con yoduro forma el famoso precipitado amarillo." },
    { id: "ki", name: "Yoduro de potasio", f: "KI(aq)", cat: "Sales", kind: "solution", concs: [0.1, 0.5], defConc: 0.1, amounts: [0.05, 1, 5, 10, 25], def: 10, color: "#f4f4f2", adds: sol({ "K+": 1, "I-": 1 }), desc: "Disolución incolora de iones I⁻. Catalizador de la descomposición del agua oxigenada." },
    { id: "kis", name: "Yoduro de potasio sólido", f: "KI(s)", cat: "Sales", kind: "solid", solid: "KI(s)", amounts: [0.1, 0.5, 1, 2], def: 0.5, color: "#f6f6f1", desc: "Cristales blancos muy solubles." },
    { id: "bacl2", name: "Cloruro de bario", f: "BaCl₂(aq)", cat: "Sales", kind: "solution", concs: [0.1], defConc: 0.1, amounts: [0.05, 1, 5, 10, 25], def: 10, color: "#f3f3f2", adds: sol({ "Ba2+": 1, "Cl-": 2 }), hazards: ["tóxico"], desc: "Detecta sulfatos: con SO₄²⁻ precipita BaSO₄ blanco." },
    { id: "fecl3", name: "Cloruro de hierro(III)", f: "FeCl₃(aq)", cat: "Sales", kind: "solution", concs: [0.1], defConc: 0.1, amounts: [0.05, 1, 5, 10, 25], def: 10, color: "#e2a54a", adds: sol({ "Fe3+": 1, "Cl-": 3 }), hazards: ["corrosivo"], desc: "Disolución amarillo anaranjada. Ataca al cobre: se usa para grabar circuitos." },
    { id: "feso4", name: "Sulfato de hierro(II)", f: "FeSO₄(aq)", cat: "Sales", kind: "solution", concs: [0.1], defConc: 0.1, amounts: [0.05, 1, 5, 10, 25], def: 10, color: "#dcebcf", adds: sol({ "Fe2+": 1, "SO4 2-": 1 }), hazards: ["nocivo"], desc: "Disolución verde pálido de iones Fe²⁺." },
    { id: "kmno4", name: "Permanganato de potasio", f: "KMnO₄(aq)", cat: "Sales", kind: "solution", concs: [0.01], defConc: 0.01, amounts: [0.05, 0.5, 1, 5, 10], def: 1, color: "#8b1e8f", adds: sol({ "K+": 1, "MnO4-": 1 }), hazards: ["comburente", "nocivo"], desc: "Oxidante fuerte de color violeta intenso. Se decolora cuando oxida a otra sustancia." },
    { id: "cacl2", name: "Cloruro de calcio", f: "CaCl₂", cat: "Sales", kind: "solid", solid: "CaCl2(s)", amounts: [0.5, 1, 2, 5, 10], def: 2, color: "#f4f4f0", hazards: ["irritante"], desc: "Se usa para derretir hielo. Al disolverse calienta mucho." },
    { id: "nh4no3", name: "Nitrato de amonio", f: "NH₄NO₃", cat: "Sales", kind: "solid", solid: "NH4NO3(s)", amounts: [0.5, 1, 2, 5, 10, 20], def: 5, color: "#f7f7f3", hazards: ["comburente"], desc: "Fertilizante. Al disolverse absorbe calor: es lo que llevan las compresas frías." },
    { id: "marmol", name: "Mármol en trozos", f: "CaCO₃", cat: "Sales", kind: "solid", solid: "CaCO3(s)", form: 0.15, amounts: [0.5, 1, 2, 5], def: 2, color: "#f0ede6", desc: "Carbonato de calcio, como la caliza o la cáscara de huevo." },
    { id: "mg", name: "Magnesio", f: "Mg", cat: "Metales", kind: "metal", metal: "Mg", amounts: [0.05, 0.1, 0.25, 0.5, 1], def: 0.1, desc: "Cinta de magnesio. Muy activo frente a los ácidos." },
    { id: "zn", name: "Zinc", f: "Zn", cat: "Metales", kind: "metal", metal: "Zn", amounts: [0.1, 0.5, 1, 2, 5], def: 1, desc: "Granallas de zinc." },
    { id: "fe", name: "Hierro", f: "Fe", cat: "Metales", kind: "metal", metal: "Fe", amounts: [0.5, 1, 2, 5], def: 2, desc: "Un clavo de hierro limpio." },
    { id: "cu", name: "Cobre", f: "Cu", cat: "Metales", kind: "metal", metal: "Cu", amounts: [0.1, 0.5, 1, 2, 5], def: 1, desc: "Lámina de cobre. Poco activo." },
    { id: "al", name: "Aluminio", f: "Al", cat: "Metales", kind: "metal", metal: "Al", amounts: [0.05, 0.1, 0.25, 0.5, 1], def: 0.25, desc: "Papel de aluminio arrugado. Lo protege una capa de óxido." },
    { id: "ag", name: "Plata", f: "Ag", cat: "Metales", kind: "metal", metal: "Ag", amounts: [0.1, 0.5, 1], def: 0.5, desc: "Alambre de plata. Metal noble." },
    { id: "sn", name: "Estaño", f: "Sn", cat: "Metales", kind: "metal", metal: "Sn", amounts: [0.5, 1, 2], def: 1, desc: "Granallas de estaño." },
    { id: "pb", name: "Plomo", f: "Pb", cat: "Metales", kind: "metal", metal: "Pb", amounts: [0.5, 1, 2], def: 1, hazards: ["tóxico"], desc: "Lámina de plomo." },
    { id: "ni", name: "Níquel", f: "Ni", cat: "Metales", kind: "metal", metal: "Ni", amounts: [0.5, 1, 2], def: 1, desc: "Lámina de níquel." },
    { id: "au", name: "Oro", f: "Au", cat: "Metales", kind: "metal", metal: "Au", amounts: [0.1, 0.5, 1], def: 0.5, desc: "Una lámina de oro. Metal noble: casi nada lo ataca." },
    { id: "na", name: "Sodio", f: "Na", cat: "Metales", kind: "metal", metal: "Na", amounts: [0.02, 0.05, 0.1, 0.25], def: 0.05, hazards: ["inflamable", "corrosivo"], desc: "Metal alcalino. Se guarda bajo aceite. Aquí: un trocito del tamaño de un grano de arroz." },
    { id: "k", name: "Potasio", f: "K", cat: "Metales", kind: "metal", metal: "K", amounts: [0.02, 0.05, 0.1], def: 0.05, hazards: ["inflamable", "corrosivo"], desc: "Metal alcalino más reactivo que el sodio." },
    { id: "li", name: "Litio", f: "Li", cat: "Metales", kind: "metal", metal: "Li", amounts: [0.02, 0.05, 0.1], def: 0.05, hazards: ["inflamable", "corrosivo"], desc: "El metal alcalino más tranquilo." },
    { id: "ca", name: "Calcio", f: "Ca", cat: "Metales", kind: "metal", metal: "Ca", amounts: [0.1, 0.2, 0.5], def: 0.2, hazards: ["inflamable"], desc: "Granos de calcio. Reacciona con agua fría." },
    { id: "feno", name: "Fenolftaleína", f: "indicador", cat: "Indicadores", kind: "indicator", ind: "feno", amounts: [1, 3, 5], def: 3, unit: "gotas", color: "#f6eef4", desc: "Incolora en ácido y neutro; rosa por encima de pH 8,2." },
    { id: "universal", name: "Indicador universal", f: "indicador", cat: "Indicadores", kind: "indicator", ind: "universal", amounts: [1, 3, 5], def: 3, unit: "gotas", color: "#7fb34a", desc: "Mezcla de indicadores: un color para cada pH, del rojo al morado." },
    { id: "tornasol", name: "Tornasol", f: "indicador", cat: "Indicadores", kind: "indicator", ind: "tornasol", amounts: [1, 3, 5], def: 3, unit: "gotas", color: "#8a4fa0", desc: "Rojo en ácido, azul en base." },
    { id: "metilo", name: "Naranja de metilo", f: "indicador", cat: "Indicadores", kind: "indicator", ind: "metilo", amounts: [1, 3, 5], def: 3, unit: "gotas", color: "#f08a2a", desc: "Rojo por debajo de pH 3,1; amarillo por encima de 4,4." },
    { id: "bromotimol", name: "Azul de bromotimol", f: "indicador", cat: "Indicadores", kind: "indicator", ind: "bromotimol", amounts: [1, 3, 5], def: 3, unit: "gotas", color: "#5aa84a", desc: "Amarillo en ácido, verde en neutro, azul en base." },
    { id: "lombarda", name: "Extracto de col lombarda", f: "antocianinas", cat: "Indicadores", kind: "indicator", ind: "lombarda", amounts: [1, 2, 5, 10], def: 5, unit: "mL", color: "#7a4fb0", desc: "Indicador casero: rojo, rosa, violeta, azul, verde o amarillo según el pH." },
    { id: "h2o2", name: "Agua oxigenada", f: "H₂O₂", cat: "Casa", kind: "solution", concs: [3, 6], concUnit: "%", defConc: 3, amounts: [1, 5, 10, 25, 50], def: 25, color: "#eef6f8", adds: function (mL, pct) { var m = sol({ H2O2: 1 }, 0)(mL, 0); m.H2O2 = mL * (pct / 100) * 1.01 / 34.01; m["H2O(l)"] = mL * (1 - pct / 100) * WATER_PER_ML; return m; }, hazards: ["irritante"], desc: "Peróxido de hidrógeno. Solo se descompone despacio, salvo que haya un catalizador." },
    { id: "lugol", name: "Lugol (yodo)", f: "I₂ + KI", cat: "Casa", kind: "solution", amounts: [0.05, 0.5, 1, 5], def: 0.5, color: "#9a4f12", adds: sol({ I2: 0.05, "K+": 0.1, "I-": 0.1 }, 1), hazards: ["nocivo"], desc: "Yodo disuelto con ayuda de yoduro. Pardo. Con almidón se vuelve azul oscuro." },
    { id: "almidon", name: "Maicena", f: "almidón", cat: "Casa", kind: "solid", solid: "almidon(s)", amounts: [0.1, 0.5, 1, 2], def: 0.5, color: "#f8f5ec", desc: "Almidón de maíz. En agua forma una suspensión lechosa." },
    { id: "azucar", name: "Azúcar", f: "C₁₂H₂₂O₁₁", cat: "Casa", kind: "solid", solid: "sacarosa(s)", amounts: [0.5, 1, 5, 10, 20], def: 5, color: "#fbfaf6", desc: "Sacarosa. Se disuelve sin separarse en iones." },
    { id: "vitc", name: "Vitamina C", f: "C₆H₈O₆", cat: "Casa", kind: "solid", solid: "C6H8O6(s)", amounts: [0.1, 0.5, 1], def: 0.5, color: "#fbf3d8", desc: "Ácido ascórbico: un ácido débil y un buen reductor. Decolora el yodo." },
    { id: "papa", name: "Papa rallada", f: "catalasa", cat: "Casa", kind: "solid", solid: "papa(s)", amounts: [1, 2, 5], def: 2, color: "#e3cf9a", desc: "Contiene catalasa, una enzima que descompone el agua oxigenada." },
    { id: "jabon", name: "Jabón líquido", f: "jabón", cat: "Casa", kind: "liquid", amounts: [1, 2, 5], def: 2, color: "#9fd8c8", desc: "Atrapa los gases y forma espuma." },
    { id: "aceite", name: "Aceite", f: "triglicéridos", cat: "Casa", kind: "liquid", amounts: [1, 5, 10, 25], def: 10, color: "#e8c95a", desc: "Menos denso que el agua y no se mezcla con ella." },
    { id: "etanol", name: "Etanol", f: "C₂H₅OH", cat: "Casa", kind: "liquid", amounts: [1, 5, 10, 25], def: 10, color: "#f2f6f7", hazards: ["inflamable"], desc: "Alcohol. Se mezcla con el agua en cualquier proporción." },
    { id: "mno2", name: "Dióxido de manganeso", f: "MnO₂", cat: "Otros", kind: "solid", solid: "MnO2(s)", amounts: [0.1, 0.5, 1], def: 0.5, color: "#2a2420", hazards: ["nocivo"], desc: "Polvo negro. Catalizador: acelera una reacción sin gastarse." },
    { id: "i2s", name: "Yodo sólido", f: "I₂(s)", cat: "Otros", kind: "solid", solid: "I2(s)", amounts: [0.05, 0.1, 0.5], def: 0.1, color: "#3a2f45", hazards: ["nocivo"], desc: "Cristales gris violeta. Casi no se disuelven en agua; mejor en alcohol o con yoduro." },
    { id: "carbon", name: "Carbón", f: "C", cat: "Otros", kind: "solid", solid: "C(s)", amounts: [0.5, 1, 2], def: 1, color: "#2a2a2a", desc: "Carbono casi puro. No reacciona con el agua ni con ácidos diluidos." },
    { id: "azufre", name: "Azufre", f: "S", cat: "Otros", kind: "solid", solid: "S(s)", amounts: [0.5, 1, 2], def: 1, color: "#e9d443", desc: "Polvo amarillo. No se moja: flota en el agua." },
    { id: "soplar", name: "Soplar con una pajita", f: "aliento (≈4 % CO₂)", cat: "Acciones", kind: "action", amounts: [1, 3, 5], def: 1, unit: "soplidos", color: "#d8e6f0", desc: "El aire que exhalas lleva dióxido de carbono. Parte se disuelve en el líquido." }
  ];

  AQ.REAGENT_BY_ID = {};
  AQ.REAGENTS.forEach(function (r) { AQ.REAGENT_BY_ID[r.id] = r; });

  AQ.ELEMENT_REAGENT = { Mg: "mg", Zn: "zn", Fe: "fe", Cu: "cu", Al: "al", Ag: "ag", Sn: "sn", Pb: "pb", Ni: "ni", Au: "au", Na: "na", K: "k", Li: "li", Ca: "ca", C: "carbon", S: "azufre", I: "i2s", H: null, O: null };

  AQ.elementLabNote = function (el) {
    if (AQ.ELEMENT_REAGENT[el.symbol]) return null;
    if (el.radioactive) return "Es radiactivo: no se usa en un laboratorio escolar.";
    if (el.state === "gas") return "Es un gas: en el laboratorio escolar se obtiene en una reacción, no se echa de un frasco. Prueba a fabricar H₂, O₂ o CO₂ en el vaso.";
    if (["Rb", "Cs", "Fr"].indexOf(el.symbol) >= 0) return "Explota al tocar el agua. Ni siquiera se hace como demostración.";
    if (["Be", "As", "Se", "Cd", "Hg", "Tl", "Br", "P"].indexOf(el.symbol) >= 0) return "Es muy tóxico o peligroso: solo se estudia en la tabla.";
    return "No forma parte del material de un laboratorio de secundaria.";
  };
})(typeof window !== "undefined" ? window : globalThis);
