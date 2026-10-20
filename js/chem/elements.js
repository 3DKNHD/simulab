(function (root) {
  var AQ = root.AQ = root.AQ || {};

  AQ.CATEGORIES = {
    alc: { name: "Metal alcalino", color: "#e8705f" },
    alct: { name: "Metal alcalinotérreo", color: "#f0a64f" },
    tr: { name: "Metal de transición", color: "#e8c766" },
    pb: { name: "Metal del bloque p", color: "#95b8d6" },
    md: { name: "Metaloide", color: "#93c573" },
    nm: { name: "No metal", color: "#5bbcae" },
    hal: { name: "Halógeno", color: "#56b0dc" },
    ng: { name: "Gas noble", color: "#a58fcc" },
    lan: { name: "Lantánido", color: "#eaa2c6" },
    act: { name: "Actínido", color: "#d895b8" },
    unk: { name: "Propiedades por confirmar", color: "#cdc6ba" }
  };

  var RAW = [
    "1|H|Hidrógeno|1.008|nm|gas|2.20|-259.1|-252.9|+1, −1",
    "2|He|Helio|4.0026|ng|gas||-272.2|-268.9|0",
    "3|Li|Litio|6.94|alc|sólido|0.98|180.5|1342|+1",
    "4|Be|Berilio|9.0122|alct|sólido|1.57|1287|2470|+2",
    "5|B|Boro|10.81|md|sólido|2.04|2076|3927|+3",
    "6|C|Carbono|12.011|nm|sólido|2.55|3550|4027|+4, +2, −4",
    "7|N|Nitrógeno|14.007|nm|gas|3.04|-210.0|-195.8|−3, +3, +5",
    "8|O|Oxígeno|15.999|nm|gas|3.44|-218.8|-183.0|−2",
    "9|F|Flúor|18.998|hal|gas|3.98|-219.7|-188.1|−1",
    "10|Ne|Neón|20.180|ng|gas||-248.6|-246.0|0",
    "11|Na|Sodio|22.990|alc|sólido|0.93|97.8|883|+1",
    "12|Mg|Magnesio|24.305|alct|sólido|1.31|650|1091|+2",
    "13|Al|Aluminio|26.982|pb|sólido|1.61|660.3|2470|+3",
    "14|Si|Silicio|28.085|md|sólido|1.90|1414|3265|+4, −4",
    "15|P|Fósforo|30.974|nm|sólido|2.19|44.1|280.5|−3, +3, +5",
    "16|S|Azufre|32.06|nm|sólido|2.58|115.2|444.6|−2, +4, +6",
    "17|Cl|Cloro|35.45|hal|gas|3.16|-101.5|-34.0|−1, +1, +3, +5, +7",
    "18|Ar|Argón|39.948|ng|gas||-189.3|-185.8|0",
    "19|K|Potasio|39.098|alc|sólido|0.82|63.5|759|+1",
    "20|Ca|Calcio|40.078|alct|sólido|1.00|842|1484|+2",
    "21|Sc|Escandio|44.956|tr|sólido|1.36|1541|2836|+3",
    "22|Ti|Titanio|47.867|tr|sólido|1.54|1668|3287|+4, +3",
    "23|V|Vanadio|50.942|tr|sólido|1.63|1910|3407|+5, +4, +3, +2",
    "24|Cr|Cromo|51.996|tr|sólido|1.66|1907|2671|+3, +6, +2",
    "25|Mn|Manganeso|54.938|tr|sólido|1.55|1246|2061|+2, +4, +7",
    "26|Fe|Hierro|55.845|tr|sólido|1.83|1538|2862|+2, +3",
    "27|Co|Cobalto|58.933|tr|sólido|1.88|1495|2927|+2, +3",
    "28|Ni|Níquel|58.693|tr|sólido|1.91|1455|2913|+2, +3",
    "29|Cu|Cobre|63.546|tr|sólido|1.90|1084.6|2562|+1, +2",
    "30|Zn|Zinc|65.38|tr|sólido|1.65|419.5|907|+2",
    "31|Ga|Galio|69.723|pb|sólido|1.81|29.8|2400|+3",
    "32|Ge|Germanio|72.630|md|sólido|2.01|938.3|2833|+4, +2",
    "33|As|Arsénico|74.922|md|sólido|2.18|817|614|+3, +5, −3",
    "34|Se|Selenio|78.971|nm|sólido|2.55|221|685|−2, +4, +6",
    "35|Br|Bromo|79.904|hal|líquido|2.96|-7.2|58.8|−1, +1, +3, +5",
    "36|Kr|Kriptón|83.798|ng|gas|3.00|-157.4|-153.4|0",
    "37|Rb|Rubidio|85.468|alc|sólido|0.82|39.3|688|+1",
    "38|Sr|Estroncio|87.62|alct|sólido|0.95|777|1382|+2",
    "39|Y|Itrio|88.906|tr|sólido|1.22|1526|3345|+3",
    "40|Zr|Circonio|91.224|tr|sólido|1.33|1855|4409|+4",
    "41|Nb|Niobio|92.906|tr|sólido|1.6|2477|4744|+5, +3",
    "42|Mo|Molibdeno|95.95|tr|sólido|2.16|2623|4639|+6, +4",
    "43|Tc|Tecnecio|98|tr|sólido|1.9|2157|4265|+7, +4",
    "44|Ru|Rutenio|101.07|tr|sólido|2.2|2334|4150|+3, +4",
    "45|Rh|Rodio|102.91|tr|sólido|2.28|1964|3695|+3",
    "46|Pd|Paladio|106.42|tr|sólido|2.20|1554.9|2963|+2, +4",
    "47|Ag|Plata|107.87|tr|sólido|1.93|961.8|2162|+1",
    "48|Cd|Cadmio|112.41|tr|sólido|1.69|321.1|767|+2",
    "49|In|Indio|114.82|pb|sólido|1.78|156.6|2072|+3",
    "50|Sn|Estaño|118.71|pb|sólido|1.96|231.9|2602|+2, +4",
    "51|Sb|Antimonio|121.76|md|sólido|2.05|630.6|1587|+3, +5, −3",
    "52|Te|Teluro|127.60|md|sólido|2.1|449.5|988|−2, +4, +6",
    "53|I|Yodo|126.90|hal|sólido|2.66|113.7|184.3|−1, +1, +3, +5, +7",
    "54|Xe|Xenón|131.29|ng|gas|2.6|-111.8|-108.1|0",
    "55|Cs|Cesio|132.91|alc|sólido|0.79|28.5|671|+1",
    "56|Ba|Bario|137.33|alct|sólido|0.89|727|1845|+2",
    "57|La|Lantano|138.91|lan|sólido|1.10|920|3464|+3",
    "58|Ce|Cerio|140.12|lan|sólido|1.12|795|3443|+3, +4",
    "59|Pr|Praseodimio|140.91|lan|sólido|1.13|935|3520|+3",
    "60|Nd|Neodimio|144.24|lan|sólido|1.14|1024|3074|+3",
    "61|Pm|Prometio|145|lan|sólido|1.13|1042|3000|+3",
    "62|Sm|Samario|150.36|lan|sólido|1.17|1072|1794|+3, +2",
    "63|Eu|Europio|151.96|lan|sólido|1.2|826|1529|+3, +2",
    "64|Gd|Gadolinio|157.25|lan|sólido|1.20|1312|3273|+3",
    "65|Tb|Terbio|158.93|lan|sólido|1.2|1356|3230|+3",
    "66|Dy|Disprosio|162.50|lan|sólido|1.22|1407|2567|+3",
    "67|Ho|Holmio|164.93|lan|sólido|1.23|1461|2720|+3",
    "68|Er|Erbio|167.26|lan|sólido|1.24|1529|2868|+3",
    "69|Tm|Tulio|168.93|lan|sólido|1.25|1545|1950|+3",
    "70|Yb|Iterbio|173.05|lan|sólido|1.1|824|1196|+3, +2",
    "71|Lu|Lutecio|174.97|lan|sólido|1.27|1652|3402|+3",
    "72|Hf|Hafnio|178.49|tr|sólido|1.3|2233|4603|+4",
    "73|Ta|Tantalio|180.95|tr|sólido|1.5|3017|5458|+5",
    "74|W|Wolframio|183.84|tr|sólido|2.36|3422|5555|+6, +4",
    "75|Re|Renio|186.21|tr|sólido|1.9|3186|5596|+7, +4",
    "76|Os|Osmio|190.23|tr|sólido|2.2|3033|5012|+4, +8",
    "77|Ir|Iridio|192.22|tr|sólido|2.20|2446|4428|+3, +4",
    "78|Pt|Platino|195.08|tr|sólido|2.28|1768.3|3825|+2, +4",
    "79|Au|Oro|196.97|tr|sólido|2.54|1064.2|2856|+1, +3",
    "80|Hg|Mercurio|200.59|tr|líquido|2.00|-38.8|356.7|+1, +2",
    "81|Tl|Talio|204.38|pb|sólido|1.62|304|1473|+1, +3",
    "82|Pb|Plomo|207.2|pb|sólido|2.33|327.5|1749|+2, +4",
    "83|Bi|Bismuto|208.98|pb|sólido|2.02|271.4|1564|+3, +5",
    "84|Po|Polonio|209|pb|sólido|2.0|254|962|+2, +4",
    "85|At|Astato|210|hal|sólido|2.2|302|337|−1, +1",
    "86|Rn|Radón|222|ng|gas|2.2|-71|-61.7|0",
    "87|Fr|Francio|223|alc|sólido|0.7|27|677|+1",
    "88|Ra|Radio|226|alct|sólido|0.9|700|1737|+2",
    "89|Ac|Actinio|227|act|sólido|1.1|1050|3200|+3",
    "90|Th|Torio|232.04|act|sólido|1.3|1750|4788|+4",
    "91|Pa|Protactinio|231.04|act|sólido|1.5|1568||+5",
    "92|U|Uranio|238.03|act|sólido|1.38|1132.2|4131|+6, +4",
    "93|Np|Neptunio|237|act|sólido|1.36|639|4174|+5",
    "94|Pu|Plutonio|244|act|sólido|1.28|639.4|3228|+4",
    "95|Am|Americio|243|act|sólido|1.13|1176|2011|+3",
    "96|Cm|Curio|247|act|sólido|1.28|1340|3110|+3",
    "97|Bk|Berkelio|247|act|sólido|1.3|986||+3",
    "98|Cf|Californio|251|act|sólido|1.3|900||+3",
    "99|Es|Einstenio|252|act|sólido|1.3|860||+3",
    "100|Fm|Fermio|257|act|sólido|1.3|||+3",
    "101|Md|Mendelevio|258|act|sólido|1.3|||+3",
    "102|No|Nobelio|259|act|sólido|1.3|||+2",
    "103|Lr|Lawrencio|266|act|sólido|1.3|||+3",
    "104|Rf|Rutherfordio|267|tr|sólido||||+4",
    "105|Db|Dubnio|268|tr|sólido||||+5",
    "106|Sg|Seaborgio|269|tr|sólido||||+6",
    "107|Bh|Bohrio|270|tr|sólido||||+7",
    "108|Hs|Hasio|269|tr|sólido||||+8",
    "109|Mt|Meitnerio|278|unk|sólido||||—",
    "110|Ds|Darmstatio|281|unk|sólido||||—",
    "111|Rg|Roentgenio|282|unk|sólido||||—",
    "112|Cn|Copernicio|285|tr|sólido||||+2",
    "113|Nh|Nihonio|286|unk|sólido||||—",
    "114|Fl|Flerovio|289|unk|sólido||||—",
    "115|Mc|Moscovio|290|unk|sólido||||—",
    "116|Lv|Livermorio|293|unk|sólido||||—",
    "117|Ts|Teneso|294|unk|sólido||||—",
    "118|Og|Oganesón|294|unk|sólido||||—"
  ];

  var ABOUT = {
    H: ["El elemento más ligero y abundante del universo. Forma moléculas H₂. Está en el grupo 1, pero no es un metal alcalino.", "Materia prima del amoníaco y combustible de cohetes."],
    He: ["Gas noble con su única capa llena. No arde ni forma compuestos. Es más ligero que el aire.", "Globos, buceo profundo y enfriar los imanes de las resonancias."],
    Li: ["El metal más ligero. Blando, se corta con cuchillo y reacciona con el agua con menos fuerza que el sodio.", "Baterías de móviles y coches eléctricos."],
    Be: ["Metal duro y ligero. Sus compuestos son muy tóxicos.", "Aleaciones aeronáuticas y ventanas de rayos X."],
    B: ["Metaloide duro. Conduce poco la electricidad.", "Vidrio resistente al calor (borosilicato) y detergentes."],
    C: ["Forma cadenas larguísimas: es la base de la química orgánica. Grafito, diamante y grafeno son carbono con distinta estructura.", "Acero, lápices, combustibles y toda la materia viva."],
    N: ["Forma N₂, una molécula muy estable con un enlace triple. Es el 78 % del aire.", "Fertilizantes, explosivos y para conservar alimentos."],
    O: ["Forma O₂ (y O₃, el ozono). Es comburente: no arde, pero hace que otras sustancias ardan.", "Respiración, combustión y hospitales."],
    F: ["El elemento más electronegativo y reactivo. El gas es muy tóxico.", "Como fluoruro en pastas de dientes y en el teflón."],
    Ne: ["Gas noble. Brilla rojo anaranjado cuando lo atraviesa una descarga eléctrica.", "Carteles luminosos."],
    Na: ["Metal blando que reacciona con el agua y flota sobre ella. Se guarda bajo aceite.", "Como ion Na⁺ en la sal común; lámparas de calle amarillas."],
    Mg: ["Metal ligero que arde con una luz blanca cegadora.", "Aleaciones ligeras, bengalas y el centro de la clorofila."],
    Al: ["Metal ligero protegido por una capa transparente de óxido. Es anfótero: reacciona con ácidos y con bases.", "Latas, papel de aluminio, ventanas y aviones."],
    Si: ["Metaloide semiconductor. Es el segundo elemento más abundante de la corteza.", "Chips, paneles solares; la arena es SiO₂."],
    P: ["El fósforo blanco arde solo en el aire; el rojo es más estable.", "Fertilizantes, huesos (fosfato de calcio) y ADN."],
    S: ["Sólido amarillo que no se disuelve en agua. Arde con llama azul y forma SO₂.", "Ácido sulfúrico, caucho vulcanizado y fungicidas."],
    Cl: ["Gas amarillo verdoso, tóxico. Muy reactivo: gana un electrón y forma Cl⁻.", "Potabilizar el agua, PVC y lejía."],
    Ar: ["Gas noble, casi el 1 % del aire.", "Bombillas y soldadura con gas protector."],
    K: ["Más reactivo que el sodio: con agua el hidrógeno se enciende con llama lila.", "Como ion K⁺ en fertilizantes y en el cuerpo (plátanos)."],
    Ca: ["Metal del grupo 2 que reacciona con agua fría y la enturbia.", "Huesos, caliza, mármol, yeso y cemento."],
    Sc: ["Primer metal de transición.", "Aleaciones de aluminio para bicicletas."],
    Ti: ["Metal ligero y resistentísimo a la corrosión.", "Implantes, aviones y pintura blanca (TiO₂)."],
    V: ["Metal duro; sus compuestos tienen muchos colores.", "Aceros de herramientas."],
    Cr: ["Metal brillante y duro. Su configuración es una excepción: [Ar] 3d⁵ 4s¹.", "Cromado y acero inoxidable."],
    Mn: ["Metal gris y quebradizo. El permanganato (MnO₄⁻) es violeta intenso.", "Aceros y pilas (MnO₂)."],
    Fe: ["El metal más usado. Se oxida con aire húmedo y forma herrumbre.", "Acero, imanes y la hemoglobina de la sangre."],
    Co: ["Metal magnético. Sus sales son rosadas o azules.", "Imanes, baterías y vidrio azul cobalto."],
    Ni: ["Metal resistente a la corrosión. Sus sales son verdes.", "Monedas, acero inoxidable y baterías."],
    Cu: ["Excelente conductor. Está por debajo del hidrógeno en la serie de actividad. Sus sales son azules o verdes.", "Cables, tuberías, bronce y latón."],
    Zn: ["Metal gris azulado. Reacciona con ácidos y es anfótero.", "Galvanizado del hierro, pilas y latón."],
    Ga: ["Funde a 29,8 °C: se derrite en la mano.", "LEDs y semiconductores."],
    Ge: ["Metaloide semiconductor, parecido al silicio.", "Fibra óptica y transistores antiguos."],
    As: ["Metaloide muy tóxico.", "Semiconductores (arseniuro de galio)."],
    Se: ["No metal del grupo del oxígeno.", "Fotocopiadoras antiguas y suplementos en dosis mínimas."],
    Br: ["Único no metal líquido a temperatura ambiente. Rojo pardo, con vapores tóxicos.", "Retardantes de llama y fármacos."],
    Kr: ["Gas noble pesado.", "Flashes fotográficos y algunas lámparas."],
    Rb: ["Metal alcalino aún más reactivo que el potasio.", "Relojes atómicos y fuegos artificiales violetas."],
    Sr: ["Metal alcalinotérreo. Da llama roja intensa.", "Bengalas y fuegos artificiales rojos."],
    Ag: ["El mejor conductor eléctrico. Poco reactiva: no reacciona con ácidos diluidos.", "Joyería, espejos y fotografía."],
    Cd: ["Metal tóxico.", "Baterías Ni-Cd antiguas."],
    Sn: ["Metal blando y poco reactivo.", "Soldadura, latas (hojalata) y bronce."],
    Sb: ["Metaloide.", "Aleaciones y retardantes de llama."],
    I: ["Sólido gris violeta que sublima en vapor morado. Se disuelve poco en agua, mejor en alcohol o con yoduro.", "Desinfectante (povidona) y sal yodada."],
    Xe: ["Gas noble que forma algunos compuestos con flúor.", "Faros de coche y anestesia."],
    Cs: ["El metal más reactivo de los estables: explota en agua.", "Relojes atómicos que definen el segundo."],
    Ba: ["Metal alcalinotérreo. Da llama verde. El BaSO₄ es tan insoluble que se bebe para radiografías.", "Contraste para rayos X y fuegos artificiales verdes."],
    Ce: ["El lantánido más abundante.", "Piedras de mechero y catalizadores."],
    Nd: ["Lantánido magnético.", "Imanes potentísimos de auriculares y motores."],
    W: ["El metal con el punto de fusión más alto.", "Filamentos de bombillas y herramientas de corte."],
    Pt: ["Metal noble muy poco reactivo y buen catalizador.", "Catalizadores de coche, joyería y electrodos."],
    Au: ["Metal noble: no se oxida ni reacciona con ácidos comunes.", "Joyería, electrónica y reservas monetarias."],
    Hg: ["Único metal líquido a temperatura ambiente. Sus vapores son tóxicos.", "Antes en termómetros; hoy casi prohibido."],
    Pb: ["Metal denso, blando y tóxico. Sus sales de yoduro son amarillas.", "Baterías de coche y protección contra radiación."],
    Bi: ["Metal pesado poco tóxico que forma cristales iridiscentes.", "Medicamentos para el estómago."],
    Po: ["Muy radiactivo. Lo descubrió Marie Curie.", "Fuentes de calor en satélites."],
    Rn: ["Gas noble radiactivo que sale del suelo en algunas zonas.", "Se mide en casas por seguridad."],
    Fr: ["Metal alcalino radiactivo y rarísimo.", "Solo investigación."],
    Ra: ["Radiactivo, brilla en la oscuridad. Descubierto por los Curie.", "Antiguas esferas de reloj luminosas."],
    U: ["Actínido radiactivo y muy denso.", "Combustible de centrales nucleares."],
    Pu: ["Actínido radiactivo artificial.", "Combustible nuclear y sondas espaciales."],
    Og: ["El elemento más pesado conocido. Solo se han obtenido unos pocos átomos.", "Investigación."]
  };

  var NOBLE = [2, 10, 18, 36, 54, 86, 118];
  var NOBLE_SYM = { 2: "He", 10: "Ne", 18: "Ar", 36: "Kr", 54: "Xe", 86: "Rn" };
  var ORDER = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"];
  var CAP = { s: 2, p: 6, d: 10, f: 14 };
  var EXCEPTIONS = {
    24: { "3d": 5, "4s": 1 }, 29: { "3d": 10, "4s": 1 },
    41: { "4d": 4, "5s": 1 }, 42: { "4d": 5, "5s": 1 }, 44: { "4d": 7, "5s": 1 }, 45: { "4d": 8, "5s": 1 },
    46: { "4d": 10, "5s": 0 }, 47: { "4d": 10, "5s": 1 },
    57: { "4f": 0, "5d": 1 }, 58: { "4f": 1, "5d": 1 }, 64: { "4f": 7, "5d": 1 },
    78: { "5d": 9, "6s": 1 }, 79: { "5d": 10, "6s": 1 },
    89: { "5f": 0, "6d": 1 }, 90: { "5f": 0, "6d": 2 }, 91: { "5f": 2, "6d": 1 }, 92: { "5f": 3, "6d": 1 },
    93: { "5f": 4, "6d": 1 }, 96: { "5f": 7, "6d": 1 }, 103: { "6d": 0, "7p": 1 }
  };
  var SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };

  function sup(n) {
    return String(n).split("").map(function (c) { return SUP[c]; }).join("");
  }

  function fill(z) {
    var left = z;
    var out = {};
    ORDER.forEach(function (sub) {
      if (left <= 0) return;
      var take = Math.min(CAP[sub[1]], left);
      out[sub] = take;
      left -= take;
    });
    var ex = EXCEPTIONS[z];
    if (ex) Object.keys(ex).forEach(function (sub) { out[sub] = ex[sub]; });
    return out;
  }

  function configString(z) {
    var core = 0;
    NOBLE.forEach(function (n) { if (n < z && n !== 118) core = n; });
    var full = fill(z);
    var coreFill = core ? fill(core) : {};
    var parts = [];
    ORDER.forEach(function (sub) {
      var n = full[sub] || 0;
      var c = coreFill[sub] || 0;
      if (n > c) parts.push(sub + sup(n));
    });
    return (core ? "[" + NOBLE_SYM[core] + "] " : "") + parts.join(" ");
  }

  function shells(z) {
    var full = fill(z);
    var out = [];
    Object.keys(full).forEach(function (sub) {
      var n = Number(sub[0]);
      out[n - 1] = (out[n - 1] || 0) + full[sub];
    });
    for (var i = 0; i < out.length; i++) out[i] = out[i] || 0;
    while (out.length && !out[out.length - 1]) out.pop();
    return out;
  }

  function position(z) {
    var period = 1;
    while (z > NOBLE[period - 1]) period++;
    var start = period === 1 ? 1 : NOBLE[period - 2] + 1;
    var i = z - start;
    if (period === 1) return { period: 1, group: z === 1 ? 1 : 18 };
    if (period <= 3) return { period: period, group: i < 2 ? i + 1 : i + 11 };
    if (period <= 5) return { period: period, group: i + 1 };
    if (i < 2) return { period: period, group: i + 1 };
    if (i <= 16) return { period: period, group: null, fRow: period === 6 ? 1 : 2, fIndex: i - 2 };
    return { period: period, group: i - 13 };
  }

  function num(s) {
    return s === "" || s == null ? null : Number(s);
  }

  AQ.ELEMENTS = RAW.map(function (line) {
    var f = line.split("|");
    var z = Number(f[0]);
    var pos = position(z);
    var about = ABOUT[f[1]];
    var cat = f[4];
    return {
      z: z,
      symbol: f[1],
      name: f[2],
      mass: Number(f[3]),
      cat: cat,
      category: AQ.CATEGORIES[cat].name,
      state: f[5],
      en: num(f[6]),
      mp: num(f[7]),
      bp: num(f[8]),
      ox: f[9],
      period: pos.period,
      group: pos.group,
      fRow: pos.fRow || 0,
      fIndex: pos.fIndex == null ? -1 : pos.fIndex,
      config: configString(z),
      shells: shells(z),
      radioactive: z === 43 || z === 61 || z >= 84,
      about: about ? about[0] : defaultAbout(cat, z),
      uses: about ? about[1] : ""
    };
  });

  function defaultAbout(cat, z) {
    if (z > 100) return "Elemento sintético: solo se han fabricado unos pocos átomos en aceleradores y se desintegran en fracciones de segundo.";
    if (cat === "lan") return "Lantánido o «tierra rara». Se parecen mucho entre sí y se usan en imanes, láseres y pantallas.";
    if (cat === "act") return "Actínido radiactivo. La mayoría son artificiales.";
    if (cat === "tr") return "Metal de transición: duro, buen conductor y con varios estados de oxidación.";
    if (cat === "pb") return "Metal del bloque p, más blando y con menor punto de fusión que los de transición.";
    if (cat === "md") return "Metaloide: propiedades intermedias entre metales y no metales.";
    return "Elemento de la tabla periódica.";
  }

  AQ.MASS = {};
  AQ.ELEMENTS.forEach(function (el) { AQ.MASS[el.symbol] = el.mass; });

  AQ.elementBySymbol = function (symbol) {
    for (var i = 0; i < AQ.ELEMENTS.length; i++) if (AQ.ELEMENTS[i].symbol === symbol) return AQ.ELEMENTS[i];
    return null;
  };

  AQ.configString = configString;
  AQ.sup = sup;
})(typeof window !== "undefined" ? window : globalThis);
