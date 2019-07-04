import React from 'react'
import { Provider } from 'react-redux'
import { initStore } from './state/store'
import Editor from './Editor'

import './styles/App.css';

const store = initStore()

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Editor store={store}/>
      </div>
    </Provider>
  );
}

export default App;
