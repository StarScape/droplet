import React, { useState, useEffect } from 'react'
import DocumentTitle from 'react-document-title'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateProjectModified, setLocation } from '../state/actions'
import Editor from '../components/Editor'
import Actionbar from '../components/Actionbar'
import WordCount from '../components/WordCount'
import toDocx from '../to_docx'

const { dialog } = require('electron').remote
const homedir = require("os").homedir()
const fs = require('fs').promises

function EditorScreen({ store, updateModified, updateLocation, location, history }) {
  const [saved, setSaved] = useState(true)
  useEffect(() => {
    updateLocation()
  }, [updateLocation])

  const { project, chapter, file } = location.state
  let editorRef // see below

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
          giveContentRef={(contentRef) => editorRef = contentRef}
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
        <button onClick={async () => {
          const pathToSave = dialog.showSaveDialog({
            title: 'Choose Location To Export',
            buttonLabel: 'Export',
            defaultPath: homedir + '/Documents/mydoc.docx',
          })

          if (pathToSave) {
            const buffer = await toDocx(editorRef.current)
            try {
              await fs.writeFile(pathToSave, buffer)
            } catch {
              alert('Error exporting document')
            }
          }
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