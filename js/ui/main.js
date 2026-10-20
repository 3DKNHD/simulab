(function () {
  var AQ = window.AQ;

  var Home = {
    mount: function (root) {
      root.innerHTML =
        '<div class="page home">' +
        '<section class="hero"><div>' +
        '<p class="eyebrow">Química de secundaria, con cantidades reales</p>' +
        "<h2>Echa, mezcla y observa lo que de verdad pasaría</h2>" +
        '<p class="lead">Elige un reactivo de la estantería, decide cuánto echar y viértelo en el vaso. El simulador calcula moles, pH, temperatura, gases y precipitados con datos reales (Ksp, potenciales de reducción, entalpías) y te enseña la ecuación de cada reacción.</p>' +
        '<div class="row"><a class="pour" href="#laboratorio">Entrar al laboratorio</a><a class="ghost-link" href="#practicas">Ver prácticas guiadas</a></div>' +
        '</div><canvas id="hero-beaker" aria-hidden="true"></canvas></section>' +
        '<section class="cards">' +
        card("#laboratorio", "Laboratorio", "Más de 60 reactivos: ácidos, bases, sales, metales, indicadores y productos caseros. Agita, tapa con un globo y prueba los gases con una astilla.") +
        card("#practicas", "Prácticas guiadas", "16 experimentos clásicos que se comprueban solos: neutralización, árbol de plata, lluvia de oro, catalizadores, Lavoisier…") +
        card("#tabla", "Tabla periódica", "Los 118 elementos con configuración electrónica, modelo de capas y estado según la temperatura.") +
        card("#herramientas", "Herramientas", "Balanceador de ecuaciones, masa molar, curvas de valoración, estados de la materia y ensayo a la llama.") +
        "</section>" +
        '<section class="note-box"><strong>Seguridad.</strong> Esto es una simulación. Muchas de estas sustancias (ácidos y bases concentrados, sodio, nitrato de plata o de plomo) son peligrosas: en un laboratorio real usa siempre gafas, bata y guantes, y trabaja con tu profesor.</section>' +
        "</div>";
      var demo = new AQ.Sim();
      demo.pour("agua", 120);
      demo.pour("lombarda", 10);
      demo.pour("vinagre", 5);
      var view = new AQ.BeakerView(root.querySelector("#hero-beaker"), demo);
      var t = 0;
      var last = performance.now();
      var script = [[2, "bicarbonato", 2], [9, "naoh", 5]];
      var self = this;
      this.running = true;
      function loop(now) {
        if (!self.running) return;
        var dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        t += dt;
        while (script.length && t > script[0][0]) {
          var s = script.shift();
          demo.pour(s[1], s[2]);
          view.pourFx(AQ.REAGENT_BY_ID[s[1]], s[2]);
        }
        demo.run(dt);
        view.frame(dt, 1);
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    },
    unmount: function () { this.running = false; }
  };

  function card(href, title, text) {
    return '<a class="card link-card" href="' + href + '"><h3>' + title + '</h3><p class="small">' + text + "</p></a>";
  }

  var VIEWS = { inicio: Home, laboratorio: AQ.Lab, practicas: AQ.Practices, tabla: AQ.Table, herramientas: AQ.Tools };
  var current = null;

  function route() {
    var id = (location.hash || "#inicio").slice(1);
    if (!VIEWS[id]) id = "inicio";
    if (current && current.unmount) current.unmount();
    var app = document.getElementById("app");
    app.innerHTML = "";
    app.className = "view-" + id;
    current = VIEWS[id];
    current.mount(app);
    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (a) {
      a.classList.toggle("on", a.dataset.nav === id);
    });
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);
  route();
})();
