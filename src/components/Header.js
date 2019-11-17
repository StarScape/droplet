import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Header.scss'

export default function Header({ children, title, backPath, backState={} }) {
  return (
    <div className='Header'>
      <div className='back'>
        {backPath ?
          <Link to={{ pathname: backPath, state:backState }}>
            <img
              className='hover-button'
              src='img/left-arrow.svg'
              width='30px'
              alt='Back'
            />
          </Link>
        : null}
      </div>
      <div className='logo-and-title'>
        <img className='droplet-logo' src='img/drop_blue_small.png' alt='droplet' />
        <h3 className='droplet-title'>droplet</h3>
      </div>
      <div className='buttons'>
        {children}
      </div>
    </div>
  )
}