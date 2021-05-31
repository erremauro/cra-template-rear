const pkg = require("../../package.json");

let styleExt = "css";
if (pkg.rearConfig) {
  styleExt = pkg.rearConfig.sass ? "scss" : "css";
}

module.exports = styleExt;
