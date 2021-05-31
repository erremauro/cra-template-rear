#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

if (require.main === module) {
  preInstall();
} else {
  module.exports = preInstall;
}

function preInstall() {
  const targetPath = path.resolve(
    path.join(__dirname, "../..", "node_modules", "@")
  );

  try {
    fs.unlinkSync(targetPath);  
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
}
