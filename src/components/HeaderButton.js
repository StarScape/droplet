import React from 'react'

export default function HeaderButton({ children, altText, onClick }) {
  return (
    <button
      className='HeaderButton'
      title={altText}
      onClick={onClick}
    >
      {children}
    </button>
  )
}