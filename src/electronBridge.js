import globalActions from './globalActions'
const { webFrame, ipcRenderer } = require('electron')

// Set custom spellcheck provider
webFrame.setSpellCheckProvider('en-US', {
  spellCheck (words, callback) {
    setTimeout(() => {
      const misspelled = ipcRenderer.sendSync('misspelled', words)
      callback(misspelled)
    }, 0)
  }
})

// File actions - rethink open later in regards to how projects work
ipcRenderer.on('filesave', (event, fname) => globalActions.saveFile())
ipcRenderer.on('fileopen', (event, fname) => globalActions.openFile())

// Format actions
ipcRenderer.on('italic', (event, fname) => globalActions.italic())
ipcRenderer.on('bold', (event, fname) => globalActions.bold())
ipcRenderer.on('underline', (event, fname) => globalActions.underline())
ipcRenderer.on('strikethrough', (event, fname) => globalActions.strikethrough())
ipcRenderer.on('olist', (event, fname) => globalActions.olist())
ipcRenderer.on('ulist', (event, fname) => globalActions.ulist())
ipcRenderer.on('heading1', (event, fname) => globalActions.heading1())
ipcRenderer.on('heading2', (event, fname) => globalActions.heading2())
ipcRenderer.on('justifyLeft', (event, fname) => globalActions.justifyLeft())
ipcRenderer.on('justifyCenter', (event, fname) => globalActions.justifyCenter())
ipcRenderer.on('justifyRight', (event, fname) => globalActions.justifyRight())
