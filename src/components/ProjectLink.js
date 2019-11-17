import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { displayModal } from '../state/store'
import { deleteProject } from '../state/actions'
import { formatModifiedDate } from '../utils/other'

import '../styles/Grid.scss'

function ProjectLink({ project, deleteProject, children }) {
  const handleDelete = () => {
    displayModal({
      show: true,
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
      <div className='grid-item-header'>
        <span className='delete hover-button' onClick={handleDelete}>
          <img src='img/x.svg' width='10px' alt='x' />
        </span>
      </div>
      <Link to={{
          pathname: '/project',
          state: { project: project }
        }}>

        <div className='grid-item-content'>
          <h4>{project.name}</h4>
          <p>{formatModifiedDate(project.dateModified)}</p>
        </div>
      </Link>

    </div>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteProject: () => { dispatch(deleteProject(ownProps.project.name)) }
})

export default connect(null, mapDispatchToProps)(ProjectLink)