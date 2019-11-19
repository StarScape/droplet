import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateProjectModified, setLocation } from '../state/actions'
import editorMenu from './editorMenu'
import AppScreen from '../components/AppScreen'
import Editor from '../components/Editor'
import Actionbar from '../components/Actionbar'

import '../styles/Editor.scss'

function EditorScreen({ store, updateModified, updateLocation, location, history }) {
  const { project, chapter, file } = location.state

  const [saved, setSaved] = useState(true)

  useEffect(() => {
    updateLocation()
  }, [updateLocation])

  return (
    <AppScreen
      title={chapter.title}
      menu={editorMenu}
    >
      <div className='Editor-screen'>
        <Editor
          store={store}
          file={file}
          onUpdate={() => setSaved(false)}
          onSave={() => {
            setSaved(true)
            updateModified()
          }}
        />
        <Actionbar store={store} project={project} saved={saved} />
      </div>
    </AppScreen>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { project, chapter } = ownProps.location.state
  return {
    // Update the modified date each time on the project each time the file is changed
    updateModified: () => dispatch(updateProjectModified(project.id)),
    updateLocation: () => dispatch(setLocation('editor', { project, chapter })),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(EditorScreen))