import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ChapterLink from '../components/ChapterLink'
import NewChapter from '../components/NewChapter'

class ProjectScreen extends React.Component {
  state = {
    newChapter: false,
  }

  handleNewChapter = () => {
    this.setState({ newChapter: true })
  }

  handleNewChapterSaved = () => {
    this.setState({ newChapter: false })
  }

  render() {
    const { location, chapters } = this.props
    const { project } = location.state

    return (
      <div>
        <div>
          <button onClick={this.handleNewChapter}>CHAPTER +</button>
        </div>

        <div className='grid-container'>
          {this.state.newChapter ?
            <NewChapter
              dispatch={this.props.dispatch}
              project={project}
              handleSaved={this.handleNewChapterSaved}
              />
          : null }

          {chapters.ordered.map((chapter, i) =>
            <ChapterLink
              key={`chapter-${i}`}
              project={project}
              chapter={chapter}
              number={i}
              />
          )}
        </div>

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