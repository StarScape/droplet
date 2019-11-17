import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { deleteProject } from '../state/actions'
import { formatModifiedDate } from '../utils/other'

import '../styles/Grid.scss'

function ProjectLink({ project, deleteProject, children }) {
  return (
    <div className='grid-item'>
      <div className='grid-item-header'>
        <span className='delete hover-button' onClick={deleteProject}>
          <img src='img/x.svg' width='10px'/>
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