(function () {
  var AQ = window.AQ;
  var UI = AQ.UI;
  var esc = UI.esc;

  function poured(s, id) { return s.hist.pourLog.some(function (p) { return p.id === id; }); }
  function pourT(s, id) {
    for (var i = s.hist.pourLog.length - 1; i >= 0; i--) if (s.hist.pourLog[i].id === id) return s.hist.pourLog[i].t;
    return null;
  }
  function ext(s, id) { return s.logIndex[id] ? s.logIndex[id].extent : 0; }
  function seen(s, ind, name) { return !!(s.hist.colors[ind] && s.hist.colors[ind][name]); }
  function tested(s, kind, gas) { return s.hist.tests.some(function (t) { return t.kind === kind && (!gas || t.gas === gas); }); }
  function ph(s) { return s.measure().pH; }
  function ml(s) { return s.volumeL() * 1000; }

  var LIST = [
    {
      id: "neutralizacion", title: "Neutralización con fenolftaleína", topic: "Ácidos y bases", level: "1.º–2.º",
      intro: "Un ácido y una base se anulan formando agua y una sal. Usarás un indicador para saber cuándo se han neutralizado.",
      steps: [
        { text: "Echa 25 mL de ácido clorhídrico 0,1 mol/L.", pick: "hcl", conc: 0.1, amount: 25, done: function (s) { return poured(s, "hcl"); } },
        { text: "Añade 3 gotas de fenolftaleína. ¿Cambia el color?", pick: "feno", done: function (s) { return !!s.ind.feno; } },
        { text: "Añade hidróxido de sodio 0,1 mol/L de 5 en 5 mL y, cerca del final, gota a gota.", pick: "naoh", conc: 0.1, amount: 5, done: function (s) { return poured(s, "naoh"); } },
        { text: "Sigue de 1 en 1 mL y para justo cuando el líquido se vuelva rosa pálido y no desaparezca.", pick: "naoh", conc: 0.1, amount: 1, done: function (s) { return seen(s, "feno", "rosa") || seen(s, "feno", "fucsia"); } },
        { text: "Comprueba el pH con papel indicador.", act: "papel", done: function (s) { return tested(s, "papel"); } }
      ],
      conclusion: "Al principio el pH era 1 (ácido) y la fenolftaleína era incolora. Cuando los moles de OH⁻ igualaron a los de H⁺ (unos 25 mL de NaOH de la misma concentración), el pH saltó de golpe por encima de 8 y apareció el rosa. HCl + NaOH → NaCl + H₂O. La temperatura sube un poco: la neutralización es exotérmica.",
      quiz: [
        { q: "¿Qué sustancias se forman en la neutralización de HCl con NaOH?", o: ["Cloro y sodio", "Cloruro de sodio y agua", "Hidrógeno y oxígeno"], a: 1 },
        { q: "Si el NaOH fuera el doble de concentrado, ¿cuánto harían falta para neutralizar los 25 mL?", o: ["12,5 mL", "25 mL", "50 mL"], a: 0 }
      ]
    },
    {
      id: "lombarda", title: "Escala de pH con col lombarda", topic: "Ácidos y bases", level: "1.º",
      intro: "El jugo de col lombarda tiene antocianinas, pigmentos que cambian de color según el pH. Es un indicador casero.",
      steps: [
        { text: "Echa 50 mL de agua.", pick: "agua", amount: 50, done: function (s) { return ml(s) > 20; } },
        { text: "Añade 5 mL de extracto de col lombarda. Fíjate en el color neutro.", pick: "lombarda", done: function (s) { return !!s.ind.lombarda; } },
        { text: "Añade vinagre hasta que se vuelva rosa o rojo.", pick: "vinagre", amount: 5, done: function (s) { return seen(s, "lombarda", "rosa") || seen(s, "lombarda", "rojo"); } },
        { text: "Ahora añade sosa de 2 en 2 mL hasta que se vuelva verde o amarillo. ¿Qué colores ves por el camino?", pick: "naoh", conc: 1, amount: 2, done: function (s) { return ["verde", "amarillo", "verde azulado"].some(function (n) { return seen(s, "lombarda", n); }); } }
      ],
      conclusion: "Cada color corresponde a un intervalo de pH: rojo y rosa en ácido, violeta cerca del neutro, azul y verde en base, y amarillo en base muy fuerte. Un indicador es una sustancia que cambia de color al ganar o perder H⁺.",
      quiz: [
        { q: "La col lombarda se vuelve verde. El líquido es…", o: ["Ácido", "Neutro", "Básico"], a: 2 },
        { q: "¿Por qué cambia de color un indicador?", o: ["Porque se calienta", "Porque gana o pierde H⁺ y su molécula cambia", "Porque se evapora"], a: 1 }
      ]
    },
    {
      id: "metales-acido", title: "Metales en ácido y la prueba del hidrógeno", topic: "Serie de actividad", level: "2.º–3.º",
      intro: "No todos los metales reaccionan con los ácidos. Los más activos desplazan al hidrógeno, que sale como gas.",
      steps: [
        { text: "Echa 50 mL de ácido clorhídrico 1 mol/L.", pick: "hcl", conc: 1, amount: 50, done: function (s) { return poured(s, "hcl"); } },
        { text: "Añade una cinta de magnesio (0,1 g).", pick: "mg", done: function (s) { return ext(s, "metal-acid:Mg") > 1e-5; } },
        { text: "Mientras burbujea, acerca una astilla encendida.", act: "astilla", done: function (s) { return tested(s, "astilla", "H2"); } },
        { text: "Añade también una lámina de cobre y observa varios minutos (usa 10×).", pick: "cu", once: true, done: function (s) { var t = pourT(s, "cu"); return t != null && s.time - t > 60; } }
      ],
      conclusion: "El magnesio burbujea mucho y se disuelve: Mg + 2 HCl → MgCl₂ + H₂. El «pop» de la astilla demuestra que el gas es hidrógeno. El cobre no reacciona: está por debajo del hidrógeno en la serie de actividad (E° = +0,34 V) y no puede cederle electrones a los H⁺.",
      quiz: [
        { q: "¿Qué gas da un «pop» con la astilla encendida?", o: ["Oxígeno", "Dióxido de carbono", "Hidrógeno"], a: 2 },
        { q: "¿Cuál de estos metales NO reacciona con HCl diluido?", o: ["Zinc", "Cobre", "Magnesio"], a: 1 }
      ]
    },
    {
      id: "clavo", title: "Un clavo de hierro en sulfato de cobre", topic: "Redox", level: "3.º",
      intro: "Un metal más activo puede quitarle el sitio a otro menos activo que esté disuelto como ion.",
      steps: [
        { text: "Echa 50 mL de sulfato de cobre 0,5 mol/L. Fíjate en el azul.", pick: "cuso4", amount: 50, done: function (s) { return poured(s, "cuso4"); } },
        { text: "Mete un clavo de hierro.", pick: "fe", once: true, done: function (s) { return poured(s, "fe"); } },
        { text: "Acelera el tiempo y espera a que el clavo se cubra de cobre.", done: function (s) { return ext(s, "displ:Fe:Cu2+") > 3e-4; } }
      ],
      conclusion: "Fe + CuSO₄ → FeSO₄ + Cu. El hierro cede dos electrones a cada ion Cu²⁺ (el hierro se oxida y el cobre se reduce). El clavo se cubre de cobre rojizo y el azul se va aclarando a verde pálido porque los Cu²⁺ se cambian por Fe²⁺.",
      quiz: [
        { q: "¿Qué especie se reduce?", o: ["Fe", "Cu²⁺", "SO₄²⁻"], a: 1 },
        { q: "Si metes cobre en sulfato de hierro(II), ¿qué pasa?", o: ["Se deposita hierro", "Nada", "Se forma un gas"], a: 1 }
      ]
    },
    {
      id: "plata", title: "Árbol de plata", topic: "Redox", level: "3.º",
      intro: "El cobre es más activo que la plata. Sobre un alambre de cobre crecerán cristales de plata.",
      steps: [
        { text: "Echa 25 mL de nitrato de plata.", pick: "agno3", amount: 25, done: function (s) { return poured(s, "agno3"); } },
        { text: "Añade una lámina de cobre.", pick: "cu", once: true, done: function (s) { return poured(s, "cu"); } },
        { text: "Espera (prueba con 60×) a que crezcan los cristales y el líquido se vuelva azul.", done: function (s) { return ext(s, "displ:Cu:Ag+") > 2e-4; } }
      ],
      conclusion: "Cu + 2 AgNO₃ → Cu(NO₃)₂ + 2 Ag. Cada átomo de cobre cede dos electrones a dos iones Ag⁺. La plata crece como cristales grises y el líquido se vuelve azul por los Cu²⁺ que pasan a la disolución.",
      quiz: [
        { q: "¿Por qué se vuelve azul el líquido?", o: ["Por la plata", "Por los iones Cu²⁺", "Por el nitrato"], a: 1 }
      ]
    },
    {
      id: "lluvia-oro", title: "Lluvia de oro", topic: "Precipitación", level: "3.º",
      intro: "Dos disoluciones transparentes pueden formar un sólido al mezclarse si sus iones forman un compuesto insoluble.",
      steps: [
        { text: "Echa 25 mL de nitrato de plomo.", pick: "pbno3", amount: 25, done: function (s) { return poured(s, "pbno3"); } },
        { text: "Añade 25 mL de yoduro de potasio.", pick: "ki", amount: 25, done: function (s) { return !!s.hist.ppt["PbI2(s)"]; } },
        { text: "Deja reposar y observa cómo se posa el sólido.", done: function (s) { return s.hist.ppt["PbI2(s)"] && (s.susp["PbI2(s)"] || 0) < 0.3; } }
      ],
      conclusion: "Pb(NO₃)₂ + 2 KI → PbI₂ + 2 KNO₃. Es una reacción de doble desplazamiento: los Pb²⁺ y los I⁻ forman yoduro de plomo, amarillo e insoluble. Los K⁺ y NO₃⁻ quedan disueltos (son iones espectadores).",
      quiz: [
        { q: "¿Cuáles son los iones espectadores?", o: ["Pb²⁺ y I⁻", "K⁺ y NO₃⁻", "Todos"], a: 1 }
      ]
    },
    {
      id: "lavoisier", title: "Volcán y ley de Lavoisier", topic: "Conservación de la masa", level: "1.º–2.º",
      intro: "En una reacción la masa no se crea ni se destruye. Pero si un gas escapa, la balanza marca menos.",
      steps: [
        { text: "Echa 50 mL de vinagre. Apunta la masa de la balanza.", pick: "vinagre", amount: 50, done: function (s) { return poured(s, "vinagre"); } },
        { text: "Pon el globo en la boca del vaso.", act: "balloon", done: function (s) { return !!s.balloon; } },
        { text: "Añade 2 g de bicarbonato. ¿Cambia la masa con el globo puesto?", pick: "bicarbonato", done: function (s) { return poured(s, "bicarbonato") && s.balloonLiters() > 0.1; } },
        { text: "Quita el globo y mira la balanza.", act: "balloon", done: function (s) { return !s.balloon && (s.escaped["CO2(g)"] || 0) > 1e-3; } }
      ],
      conclusion: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. Con el globo, el CO₂ queda atrapado y la masa total no cambia. Al quitarlo, el gas se va al aire y la balanza marca menos: la masa no desaparece, se escapa.",
      quiz: [
        { q: "¿Por qué baja la masa del vaso sin globo?", o: ["La masa se destruye", "Escapa el CO₂ al aire", "El vinagre se evapora"], a: 1 }
      ]
    },
    {
      id: "agua-cal", title: "Agua de cal y el CO₂ del aliento", topic: "Gases", level: "2.º",
      intro: "El agua de cal se enturbia con el dióxido de carbono. Sirve para detectarlo en tu aliento.",
      steps: [
        { text: "Echa 25 mL de agua de cal.", pick: "cal", amount: 25, done: function (s) { return poured(s, "cal"); } },
        { text: "Sopla con una pajita.", pick: "soplar", done: function (s) { return !!s.hist.ppt["CaCO3(s)"]; } },
        { text: "Sigue soplando mucho más: ¿la turbidez se queda?", pick: "soplar", amount: 5, done: function (s) { return ext(s, "caco3-co2") > 1e-5; } }
      ],
      conclusion: "CO₂ + Ca(OH)₂ → CaCO₃ + H₂O: el carbonato de calcio es el sólido blanco. Con mucho CO₂ se forma bicarbonato de calcio, Ca(HCO₃)₂, que es soluble, y el líquido se aclara. Así se forman las cuevas en zonas de caliza.",
      quiz: [
        { q: "¿Qué sólido enturbia el agua de cal?", o: ["CaCO₃", "NaCl", "CaO"], a: 0 }
      ]
    },
    {
      id: "catalizadores", title: "Catalizadores y el agua oxigenada", topic: "Velocidad de reacción", level: "3.º–4.º",
      intro: "El agua oxigenada se descompone muy despacio. Un catalizador la acelera sin gastarse.",
      steps: [
        { text: "Echa 25 mL de agua oxigenada al 3 %. ¿Burbujea?", pick: "h2o2", amount: 25, done: function (s) { return poured(s, "h2o2"); } },
        { text: "Añade 0,5 g de dióxido de manganeso.", pick: "mno2", once: true, done: function (s) { return ext(s, "h2o2:MnO2(s)") > 1e-4; } },
        { text: "Acerca una astilla con brasa.", act: "brasa", done: function (s) { return tested(s, "brasa", "O2"); } },
        { text: "Mira en «Contenido»: ¿queda MnO₂ al final? Espera a que deje de burbujear.", done: function (s) { return s.get("MnO2(s)") > 0 && s.get("H2O2") < 1e-4; } }
      ],
      conclusion: "2 H₂O₂ → 2 H₂O + O₂. La brasa se reaviva porque sale oxígeno. El MnO₂ sigue ahí al final, sin gastarse: es un catalizador. La papa rallada hace lo mismo gracias a la enzima catalasa.",
      quiz: [
        { q: "¿Qué le pasa a un catalizador al final de la reacción?", o: ["Se ha gastado", "Sigue igual", "Se ha convertido en oxígeno"], a: 1 },
        { q: "¿Qué gas reaviva una brasa?", o: ["CO₂", "H₂", "O₂"], a: 2 }
      ]
    },
    {
      id: "elefante", title: "Pasta de dientes de elefante", topic: "Velocidad de reacción", level: "2.º–4.º",
      intro: "Con agua oxigenada más concentrada, jabón y yoduro como catalizador, el oxígeno forma una montaña de espuma.",
      steps: [
        { text: "Echa 50 mL de agua oxigenada al 6 %.", pick: "h2o2", conc: 6, amount: 50, done: function (s) { return poured(s, "h2o2"); } },
        { text: "Añade 5 mL de jabón líquido.", pick: "jabon", amount: 5, done: function (s) { return poured(s, "jabon"); } },
        { text: "Echa 1 g de yoduro de potasio sólido.", pick: "kis", amount: 1, once: true, done: function (s) { return ext(s, "h2o2:I-") > 2e-3; } }
      ],
      conclusion: "Los iones I⁻ catalizan la descomposición: 2 H₂O₂ → 2 H₂O + O₂. El jabón atrapa el oxígeno en burbujas y la espuma sale del vaso. Es exotérmica: el vaso se calienta.",
      quiz: [
        { q: "¿Para qué sirve el jabón?", o: ["Es el catalizador", "Atrapa el gas formando espuma", "Da color"], a: 1 }
      ]
    },
    {
      id: "compresas", title: "Compresa fría y compresa caliente", topic: "Energía", level: "2.º–3.º",
      intro: "Al disolverse, algunas sales absorben calor y otras lo desprenden.",
      steps: [
        { text: "Echa 50 mL de agua.", pick: "agua", amount: 50, done: function (s) { return ml(s) > 20; } },
        { text: "Añade 10 g de nitrato de amonio y agita.", pick: "nh4no3", amount: 10, once: true, stir: true, done: function (s) { return s.hist.minT < 18; } },
        { text: "Vacía el vaso y echa 50 mL de agua nueva.", act: "empty", pick: "agua", amount: 50, done: function (s) { return s.hist.pourLog.length === 1 && ml(s) > 20; } },
        { text: "Añade 10 g de cloruro de calcio y agita.", pick: "cacl2", amount: 10, once: true, stir: true, done: function (s) { return s.hist.maxT > 32; } }
      ],
      conclusion: "El nitrato de amonio absorbe calor del agua al disolverse (proceso endotérmico): el vaso se enfría. El cloruro de calcio desprende calor (exotérmico). Las compresas instantáneas usan este efecto.",
      quiz: [
        { q: "Un proceso que absorbe calor del entorno es…", o: ["Exotérmico", "Endotérmico", "Neutro"], a: 1 }
      ]
    },
    {
      id: "saturada", title: "Disolución saturada", topic: "Disoluciones", level: "1.º–2.º",
      intro: "En una cantidad de agua solo cabe una cierta cantidad de soluto: la solubilidad.",
      steps: [
        { text: "Echa 10 mL de agua.", pick: "agua", amount: 10, done: function (s) { return ml(s) > 5; } },
        { text: "Añade sal de 1 en 1 g y agita hasta que quede sal sin disolver.", pick: "nacl", amount: 1, stir: true, done: function (s) { var c = AQ.COMPOUNDS.filter(function (x) { return x.key === "NaCl(s)"; })[0]; return s.saturated(c); } },
        { text: "Añade 10 mL más de agua y agita. ¿Qué pasa con la sal del fondo?", pick: "agua", amount: 10, once: true, stir: true, done: function (s) { return ml(s) > 18 && s.get("NaCl(s)") < 1e-4; } }
      ],
      conclusion: "En 10 mL caben unos 3,6 g de sal (36 g por 100 mL). El resto queda en el fondo: la disolución está saturada. Al añadir más disolvente cabe más soluto y se disuelve.",
      quiz: [
        { q: "¿Cuánta sal cabe en 50 mL de agua aproximadamente?", o: ["3,6 g", "18 g", "36 g"], a: 1 }
      ]
    },
    {
      id: "almidon", title: "Almidón, yodo y vitamina C", topic: "Redox", level: "2.º–4.º",
      intro: "El yodo forma con el almidón un complejo azul oscuro. La vitamina C, un reductor, lo hace desaparecer.",
      steps: [
        { text: "Echa 50 mL de agua.", pick: "agua", amount: 50, done: function (s) { return ml(s) > 20; } },
        { text: "Añade 0,5 g de maicena y agita.", pick: "almidon", stir: true, done: function (s) { return s.c("almidon") > 4e-4; } },
        { text: "Añade 0,5 mL de lugol.", pick: "lugol", amount: 0.5, done: function (s) { return s.c("I2") > 1e-5 && s.c("almidon") > 4e-4; } },
        { text: "Añade vitamina C y agita.", pick: "vitc", stir: true, done: function (s) { return ext(s, "vitc-i2") > 1e-5 && s.c("I2") < 2e-6; } }
      ],
      conclusion: "El almidón detecta el yodo (I₂) por su color azul intenso. La vitamina C reduce el I₂ a I⁻ incoloro: C₆H₈O₆ + I₂ → C₆H₆O₆ + 2 HI. Así se mide cuánta vitamina C tiene un zumo.",
      quiz: [
        { q: "En esta reacción, la vitamina C…", o: ["Se oxida", "Se reduce", "No cambia"], a: 0 }
      ]
    },
    {
      id: "sodio", title: "Sodio en agua", topic: "Metales alcalinos", level: "3.º",
      intro: "Los metales alcalinos son tan activos que reaccionan con el agua. Solo se usa un trocito pequeño.",
      steps: [
        { text: "Echa 100 mL de agua.", pick: "agua", amount: 100, done: function (s) { return ml(s) > 50; } },
        { text: "Añade 3 gotas de fenolftaleína.", pick: "feno", done: function (s) { return !!s.ind.feno; } },
        { text: "Echa un trocito de sodio (0,05 g).", pick: "na", once: true, done: function (s) { return ext(s, "metal-water:Na") > 5e-4; } },
        { text: "Observa el color al terminar.", done: function (s) { return seen(s, "feno", "rosa") || seen(s, "feno", "fucsia"); } }
      ],
      conclusion: "2 Na + 2 H₂O → 2 NaOH + H₂. El sodio flota (es menos denso que el agua), se funde por el calor y corre. Se forma hidróxido de sodio y la fenolftaleína se pone rosa: la disolución es básica.",
      quiz: [
        { q: "¿Por qué se pone rosa la fenolftaleína?", o: ["Por el hidrógeno", "Se forma NaOH, una base", "Por el calor"], a: 1 }
      ]
    },
    {
      id: "aluminio", title: "El aluminio protegido", topic: "Redox", level: "4.º",
      intro: "El aluminio es muy activo, pero una capa fina de óxido lo protege. Los cloruros la rompen.",
      steps: [
        { text: "Echa 50 mL de sulfato de cobre 0,5 mol/L.", pick: "cuso4", amount: 50, done: function (s) { return poured(s, "cuso4"); } },
        { text: "Añade papel de aluminio y espera 2 minutos (usa 10×). ¿Reacciona?", pick: "al", once: true, done: function (s) { var t = pourT(s, "al"); return t != null && s.time - t > 120; } },
        { text: "Añade 2 g de sal común.", pick: "nacl", amount: 2, done: function (s) { return ext(s, "displ:Al:Cu2+") > 1e-4; } }
      ],
      conclusion: "Aunque el aluminio está muy arriba en la serie de actividad, la capa de Al₂O₃ impide que toque los Cu²⁺. Los iones Cl⁻ atacan esa capa y entonces 2 Al + 3 CuSO₄ → Al₂(SO₄)₃ + 3 Cu, con burbujas y calor.",
      quiz: [
        { q: "¿Qué rompe la capa protectora del aluminio?", o: ["Los iones Cl⁻", "El agua", "El sulfato"], a: 0 }
      ]
    },
    {
      id: "precipitado-azul", title: "Precipitado azul de hidróxido de cobre", topic: "Precipitación", level: "3.º",
      intro: "Una base añadida a una sal de cobre forma un hidróxido insoluble. Luego un ácido lo vuelve a disolver.",
      steps: [
        { text: "Echa 25 mL de sulfato de cobre.", pick: "cuso4", amount: 25, done: function (s) { return poured(s, "cuso4"); } },
        { text: "Añade 10 mL de hidróxido de sodio 1 mol/L.", pick: "naoh", amount: 10, done: function (s) { return !!s.hist.ppt["Cu(OH)2(s)"]; } },
        { text: "Añade ácido clorhídrico hasta que el sólido desaparezca.", pick: "hcl", amount: 10, done: function (s) { return s.hist.ppt["Cu(OH)2(s)"] && s.get("Cu(OH)2(s)") < 1e-6 && poured(s, "hcl"); } }
      ],
      conclusion: "CuSO₄ + 2 NaOH → Cu(OH)₂ + Na₂SO₄ forma un sólido azul gelatinoso. El ácido neutraliza los OH⁻: Cu(OH)₂ + 2 HCl → CuCl₂ + 2 H₂O, y vuelve el azul transparente.",
      quiz: [
        { q: "¿Qué tipo de reacción forma el Cu(OH)₂?", o: ["Redox", "Precipitación", "Combustión"], a: 1 }
      ]
    }
  ];

  var BY_ID = {};
  LIST.forEach(function (p) { BY_ID[p.id] = p; });

  var DONE_KEY = "aq-practicas-hechas";
  function loadDone() {
    try { return JSON.parse(localStorage.getItem(DONE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveDone(d) {
    try { localStorage.setItem(DONE_KEY, JSON.stringify(d)); } catch (e) { /* sin almacenamiento */ }
  }

  var P = AQ.Practices = { list: LIST, active: null, step: 0, answers: {}, root: null };

  P.start = function (id) {
    P.active = BY_ID[id];
    P.step = 0;
    P.answers = {};
    AQ.Lab.sim.reset();
    var first = P.active.steps[0];
    if (first.pick) preselect(first);
    location.hash = "#laboratorio";
  };

  function preselect(step) {
    AQ.Lab.choice[step.pick] = AQ.Lab.choice[step.pick] || {};
    var r = AQ.REAGENT_BY_ID[step.pick];
    var c = AQ.Lab.choice[step.pick];
    c.amount = step.amount || r.def;
    c.conc = step.conc || r.defConc;
    AQ.Lab.selectReagent(step.pick);
  }

  P.check = function (sim) {
    var p = P.active;
    if (!p) return;
    var advanced = false;
    while (P.step < p.steps.length && p.steps[P.step].done(sim)) {
      P.step++;
      advanced = true;
    }
    if (advanced) {
      if (P.step >= p.steps.length) {
        var d = loadDone();
        d[p.id] = true;
        saveDone(d);
        UI.toast("¡Práctica completada!", "good");
      } else {
        UI.toast("Paso " + P.step + " hecho", "good");
        if (p.steps[P.step].pick) preselect(p.steps[P.step]);
      }
    }
  };

  P.onEmpty = function () {};

  P.guideHTML = function () {
    var p = P.active;
    if (!p) return '<div class="guide-empty"><span class="muted small">Experimenta libremente o sigue una</span> <a href="#practicas">práctica guiada</a>.</div>';
    var finished = P.step >= p.steps.length;
    var html = '<div class="guide"><div class="guide-head"><div><span class="muted tiny">' + esc(p.topic) + "</span><h3>" + esc(p.title) + '</h3></div><button class="ghost small" data-exit="1">Salir</button></div>';
    html += '<div class="progress"><i style="width:' + Math.round(100 * Math.min(P.step, p.steps.length) / p.steps.length) + '%"></i></div>';
    html += '<ol class="steps">' + p.steps.map(function (s, i) {
      var cls = i < P.step ? "done" : i === P.step ? "now" : "";
      return '<li class="' + cls + '">' + esc(s.text) + (i === P.step && s.pick ? ' <button class="link" data-pick="' + i + '">Seleccionar ' + esc(AQ.REAGENT_BY_ID[s.pick].name.toLowerCase()) + "</button>" : "") + "</li>";
    }).join("") + "</ol>";
    if (finished) {
      html += '<div class="conclusion"><strong>Conclusión</strong><p>' + esc(p.conclusion) + "</p></div>";
      html += '<div class="quiz">' + p.quiz.map(function (q, qi) {
        var ans = P.answers[qi];
        return '<div class="q"><p>' + esc(q.q) + "</p>" + q.o.map(function (o, oi) {
          var cls = ans == null ? "" : oi === q.a ? " right" : oi === ans ? " wrong" : "";
          return '<button class="opt' + cls + '" data-q="' + qi + '" data-o="' + oi + '"' + (ans != null ? " disabled" : "") + ">" + esc(o) + "</button>";
        }).join("") + "</div>";
      }).join("") + "</div>";
    }
    return html + "</div>";
  };

  P.onGuideClick = function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.exit) { P.active = null; return; }
    if (t.dataset.pick) { preselect(P.active.steps[Number(t.dataset.pick)]); return; }
    if (t.dataset.q != null) P.answers[Number(t.dataset.q)] = Number(t.dataset.o);
  };

  P.mount = function (root) {
    P.root = root;
    var done = loadDone();
    var topics = [];
    LIST.forEach(function (p) { if (topics.indexOf(p.topic) < 0) topics.push(p.topic); });
    root.innerHTML = '<div class="page"><div class="page-head"><h2>Prácticas guiadas</h2><p class="muted">Cada práctica te dice qué echar y comprueba sola cada paso mirando lo que pasa en el vaso. Al terminar verás la explicación y unas preguntas.</p></div>' +
      '<div class="cards">' + LIST.map(function (p) {
        return '<article class="card practice' + (done[p.id] ? " done" : "") + '">' +
          '<div class="card-top"><span class="tag">' + esc(p.topic) + '</span><span class="muted tiny">' + esc(p.level) + " ESO</span></div>" +
          "<h3>" + esc(p.title) + "</h3><p class=\"small\">" + esc(p.intro) + "</p>" +
          '<div class="card-foot"><span class="muted tiny">' + p.steps.length + " pasos" + (done[p.id] ? " · hecha ✓" : "") + '</span><button class="pour" data-start="' + p.id + '">' + (done[p.id] ? "Repetir" : "Empezar") + "</button></div>" +
          "</article>";
      }).join("") + "</div></div>";
    root.addEventListener("click", onClick);
  };

  function onClick(e) {
    var b = e.target.closest("[data-start]");
    if (b) P.start(b.dataset.start);
  }

  P.unmount = function () {
    if (P.root) P.root.removeEventListener("click", onClick);
    P.root = null;
  };
})();
