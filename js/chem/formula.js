(function (root) {
  var AQ = root.AQ = root.AQ || {};

  var SUB_IN = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
  var SUB_OUT = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };

  function normalize(text) {
    return String(text)
      .replace(/[₀-₉]/g, function (c) { return SUB_IN[c]; })
      .replace(/\((s|l|g|aq|ac)\)/gi, "")
      .replace(/[·•∙*]/g, ".")
      .trim();
  }

  function FormulaError(msg) {
    this.message = msg;
  }

  function parse(text) {
    var s = normalize(text);
    if (!s) throw new FormulaError("Fórmula vacía");
    var total = {};
    s.split(".").forEach(function (part) {
      var m = /^(\d+)(.*)$/.exec(part);
      var mult = 1;
      if (m && /^[A-Z(\[]/.test(m[2])) {
        mult = Number(m[1]);
        part = m[2];
      }
      var counts = parseGroup(part);
      Object.keys(counts).forEach(function (el) {
        total[el] = (total[el] || 0) + counts[el] * mult;
      });
    });
    return total;
  }

  function parseGroup(s) {
    var stack = [{}];
    var i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c === "(" || c === "[") {
        stack.push({});
        i++;
      } else if (c === ")" || c === "]") {
        if (stack.length < 2) throw new FormulaError("Paréntesis sin abrir");
        i++;
        var n = readNum();
        var top = stack.pop();
        var into = stack[stack.length - 1];
        Object.keys(top).forEach(function (el) { into[el] = (into[el] || 0) + top[el] * n; });
      } else if (/[A-Z]/.test(c)) {
        var sym = c;
        i++;
        if (i < s.length && /[a-z]/.test(s[i])) { sym += s[i]; i++; }
        if (AQ.MASS && !AQ.MASS[sym]) throw new FormulaError("No conozco el elemento «" + sym + "»");
        var k = readNum();
        var cur = stack[stack.length - 1];
        cur[sym] = (cur[sym] || 0) + k;
      } else {
        throw new FormulaError("Carácter inesperado «" + c + "»");
      }
    }
    if (stack.length !== 1) throw new FormulaError("Falta cerrar un paréntesis");
    return stack[0];

    function readNum() {
      var start = i;
      while (i < s.length && /[0-9]/.test(s[i])) i++;
      return start === i ? 1 : Number(s.slice(start, i));
    }
  }

  function molarMass(text) {
    var counts = typeof text === "string" ? parse(text) : text;
    var m = 0;
    Object.keys(counts).forEach(function (el) { m += AQ.MASS[el] * counts[el]; });
    return m;
  }

  function pretty(text) {
    var s = String(text);
    var out = "";
    var afterDot = true;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (/[0-9]/.test(c) && !afterDot) out += SUB_OUT[c];
      else out += c;
      if (c === "." || c === "·" || c === " ") afterDot = true;
      else if (!/[0-9]/.test(c)) afterDot = false;
    }
    return out.replace(/\./g, "·");
  }

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  }

  function frac(n, d) {
    if (d === undefined) d = 1;
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d);
    return [n / g, d / g];
  }
  function fsub(a, b) { return frac(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
  function fmul(a, b) { return frac(a[0] * b[0], a[1] * b[1]); }
  function fdiv(a, b) { return frac(a[0] * b[1], a[1] * b[0]); }

  function splitSide(side) {
    return side.split("+")
      .map(function (t) { return normalize(t).replace(/^\d+\s*(?=[A-Z(\[])/, ""); })
      .filter(Boolean);
  }

  function balance(equation) {
    var sides = String(equation).split(/->|→|=|⟶/);
    if (sides.length !== 2) throw new FormulaError("Escribe la ecuación con una flecha: reactivos -> productos");
    var left = splitSide(sides[0]);
    var right = splitSide(sides[1]);
    if (!left.length || !right.length) throw new FormulaError("Faltan reactivos o productos");
    var species = left.concat(right);
    var parsed = species.map(parse);
    var elements = [];
    parsed.forEach(function (p) { Object.keys(p).forEach(function (el) { if (elements.indexOf(el) < 0) elements.push(el); }); });
    elements.forEach(function (el) {
      var inL = left.some(function (_, i) { return parsed[i][el]; });
      var inR = right.some(function (_, i) { return parsed[left.length + i][el]; });
      if (!inL || !inR) throw new FormulaError("El elemento " + el + " aparece solo en un lado: así no se puede balancear");
    });
    var cols = species.length;
    var M = elements.map(function (el) {
      return species.map(function (_, j) {
        var c = parsed[j][el] || 0;
        return frac(j < left.length ? c : -c);
      });
    });
    var pivots = [];
    var row = 0;
    for (var col = 0; col < cols && row < M.length; col++) {
      var p = -1;
      for (var r = row; r < M.length; r++) if (M[r][col][0] !== 0) { p = r; break; }
      if (p < 0) continue;
      var tmp = M[p]; M[p] = M[row]; M[row] = tmp;
      var pv = M[row][col];
      M[row] = M[row].map(function (x) { return fdiv(x, pv); });
      for (var r2 = 0; r2 < M.length; r2++) {
        if (r2 === row || M[r2][col][0] === 0) continue;
        var f = M[r2][col];
        M[r2] = M[r2].map(function (x, k) { return fsub(x, fmul(f, M[row][k])); });
      }
      pivots.push(col);
      row++;
    }
    var free = [];
    for (var c = 0; c < cols; c++) if (pivots.indexOf(c) < 0) free.push(c);
    if (free.length === 0) throw new FormulaError("No existe una forma de balancearla: revisa las fórmulas");
    if (free.length > 1) throw new FormulaError("Hay varias maneras de balancearla: son dos reacciones mezcladas");
    var fc = free[0];
    var sol = [];
    for (var j = 0; j < cols; j++) sol[j] = frac(0);
    sol[fc] = frac(1);
    pivots.forEach(function (pc, i) { sol[pc] = frac(-M[i][fc][0], M[i][fc][1]); });
    var lcm = sol.reduce(function (acc, x) { return acc * x[1] / gcd(acc, x[1]); }, 1);
    var ints = sol.map(function (x) { return x[0] * lcm / x[1]; });
    if (ints.every(function (x) { return x <= 0; })) ints = ints.map(function (x) { return -x; });
    if (ints.some(function (x) { return x <= 0; })) throw new FormulaError("Con esas sustancias no sale una ecuación con todos los coeficientes positivos");
    var g = ints.reduce(function (a, b) { return gcd(a, b); });
    ints = ints.map(function (x) { return x / g; });
    var atoms = elements.map(function (el) {
      var l = 0, rr = 0;
      species.forEach(function (_, j) {
        var n = (parsed[j][el] || 0) * ints[j];
        if (j < left.length) l += n; else rr += n;
      });
      return { el: el, left: l, right: rr };
    });
    return {
      left: left.map(function (s, i) { return { formula: s, coef: ints[i] }; }),
      right: right.map(function (s, i) { return { formula: s, coef: ints[left.length + i] }; }),
      atoms: atoms
    };
  }

  function format(bal) {
    function side(list) {
      return list.map(function (t) { return (t.coef > 1 ? t.coef + " " : "") + pretty(t.formula); }).join(" + ");
    }
    return side(bal.left) + " → " + side(bal.right);
  }

  AQ.Formula = {
    parse: parse,
    molarMass: molarMass,
    pretty: pretty,
    balance: balance,
    format: format,
    Error: FormulaError
  };
})(typeof window !== "undefined" ? window : globalThis);
