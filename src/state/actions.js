export const Types = {
  SET_EDITOR_COMPONENT: "SET_EDITOR_COMPONENT",
  SET_COMMAND_STATE: "SET_COMMAND_STATE",
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

export default {
  setEditorComponent,
  setCommandState,
  Types,
}