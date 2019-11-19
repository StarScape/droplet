import React from 'react'
import { connect } from 'react-redux'
import { setModal } from '../state/actions'
import '../styles/Modal.scss'

function Modal(props) {
  if (!props.show) return null
  const {
    title,
    body,
    onConfirm,
    onCancel,
    close,
  } = props

  return (
    <div className='Modal-outer'>
      <div className='Modal-content'>
        <section>
          <h3><span>{title}</span></h3>
          <p>{body}</p>
        </section>
        <section>
          <button
            className='confirm blue-button'
            onClick={() => {
              onConfirm()
              close()
            }}
          >
            OKAY
          </button>
          {onCancel ? (
            <button
              className='cancel blue-button'
              onClick={() => {
                onCancel()
                close()
              }}
            >
              CANCEL
            </button>
          ) : null}
        </section>
      </div>
    </div>
  )
}

const mapStateToProps = state => state.modal
const mapDispatchToProps = dispatch => ({
  close: () => dispatch(setModal({ show: false }))
})

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
