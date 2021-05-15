import { History } from 'history';
import { RouterState, connectRouter } from 'connected-react-router';

export const createRouteReducer = (history: History) => connectRouter(history);

export interface State {
  count: number;
  router: RouterState;
}
