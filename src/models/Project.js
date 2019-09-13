export default class Project {
  constructor(name) {
    this.name = name
    this.dateCreated = Date.now()
    this.dateModified = this.dateCreated
  }
}