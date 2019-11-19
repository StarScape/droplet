import React from 'react'
import { connect } from 'react-redux'
import { setLocation, setModal } from '../state/actions'
import AppScreen from '../components/AppScreen'
import Header from '../components/Header'
import HeaderButton from '../components/HeaderButton'
import ProjectLink from '../components/ProjectLink'
import NewProject from '../components/NewProject'

import '../styles/Dashboard.scss'

class DashboardScreen extends React.Component {
  state = {
    newProject: false,
  }

  handleNewProject = () => {
    this.setState({ newProject: true })
  }

  handleNewProjectSaved = () => {
    this.setState({ newProject: false })
  }

  cancelProject = () => {
    this.setState({ newProject: false })
  }

  // Returns project list as an array, sorted by most recently modified
  get projects() {
    return Object.keys(this.props.projects).map((id) =>
      this.props.projects[id]
    ).concat().sort((a, b) => b.dateModified - a.dateModified)
  }

  componentDidMount() {
    this.props.updateLocation()
  }

  // Application menu
  menu = [
    {
      label: 'Projects',
      submenu: [
        {
          label: 'New Project',
          click: this.handleNewProject,
        }
      ]
    }
  ]

  render() {
    return (
      <AppScreen title='Droplet' menu={this.menu}>
        <div onKeyDown={this.handleKeyDown}>
          <Header title='dashboard'>
            <HeaderButton
              altText='Add Project'
              onClick={this.handleNewProject}>
              + PROJECT
            </HeaderButton>
          </Header>

          <div className='grid-container'>
            {this.state.newProject ?
              <NewProject
                dispatch={this.props.dispatch}
                handleSaved={this.handleNewProjectSaved}
                handleCancel={this.cancelProject}
              />
            : null}

            {this.projects.map(project =>
              <ProjectLink key={project.id} projectID={project.id} />
            )}
          </div>
        </div>
      </AppScreen>
    )
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateLocation: () => dispatch(setLocation('/dashboard', {})),
  setModal: modal => dispatch(setModal(modal))
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)