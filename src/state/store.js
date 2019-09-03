import { createStore } from 'redux'
import { AsyncNodeStorage } from 'redux-persist-node-storage'
import { persistStore, persistReducer } from 'redux-persist'

import reducer from './reducer'

// Middleware?
export let store
export let persistor
export let dispatch
export let getState
export let subscribe


const storage = new AsyncNodeStorage('/tmp/storageDir')

const persistConfig = {
  key: 'project-data',
  whitelist: ['projectData'],
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

export function initStore() {
  store = createStore(persistedReducer)
  persistor = persistStore(store)

  getState = store.getState
  dispatch = store.dispatch
  subscribe = store.subscribe

  window.getState = getState // For debugging

  return store
}

export default {
  initStore,
  store,
  getState,
  dispatch,
  subscribe,
}