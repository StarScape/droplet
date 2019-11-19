import uuid from 'uuid'

export default class Project {
  constructor(name) {
    this.name = name
    this.id = uuid.v4()
    this.dateCreated = Date.now()
    this.dateModified = this.dateCreated
  }
}