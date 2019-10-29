// Clean up HTML received from clipboard (e.g. from Word)
const cleanHTML = (html) => {
  const pasted = document.createElement('html')
  pasted.innerHTML = html

  pasted.querySelectorAll('[style]').forEach(e => {
    const weight = fontWeight(e.style['font-weight'])
    const style = fontStyle(e.style['font-style'])

    e.style = ''
    e.style['font-weight'] = weight
    e.style['font-style'] = style
  });

  return pasted.innerHTML
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
