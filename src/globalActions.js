import { setFullscreen } from './state/actions'
import { dispatch, getState } from './state/store'
const { getCurrentWindow } = require('electron').remote

// Make sure we keep track of the editor (see below)
/*
 *  Here we globablly expose some commands that need to be reachable in odd places
 *  (like electron code). Theoretically these should all be called directly on the
 *  active Editor component, but passing that around (or getting it from the store
 *  every time) would get cumbersome, so it's easier to make an interface for accessing
 *  them here.
 * 
 *  Globally exposed editor commands are:
 *    bold(), italic(), underline(), strikethrough(), heading1(), heading2(), olist(), ulist()
 *    justifyLeft(), justifyCenter(), justifyRight(), which all do what they sound like they do,
 *  AND:
 *    isActive(), which checks if a command is active, as well as saveFile() and openFile()
 */
let editor = null
let mainWindow = null

const action = (f) => () => {
  if (!editor) {
    editor = getState().editorComponent
  }
  if (!mainWindow) {
    mainWindow = getCurrentWindow()
  }

  mainWindow.webContents.focus()
  f(editor, mainWindow)
}

const undo = action((editor) => editor.undo())
const redo = action((editor) => editor.redo())

const copy = action((editor) => editor.copy())
const paste = action((editor) => editor.paste())
const cut = action((editor) => editor.cut())
const del = action((editor) => editor.del())

const italic = action((editor) => editor.italic())
const bold = action((editor) => editor.bold())
const underline = action((editor) => editor.underline())
const strikethrough = action((editor) => editor.strikethrough())
const olist = action((editor) => editor.olist())
const ulist = action((editor) => editor.ulist())
const heading1 = action((editor) => editor.heading1())
const heading2 = action((editor) => editor.heading2())
const justifyLeft = action((editor) => editor.justifyLeft())
const justifyCenter = action((editor) => editor.justifyCenter())
const justifyRight = action((editor) => editor.justifyRight())
const saveFile = action((editor) => editor.saveFile())
const openFile = action((editor) => editor.openFile())
const exportDocx = action((editor) => editor.exportDocx())

const isActive = command => getState().editorComponent.isActive(command)

const fullscreen = action((editor, win) => {
  if (win.isFullScreen()) {
    win.setFullScreen(false)
    dispatch(setFullscreen(false))
  }
  else {
    win.setFullScreen(true)
    dispatch(setFullscreen(true))
  }
})

export default {
  undo,
  redo,
  copy,
  paste,
  cut,
  del,
  bold,
  italic,
  underline,
  strikethrough,
  heading1,
  heading2,
  olist,
  ulist,
  justifyLeft,
  justifyCenter,
  justifyRight,
  saveFile,
  openFile,
  exportDocx,
  isActive,
  fullscreen,
}
