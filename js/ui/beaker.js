(function () {
  var AQ = window.AQ;
  var UI = AQ.UI;
  var SP = AQ.SPECIES;
  var METALS = AQ.METALS;

  var COMPOUND = {};
  AQ.COMPOUNDS.forEach(function (c) { COMPOUND[c.key] = c; });

  function BeakerView(canvas, sim) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sim = sim;
    this.bubbles = [];
    this.fx = [];
    this.foam = 0;
    this.spawnAcc = {};
    this.metalPos = {};
    this.alkali = {};
    this.t = 0;
    this.resize();
  }

  BeakerView.prototype.resize = function () {
    var r = this.canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    this.W = Math.max(280, r.width);
    this.H = Math.max(360, r.height);
    this.canvas.width = Math.round(this.W * dpr);
    this.canvas.height = Math.round(this.H * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var bw = Math.min(230, this.W * 0.5);
    var bh = Math.min(290, this.H - 150);
    this.g = {
      bw: bw,
      bh: bh,
      x: this.W / 2 - bw / 2,
      y: this.H - bh - 62,
      wall: 5
    };
    this.g.left = this.g.x + this.g.wall;
    this.g.right = this.g.x + bw - this.g.wall;
    this.g.bottom = this.g.y + bh - this.g.wall;
    this.g.fullH = bh * 0.86;
  };

  BeakerView.prototype.yOf = function (mL) {
    return this.g.bottom - (mL / AQ.Engine.CAPACITY) * this.g.fullH;
  };

  BeakerView.prototype.pourFx = function (reagent, amount) {
    var kind = reagent.kind;
    var type = kind === "solution" || kind === "liquid" ? "stream" : kind === "indicator" ? (reagent.unit === "mL" ? "stream" : "drops") : kind === "action" ? "blow" : "grains";
    if (kind === "solution" && amount <= 0.05) type = "drops";
    var n = type === "drops" ? (kind === "indicator" ? amount : 1) : amount;
    var dur = type === "blow" ? 1.2 * Math.min(3, amount) : type === "drops" ? 0.45 * Math.min(5, n) + 0.3 : type === "stream" ? 0.5 + Math.min(1.2, amount / 40) : 0.8;
    this.fx.push({ type: type, t0: this.t, dur: dur, color: reagent.color || "#dde8ee", n: n });
  };

  BeakerView.prototype.testFx = function (result) {
    this.fx.push({ type: "splint", t0: this.t, dur: 2.2, kind: result.kind, gas: result.gas || null });
  };

  BeakerView.prototype.frame = function (dt, speed) {
    this.t += dt;
    var ctx = this.ctx;
    var sim = this.sim;
    var m = sim.measure();
    ctx.clearRect(0, 0, this.W, this.H);
    this.drawBackground();
    this.drawBalance(m);
    var g = this.g;
    var aqML = m.volume;
    var topAq = this.yOf(aqML);
    var topOil = this.yOf(aqML + m.oil);
    this.surface = m.oil > 0 ? topOil : topAq;
    this.hasLiquid = aqML + m.oil > 0.3;

    ctx.save();
    this.clipInside();
    this.drawBackGlass();
    if (aqML > 0.3) this.drawLiquid(m, topAq);
    this.drawSettled();
    this.drawPowders(topAq);
    this.drawMetals(topAq, dt);
    this.updateBubbles(dt, speed, m, topAq);
    if (m.oil > 0.3) this.drawOil(topAq, topOil);
    this.drawFloaters(topAq);
    ctx.restore();

    this.drawFoam(dt, m);
    this.drawGlass();
    this.drawThermometer(m);
    this.drawBalloon(m);
    this.drawSteam(m);
    this.drawStir();
    this.drawFx();
  };

  BeakerView.prototype.drawStir = function () {
    if (!this.sim.stirring()) return;
    var ctx = this.ctx;
    var g = this.g;
    var cx = (g.left + g.right) / 2 + Math.sin(this.t * 7) * (g.right - g.left) * 0.3;
    ctx.save();
    ctx.strokeStyle = "rgba(220,235,240,0.9)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx + 30, g.y - 70);
    ctx.lineTo(cx - 6, g.bottom - 10);
    ctx.stroke();
    ctx.strokeStyle = "rgba(90,120,130,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  };

  BeakerView.prototype.drawBackground = function () {
    var ctx = this.ctx;
    var benchY = this.g.y + this.g.bh + 26;
    var wall = ctx.createLinearGradient(0, 0, 0, benchY);
    wall.addColorStop(0, "#f7f1e6");
    wall.addColorStop(1, "#efe5d3");
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, this.W, benchY);
    var bench = ctx.createLinearGradient(0, benchY, 0, this.H);
    bench.addColorStop(0, "#3c4a52");
    bench.addColorStop(1, "#2b363c");
    ctx.fillStyle = bench;
    ctx.fillRect(0, benchY, this.W, this.H - benchY);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, benchY, this.W, 2);
    ctx.fillStyle = "rgba(60,40,20,0.05)";
    for (var i = 0; i < 6; i++) ctx.fillRect(0, 30 + i * 52, this.W, 1);
  };

  BeakerView.prototype.drawBalance = function (m) {
    var ctx = this.ctx;
    var g = this.g;
    var px = g.x - 30;
    var pw = g.bw + 60;
    var py = g.y + g.bh;
    ctx.fillStyle = "#cfd6db";
    roundRect(ctx, px, py, pw, 10, 3);
    ctx.fill();
    ctx.fillStyle = "#e9edf0";
    roundRect(ctx, px - 10, py + 10, pw + 20, 26, 6);
    ctx.fill();
    ctx.fillStyle = "#b9c2c8";
    ctx.fillRect(px - 10, py + 33, pw + 20, 3);
    var dw = 112;
    ctx.fillStyle = "#1f2a23";
    roundRect(ctx, g.x + g.bw / 2 - dw / 2, py + 13, dw, 20, 4);
    ctx.fill();
    ctx.fillStyle = "#8ef0a6";
    ctx.font = "600 14px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(UI.fixed(m.mass, 3) + " g", g.x + g.bw / 2, py + 23.5);
  };

  BeakerView.prototype.clipInside = function () {
    var g = this.g;
    var ctx = this.ctx;
    ctx.beginPath();
    roundRectPath(ctx, g.left, g.y + 6, g.right - g.left, g.bottom - g.y - 6, [0, 0, 12, 12]);
    ctx.clip();
  };

  BeakerView.prototype.drawBackGlass = function () {
    var g = this.g;
    var ctx = this.ctx;
    var grad = ctx.createLinearGradient(g.left, 0, g.right, 0);
    grad.addColorStop(0, "rgba(255,255,255,0.35)");
    grad.addColorStop(0.5, "rgba(235,244,248,0.15)");
    grad.addColorStop(1, "rgba(255,255,255,0.3)");
    ctx.fillStyle = grad;
    ctx.fillRect(g.left, g.y, g.right - g.left, g.bottom - g.y);
  };

  BeakerView.prototype.wave = function (x) {
    var sim = this.sim;
    var total = 0;
    var r = sim.rate;
    Object.keys(r).forEach(function (k) { total += r[k] || 0; });
    var amp = 0.6 + (sim.stirring() ? 2.6 : 0) + Math.min(2.5, Math.sqrt(total) * 60);
    return Math.sin(x / 17 + this.t * 3.1) * amp * 0.6 + Math.sin(x / 7 - this.t * 4.3) * amp * 0.25;
  };

  BeakerView.prototype.surfacePath = function (top) {
    var ctx = this.ctx;
    var g = this.g;
    ctx.moveTo(g.left - 2, top + this.wave(g.left));
    for (var x = g.left; x <= g.right + 4; x += 6) ctx.lineTo(x, top + this.wave(x));
  };

  BeakerView.prototype.drawLiquid = function (m, top) {
    var ctx = this.ctx;
    var g = this.g;
    ctx.beginPath();
    this.surfacePath(top);
    ctx.lineTo(g.right + 4, g.bottom + 4);
    ctx.lineTo(g.left - 4, g.bottom + 4);
    ctx.closePath();
    ctx.fillStyle = "rgba(196,224,240,0.42)";
    ctx.fill();
    var c = m.color;
    if (c.strength > 0.01) {
      ctx.fillStyle = UI.rgba(c.rgb, Math.min(0.94, 0.2 + c.strength * 0.8));
      ctx.fill();
    }
    var tb = m.turbidity;
    if (tb.alpha > 0.01) {
      var grad = ctx.createLinearGradient(0, top, 0, g.bottom);
      grad.addColorStop(0, UI.rgba(tb.rgb, tb.alpha * 0.75));
      grad.addColorStop(1, UI.rgba(tb.rgb, Math.min(0.97, tb.alpha * 1.05)));
      ctx.fillStyle = grad;
      ctx.fill();
      var rnd = UI.rng(7);
      ctx.fillStyle = UI.rgba(tb.rgb.map(function (v) { return Math.max(0, v - 25); }), Math.min(0.5, tb.alpha * 0.6));
      for (var i = 0; i < 70 * tb.alpha; i++) {
        var px = g.left + rnd() * (g.right - g.left);
        var py = top + 4 + ((rnd() * (g.bottom - top) + this.t * (6 + rnd() * 6)) % Math.max(4, g.bottom - top - 4));
        ctx.fillRect(px, py, 1.6, 1.6);
      }
    }
    var shine = ctx.createLinearGradient(g.left, 0, g.right, 0);
    shine.addColorStop(0, "rgba(255,255,255,0.18)");
    shine.addColorStop(0.2, "rgba(255,255,255,0)");
    shine.addColorStop(0.85, "rgba(255,255,255,0)");
    shine.addColorStop(1, "rgba(255,255,255,0.12)");
    ctx.fillStyle = shine;
    ctx.fill();
    ctx.beginPath();
    this.surfacePath(top);
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  BeakerView.prototype.drawOil = function (topAq, topOil) {
    var ctx = this.ctx;
    var g = this.g;
    ctx.beginPath();
    this.surfacePath(topOil);
    ctx.lineTo(g.right + 4, topAq);
    ctx.lineTo(g.left - 4, topAq);
    ctx.closePath();
    ctx.fillStyle = "rgba(232,198,80,0.72)";
    ctx.fill();
    ctx.strokeStyle = "rgba(180,140,40,0.5)";
    ctx.beginPath();
    ctx.moveTo(g.left, topAq);
    ctx.lineTo(g.right, topAq);
    ctx.stroke();
  };

  BeakerView.prototype.drawSettled = function () {
    var ctx = this.ctx;
    var g = this.g;
    var sim = this.sim;
    var y = g.bottom;
    var self = this;
    Object.keys(sim.n).forEach(function (k) {
      var c = COMPOUND[k];
      if (!c || !c.ppt || !sim.hist.ppt[k]) return;
      var settled = sim.get(k) * (1 - (sim.susp[k] || 0));
      if (settled < 1e-6) return;
      var h = Math.min(46, Math.max(2, settled * (c.gel ? 15000 : 6500)));
      var rnd = UI.rng(UI.hash(k));
      ctx.beginPath();
      ctx.moveTo(g.left - 2, y);
      for (var x = g.left - 2; x <= g.right + 2; x += 8) ctx.lineTo(x, y - h - (rnd() - 0.5) * Math.min(4, h * 0.5) + Math.sin(x / 30) * 1.5);
      ctx.lineTo(g.right + 2, y);
      ctx.closePath();
      ctx.fillStyle = c.color;
      ctx.globalAlpha = c.gel ? 0.85 : 0.97;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (c.sparkle) {
        for (var i = 0; i < 18; i++) {
          var sx = g.left + rnd() * (g.right - g.left);
          var sy = y - rnd() * h;
          var a = 0.5 + 0.5 * Math.sin(self.t * 3 + i);
          ctx.fillStyle = "rgba(255,248,200," + a + ")";
          ctx.fillRect(sx, sy, 1.6, 1.6);
        }
      }
      y -= h;
    });
    Object.keys(sim.deposit).forEach(function (k) {
      var d = sim.deposit[k];
      if (sim.get(d.host) > 0 || d.n < 1e-6) return;
      var col = k === "Fe(OH)3(s)" ? "#a8582a" : METALS[k.replace("(s)", "")] ? METALS[k.replace("(s)", "")].deposit || METALS[k.replace("(s)", "")].color : "#999";
      var h = Math.min(20, Math.max(2, d.n * 6000));
      ctx.fillStyle = col;
      ctx.fillRect(g.left, y - h, g.right - g.left, h);
      y -= h;
    });
    this.floorY = y;
  };

  BeakerView.prototype.drawPowders = function (topAq) {
    var ctx = this.ctx;
    var g = this.g;
    var sim = this.sim;
    var y = this.floorY || g.bottom;
    var keys = Object.keys(sim.n).filter(function (k) {
      var sp = SP[k];
      if (sp.ph !== "s" || sp.metal) return false;
      if (COMPOUND[k] && COMPOUND[k].ppt && sim.hist.ppt[k]) return false;
      return sim.massOf(k) > 0.002;
    });
    var cx = g.left + (g.right - g.left) * 0.42;
    var self = this;
    this.pilePos = {};
    keys.forEach(function (k, i) {
      var grams = sim.massOf(k) * (1 - (sim.susp[k] || 0));
      if (grams < 0.002) return;
      var color = COMPOUND[k] ? COMPOUND[k].color : AQ.INERT[k] ? AQ.INERT[k].color : "#ddd";
      var rnd = UI.rng(UI.hash(k) + 3);
      var px = cx + (i - (keys.length - 1) / 2) * 46;
      if (k === "S(s)" && self.hasLiquid) return;
      if (sim.form[k] && sim.form[k] < 1) {
        var n = Math.min(9, 1 + Math.round(grams * 2));
        for (var j = 0; j < n; j++) {
          var r = 6 + rnd() * 6;
          var sx = px - 30 + rnd() * 60;
          var sy = y - r * 0.7 - (j > 4 ? 8 : 0);
          ctx.beginPath();
          for (var a = 0; a < 7; a++) {
            var ang = a / 7 * Math.PI * 2;
            var rr = r * (0.75 + rnd() * 0.35);
            ctx.lineTo(sx + Math.cos(ang) * rr, sy + Math.sin(ang) * rr * 0.75);
          }
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = "rgba(0,0,0,0.12)";
          ctx.stroke();
        }
        self.pilePos[k] = { x: px, y: y - 8, w: 60 };
        return;
      }
      if (k === "papa(s)") {
        for (var p = 0; p < Math.min(14, 3 + grams * 2); p++) {
          ctx.save();
          ctx.translate(px - 26 + rnd() * 52, y - 3 - rnd() * 8);
          ctx.rotate(rnd() * Math.PI);
          ctx.fillStyle = color;
          roundRect(ctx, -9, -2, 18, 4, 2);
          ctx.fill();
          ctx.restore();
        }
        self.pilePos[k] = { x: px, y: y - 6, w: 50 };
        return;
      }
      var h = Math.min(30, 3 + Math.sqrt(grams) * 9);
      var w = Math.min(90, 18 + Math.sqrt(grams) * 26);
      ctx.beginPath();
      ctx.moveTo(px - w / 2, y);
      ctx.quadraticCurveTo(px, y - h * 2, px + w / 2, y);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      for (var q = 0; q < 22; q++) {
        var gx = px - w / 2 + rnd() * w;
        var maxH = h * 2 * (1 - Math.pow((gx - px) / (w / 2), 2)) * 0.5;
        ctx.fillRect(gx, y - rnd() * maxH, 1.5, 1.5);
      }
      self.pilePos[k] = { x: px, y: y - h * 0.6, w: w * 0.6 };
    });
  };

  BeakerView.prototype.drawFloaters = function (topAq) {
    var sim = this.sim;
    var ctx = this.ctx;
    var g = this.g;
    if (sim.get("S(s)") && this.hasLiquid) {
      var rnd = UI.rng(11);
      ctx.fillStyle = "#e9d443";
      var n = Math.min(80, 20 + sim.massOf("S(s)") * 30);
      for (var i = 0; i < n; i++) {
        var x = g.left + 10 + rnd() * (g.right - g.left - 20);
        ctx.fillRect(x, this.surface + this.wave(x) - 1 - rnd() * 3, 2.4, 2.4);
      }
    }
  };

  BeakerView.prototype.drawMetals = function (topAq, dt) {
    var ctx = this.ctx;
    var g = this.g;
    var sim = this.sim;
    var self = this;
    var floor = this.floorY || g.bottom;
    var index = 0;
    this.metalPos = {};
    Object.keys(METALS).forEach(function (sym) {
      var m = METALS[sym];
      var key = m.key;
      var mol = sim.get(key);
      if (mol <= 0) return;
      var grams = mol * AQ.MASS[sym];
      var g0 = sim.mass0[key] || grams;
      var f = Math.max(0.15, Math.pow(grams / g0, 1 / 3));
      var coat = self.coating(key, mol);
      var slot = index++;
      var baseX = g.left + 30 + (slot % 3) * ((g.right - g.left - 60) / 2);
      var rate = sim.metalRate[sym] || 0;

      if (m.floats && self.hasLiquid) {
        var st = self.alkali[key] || (self.alkali[key] = { x: (g.left + g.right) / 2, v: 40 });
        var active = rate > 1e-5;
        if (active) {
          st.v += (Math.random() - 0.5) * 900 * dt;
          st.v = Math.max(-140, Math.min(140, st.v));
          st.x += st.v * dt;
          if (st.x < g.left + 12) { st.x = g.left + 12; st.v = Math.abs(st.v); }
          if (st.x > g.right - 12) { st.x = g.right - 12; st.v = -Math.abs(st.v); }
        }
        var sy = self.surface + self.wave(st.x) - 2;
        var r = Math.max(2.5, 7 * f);
        ctx.fillStyle = m.color;
        if (active && sym !== "Li") {
          ctx.beginPath();
          ctx.arc(st.x, sy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.beginPath();
          ctx.arc(st.x - r * 0.35, sy - r * 0.35, r * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(st.x - r, sy - r, r * 2, r * 1.6);
        }
        self.metalPos[key] = { x: st.x, y: sy, w: r * 2, h: r * 2, surface: true };
        if (active && m.flame && (sym === "K" || rate > 2e-4)) self.flameAt(st.x, sy - r, m.flame, 0.7 + Math.min(1.4, rate * 3000));
        return;
      }

      ctx.save();
      if (m.form === "cinta") {
        var len = 90 * f + 10;
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        var x0 = baseX - len / 2;
        for (var i = 0; i <= 12; i++) {
          var xx = x0 + len * i / 12;
          var yy = floor - 4 - Math.abs(Math.sin(i / 12 * Math.PI * 2.4)) * 7;
          if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        if (coat) { ctx.strokeStyle = coat.color; ctx.globalAlpha = coat.alpha; ctx.stroke(); ctx.globalAlpha = 1; }
        self.metalPos[key] = { x: baseX, y: floor - 8, w: len, h: 10 };
      } else if (m.form === "papel") {
        var rad = 22 * f + 4;
        var rnd = UI.rng(5);
        var cy = floor - rad * 0.8;
        ctx.beginPath();
        for (var a = 0; a < 11; a++) {
          var ang = a / 11 * Math.PI * 2;
          var rr = rad * (0.7 + rnd() * 0.4);
          ctx.lineTo(baseX + Math.cos(ang) * rr, cy + Math.sin(ang) * rr * 0.8);
        }
        ctx.closePath();
        var gr = ctx.createLinearGradient(baseX - rad, cy - rad, baseX + rad, cy + rad);
        gr.addColorStop(0, "#f4f6f8");
        gr.addColorStop(0.5, "#c7ced3");
        gr.addColorStop(1, "#e7ebee");
        ctx.fillStyle = gr;
        ctx.fill();
        ctx.strokeStyle = "rgba(90,100,110,0.35)";
        ctx.stroke();
        if (coat) { ctx.fillStyle = coat.color; ctx.globalAlpha = coat.alpha; ctx.fill(); ctx.globalAlpha = 1; }
        self.metalPos[key] = { x: baseX, y: cy, w: rad * 2, h: rad * 1.6 };
      } else if (m.form === "granallas" || m.form === "granos") {
        var rnd2 = UI.rng(UI.hash(sym));
        var count = m.form === "granos" ? 7 : 5;
        var rad2 = (m.form === "granos" ? 4 : 7) * f + 1.5;
        ctx.fillStyle = m.color;
        for (var b = 0; b < count; b++) {
          var bx = baseX - 22 + rnd2() * 44;
          var by = floor - rad2 - (b > 3 ? rad2 * 1.2 : 0);
          ctx.beginPath();
          ctx.ellipse(bx, by, rad2 * (0.9 + rnd2() * 0.4), rad2 * (0.75 + rnd2() * 0.3), rnd2() * 3, 0, Math.PI * 2);
          ctx.fillStyle = m.color;
          ctx.fill();
          if (coat) { ctx.fillStyle = coat.color; ctx.globalAlpha = coat.alpha; ctx.fill(); ctx.globalAlpha = 1; }
          ctx.fillStyle = "rgba(255,255,255,0.45)";
          ctx.beginPath();
          ctx.arc(bx - rad2 * 0.3, by - rad2 * 0.3, rad2 * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
        self.metalPos[key] = { x: baseX, y: floor - rad2 * 1.5, w: 44, h: rad2 * 2 };
      } else if (m.form === "clavo") {
        var L = 120 * Math.pow(f, 0.4);
        ctx.translate(baseX - 10, floor - 8);
        ctx.rotate(-0.32);
        var shaft = ctx.createLinearGradient(0, -4, 0, 4);
        shaft.addColorStop(0, "#a3acb6");
        shaft.addColorStop(0.5, m.color);
        shaft.addColorStop(1, "#5d6670");
        ctx.fillStyle = shaft;
        ctx.beginPath();
        ctx.moveTo(-L / 2, -3.5);
        ctx.lineTo(L / 2 - 10, -3.5);
        ctx.lineTo(L / 2, 0);
        ctx.lineTo(L / 2 - 10, 3.5);
        ctx.lineTo(-L / 2, 3.5);
        ctx.closePath();
        ctx.fill();
        if (coat) { ctx.fillStyle = coat.color; ctx.globalAlpha = coat.alpha; ctx.fill(); ctx.globalAlpha = 1; }
        ctx.fillStyle = "#6f7882";
        roundRect(ctx, -L / 2 - 4, -8, 5, 16, 2);
        ctx.fill();
        self.drawRust(sim, key, L);
        ctx.restore();
        ctx.save();
        self.metalPos[key] = { x: baseX - 10, y: floor - 8 - 0.32 * 0, w: L * 0.9, h: 30 };
      } else if (m.form === "alambre") {
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        var top = Math.max(topAq - 30, g.y + 20);
        for (var s = 0; s <= 60; s++) {
          var yy2 = floor - 6 - (floor - 6 - top) * s / 60;
          var xx2 = baseX + Math.sin(s / 60 * Math.PI * 10) * 14 * f + Math.sin(s / 5) * 0.5;
          if (s === 0) ctx.moveTo(xx2, yy2); else ctx.lineTo(xx2, yy2);
        }
        ctx.stroke();
        if (coat) { ctx.strokeStyle = coat.color; ctx.globalAlpha = coat.alpha; ctx.stroke(); ctx.globalAlpha = 1; }
        self.metalPos[key] = { x: baseX, y: (floor + top) / 2, w: 28, h: floor - top };
        self.drawCrystals(key, baseX, top, floor, topAq);
      } else {
        var sheetH = Math.min(150, g.bottom - g.y - 30);
        var sx2 = g.right - 26 - slot * 6;
        ctx.translate(sx2, floor);
        ctx.rotate(-0.18);
        var w2 = 22 * Math.max(0.35, f);
        var gr2 = ctx.createLinearGradient(-w2, 0, 0, 0);
        gr2.addColorStop(0, m.color);
        gr2.addColorStop(0.6, lighten(m.color, 30));
        gr2.addColorStop(1, m.color);
        ctx.fillStyle = gr2;
        ctx.fillRect(-w2, -sheetH, w2, sheetH);
        ctx.restore();
        ctx.save();
        if (coat) {
          var subTop = Math.max(topAq, floor - sheetH);
          ctx.translate(sx2, floor);
          ctx.rotate(-0.18);
          ctx.fillStyle = coat.color;
          ctx.globalAlpha = coat.alpha;
          ctx.fillRect(-w2, -(floor - subTop), w2, floor - subTop);
          ctx.globalAlpha = 1;
          ctx.restore();
          ctx.save();
          self.drawCrystals(key, sx2 - w2 / 2 - 6, subTop, floor, topAq);
        }
        self.metalPos[key] = { x: sx2 - w2 / 2 - 8, y: Math.max(topAq + 10, floor - sheetH * 0.4), w: w2, h: Math.min(sheetH, floor - topAq) };
      }
      ctx.restore();
    });
  };

  BeakerView.prototype.coating = function (host, hostMol) {
    var sim = this.sim;
    var best = null;
    Object.keys(sim.deposit).forEach(function (k) {
      var d = sim.deposit[k];
      if (d.host !== host || k === "Fe(OH)3(s)") return;
      var alpha = Math.min(0.95, d.n / (0.0006 + hostMol * 0.05));
      var met = METALS[k.replace("(s)", "")];
      if (!best || alpha > best.alpha) best = { color: met ? met.deposit || met.color : "#888", alpha: alpha, key: k };
    });
    return best;
  };

  BeakerView.prototype.drawRust = function (sim, key, L) {
    var d = sim.deposit["Fe(OH)3(s)"];
    if (!d || d.host !== key) return;
    var ctx = this.ctx;
    var n = Math.min(40, Math.round(d.n * 120000));
    var rnd = UI.rng(19);
    ctx.fillStyle = "rgba(176,83,42,0.85)";
    for (var i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.ellipse(-L / 2 + rnd() * L * 0.9, (rnd() - 0.5) * 6, 2 + rnd() * 3, 1.5 + rnd() * 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  BeakerView.prototype.drawCrystals = function (host, x, top, floor, topAq) {
    var sim = this.sim;
    var d = sim.deposit["Ag(s)"];
    if (!d || d.host !== host) return;
    var ctx = this.ctx;
    var n = Math.min(60, Math.round(d.n * 40000));
    var rnd = UI.rng(23);
    ctx.strokeStyle = "rgba(225,228,234,0.95)";
    ctx.lineWidth = 1.2;
    var y0 = Math.max(top, topAq + 4);
    for (var i = 0; i < n; i++) {
      var cy = y0 + rnd() * (floor - y0);
      var cx = x + (rnd() - 0.5) * 30;
      var len = 3 + rnd() * 9 * Math.min(1, d.n * 2000);
      var ang = rnd() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
      ctx.moveTo(cx + Math.cos(ang) * len * 0.5, cy + Math.sin(ang) * len * 0.5);
      ctx.lineTo(cx + Math.cos(ang + 0.8) * len * 0.8, cy + Math.sin(ang + 0.8) * len * 0.8);
      ctx.stroke();
    }
  };

  BeakerView.prototype.sourcePoint = function (src) {
    var g = this.g;
    if (src && src.indexOf("metal:") === 0) {
      var p = this.metalPos[METALS[src.slice(6)].key];
      if (p) return { x: p.x + (Math.random() - 0.5) * p.w, y: p.y + (Math.random() - 0.5) * p.h, surface: p.surface };
    }
    if (src && src.indexOf("solid:") === 0) {
      var k = src.slice(6);
      var pile = this.pilePos && (this.pilePos[k] || (k === "carbonate" && firstVal(this.pilePos)));
      if (pile) return { x: pile.x + (Math.random() - 0.5) * pile.w, y: pile.y };
    }
    return { x: g.left + 8 + Math.random() * (g.right - g.left - 16), y: g.bottom - 4 - Math.random() * Math.max(4, (g.bottom - this.surface) * 0.7) };
  };

  BeakerView.prototype.updateBubbles = function (dt, speed, m, topAq) {
    var sim = this.sim;
    var self = this;
    var g = this.g;
    if (!this.hasLiquid) { this.bubbles.length = 0; return; }
    var sources = [];
    Object.keys(METALS).forEach(function (s) {
      var r = sim.metalGas[s] || 0;
      if (r > 0) sources.push({ id: "metal:" + s, rate: r });
    });
    var h2Metal = sources.reduce(function (a, b) { return a + b.rate; }, 0);
    ["O2(g)", "CO2(g)", "H2(g)"].forEach(function (gk) {
      var r = sim.rate[gk] || 0;
      if (gk === "H2(g)") r = Math.max(0, r - h2Metal);
      if (r > 1e-8) sources.push({ id: sim.source[gk] && sim.source[gk].indexOf("metal:") !== 0 ? sim.source[gk] : "bulk", rate: r });
    });
    if (m.T >= 99.5) sources.push({ id: "bulk", rate: 4e-4 });
    sources.forEach(function (s) {
      var bps = Math.min(170, 2600 * Math.sqrt(s.rate * Math.max(1, speed)));
      var acc = (self.spawnAcc[s.id] || 0) + bps * dt;
      while (acc >= 1) {
        acc -= 1;
        var p = self.sourcePoint(s.id);
        if (p.surface) {
          self.bubbles.push({ x: p.x + (Math.random() - 0.5) * 10, y: p.y, r: 1 + Math.random() * 1.5, vy: -20, life: 0.4, steam: true });
        } else {
          self.bubbles.push({ x: p.x, y: p.y, r: 1.2 + Math.random() * (s.rate > 1e-4 ? 3.2 : 2), vy: -(45 + Math.random() * 60), ph: Math.random() * 6, life: 9 });
        }
      }
      self.spawnAcc[s.id] = acc;
    });
    var ctx = this.ctx;
    var top = this.surface;
    ctx.lineWidth = 1;
    for (var i = this.bubbles.length - 1; i >= 0; i--) {
      var b = this.bubbles[i];
      b.life -= dt;
      b.y += b.vy * dt;
      if (b.steam) {
        ctx.fillStyle = "rgba(255,255,255," + Math.max(0, b.life * 2) + ")";
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 2, 0, Math.PI * 2); ctx.fill();
        if (b.life <= 0) this.bubbles.splice(i, 1);
        continue;
      }
      b.vy -= 30 * dt;
      b.x += Math.sin(this.t * 6 + b.ph) * 12 * dt;
      if (b.y < top + this.wave(b.x) + 1 || b.life <= 0) { this.bubbles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.stroke();
    }
    if (this.bubbles.length > 900) this.bubbles.splice(0, this.bubbles.length - 900);
  };

  BeakerView.prototype.drawFoam = function (dt, m) {
    var sim = this.sim;
    var g = this.g;
    var total = 0;
    Object.keys(sim.rate).forEach(function (k) { total += sim.rate[k] || 0; });
    var soap = sim.c("jabon") > 0.0008;
    var papa = sim.get("papa(s)") > 0;
    var k = soap ? 5e5 : papa ? 1.5e5 : 4e4;
    var cap = soap ? 330 : 80;
    var target = this.hasLiquid ? Math.min(cap, total > 3e-5 ? total * k : 0) : 0;
    var tau = target > this.foam ? 0.6 : soap ? 9 : 3;
    this.foam += (target - this.foam) * (1 - Math.exp(-dt / tau));
    if (this.foam < 1) return;
    var ctx = this.ctx;
    var top = this.surface;
    var foamTop = top - this.foam;
    var rimY = g.y + 4;
    var tint = m.color.strength > 0.05 ? m.color.rgb : [250, 250, 248];
    var base = tint.map(function (v) { return Math.round(v * 0.25 + 250 * 0.75); });
    var rnd = UI.rng(31);
    ctx.save();
    ctx.fillStyle = UI.rgba(base, 0.95);
    var inside = Math.max(foamTop, rimY);
    ctx.fillRect(g.left, inside, g.right - g.left, top - inside + 2);
    if (foamTop < rimY) {
      var over = rimY - foamTop;
      var cx = (g.left + g.right) / 2;
      var wTop = (g.right - g.left) * 0.75;
      ctx.beginPath();
      ctx.moveTo(g.left + 4, rimY + 2);
      ctx.bezierCurveTo(g.left - 6, rimY - over * 0.4, cx - wTop / 2, rimY - over * 0.8, cx - wTop * 0.3 + Math.sin(this.t * 2) * 6, foamTop);
      ctx.lineTo(cx + wTop * 0.3 + Math.sin(this.t * 2.3) * 6, foamTop);
      ctx.bezierCurveTo(cx + wTop / 2, rimY - over * 0.8, g.right + 6, rimY - over * 0.4, g.right - 4, rimY + 2);
      ctx.closePath();
      ctx.fill();
      var drip = Math.min(g.bh * 0.8, over * 0.9);
      ctx.fillRect(g.x - 6, rimY, 12, drip);
      ctx.fillRect(g.x + g.bw - 6, rimY, 12, drip * 0.8);
      ctx.beginPath();
      ctx.arc(g.x, rimY + drip, 6, 0, Math.PI * 2);
      ctx.arc(g.x + g.bw, rimY + drip * 0.8, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(180,180,180,0.35)";
    var topEdge = Math.max(foamTop, rimY - Math.max(0, rimY - foamTop));
    for (var i = 0; i < 90; i++) {
      var bx = g.left + rnd() * (g.right - g.left);
      var by = Math.max(foamTop, inside) + rnd() * (top - Math.max(foamTop, inside));
      ctx.beginPath();
      ctx.arc(bx, by, 2 + rnd() * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    void topEdge;
  };

  BeakerView.prototype.drawGlass = function () {
    var ctx = this.ctx;
    var g = this.g;
    ctx.save();
    ctx.strokeStyle = "rgba(70,100,115,0.55)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(g.x - 6, g.y);
    ctx.quadraticCurveTo(g.x + 2, g.y, g.x + 2, g.y + 10);
    ctx.lineTo(g.x + 2, g.y + g.bh - 14);
    ctx.quadraticCurveTo(g.x + 2, g.y + g.bh, g.x + 16, g.y + g.bh);
    ctx.lineTo(g.x + g.bw - 16, g.y + g.bh);
    ctx.quadraticCurveTo(g.x + g.bw - 2, g.y + g.bh, g.x + g.bw - 2, g.y + g.bh - 14);
    ctx.lineTo(g.x + g.bw - 2, g.y + 4);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(g.x + 12, g.y + 24);
    ctx.lineTo(g.x + 12, g.y + g.bh - 30);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(g.x + 20, g.y + 30);
    ctx.lineTo(g.x + 20, g.y + g.bh * 0.5);
    ctx.stroke();
    ctx.fillStyle = "rgba(60,80,95,0.7)";
    ctx.strokeStyle = "rgba(60,80,95,0.55)";
    ctx.lineWidth = 1;
    ctx.font = "10px Outfit, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (var v = 50; v <= 250; v += 25) {
      var y = this.yOf(v);
      var major = v % 50 === 0;
      ctx.beginPath();
      ctx.moveTo(g.x + g.bw - 4, y);
      ctx.lineTo(g.x + g.bw - (major ? 26 : 16), y);
      ctx.stroke();
      if (major) ctx.fillText(v, g.x + g.bw - 48, y);
    }
    ctx.font = "600 9px Outfit, sans-serif";
    ctx.fillText("mL", g.x + g.bw - 48, this.yOf(250) - 14);
    ctx.restore();
  };

  BeakerView.prototype.drawThermometer = function (m) {
    var ctx = this.ctx;
    var g = this.g;
    var x = g.x + g.bw - 34;
    var top = g.y - 46;
    var bottom = g.bottom - 16;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.strokeStyle = "rgba(80,100,110,0.6)";
    ctx.lineWidth = 1;
    roundRect(ctx, x - 4, top, 8, bottom - top, 4);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, bottom + 3, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#d33a2c";
    ctx.fill();
    var tMin = -20, tMax = 110;
    var frac = (Math.max(tMin, Math.min(tMax, m.T)) - tMin) / (tMax - tMin);
    var colTop = bottom - frac * (bottom - top - 6);
    ctx.fillStyle = "#d33a2c";
    ctx.fillRect(x - 1.6, colTop, 3.2, bottom - colTop + 2);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "rgba(80,100,110,0.4)";
    roundRect(ctx, x - 26, top - 24, 52, 18, 9);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = m.T > 40 ? "#b4321f" : m.T < 15 ? "#2a62b0" : "#1c2430";
    ctx.font = "600 11px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(UI.fixed(m.T, 1) + " °C", x, top - 15);
    ctx.restore();
    if (m.T < 8) {
      var rnd = UI.rng(41);
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      for (var i = 0; i < (8 - m.T) * 10; i++) {
        var side = rnd() < 0.5;
        var px = side ? g.x - 1 + rnd() * 4 : g.x + g.bw - 3 + rnd() * 4;
        var py = this.surface + rnd() * (g.bottom - this.surface);
        ctx.beginPath();
        ctx.arc(px, py, 1 + rnd() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  BeakerView.prototype.drawBalloon = function (m) {
    var sim = this.sim;
    if (!sim.balloon) return;
    var ctx = this.ctx;
    var g = this.g;
    var L = m.balloon;
    var cx = g.x + g.bw / 2;
    var rimY = g.y;
    ctx.save();
    ctx.fillStyle = "rgba(205,60,60,0.9)";
    roundRect(ctx, g.x - 8, rimY - 6, g.bw + 16, 14, 6);
    ctx.fill();
    if (L < 0.03) {
      ctx.beginPath();
      ctx.moveTo(cx - 30, rimY - 4);
      ctx.quadraticCurveTo(cx - 40, rimY - 40, cx + 10, rimY - 30);
      ctx.quadraticCurveTo(cx + 50, rimY - 22, cx + 30, rimY - 4);
      ctx.closePath();
      ctx.fill();
    } else {
      var r = 28 + 62 * Math.cbrt(Math.min(1, L / 3));
      var cy = rimY - r * 0.95;
      var grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
      grad.addColorStop(0, "rgba(255,150,150,0.95)");
      grad.addColorStop(1, "rgba(190,40,45,0.9)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx - g.bw * 0.32, rimY);
      ctx.bezierCurveTo(cx - r * 1.3, cy + r * 0.2, cx - r, cy - r * 1.05, cx, cy - r * 1.02);
      ctx.bezierCurveTo(cx + r, cy - r * 1.05, cx + r * 1.3, cy + r * 0.2, cx + g.bw * 0.32, rimY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "600 11px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(UI.num(L * 1000, 0) + " mL", cx, cy);
    }
    ctx.restore();
  };

  BeakerView.prototype.drawSteam = function (m) {
    if (m.T < 55 || !this.hasLiquid) return;
    var ctx = this.ctx;
    var g = this.g;
    var n = Math.round((m.T - 55) / 6);
    ctx.save();
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    for (var i = 0; i < n; i++) {
      var phase = (this.t * 0.6 + i * 0.37) % 1;
      var x = g.x + 30 + ((i * 53) % (g.bw - 60));
      var y = g.y - phase * 70;
      ctx.strokeStyle = "rgba(255,255,255," + (0.5 * (1 - phase)) + ")";
      ctx.beginPath();
      ctx.moveTo(x, y + 20);
      ctx.bezierCurveTo(x - 10, y + 10, x + 10, y, x, y - 12);
      ctx.stroke();
    }
    ctx.restore();
  };

  BeakerView.prototype.flameAt = function (x, y, color, scale) {
    var ctx = this.ctx;
    var h = 16 * scale + Math.sin(this.t * 30) * 2;
    ctx.save();
    var grad = ctx.createRadialGradient(x, y - h * 0.3, 1, x, y - h * 0.4, h);
    grad.addColorStop(0, "rgba(255,255,255,0.95)");
    grad.addColorStop(0.35, color);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x - h * 0.35, y);
    ctx.quadraticCurveTo(x - h * 0.4, y - h * 0.6, x, y - h * 1.4);
    ctx.quadraticCurveTo(x + h * 0.4, y - h * 0.6, x + h * 0.35, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  BeakerView.prototype.drawFx = function () {
    var ctx = this.ctx;
    var g = this.g;
    var self = this;
    var cx = g.x + g.bw * 0.4;
    this.fx = this.fx.filter(function (f) { return self.t - f.t0 < f.dur; });
    this.fx.forEach(function (f) {
      var p = (self.t - f.t0) / f.dur;
      var rgb = UI.hexRgb(f.color || "#dddddd");
      if (f.type === "stream") {
        var w = 7 * Math.sin(Math.PI * Math.min(1, p * 1.2));
        ctx.save();
        ctx.fillStyle = UI.rgba(rgb.map(function (v) { return Math.min(255, v - 10); }), 0.85);
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.moveTo(cx - 40, 12);
        ctx.quadraticCurveTo(cx - 6, 20, cx - w / 2, self.surface || g.bottom);
        ctx.lineTo(cx + w / 2, self.surface || g.bottom);
        ctx.quadraticCurveTo(cx + 4, 20, cx - 34, 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.fillStyle = "#e8eef2";
        ctx.strokeStyle = "rgba(70,90,100,0.5)";
        ctx.translate(cx - 58, 4);
        ctx.rotate(0.5);
        roundRect(ctx, -10, -14, 34, 22, 5);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      } else if (f.type === "drops") {
        var n = Math.min(5, Math.max(1, Math.round(f.n)));
        ctx.save();
        ctx.fillStyle = "#e9eef1";
        ctx.strokeStyle = "rgba(70,90,100,0.6)";
        roundRect(ctx, cx - 4, 0, 8, 26, 3);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#4a3f3a";
        roundRect(ctx, cx - 6, -6, 12, 10, 4);
        ctx.fill();
        for (var i = 0; i < n; i++) {
          var dp = p * n - i;
          if (dp < 0 || dp > 1) continue;
          var y = 28 + dp * ((self.surface || g.bottom) - 28);
          ctx.fillStyle = UI.rgba(rgb, 0.9);
          ctx.beginPath();
          ctx.ellipse(cx, y, 2.6, 3.6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else if (f.type === "grains") {
        var rnd = UI.rng(Math.round(f.t0 * 1000));
        ctx.save();
        ctx.fillStyle = UI.rgba(rgb, 0.95);
        for (var j = 0; j < 40; j++) {
          var delay = rnd() * 0.5;
          var pp = (p - delay) / 0.5;
          if (pp < 0 || pp > 1) continue;
          var gx = cx - 14 + rnd() * 28;
          var gy = 10 + pp * pp * ((self.floorY || g.bottom) - 10);
          ctx.fillRect(gx, gy, 2.4, 2.4);
        }
        ctx.restore();
      } else if (f.type === "blow") {
        ctx.save();
        ctx.strokeStyle = "rgba(230,90,90,0.9)";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx + 70, g.y - 50);
        ctx.lineTo(cx + 10, (self.surface || g.bottom) + 40);
        ctx.stroke();
        ctx.restore();
        if (Math.random() < 0.9) {
          self.bubbles.push({ x: cx + 10 + (Math.random() - 0.5) * 8, y: (self.surface || g.bottom) + 40, r: 2 + Math.random() * 4, vy: -90, ph: Math.random() * 6, life: 3 });
        }
      } else if (f.type === "splint") {
        var sx = g.x + g.bw * 0.65;
        var sy = g.y - 10;
        ctx.save();
        ctx.strokeStyle = "#a9773f";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(sx + 90, sy - 70);
        ctx.lineTo(sx, sy);
        ctx.stroke();
        ctx.restore();
        var gas = f.gas;
        if (f.kind === "astilla") {
          if (gas === "H2" && p < 0.35) {
            ctx.save();
            ctx.fillStyle = "rgba(255,230,140," + (1 - p / 0.35) + ")";
            ctx.beginPath(); ctx.arc(sx, sy, 50 * (p / 0.35) + 10, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#b4321f";
            ctx.font = "700 22px Fraunces, serif";
            ctx.textAlign = "center";
            ctx.fillText("¡POP!", sx - 40, sy - 40);
            ctx.restore();
          } else if (gas === "CO2") {
            if (p < 0.4) self.flameAt(sx, sy, "#ffb347", 1.3 * (1 - p / 0.4));
            else {
              ctx.save();
              ctx.strokeStyle = "rgba(120,120,120," + (1 - p) + ")";
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.bezierCurveTo(sx - 10, sy - 20, sx + 10, sy - 30, sx, sy - 50 * p);
              ctx.stroke();
              ctx.restore();
            }
          } else self.flameAt(sx, sy, gas === "O2" ? "#ffe680" : "#ffb347", gas === "O2" ? 2.2 : 1.2);
        } else if (f.kind === "brasa") {
          var lit = gas === "O2" && p > 0.2;
          ctx.save();
          ctx.fillStyle = lit ? "#ffcf5a" : "rgba(255,90,40," + (gas === "CO2" ? 1 - p : 0.9) + ")";
          ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          if (lit) self.flameAt(sx, sy, "#ffd36b", 1.8);
        }
      }
    });
  };

  function firstVal(obj) {
    if (!obj) return null;
    var k = Object.keys(obj)[0];
    return k ? obj[k] : null;
  }

  function lighten(hex, amt) {
    var c = UI.hexRgb(hex).map(function (v) { return Math.min(255, v + amt); });
    return "rgb(" + c.join(",") + ")";
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    var rr = Array.isArray(r) ? r : [r, r, r, r];
    ctx.moveTo(x + rr[0], y);
    ctx.lineTo(x + w - rr[1], y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr[1]);
    ctx.lineTo(x + w, y + h - rr[2]);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr[2], y + h);
    ctx.lineTo(x + rr[3], y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr[3]);
    ctx.lineTo(x, y + rr[0]);
    ctx.quadraticCurveTo(x, y, x + rr[0], y);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    roundRectPath(ctx, x, y, w, h, r);
  }

  AQ.BeakerView = BeakerView;
})();
