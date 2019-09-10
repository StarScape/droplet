import { Types } from './actions'

// Here mostly for reference, to show what the
// shape of the application state should look like
const defaultState = {
  // Editor currently in use
  editorComponent: {},

  // Projects on dashboard
  projects: [],

  // Chapters are structured like:
  // chapters: {
  //   'Project Title': {
  //     unordered: [
  //       {...},
  //       {...},
  //     ],
  //     ordered: [
  //       {...}, // chapter 1
  //       {...}, // chapter 2
  //     ],
  //   },
  // }
  // The project reducer will also change the key
  // in chapters if the project name is changed
  chapters: {},

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
    case Types.SET_COMMAND_STATE: {
      const activeCommands = {
        ...state.activeCommands,
        [payload.name]: payload.state,
      }
      return {
        ...state,
        activeCommands,
      }
    }
    case Types.SET_WORD_COUNT:
      return {
        ...state,
        wordCount: payload,
      }
    case Types.ADD_PROJECT: {
      const newProjectName = payload
      if (state.projects[newProjectName]) {
        throw new Error("Project with this name already exists")
      }

      return {
        ...state,
        projects: {
          ...state.projects,
          [newProjectName]: {
            name: newProjectName,
          },
        },
        chapters: {
          ...state.chapters,
          [newProjectName]: {
            ordered: [],
            unordered: [],
          }
        }
      }
    }
    case Types.DELETE_PROJECT: {
      const projectsUpdated = { ...state.projects }
      const chaptersUpdated = { ...state.chapters }
      delete projectsUpdated[payload]
      delete chaptersUpdated[payload]

      return {
        ...state,
        projects: projectsUpdated,
        chapters: chaptersUpdated,
      }
    }
    case Types.ADD_CHAPTER: {
      const { projectName, chapter, ordered } = payload
      const chapterListUpdated = { ...state.chapters[projectName] }
      chapterListUpdated[ordered ? 'ordered' : 'unordered'].push(chapter)

      console.log(chapterListUpdated);

      return {
        ...state,
        chapters: {
          ...state.chapters,
          [projectName]: chapterListUpdated
        },
      }
    }
    case Types.DELETE_CHAPTER: {
      const { projectName, id } = payload
      const chapterListUpdated = {...state.chapters[projectName]}

      // const findfn = x => x.uuid === uuid
      // const oindex = chapterListUpdated.ordered.findIndex(findfn)
      // const uindex = chapterListUpdated.unordered.findIndex(findfn)

      chapterListUpdated.ordered = chapterListUpdated.ordered.filter(c => c.id !== id)

      return {
        ...state,
        chapters: {
          ...state.chapters,
          [projectName]: chapterListUpdated,
        },
      }
    }
    default:
      return state
  }
}

export default reducer