import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './Root.state';

export default function configureStore ({ initialState = {}, history }) {
  let middleware = applyMiddleware(thunk);
  const store = middleware(createStore)(rootReducer, initialState);
  return store;
}