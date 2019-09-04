import React from 'react'
import { Link } from 'react-router-dom'
import { deleteProject } from '../state/actions'
import { connect } from 'react-redux'

function ProjectLink({ project, deleteProject }) {
  return (
    <div className='project-link'>
      <Link to={{
          pathname: '/projects',
          state: { project: project }
        }}>

        <div className='project-link-content'>
          <h4>{project.name}</h4>
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