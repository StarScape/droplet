const { app } = require('electron').remote
const fs = require('fs')
const path = require('path')

const PROJECT_DIR = path.join(app.getPath('userData'), '.projects');

export const loadProjectInfo = () => {
  const projects = []

  if(fs.existsSync(PROJECT_DIR)) {
    const files = fs.readdirSync(PROJECT_DIR)

    for (let fname of files) {
      const fpath = path.join(PROJECT_DIR, fname)
      const stat = fs.lstatSync(fpath)

      if (stat.isDirectory()) {
        const project = {
          name: fname,
          path: fpath,
          chapters: [],
        }
        projects.push(project)
      }
    }
  }
  else {
    fs.mkdirSync(PROJECT_DIR)
  }

  return projects
}

// Get metadata (but not actual text) for chapters
export const loadChaptersInfo = (project) => {
  const chapters = fs.readdirSync(project.path)
  const chaptersInfo = []

  for (let chapter of chapters) {
    const chapterPath = path.join(project.path, chapter)
    const { name, ext } = path.parse(chapterPath)

    if (ext === '.drop') {
      chaptersInfo.push({
        path: chapterPath,
        number: parseInt(name),
      })
    }
  }

  return chaptersInfo
}
