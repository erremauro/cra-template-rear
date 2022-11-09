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
// import { useSelector, useDispatch } from "redux";
import "./$1.${styleExt}";

function $1() {

  // const dispatch = useDispatch();

  return(
    <div className="$1">
    </div>
  )
}

export default $1;
`;

const INDEX_TEMPLATE = `
export { default } from "./$1";
`;

const CSS_TEMPLATE = `
.$1 {

}
`;

const PATTERN = /\$1/g;

if (require.main === module) {
  Main(process.argv.slice(2));
}

////////////////////////////////////////////////////////////////////////////

function Main(argv) {
  const program = parseArgs(argv);
  const { args } = program;

  const containersPath = isPath(args[0])
    ? args.shift(0, 1)
    : path.resolve(__dirname, '..', 'src', 'containers');
  const containerName = humps.pascalize(args.join('_'));
  const containerDir = path.join(containersPath, containerName);

  logger.log(`Creating new container in %c${containersPath}\n`, 'green');

  if (!checkDir(containerDir)) return;

  const files = [{
    file: path.join(containerDir, `${containerName}.js`),
    data: CONTAINER_TEMPLATE.replace(PATTERN, containerName)
  }, {
    file: path.join(containerDir, `${containerName}.${styleExt}`),
    data: CSS_TEMPLATE.replace(PATTERN, containerName)
  }, {
    file: path.join(containerDir, 'index.js'),
    data: INDEX_TEMPLATE.replace(PATTERN, containerName)
  }];

  createTemplates(files);

  logger.log();
}

