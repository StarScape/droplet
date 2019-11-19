import React from 'react'
import { deleteChapter, setChapterName } from '../state/actions'
import { connect } from 'react-redux'
import GridItemLink from '../components/GridItemLink'

const deleteMessage = 'Are you sure you want to delete this chapter? Once you do, it cannot be recovered.'

function ChapterLink(props) {
  const {
    chapter,
    project,
    number,
    updateName,
    deleteChapter,
    ...rest
  } = props

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
      onUpdateName={updateName}
      onConfirmDelete={deleteChapter}
      {...rest}
    />
  )
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { project, chapter } = ownProps

  return {
    updateName: newName => {
      dispatch(setChapterName(project.id, chapter.id, newName))
    },
    deleteChapter: () => { dispatch(deleteChapter(project.id, chapter.id)) }
  }
}

export default connect(null, mapDispatchToProps)(ChapterLink)