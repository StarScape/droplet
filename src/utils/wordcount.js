// Extract all text from an element,
// separating text of subelements with ' '
export const getText = (elem) => {
  if (elem.children.length === 0)
    return elem.innerText + ' '

  let str = ''
  for (let node of elem.children) {
    str += getText(node)
  }
  return str
}

export const wordCount = (str) => str.trim().split(/\s+/).length

export default {
  getText,
  wordCount,
}