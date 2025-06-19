import { Controller } from "@hotwired/stimulus"
import SlimSelect from "slim-select"
import toastr from "toastr"

export default class extends Controller {
  connect() {
    const isMultiple = this.element.classList.contains("slim-select-multiple")

    this.slimSelect = new SlimSelect({
      select: this.element,
      settings: {
        contentPosition: 'absolute',
        openPosition: 'auto',
        placeholderText: 'Seleccione',
        searchPlaceholder: 'Buscar',
        closeOnSelect: !isMultiple,
      }
    })

    if (isMultiple) {
      this.slimSelect.disable()
    }

    this.element.addEventListener('change', this.handleChange.bind(this))
  }

  handleChange() {
    const selectedOptions = Array.from(this.element.selectedOptions).map(option => option.value)
    if (this.maxSelected && selectedOptions.length > this.maxSelected) {
      toastr.warning(`Solo puedes seleccionar un máximo de ${this.maxSelected} agregados.`)

      this.setSelection(this.previousSelection || [])
    } else {
      this.previousSelection = selectedOptions
    }
  }

  setMaxSelected(max) {
    this.maxSelected = max
  }

  setSelection(data) {
    if (this.slimSelect) {
      this.slimSelect.setSelected(data)
    }
  }

  disconnect() {
    if (this.slimSelect) {
      this.slimSelect.destroy()
    }
  }

  enable() {
    this.slimSelect.enable()
  }

  disable() {
    this.slimSelect.disable()
  }

  clearSelection() {
    if (this.slimSelect) {
      this.slimSelect.setSelected([])
    }
  }
}
