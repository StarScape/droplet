import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { initStore } from './state/store'
import { setProjects } from './state/actions'
import { loadProjectInfo } from './files'
import EditorScreen from './screens/EditorScreen'
import DashboardScreen from './screens/DashboardScreen'
import ProjectScreen from './screens/ProjectScreen'

import './styles/App.css';


window.location.hash = 'dashboard'
const store = initStore()

function App() {  
  store.dispatch(setProjects(loadProjectInfo()))
  
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
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
              exact path='/projects' 
              render={ () => <ProjectScreen store={store} />}
            />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
