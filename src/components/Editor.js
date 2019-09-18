import React from 'react'
import { InputHistory, InputTypes } from '../utils/InputHistory'
import { shortcutSwitch } from '../utils/shortcuts'
import { getText, wordCount } from '../utils/wordcount'
import { setEditorComponent, setCommandState, setWordCount } from '../state/actions'

import '../styles/Editor.css'

const fs = require('fs')
const path = require('path')
const { app } = require('electron').remote

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
    this.filePath = path.join(app.getPath('userData'), 'files', props.file)

    this.inputHistory = new InputHistory(10)
    this.autocompleteActive = true
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

  // Move cursor by n (positive or negative) chars in documents
  // Shamelessly stolen from: https://stackoverflow.com/questions/6249095
  moveCursor(n) {
    // This might still work? Test when you don't want to die from stupidity

    const range = document.createRange()
    const sel = window.getSelection()
    range.setStart(sel.anchorNode, sel.anchorOffset+n)
    sel.removeAllRanges()
    sel.addRange(range)

    // Backup solution just in case
    // let sel = window.getSelection();
    // let offset = sel.focusOffset;
    // let focus = sel.focusNode;

    // focus.textContent += ")"; //setting div's innerText directly creates new
    // //nodes, which invalidate our selections, so we modify the focusNode directly

    // let range = document.createRange();
    // range.selectNode(focus);
    // range.setStart(focus, offset);

    // range.collapse(true);
    // sel.removeAllRanges();
    // sel.addRange(range);
  }

  // Adds specified string and moves cursor back to before it
  // Used for autocompleting parens, quotes, etc
  addAfterCursor(str) {
    this.autocompleteActive = false
    this.exec('insertText', str)
    this.moveCursor(-str.length)
    this.autocompleteActive = true
  }

  // Remove the char after AND before the cursor. E.g. if the
  // user types () and then backspaces, it will delete both
  removeAround() {
    this.autocompleteActive = false
    this.exec('forwardDelete')
    // this.exec('delete') // this works somehow...?
    this.autocompleteActive = true
  }

  // Deletes the last n chars in the document and replaces them with replacement
  // Example use case: '-- ' is replaced with '—' (em dash)
  deleteAndReplace (n, replacement) {
    // Turn off autocomplete so that these operations don't get triggered as events...
    this.autocompleteActive = false

    for (let i = 0; i < n; i++) {
      this.exec('delete')
    }

    this.exec('insertText', replacement)

    // ...And turn it back on again when we're done
    this.autocompleteActive = true
  }

  checkAutocomplete (event) {
    // To prevent a syntax highlighting error...
    const OPEN_PAREN = '('

    if (this.autocompleteActive) {
      this.inputHistory.push(event.data)

      // -, -, space becomes —
      if (this.inputHistory.lastTypedWas('-', '-', ' ')) {
        this.deleteAndReplace(3, '—')
        this.inputHistory.push(InputTypes.EXPAND_EM_DASH)
      }
      // ...and backspacing immediately after will undo
      else if (this.inputHistory.lastTypedWas(InputTypes.EXPAND_EM_DASH, InputTypes.BACKSPACE)) {
        this.deleteAndReplace(1, '--')
      }
      // ( autcompletes to () with cursor in between
      else if (this.inputHistory.lastTypedWas(OPEN_PAREN)) {
        this.addAfterCursor(')')
        this.inputHistory.push(InputTypes.AUTOCLOSE_PAREN)
      }
      // ...and backspacing immediately will delete both
      else if (this.inputHistory.lastTypedWas(InputTypes.AUTOCLOSE_PAREN, InputTypes.BACKSPACE)) {
        this.removeAround()
        this.inputHistory.push(InputTypes.REMOVE_AUTOCLOSED_PARENS)
      }

      // ...and do the same thing for "
      else if (this.inputHistory.lastTypedWas('"')) {
        this.addAfterCursor('"')
        this.inputHistory.push(InputTypes.AUTOCLOSE_DQUOTE)
      }
      else if (this.inputHistory.lastTypedWas(InputTypes.AUTOCLOSE_DQUOTE, InputTypes.BACKSPACE)) {
        this.removeAround()
        this.inputHistory.push(InputTypes.REMOVE_AUTOCLOSED_DQUOTE)
      }

      // We don't auto-close single-quotes, bc that's also an apostrophe...and that would be madness.
    }
  }

  handleInput = (event) => {
    const content = this.content
    const { target: { firstChild } } = event
    if (firstChild && firstChild.nodeType === 3) this.exec('formatBlock', '<p>')
    else if (content.innerHTML === '<br>') content.innerHTML = ''

    this.checkAutocomplete(event.nativeEvent)
    this.updateWordCount()
    this.props.onUpdate()
    this.checkAutosave()
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

    if (event.key === 'ArrowRight') {
      this.inputHistory.push(InputTypes.RIGHT)
    }
    else if (event.key === 'ArrowLeft') {
      this.inputHistory.push(InputTypes.LEFT)
    }
    else if (event.key === 'ArrowUp') {
      this.inputHistory.push(InputTypes.UP)
    }
    else if (event.key === 'ArrowDown') {
      this.inputHistory.push(InputTypes.DOWN)
    }

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
    
    if (this.props.file && fs.existsSync(this.filePath)) {
      this.openFile()
    }
  }

  // Remove global editor component when we navigate away
  componentWillUnmount() {
    this.store.dispatch(setEditorComponent(null));
  }

  openFile() {
    fs.readFile(this.filePath, 'utf8', (err, data) => {
      if (err) console.warn(`File error:\n${err}`)
      this.content = data
    })
  }

  saveFile() {
    fs.writeFile(this.filePath, this.content, { flag: 'w' }, (err) => {
      // If files directory doesn't exist, create it and try again
      if (err) {
        const filesDir = path.join(app.getPath('userData'), 'files')
        if (!fs.existsSync(filesDir)) {
          fs.mkdirSync(filesDir)
          this.saveFile()
        }
        else {
          console.warn(`Umm, this appears to be a REAL error:\n${err}`)
        }
      }
      this.props.onSave()
    })
  }

  checkAutosave() {
    if (this.autosaveTimeout) {
      clearTimeout(this.autosaveTimeout)
    }
    this.autosaveTimeout = setTimeout(() => {
      this.saveFile()
    }, 750)
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