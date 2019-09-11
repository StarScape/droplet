import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ProjectLink from '../components/ProjectLink'
import NewProject from '../components/NewProject'

import '../styles/Dashboard.css'

class DashboardScreen extends React.Component {
  state = {
    newProject: false
  }

  handleNewProject = () => {
    this.setState({ newProject: true })
  }

  handleNewProjectSaved = () => {
    this.setState({ newProject: false })
  }

  // Returns project list as an array, sorted by last modified date
  get projects() {
    return Object.keys(this.props.projects).map((name) =>
      this.props.projects[name]
    ).concat().sort((a, b) => b.date - a.date)
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.handleNewProject}>PROJECT +</button>
        </div>

        <div className='grid-container'>
          {this.state.newProject ?
            <NewProject
              dispatch={this.props.dispatch}
              handleSaved={this.handleNewProjectSaved}
              />
          : null }

          {this.projects.map(project =>
            <ProjectLink key={project.name} project={project} />
          )}
        </div>

        <div>
          <Link to='editor'><button>Editor</button></Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects
})

export default connect(mapStateToProps)(DashboardScreen)