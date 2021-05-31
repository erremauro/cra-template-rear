#!/usr/bin/env node
const preInstall = require("./pre-install");
const postInstall = require("./post-install");
const configureStyles = require("./configure-styles");
const logger = require("rear-logger")("setup");

if (require.main === module) {
  setup();
} else {
  module.exports = setup;
}

///////////////////////////////////////////

function setup() {
  logger.log("Setting up your project... \n");
  logger.info("Removing %cnode_modules/@", "cyan");
  preInstall();
  
  logger.info("Configuring styles...");
  configureStyles().then(() => {
    logger.info(
      "Symlinking %csrc%c to %cnode_modules/@\n",
      "green",
      "reset",
      "cyan"
    );
    postInstall();
  });
}
