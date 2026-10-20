const test = require("node:test");
const assert = require("node:assert");
const path = require("path");

globalThis.window = globalThis;
const AQ = require("./load");
require(path.join(__dirname, "..", "js", "ui", "util.js"));
require(path.join(__dirname, "..", "js", "ui", "practices.js"));
AQ.UI.toast = () => {};

function play(practice) {
  const sim = new AQ.Sim();
  practice.steps.forEach((step, i) => {
    if (step.act === "empty") sim.reset();
    for (let tries = 0; tries < 200 && !step.done(sim); tries++) {
      if (tries === 0 && step.act === "balloon") sim.toggleBalloon();
      else if (tries === 0 && step.act && step.act !== "empty") sim.test(step.act);
      if (step.pick && (tries === 0 || !step.once)) {
        const r = AQ.REAGENT_BY_ID[step.pick];
        const res = sim.pour(r.id, step.amount || r.def, step.conc || r.defConc);
        if (!res.ok) assert.fail(practice.id + ": " + res.msg);
      }
      if (step.stir) sim.stir();
      sim.run(tries < 5 ? 3 : 20);
      sim.measure();
    }
    assert.ok(step.done(sim), practice.id + ": no se completa el paso " + (i + 1) + " (" + step.text + ")");
  });
  return sim;
}

AQ.Practices.list.forEach((p) => {
  test("práctica completable: " + p.title, () => { play(p); });
});
