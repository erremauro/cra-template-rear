#!/usr/bin/env node
const path = require("path");
const humps = require("humps");
const logger = require("rear-logger")("create-action");
const checkDir = require("./lib/check-dir");
const isPath = require("./lib/is-path");
const createTemplates = require("./lib/create-templates");

const ACTION_TEMPLATE = `
/*
export const $1Action = (payload) => (dispatch) =>
  dispatch({
    API_CALL: {
      types: ["$1/request", "$1/success", "$1/failure"],
      endpoint: "$1.json",
      payload,
    },
  });
*/
`;

const REDUCER_TEMPLATE = `
import { createSlice } from "@reduxjs/toolkit";

const $1Slice = createSlice({
  name: "$1",
  initialState: {
    // define your state here...
  },
  reducers: {
    success: (state, action) => {
      state = { ...state, ...action.response.data };
    },
    // failure: (state, action) => {
    //   console.log("[reducers/$1#failure] error: ", action.response.error);
    // },
  },
});

export default $1Slice.reducers;
`;

const PATTERN = /\$1/g;

if (require.main === module) {
  Main(process.argv.slice(2));
}

////////////////////////////////////////////////////////////////////////////

function Main(args) {
  const actionsPath = isPath(args[0])
    ? args.shift(0, 1)
    : path.resolve(__dirname, "..", "src", "actions");
  const reducersPath = path.resolve(__dirname, "..", "src", "reducers");
  const actionName = humps.camelize(args.join("_"));

  logger.log(`Creating new actions in %c${actionsPath}\n`, "green");

  createTemplates([
    {
      file: path.join(actionsPath, `${actionName}.js`),
      data: ACTION_TEMPLATE.replace(PATTERN, actionName),
    },
    {
      file: path.join(reducersPath, `${actionName}.js`),
      data: REDUCER_TEMPLATE.replace(PATTERN, actionName),
    },
  ]);

  logger.log();
}
