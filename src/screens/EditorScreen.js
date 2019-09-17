import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateProjectModified } from '../state/actions'
import Editor from '../components/Editor'
import Actionbar from '../components/Actionbar'
import WordCount from '../components/WordCount'

function EditorScreen({ store, updateModified, location, history }) {
  const [saved, setSaved] = useState(true)

  return (
    <div>
      <Editor
        store={store}
        file={location.state.file}
        onUpdate={() => setSaved(false)}
        onSave={() => {
          setSaved(true)
          updateModified()
        }}
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

const mapDispatchToProps = (dispatch, ownProps) => {
  const { project } = ownProps.location.state
  return {
    // Update the modified date each time on the project each time the file is changed
    updateModified: () => dispatch(updateProjectModified(project.name))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(EditorScreen))