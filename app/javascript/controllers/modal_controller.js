import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "panel", "backdrop"]

  connect() {
  }

  show() {
    document.body.classList.add("overflow-hidden")

    this.containerTarget.classList.remove("opacity-0", "pointer-events-none")
    this.containerTarget.classList.add("opacity-100", "pointer-events-auto")

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.panelTarget.classList.remove("opacity-0", "scale-95")
        this.panelTarget.classList.add("opacity-100", "scale-100")
      })
    })
  }

  close() {
    this.panelTarget.classList.remove("opacity-100", "scale-100")
    this.panelTarget.classList.add("opacity-0", "scale-95")
    this.containerTarget.classList.remove("opacity-100", "pointer-events-auto")
    this.containerTarget.classList.add("opacity-0", "pointer-events-none")

    setTimeout(() => {
      document.body.classList.remove("overflow-hidden")
    }, 300)
  }

  onTransitionEndShowing(event) {
    if (event.propertyName === 'opacity' && this.containerTarget.classList.contains('opacity-100')) {
      const addonsControllerElement = this.element.querySelector('[data-controller="addons"]')
      if (addonsControllerElement) {
        this.application.getControllerForElementAndIdentifier(addonsControllerElement, "addons").loadAddonsFromModal()
      }
    }
  }
}