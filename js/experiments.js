(function () {
  var AQ = window.AQ = window.AQ || {};

  function bk(opts) {
    var v = { vessel: "beaker", liquid: "#d5e6ef", level: 0.6, bubbles: 0 };
    Object.keys(opts).forEach(function (k) { v[k] = opts[k]; });
    return v;
  }

  AQ.EXPERIMENTS = [
    {
      id: "gas",
      kicker: "Cambio químico",
      title: "Vinagre y bicarbonato",
      summary: "Un ácido débil y un hidrogenocarbonato sueltan un gas que puedes reconocer.",
      safety: "En casa mancha y espumea. No lo cierres en un bote rígido.",
      steps: [
        { title: "El vinagre solo", body: "Es ácido acético disuelto en agua. Huele fuerte y todavía no hay gas.", visual: bk({ liquid: "#f3efd4" }) },
        { title: "Añades bicarbonato", body: "NaHCO₃ es un sólido blanco. En cuanto cae, empieza la espuma.", visual: bk({ liquid: "#f3efd4", bubbles: 3, gas: "CO₂", foam: true, solid: "#f7f7f2" }) },
        { title: "Qué gas es", body: "Ese gas apaga una astilla encendida. No es oxígeno: es dióxido de carbono.", visual: bk({ liquid: "#f3efd4", bubbles: 2, gas: "CO₂", foam: true }) },
        { title: "La ecuación", body: "CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂. Cuentas los átomos: no se pierde ninguno.", visual: bk({ liquid: "#f3efd4", bubbles: 1, gas: "CO₂" }) }
      ],
      quiz: { q: "¿Qué gas se desprende?", options: ["Oxígeno", "Dióxido de carbono", "Hidrógeno", "Nitrógeno"], answer: 1, why: "El ion hidrogenocarbonato, al encontrarse con un ácido, libera CO₂." }
    },
    {
      id: "neutral",
      kicker: "Ácidos y bases",
      title: "Neutralización con fenolftaleína",
      summary: "La fenolftaleína está rosa en una base y se vuelve incolora al llegar a neutro.",
      safety: "El hidróxido de sodio real quema la piel. Aquí está simulado.",
      steps: [
        { title: "La base, en rosa", body: "Unas gotas de fenolftaleína en NaOH dan un rosa intenso. El pH está por encima de 8,2.", visual: bk({ liquid: "#f3a6c8" }) },
        { title: "Caen gotas de ácido", body: "Cada gota de HCl consume un poco de base. El rosa aguanta mientras quede NaOH.", visual: bk({ liquid: "#f7c3d8" }) },
        { title: "Punto de neutralización", body: "Cuando se igualan los moles, el rosa desaparece. Quedan sal y agua, con pH 7.", visual: bk({ liquid: "#e7eef2" }) },
        { title: "Si te pasas", body: "Más ácido no vuelve a pintar la fenolftaleína. Ese indicador solo señala las bases, no los ácidos.", visual: bk({ liquid: "#e7f0c8" }) }
      ],
      quiz: { q: "¿Qué iones se unen para formar el agua?", options: ["Na⁺ y Cl⁻", "H⁺ y OH⁻", "Cu²⁺ y SO₄²⁻", "Ag⁺ y NO₃⁻"], answer: 1, why: "La neutralización útil es H⁺ + OH⁻ → H₂O. Na⁺ y Cl⁻ se quedan disueltos como sal." }
    },
    {
      id: "serie",
      kicker: "Serie de actividad",
      title: "¿Qué metal suelta hidrógeno?",
      summary: "Cuatro metales frente al mismo ácido diluido. No todos reaccionan.",
      safety: "El hidrógeno es inflamable. En clase se usan trozos pequeños y ácido diluido.",
      steps: [
        { title: "Magnesio", body: "Reacción rápida, vaso caliente, muchas burbujas. Mg + 2HCl → MgCl₂ + H₂.", visual: { vessel: "tubes", tubes: [{ name: "Mg", bubbles: 3, color: "#e7f0c8" }, { name: "Zn", bubbles: 0, color: "#e7f0c8" }, { name: "Fe", bubbles: 0, color: "#e7f0c8" }, { name: "Cu", bubbles: 0, color: "#e7f0c8" }] } },
        { title: "Zinc", body: "También suelta hidrógeno, más tranquilo que el magnesio.", visual: { vessel: "tubes", tubes: [{ name: "Mg", bubbles: 3, color: "#e7f0c8" }, { name: "Zn", bubbles: 2, color: "#e7f0c8" }, { name: "Fe", bubbles: 0, color: "#e7f0c8" }, { name: "Cu", bubbles: 0, color: "#e7f0c8" }] } },
        { title: "Hierro", body: "Burbujas lentas. La disolución puede teñirse de verde muy pálido.", visual: { vessel: "tubes", tubes: [{ name: "Mg", bubbles: 3, color: "#e7f0c8" }, { name: "Zn", bubbles: 2, color: "#e7f0c8" }, { name: "Fe", bubbles: 1, color: "#d5e2c4" }, { name: "Cu", bubbles: 0, color: "#e7f0c8" }] } },
        { title: "Cobre", body: "Nada. El cobre está debajo del hidrógeno y el ácido diluido no lo disuelve.", visual: { vessel: "tubes", tubes: [{ name: "Mg", bubbles: 3, color: "#e7f0c8" }, { name: "Zn", bubbles: 2, color: "#e7f0c8" }, { name: "Fe", bubbles: 1, color: "#d5e2c4" }, { name: "Cu", bubbles: 0, color: "#e7f0c8" }] } },
        { title: "El orden", body: "Mg > Zn > Fe > H > Cu. Un metal suelta hidrógeno solo si está por encima de H.", visual: { vessel: "tubes", tubes: [{ name: "Mg", bubbles: 3, color: "#e7f0c8" }, { name: "Zn", bubbles: 2, color: "#e7f0c8" }, { name: "Fe", bubbles: 1, color: "#d5e2c4" }, { name: "Cu", bubbles: 0, color: "#e7f0c8" }] } }
      ],
      quiz: { q: "¿Cuál no produce gas con ácido clorhídrico diluido?", options: ["Magnesio", "Zinc", "Hierro", "Cobre"], answer: 3, why: "El cobre queda por debajo del hidrógeno en la serie de actividad." }
    },
    {
      id: "clavo",
      kicker: "Desplazamiento",
      title: "El clavo y el sulfato de cobre",
      summary: "Un metal puede echar a otro de su disolución.",
      safety: "El sulfato de cobre es irritante. No lo viertas al desagüe en un laboratorio real.",
      steps: [
        { title: "Disolución azul", body: "CuSO₄ en agua se ve azul por los iones Cu²⁺. El clavo está limpio.", visual: bk({ liquid: "#2f7de1", solid: "#8e98a3" }) },
        { title: "Pasan los minutos", body: "El clavo se cubre de un sólido rojizo y el azul palidece.", visual: bk({ liquid: "#7ea0c9", deposit: "#c4622d", solid: "#8e98a3" }) },
        { title: "Al final", body: "La disolución tira a verde: ahora hay Fe²⁺. El cobre metálico está sobre el clavo.", visual: bk({ liquid: "#9fbe8a", deposit: "#c4622d" }) },
        { title: "La ecuación", body: "Fe + CuSO₄ → FeSO₄ + Cu. El hierro es más activo y desplaza al cobre.", visual: bk({ liquid: "#9fbe8a", deposit: "#c4622d" }) }
      ],
      quiz: { q: "¿Qué metal es más activo?", options: ["El cobre", "El hierro", "Los dos igual", "Ninguno reacciona"], answer: 1, why: "Si el hierro desplaza al cobre, el hierro está más arriba en la serie." }
    },
    {
      id: "precipitado",
      kicker: "Sales",
      title: "Una lluvia de cloruro de plata",
      summary: "Dos disoluciones transparentes pueden dar un sólido.",
      safety: "El nitrato de plata mancha la piel y la ropa. Simulación solamente.",
      steps: [
        { title: "Dos vasos claros", body: "Nitrato de plata y cloruro de sodio, cada uno disuelto, se ven casi como agua.", visual: bk({ liquid: "#e7eef2" }) },
        { title: "Los juntas", body: "Al instante cae un sólido blanco. No es hielo: es una sal insoluble.", visual: bk({ liquid: "#e7eef2", precipitate: "#f7f9fb" }) },
        { title: "Quién es el sólido", body: "AgNO₃ + NaCl → AgCl + NaNO₃. El cloruro de plata precipita; el nitrato de sodio se queda disuelto.", visual: bk({ liquid: "#e7eef2", precipitate: "#f7f9fb" }) }
      ],
      quiz: { q: "¿Cómo se llama el sólido blanco?", options: ["Cloruro de sodio", "Nitrato de plata", "Cloruro de plata", "Plata metálica"], answer: 2, why: "Ag⁺ y Cl⁻ forman AgCl, insoluble en agua." }
    },
    {
      id: "almidon",
      kicker: "Reconocimiento",
      title: "Detective de almidón",
      summary: "El yodo delata al almidón con un color imposible de confundir.",
      safety: "La disolución de yodo mancha. No hace falta yodo sólido.",
      steps: [
        { title: "Almidón en agua", body: "Una suspensión blanca, como maicena. Todavía no hay color especial.", visual: bk({ liquid: "#f7f4ea" }) },
        { title: "Yodo solo", body: "La disolución de yodo es marrón. Sin almidón se queda así.", visual: bk({ liquid: "#c48a3a" }) },
        { title: "Los dos juntos", body: "Azul casi negro. El yodo se mete en la espiral del almidón.", visual: bk({ liquid: "#1d2a44" }) },
        { title: "Para qué sirve", body: "Una gota sobre pan o papa cruda da el mismo azul. Así se reconoce el almidón.", visual: bk({ liquid: "#1d2a44" }) }
      ],
      quiz: { q: "El color azul oscuro indica que hay…", options: ["Sal", "Almidón", "Un ácido fuerte", "Cobre"], answer: 1, why: "Es el ensayo clásico del almidón con yodo." }
    },
    {
      id: "llama",
      kicker: "Cationes",
      title: "Colores del mechero",
      summary: "Algunos iones pintan la llama de un color que los identifica.",
      safety: "El mechero real lo enciende el docente. Aquí eliges la sal y ves el color.",
      steps: [
        { title: "Sodio", body: "Amarillo fortísimo. Una pizca de sal común basta para tapar otros colores.", visual: { vessel: "burner", flame: "#ffe14a", caption: "Sodio" } },
        { title: "Potasio", body: "Violeta. Si la muestra trae sodio, se observa con un vidrio azul.", visual: { vessel: "burner", flame: "#d7a0ff", caption: "Potasio" } },
        { title: "Calcio", body: "Rojo ladrillo, distinto del carmín del litio.", visual: { vessel: "burner", flame: "#ff8a3d", caption: "Calcio" } },
        { title: "Cobre", body: "Verde. Se usa una sal de cobre, no un cable.", visual: { vessel: "burner", flame: "#3ddea0", caption: "Cobre" } },
        { title: "Litio", body: "Carmín. Parecido a un rojo de feria, más rosa que el calcio.", visual: { vessel: "burner", flame: "#ff4d6a", caption: "Litio" } }
      ],
      quiz: { q: "¿Qué ion da la llama amarilla que lo tapa todo?", options: ["Potasio", "Sodio", "Cobre", "Calcio"], answer: 1, why: "El sodio emite un amarillo tan intenso que enmascara al resto." }
    },
    {
      id: "estados",
      kicker: "Materia",
      title: "El agua cambia de estado",
      summary: "Sólido, líquido y gas siguen siendo H₂O. Cambia el estado, no la sustancia.",
      safety: "El vapor quema. Esta es la versión sin ollas.",
      steps: [
        { title: "Por debajo de 0 °C", body: "Hielo. Las partículas vibran en sitios fijos. El hielo flota en el agua líquida.", visual: { vessel: "particles", mode: "solid", color: "#d7e8f4", label: "Sólido" } },
        { title: "A 0 °C", body: "Mientras funde, la temperatura no sube. El calor se gasta en separar partículas.", visual: { vessel: "particles", mode: "melt", color: "#7eb6d6", label: "Fusión" } },
        { title: "Entre 0 y 100 °C", body: "Líquido. Las partículas se mueven, pero siguen juntas.", visual: { vessel: "particles", mode: "liquid", color: "#7eb6d6", label: "Líquido" } },
        { title: "A 100 °C y por encima", body: "Ebullición y vapor, a nivel del mar. Sigue siendo agua.", visual: { vessel: "particles", mode: "gas", color: "#c5d8e6", label: "Gas" } }
      ],
      quiz: { q: "A nivel del mar, el agua hierve a…", options: ["0 °C", "50 °C", "100 °C", "212 °C"], answer: 2, why: "0 °C es la fusión. 100 °C es la ebullición a 1 atmósfera. 212 °F es esa misma ebullición en la escala Fahrenheit." }
    },
    {
      id: "electro",
      kicker: "Descomposición",
      title: "Romper el agua",
      summary: "Con corriente, el agua se separa en dos gases en proporción 2:1.",
      safety: "Es una demostración del docente. Los gases no se recogen ni se encienden por tu cuenta.",
      steps: [
        { title: "Agua con electrolito", body: "El agua pura casi no conduce. Unas gotas de electrolito dejan pasar la corriente, sin ser el protagonista.", visual: { vessel: "cell", on: false } },
        { title: "Cierras el circuito", body: "En el cátodo (negativo) salen más burbujas. En el ánodo, menos.", visual: { vessel: "cell", on: true } },
        { title: "La proporción", body: "El volumen de hidrógeno es el doble que el de oxígeno. 2H₂O → 2H₂ + O₂.", visual: { vessel: "cell", on: true } },
        { title: "Cómo se reconocen", body: "El hidrógeno hace «pop» con una astilla encendida. El oxígeno aviva la llama. Aquí solo se cuenta: no se enciende nada.", visual: { vessel: "cell", on: true, tested: true } }
      ],
      quiz: { q: "¿Qué relación hay entre el hidrógeno y el oxígeno?", options: ["El mismo volumen", "El doble de hidrógeno", "El doble de oxígeno", "Solo aparece hidrógeno"], answer: 1, why: "La ecuación 2H₂O → 2H₂ + O₂ pide dos moléculas de hidrógeno por cada una de oxígeno." }
    },
    {
      id: "masa",
      kicker: "Ley de Lavoisier",
      title: "La masa no desaparece",
      summary: "En un vaso abierto el CO₂ se escapa. Cerrado, la balanza no se mueve.",
      safety: "No tapes un recipiente rígido mientras espumea: la presión sube. En clase se usa una bolsa blanda.",
      steps: [
        { title: "Antes de mezclar", body: "Vinagre + bicarbonato pesan, juntos, 105 g. Todavía no hay reacción.", visual: { vessel: "balance", before: "105 g", after: "105 g", open: false, note: "Sistema cerrado, sin mezclar" } },
        { title: "Vaso abierto", body: "Hay burbujas y la balanza del vaso baja. El CO₂ se fue al aire. No se destruyó.", visual: { vessel: "balance", before: "105 g", after: "103 g", open: true, note: "El gas salió del vaso" } },
        { title: "Bolsa cerrada", body: "La misma reacción, pero el gas se queda dentro. Sigue marcando 105 g.", visual: { vessel: "balance", before: "105 g", after: "105 g", open: false, note: "Nada entra ni sale" } }
      ],
      quiz: { q: "En el vaso abierto, ¿adónde fue la masa que faltaba?", options: ["Se destruyó", "Se convirtió en energía que no pesa", "Salió como CO₂", "La absorbió el vidrio"], answer: 2, why: "La masa se conserva. El dióxido de carbono abandonó el vaso y pasó al aire." }
    }
  ];
})();
