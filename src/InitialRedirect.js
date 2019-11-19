import React from 'react'
import { Redirect } from 'react-router-dom'

const selectChapter = (chapters, projectID, cid) =>
  chapters[projectID].ordered.find(({ id }) => id === cid)

const RedirectEditor = ({ store, location }) => {
  const lastProject = location.state.project
  const lastChapter = location.state.chapter

  // Update with current version of project and chapter from store
  const { projects, chapters } = store.getState()
  const project = projects[lastProject.id]
  const chapter = selectChapter(chapters, project.id, lastChapter.id)

  return (
    <Redirect
      to={{
        pathname: '/editor',
        state: {
          file: chapter.id,
          project: project,
          chapter: chapter,
        }
      }}
    />
  )
}

const RedirectProject = ({ store, location }) => {
  return (
    <Redirect
      to={{
        pathname: '/project',
        state: location.state,
      }}
    />
  )
}

const InitialRedirect = ({ store }) => {
  const { location } = store.getState()

  if (!location) return null

  if (location.path === 'editor') {
    return <RedirectEditor location={location} store={store} />
  }
  else if (location.path === 'project') {
    return <RedirectProject location={location} store={store} />
  }
  else {
    return null
  }

}

export default InitialRedirect