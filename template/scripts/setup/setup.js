#!/usr/bin/env node
const preInstall = require("./pre-install");
const postInstall = require("./post-install");
const configureStyles = require("./configure-styles");

if (require.main === module) {
  setup();
} else {
  module.exports = setup;
}

///////////////////////////////////////////

function setup() {
  preInstall();
  postInstall();
  configureStyles();
}
