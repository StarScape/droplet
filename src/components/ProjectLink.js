import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { displayModal } from '../state/store'
import { deleteProject, updateProjectName } from '../state/actions'
import { formatModifiedDate } from '../utils/other'
import GridItemLink from '../components/GridItemLink'

import '../styles/Grid.scss'

function ProjectLink({ projectID, project, deleteProject, updateName, children }) {
  const footer = <p>Modified {formatModifiedDate(project.dateModified)}</p>

  return (
    <GridItemLink
      to={{
        pathname: '/project',
        state: { project: project }
      }}
      name={project.name}
      footer={footer}
      onUpdateName={updateName}
      onConfirmDelete={deleteProject}
    />
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