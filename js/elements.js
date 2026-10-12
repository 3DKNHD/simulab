(function () {
  var AQ = window.AQ = window.AQ || {};

  AQ.CATEGORIES = {
    "no metal": "#3d9b8f",
    "halógeno": "#3aa0c9",
    "gas noble": "#7d6b9a",
    "metal alcalino": "#d8574a",
    "metal alcalinotérreo": "#e39b3b",
    "metal de transición": "#d6b15a",
    "metal del bloque p": "#6aa6c9",
    "metaloide": "#7da85a"
  };

  AQ.ELEMENTS = [
    { z: 1, symbol: "H", name: "Hidrógeno", mass: 1.008, group: 1, period: 1, category: "no metal", family: "no-metal", state: "gas", shells: [1], config: "1s¹", look: "#e7f2ff", uses: "Combustible de cohetes y materia prima para fabricar amoníaco.", about: "Es el elemento más ligero. En condiciones normales forma moléculas H₂. Está en el grupo 1, pero no es un metal alcalino." },
    { z: 2, symbol: "He", name: "Helio", mass: 4.003, group: 18, period: 1, category: "gas noble", family: "noble", state: "gas", shells: [2], config: "1s²", look: "#f4e8ff", uses: "Globos y enfriamiento de imanes en hospitales.", about: "Gas noble muy estable. Casi no forma compuestos. Es más ligero que el aire y no arde." },
    { z: 3, symbol: "Li", name: "Litio", mass: 6.94, group: 1, period: 2, category: "metal alcalino", family: "metal", state: "sólido", shells: [2, 1], config: "1s² 2s¹", look: "#ece8e4", uses: "Baterías y algunos medicamentos, siempre en compuestos controlados.", about: "El metal alcalino más ligero. Se oxida en el aire y reacciona con el agua, aunque menos fuerte que el sodio." },
    { z: 4, symbol: "Be", name: "Berilio", mass: 9.012, group: 2, period: 2, category: "metal alcalinotérreo", family: "metal", state: "sólido", shells: [2, 2], config: "1s² 2s²", look: "#d5d8dc", uses: "Aleaciones ligeras en aeronáutica.", about: "Metal duro y ligero. Sus compuestos son tóxicos: en secundaria se estudia, no se manipula." },
    { z: 5, symbol: "B", name: "Boro", mass: 10.81, group: 13, period: 2, category: "metaloide", family: "metaloide", state: "sólido", shells: [2, 3], config: "1s² 2s² 2p¹", look: "#6d5a48", uses: "Vidrio resistente al calor y detergentes, en forma de boratos.", about: "Metaloide. Conduce un poco la electricidad, a medias entre metal y no metal." },
    { z: 6, symbol: "C", name: "Carbono", mass: 12.011, group: 14, period: 2, category: "no metal", family: "no-metal", state: "sólido", shells: [2, 4], config: "1s² 2s² 2p²", look: "#2b2b2b", uses: "Base de la química de los seres vivos, además de grafito y diamante.", about: "Forma cadenas largas. El carbón, el grafito y el diamante son carbono con distinta estructura." },
    { z: 7, symbol: "N", name: "Nitrógeno", mass: 14.007, group: 15, period: 2, category: "no metal", family: "no-metal", state: "gas", shells: [2, 5], config: "1s² 2s² 2p³", look: "#e8f0ff", uses: "El 78 % del aire. Sirve para fabricar fertilizantes.", about: "Forma moléculas N₂ muy estables. Por eso el aire no arde." },
    { z: 8, symbol: "O", name: "Oxígeno", mass: 15.999, group: 16, period: 2, category: "no metal", family: "no-metal", state: "gas", shells: [2, 6], config: "1s² 2s² 2p⁴", look: "#e7f6ff", uses: "Respiración y combustiones. Es el 21 % del aire.", about: "Forma O₂. No arde: permite que otras sustancias ardan." },
    { z: 9, symbol: "F", name: "Flúor", mass: 18.998, group: 17, period: 2, category: "halógeno", family: "no-metal", state: "gas", shells: [2, 7], config: "1s² 2s² 2p⁵", look: "#d6f5ea", uses: "En pasta de dientes aparece como fluoruro, nunca como gas flúor.", about: "El no metal más reactivo. El gas es tóxico y no se usa en laboratorios de secundaria." },
    { z: 10, symbol: "Ne", name: "Neón", mass: 20.180, group: 18, period: 2, category: "gas noble", family: "noble", state: "gas", shells: [2, 8], config: "1s² 2s² 2p⁶", look: "#ffd6d6", uses: "Carteles luminosos de color rojo anaranjado.", about: "Gas noble. La luz del cartel aparece con una descarga eléctrica, no al calentarlo." },
    { z: 11, symbol: "Na", name: "Sodio", mass: 22.990, group: 1, period: 3, category: "metal alcalino", family: "metal", state: "sólido", shells: [2, 8, 1], config: "[Ne] 3s¹", look: "#ece7df", uses: "La sal de mesa es cloruro de sodio, no sodio metálico.", about: "Metal blando. Se guarda bajo aceite porque reacciona con la humedad del aire." },
    { z: 12, symbol: "Mg", name: "Magnesio", mass: 24.305, group: 2, period: 3, category: "metal alcalinotérreo", family: "metal", state: "sólido", shells: [2, 8, 2], config: "[Ne] 3s²", look: "#d9ddd8", uses: "Aleaciones ligeras y, en el laboratorio, cintas que arden con luz blanca.", about: "Metal del grupo 2. Arde con una luz muy intensa y forma óxido de magnesio." },
    { z: 13, symbol: "Al", name: "Aluminio", mass: 26.982, group: 13, period: 3, category: "metal del bloque p", family: "metal", state: "sólido", shells: [2, 8, 3], config: "[Ne] 3s² 3p¹", look: "#dfe3e6", uses: "Latas, marcos y aviones, porque es ligero y no se oxida hacia dentro.", about: "Lo protege una capa fina de óxido. También reacciona con bases fuertes: es anfótero." },
    { z: 14, symbol: "Si", name: "Silicio", mass: 28.085, group: 14, period: 3, category: "metaloide", family: "metaloide", state: "sólido", shells: [2, 8, 4], config: "[Ne] 3s² 3p²", look: "#8d8580", uses: "Chips y células solares. La arena tiene dióxido de silicio.", about: "Metaloide semiconductor. En trozo casi no cambia con los ensayos de secundaria." },
    { z: 15, symbol: "P", name: "Fósforo", mass: 30.974, group: 15, period: 3, category: "no metal", family: "no-metal", state: "sólido", shells: [2, 8, 5], config: "[Ne] 3s² 3p³", look: "#a33b32", uses: "En los huesos y en fertilizantes, como fosfato.", about: "El fósforo blanco se inflama solo y es peligroso. En clase, si acaso, se menciona el fósforo rojo." },
    { z: 16, symbol: "S", name: "Azufre", mass: 32.06, group: 16, period: 3, category: "no metal", family: "no-metal", state: "sólido", shells: [2, 8, 6], config: "[Ne] 3s² 3p⁴", look: "#e6d45c", uses: "Ácido sulfúrico industrial, vulcanizado del caucho y algunos fertilizantes.", about: "Sólido amarillo. Si arde, forma un gas irritante, el dióxido de azufre." },
    { z: 17, symbol: "Cl", name: "Cloro", mass: 35.45, group: 17, period: 3, category: "halógeno", family: "no-metal", state: "gas", shells: [2, 8, 7], config: "[Ne] 3s² 3p⁵", look: "#d8f3c8", uses: "Desinfección del agua, siempre en dosis controladas, como hipoclorito o cloro disuelto.", about: "Gas amarillo verdoso y tóxico. En secundaria se estudian sus compuestos, no se genera el gas." },
    { z: 18, symbol: "Ar", name: "Argón", mass: 39.948, group: 18, period: 3, category: "gas noble", family: "noble", state: "gas", shells: [2, 8, 8], config: "[Ne] 3s² 3p⁶", look: "#eee6ff", uses: "Bombillas y soldadura, porque no reacciona.", about: "Casi el 1 % del aire. Gas noble: su última capa está llena." },
    { z: 19, symbol: "K", name: "Potasio", mass: 39.098, group: 1, period: 4, category: "metal alcalino", family: "metal", state: "sólido", shells: [2, 8, 8, 1], config: "[Ar] 4s¹", look: "#e6e2dc", uses: "Imprescindible en el cuerpo, como ion K⁺, no como metal.", about: "Más reactivo que el sodio. La llama del ensayo es violeta." },
    { z: 20, symbol: "Ca", name: "Calcio", mass: 40.078, group: 2, period: 4, category: "metal alcalinotérreo", family: "metal", state: "sólido", shells: [2, 8, 8, 2], config: "[Ar] 4s²", look: "#ddd8d0", uses: "Huesos, caliza y cemento, casi siempre como carbonato o fosfato.", about: "Reacciona con el agua fría y suelta hidrógeno, con menos violencia que el sodio." },
    { z: 21, symbol: "Sc", name: "Escandio", mass: 44.956, group: 3, period: 4, category: "metal de transición", family: "metal", state: "sólido", shells: [2, 8, 9, 2], config: "[Ar] 4s² 3d¹", look: "#c5ccd1", uses: "Alguna aleación ligera de alta gama.", about: "Primer metal de transición. En secundaria basta con situarlo en el bloque d." },
    { z: 22, symbol: "Ti", name: "Titanio", mass: 47.867, group: 4, period: 4, category: "metal de transición", family: "metal", state: "sólido", shells: [2, 8, 10, 2], config: "[Ar] 4s² 3d²", look: "#cfd5d8", uses: "Implantes y aviones: resiste la corrosión.", about: "Una capa de óxido lo protege. No reacciona con el agua ni con ácidos diluidos suaves." },
    { z: 23, symbol: "V", name: "Vanadio", mass: 50.942, group: 5, period: 4, category: "metal de transición", family: "metal", state: "sólido", shells: [2, 8, 11, 2], config: "[Ar] 4s² 3d³", look: "#b7bcc0", uses: "Aceros resistentes. Sus compuestos tienen muchos colores.", about: "Metal de transición duro. El metal puro no se ensaya en un laboratorio escolar." },
    { z: 24, symbol: "Cr", name: "Cromo", mass: 51.996, group: 6, period: 4, category: "metal de transición", family: "metal", state: "sólido", shells: [2, 8, 13, 1], config: "[Ar] 4s¹ 3d⁵", look: "#d5d8dc", uses: "Recubrimientos brillantes y acero inoxidable.", about: "Su configuración es una excepción: un electrón del 4s pasa al 3d. La capa de óxido evita que se oxide como el hierro." },
    { z: 25, symbol: "Mn", name: "Manganeso", mass: 54.938, group: 7, period: 4, category: "metal de transición", family: "metal", state: "sólido", shells: [2, 8, 13, 2], config: "[Ar] 4s² 3d⁵", look: "#b9b3ae", uses: "Aceros y, como dióxido, en pilas.", about: "Metal gris. Con ácido diluido puede soltar hidrógeno, a diferencia del cobre." },
    { z: 26, symbol: "Fe", name: "Hierro", mass: 55.845, group: 8, period: 4, category: "metal de transición", family: "metal", state: "sólido", shells: [2, 8, 14, 2], config: "[Ar] 4s² 3d⁶", look: "#8e98a3", uses: "Acero, herramientas y la hemoglobina.", about: "Se oxida con aire húmedo y forma herrumbre. Está por encima del hidrógeno en la serie de actividad." },
    { z: 27, symbol: "Co", name: "Cobalto", mass: 58.933, group: 9, period: 4, category: "metal de transición", family: "metal", state: "sólido", shells: [2, 8, 15, 2], config: "[Ar] 4s² 3d⁷", look: "#9aa3ad", uses: "Imanes y pigmentos azules.", about: "Metal de transición. Muchos de sus compuestos son azules." },
    { z: 28, symbol: "Ni", name: "Níquel", mass: 58.693, group: 10, period: 4, category: "metal de transición", family: "metal", state: "sólido", shells: [2, 8, 16, 2], config: "[Ar] 4s² 3d⁸", look: "#c5ccd1", uses: "Monedas, acero inoxidable y baterías.", about: "Resiste bastante la corrosión. Con ácidos diluidos reacciona despacio." },
    { z: 29, symbol: "Cu", name: "Cobre", mass: 63.546, group: 11, period: 4, category: "metal de transición", family: "metal", state: "sólido", shells: [2, 8, 18, 1], config: "[Ar] 4s¹ 3d¹⁰", look: "#c4784a", uses: "Cables eléctricos y tuberías.", about: "Muy buen conductor. Está debajo del hidrógeno: no suelta hidrógeno con ácidos diluidos. Su configuración electrónica es una excepción." },
    { z: 30, symbol: "Zn", name: "Zinc", mass: 65.38, group: 12, period: 4, category: "metal de transición", family: "metal", state: "sólido", shells: [2, 8, 18, 2], config: "[Ar] 4s² 3d¹⁰", look: "#d5dbdf", uses: "Galvanizado del hierro para que no se oxide, y pilas.", about: "Reacciona con ácidos diluidos. También con bases fuertes: es anfótero." },
    { z: 31, symbol: "Ga", name: "Galio", mass: 69.723, group: 13, period: 4, category: "metal del bloque p", family: "metal", state: "sólido", shells: [2, 8, 18, 3], config: "[Ar] 4s² 3d¹⁰ 4p¹", look: "#d9dde2", uses: "LEDs y semiconductores, en compuestos como el arseniuro de galio.", about: "Funde a unos 30 °C. Un trozo se derrite en la mano. No es un experimento para comer ni para mancharse: aquí solo se simula." },
    { z: 32, symbol: "Ge", name: "Germanio", mass: 72.630, group: 14, period: 4, category: "metaloide", family: "metaloide", state: "sólido", shells: [2, 8, 18, 4], config: "[Ar] 4s² 3d¹⁰ 4p²", look: "#8d8580", uses: "Fibra óptica y algunos transistores.", about: "Metaloide semiconductor, parecido al silicio. No da un cambio visible en estos ensayos." },
    { z: 33, symbol: "As", name: "Arsénico", mass: 74.922, group: 15, period: 4, category: "metaloide", family: "metaloide", state: "sólido", shells: [2, 8, 18, 5], config: "[Ar] 4s² 3d¹⁰ 4p³", look: "#6d655c", uses: "Se estudia en la tabla. Sus compuestos son tóxicos y no se ensayan en clase.", about: "Metaloide tóxico. En este simulador solo aparece para completar el periodo 4." },
    { z: 34, symbol: "Se", name: "Selenio", mass: 78.971, group: 16, period: 4, category: "no metal", family: "no-metal", state: "sólido", shells: [2, 8, 18, 6], config: "[Ar] 4s² 3d¹⁰ 4p⁴", look: "#5c5148", uses: "Antiguas fotocélulas. El elemento y varios compuestos son tóxicos.", about: "No metal del grupo del oxígeno. No se hacen ensayos escolares con selenio elemental." },
    { z: 35, symbol: "Br", name: "Bromo", mass: 79.904, group: 17, period: 4, category: "halógeno", family: "no-metal", state: "líquido", shells: [2, 8, 18, 7], config: "[Ar] 4s² 3d¹⁰ 4p⁵", look: "#8a3a28", uses: "En clase se nombra como halógeno líquido. El líquido puro no se manipula: sus vapores son tóxicos.", about: "Único no metal líquido a temperatura ambiente, junto con el mercurio entre los elementos comunes. Menos reactivo que el cloro." },
    { z: 36, symbol: "Kr", name: "Kriptón", mass: 83.798, group: 18, period: 4, category: "gas noble", family: "noble", state: "gas", shells: [2, 8, 18, 8], config: "[Ar] 4s² 3d¹⁰ 4p⁶", look: "#eee6ff", uses: "Algunas lámparas y flashes.", about: "Gas noble del periodo 4. Cierra la tabla de este simulador." }
  ];

  var TITLES = { calor: "Calentar", agua: "Añadir agua", aire: "Dejar al aire", acido: "Ácido diluido" };

  function pack(testId, observation, explanation, extra) {
    var out = {
      title: TITLES[testId],
      observation: observation,
      explanation: explanation,
      equation: extra && extra.equation || "",
      safety: extra && extra.safety || "",
      visual: extra && extra.visual || { vessel: "chunk", color: "#c5ccd1", label: "Sin cambio visible" }
    };
    return out;
  }

  function gas(el, tint) {
    return { vessel: "gasjar", tint: tint || "#eef6ff", label: el.symbol === "H" ? "H₂" : el.symbol === "N" ? "N₂" : el.symbol === "O" ? "O₂" : el.symbol === "F" ? "F₂" : el.symbol === "Cl" ? "Cl₂" : el.symbol };
  }

  function chunk(el, opts) {
    var v = { vessel: "chunk", color: el.look, label: el.name };
    if (opts) Object.keys(opts).forEach(function (k) { v[k] = opts[k]; });
    return v;
  }

  var CUSTOM = {
    H: {
      calor: pack("calor", "Sin oxígeno sigue igual. Si se enciende en el aire, arde y forma agua.", "Es una combustión. La llama del hidrógeno es muy pálida.", { equation: "2H₂ + O₂ → 2H₂O", safety: "El hidrógeno real es inflamable. Esto es una simulación.", visual: { vessel: "burner", flame: "#d7e7ff", caption: "Llama casi invisible" } }),
      agua: pack("agua", "Casi no se disuelve y no reacciona con el agua.", "Sigue siendo hidrógeno gaseoso.", { visual: gas({ symbol: "H" }) }),
      aire: pack("aire", "Mezclado con el aire no cambia solo. Hace falta una chispa para que arda.", "El aire ya lleva oxígeno, pero la mezcla no reacciona a temperatura ambiente.", { visual: gas({ symbol: "H" }, "#f7fbff") }),
      acido: pack("acido", "El hidrógeno gaseoso no ataca los ácidos como hacen varios metales.", "Quienes sueltan hidrógeno son ciertos metales al reaccionar con el ácido.", { visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.55, gas: "" } })
    },
    He: null,
    Li: null,
    Be: {
      calor: pack("calor", "Se calienta y no arde con un mechero escolar.", "En la superficie ya hay una capa de óxido.", { visual: chunk({ look: "#d5d8dc", name: "Berilio" }, { glow: true }) }),
      agua: pack("agua", "No reacciona con el agua fría.", "No se comporta como el calcio.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.55, solid: "#d5d8dc" } }),
      aire: pack("aire", "Sigue cubierto por una capa fina de óxido.", "Esa capa lo protege.", { visual: chunk({ look: "#d5d8dc", name: "Berilio" }) }),
      acido: pack("acido", "El ácido diluido lo atacaría, pero este ensayo no se hace.", "Los compuestos de berilio son tóxicos. En secundaria basta con situarlo en el grupo 2.", { safety: "No se manipula en clase.", visual: { vessel: "gasjar", tint: "#fff1f0", label: "Be" } })
    },
    C: {
      calor: pack("calor", "El carbón arde y se convierte en dióxido de carbono.", "Si hay poco oxígeno puede formarse monóxido de carbono, un gas tóxico. Por eso las brasas necesitan ventilación.", { equation: "C + O₂ → CO₂", visual: { vessel: "burner", flame: "#ffb15a", caption: "Brasa y llama" } }),
      agua: pack("agua", "No se disuelve. El trozo sigue en el fondo.", "Carbono y agua no reaccionan a temperatura ambiente.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.6, solid: "#2b2b2b" } }),
      aire: pack("aire", "En frío no cambia. Hace falta calor para que arda.", "El diamante y el grafito tampoco arden con el aire de la habitación.", { visual: chunk({ look: "#2b2b2b", name: "Carbono" }) }),
      acido: pack("acido", "El ácido diluido no disuelve el carbono.", "No hay burbujas ni una sustancia nueva.", { visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.55, solid: "#2b2b2b" } })
    },
    N: {
      calor: pack("calor", "Un mechero escolar no lo transforma.", "El N₂ es muy estable. Solo a temperaturas altísimas forma óxidos, y eso no ocurre aquí.", { visual: gas({ symbol: "N" }) }),
      agua: pack("agua", "Se disuelve poquísimo y no reacciona.", "Sigue siendo nitrógeno.", { visual: gas({ symbol: "N" }) }),
      aire: pack("aire", "Ya es la mayor parte del aire.", "Por eso el aire, en conjunto, no es combustible.", { visual: gas({ symbol: "N" }, "#eef2ff") }),
      acido: pack("acido", "No reacciona con ácidos diluidos.", "Hace falta química industrial para convertir N₂ en amoníaco.", { visual: gas({ symbol: "N" }) })
    },
    O: {
      calor: pack("calor", "El oxígeno no arde. Hace que otras cosas ardan con más fuerza.", "Una astilla en oxígeno puro se inflama mejor que en el aire. No intentes generar oxígeno en casa.", { visual: { vessel: "burner", flame: "#fff4e0", caption: "Aviva otras llamas" } }),
      agua: pack("agua", "Se disuelve un poco. Gracias a eso los peces respiran.", "No hay una reacción química llamativa.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.62, bubbles: 1, gas: "O₂" } }),
      aire: pack("aire", "Es el 21 % del aire que ya te rodea.", "El resto es, sobre todo, nitrógeno.", { visual: gas({ symbol: "O" }) }),
      acido: pack("acido", "No reacciona con el ácido diluido.", "El oxígeno no se comporta como un metal activo.", { visual: gas({ symbol: "O" }) })
    },
    F: "locked",
    Ne: null,
    Na: null,
    Mg: {
      calor: pack("calor", "Arde con una luz blanca fortísima y queda un polvo blanco.", "Ese polvo es óxido de magnesio. En el laboratorio real no se mira la llama de frente.", { equation: "2Mg + O₂ → 2MgO", safety: "Simulación. La luz real puede dañar la vista.", visual: { vessel: "burner", flame: "#f7fbff", caption: "Luz blanca" } }),
      agua: pack("agua", "Con agua fría casi no se nota nada.", "Con vapor de agua, a alta temperatura, sí reacciona. Eso ya es ampliación.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.6, solid: "#d9ddd8" } }),
      aire: pack("aire", "Pierde brillo poco a poco.", "Se forma una capa fina de óxido.", { visual: chunk({ look: "#d9ddd8", name: "Magnesio" }) }),
      acido: pack("acido", "Suben muchas burbujas y el vaso se calienta.", "El magnesio está muy por encima del hidrógeno en la serie de actividad.", { equation: "Mg + 2HCl → MgCl₂ + H₂", safety: "El hidrógeno es inflamable. En clase se usa poco metal y ácido diluido.", visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.58, bubbles: 3, gas: "H₂" } })
    },
    Al: {
      calor: pack("calor", "Una lámina se calienta y puede fundir cerca de 660 °C, pero no arde con facilidad.", "La capa de óxido frena la reacción con el aire.", { visual: chunk({ look: "#dfe3e6", name: "Aluminio" }, { glow: true }) }),
      agua: pack("agua", "No se disuelve ni burbujea.", "El óxido de aluminio de la superficie lo protege.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.58, solid: "#dfe3e6" } }),
      aire: pack("aire", "Parece que no le pasa nada.", "En realidad ya está cubierto de Al₂O₃, una capa transparente que impide que la oxidación siga.", { visual: chunk({ look: "#dfe3e6", name: "Aluminio" }) }),
      acido: pack("acido", "Tras un momento aparecen burbujas de hidrógeno.", "También reacciona con hidróxido de sodio. Un metal que reacciona con ácidos y con bases se llama anfótero.", { equation: "2Al + 6HCl → 2AlCl₃ + 3H₂", visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.58, bubbles: 2, gas: "H₂" } })
    },
    Si: {
      calor: pack("calor", "Un trozo de silicio no cambia con un mechero escolar.", "Hace falta mucha más energía para alterarlo de forma visible.", { visual: chunk({ look: "#8d8580", name: "Silicio" }) }),
      agua: pack("agua", "No reacciona con el agua.", "La arena, que es SiO₂, tampoco se disuelve.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.55, solid: "#8d8580" } }),
      aire: pack("aire", "En frío permanece igual.", "Por eso sirve para fabricar chips estables.", { visual: chunk({ look: "#8d8580", name: "Silicio" }) }),
      acido: pack("acido", "El ácido diluido no lo ataca de forma visible.", "No es un metal activo.", { visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.55, solid: "#8d8580" } })
    },
    P: "locked",
    S: {
      calor: pack("calor", "Funde y, si arde, la llama es azul y aparece un gas que pica en la nariz.", "Ese gas es dióxido de azufre. En un laboratorio real se haría en campana.", { equation: "S + O₂ → SO₂", safety: "Simulación. El SO₂ irrita las vías respiratorias.", visual: { vessel: "burner", flame: "#7ec8ff", caption: "Llama azul" } }),
      agua: pack("agua", "No se disuelve. El polvo amarillo queda en el fondo.", "Azufre y agua no dan una sustancia nueva a temperatura ambiente.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.58, solid: "#e6d45c" } }),
      aire: pack("aire", "En frío conserva el color amarillo.", "Solo cambia de verdad cuando se quema.", { visual: chunk({ look: "#e6d45c", name: "Azufre" }) }),
      acido: pack("acido", "El ácido diluido no reacciona con el azufre.", "Sigue siendo un sólido amarillo.", { visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.55, solid: "#e6d45c" } })
    },
    Cl: "locked",
    Ar: null,
    K: null,
    Ca: {
      calor: pack("calor", "Se calienta y puede dar una llama rojo ladrillo.", "En el aire caliente forma óxido de calcio.", { visual: { vessel: "burner", flame: "#ff8a3d", caption: "Rojo ladrillo" } }),
      agua: pack("agua", "Aparecen burbujas y el agua se pone turbia.", "Se forma hidróxido de calcio, poco soluble, e hidrógeno.", { equation: "Ca + 2H₂O → Ca(OH)₂ + H₂", safety: "El calcio metálico no es la cal de la obra. La reacción real la hace un docente.", visual: { vessel: "beaker", liquid: "#e7eef2", level: 0.6, bubbles: 2, gas: "H₂", precipitate: "#f4f7fb" } }),
      aire: pack("aire", "La superficie se empaña.", "Pasa a óxido y, con el tiempo, a hidróxido y carbonato.", { visual: chunk({ look: "#ddd8d0", name: "Calcio" }) }),
      acido: pack("acido", "La reacción es más rápida que con el agua: muchas burbujas.", "Otra vez se desprende hidrógeno.", { equation: "Ca + 2HCl → CaCl₂ + H₂", visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.58, bubbles: 3, gas: "H₂" } })
    },
    Fe: {
      calor: pack("calor", "Un clavo se pone al rojo, pero no desaparece.", "En alambre fino sí puede arder y saltar chispas. El trozo grande solo se calienta.", { visual: chunk({ look: "#8e98a3", name: "Hierro" }, { glow: true }) }),
      agua: pack("agua", "En unos minutos no ves gran cosa.", "La herrumbre necesita agua y oxígeno, y tarda. Sin oxígeno, el hierro y el agua casi no reaccionan.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.58, solid: "#8e98a3" } }),
      aire: pack("aire", "Con el aire húmedo aparecen manchas naranjas.", "Esa herrumbre es un óxido hidratado. Se desprende y el hierro sigue oxidándose por debajo.", { equation: "4Fe + 3O₂ + agua → herrumbre", visual: chunk({ look: "#8e98a3", name: "Hierro" }, { rust: true }) }),
      acido: pack("acido", "Salen burbujas despacio y la disolución puede teñirse de verde pálido.", "El hierro sí está por encima del hidrógeno en la serie de actividad.", { equation: "Fe + 2HCl → FeCl₂ + H₂", visual: { vessel: "beaker", liquid: "#d5e2c4", level: 0.58, bubbles: 1, gas: "H₂" } })
    },
    Cu: {
      calor: pack("calor", "La superficie se vuelve negra.", "Ese negro es óxido de cobre(II).", { equation: "2Cu + O₂ → 2CuO", visual: chunk({ look: "#2a2422", name: "Cobre caliente" }) }),
      agua: pack("agua", "No pasa nada visible.", "El cobre no reacciona con el agua.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.58, solid: "#c4784a" } }),
      aire: pack("aire", "Tardará mucho, pero a la intemperie puede ponerse verde.", "Esa pátina es un carbonato básico, la misma idea que la de algunas cúpulas antiguas.", { visual: chunk({ look: "#c4784a", name: "Cobre" }, { rust: true, rustColor: "#3f8f72" }) }),
      acido: pack("acido", "No hay burbujas.", "El cobre está debajo del hidrógeno. El ácido clorhídrico diluido no lo disuelve.", { visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.55, solid: "#c4784a" } })
    },
    Zn: {
      calor: pack("calor", "Si se calienta fuerte en el aire, aparece un polvo blanco.", "Es óxido de zinc. En frío no lo ves formarse.", { equation: "2Zn + O₂ → 2ZnO", visual: chunk({ look: "#f4f7fb", name: "Óxido de zinc" }) }),
      agua: pack("agua", "No reacciona con el agua fría.", "Hace falta ácido, o una base fuerte, para ver un cambio claro.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.58, solid: "#d5dbdf" } }),
      aire: pack("aire", "Se oscurece muy poco.", "La capa de óxido es fina.", { visual: chunk({ look: "#d5dbdf", name: "Zinc" }) }),
      acido: pack("acido", "Burbujas constantes de hidrógeno.", "El zinc desplaza al hidrógeno del ácido. Por eso se usó en pilas antiguas.", { equation: "Zn + 2HCl → ZnCl₂ + H₂", visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.58, bubbles: 2, gas: "H₂" } })
    },
    Ga: {
      calor: pack("calor", "Se derrite cerca de 30 °C, casi a la temperatura de la mano.", "Sigue siendo galio, solo cambia de estado. No es una reacción química.", { visual: { vessel: "beaker", liquid: "#d9dde2", level: 0.35 } }),
      agua: pack("agua", "El líquido o el sólido no reaccionan con el agua de forma visible.", "No es un metal alcalino.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.5, solid: "#d9dde2" } }),
      aire: pack("aire", "No cambia a simple vista.", "No hace falta guardarlo bajo aceite.", { visual: chunk({ look: "#d9dde2", name: "Galio" }) }),
      acido: pack("acido", "Puede reaccionar, pero no es un ensayo de secundaria.", "Con esta simulación basta saber que es un metal del grupo del aluminio.", { visual: chunk({ look: "#d9dde2", name: "Galio" }) })
    },
    Cr: {
      calor: pack("calor", "Se calienta y conserva el brillo.", "Su óxido superficial es protector, al revés que la herrumbre.", { visual: chunk({ look: "#d5d8dc", name: "Cromo" }, { glow: true }) }),
      agua: pack("agua", "No reacciona.", "Por eso se usa para recubrir metales.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.55, solid: "#d5d8dc" } }),
      aire: pack("aire", "Sigue brillante.", "La capa de óxido es invisible y está bien pegada.", { visual: chunk({ look: "#d5d8dc", name: "Cromo" }) }),
      acido: pack("acido", "El ácido diluido casi no lo ataca.", "La capa protectora frena la reacción.", { visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.55, solid: "#d5d8dc" } })
    },
    Mn: {
      calor: pack("calor", "Se calienta sin un cambio llamativo en un trozo grande.", "Los colores vistosos del manganeso están en sus compuestos, no en el metal.", { visual: chunk({ look: "#b9b3ae", name: "Manganeso" }, { glow: true }) }),
      agua: pack("agua", "No reacciona con el agua fría.", "Hace falta ácido para ver burbujas.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.55, solid: "#b9b3ae" } }),
      aire: pack("aire", "Puede oscurecerse en la superficie.", "Es una oxidación lenta.", { visual: chunk({ look: "#b9b3ae", name: "Manganeso" }) }),
      acido: pack("acido", "Aparecen burbujas de hidrógeno.", "El manganeso está por encima del hidrógeno en la serie de actividad.", { equation: "Mn + 2HCl → MnCl₂ + H₂", visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.58, bubbles: 2, gas: "H₂" } })
    },
    As: "locked",
    Se: "locked",
    Br: "locked",
    Ti: {
      calor: pack("calor", "Se calienta y no pierde su resistencia.", "Hace falta un ataque químico mucho más fuerte que un mechero para notarlo.", { visual: chunk({ look: "#cfd5d8", name: "Titanio" }) }),
      agua: pack("agua", "No le pasa nada.", "Por eso se usa en implantes.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.55, solid: "#cfd5d8" } }),
      aire: pack("aire", "Sigue igual a simple vista.", "El óxido de titanio lo sella.", { visual: chunk({ look: "#cfd5d8", name: "Titanio" }) }),
      acido: pack("acido", "El ácido diluido del cole no lo disuelve.", "Es un metal poco reactivo en estas condiciones.", { visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.55, solid: "#cfd5d8" } })
    }
  };

  function locked(el) {
    return {
      title: "Sin ensayo",
      observation: el.name + " no se manipula en un laboratorio de secundaria.",
      explanation: el.about,
      equation: "",
      safety: "Solo lo consultamos en la tabla. La simulación no enseña cómo obtenerlo ni cómo mezclarlo.",
      visual: { vessel: "gasjar", tint: "#f6f1ea", label: el.symbol },
      locked: true
    };
  }

  function noble(el, testId) {
    var why = "Los gases nobles tienen la última capa llena y casi no reaccionan.";
    if (testId === "calor" && el.symbol === "Ne") {
      return pack(testId, "Calentarlo con un mechero no lo hace brillar.", "La luz rojiza de los carteles aparece cuando una descarga eléctrica atraviesa el gas.", { visual: gas(el, "#ffd9d4") });
    }
    return pack(testId, "No hay reacción química.", why, { visual: gas(el, "#f3e9ff") });
  }

  function alkali(el, testId) {
    var flame = { Li: ["#ff4d6a", "carmín"], Na: ["#ffe14a", "amarilla"], K: ["#d7a0ff", "violeta"] }[el.symbol];
    var force = { Li: "Reacciona, pero menos que el sodio.", Na: "Se desplaza por la superficie y el hidrógeno puede encenderse.", K: "Aún más rápida: el hidrógeno se enciende enseguida." }[el.symbol];
    var safety = "En la realidad, si se muestra, es una demostración breve del docente. Aquí no hay cantidades ni pasos para repetirlo.";
    if (testId === "calor") {
      return pack(testId, "Se funde con facilidad y la llama se ve " + flame[1] + ".", "Ese color identifica al elemento en el ensayo a la llama.", { visual: { vessel: "burner", flame: flame[0], caption: "Llama " + flame[1] }, safety: safety });
    }
    if (testId === "agua") {
      return pack(testId, force + " La disolución queda básica.", "El metal cede su electrón externo con facilidad.", { equation: "2" + el.symbol + " + 2H₂O → 2" + el.symbol + "OH + H₂", safety: safety, visual: { vessel: "beaker", liquid: "#e7eef2", level: 0.62, bubbles: el.symbol === "Li" ? 2 : 3, gas: "H₂", flame: el.symbol === "Li" ? "" : flame[0] } });
    }
    if (testId === "aire") {
      return pack(testId, "La superficie se pone mate enseguida.", "Por eso estos metales se guardan bajo aceite, lejos de la humedad.", { safety: safety, visual: chunk(el) });
    }
    return pack(testId, "Con ácido sería aún más violenta que con agua.", "En secundaria no se junta metal alcalino con ácido. La simulación se detiene aquí.", { safety: safety, visual: { vessel: "gasjar", tint: "#fff1f0", label: "!" } });
  }

  function genericMetal(el, testId) {
    if (testId === "calor") return pack(testId, "El trozo se calienta y sigue siendo el mismo metal.", "Fundir estos metales exige temperaturas muy altas.", { visual: chunk(el, { glow: true }) });
    if (testId === "agua") return pack(testId, "No hay burbujas ni disolución.", "Este metal no reacciona con el agua fría.", { visual: { vessel: "beaker", liquid: "#d5e6ef", level: 0.55, solid: el.look } });
    if (testId === "aire") return pack(testId, "Como mucho se oscurece un poco la superficie.", "Si hay oxidación, es lenta.", { visual: chunk(el) });
    var reacts = el.symbol === "Ni";
    if (reacts) return pack(testId, "Puede soltar algo de hidrógeno, muy despacio.", "Es menos activo que el hierro.", { visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.55, bubbles: 1, gas: "H₂", solid: el.look } });
    return pack(testId, "No ves un cambio claro con ácido diluido.", "En secundaria no hace falta forzar esta reacción.", { visual: { vessel: "beaker", liquid: "#e7f0c8", level: 0.55, solid: el.look } });
  }

  function genericMetalloid(el, testId) {
    return pack(testId, "No hay un cambio visible en condiciones de secundaria.", el.name + " se estudia sobre todo como metaloide semiconductor.", { visual: chunk(el) });
  }

  AQ.elementBySymbol = function (symbol) {
    return AQ.ELEMENTS.filter(function (el) { return el.symbol === symbol; })[0];
  };

  AQ.elementTest = function (el, testId) {
    var custom = CUSTOM[el.symbol];
    if (custom === "locked") return locked(el);
    if (custom && custom[testId]) return custom[testId];
    if (el.family === "noble") return noble(el, testId);
    if (el.category === "metal alcalino") return alkali(el, testId);
    if (el.family === "metaloide") return genericMetalloid(el, testId);
    if (el.family === "metal") return genericMetal(el, testId);
    return pack(testId, "No se observa una reacción propia de un laboratorio escolar.", el.about, { visual: el.state === "gas" ? gas(el) : chunk(el) });
  };
})();
