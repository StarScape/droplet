import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'

function ProjectScreen({ chapters, location }) {
  return (
    <div>
      {chapters.map((chapter, i) =>
        <Link
            key={`chapter-${i}`}
            to={{
              pathname: '/editor',
              state: {
                file: chapter.path,
                project: location.state.project
              }
            }}>
          <div>Chapter {chapter.number}</div>
        </Link>
      )}
      <Link to='/dashboard'>Back</Link>
    </div>
  )
}

// Don't need this, remove!
const mapStateToProps = (state, { match, location }) => {
  return {
    chapters: []
  }
}

export default withRouter(connect(mapStateToProps)(ProjectScreen))