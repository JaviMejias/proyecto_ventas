import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"]

  connect() {
    this.formatPrice()
  }

  formatPrice() {
    if (this.hasInputTarget) {
      let value = this.inputTarget.value.replace(/\D/g, "")
      value = new Intl.NumberFormat("es-CL").format(value)
      this.inputTarget.value = value
    }
  }
}
