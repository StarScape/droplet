import { getState } from './state/store'

// Maybe move all this into the editor?

/*
 *  Helper to execute a contenteditiable command
 *  Params:
 *    command (string): command string to pass to execCommand
 *    nameInStore (string): name to use in Redux store to indicate if this command is active or not.
 *    value (string - optional): value to pass to execCommand - only when applicable, see execCommand documentation
 */
const exec = (command, nameInStore, value = null) => {
  const { editorComponent } = getState()
  document.execCommand(command, false, value)
  editorComponent.focus()

  updateActiveCommands()
}

const bold = () => exec('bold', 'bold')
const italic = () => exec('italic', 'italic')
const underline = () => exec('underline', 'underline')
const strikethrough = () => exec('strikeThrough', 'strikethrough')
const olist = () => exec('insertOrderedList', 'olist')
const ulist = () => exec('insertUnorderedList', 'ulist')
const heading1 = () => heading('1')
const heading2 = () => heading('2')

// Due to an utterly bizzare bug, sometimes turning the heading on
// will also turn bold on. As far as I can tell it's a bug in Chrome.
const heading = (num) => {
  const boldOnBefore = document.queryCommandState('bold')
  
  if (isActive(`heading${num}`)) {
    exec('formatBlock', `heading${num}`, '<p>')
  }
  else {
    exec('formatBlock', `heading${num}`, `<h${num}>`)
  }

  const boldOnNow = document.queryCommandState('bold')

  if (boldOnBefore !== boldOnNow) {
    exec('bold', 'bold')
  }
}

const updateActiveCommands = () => getState().editorComponent.updateActiveCommands()
const isActive = (command) => getState().activeCommands[command]

/*
 *  Globally exposed editor commands are:
 *    bold(), italic(), underline(), strikethrough(), heading1(), heading2(), olist(), ulist(),   
 *  AND:
 *    isActive(), which checks if a command is active
 */
export const globalActions = {
  bold,
  italic,
  underline,
  strikethrough,
  heading1,
  heading2,
  olist,
  ulist,
  updateActiveCommands,
  isActive,
}

export default globalActions
