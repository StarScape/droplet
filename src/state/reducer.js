import { Types } from './actions'

// Here mostly for reference, to show what the
// shape of the application state should look like
const defaultState = {
  // Editor currently in use
  editorComponent: {},

  // Projects on dashboard
  // Projects are indexed by their UUID
  projects: {},

  // Chapters are structured like:
  // chapters: {
  //   [project uuid]: {
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

  location: null,

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

  fullscreen: false,

  // String to be displayed in notification box
  notification: null,

  modal: {
    show: false,
    title: '',
    body: '',
    onConfirm: null,
    onCancel: null,
  }
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
      const newProject = payload
      if (state.projects[newProject.name]) {
        throw new Error("Project with this name already exists")
      }

      return {
        ...state,
        projects: {
          ...state.projects,
          [newProject.id]: {
            ...newProject
          }
        },
        chapters: {
          ...state.chapters,
          [newProject.id]: {
            ordered: [],
            unordered: [],
          }
        }
      }
    }
    case Types.SET_PROJECT_PROPERTY: {
      const { projectID, prop, val } = payload
      const projectUpdated = { ...state.projects[projectID] }
      projectUpdated[prop] = val

      return {
        ...state,
        projects: {
          ...state.projects,
          [projectID]: projectUpdated,
        },
      }
    }
    case Types.SET_PROJECT_NAME: {
      const { projectID, newName } = payload

      return {
        ...state,
        projects: {
          ...state.projects,
          [projectID]: {
            ...state.projects[projectID],
            name: newName
          }
        },
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
      const { projectID, chapter, ordered } = payload
      const chapterListUpdated = { ...state.chapters[projectID] }
      chapterListUpdated[ordered ? 'ordered' : 'unordered'].push(chapter)

      return {
        ...state,
        chapters: {
          ...state.chapters,
          [projectID]: chapterListUpdated
        },
      }
    }
    case Types.SET_CHAPTER_NAME: {
      const { projectID, chapterID, name } = payload
      const chaptersForProject = state.chapters[projectID].ordered
      const newOrdered = chaptersForProject.map(chapter => {
        if (chapter.id === chapterID) {
          return {
            ...chapter,
            title: name,
          }
        }
        return chapter
      })

      return {
        ...state,
        chapters: {
          ...state.chapters,
          [projectID]: {
            ...state.chapters[projectID],
            ordered: newOrdered
          }
        },
      }
    }
    case Types.REORDER_CHAPTERS: {
      const { projectID, reordered } = payload

      return {
        ...state,
        chapters: {
          ...state.chapters,
          [projectID]: {
            ...state.chapters[projectID],
            ordered: reordered
          }
        }
      }
    }
    case Types.DELETE_CHAPTER: {
      const { projectID, chapterID } = payload
      const chaptersUpdated = { ...state.chapters[projectID] }

      console.log(projectID);
      chaptersUpdated.ordered = chaptersUpdated.ordered.filter(c => c.id !== chapterID)

      return {
        ...state,
        chapters: {
          ...state.chapters,
          [projectID]: chaptersUpdated,
        },
      }
    }
    case Types.SET_LOCATION: {
      return {
        ...state,
        location: payload,
      }
    }
    case Types.SET_FULLSCREEN: {
      return {
        ...state,
        fullscreen: payload
      }
    }
    case Types.SET_NOTIFICATION: {
      return {
        ...state,
        notification: payload,
      }
    }
    case Types.SET_MODAL: {
      return {
        ...state,
        modal: payload,
      }
    }
    default:
      return state
  }
}

export default reducer