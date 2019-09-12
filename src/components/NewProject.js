import React from 'react'
import { addProject } from '../state/actions'
import { connect } from 'react-redux'
import Project from '../models/Project'

class NewProject extends React.Component {
  state = {
    title: '',
    error: null,
  }

  handleSave = (e) => {
    e.preventDefault()
    try {
      this.props.addProject(this.state.title)
      this.props.handleSaved()
    }
    catch {
      this.duplicateNameError()
    }
  }

  handleTitleChange = (e) => {
    this.setState({
      title: e.target.value,
    })
  }

  duplicateNameError() {
    this.setState({
      error: true,
      errorMessage: `You already have a project named ${this.state.title}`,
      title: '',
    })
  }

  render() {
    return (
      <div className='grid-item'>
        <div className='grid-item-content'>
          <form onSubmit={this.handleSave}>
            <input autoFocus type='text' size='10' value={this.state.title} onChange={this.handleTitleChange} />
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

const mapDispatchToProps = dispatch => ({
  addProject: (title) => dispatch(addProject(new Project(title)))
})

export default connect(null, mapDispatchToProps)(NewProject)
