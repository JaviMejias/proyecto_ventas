import { Controller } from "@hotwired/stimulus"
import { get, post, destroy } from "@rails/request.js"
import toastr from "toastr"

export default class extends Controller {
  static targets = ["addonRows", "searchField", "table", "form"]

  connect() {
    this.searchFieldTarget.addEventListener("input", () => this.updateTable())
  }

  loadAddonsFromModal() {
    this.loadAddons()
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
      const errorData = await response.json
      const errorMessage = errorData.error || "Hubo un error al agregar."
      toastr.error(errorMessage)
    }
  }

  addRow() {
    const row = document.createElement("div")
    row.classList.add("addon-row", "mb-4", "flex", "items-center")
    row.innerHTML = `
      <input type="text" name="addon[names][]" placeholder="Nombre del Agregado" class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition duration-200 text-gray-800 mr-2" required>
      <button type="button" class="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-200 remove-addon-row" data-action="click->addons#removeRow">Eliminar</button>
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
    const response = await get(`/addons.json?page=${page}&query=${query}&limit=10`, { responseKind: "json" })

    if (response.ok) {
      const addons = await response.json
      this.renderTable(addons)
    } else {
      console.error("Error al cargar los addons:", response)
      toastr.error("Error al cargar la lista de agregados.")
    }
  }

  updateTable() {
    this.loadAddons()
  }

  renderTable(addons) {
    
    this.tableTarget.innerHTML = `
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-800">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Nombre</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          ${addons.length > 0 ? addons.map(addon => `
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${addon.name}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button type="button" class="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-200" data-action="click->addons#deleteAddon" data-addon-id="${addon.id}">
                  Eliminar
                </button>
              </td>
            </tr>
          `).join("") : `
            <tr>
              <td colspan="2" class="px-6 py-4 text-center text-gray-500">No hay agregados para mostrar.</td>
            </tr>
          `}
        </tbody>
      </table>
    `
  }

  async deleteAddon(event) {
    if (!confirm('¿Estás seguro de eliminar este agregado?')) {
      return
    }

    const addonId = event.target.getAttribute("data-addon-id")

    const response = await destroy(`/addons/${addonId}`, {
      responseKind: "json"
    })

    if (response.ok) {
      this.loadAddons()
      toastr.success("Agregado eliminado exitosamente.")
    } else {
      const errorData = await response.json
      const errorMessage = errorData.error || "El agregado se encuentra en una Venta y no puede ser eliminado."
      toastr.error(errorMessage)
    }
  }

  clearForm() {
    this.addonRowsTarget.innerHTML = `
      <div class="addon-row mb-4 flex items-center">
        <input type="text" name="addon[names][]" placeholder="Nombre del Agregado" class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition duration-200 text-gray-800 mr-2" required>
        <button type="button" class="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-200 remove-addon-row" data-action="click->addons#removeRow">Eliminar</button>
      </div>
    `
    this.searchFieldTarget.value = ''
  }
}