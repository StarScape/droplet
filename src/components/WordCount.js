import React from 'react'
import { connect } from 'react-redux'

function WordCount({ count, store: { dispatch } }) {
  return (
    <span className='WordCount'>{ count } { count === 1 ? 'word' : 'words' }</span>
  );
}

const mapStateToProps = (state) => {
  return {
    count: state.wordCount
  }
}

export default connect(mapStateToProps)(WordCount)