import React from 'react'

// Re-nameable title field
export default class GridItemName extends React.Component {
  render() {
    return (
      <h4>{this.props.children}</h4>
    )
  }
}