import { Types } from './actions'

// Here mostly for reference, to show what the
// shape of the application state should look like
const defaultState = {
  // Editor currently in use
  editorComponent: {},

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
  const { payload } = action

  switch(action.type) {
    case Types.SET_EDITOR_COMPONENT:
      return {
        ...state,
        editorComponent: payload
      }
    case Types.SET_COMMAND_STATE:
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
        wordCount: payload,
      }
    case Types.ADD_PROJECT:
      const { projects } = state
      const newProjectName = payload

      if (projects[newProjectName]) {
        throw new Error("Project with this name already exists")
      }

      return {
        ...state,
        projects: {
          ...state.projects,
          [newProjectName]: {},
        },
      }
    case Types.DELETE_PROJECT:
      const projectsUpdated = { ...state.projects }
      delete projectsUpdated[payload]

      return {
        ...state,
        projects: projectsUpdated,
      }
    default:
      return state
  }
}

export default reducer