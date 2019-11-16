import React from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../state/actions'
import { InputHistory, Inputs } from '../utils/InputHistory'
import { shortcutSwitch } from '../utils/shortcuts'
import { getText, wordCount } from '../utils/wordcount'
import { makeSiblingOf, moveCaretToElem, getEnclosingP, getSelectedElem, isProperlyEnclosed } from '../utils/other'
import { setEditorComponent, setCommandState, setWordCount } from '../state/actions'
import cleanHTML from '../utils/cleanHTML'
import toDocx from '../to_docx'

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const homedir = require("os").homedir()
const { app, dialog } = require('electron').remote

// Main application text editor. See globalActions for API
class Editor extends React.Component {
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
    this.updateWordCount()
  }

  focus = () => this.contentRef.current.focus()

  // Helper method for document.execCommand
  // execCommand should NOT be called directly
  exec = (command, value = null) => {
    this.focus()
    document.execCommand(command, false, value)
    this.updateActiveCommands()
  }

  // Calls the given contenteditable command and ensures any
  // element inserted in the process will be properly wrapped in a <p></p>
  format = (command) => {
    this.exec(command)
    if (!isProperlyEnclosed(getSelectedElem())) {
      console.log('not properly enclosed');
      this.exec('formatBlock', 'p')
    }
  }

  // Editor commands, publicly available via globalActions
  undo          = () => this.exec('undo')
  redo          = () => this.exec('redo')
  copy          = () => this.exec('copy')
  cut           = () => this.exec('cut')
  paste         = () => this.format('paste')
  del           = () => this.exec('delete')
  italic        = () => this.format('italic')
  bold          = () => this.format('bold')
  underline     = () => this.format('underline')
  strikethrough = () => this.format('strikeThrough')
  olist         = () => this.format('insertOrderedList')
  ulist         = () => this.format('insertUnorderedList')

  heading1      = () => this._heading('1')
  heading2      = () => this._heading('2')
  justifyLeft   = () => this._justify('left')
  justifyCenter = () => this._justify('center')
  justifyRight  = () => this._justify('right')

  isActive = (commandName) => this.store.getState().activeCommands[commandName]

  // Due to an utterly bizzare bug, sometimes turning the heading on
  // will also turn bold on. As far as I can tell it's a problem with Chrome.
  _heading = (num) => {
    // Toggle heading
    if (this.isActive(`heading${num}`)) {
      this.exec('formatBlock','p')
    }
    else if (this.isActive('olist') || this.isActive('ulist')) {
      return;
    }
    else {
      this.exec('formatBlock', `h${num}`)
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

  newParagraph() {
    this.exec('insertParagraph')
    const range = window.getSelection().getRangeAt(0)

    // This is to deal with a rather bizarre bug where, if currently editing a
    // list, pressing enter twice will result in editing a new, non-list paragraph,
    // but one that is INSIDE the same <p> element as the <ul> we were previously editing.
    // This solves it by checking if the new <p> is inside another <p> (which should never
    // happen), and shifting it appropriately if so
    const newParagraph = getEnclosingP(range.startContainer)
    if (newParagraph && newParagraph.parentNode.nodeName === 'P') {
      const moved = makeSiblingOf(newParagraph, newParagraph.parentNode)
      moveCaretToElem(moved)
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

  // Returns char n spaces before the cursor
  charBeforeCursor(n=1) {
    const sel = window.getSelection()
    if (!sel.isCollapsed) return null

    const { anchorNode, anchorOffset } = sel
    if (anchorOffset-n > -1) {
      return anchorNode.wholeText[anchorOffset-n]
    }
    return '\n'
  }

  // Returns char after the cursor
  charAfterCursor() {
    const sel = window.getSelection()
    if (!sel.isCollapsed) return null

    const { focusNode, focusOffset } = sel
    return focusNode.wholeText[focusOffset]
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

  // Looks at input history and sees if it should autocomplete something
  checkAutocomplete (event) {
    // To prevent a syntax highlighting error...
    const OPEN_PAREN = '('

    if (this.autocompleteActive) {
      this.inputHistory.push(event.data)
      const lastTypedWas = this.inputHistory.lastTypedWas.bind(this.inputHistory)

      // -, -, space becomes —
      if (lastTypedWas('-', '-', ' ')) {
        this.deleteAndReplace(3, '—')
        this.inputHistory.push(Inputs.EXPAND_EM_DASH)
      }
      // ...and backspacing immediately after will undo
      else if (lastTypedWas(Inputs.EXPAND_EM_DASH, Inputs.BACKSPACE)) {
        this.deleteAndReplace(1, '--')
      }
      // ( autcompletes to () with cursor in between
      else if (lastTypedWas(OPEN_PAREN)) {
        this.addAfterCursor(')')
        this.inputHistory.push(Inputs.AUTOCLOSE_PAREN)
      }
      // ...and backspacing immediately will delete both
      else if (lastTypedWas(Inputs.AUTOCLOSE_PAREN, Inputs.BACKSPACE)) {
        this.removeAround()
        this.inputHistory.push(Inputs.REMOVE_AUTOCLOSED_PARENS)
      }

      // ...and do the same thing for "
      else if (lastTypedWas('"')) {
        this.addAfterCursor('"')
        this.inputHistory.push(Inputs.AUTOCLOSE_DQUOTE)
      }
      else if (lastTypedWas(Inputs.AUTOCLOSE_DQUOTE, Inputs.BACKSPACE)) {
        this.removeAround()
        this.inputHistory.push(Inputs.REMOVE_AUTOCLOSED_DQUOTE)
      }

      // We only auto-close ' if the element before the cursor is a space, em space, or newline
      else if (lastTypedWas("'")) {
        const twoBefore = this.charBeforeCursor(2)
        if (twoBefore === ' ' || twoBefore === '\n' || twoBefore === '\u2003') {
          this.addAfterCursor("'")
          this.inputHistory.push(Inputs.AUTOCLOSE_SQUOTE)
        }
      }
      else if (lastTypedWas(Inputs.AUTOCLOSE_SQUOTE, Inputs.BACKSPACE)) {
        this.removeAround()
        this.inputHistory.push(Inputs.REMOVE_AUTOCLOSED_SQUOTE)
      }
      else if (lastTypedWas('*', ' ')) {
        this.deleteAndReplace(2, '')
        this.ulist()
        this.inputHistory.push(Inputs.AUTOCOMPLETE_ULIST)
      }
      else if  (lastTypedWas('1', '.', ' ')) {
        const beforeList = this.charBeforeCursor(4)

        // IFF we're on a newline with or without a tab
        if (beforeList === '\n' || beforeList === '\u2003') {
          this.inputHistory.push(Inputs.AUTOCOMPLETE_OLIST)
          this.deleteAndReplace(3, '')
          this.olist()
        }
      }
    }
  }

  // Add enter, arrow, etc to input history
  logControlKeys(event) {
    switch(event.key) {
      case 'ArrowRight':
        this.inputHistory.push(Inputs.RIGHT)
        break
      case 'ArrowLeft':
        this.inputHistory.push(Inputs.LEFT)
        break
      case 'ArrowUp':
        this.inputHistory.push(Inputs.UP)
        break
      case 'ArrowDown':
        this.inputHistory.push(Inputs.DOWN)
        break
      case 'Enter':
        this.inputHistory.push(Inputs.ENTER)
        break
      case 'Backspace':
        this.inputHistory.push(Inputs.BACKSPACE)
        break
      default: break;
    }
  }

  // Keyboard shortcuts
  checkShortcuts (event) {
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
  }

  handleInput = (event) => {
    const content = this.content
    const { target: { firstChild } } = event
    if (firstChild && firstChild.nodeType === 3) {
      this.exec('formatBlock', '<p>')
    }
    else if (content.innerHTML === '<br>') content.innerHTML = ''

    this.checkAutocomplete(event.nativeEvent)
    this.updateWordCount()
    this.props.onUpdate()
    this.checkAutosave()
  }

  handleKeyDown = (event) => {
    // Override default ENTER
    if (event.keyCode === 13) {
      // event.preventDefault()
      // this.newParagraph()
    }

    this.checkShortcuts(event)
    this.logControlKeys(event)

    // Unsure what this is for, too afraid to delete. TODO: averiguar pa que sirve
    if (event.key === 'Enter' && document.queryCommandValue('formatBlock') === 'blockquote') {
      console.log('mystery blockquote code firing');
      setTimeout(() => this.exec('formatBlock', '<p>'), 0)
    }
  }

  handleClick = (event) => {
    this.inputHistory.push(Inputs.CLICK)
  }

  // Pasting from word can present some issues, so we intercept
  // the HTML and clean it up before inserting it into the document 
  overridePaste = (event) => {
    const html = event.clipboardData.getData('text/html')
    if (html) {
      event.preventDefault()
      this.exec('insertHTML', cleanHTML(html))
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

  // Export as docx
  exportDocx = async () => {
    this.props.setNotification('Exporting...')

    const pathToSave = dialog.showSaveDialog({
      title: 'Choose Location To Export',
      buttonLabel: 'Export',
      defaultPath: homedir + '/Documents/mydoc.docx',
    })

    if (pathToSave) {
      const buffer = await toDocx(this.contentRef.current)
      let exportStatus = null
      try {
        await fsPromises.writeFile(pathToSave, buffer)
        exportStatus = 'Export done'
      } catch (e) {
        alert('Error exporting document')
        exportStatus = 'Export failed'
      }
      setTimeout(() => {
        this.props.setNotification(exportStatus)
      }, 200)
    }

    setTimeout(() => {
      this.props.setNotification(null)
    }, 1500)
  }

  render() {
    return (
      <div className='Editor'>
        <div
          contentEditable='true'
          spellCheck='true'
          className='Editor-content'
          ref={this.contentRef}
          onInput={this.handleInput}
          onKeyDown={this.handleKeyDown}
          onClick={this.handleClick}
          onKeyUp={this.updateActiveCommands}
          onMouseUp={this.updateActiveCommands}
          onPaste={this.overridePaste}
          >
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setNotification: msg => dispatch(setNotification(msg)),
})

export default connect(null, mapDispatchToProps)(Editor)