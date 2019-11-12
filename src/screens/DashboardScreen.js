import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { setLocation } from '../state/actions'
import AppScreen from '../components/AppScreen'
import ProjectLink from '../components/ProjectLink'
import NewProject from '../components/NewProject'

import '../styles/Dashboard.css'

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
    return Object.keys(this.props.projects).map((name) =>
      this.props.projects[name]
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
          <div>
            <button onClick={this.handleNewProject}>PROJECT +</button>
          </div>

          <div className='grid-container'>
            {this.state.newProject ?
              <NewProject
                dispatch={this.props.dispatch}
                handleSaved={this.handleNewProjectSaved}
                handleCancel={this.cancelProject}
              />
            : null}

            {this.projects.map(project =>
              <ProjectLink key={project.name} project={project} />
            )}
          </div>

          <div>
            <Link to='editor'><button>Editor</button></Link>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)