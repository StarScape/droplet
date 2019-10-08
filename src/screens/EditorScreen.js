import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateProjectModified, setLocation } from '../state/actions'
import Editor from '../components/Editor'
import Actionbar from '../components/Actionbar'
import WordCount from '../components/WordCount'

function EditorScreen({ store, updateModified, updateLocation, location, history }) {
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    updateLocation()
  }, [updateLocation])

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
          pathname: '/project',
          state: { project: location.state.project }
        }}
      >
        Back
      </Link>
    </div>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { project, chapter } = ownProps.location.state
  return {
    // Update the modified date each time on the project each time the file is changed
    updateModified: () => dispatch(updateProjectModified(project.name)),
    updateLocation: () => dispatch(setLocation('editor', { project, chapter })),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(EditorScreen))