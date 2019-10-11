const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const windowStateKeeper = require('electron-window-state')
const path = require('path')
const isDev = require('electron-is-dev')
const { isMisspelled } = require('apis')

let mainWindow
let mainMenu

const createMenu = (window) => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            window.webContents.send('filesave', path.join(app.getPath('userData'), 'story.md'))
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () =>
            window.webContents.send('fileopen', path.join(app.getPath('userData'), 'story.md'))
        },

        { role: 'Quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'cut' },
        { role: 'delete' },
      ]
    },
    {
      label: 'Format',
      submenu: [
        {
          label: 'Italic',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            window.webContents.focus()
            window.webContents.send('italic')
          }
        },
        {
          label: 'Bold',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            window.webContents.focus()
            window.webContents.send('bold')
          }
        },
        {
          label: 'Underline',
          accelerator: 'CmdOrCtrl+U',
          click: () => {
            window.webContents.focus()
            window.webContents.send('underline')
          }
        },
        {
          label: 'Strikethrough',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            window.webContents.focus()
            window.webContents.send('strikethrough')
          }
        },
        
        { type: 'separator' },
        
        {
          label: 'Heading 1',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            window.webContents.focus()
            window.webContents.send('heading1')
          }
        },
        {
          label: 'Heading 2',
          accelerator: 'CmdOrCtrl+2',
          click: () => {
            window.webContents.focus()
            window.webContents.send('heading2')
          }
        },
        
        { type: 'separator' },
        
        {
          label: 'Bulleted List',
          accelerator: 'CmdOrCtrl+Shift+B',
          click: () => {
            window.webContents.focus()
            window.webContents.send('ulist')
          }
        },
        {
          label: 'Numbered List',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => {
            window.webContents.focus()
            window.webContents.send('olist')
          }
        },

        { type: 'separator' },
        
        {
          accelerator: 'CmdOrCtrl+Shift+L',
          label: 'Align Left',
          click: () => {
            window.webContents.focus()
            window.webContents.send('justifyLeft')
          }
        },
        {
          accelerator: 'CmdOrCtrl+Shift+E',
          label: 'Center Align',
          click: () => {
            window.webContents.focus()
            window.webContents.send('justifyCenter')
          }
        },
        {
          accelerator: 'CmdOrCtrl+Shift+R',
          label: 'Right Align',
          click: () => {
            window.webContents.focus()
            window.webContents.send('justifyRight')
          }
        },
      ]
    },
  ]

  if (isDev) {
    template.push({
      label: "Dev",
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
      ],
    })
  }

  return Menu.buildFromTemplate(template)
}

const createWindow = () => {
  let windowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 900,
  })

  console.log(windowState.x);
  console.log(windowState.y);

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

  menu = createMenu(mainWindow)
  Menu.setApplicationMenu(menu)

  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => mainWindow = null);
  windowState.manage(mainWindow)
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
