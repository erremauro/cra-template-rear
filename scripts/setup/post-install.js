#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const preInstall = require("./pre-install");

if (require.main === module) {
  postInstall();
} else {
  module.exports = postInstall;
}

function postInstall() {
  const nodeModulesTargetPath = path.resolve(
    path.join(__dirname, "../..", "node_modules", "@")
  );

  const srcTargetPath = path.resolve(path.join(__dirname, "../..", "src"));

  try {
    fs.symlinkSync(srcTargetPath, nodeModulesTargetPath);
  } catch (err) {
    if (err) {
      if (err.code === "EEXIST") {
        preInstall();
        postInstall();
      } else {
        console.error(
          "Unable to create symlink during post-install phase: ",
          err.message
        );
      }
    }
  }
}
