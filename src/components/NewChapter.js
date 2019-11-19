import React from 'react'
import { addChapter, updateProjectModified } from '../state/actions'
import { connect } from 'react-redux'
import { Chapter } from '../models/Chapters'

class NewChapter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: props.placeholder || '',
      error: false,
    }
  }

  handleSave = (e) => {
    e.preventDefault()
    this.props.addChapter(this.state.title)
    this.props.handleSaved()
  }

  handleTitleChange = (e) => {
    this.setState({
      title: e.target.value,
    })
  }

  // Cancel new chapter creation on ESC pressed
  handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.props.handleCancel()
    }
  }

  render() {
    return (
      <div className='grid-item' onKeyDown={this.handleKeyDown}>
        <div className='grid-item-content'>
          <form onSubmit={this.handleSave}>
            <input autoFocus type='text' size='15' value={this.state.title} onChange={this.handleTitleChange} />
            <input
              type='button'
              onClick={this.props.handleCancel}
              value='Cancel'
            />
            <input type='submit' value='Save' />
          </form>

          {this.state.error ?
            <div className='grid-create-error'>{this.state.errorMessage}</div>
          : null}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  addChapter: (title) => {
    dispatch(addChapter(ownProps.project.id, new Chapter(title)))
    dispatch(updateProjectModified(ownProps.project.id))
  }
})

export default connect(null, mapDispatchToProps)(NewChapter)
