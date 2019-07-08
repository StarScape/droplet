import { Types } from './actions'

const defaultState = {
  // Editor currently in use
  editorComponent: {},

  // Editor commands active ATM
  activeCommands: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    heading1: false,
    heading2: false,
    olist: false,
    ulist: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
  },
}

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case Types.SET_EDITOR_COMPONENT:
      return {
        ...state,
        editorComponent: action.payload
      }
    case Types.SET_COMMAND_STATE:
      const { payload } = action
      const activeCommands = {
        ...state.activeCommands,
        [payload.name]: payload.state,
      }
      return {
        ...state,
        activeCommands,
      }
    default:
      return state
  }
}

export default reducer