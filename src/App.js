import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

import { initStore } from './state/store'
import Notification from './components/Notification'
import Modal from './components/Modal'
import EditorScreen from './screens/EditorScreen'
import DashboardScreen from './screens/DashboardScreen'
import ProjectScreen from './screens/ProjectScreen'
import InitialRedirect from './InitialRedirect'

import './styles/App.scss';

window.location.hash = 'dashboard'
const { store, persistor } = initStore()

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <InitialRedirect store={store} />

          <div className="App">
            <Notification />
            <Modal />

            <Switch>
              <Route
                exact
                path='/editor'
                render={ () => <EditorScreen store={store} /> }
              />
              <Route
                exact path='/dashboard'
                render={ () => <DashboardScreen store={store} /> }
              />
              <Route 
                exact path='/project'
                render={ () => <ProjectScreen store={store} />}
              />
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App
