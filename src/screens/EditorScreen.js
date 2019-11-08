import React, { useState, useEffect } from 'react'
import DocumentTitle from 'react-document-title'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateProjectModified, setLocation } from '../state/actions'
import Editor from '../components/Editor'
import Actionbar from '../components/Actionbar'
import WordCount from '../components/WordCount'
import ExportStatus from '../components/ExportStatus'
import toDocx from '../to_docx'

const { dialog } = require('electron').remote
const homedir = require("os").homedir()
const fs = require('fs').promises

// Open save dialog and export as DOCX
const exportDocx = async (contentElem, setExportStatus) => {
  setExportStatus('Exporting...')

  const pathToSave = dialog.showSaveDialog({
    title: 'Choose Location To Export',
    buttonLabel: 'Export',
    defaultPath: homedir + '/Documents/mydoc.docx',
  })

  if (pathToSave) {
    const buffer = await toDocx(contentElem)
    let exportStatus = ''
    try {
      await fs.writeFile(pathToSave, buffer)
      exportStatus = 'Export done'
    } catch {
      alert('Error exporting document')
      exportStatus = 'Export failed'
    }
    setTimeout(() => {
      setExportStatus(exportStatus)
    }, 200)
  }

  setTimeout(() => {
    setExportStatus('')
  }, 1500)
}

function EditorScreen({ store, updateModified, updateLocation, location, history }) {
  const { project, chapter, file } = location.state

  const [saved, setSaved] = useState(true)
  const [contentRef, setContentRef] = useState(null)
  const [exportStatus, setExportStatus] = useState(false)

  useEffect(() => {
    updateLocation()
  }, [updateLocation])

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
          setContentRef={setContentRef}
        />
        <Actionbar store={store} />
        <WordCount store={store} />

        <div>{saved ? 'Changes saved' : 'Saving...'}</div>
        <ExportStatus status={exportStatus} />
        <Link to={{
          pathname: '/project',
          state: { project: project }
        }}>
          Back
        </Link>

        <br/>
        <button onClick={() => exportDocx(contentRef.current, setExportStatus)}>
          Export!
        </button>
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