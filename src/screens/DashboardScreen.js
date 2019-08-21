import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

function DashboardScreen({ store, projects }) {
  return (
    <div>
      {projects.map((p, i) =>
        <div key={i}>
          <Link
            to={{
              pathname: '/projects',
              state: { project: p }
            }}
          >
            {p.name}
          </Link>
        </div>)}
      <Link to='editor'>editor</Link>
    </div>
  )
}

const mapStateToProps = (state) => ({
  projects: state.projects
})

export default connect(mapStateToProps)(DashboardScreen)