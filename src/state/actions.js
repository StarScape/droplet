export const Types = {
  SET_EDITOR_COMPONENT: "SET_EDITOR_COMPONENT",
}

export const setEditorComponent = editor => ({
  type: Types.SET_EDITOR_COMPONENT,
  payload: editor
})

export default {
  setEditorComponent,
  Types,
}