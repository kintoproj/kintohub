import { combineReducers } from 'redux';
import { History } from 'history';
import authReducer from './auth/reducers';
import sidePanelReducer from './sidePanel/reducers';
import appReducer from './app/reducers';
import servicesReducer from './services/reducers';
import serviceReducer from './service/reducers';
import releasesReducer from './releases/reducers';
import repositoriesReducer from './repositories/reducers';
import { createRouteReducer } from './route/reducers';

export const createRootReducer = (history: History) => {
  return combineReducers({
    auth: authReducer,
    router: createRouteReducer(history),
    sidePanel: sidePanelReducer,
    app: appReducer,
    services: servicesReducer,
    service: serviceReducer,
    releases: releasesReducer,
    repositories: repositoriesReducer,
  });
};
