import React from 'react'
import { shortcutSwitch } from '../utils/shortcuts'
import { setEditorComponent, setCommandState } from '../state/actions'

import '../styles/Editor.css'

const classes = {
  actionbar: 'Editor-actionbar',
  button: 'Editor-button',
  content: 'Editor-content',
  selected: 'Editor-button-selected'
}

// Main application text editor. See globalActions for API
export default class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.contentRef = React.createRef()
  }

  get content() {
    return this.contentRef.current.innerHTML
  }

  set content(content) {
    this.contentRef.current.innerHTML = content
  }

  focus = () => this.contentRef.current.focus()

  // Helper method for document.execCommand
  // execCommand should NOT be called directly
  exec = (command, value = null) => {
    document.execCommand(command, false, value)
    this.focus()
    this.updateActiveCommands()
  }

  // Editor commands, publicly available via globalActions
  italic = () => this.exec('italic')
  bold = () => this.exec('bold')
  underline = () => this.exec('underline')
  strikethrough = () => this.exec('strikeThrough')
  olist = () => this.exec('insertOrderedList')
  ulist = () => this.exec('insertUnorderedList')
  heading1 = () => this._heading('1')
  heading2 = () => this._heading('2')
  isActive = (commandName) => this.store.getState().activeCommands[commandName]

  // Due to an utterly bizzare bug, sometimes turning the heading on
  // will also turn bold on. As far as I can tell it's a problem in Chrome.
  _heading = (num) => {
    const boldOnBefore = document.queryCommandState('bold')
    
    // Toggle heading
    if (this.isActive(`heading${num}`)) {
      this.exec('formatBlock','<p>')
    }
    else {
      this.exec('formatBlock', `<h${num}>`)
    }

    const boldOnNow = document.queryCommandState('bold')

    if (boldOnBefore !== boldOnNow) {
      this.exec('bold')
    }
  }

  // We keep track of what commands are applied (e.g. bold, italic, heading)
  // inside the Redux store. This every time exec() is called our the input changed
  // to ensure that those values stay in sync with the actual document.
  updateActiveCommands = () => {
    for (const name of ['bold', 'italic', 'underline', 'strikethrough']) {
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
    if (firstChild && firstChild.nodeType === 3) this.exec('formatBlock', '<p>')
    else if (content.innerHTML === '<br>') content.innerHTML = ''
  }

  handleKeyDown = (event) => {
    // Keyboard shortcuts
    shortcutSwitch(event, {
      'ctrl+i': (e) => {
        e.preventDefault()
        this.italic()
      },
      'ctrl+b': (e) => {
        e.preventDefault()
        this.bold()
      },
      'ctrl+u': (e) => {
        e.preventDefault()
        this.underline()
      },
      'ctrl+t': (e) => {
        e.preventDefault()
        this.strikethrough()
      },
      'ctrl+1': (e) => {
        e.preventDefault()
        this.heading1()
      },
      'ctrl+2': (e) => {
        e.preventDefault()
        this.heading2()
      },
      'ctrl+shift+e': (e) => {
        this.exec('justifyCenter')
      },
      'ctrl+shift+l': (e) => {
        this.exec('justifyLeft')
      },
      'ctrl+shift+r': (e) => {
        e.preventDefault()
        this.exec('justifyRight')
      },

      'tab': (e) => {
        e.preventDefault()
        this.exec('insertHTML', "&emsp;")
      },
    })

    // Unsure what this is for, too afraid to delete. TODO: averiguar pa que sirve
    if (event.key === 'Enter' && document.queryCommandValue('formatBlock') === 'blockquote') {
      console.log('mystery blockquote code firing');
      setTimeout(() => this.exec('formatBlock', '<p>'), 0)
    }
  }

  componentDidMount() {
    this.exec('defaultParagraphSeparator', 'p')
    this.contentRef.current.focus()
    this.store.dispatch(setEditorComponent(this))
  }

  render() {
    return (
      <div className='Editor'>
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