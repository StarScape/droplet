import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Header.scss'

export default function Header({ children, backPath, backState={} }) {
  return (
    <div className='Header'>
      <div className='back'>
        {backPath ?
          <Link to={{ path: backPath, state:backState }}>
            <img src='img/left-arrow.svg' width='30px' alt='Back' />
          </Link>
        : null}
      </div>
      <div className='logo-and-title'>
        <img className='droplet-logo' src='img/drop_blue_small.png' />
        <h3 className='droplet-title'>droplet</h3>
      </div>
      <div className='buttons'>
        {children}
      </div>
    </div>
  )
}