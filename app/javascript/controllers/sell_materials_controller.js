import { Controller } from "@hotwired/stimulus"

let selectedAddonsByRow = {}

export default class extends Controller {
  static targets = ["priceField", "menuItem", "addonSelect", "totalField"]

  connect() {
  }

  handleMenuItemChange(event) {
    this.setMenuItemPrice(event)
    this.toggleAddonSelect(event)
    this.updateRowItems(event)
  }

  setAddonMaxSelected(event) {
    const row = event.target.closest('tr')
    const addonSelect = row.querySelector('.slim-select-multiple')
    const maxAddons = parseInt(row.querySelector('.menu-item-select').getAttribute("data-max-addons"), 10)

    const addonSelectController = this.application.getControllerForElementAndIdentifier(
      addonSelect,
      "slim-select"
    )

    if (addonSelectController) {
      addonSelectController.setMaxSelected(maxAddons)
    }
  }

  async setMenuItemPrice(event) {
    const menuItemId = event.target.value

    if (menuItemId) {
      try {
        const response = await fetch(`/menu_items/${menuItemId}/get_menu_item_price`, {
          headers: { "Accept": "application/json" }
        })
        const data = await response.json()

        if (data) {
          const row = event.target.closest('tr')
          const priceField = row.querySelector('.price-field')
          const menuItemField = row.querySelector('.menu-item-select')

          if (priceField) {
            priceField.value = data.price
            priceField.dispatchEvent(new Event('input'))

            const priceFormatterController = this.application.getControllerForElementAndIdentifier(
              priceField,
              "price-formatter"
            )

            if (priceFormatterController) {
              priceFormatterController.formatPrice()
            }
          }

          if (menuItemField) {
            menuItemField.setAttribute("data-max-addons", data.max_addons)
          }
        }
      } catch (error) {
        console.error("Error al obtener el precio del menu item:", error)
      }
    }
  }

  toggleAddonSelect(event) {
    const row = event.target.closest('tr')
    const addonSelect = row.querySelector('.slim-select-multiple')
    const menuItemValue = event.target.value

    const addonSelectController = this.application.getControllerForElementAndIdentifier(
      addonSelect,
      "slim-select"
    )

    if (addonSelectController) {
      addonSelectController.clearSelection()

      if (menuItemValue) {
        addonSelectController.enable()
      } else {
        addonSelectController.disable()
      }
    }
  }

  updateRowItems(event) {
    const row = event.target.closest("tr")
    const quantityField = row.querySelector(".form-control.quantity")
    const priceField = row.querySelector(".price-field")
    const rowTotalField = row.querySelector(".form-control[readonly]")
    const menuItemValue = event.target.value
  
    if (quantityField && priceField) {
      if (menuItemValue) {
        quantityField.value = 1
        this.setMenuItemPrice(event)
      } else {
        quantityField.value = 0
        priceField.value = 0
        rowTotalField.value = 0
      }
    }
  
    this.calculateTotalForRow(event)
  }

  removeRow(event) {
    const rows = this.element.querySelectorAll("tr.sell-materials-row")
    
    if (rows.length > 1) {
      const row = event.target.closest("tr.sell-materials-row")
      const rowIndex = Array.from(row.parentElement.children).indexOf(row)
      delete selectedAddonsByRow[rowIndex]
      row.remove()
    }
  }

  calculateTotalForRow(event) {
    const row = event.target.closest("tr")
    const quantity = parseFloat(row.querySelector('.form-control.quantity')?.value) || 0
    const price = parseFloat(row.querySelector('.price-field')?.value.replace(/\./g, "")) || 0
    const rowTotalField = row.querySelector(".form-control[readonly]")

    const total = quantity * price
    rowTotalField.value = new Intl.NumberFormat("es-CL").format(total)
    this.updateTotalSale()
  }

  updateTotalSale() {
    const rows = this.element.querySelectorAll("tr.sell-materials-row")
    let totalSale = 0
    rows.forEach(row => {
      const rowTotal = parseFloat(row.querySelector(".form-control[readonly]").value.replace(/\./g, "")) || 0
      totalSale += rowTotal
    })
    this.totalFieldTarget.value = new Intl.NumberFormat("es-CL").format(totalSale)
  }
}
