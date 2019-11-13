import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import Button from './ActionbarButton'
import WordCount from './WordCount'
import globalActions from '../globalActions'

import '../styles/Actionbar.scss'

const buttons = [
  {
    title: 'Italic',
    action: 'italic',
    icon: '<i>I</i>',
  },
  {
    title: 'Bold',
    action: 'bold',
    icon: '<b>B</b>',
  },
  {
    title: 'Underline',
    action: 'underline',
    icon: '<u>U</u>',
  },
  {
    title: 'Strikethrough',
    action: 'strikethrough',
    icon: '<strike>S</strike>',
  },
  {
    title: 'Heading 1',
    action: 'heading1',
    icon: '<b>H<sub>1</sub></b>',
  },
  {
    title: 'Heading 2',
    action: 'heading2',
    icon: '<b>H<sub>2</sub></b>',
  },
  {
    title: 'Left Align',
    action: 'justifyLeft',
    icon: '←',
  },
  {
    title: 'Center Align',
    action: 'justifyCenter',
    icon: '↔',
  },
  {
    title: 'Right Align',
    action: 'justifyRight',
    icon: '→',
  },
  {
    title: 'Ordered List',
    action: 'olist',
    icon: '&#35;',
  },
  {
    title: 'Unordered List',
    action: 'ulist',
    icon: '&#8226;',
  },
]

function Actionbar({ store, project, saved }) {
  return (
    <div className='Actionbar'>
      <div className='Actionbar-section'>
        <span>
          <Link to={{
            pathname: '/project',
            state: { project: project }
          }}>
            <Button
              title='Back to project screen'
              icon='←'
            />
          </Link>
          <span>{saved ? 'Changes saved' : 'Saving...'}</span>
        </span>
      </div>

      <div className='Actionbar-section'>
        <WordCount store={store} />
      </div>

      <div className='Actionbar-section'>
        <span>
          {buttons.map(({ title, icon, action }, i) =>
            <Button
              title={title}
              icon={icon}
              action={action}
              onClick={globalActions[action]}
              isActive={false}
              dispatch={store.dispatch}
              key={i}
            />
          )}
        </span>
      </div>
    </div>
  );
}

export default withRouter(Actionbar)
