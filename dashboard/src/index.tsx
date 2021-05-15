import ErrorBoundaries from 'components/templates/ErrorBoundaries';
import { GRPCClientsProvider } from 'components/templates/GRPCClients';
import configureStore, { history } from 'configureStore';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import './index.css';

const store = configureStore();
const render = () => {
  ReactDOM.render(
    <>
      <Provider store={store}>
          <GRPCClientsProvider>
            <ErrorBoundaries>
              <App history={history} />
            </ErrorBoundaries>
          </GRPCClientsProvider>
      </Provider>
    </>,
    document.getElementById('root')
  );
};

render();
