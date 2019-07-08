import { createStore } from "redux"
import reducer from './reducer'

// Middleware?
export let store
export let dispatch
export let getState
export let subscribe

export function initStore() {
  store = createStore(reducer);
  getState = store.getState
  dispatch = store.dispatch
  subscribe = store.subscribe

  window.getState = getState // For debugging

  return store;
}

export default {
  initStore,
  store,
  getState,
  dispatch,
  subscribe,
}