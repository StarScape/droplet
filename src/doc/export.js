const fs = require('fs')
const path = require('path')
const nodePandoc = require('node-pandoc')
const { app } = require('electron').remote

const pandocArgs = '-f html -o /home/jack/exported.docx'

const exportDoc = (file) => {
  const pandocSrc = path.join(app.getPath('userData'), 'files', file)

  nodePandoc(pandocSrc, pandocArgs, (err, result) => {
    console.log("exported!!");
    console.log(result);
  })
}

export default exportDoc
