#!/usr/bin/env node
const path = require('path');
const humps = require('humps');
const logger = require('rear-logger')('create-container');
const checkDir = require('./lib/check-dir');
const isPath = require('./lib/is-path');
const parseArgs = require('./lib/parse-args');
const createTemplates = require('./lib/create-templates');
const styleExt = require('./lib/style-extension');

const CONTAINER_TEMPLATE = `
import React, { Component } from "react";
import { connect } from "react-redux";
import { getProps, getActions } from "./Providers";
import "./$1.${styleExt}";

class $1 extends Component {
	render() {
		return(
			<div className="$1">
			</div>
		);
	}
}

export default connect(getProps, getActions)($1);
`;

const CONTAINER_TEMPLATE_LIGHT = `
import React, { Component } from "react";
import "./$1.${styleExt}";

class $1 extends Component {
  render() {
    return(
      <div className="$1">
      </div>
    );
  }
}

export default $1;
`;

const INDEX_TEMPLATE = `
export { default } from "./$1";
`
const CSS_TEMPLATE = `
.$1 {

}
`;

const PROVIDER_TEMPLATE = `
// import { myAction } from "../../actions/MyActions";

export function getActions(dispatch) {
  return {
    // myAction: (opts) => dispatch(myAction(opts)),
  }
}

export function getProps(state, ownProps) {
  return {
    // myReducer: state.reducers.myReducer,
  }
}
`;

const PATTERN = /\$1/g;

if (require.main === module) {
	Main(process.argv.slice(2));
}

/////////////////////////////////

function Main(argv) {
  const program = parseArgs(argv);
  const { isLight } = program.options;
  const { args } = program;

  const containersPath = isPath(args[0])
    ? args.shift(0, 1)
    : path.resolve(__dirname, '..', 'src', 'containers');
	const containerName = humps.pascalize(args.join('_'));
	const containerDir = path.join(containersPath, containerName);

  logger.log(`Creating new container in %c${containersPath}\n`, 'green');

  if (!checkDir(containerDir)) return;

  const TEMPLATE = isLight ? CONTAINER_TEMPLATE_LIGHT : CONTAINER_TEMPLATE;

  const files = [{
    file: path.join(containerDir, `${containerName}.js`),
    data: TEMPLATE.replace(PATTERN, containerName)
  }, {
    file: path.join(containerDir, `${containerName}.${styleExt}`),
    data: CSS_TEMPLATE.replace(PATTERN, containerName)
  }, {
    file: path.join(containerDir, `Providers.js`),
    data: PROVIDER_TEMPLATE.replace(PATTERN, containerName)
  }, {
    file: path.join(containerDir, 'index.js'),
    data: INDEX_TEMPLATE.replace(PATTERN, containerName)
  }];

  // removes provider template
  if (isLight) files.splice(2, 1);

  createTemplates(files);

  logger.log();
}
