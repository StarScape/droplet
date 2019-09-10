import React from 'react'
import { Link } from 'react-router-dom'
import { deleteChapter } from '../state/actions'
import { connect } from 'react-redux'

import '../styles/Grid.css'

function ChapterLink(props) {
  const { chapter, project, number, deleteChapter } = props

  return (
    <div className='grid-item'>
      <Link
        key={`chapter-${number}`}
        to={{
          pathname: '/editor',
          state: {
            file: chapter.path,
            project: project
          }
        }}>

        <div className='grid-item-content'>
          <h4>{chapter.title}</h4>
        </div>
      </Link>

      <button onClick={deleteChapter}>
        Delete
      </button>
    </div>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { project, chapter } = ownProps

  return {
    deleteChapter: () => { dispatch(deleteChapter(project.name, chapter.id)) }
  }
}

export default connect(null, mapDispatchToProps)(ChapterLink)