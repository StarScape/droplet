import React from 'react'
import { connect } from 'react-redux'

function WordCount({ wordCount, store: { dispatch } }) {
  return (
    <h6>{ wordCount } { wordCount === 1 ? 'word' : 'words' }</h6>
  );
}

const mapStateToProps = (state) => {
  return {
    wordCount: state.wordCount
  }
}

export default connect(mapStateToProps)(WordCount)