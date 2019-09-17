export default class InputHistory {
  constructor(length) {
    this.length = length
    this.history = [] //Object.seal(new Array(length))
    this.items = 0
  }

  push(item) {
    if (this.items === this.length) {
      this.history.shift()
    }

    this.history.push(item)
    this.items++
  }

  // Returns true if the last typed characters match a list of provided chars
  // For example, if the user had typed 'abc' immediately before the method
  // was called like this:
  // lastTypedWas('a', 'b', 'c')
  // ... it would return true
  lastTypedWas(...chars) {
    let hIdx = this.history.length-1

    for (let i = chars.length-1; i >= 0; i--) {
      // console.log(`char at: ${i} = ${chars[i]}`);
      // console.log(`h at: ${hIdx} = ${this.history[hIdx]}`);
      // console.log(chars[i]);
      if (chars[i] !== this.history[hIdx]) {
        return false
      }

      hIdx--
    }

    // console.log()
    // console.log("<br>")
    // console.log()

    return true
  }
}