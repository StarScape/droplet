import React from 'react'
import { Link } from 'react-router-dom'
import { deleteProject } from '../state/actions'
import { connect } from 'react-redux'

import '../styles/Grid.css'

const pluralize = (i, str) => i > 1 ? str + 's' : str

const formatModifiedDate = d => {
  const date = new Date(d)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const seconds = Math.round(diff / 1000)
  if (seconds < 60) return `${seconds} ${pluralize(seconds, 'second')} ago`

  const minutes = Math.round(diff / (1000 * 60))
  if (minutes < 60) return `${minutes} ${pluralize(minutes, 'minute')} ago`

  const hours = Math.round(diff / (1000 * 3600))
  if (hours < 24) return `${hours} ${pluralize(hours, 'hour')} ago`

  const days = Math.round(diff / (1000 * 3600 * 24))
  if (days < 31) return `${days} ${pluralize(days, 'day')} ago`

  const months = Math.round(diff / (1000 * 3600 * 24 * 30))
  if (months <= 12) return `${months} ${pluralize(months, 'months')} ago`

  const years = Math.round(diff / (1000 * 3600 * 24 * 30 * 12))
  return `${years} ${pluralize(years, 'years')} ago`
}

function ProjectLink({ project, deleteProject, children }) {
  return (
    <div className='grid-item'>
      <Link to={{
          pathname: '/projects',
          state: { project: project }
        }}>

        <div className='grid-item-content'>
          <h4>{project.name}</h4>
          <p>{formatModifiedDate(project.date)}</p>
        </div>
      </Link>

      <button onClick={deleteProject}>
        Delete
      </button>
    </div>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteProject: () => { dispatch(deleteProject(ownProps.project.name)) }
})

export default connect(null, mapDispatchToProps)(ProjectLink)