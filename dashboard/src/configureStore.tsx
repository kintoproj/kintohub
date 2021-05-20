import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import RouteLeaveConfirmation from 'components/organisms/RouteLeaveConfirmation';
import { createRootReducer } from './states';

const getUserConfirmation = (message: string, callback: Function) => {
  const modal = document.getElementById('route-modal')!;

  const withCleanup = (answer: boolean) => {
    ReactDOM.unmountComponentAtNode(modal);
    callback(answer);
  };

  ReactDOM.render(
    <RouteLeaveConfirmation
      portal={modal}
      message={message}
      onCancel={() => withCleanup(false)}
      onConfirm={() => withCleanup(true)}
    />,
    modal
  );
};

export const history = createBrowserHistory({
  getUserConfirmation,
});

export default function configureStore(preloadedState?: any) {
  const composeEnhancer: typeof compose =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(applyMiddleware(routerMiddleware(history), thunk))
  );

  return store;
}
