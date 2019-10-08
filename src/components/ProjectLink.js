import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { deleteProject } from '../state/actions'
import { formatModifiedDate } from '../utils/other'

import '../styles/Grid.css'

function ProjectLink({ project, deleteProject, children }) {
  return (
    <div className='grid-item'>
      <Link to={{
          pathname: '/project',
          state: { project: project }
        }}>

        <div className='grid-item-content'>
          <h4>{project.name}</h4>
          <p>{formatModifiedDate(project.dateModified)}</p>
        </div>
      </Link>

      <button onClick={deleteProject}>
        Delete
      </button>
    </div>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteProject: () => { dispatch(deleteProject(ownProps.project.name)) }
})

export default connect(null, mapDispatchToProps)(ProjectLink)