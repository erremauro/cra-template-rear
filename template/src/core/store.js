import { configureStore } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import { reducers } from "../reducers";
import api from "./api-middleware";

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() });

const middlewares = [routerMiddleware, api];

export const store = configureStore({
  devtools: process.env.NODE_ENV !== "production",
  reducer: {
    ...reducers,
    router: routerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
});

export const history = createReduxHistory(store);
