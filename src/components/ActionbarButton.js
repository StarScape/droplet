import React from 'react'
import { connect } from 'react-redux'

function ActionbarButton({ title, icon, isActive, dispatch, ...rest }) {
  const classes = ['ActionbarButton']
  if (isActive) classes.push('ActionbarButton-active')

  return (
    <button
      className={classes.join(' ')}
      title={title}
      dangerouslySetInnerHTML={{ __html: icon }}
      {...rest}
      >
    </button>
  );
}

const mapStateToProps = (state, { action }) => {
  console.log(state.activeCommands[action]);
  return {
    isActive: state.activeCommands[action]
  }
}

export default connect(mapStateToProps)(ActionbarButton)