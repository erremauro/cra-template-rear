import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import Shell from '@/containers/Shell';

const App = ({history, store}) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path='/' component={Shell} />
      </Switch>
    </ConnectedRouter>
  </Provider>
);

export default App;
