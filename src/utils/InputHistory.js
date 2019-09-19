// It's useful to keep track of what of auto-completions as
// well, and have an easy way to identify them. We may only want
// to do something, for example, if the second to last event was a certain autoreplacement
export const InputTypes = {
  BACKSPACE: 'BACKSPACE',
  ENTER: 'ENTER',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN',
  EXPAND_EM_DASH: 'EXPAND_EM_DASH',
  AUTOCLOSE_PAREN: 'AUTOCLOSE_PAREN',
  AUTOCLOSE_SQUOTE: 'AUTOCLOSE_SQUOTE',
  AUTOCLOSE_DQUOTE: 'AUTOCLOSE_DQUOTE',
  REMOVE_AUTOCLOSED_PAREN: 'REMOVE_AUTOCLOSED_PAREN',
  REMOVE_AUTOCLOSED_DQUOTE: 'REMOVE_AUTOCLOSED_DQUOTE',
  REMOVE_AUTOCLOSED_SQUOTE: 'REMOVE_AUTOCLOSED_SQUOTE',
}

export class InputHistory {
  constructor(length) {
    this.length = length
    this.history = []
  }

  push(item) {
    if (this.history.length === this.length) {
      this.history.shift()
    }

    if (item !== null) {
      this.history.push(item)
    }
  }

  // Returns true if the last typed characters match a list of provided chars
  // For example, if the user had typed 'abc' immediately before the method
  // was called like this:
  // lastTypedWas('a', 'b', 'c')
  // ... it would return true
  lastTypedWas(...chars) {
    let hIdx = this.history.length-1

    for (let i = chars.length-1; i >= 0; i--) {
      if (chars[i] !== this.history[hIdx]) {
        return false
      }

      hIdx--
    }

    return true
  }
}