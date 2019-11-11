import { getState } from './state/store'
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

const useEditor = (f) => () => {
  if (!editor) {
    editor = getState().editorComponent
  }
  if (!mainWindow) {
    mainWindow = getCurrentWindow()
  }

  mainWindow.webContents.focus()
  f(editor)
}

const undo = useEditor((editor) => editor.undo())
const redo = useEditor((editor) => editor.redo())

const copy = useEditor((editor) => editor.copy())
const paste = useEditor((editor) => editor.paste())
const cut = useEditor((editor) => editor.cut())
const del = useEditor((editor) => editor.del())

const italic = useEditor((editor) => editor.italic())
const bold = useEditor((editor) => editor.bold())
const underline = useEditor((editor) => editor.underline())
const strikethrough = useEditor((editor) => editor.strikethrough())
const olist = useEditor((editor) => editor.olist())
const ulist = useEditor((editor) => editor.ulist())
const heading1 = useEditor((editor) => editor.heading1())
const heading2 = useEditor((editor) => editor.heading2())
const justifyLeft = useEditor((editor) => editor.justifyLeft())
const justifyCenter = useEditor((editor) => editor.justifyCenter())
const justifyRight = useEditor((editor) => editor.justifyRight())
const saveFile = useEditor((editor) => editor.saveFile())
const openFile = useEditor((editor) => editor.openFile())

const isActive = command => getState().editorComponent.isActive(command)

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
  isActive,
}
