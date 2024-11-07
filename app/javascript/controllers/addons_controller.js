import { Controller } from "@hotwired/stimulus"
import { get, post, destroy } from "@rails/request.js"
import toastr from "toastr"

export default class extends Controller {
  static targets = ["addonRows", "searchField", "table", "form"]

  connect() {
    const modal = document.getElementById("addonsModal")
    modal.addEventListener("shown.bs.modal", () => this.onModalShown())
  }

  onModalShown() {
    this.loadAddons()
    this.searchFieldTarget.addEventListener("input", () => this.updateTable())
  }

  async submitForm(event) {
    event.preventDefault()

    const formData = new FormData(this.formTarget)
    const response = await post("/addons", {
      body: formData,
      responseKind: "json"
    })

    if (response.ok) {
      this.clearForm()
      this.loadAddons()
      toastr.success("Agregado exitosamente!")
    } else {
      toastr.error("Hubo un error al agregar.")
    }
  }

  addRow() {
    const row = document.createElement("div")
    row.classList.add("addon-row", "mb-3", "d-flex", "align-items-center")
    row.innerHTML = `
      <input type="text" name="addon[names][]" placeholder="Nombre del Agregado" class="form-control me-2 addon-name-field" required>
      <button type="button" class="btn btn-danger btn-sm remove-addon-row" data-action="click->addons#removeRow">Eliminar</button>
    `
    this.addonRowsTarget.appendChild(row)
  }

  removeRow(event) {
    if (this.addonRowsTarget.children.length > 1) {
      event.target.closest(".addon-row").remove()
    } else {
      toastr.error("Debe haber al menos un agregado.")
    }
  }

  async loadAddons(page = 1) {
    const query = this.searchFieldTarget.value
    const response = await get(`/addons.json?page=${page}&query=${query}`, { responseKind: "json" })

    if (response.ok) {
      const addons = await response.json
      this.renderTable(addons)
    } else {
      console.error("Error al cargar los addons:", response)
    }
  }

  updateTable() {
    this.loadAddons()
  }

  renderTable(addons) {
    this.tableTarget.innerHTML = `
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${addons.map(addon => `
            <tr>
              <td>${addon.name}</td>
              <td>
                <button type="button" class="btn btn-danger btn-sm" data-action="click->addons#deleteAddon" data-addon-id="${addon.id}">
                  Eliminar
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `
  }

  async deleteAddon(event) {
    const addonId = event.target.getAttribute("data-addon-id")

    const response = await destroy(`/addons/${addonId}`, {
      responseKind: "json"
    })

    if (response.ok) {
      this.loadAddons()
      toastr.success("Agregado eliminado exitosamente.")
    } else {
      toastr.error("El agregado se encuentra en una Venta.")
    }
  }

  clearForm() {
    this.addonRowsTarget.innerHTML = `
      <div class="addon-row mb-3 d-flex align-items-center">
        <input type="text" name="addon[names][]" placeholder="Nombre del Agregado" class="form-control me-2 addon-name-field" required>
        <button type="button" class="btn btn-danger btn-sm remove-addon-row" data-action="click->addons#removeRow">Eliminar</button>
      </div>
    `
  }
}
