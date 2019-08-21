import React from 'react'
import { shortcutSwitch } from '../utils/shortcuts'
import { getText, wordCount } from '../utils/wordcount'
import { setEditorComponent, setCommandState, setWordCount } from '../state/actions'

import '../styles/Editor.css'

const fs = require('fs')

// CSS classes
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
    this.file = props.file
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
  justifyLeft = () => this._justify('left')
  justifyCenter = () => this._justify('center')
  justifyRight = () => this._justify('right')

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

  _justify = (dir) => {
    const capitalized = dir.charAt(0).toUpperCase() + dir.slice(1)
    if (this.isActive(`justify${capitalized}`)) {
      this.exec('justifyLeft')
    }
    else {
      this.exec(`justify${capitalized}`)
    }
  }

  // We keep track of what commands are applied (e.g. bold, italic, heading)
  // inside the Redux store. This every time exec() is called our the input changed
  // to ensure that those values stay in sync with the actual document.
  updateActiveCommands = () => {
    for (const name of ['bold', 'italic', 'underline', 'strikethrough']) {
      this.store.dispatch(setCommandState(name, document.queryCommandState(name)))
    }

    const blockType = document.queryCommandValue('formatBlock')
    this.store.dispatch(setCommandState('heading1', blockType === 'h1'))
    this.store.dispatch(setCommandState('heading2', blockType === 'h2'))
    this.store.dispatch(setCommandState('ulist', document.queryCommandState('insertUnorderedList')))
    this.store.dispatch(setCommandState('olist', document.queryCommandState('insertOrderedList')))
    this.store.dispatch(setCommandState('justifyCenter', document.queryCommandState('justifyCenter')))
    this.store.dispatch(setCommandState('justifyRight', document.queryCommandState('justifyRight')))

    // Currently turned off bc it's ugly af. Uncommenting will fix it
    // this.store.dispatch(setCommandState('justifyLeft', document.queryCommandState('justifyLeft')))
  }

  updateWordCount = (content) => {
    const words = wordCount(getText(this.contentRef.current))
    this.store.dispatch(setWordCount(words))
  }

  handleInput = (event) => {
    const content = this.content
    const { target: { firstChild } } = event
    if (firstChild && firstChild.nodeType === 3) this.exec('formatBlock', '<p>')
    else if (content.innerHTML === '<br>') content.innerHTML = ''

    this.updateWordCount()
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
      'ctrl+shift+b': (e) => {
        e.preventDefault()
        this.ulist()
      },
      'ctrl+shift+n': (e) => {
        e.preventDefault()
        this.olist()
      },
      'ctrl+shift+l': (e) => {
        this.justifyLeft()
      },
      'ctrl+shift+e': (e) => {
        e.preventDefault()
        this.justifyCenter()
      },
      'ctrl+shift+r': (e) => {
        e.preventDefault()
        this.justifyRight()
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
    
    if (this.file) {
      this.openFile()
    }
  }

  // Remove global editor component when we navigate away
  componentWillUnmount() {
    this.store.dispatch(setEditorComponent(null));
  }

  openFile() {
    fs.readFile(this.file, 'utf8', (err, data) => {
      if (err) console.warn(`File error:\n${err}`)
      this.content = data
    })
  }

  saveFile() {
    fs.writeFile(this.file, this.content, { flag: 'w' }, (err) => {
      if (err) console.warn(`File error:\n${err}`)
    })
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