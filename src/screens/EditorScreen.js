import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import Editor from '../components/Editor'
import Actionbar from '../components/Actionbar'
import WordCount from '../components/WordCount'

function EditorScreen({ store, location, history }) {
  return (
    <div>
      <Editor store={store} file={location.state.file} />
      <Actionbar store={store} />
      <WordCount store={store} />

      <Link
        to={{
          pathname: '/projects',
          state: { project: location.state.project }
        }}
      >
        Back
      </Link>
    </div>
  )
}

export default withRouter(EditorScreen)