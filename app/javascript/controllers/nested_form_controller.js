import NestedForm from "@stimulus-components/rails-nested-form"

let index = 0

export default class extends NestedForm {
  connect() {
    super.connect()
  }

  add(event) {
    event.preventDefault()
    index += 1

    const content = this.templateTarget.content.cloneNode(true)
    content.querySelectorAll("input, select").forEach(element => {
      element.name = element.name.replace(/\d+/, index)
      element.id = element.id.replace(/\d+/, index)
    })

    this.targetTarget.appendChild(content)
  }
}
