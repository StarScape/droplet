import { createStore } from "redux"
import reducer from './reducer'

// middleware?
export let store
export let dispatch
export let getState

export function initStore() {
  store = createStore(reducer);
  getState = store.getState
  dispatch = store.dispatch
  window.getState = getState
  return store;
}


export default {
  initStore,
  store,
  getState,
  dispatch,
}