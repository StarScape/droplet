import React from 'react'
import Button from './ActionbarButton'
import globalActions from '../globalActions'

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
    title: 'Ordered List',
    action: 'olist',
    icon: '&#35;',
  },
  {
    title: 'Unordered List',
    action: 'ulist',
    icon: '&#8226;',
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

]

export default function Actionbar({ store }) {

  return (
    <div className='Actionbar'>
      {buttons.map(({ title, icon, action }, i) =>
        <Button
          title={title}
          action={action}
          icon={icon}
          onClick={globalActions[action]}
          isActive={false}
          dispatch={store.dispatch}
          key={i}
        />
      )}
    </div>
  );
}