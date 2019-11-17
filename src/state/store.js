import { createStore, bindActionCreators } from 'redux'
import { AsyncNodeStorage } from 'redux-persist-node-storage'
import { persistStore, persistReducer } from 'redux-persist'

import { setModal } from './actions'
import reducer from './reducer'
const { app } = require('electron').remote

// Middleware?
export let store
export let persistor
export let dispatch
export let getState
export let subscribe

export let displayModal

const storage = new AsyncNodeStorage(app.getPath('userData'))

const persistConfig = {
  key: 'project-data',
  whitelist: ['projects', 'chapters', 'location'],
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

  // Just don't even ask why this is here. Needs refactor...
  displayModal = bindActionCreators(setModal, dispatch)

  return { store, persistor }
}

export default {
  initStore,
  store,
  getState,
  dispatch,
  subscribe,
}