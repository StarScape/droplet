import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { addProject } from '../state/actions'
import ProjectLink from '../components/ProjectLink'

import '../styles/Dashboard.css'

class DashboardScreen extends React.Component {
  handleNewProject = () => {
    const title = 'Story Number #3'
    this.props.store.dispatch(addProject(title))
  }

  render() {
    const { projects } = this.props

    return (
      <div>
        <div>
          <button onClick={this.handleNewProject}>PROJECT +</button>
        </div>

        <div class='projects-container'>
          {Object.keys(projects).map((name, i) =>
            <ProjectLink key={name} name={name} project={projects[name]} />
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