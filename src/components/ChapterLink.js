import React from 'react'
import { Link } from 'react-router-dom'
import { displayModal } from '../state/store'
import { deleteChapter } from '../state/actions'
import { connect } from 'react-redux'
import GridItemLink from '../components/GridItemLink'

const deleteMessage = 'Are you sure you want to delete this chapter? Once you do, it cannot be recovered.'

function ChapterLink(props) {
  const { chapter, project, number, deleteChapter, ...rest } = props

    // <div className='grid-item chapter-link' {...rest}>
    // </div>
  return (
    <GridItemLink
      to={{
        pathname: '/editor',
        state: {
          file: chapter.id,
          project: project,
          chapter: chapter,
        }
      }}
      className='chapter-link'
      name={chapter.title}
      deleteMessage={deleteMessage}
      onUpdateName={() => console.log('ummm')}
      onConfirmDelete={deleteChapter}
      {...rest}
    />
  )
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { project, chapter } = ownProps

  return {
    deleteChapter: () => { dispatch(deleteChapter(project.name, chapter.id)) }
  }
}

export default connect(null, mapDispatchToProps)(ChapterLink)