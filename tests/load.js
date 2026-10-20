const path = require("path");

["elements", "formula", "catalog", "engine"].forEach((f) => {
  require(path.join(__dirname, "..", "js", "chem", f + ".js"));
});

module.exports = globalThis.AQ;
