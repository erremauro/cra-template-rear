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

    const sassCwd = path.resolve(path.join(__dirname, "..", ".."));
    const walkDir = path.resolve(path.join(sassCwd, "src"));

    if (isSass && !hasSass) {
      spawnSync(
        "yarn",
        ["add", "sass", "--cwd", sassCwd],
        { stdio: "inherit" }
      );
    } else if (!isSass && hasSass) {
      spawnSync(
        "yarn",
        ["remove", "sass", "--cwd", sassCwd],
        { stdio: "inherit" }
      );
    }

    walk(walkDir, (err, results) => {
      if (err) return reject(err);

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
                return resolve();
              });
            }
            else if (extname === ".js") {
              fs.readFile(file, "utf-8", (err, data) => {                
                const matches = data.match(jsStylePattern);
                let replacements = [];
                if (matches === null) return resolve()

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
              });
            } else {
              return resolve();
            }
          })
      );

      return Promise.all(promises).then(() => resolve());
    });
  });
}
