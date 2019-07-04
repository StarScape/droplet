import { createStore } from "redux"
import reducer from './reducer'

// middleware?

export let store

export function initStore() {
  store = createStore(reducer);
  return store;
}

export default {
  initStore,
  store,
}