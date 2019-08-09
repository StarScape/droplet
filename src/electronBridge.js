import { store } from './state/store'
import globalActions from './globalActions'
const { ipcRenderer } = require('electron')
const fs = require('fs');
const { webFrame } = require('electron')

// Set custom spellcheck provider
webFrame.setSpellCheckProvider('en-US', {
  spellCheck (words, callback) {
    setTimeout(() => {
      // const spellchecker = require('spellchecker')
      // const misspelled = words.filter(x => spellchecker.isMisspelled(x))
      // TODO: implement spellcheck
      callback(misspelled)
    }, 0)
  }
})
// Turn this into a global action
ipcRenderer.on('filesave', (event, fname) => {
  const contents = store.getState().editorComponent.content

  fs.writeFile(fname, contents, { flag: 'w' }, (err) => {
    if (err) console.warn(`File error:\n${err}`)
  })
})

// Turn this into a global action
ipcRenderer.on('fileopen', (event, fname) => {
  const editor = store.getState().editorComponent

  fs.readFile(fname, 'utf8', (err, data) => {
    if (err) console.warn(`File error:\n${err}`)
    editor.content = data
  })
})

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