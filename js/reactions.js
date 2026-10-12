(function () {
  var AQ = window.AQ = window.AQ || {};

  AQ.REAGENTS = {
    agua: { id: "agua", name: "Agua", formula: "H₂O", group: "Disoluciones", color: "#d5e6ef", ph: 7, soluble: true, blurb: "Disolvente. A 25 °C es líquida y neutra." },
    hcl: { id: "hcl", name: "Ácido clorhídrico diluido", formula: "HCl", group: "Disoluciones", color: "#e7f0c8", ph: 1, soluble: true, blurb: "Ácido fuerte ya diluido. En la realidad es corrosivo." },
    naoh: { id: "naoh", name: "Hidróxido de sodio", formula: "NaOH", group: "Disoluciones", color: "#f4f0e6", ph: 13, soluble: true, blurb: "Base fuerte. Al disolverla, la disolución se calienta." },
    vinagre: { id: "vinagre", name: "Vinagre", formula: "CH₃COOH", group: "Disoluciones", color: "#f3efd4", ph: 3, soluble: true, blurb: "Ácido acético diluido, el ácido débil de la cocina." },
    bicarbonato: { id: "bicarbonato", name: "Bicarbonato de sodio", formula: "NaHCO₃", group: "Sólidos", color: "#f7f7f2", ph: 8.3, soluble: true, powder: true, blurb: "Sólido blanco. En agua da una disolución algo básica." },
    nacl: { id: "nacl", name: "Sal común", formula: "NaCl", group: "Sólidos", color: "#f7f7f2", ph: 7, soluble: true, powder: true, blurb: "Cloruro de sodio. Se disuelve sin formar una sustancia nueva." },
    caco3: { id: "caco3", name: "Carbonato de calcio", formula: "CaCO₃", group: "Sólidos", color: "#f4f1ea", ph: 7, soluble: false, powder: true, blurb: "La caliza y la cáscara de huevo. No se disuelve en agua." },
    cuso4: { id: "cuso4", name: "Sulfato de cobre(II)", formula: "CuSO₄", group: "Sólidos", color: "#2f7de1", ph: 4, soluble: true, powder: true, blurb: "Cristales azules. En agua dan una disolución azul." },
    agno3: { id: "agno3", name: "Nitrato de plata", formula: "AgNO₃", group: "Sólidos", color: "#f7f7f2", ph: 6, soluble: true, powder: true, blurb: "Reactivo de laboratorio. Aquí solo se simula: mancha la piel de verdad." },
    magnesio: { id: "magnesio", name: "Magnesio", formula: "Mg", group: "Metales", color: "#d9ddd8", ph: null, soluble: false, metal: true, blurb: "Metal del grupo 2, bastante activo." },
    zinc: { id: "zinc", name: "Zinc", formula: "Zn", group: "Metales", color: "#d5dbdf", ph: null, soluble: false, metal: true, blurb: "Metal activo. También reacciona con bases fuertes." },
    hierro: { id: "hierro", name: "Hierro", formula: "Fe", group: "Metales", color: "#8e98a3", ph: null, soluble: false, metal: true, blurb: "Se oxida con aire húmedo y desplaza al cobre." },
    cobre: { id: "cobre", name: "Cobre", formula: "Cu", group: "Metales", color: "#c4784a", ph: null, soluble: false, metal: true, blurb: "Metal poco activo. No suelta hidrógeno con ácidos diluidos." },
    h2o2: { id: "h2o2", name: "Agua oxigenada", formula: "H₂O₂", group: "Otros", color: "#eef6f8", ph: 6, soluble: true, blurb: "Se descompone en agua y oxígeno, muy lento si está sola." },
    papa: { id: "papa", name: "Papa", formula: "catalasa", group: "Otros", color: "#e2c48a", ph: null, soluble: false, powder: true, blurb: "Lleva la enzima catalasa, un catalizador biológico." },
    almidon: { id: "almidon", name: "Almidón", formula: "(C₆H₁₀O₅)ₙ", group: "Otros", color: "#f7f4ea", ph: 7, suspension: true, soluble: false, powder: true, blurb: "Polvo blanco de patata o maíz. Con yodo se pone azul oscuro." },
    yodo: { id: "yodo", name: "Yodo en disolución", formula: "I₂", group: "Otros", color: "#c48a3a", ph: 6, soluble: true, blurb: "Disolución marrón, la de un laboratorio escolar, no yodo sólido puro." },
    etanol: { id: "etanol", name: "Etanol", formula: "C₂H₅OH", group: "Otros", color: "#f4f7f8", ph: 7, miscible: true, flammable: true, blurb: "Alcohol. Se mezcla con el agua y puede arder." },
    aceite: { id: "aceite", name: "Aceite", formula: "mezcla", group: "Otros", color: "#e6c85a", ph: null, oil: true, blurb: "No se mezcla con el agua: forma otra capa." },
    carbon: { id: "carbon", name: "Carbón", formula: "C", group: "Otros", color: "#2b2b2b", ph: null, soluble: false, flammable: true, powder: true, blurb: "Carbono casi puro. Arde y da dióxido de carbono." }
  };

  AQ.SHELF = [
    { title: "Disoluciones", ids: ["agua", "hcl", "naoh", "vinagre"] },
    { title: "Sólidos", ids: ["bicarbonato", "nacl", "caco3", "cuso4", "agno3"] },
    { title: "Metales", ids: ["magnesio", "zinc", "hierro", "cobre"] },
    { title: "Otros", ids: ["h2o2", "papa", "almidon", "yodo", "etanol", "aceite", "carbon"] }
  ];

  function beaker(opts) {
    var v = { vessel: "beaker", liquid: "#d5e6ef", level: 0.6, bubbles: 0 };
    Object.keys(opts || {}).forEach(function (k) { v[k] = opts[k]; });
    return v;
  }

  function result(partial) {
    return {
      title: partial.title,
      observation: partial.observation,
      explanation: partial.explanation,
      equation: partial.equation || "",
      type: partial.type,
      ph: partial.ph == null ? null : partial.ph,
      visual: partial.visual,
      conserve: partial.equation ? "Los átomos cuadran a ambos lados: la masa se conserva." : ""
    };
  }

  var gasNote = " Si el vaso está abierto el gas se va y parece que falta masa. En un recipiente cerrado la masa no cambia.";

  var REACTIONS = {
    "bicarbonato|vinagre": result({
      title: "Burbujas de dióxido de carbono",
      observation: "El sólido desaparece entre espuma. El gas no se ve, pero empuja el líquido.",
      explanation: "El ácido del vinagre reacciona con el hidrogenocarbonato y libera CO₂." + gasNote,
      equation: "CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂",
      type: "Ácido-base con desprendimiento de gas",
      ph: 6,
      visual: beaker({ liquid: "#f3efd4", bubbles: 3, gas: "CO₂", foam: true })
    }),
    "hcl|naoh": result({
      title: "Neutralización",
      observation: "No cambia el color, pero el vaso se entibia. Si había fenolftaleína rosa, se vuelve incolora.",
      explanation: "Los iones H⁺ y OH⁻ se unen y forman agua. Queda cloruro de sodio disuelto.",
      equation: "HCl + NaOH → NaCl + H₂O",
      type: "Neutralización",
      ph: 7,
      visual: beaker({ liquid: "#e7eef2", level: 0.66 })
    }),
    "bicarbonato|hcl": result({
      title: "El ácido vence al bicarbonato",
      observation: "Muchas burbujas, más rápidas que con el vinagre.",
      explanation: "Un ácido fuerte también desplaza al CO₂ del bicarbonato." + gasNote,
      equation: "HCl + NaHCO₃ → NaCl + H₂O + CO₂",
      type: "Ácido-base con desprendimiento de gas",
      ph: 3,
      visual: beaker({ liquid: "#e7f0c8", bubbles: 3, gas: "CO₂", foam: true })
    }),
    "caco3|hcl": result({
      title: "La caliza se disuelve",
      observation: "El sólido blanco mengua y suben burbujas.",
      explanation: "Los carbonatos reaccionan con los ácidos y sueltan CO₂. Pasa con la cáscara de huevo y con el mármol." + gasNote,
      equation: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂",
      type: "Ácido-base con desprendimiento de gas",
      ph: 2,
      visual: beaker({ liquid: "#e7f0c8", bubbles: 2, gas: "CO₂", solid: "#f4f1ea" })
    }),
    "caco3|vinagre": result({
      title: "Burbujas lentas",
      observation: "La caliza burbujea despacio. Con vinagre tarda más que con ácido clorhídrico.",
      explanation: "El ácido acético es débil, pero basta para atacar un carbonato." + gasNote,
      equation: "CaCO₃ + 2CH₃COOH → (CH₃COO)₂Ca + H₂O + CO₂",
      type: "Ácido-base con desprendimiento de gas",
      ph: 4,
      visual: beaker({ liquid: "#f3efd4", bubbles: 1, gas: "CO₂", solid: "#f4f1ea" })
    }),
    "hcl|magnesio": result({
      title: "Hidrógeno a borbotones",
      observation: "El metal desaparece rápido, el vaso se calienta y hay muchas burbujas.",
      explanation: "El magnesio está muy arriba en la serie de actividad, por encima del hidrógeno." + gasNote,
      equation: "Mg + 2HCl → MgCl₂ + H₂",
      type: "Desplazamiento simple",
      ph: 1,
      visual: beaker({ liquid: "#e7f0c8", bubbles: 3, gas: "H₂" })
    }),
    "hcl|zinc": result({
      title: "El zinc suelta hidrógeno",
      observation: "Burbujas constantes. El metal se consume poco a poco.",
      explanation: "El zinc desplaza al hidrógeno del ácido.",
      equation: "Zn + 2HCl → ZnCl₂ + H₂",
      type: "Desplazamiento simple",
      ph: 1,
      visual: beaker({ liquid: "#e7f0c8", bubbles: 2, gas: "H₂", solid: "#d5dbdf" })
    }),
    "hcl|hierro": result({
      title: "Burbujas lentas",
      observation: "El hierro burbujea menos que el zinc. La disolución puede ponerse verde pálido.",
      explanation: "También está por encima del hidrógeno, pero es menos activo que el zinc y el magnesio.",
      equation: "Fe + 2HCl → FeCl₂ + H₂",
      type: "Desplazamiento simple",
      ph: 1,
      visual: beaker({ liquid: "#d5e2c4", bubbles: 1, gas: "H₂", solid: "#8e98a3" })
    }),
    "cobre|hcl": result({
      title: "El cobre se queda igual",
      observation: "Ni burbujas ni cambio de color.",
      explanation: "El cobre está debajo del hidrógeno en la serie de actividad. Un ácido diluido no le arranca electrones.",
      type: "Sin cambio químico",
      ph: 1,
      visual: beaker({ liquid: "#e7f0c8", solid: "#c4784a" })
    }),
    "magnesio|vinagre": result({
      title: "Burbujas suaves",
      observation: "El vinagre ataca al magnesio, aunque más despacio que el ácido clorhídrico.",
      explanation: "Sigue siendo un metal activo frente a un ácido, aunque el ácido sea débil.",
      equation: "Mg + 2CH₃COOH → (CH₃COO)₂Mg + H₂",
      type: "Desplazamiento simple",
      ph: 4,
      visual: beaker({ liquid: "#f3efd4", bubbles: 1, gas: "H₂", solid: "#d9ddd8" })
    }),
    "cuso4|naoh": result({
      title: "Precipitado azul",
      observation: "Cae un sólido gelatinoso azul.",
      explanation: "El hidróxido de cobre(II) no se disuelve. Es un doble desplazamiento.",
      equation: "CuSO₄ + 2NaOH → Cu(OH)₂ + Na₂SO₄",
      type: "Doble desplazamiento (precipitación)",
      ph: 12,
      visual: beaker({ liquid: "#d5e4f2", precipitate: "#2a6fbe" })
    }),
    "agno3|naoh": result({
      title: "Sólido marrón",
      observation: "Aparece un precipitado marrón oscuro.",
      explanation: "La plata, en medio básico, forma óxido de plata. Ampliación de secundaria.",
      equation: "2AgNO₃ + 2NaOH → Ag₂O + 2NaNO₃ + H₂O",
      type: "Doble desplazamiento (precipitación)",
      ph: 12,
      visual: beaker({ liquid: "#efe8df", precipitate: "#6b4a32" })
    }),
    "naoh|zinc": result({
      title: "El zinc también reacciona con la base",
      observation: "El metal se disuelve y aparecen burbujas.",
      explanation: "Ampliación: el zinc es anfótero, reacciona con ácidos y con bases fuertes.",
      equation: "Zn + 2NaOH + 2H₂O → Na₂[Zn(OH)₄] + H₂",
      type: "Reacción de un metal anfótero",
      ph: 13,
      visual: beaker({ liquid: "#f4f0e6", bubbles: 2, gas: "H₂" })
    }),
    "h2o2|naoh": result({
      title: "La base acelera el agua oxigenada",
      observation: "Suben burbujas de oxígeno.",
      explanation: "En medio básico el peróxido se descompone más rápido.",
      equation: "2H₂O₂ → 2H₂O + O₂",
      type: "Descomposición",
      ph: 12,
      visual: beaker({ liquid: "#f4f0e6", bubbles: 2, gas: "O₂" })
    }),
    "agno3|nacl": result({
      title: "Lluvia blanca",
      observation: "Dos líquidos casi transparentes dan un sólido blanco que cae al fondo.",
      explanation: "El cloruro de plata es insoluble. El nitrato de sodio se queda disuelto.",
      equation: "AgNO₃ + NaCl → AgCl + NaNO₃",
      type: "Doble desplazamiento (precipitación)",
      ph: 6,
      visual: beaker({ liquid: "#e7eef2", precipitate: "#f7f9fb" })
    }),
    "agno3|hcl": result({
      title: "También precipita cloruro de plata",
      observation: "Sólido blanco. El ion cloruro del ácido basta para formarlo.",
      explanation: "No hace falta que el cloruro venga de la sal de mesa.",
      equation: "AgNO₃ + HCl → AgCl + HNO₃",
      type: "Doble desplazamiento (precipitación)",
      ph: 2,
      visual: beaker({ liquid: "#e7eef2", precipitate: "#f7f9fb" })
    }),
    "agno3|cobre": result({
      title: "El cobre se viste de plata",
      observation: "Sobre el cobre crece un sólido gris brillante y la disolución se vuelve azul.",
      explanation: "El cobre es más activo que la plata y la desplaza.",
      equation: "Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag",
      type: "Desplazamiento simple",
      ph: 5,
      visual: beaker({ liquid: "#8eb7e8", deposit: "#d9dde3", solid: "#c4784a" })
    }),
    "agno3|zinc": result({
      title: "Plata sobre el zinc",
      observation: "El zinc se oscurece con un depósito gris y la reacción es más viva que con el cobre.",
      explanation: "El zinc está todavía más arriba en la serie de actividad.",
      equation: "Zn + 2AgNO₃ → Zn(NO₃)₂ + 2Ag",
      type: "Desplazamiento simple",
      ph: 5,
      visual: beaker({ liquid: "#e7eef2", deposit: "#d9dde3" })
    }),
    "agno3|hierro": result({
      title: "Plata sobre el hierro",
      observation: "El clavo se cubre de un sólido gris.",
      explanation: "El hierro desplaza a la plata de su sal.",
      equation: "Fe + 2AgNO₃ → Fe(NO₃)₂ + 2Ag",
      type: "Desplazamiento simple",
      ph: 5,
      visual: beaker({ liquid: "#e7eef2", deposit: "#d9dde3", solid: "#8e98a3" })
    }),
    "agno3|magnesio": result({
      title: "Desplazamiento rápido",
      observation: "El magnesio desplaza a la plata y hay bastante movimiento en el vaso.",
      explanation: "Cuanto más arriba está el metal, más fácil le resulta desplazar a otro.",
      equation: "Mg + 2AgNO₃ → Mg(NO₃)₂ + 2Ag",
      type: "Desplazamiento simple",
      ph: 5,
      visual: beaker({ liquid: "#e7eef2", bubbles: 1, deposit: "#d9dde3" })
    }),
    "cuso4|hierro": result({
      title: "El clavo se vuelve de cobre",
      observation: "El azul se aclara hacia verde y el hierro se cubre de un sólido rojizo.",
      explanation: "El hierro es más activo que el cobre, así que lo expulsa de la disolución.",
      equation: "Fe + CuSO₄ → FeSO₄ + Cu",
      type: "Desplazamiento simple",
      ph: 4,
      visual: beaker({ liquid: "#9fbe8a", deposit: "#c4622d", solid: "#8e98a3" })
    }),
    "cuso4|zinc": result({
      title: "Cobre sobre el zinc",
      observation: "Aparece un depósito rojizo y el azul pierde fuerza.",
      explanation: "El zinc también está por encima del cobre.",
      equation: "Zn + CuSO₄ → ZnSO₄ + Cu",
      type: "Desplazamiento simple",
      ph: 4,
      visual: beaker({ liquid: "#c5d4ea", deposit: "#c4622d" })
    }),
    "cuso4|magnesio": result({
      title: "Cobre todavía más rápido",
      observation: "El magnesio se cubre de cobre enseguida y la disolución se decolora más.",
      explanation: "El magnesio es más activo que el zinc y que el hierro.",
      equation: "Mg + CuSO₄ → MgSO₄ + Cu",
      type: "Desplazamiento simple",
      ph: 4,
      visual: beaker({ liquid: "#d5e4f2", deposit: "#c4622d" })
    }),
    "cobre|cuso4": result({
      title: "Nada que desplazar",
      observation: "El cobre sigue cobrizo dentro de su propia disolución azul.",
      explanation: "Un metal no se desplaza a sí mismo.",
      type: "Sin cambio químico",
      ph: 4,
      visual: beaker({ liquid: "#2f7de1", solid: "#c4784a" })
    }),
    "bicarbonato|cuso4": result({
      title: "Sólido azul verdoso",
      observation: "Hay burbujas y un precipitado azul verdoso.",
      explanation: "El ion cobre(II) forma un carbonato insoluble. Versión simplificada de secundaria.",
      equation: "CuSO₄ + 2NaHCO₃ → CuCO₃ + Na₂SO₄ + H₂O + CO₂",
      type: "Doble desplazamiento (precipitación)",
      ph: 6,
      visual: beaker({ liquid: "#d5e6ef", precipitate: "#2f8f8a", bubbles: 1, gas: "CO₂" })
    }),
    "h2o2|papa": result({
      title: "Espuma de oxígeno",
      observation: "En cuanto tocan, sube una espuma blanca de burbujas.",
      explanation: "La catalasa de la papa acelera la descomposición. La papa no se gasta: es el catalizador.",
      equation: "2H₂O₂ → 2H₂O + O₂",
      type: "Descomposición",
      ph: 6,
      visual: beaker({ liquid: "#f7f4ea", bubbles: 3, gas: "O₂", foam: true })
    }),
    "almidon|yodo": result({
      title: "Azul casi negro",
      observation: "El marrón del yodo desaparece y todo se vuelve azul muy oscuro.",
      explanation: "El yodo entra en las espirales del almidón. Sirve para detectar almidón en pan o papa. No es una sal nueva.",
      type: "Ensayo de reconocimiento",
      ph: 6,
      visual: beaker({ liquid: "#1d2a44", level: 0.62 })
    }),
    "aceite|agua": result({
      title: "Dos capas",
      observation: "El aceite flota. Por mucho que agites, al rato se separan.",
      explanation: "Es una mezcla heterogénea. No aparece una sustancia nueva.",
      type: "Mezcla",
      ph: null,
      visual: beaker({ liquid: "#d5e6ef", level: 0.62, top: "#e6c85a", topSize: 0.34 })
    }),
    "naoh|yodo": result({
      title: "Se va el color marrón",
      observation: "La disolución de yodo pierde el color.",
      explanation: "Ampliación: en una base el yodo se transforma en otras sales incoloras. Es una redox que verás más adelante.",
      type: "Reacción redox",
      ph: 13,
      visual: beaker({ liquid: "#f4f0e6" })
    }),
    "agua|hcl": result({
      title: "El ácido queda más diluido",
      observation: "Sigue siendo ácido, solo que menos concentrado.",
      explanation: "No hay una sustancia nueva. En el laboratorio real, el ácido se vierte sobre el agua.",
      type: "Disolución",
      ph: 1.5,
      visual: beaker({ liquid: "#e7f0c8" })
    }),
    "agua|naoh": result({
      title: "Base disuelta",
      observation: "Se mezcla y el vaso se entibia un poco.",
      explanation: "Disolver hidróxido de sodio libera calor. Sigue siendo una disolución básica.",
      type: "Disolución",
      ph: 13,
      visual: beaker({ liquid: "#f4f0e6" })
    })
  };

  function keyOf(a, b) {
    return [a, b].sort().join("|");
  }

  function applyHeat(res, heated, ids) {
    if (!heated || ids.length !== 1) {
      if (!heated) return res;
      var copy0 = Object.assign({}, res);
      copy0.observation = res.observation + " Al calentar, no aparece otro producto: solo sube la temperatura.";
      return copy0;
    }
    if (ids.indexOf("etanol") >= 0) {
      return result({
        title: "El etanol arde",
        observation: "Una llama azul en la superficie. Quedan dióxido de carbono y vapor de agua.",
        explanation: "Es una combustión. Hace falta oxígeno del aire y una llama.",
        equation: "C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O",
        type: "Combustión",
        ph: null,
        visual: { vessel: "burner", flame: "#7eb8ff", caption: "Llama de etanol" }
      });
    }
    if (ids.indexOf("carbon") >= 0) {
      return result({
        title: "El carbón arde",
        observation: "Se pone al rojo y, si hay aire, se consume.",
        explanation: "Combustión del carbono.",
        equation: "C + O₂ → CO₂",
        type: "Combustión",
        ph: null,
        visual: { vessel: "burner", flame: "#ffb15a", caption: "Brasa" }
      });
    }
    if (ids.indexOf("magnesio") >= 0) {
      return result({
        title: "Luz blanca",
        observation: "El magnesio arde con una luz cegadora y deja un polvo blanco.",
        explanation: "Síntesis del óxido de magnesio. En clase no se mira de frente.",
        equation: "2Mg + O₂ → 2MgO",
        type: "Síntesis",
        ph: null,
        visual: { vessel: "burner", flame: "#f7fbff", caption: "Luz blanca" }
      });
    }
    var copy = Object.assign({}, res);
    copy.observation = res.observation + " Al calentar, no aparece otro producto: solo sube la temperatura.";
    return copy;
  }

  function applyIndicator(res, on) {
    if (!on) return res;
    var copy = Object.assign({}, res);
    if (res.ph == null) {
      copy.observation += " La fenolftaleína no muestra un cambio útil aquí.";
      return copy;
    }
    if (res.ph >= 8.2) {
      copy.observation += " La fenolftaleína se vuelve rosa.";
      if (!res.visual.precipitate && !res.visual.deposit && res.visual.vessel === "beaker" && res.visual.liquid !== "#1d2a44") {
        copy.visual = Object.assign({}, res.visual, { liquid: "#f3a6c8" });
      }
    } else {
      copy.observation += " La fenolftaleína sigue incolora.";
    }
    return copy;
  }

  function fallback(a, b) {
    var A = AQ.REAGENTS[a];
    var B = AQ.REAGENTS[b];
    var water = A.id === "agua" ? B : B.id === "agua" ? A : null;
    if (A.oil || B.oil) {
      return result({
        title: "No se mezclan",
        observation: "El aceite forma su propia capa. No aparece una sustancia nueva.",
        explanation: "Las sustancias de esta simulación que van en agua se quedan en la fase acuosa.",
        type: "Mezcla",
        ph: null,
        visual: beaker({ liquid: "#d5e6ef", top: "#e6c85a", topSize: 0.34, solid: (A.metal || B.metal) ? (A.metal ? A.color : B.color) : "" })
      });
    }
    if (water) {
      if (water.miscible) {
        return result({
          title: "Una sola fase",
          observation: water.name + " y el agua se mezclan sin dejar capas.",
          explanation: "Es una mezcla homogénea. Siguen siendo las mismas sustancias.",
          type: "Mezcla",
          ph: 7,
          visual: beaker({ liquid: "#e7eef2" })
        });
      }
      if (water.suspension) {
        return result({
          title: "Suspensión lechosa",
          observation: "El almidón no se disuelve del todo: el agua se ve turbia.",
          explanation: "Es una mezcla heterogénea. El ensayo azul necesita yodo.",
          type: "Mezcla",
          ph: 7,
          visual: beaker({ liquid: "#f7f4ea" })
        });
      }
      if (water.soluble) {
        return result({
          title: water.name + " se disuelve",
          observation: "Desaparece como sólido y la mezcla se ve uniforme.",
          explanation: "Disolver no es reaccionar: no se forma una sustancia nueva. Puedes recuperar el sólido evaporando el agua.",
          type: "Disolución",
          ph: water.ph,
          visual: beaker({ liquid: water.color || "#d5e6ef" })
        });
      }
      return result({
        title: "No se disuelve",
        observation: water.name + " se queda en el fondo o suspendido.",
        explanation: "Insoluble en agua fría, y tampoco hay reacción química visible.",
        type: "Mezcla",
        ph: 7,
        visual: beaker({ liquid: "#d5e6ef", solid: water.color })
      });
    }
    return result({
      title: "Sin reacción visible",
      observation: A.name + " y " + B.name + " siguen siendo ellos mismos.",
      explanation: "Para que haya un cambio químico tiene que aparecer una sustancia nueva. Aquí no se observa.",
      type: "Sin cambio químico",
      ph: A.ph != null ? A.ph : B.ph,
      visual: beaker({ liquid: A.color || "#d5e6ef", solid: B.powder || B.metal ? B.color : "" })
    });
  }

  function single(id, heated) {
    var r = AQ.REAGENTS[id];
    var res = result({
      title: r.name,
      observation: r.blurb,
      explanation: "Aún no hay una segunda sustancia. Añade otra y pulsa Mezclar, o calienta si quieres ver un cambio físico o una combustión.",
      type: "Una sola sustancia",
      ph: r.ph,
      visual: r.metal || r.powder && !r.soluble ? { vessel: "chunk", color: r.color, label: r.name } : beaker({ liquid: r.color, solid: r.powder ? r.color : "" })
    });
    return applyHeat(res, heated, [id]);
  }

  AQ.mix = function (idA, idB, heated, indicator) {
    if (!idA && !idB) {
      return result({
        title: "Vaso vacío",
        observation: "Elige una o dos sustancias de la estantería.",
        explanation: "Puedes observar una sola o mezclar dos.",
        type: "—",
        ph: null,
        visual: beaker({ liquid: "transparent", level: 0.08 })
      });
    }
    if (!idB) return applyIndicator(single(idA, heated), indicator);
    if (!idA) return applyIndicator(single(idB, heated), indicator);
    var found = REACTIONS[keyOf(idA, idB)];
    var res = found ? applyHeat(found, heated, [idA, idB]) : applyHeat(fallback(idA, idB), heated, [idA, idB]);
    return applyIndicator(res, indicator);
  };

  AQ.MATTER = [
    { id: "agua", name: "Agua", formula: "H₂O", mp: 0, bp: 100, min: -20, max: 140, color: "#7eb6d6", note: "El hielo flota: el sólido es menos denso que el líquido." },
    { id: "etanol", name: "Etanol", formula: "C₂H₅OH", mp: -114, bp: 78, min: -130, max: 120, color: "#d5e6ef", note: "Hierve antes que el agua. Por eso se puede separar de una mezcla por destilación." },
    { id: "galio", name: "Galio", formula: "Ga", mp: 30, bp: 2400, min: 0, max: 80, color: "#d9dde2", note: "Funde en la mano, cerca de 30 °C. Hervirlo queda muy lejos de un mechero escolar." },
    { id: "yodo", name: "Yodo", formula: "I₂", mp: 114, bp: 184, min: 20, max: 200, color: "#6b3a78", note: "Si se calienta con suavidad, parte pasa directo a vapor morado: eso es sublimación.", sublime: true },
    { id: "oxigeno", name: "Oxígeno", formula: "O₂", mp: -219, bp: -183, min: -230, max: -150, color: "#d7ecff", note: "A temperatura ambiente siempre es gas. Licuarlo exige mucho frío." },
    { id: "hierro", name: "Hierro", formula: "Fe", mp: 1538, bp: 2862, min: 0, max: 1700, color: "#8e98a3", note: "En clase el hierro se pone al rojo mucho antes de fundir." },
    { id: "cobre", name: "Cobre", formula: "Cu", mp: 1085, bp: 2562, min: 0, max: 1300, color: "#c4784a", note: "Funde a menos temperatura que el hierro, pero sigue haciendo falta un horno, no un vaso de precipitados." }
  ];

  AQ.SALTS = [
    { id: "na", name: "Sodio", formula: "NaCl", color: "#ffe14a", tip: "Llama amarilla intensa. Tapa casi cualquier otro color." },
    { id: "k", name: "Potasio", formula: "KCl", color: "#d7a0ff", tip: "Llama violeta. Si hay sodio, se mira a través de un vidrio azul de cobalto." },
    { id: "ca", name: "Calcio", formula: "CaCl₂", color: "#ff8a3d", tip: "Llama rojo ladrillo." },
    { id: "cu", name: "Cobre", formula: "CuCl₂", color: "#3ddea0", tip: "Llama verde." },
    { id: "li", name: "Litio", formula: "LiCl", color: "#ff4d6a", tip: "Llama carmín." },
    { id: "ba", name: "Bario", formula: "BaCl₂", color: "#8dff6a", tip: "Llama verde amarillenta. El bario está más abajo del periodo 4: es ampliación." }
  ];
})();
