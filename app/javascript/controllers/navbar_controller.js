import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]

  connect() {
  }

  toggleMenu() {

    if (this.menuTarget.classList.contains('max-h-screen')) {
      this.closeMenu()
    } else {
      this.openMenu()
    }
  }

  openMenu() {
    this.menuTarget.classList.remove('max-h-0', 'opacity-0')
    this.menuTarget.classList.add('max-h-screen', 'opacity-100')
  }

  closeMenu() {
    this.menuTarget.classList.remove('max-h-screen', 'opacity-100')
    this.menuTarget.classList.add('max-h-0', 'opacity-0')
  }
}