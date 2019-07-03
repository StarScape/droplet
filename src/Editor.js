import React from 'react'
import { shortcutSwitch } from './shortcut'

import './Editor.css'

const defaultParagraphSeparatorString = 'defaultParagraphSeparator'
const formatBlock = 'formatBlock'
const addEventListener = (parent, type, listener) => parent.addEventListener(type, listener)
const appendChild = (parent, child) => parent.appendChild(child)
const createElement = tag => document.createElement(tag)
const queryCommandState = command => document.queryCommandState(command)
const queryCommandValue = command => document.queryCommandValue(command)

const exec = (command, value = null) => document.execCommand(command, false, value)

const defaultActions = {
  bold: {
    icon: '<b>B</b>',
    title: 'Bold',
    state: () => queryCommandState('bold'),
    result: () => exec('bold')
  },
  italic: {
    icon: '<i>I</i>',
    title: 'Italic',
    state: () => queryCommandState('italic'),
    result: () => exec('italic')
  },
  underline: {
    icon: '<u>U</u>',
    title: 'Underline',
    state: () => queryCommandState('underline'),
    result: () => exec('underline')
  },
  strikethrough: {
    icon: '<strike>S</strike>',
    title: 'Strike-through',
    state: () => queryCommandState('strikeThrough'),
    result: () => exec('strikeThrough')
  },
  heading1: {
    icon: '<b>H<sub>1</sub></b>',
    title: 'Heading 1',
    result: () => exec(formatBlock, '<h1>')
  },
  heading2: {
    icon: '<b>H<sub>2</sub></b>',
    title: 'Heading 2',
    result: () => exec(formatBlock, '<h2>')
  },
  paragraph: {
    icon: '&#182;',
    title: 'Paragraph',
    result: () => exec(formatBlock, '<p>')
  },
  quote: {
    icon: '&#8220; &#8221;',
    title: 'Quote',
    result: () => exec(formatBlock, '<blockquote>')
  },
  olist: {
    icon: '&#35;',
    title: 'Ordered List',
    result: () => exec('insertOrderedList')
  },
  ulist: {
    icon: '&#8226;',
    title: 'Unordered List',
    result: () => exec('insertUnorderedList')
  },
  code: {
    icon: '&lt;/&gt;',
    title: 'Code',
    result: () => exec(formatBlock, '<pre>')
  },
  line: {
    icon: '&#8213;',
    title: 'Horizontal Line',
    result: () => exec('insertHorizontalRule')
  },
  link: {
    icon: '&#128279;',
    title: 'Link',
    result: () => {
      const url = window.prompt('Enter the link URL')
      if (url) exec('createLink', url)
    }
  },
  image: {
    icon: '&#128247;',
    title: 'Image',
    result: () => {
      const url = window.prompt('Enter the image URL')
      if (url) exec('insertImage', url)
    }
  }
}

const defaultParagraphSeparator = 'p'

const classes = {
  actionbar: 'Editor-actionbar',
  button: 'Editor-button',
  content: 'Editor-content',
  selected: 'Editor-button-selected'
}

export default class Editor extends React.Component {
  settings = {
    actions: ['italic', 'bold', 'underline', 'strikethrough', 'heading1', 'heading2'],
  }
  
  constructor(props) {
    super(props);

    // We need access to the actual contenteditable DOM elements
    this.contentRef = React.createRef();
    this.actionbarRef = React.createRef();
  }

  handleTextChange(content) {}

  handleInput = (event) => {
    const content = this.contentRef.current

    const { target: { firstChild } } = event
    if (firstChild && firstChild.nodeType === 3) exec(formatBlock, `<${defaultParagraphSeparator}>`)
    else if (content.innerHTML === '<br>') content.innerHTML = ''
    this.handleTextChange(content.innerHTML)
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
    if (event.key === 'Enter' && queryCommandValue(formatBlock) === 'blockquote') {
      setTimeout(() => exec(formatBlock, `<${defaultParagraphSeparator}>`), 0)
    }
  }

  componentDidMount() {
    const content = this.contentRef.current

    // TODO: refactor / extract to separate place
    const actionbar = this.actionbarRef.current
    const actions = this.settings.actions
    ? (
      this.settings.actions.map(action => {
        if (typeof action === 'string') return defaultActions[action]
        else if (defaultActions[action.name]) return { ...defaultActions[action.name], ...action }
        return action
      })
    )
    : Object.keys(defaultActions).map(action => defaultActions[action])

    actions.forEach(action => {
      const button = createElement('button')
      button.className = classes.button
      button.innerHTML = action.icon
      button.title = action.title
      button.setAttribute('type', 'button')
      button.onclick = () => action.result() && content.focus()

      if (action.state) {
        const handler = () => button.classList[action.state() ? 'add' : 'remove'](classes.selected)
        addEventListener(content, 'keyup', handler)
        addEventListener(content, 'mouseup', handler)
        addEventListener(button, 'click', handler)
      }

      appendChild(actionbar, button)
    })

    exec(defaultParagraphSeparatorString, defaultParagraphSeparator)
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
          >
        </div>
      </div>
    );
  }
}