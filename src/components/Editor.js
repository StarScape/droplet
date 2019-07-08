import React from 'react'
import { shortcutSwitch } from '../utils/shortcuts'
import { setEditorComponent, setCommandState } from '../state/actions'

import '../styles/Editor.css'

// TODO: migrate actions into this file.
// Possibly expose them globablly in actions.js

const exec = (command, value = null) => document.execCommand(command, false, value)
const classes = {
  actionbar: 'Editor-actionbar',
  button: 'Editor-button',
  content: 'Editor-content',
  selected: 'Editor-button-selected'
}

export default class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.store = props.store

    // B.c. contenteditable
    this.contentRef = React.createRef()
    this.actionbarRef = React.createRef()
  }

  focus = () => {
    this.contentRef.current.focus()
  }

  get content() {
    return this.contentRef.current.innerHTML
  }

  setContent(content) {
    this.contentRef.current.innerHTML = content
  }

  updateActiveCommands = () => {
    const basicActions = ['bold', 'italic', 'underline', 'strikethrough']
    for (const name of basicActions) {
      this.store.dispatch(setCommandState(name, document.queryCommandState(name)))
    }

    this.store.dispatch(setCommandState('ulist', document.queryCommandState('insertUnorderedList')))
    this.store.dispatch(setCommandState('olist', document.queryCommandState('insertOrderedList')))

    const blockType = document.queryCommandValue('formatBlock')
    this.store.dispatch(setCommandState('heading1', blockType === 'h1'))
    this.store.dispatch(setCommandState('heading2', blockType === 'h2'))
  }

  handleInput = (event) => {
    const content = this.contentRef.current

    const { target: { firstChild } } = event
    if (firstChild && firstChild.nodeType === 3) exec('formatBlock', '<p>')
    else if (content.innerHTML === '<br>') content.innerHTML = ''
  }

  handleKeyDown = (event) => {
    shortcutSwitch(event, {
      'tab': (e) => {
        e.preventDefault()
        exec('insertHTML', "&emsp;")
      },
      'ctrl+shift+e': (e) => {
        exec('justifyCenter')
      },
      'ctrl+shift+l': (e) => {
        exec('justifyLeft')
      },
      'ctrl+shift+r': (e) => {
        e.preventDefault()
        exec('justifyRight')
      },
    })

    // Unsure what this is for, too afraid to delete. TODO: averiguar pa que sirve
    if (event.key === 'Enter' && document.queryCommandValue('formatBlock') === 'blockquote') {
      console.log('mystery blockquote code firing');
      setTimeout(() => exec('formatBlock', '<p>'), 0)
    }
  }

  componentDidMount() {
    this.store.dispatch(setEditorComponent(this))
    exec('defaultParagraphSeparator', 'p')
    this.contentRef.current.focus()
  }

  render() {
    return (
      <div className='Editor'>
        <div
          className={classes.actionbar}
          ref={this.actionbarRef}
          >
          {this.actionbarButtons}
        </div>
        <div
          contentEditable='true'
          spellCheck='true'
          className={classes.content}
          ref={this.contentRef}
          onInput={this.handleInput}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.updateActiveCommands}
          onMouseUp={this.updateActiveCommands}
          >
        </div>
      </div>
    );
  }
}