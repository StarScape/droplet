import React from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

import { initStore } from './state/store'
import EditorScreen from './screens/EditorScreen'
import DashboardScreen from './screens/DashboardScreen'
import ProjectScreen from './screens/ProjectScreen'

import './styles/App.css';

window.location.hash = 'dashboard'
const { store, persistor } = initStore()

const PossibleRedirect = ({ store }) => {
  const { location, projects, chapters } = store.getState()

  if (!location) {
    return null
  }

  const lastProject = location.project
  const lastChapter = location.chapter

  // Update with current version of project and chapter from store
  const project = projects[lastProject.name]
  const chapter = chapters[lastProject.name].ordered.find(({ id }) => id === lastChapter.id)

  return (
    <Redirect
      to={{
        pathname: '/editor',
        state: {
          file: chapter.id,
          project: project,
          chapter: chapter,
        }
      }}
    />
  )
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
            <PossibleRedirect store={store} />
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
      </PersistGate>
    </Provider>
  );
}

export default App
