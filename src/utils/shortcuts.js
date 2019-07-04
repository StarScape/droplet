// Clean interface for making shortcuts.
// Takes a React keyboard event and an object of different shortcuts and corresponding
// actions as parameters. Example use:

/*
  shortcutSwitch(event, {
    'ctrl+shift+e': (e) => {
      // some action
    },
    'ctrl+f': (e) => some other action
  })
*/

export const shortcutSwitch = (event, shortcuts) => {
  for (const shortcutStr in shortcuts) {
    const keys = shortcutStr.split('+').map(k => k.toLowerCase())

    const execute = keys.every((key) => {
      if (key === 'ctrl') return event.ctrlKey
      else if (key === 'alt') return event.altKey
      else if (key === 'shift') return event.shiftKey
      else return event.key.toLowerCase() === key
    })

    if (execute) {
      shortcuts[shortcutStr](event)
    }
  }
}

export default { shortcutSwitch }