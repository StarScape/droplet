import React from 'react';
import Editor from './Editor'
import './App.css';

require('electron').ipcRenderer.on('filesave', (event, message) => {
  console.log('hello:');
  console.log(message);
})

function App() {
  return (
    <div className="App">
      <Editor/>
    </div>
  );
}

export default App;
