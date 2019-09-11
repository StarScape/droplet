import React from 'react'
import Sortable from 'react-sortablejs';
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ChapterLink from '../components/ChapterLink'
import NewChapter from '../components/NewChapter'

class ProjectScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newChapter: false,
      chapters: props.chapters,
    }
  }

  handleNewChapter = () => {
    this.setState({ newChapter: true })
  }

  handleNewChapterSaved = () => {
    this.setState({ newChapter: false })
  }

  handleSortChange = (indexes) => {
    const { ordered } = this.state.chapters
    this.setState({
      newChapter: false,
      chapters: {
        ...this.state.chapters,
        ordered: indexes.map(i => ordered[Number(i)])
      }
    })

    // TODO: dispatch and save rearrangement
  }

  render() {
    const { location } = this.props
    const { project } = location.state

    return (
      <div>
        <div>
          <button onClick={this.handleNewChapter}>CHAPTER +</button>
        </div>

        <Sortable
          // Sortable options (https://github.com/RubaXa/Sortable#options)
          className='grid-container'
          options={{
            animation: 150,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            filter: '.new-chapter',

            // Necessary to allow opacity: 1. HTML5 DnD provides no mechanism for this.
            forceFallback: true,

            // Auto-close new chapter dialog
            onStart: () => this.setState({ newChapter: false })
          }}
          onChange={this.handleSortChange}
        >
          {this.state.newChapter ?
            <NewChapter
              dispatch={this.props.dispatch}
              project={project}
              handleSaved={this.handleNewChapterSaved}
              placeholder={`Chapter ${this.state.chapters.ordered.length + 1}`}
              />
          : null }

          {this.state.chapters.ordered.map((chapter, i) =>
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
    )
  }
}

const mapStateToProps = (state, { match, location }) => {
  return {
    chapters: state.chapters[location.state.project.name]
  }
}

export default withRouter(connect(mapStateToProps)(ProjectScreen))