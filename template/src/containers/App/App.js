import React from 'react';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { Routes, Route } from 'react-router-dom';
import Shell from '@/containers/Shell';

const App = ({history, store}) => (
  <Provider store={store}>
    <Router history={history}>
      <Routes>
        <Route path='/*' element={<Shell />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
