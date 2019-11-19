import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { displayModal } from '../state/store'
import GridItemName from '../components/GridItemName'

import '../styles/Grid.scss'

function GridItemLink(props) {
  const {
    to,
    name,
    footer,
    onUpdateName,
    onConfirmDelete,
  } = props

  const handleDelete = () => {
    displayModal({
      title: 'Warning',
      body: 'Are you sure you want to delete this project? Once you do, it cannot be recovered.',
      onConfirm: () => {
        onConfirmDelete()
      },
      onCancel: () => {},
    })
  }

  return (
    <div className='grid-item'>
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