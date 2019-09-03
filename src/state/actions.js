export const Types = {
  SET_EDITOR_COMPONENT: "SET_EDITOR_COMPONENT",
  SET_COMMAND_STATE: "SET_COMMAND_STATE",
  SET_WORD_COUNT: "SET_WORD_COUNT",
  ADD_PROJECT: "ADD_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
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

export const addProject = (projectName) => ({
  type: Types.ADD_PROJECT,
  payload: projectName,
})

export const deleteProject = (projectName) => ({
  type: Types.DELETE_PROJECT,
  payload: projectName,
})
