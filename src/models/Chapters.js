import uuid from 'uuid'

export class Chapter {
  constructor(title) {
    // Unique ID (also used as file name)
    this.id = uuid.v4()
    this.title = title
  }
}
