import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/containers/App';
import reportWebVitals from './reportWebVitals';
import createStore from '@/core/create-store';
import { createBrowserHistory } from 'history';
import '@/index.css';

const history = createBrowserHistory()
const store = createStore(history);

ReactDOM.render(
  <React.StrictMode>
    <App history={history} store={store} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
