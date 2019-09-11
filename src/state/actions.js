export const Types = {
  SET_EDITOR_COMPONENT: "SET_EDITOR_COMPONENT",
  SET_COMMAND_STATE: "SET_COMMAND_STATE",
  SET_WORD_COUNT: "SET_WORD_COUNT",
  ADD_PROJECT: "ADD_PROJECT",
  SET_PROJECT_PROPERTY: "SET_PROJECT_PROPERTY",
  DELETE_PROJECT: "DELETE_PROJECT",
  ADD_CHAPTER: "ADD_CHAPTER",
  DELETE_CHAPTER: "DELETE_CHAPTER",
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

export const deleteChapter = (projectName, id) => ({
  type: Types.DELETE_CHAPTER,
  payload: { projectName, id },
})
