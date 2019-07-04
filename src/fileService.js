import { store } from './state/store'
const { ipcRenderer } = require('electron')

ipcRenderer.on('filesave', (event, message) => {
  console.log('doin the save, dawg');
  console.log(store.getState());
})