import { Types } from './actions'

const defaultState = {
  editorComponent: {}
}

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case Types.SET_EDITOR_COMPONENT:
      return {
        ...state,
        editorComponent: action.payload
      }
    default:
      return state
  }
}

export default reducer