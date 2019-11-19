import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { deleteProject, updateProjectName } from '../state/actions'
import { formatModifiedDate } from '../utils/other'
import GridItemLink from '../components/GridItemLink'

const deleteMessage = 'Are you sure you want to delete this project? Once you do, it cannot be recovered.'

function ProjectLink({ projectID, project, deleteProject, updateName, children }) {
  const footer = (
    <p>Modified {formatModifiedDate(project.dateModified)}</p>
  )

  return (
    <GridItemLink
      to={{
        pathname: '/project',
        state: { project: project }
      }}
      name={project.name}
      deleteMessage={deleteMessage}
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