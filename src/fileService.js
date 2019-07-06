import { store } from './state/store'
const { ipcRenderer } = require('electron')
const fs = require('fs')

ipcRenderer.on('filesave', (event, fname) => {
  const contents = store.getState().editorComponent.content

  fs.writeFile(fname, contents, { flag: 'w' }, (err) => {
    if (err) console.warn(`File error:\n${err}`)
  })
})

ipcRenderer.on('fileopen', (event, fname) => {
  const editor = store.getState().editorComponent

  fs.readFile(fname, 'utf8', (err, data) => {
    if (err) console.warn(`File error:\n${err}`)
    editor.setContent(data)
  })
})