import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { displayModal } from '../state/store'
import { deleteProject, updateProjectName } from '../state/actions'
import { formatModifiedDate } from '../utils/other'
import GridItemName from '../components/GridItemName'

import '../styles/Grid.scss'

function ProjectLink({ projectID, project, deleteProject, updateName, children }) {
  const handleDelete = () => {
    displayModal({
      title: 'Warning',
      body: 'Are you sure you want to delete this project? Once you do, it cannot be recovered.',
      onConfirm: () => {
        deleteProject()
      },
      onCancel: () => {},
    })
  }

  return (
    <div className='grid-item'>
      <Link
        className='grid-item-link'
        to={{
          pathname: '/project',
          state: { project: project }
        }}
      >
        <div className='grid-item-content'>
          <GridItemName onChange={updateName}>{project.name}</GridItemName>
        </div>
      </Link>

      <div className='grid-item-footer'>
        <span className='delete hover-button' onClick={handleDelete}>
          <img src='img/trash.svg' width='20px' alt='x' title='foo' />
        </span>
        <p>Modified {formatModifiedDate(project.dateModified)}</p>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  project: state.projects[ownProps.projectID],
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteProject: () => dispatch(deleteProject(ownProps.projectID)),
  updateName: newName => {
    dispatch(updateProjectName(ownProps.projectID, newName))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectLink)