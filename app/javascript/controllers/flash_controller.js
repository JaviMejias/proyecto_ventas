import { Controller } from "@hotwired/stimulus"
import toastr from "toastr"

export default class extends Controller {
  connect() {
    const successMessage = this.element.dataset.success
    const errorMessage = this.element.dataset.error

    if (successMessage) {
      toastr.success(successMessage)
    }

    if (errorMessage) {
      toastr.error(errorMessage)
    }
  }
}
