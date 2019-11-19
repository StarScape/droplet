import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { displayModal } from '../state/store'
import GridItemName from '../components/GridItemName'

import '../styles/Grid.scss'

function GridItemLink(props) {
  const {
    to,
    className,
    name,
    footer,
    deleteMessage,
    onUpdateName,
    onConfirmDelete,
    ...rest
  } = props

  const handleDelete = () => {
    displayModal({
      title: 'Warning',
      body: deleteMessage,
      onConfirm: () => {
        onConfirmDelete()
      },
      onCancel: () => {},
    })
  }

  return (
    <div className={`grid-item ${className}`} {...rest}>
      <Link
        className='grid-item-link'
        to={to}
      >
        <div className='grid-item-content'>
          <GridItemName onChange={onUpdateName}>{name}</GridItemName>
        </div>
      </Link>

      <div className='grid-item-footer'>
        <span className='delete hover-button' onClick={handleDelete}>
          <img src='img/trash.svg' width='20px' alt='x' title='foo' />
        </span>
        {footer}
      </div>
    </div>
  )
}

export default GridItemLink