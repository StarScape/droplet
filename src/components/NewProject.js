import React from 'react'
import { addProject } from '../state/actions'
import { connect } from 'react-redux'

class NewProject extends React.Component {
  state = {
    title: '',
    error: null,
  }

  handleSave = () => {
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
      <div className='project-link'>
        <div className='project-link-content'>
          <input type='text' size='10' value={this.state.title} onChange={this.handleTitleChange} />
          <input type='submit' value='Save' onClick={this.handleSave} />

          {this.state.error ?
            <div className='project-create-error'>{this.state.errorMessage}</div>
          : null}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addProject: (title) => dispatch(addProject(title))
})

export default connect(null, mapDispatchToProps)(NewProject)
