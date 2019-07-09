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
const CONTROL_KEYS = ['ctrl', 'shift', 'alt']

export const shortcutSwitch = (event, shortcuts) => {
  for (const shortcutStr in shortcuts) {
    const keys = shortcutStr.split('+').map(k => k.toLowerCase())

    // Control state needed to fire event
    const neededControlState = CONTROL_KEYS.reduce((map, key) => {
      map[key] = keys.includes(key)
      return map
    }, {})

    // Are all the control keys (and no more) being pressed?
    const controlKeysCorrect = CONTROL_KEYS.every((keyName) => {
      return event[`${keyName}Key`] === neededControlState[keyName]
    })

    const otherKeys = keys.filter(k => !CONTROL_KEYS.includes(k))
    const finalKeyCorrect = event.key.toLowerCase() === otherKeys[0]
    if (otherKeys.length > 1) {
      console.warn(
        "Must not have more than one non-control key per shortcut." +
        `Offending shortcutStr: ${shortcutStr}`
      )
    }

    if (controlKeysCorrect && finalKeyCorrect) {
      shortcuts[shortcutStr](event)
    }
  }
}

export default { shortcutSwitch }