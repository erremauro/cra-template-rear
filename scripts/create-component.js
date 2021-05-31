#!/usr/bin/env node
const path = require('path');
const humps = require('humps');
const logger = require('rear-logger')('create-component');
const checkDir = require('./lib/check-dir');
const isPath = require('./lib/is-path');
const parseArgs = require('./lib/parse-args');
const createTemplates = require('./lib/create-templates');
const styleExt = require('./lib/style-extension');

const COMPONENT_TEMPLATE = `
import React, { Component } from "react";
import PropTypes from "prop-types";
import "./$1.${styleExt}";

class $1 extends Component {
  static propTypes = {
    // define your prop types here
  };

  static defaultProps = {
    // define your default props values here
  };

  render() {
    return(
      <div className="$1">
      </div>
    );
  }
}

export default $1;
`;

const COMPONENT_TEMPLATE_LIGHT = `
import React from "react";
import "./$1.${styleExt}";

const $1 = (props) =>
  <div className="$1">
  </div>

export default $1;
`;

const INDEX_TEMPLATE = `
export { default } from "./$1";
`
const CSS_TEMPLATE = `
.$1 {

}
`;

const PATTERN = /\$1/g;

if (require.main === module) {
  Main(process.argv.slice(2));
}

function Main(argv) {
  const program = parseArgs(argv);
  const { isLight } = program.options;
  const { args } = program;

  const componentsPath = isPath(args[0])
    ? args.shift(0, 1)
    : path.resolve(__dirname, '..', 'src', 'components');
  const componentName = humps.pascalize(args.join('_'));
  const componentDir = path.join(componentsPath, componentName);

  logger.log(`Creating new component in %c${componentsPath}\n`, 'green');

  if (!checkDir(componentDir)) return;

  const TEMPLATE = isLight ? COMPONENT_TEMPLATE_LIGHT : COMPONENT_TEMPLATE;

  createTemplates([{
    file: path.join(componentDir, `${componentName}.js`),
    data: TEMPLATE.replace(PATTERN, componentName).trim()
  }, {
    file: path.join(componentDir, `${componentName}.${styleExt}`),
    data: CSS_TEMPLATE.replace(PATTERN, componentName).trim()
  }, {
    file: path.join(componentDir, 'index.js'),
    data: INDEX_TEMPLATE.replace(PATTERN, componentName)
  }]);

  logger.log();
}

function isLightComponent(args) {
  const optionId = args.findIndex(arg => /^(--light|-l)/i.test(arg));
  let isLight = false;
  if (optionId !== -1) {
    isLight = true;
    args.splice(optionId, 1);
  }
  return isLight;
}
