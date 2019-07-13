// Extract all text from an element,
// separating text of subelements with ' '
export const getText = (node) => {
  if (node.nodeType === 3) {
    return node.data + ' '
  }

  let txt = '';
  // eslint-disable-next-line
  if (node = node.firstChild) do {
    txt += getText(node)
  // eslint-disable-next-line
  } while (node = node.nextSibling);

  return txt
}
export const wordCount = (str) => {
  if (str.trim() === '') {
    return 0
  }
  return str.trim().split(/\s+/).length
}

export default {
  getText,
  wordCount,
}