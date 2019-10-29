// Clean up HTML received from clipboard (e.g. from Word)
const cleanHTML = (html) => {
  const pasted = document.createElement('html')
  pasted.innerHTML = html

  const cleaned = stripUnwanted(pasted)

  return pasted.innerText
}

const stripUnwanted = (e) => {
  let innerHTML = ''
  if (e.children.length < 1) {
    innerHTML = e.innerHTML
  }
  else {
    for (const child of e.children) {
      innerHTML += stripUnwanted(child)
    }
  }

  if (['SPAN', 'BODY', 'B'].includes(e.tagName)) {
    return innerHTML
  }
  else if (e.tagName === 'BR') {
    return ''
  }

  const tag = e.tagName.toLowerCase()
  return `<${tag}>${innerHTML}</${tag}>`
}

// const applyStyles = (innerHTML, styles) => {
//   const asArray = Array.from(styles)
//   const openingTags = asArray.map(tag => `<${tag}>`).join('')
//   const closingTags = asArray.map(tag => `</${tag}>`).join('')

//   return openingTags + innerHTML + closingTags
// }

export default cleanHTML
