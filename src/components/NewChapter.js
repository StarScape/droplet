import React from 'react'
import { addChapter } from '../state/actions'
import { connect } from 'react-redux'
import { Chapter } from '../models/Chapters'

class NewChapter extends React.Component {
  state = {
    title: '',
    error: null,
  }

  handleSave = () => {
    this.props.addChapter(this.state.title)
    this.props.handleSaved()
  }

  handleTitleChange = (e) => {
    this.setState({
      title: e.target.value,
    })
  }

  render() {
    return (
      <div className='grid-item'>
        <div className='grid-item-content'>
          <input type='text' size='10' value={this.state.title} onChange={this.handleTitleChange} />
          <input type='submit' value='Save' onClick={this.handleSave} />

          {this.state.error ?
            <div className='grid-create-error'>{this.state.errorMessage}</div>
          : null}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  addChapter: (title) => dispatch(addChapter(ownProps.project.name, new Chapter(title)))
})

export default connect(null, mapDispatchToProps)(NewChapter)
