import React from 'react'
import '../styles/GridItemName.scss'

// Re-nameable title field
export default class GridItemName extends React.Component {
  state = {
    readOnly: true,
    name: this.props.children,
  }

  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  handleEdit = (e) => {
    e.preventDefault()
    this.flipEditState()
  }

  handleInputClick = (e) => {
    if (!this.readOnly) {
      e.preventDefault()
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.flipEditState()
    }
  }

  handleChange = (e) => {
    this.setState({
      name: e.target.value,
    })
  }

  flipEditState = () => {
    this.setState({
      readOnly: !this.state.readOnly
    })
    this.inputRef.current.focus()

    if (!this.state.readOnly) {
      this.props.onChange(this.state.name)
    }
  }

  render() {
    return (
      <div className='GridItemName'>
        <div>
          <input
            ref={this.inputRef}
            onClick={this.handleInputClick}
            onDoubleClick={this.handleDoubleClick}
            onChange={this.handleChange}
            readOnly={this.state.readOnly}
            value={this.state.name}
            spellCheck='false'
            onKeyPress={this.handleKeyPress}
          />
        </div>
        <div
          className='img-container'
          onClick={this.handleEdit}
        >
          <img
            className='hover-button'
            src={this.state.readOnly ? 'img/edit.svg' : 'img/check.svg'}
            alt=''
          />
        </div>
      </div>
    )
  }
}