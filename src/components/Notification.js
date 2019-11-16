import React from 'react'
import { connect } from 'react-redux'

import '../styles/Notification.scss'

function Notification({ msg }) {
  // Only show when there is something to show
  const isVisible = msg !== null && msg !== undefined && msg !== ''
  return (
    <div className={`Notification${isVisible ? ' Notification-active' : ''}`}>
      {msg}
    </div>
  )
}

const mapStateToProps = state => ({ msg: state.notification })

export default connect(mapStateToProps)(Notification)