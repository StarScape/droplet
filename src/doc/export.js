const fs = require('fs')
const path = require('path')
const nodePandoc = require('node-pandoc')
const { app } = require('electron').remote

const pandocArgs = '-f html -o /home/jack/exported.docx'

const exportDoc = (file) => {
  const tmpDir = path.join(app.getPath('userData'), 'tmp')
  const filePath = path.join(app.getPath('userData'), 'files', file)
  const pandocSrc = path.join(tmpDir, file)

  // TODO: error callbacks
  fs.readFile(filePath, 'utf8', (err, doc) => {
    if (err) console.warn(`Cannot export:\n${err}`)
    const docCleaned = convertTabs(doc)
    console.log(docCleaned);

    fs.writeFile(pandocSrc, docCleaned, { flag: 'w' }, (err) => {
      // If tmp directory doesn't exist, create it and try again
      if (err) {
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir)
        } else { console.log ("REAL error") }
      }

      nodePandoc(pandocSrc, pandocArgs, (err, result) => {
        // console.log(result);
      })

    })

  })


}

// Replace em spaces with actual tabs before exporting
// const convertTabs = (doc) => doc.replace('\u2003', '\&#9')
const convertTabs = (doc) => doc.replace('\u2003', '写')

export default exportDoc
