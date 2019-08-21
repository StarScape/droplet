import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { loadChaptersInfo } from '../files'

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
  const { project } = location.state

  return {
    chapters: loadChaptersInfo(project)
  }
}

export default withRouter(connect(mapStateToProps)(ProjectScreen))