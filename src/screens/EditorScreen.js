import React, { useState, useEffect } from 'react'
import DocumentTitle from 'react-document-title'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateProjectModified, setLocation } from '../state/actions'
import Editor from '../components/Editor'
import Actionbar from '../components/Actionbar'
import WordCount from '../components/WordCount'
import toDocx from '../to_docx'

function EditorScreen({ store, updateModified, updateLocation, location, history }) {
  const [saved, setSaved] = useState(true)
  useEffect(() => {
    updateLocation()
  }, [updateLocation])

  const { project, chapter, file } = location.state

  return (
    <DocumentTitle title={chapter.title}>
      <div>
        <Editor
          store={store}
          file={file}
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
            state: { project: project }
          }}
        >
          Back
        </Link>

        <br/>
        <button onClick={() => {
          const r = document.querySelector('[contenteditable]')
          toDocx(r)
        }}>Export!</button>
      </div>
    </DocumentTitle>
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