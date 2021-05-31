#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const walk = require("../lib/walk");
const styleExt = require("../lib/style-extension");
const { spawnSync } = require("child_process");
const pkg = require("../../package.json");

if (require.main === module) {
  configureStyles(process.argv.slice(2)).catch((err) => {
    console.error(err);
  });
} else {
  module.exports = configureStyles;
}

///////////////////////////////////////////

function configureStyles() {
  return new Promise((resolve, reject) => {
    const isSass = styleExt === "scss";
    const hasSass = pkg.dependencies["sass"];

    if (isSass && !hasSass) {
      spawnSync(
        "yarn",
        ["add", "sass", "--cwd", path.resolve(__dirname + "../../")],
        { stdio: "inherit" }
      );
    } else if (!isSass && hasSass) {
      spawnSync(
        "yarn",
        ["remove", "sass", "--cwd", path.resolve(__dirname + "../../")],
        { stdio: "inherit" }
      );
    }

    walk(path.resolve(__dirname + "/../../src"), (err, results) => {
      if (err) throw err;

      const styleExtPattern = isSass ? /\.css$/i : /\.scss$/i;
      const jsStylePattern = isSass ? /\w+(\.css)/g : /\w+(\.scss)/g;
      const newStyleExt = isSass ? ".scss" : ".css";
      const oldStyleExt = isSass ? ".css" : ".scss";

      const promises = results.map(
        (file) =>
          new Promise((resolve, reject) => {
            const extname = path.extname(file);

            // Rename stylesheets
            if (extname === oldStyleExt) {
              const newName = file.replace(styleExtPattern, newStyleExt);
              fs.rename(file, newName, (err) => {
                if (err) return reject(err);
              });
            } else {
              resolve();
            }

            // Replace stylesheet references inside files
            if (extname === ".js") {
              fs.readFile(file, "utf-8", (err, data) => {
                const matches = data.match(jsStylePattern);
                let replacements = [];
                if (matches !== null) {
                  replacements = matches.map((m) =>
                    m.replace(oldStyleExt, newStyleExt)
                  );

                  matches.forEach((m, i) => {
                    data = data.replace(m, replacements[i]);
                  });

                  fs.writeFile(file, data, () => {
                    if (err) return reject(err);
                    resolve();
                  });
                }
              });
            }
          })
      );

      return Promise.all(promises);
    });
  });
}
