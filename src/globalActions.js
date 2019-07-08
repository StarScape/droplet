import { getState } from './state/store'

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
 *    isActive(), which checks if a command is active
 */
const italic = () => getState().editorComponent.italic()
const bold = () => getState().editorComponent.bold()
const underline = () => getState().editorComponent.underline()
const strikethrough = () => getState().editorComponent.strikethrough()
const olist = () => getState().editorComponent.olist()
const ulist = () => getState().editorComponent.ulist()
const heading1 = () => getState().editorComponent.heading1()
const heading2 = () => getState().editorComponent.heading2()
const justifyLeft = () => getState().editorComponent.justifyLeft()
const justifyCenter = () => getState().editorComponent.justifyCenter()
const justifyRight = () => getState().editorComponent.justifyRight()
const isActive = command => getState().editorComponent.isActive(command)

export default {
  bold,
  italic,
  underline,
  strikethrough,
  heading1,
  heading2,
  olist,
  ulist,
  isActive,
  justifyLeft,
  justifyCenter,
  justifyRight,
}
