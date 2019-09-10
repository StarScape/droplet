import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'

import Editor from '../components/Editor'
import Actionbar from '../components/Actionbar'
import WordCount from '../components/WordCount'

function EditorScreen({ store, location, history }) {
  const [saved, setSaved] = useState(true)

  return (
    <div>
      <Editor
        store={store}
        file={location.state.file}
        onUpdate={() => setSaved(false)}
        onSave={() => setSaved(true)}
      />
      <Actionbar store={store} />
      <WordCount store={store} />

      <div>{saved ? 'Changes saved' : 'Saving...'}</div>
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