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
    this.setState({ newProject: {}})
  }

  handleNewProjectSaved = () => {
    this.setState({ newProject: null })
  }

  render() {
    const { projects } = this.props

    return (
      <div>
        <div>
          <button onClick={this.handleNewProject}>PROJECT +</button>
        </div>

        <div className='projects-container'>
          {this.state.newProject ?
            <NewProject dispatch={this.props.dispatch}
                        project={this.state.newProject} 
                        handleSaved={this.handleNewProjectSaved} />
          : null }

          {projects.map((project) =>
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