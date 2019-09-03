import { Types } from './actions'

// Here mostly for reference, to show what the
// shape of the application state should look like
const defaultState = {
  // Editor currently in use
  editorComponent: {},

  projectData: {foo: "bar"},

  // Projects on dashboard
  projects: [],

  // Word count of current document
  wordCount: 0,

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

// Clean up with some { destructuring }
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
    case Types.SET_WORD_COUNT:
      return {
        ...state,
        wordCount: action.payload,
      }
    case Types.SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
      }
    default:
      return state
  }
}

export default reducer