import { combineReducers } from 'redux';
import { createConnectRouter } from 'connected-react-router';
import { drizzleReducers } from 'drizzle';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const reducer = combineReducers({
  // routing: createConnectRouter(history)(rootReducer), later when we have real reducers.
  ...drizzleReducers
});

export default reducer;