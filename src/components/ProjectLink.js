import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export default function ProjectLink({ name, project }) {
  return (
    <Link class='project-link' to={{
        pathname: '/projects',
        state: { project: project }
      }}>

      <div class='project-link-content'>{name}</div>

    </Link>
  )
}
