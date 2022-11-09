#!/usr/bin/env node
const path = require("path");
const humps = require("humps");
const logger = require("rear-logger")("create-component");
const checkDir = require("./lib/check-dir");
const isPath = require("./lib/is-path");
const parseArgs = require("./lib/parse-args");
const createTemplates = require("./lib/create-templates");
const styleExt = require("./lib/style-extension");

const COMPONENT_TEMPLATE = `
import "./$1.${styleExt}";

function $1(props) {
  return(
    <div className="$1">
    </div>
  );
}

export default $1;
`;

const COMPONENT_TEMPLATE_LIGHT = `
import "./$1.${styleExt}";

const $1 = (props) =>
  <div className="$1">
  </div>

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

function Main(argv) {
  const program = parseArgs(argv);
  const { isLight } = program.options;
  const { args } = program;

  const componentsPath = isPath(args[0])
    ? args.shift(0, 1)
    : path.resolve(__dirname, "..", "src", "components");
  const componentName = humps.pascalize(args.join("_"));
  const componentDir = path.join(componentsPath, componentName);

  logger.log(`Creating new component in %c${componentsPath}\n`, "green");

  if (!checkDir(componentDir)) return;

  const TEMPLATE = isLight ? COMPONENT_TEMPLATE_LIGHT : COMPONENT_TEMPLATE;

  createTemplates([
    {
      file: path.join(componentDir, `${componentName}.js`),
      data: TEMPLATE.replace(PATTERN, componentName).trim(),
    },
    {
      file: path.join(componentDir, `${componentName}.${styleExt}`),
      data: CSS_TEMPLATE.replace(PATTERN, componentName).trim(),
    },
    {
      file: path.join(componentDir, "index.js"),
      data: INDEX_TEMPLATE.replace(PATTERN, componentName),
    },
  ]);

  logger.log();
}
