const {
  app,
  globalShortcut,
  dialog,
  ipcMain,
  BrowserWindow,
  Menu
} = require('electron')
const windowStateKeeper = require('electron-window-state')
const path = require('path')
const isDev = require('electron-is-dev')
const { isMisspelled } = require('apis')

let mainWindow

const createWindow = () => {
  let windowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 900,
  })

  mainWindow = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,

    webPreferences: {
      nodeIntegration: true,
    }
  });

  if (windowState.isMaximized) mainWindow.maximize()

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => mainWindow = null);
  windowState.manage(mainWindow)

  globalShortcut.register('f11', () => {
    mainWindow.webContents.send('fullscreen')
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Apis refuses to work in the renderer process for
// reasons I can't quite fathom. IPC is the workaround.
ipcMain.on('misspelled', (event, words) => {
  event.returnValue = words.filter(w => isMisspelled(w))
})
