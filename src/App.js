import React from 'react'
import { Provider } from 'react-redux'
import { initStore } from './state/store'
import Editor from './components/Editor'
import Actionbar from './components/Actionbar'
import WordCount from './components/WordCount'

import './styles/App.css';

const store = initStore()

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Editor store={store} />
        <Actionbar store={store} />
        <WordCount store={store} />
      </div>
    </Provider>
  );
}

export default App;
