import React from 'react'
import Sortable from 'react-sortablejs';
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { reorderChapters, updateProjectModified, setLocation } from '../state/actions'
import AppScreen from '../components/AppScreen'
import Header from '../components/Header'
import HeaderButton from '../components/HeaderButton'
import ChapterLink from '../components/ChapterLink'
import NewChapter from '../components/NewChapter'

class ProjectScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newChapter: false,
    }
  }

  handleNewChapter = () => {
    this.setState({ newChapter: true })
  }

  handleNewChapterSaved = () => {
    this.setState({ newChapter: false })
  }

  cancelChapter = () => {
    this.setState({ newChapter: false })
  }

  handleSortChange = (indexes) => {
    const { ordered } = this.props.chapters
    const reordered = indexes.map(i => ordered[Number(i)])
    this.props.reorderChapters(reordered)
    this.props.updateModified()
  }

  componentDidMount() {
    this.props.updateLocation()
  }

  // Application menu
  menu = [
    {
      label: 'Chapters',
      submenu: [
        {
          label: 'New Chapter',
          click: this.handleNewChapter,
        }
      ]
    }
  ]

  render() {
    const { location } = this.props
    const { project } = location.state

    return (
      <AppScreen title={project.name} menu={this.menu}>
        <div>
          <Header backPath='/dashboard'>
            <HeaderButton
              altText='Add Chapter'
              onClick={this.handleNewChapter}>
              + CHAPTER
            </HeaderButton>
          </Header>

          <Sortable
            className='grid-container'

            // Sortable options (https://github.com/RubaXa/Sortable#options)
            options={{
              animation: 150,
              ghostClass: 'sortable-ghost',
              dragClass: 'sortable-drag',
              draggable: '.chapter-link',

              // Necessary to allow opacity: 1. HTML5 DnD provides no mechanism for this.
              forceFallback: true,

              // Auto-close new chapter dialog when dragging
              onStart: () => this.setState({ newChapter: false })
            }}
            onChange={this.handleSortChange}
          >
            {this.state.newChapter ?
              <NewChapter
                dispatch={this.props.dispatch}
                project={project}
                handleSaved={this.handleNewChapterSaved}
                handleCancel={this.cancelChapter}
                placeholder={`Chapter ${this.props.chapters.ordered.length + 1}`}
                />
            : null }

            {this.props.chapters.ordered.map((chapter, i) =>
              <ChapterLink
                key={`chapter-${i}`}
                data-id={i}
                project={project}
                chapter={chapter}
                number={i}
              />
            )}
          </Sortable>

          <Link to='/dashboard'>Back</Link>
        </div>
      </AppScreen>
    )
  }
}

const mapStateToProps = (state, { match, location }) => ({
  chapters: state.chapters[location.state.project.name]
})

const mapDispatchToProps = (dispatch, { location }) => {
  const { project } = location.state
  return {
    reorderChapters: reordered => dispatch(reorderChapters(project.name, reordered)),
    updateModified: () => dispatch(updateProjectModified(project.name)),
    updateLocation: () => dispatch(setLocation('project', location.state)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectScreen))