import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducers from '@/reducers';
import api from './api-middleware';

const enhancers = process.env.NODE_ENV !== 'production'
  ? composeWithDevTools
  : compose

const CreateStore = (history) => createStore(
  combineReducers({
    reducers,
    router: connectRouter(history),
  }),
  enhancers(
    applyMiddleware(thunk, routerMiddleware(history), api)
  )
)

export default CreateStore