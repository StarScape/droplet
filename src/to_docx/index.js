import JSZip from 'jszip/dist/jszip.min'

const path = require('path')
const fs = require('fs').promises
const { app } = require('electron').remote

const wordFilesPath = path.join(app.getAppPath(), 'src/to_docx/files')
const wordFiles = [
  '[Content_Types].xml',
  '_rels/.rels',
  'word/fontTable.xml',
  'word/numbering.xml',
  'word/settings.xml',
  'word/styles.xml',
  'word/_rels/document.xml.rels',
]

const styleTags = ['B', 'I', 'U', 'STRIKE']

// Apply word style tags to <w:rPr>
const getStyleTags = (styles) => `
  ${ styles.includes('B') ? '<w:b/><w:bCs/>' : ''}
  ${ styles.includes('I') ? '<w:i/><w:iCs/>' : ''}
  ${ styles.includes('U') ? '<w:u w:val="single" />' : ''}
  ${ styles.includes('STRIKE') ? '<w:strike />' : ''}
`

const getrPr = (styles) =>
  styles.length > 0 ? `
    <w:rPr>
      ${getStyleTags(styles)}
    </w:rPr>
  `
  : `<w:rPr />`

const getRun = (text, hasTab, styles) => `
    <w:r>
      ${getrPr(styles)}
      ${hasTab ? '<w:tab />' : ''}
      <w:t xml:space="preserve">${hasTab ? text.substr(1) : text}</w:t>
    </w:r>`

// Transforms text and a list of styles to DOCX runs(s)
const textToRun = (text, styles = []) => {
  // Separate by tabs, and generate a run for each,
  // since <w:t> cannot be directed inside a <w:t>
  const splitByTabs = text.split(/(?=\u{2003})/ug)
  const runs = splitByTabs.map(str =>
    getRun(str, str.startsWith('\u2003'), styles)
  )
 
  return runs.join('')
}

// Takes an html element and a string of the DOCX
// tags to go inside of it and transforms it into the
// appropriate DOCX XML tag
const wrapInTag = (elem, innerTags) => {
  if (elem.tagName === 'P' || elem.tagName === 'BR') {
    return `
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Normal" />
          <w:rPr />
        </w:pPr>
        ${innerTags}
      </w:p>
    `
  }
  else  if (elem.tagName === 'H1') {
    return `<w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1" />
        <w:numPr>
          <w:ilvl w:val="0" />
          <w:numId w:val="1" />
        </w:numPr>
        <w:rPr />
      </w:pPr>
      ${innerTags}
    </w:p>`
  }
  else  if (elem.tagName === 'H2') {
    return `
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading2" />
          <w:numPr>
            <w:ilvl w:val="1" />
            <w:numId w:val="1" />
          </w:numPr>
          <w:spacing w:before="200" w:after="120" />
          <w:rPr />
        </w:pPr>
        ${innerTags}
      </w:p>
    `
  }
  else if (elem.tagName === 'LI') {
    let wnumId = 0
    if (elem.parentElement.tagName === 'OL') {
      wnumId = 3
    }
    else if (elem.parentElement.tagName === 'UL') {
      wnumId = 4
    }

    return `<w:p>
      <w:pPr>
        <w:pStyle w:val="Normal" />
        <w:numPr>
          <w:ilvl w:val="0" />
          <w:numId w:val="${wnumId}" />
        </w:numPr>
        <w:rPr />
      </w:pPr>
      ${innerTags}
    </w:p>`
  }
  else  if ([...styleTags, 'OL', 'UL'].includes(elem.tagName)) {
    return innerTags
  }
  else {
    throw new Error('Unrecognized element');
  }
}

// Convert each html tag to DOCX tags recursively
const convertTags = (elem, styles = []) => {
  const stylesUpdated = [
    ...styles,
    ...styleTags.filter(tag => elem.tagName === tag)
  ]

  // Get Word text run for HTML text nodes
  if (elem.childNodes.length < 1 && elem.nodeType === 3) {
    const inner = textToRun(elem.data || '', stylesUpdated)
    return inner
  }
  // Or wrap in appropriate tag, nesting the
  // (already converted) XML inside of it
  else {
    const inner = Array.from(elem.childNodes)
                 .map(c => convertTags(c, stylesUpdated))
                 .join('')
    return wrapInTag(elem, inner)
  }
}

// Convert root tag to DOCX body
const getBody = (rootElem) => {
  const inner = Array.from(rootElem.children)
               .map(c => convertTags(c))
               .join('')
 
  return `<w:body>
  ${inner}
  <w:sectPr>
    <w:type w:val="nextPage" />
    <w:pgSz w:w="12240" w:h="15840" />
    <w:pgMar w:left="1134" w:right="1134" w:header="0" w:top="1134" w:footer="0" w:bottom="1134" w:gutter="0" />
    <w:pgNumType w:fmt="decimal" />
    <w:formProt w:val="false" />
    <w:textDirection w:val="lrTb" />
  </w:sectPr>
</w:body>`
}

// Gen content of document.xml, the main file containing the document's data
const getDocument = (rootElem) =>
`<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">
  ${getBody(rootElem)}
</w:document>`

// Create a ZIP file using JSZip. DOCX files
// are nothing but zipped folders under the hood
const buildZIP = async (documentXML) => {
  const docx = new JSZip()
  docx.folder('_rels')
  docx.folder('word')
  docx.folder('word/_rels')
  docx.file('word/document.xml', documentXML)

  // Augment returned file contents with paths of files
  const filePromises = wordFiles.map(fpath =>
    fs.readFile(path.join(wordFilesPath, fpath), 'utf8').then(contents => ({
      fpath, contents
    }))
  )

  // Add the contents of each file to ZIP file
  // ex: docx.file('word/number.xml', '<?xml version...')
  const readFiles = await Promise.all(filePromises)
  readFiles.forEach(({ fpath, contents }) => {
    docx.file(fpath, contents)
  })

  return docx
}

const toDocx = async (elem) => {
  const documentXML = getDocument(elem)
  const docx = await buildZIP(documentXML)
  return docx.generateAsync({ type: 'nodebuffer' })
}

export default toDocx
