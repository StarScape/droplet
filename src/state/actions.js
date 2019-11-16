export const Types = {
  SET_EDITOR_COMPONENT: "SET_EDITOR_COMPONENT",
  SET_COMMAND_STATE: "SET_COMMAND_STATE",
  SET_WORD_COUNT: "SET_WORD_COUNT",
  ADD_PROJECT: "ADD_PROJECT",
  SET_PROJECT_PROPERTY: "SET_PROJECT_PROPERTY",
  DELETE_PROJECT: "DELETE_PROJECT",
  ADD_CHAPTER: "ADD_CHAPTER",
  REORDER_CHAPTERS: "REORDER_CHAPTERS",
  DELETE_CHAPTER: "DELETE_CHAPTER",
  SET_LOCATION: "SET_LOCATION",
  SET_FULLSCREEN: "SET_FULLSCREEN",
  SET_NOTIFICATION: "SET_NOTIFICATION",
}

// Global editor component
export const setEditorComponent = editor => ({
  type: Types.SET_EDITOR_COMPONENT,
  payload: editor
})

// Set italic, bold, etc
export const setCommandState = (name, bool) => ({
  type: Types.SET_COMMAND_STATE,
  payload: { name, state: bool }
})

export const setWordCount = (count) => ({
  type: Types.SET_WORD_COUNT,
  payload: count,
})

export const addProject = (project) => ({
  type: Types.ADD_PROJECT,
  payload: project,
})

export const setProjectProperty = (projectName, prop, val) => ({
  type: Types.SET_PROJECT_PROPERTY,
  payload: { projectName, prop, val },
})

export const deleteProject = (projectName) => ({
  type: Types.DELETE_PROJECT,
  payload: projectName,
})

export const addChapter = (projectName, chapter, ordered=true) => ({
  type: Types.ADD_CHAPTER,
  payload: { projectName, chapter, ordered },
})

export const reorderChapters = (projectName, reordered) => ({
  type: Types.REORDER_CHAPTERS,
  payload: { projectName, reordered },
})

export const deleteChapter = (projectName, id) => ({
  type: Types.DELETE_CHAPTER,
  payload: { projectName, id },
})

export const setLocation = (path, state) => ({
  type: Types.SET_LOCATION,
  payload: { path, state },
})

// Set app fullscreen status
// We COULD just get this info with electron
// but its useful to store it in redux
export const setFullscreen = (boolean) => ({
  type: Types.SET_FULLSCREEN,
  payload: boolean
})

// Used to set the notification box that pops up for exports etc
export const setNotification = (msg) => ({
  type: Types.SET_NOTIFICATION,
  payload: msg
})

// Update the project last modified date with current date
export const updateProjectModified = (projectName, date) =>
  setProjectProperty(projectName, 'dateModified', Date.now())
