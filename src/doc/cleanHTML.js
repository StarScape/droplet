// Clean up HTML received from clipboard (e.g. from Word)
const cleanHTML = (html) => {
  const pasted = document.createElement('html')
  pasted.innerHTML = html

  pasted.querySelectorAll('[style]').forEach(e => {
    const weight = fontWeight(e.style['font-weight'])
    const style = fontStyle(e.style['font-style'])

    if (weight === 'bold') {
      e.innerHTML = `<b>${e.innerHTML}</b>`
    }

    if (style === 'italic') {
      e.innerHTML = `<i>${e.innerHTML}</i>`
    }

    e.style = ''
    e.id = ''
  });

  const openingTagsRemoved = pasted.innerHTML.replace(/<\s*span[^>]*>/gm, '')
  const closingTagsRemoved = openingTagsRemoved.replace(/<\s*\/\s*span>/gm, '')

  return closingTagsRemoved
}

const fontWeight = (weight) => {
  const number = Number(weight)
  if (number) {
    if (number <= 400) {
      return 'normal'
    }
    else {
      return 'bold'
    }
  }
  else {
    if (weight === 'lighter') {
      return 'normal'
    }
    return weight
  }
}


const fontStyle = (style) => style === 'italic' ? style : 'normal'

export default cleanHTML
