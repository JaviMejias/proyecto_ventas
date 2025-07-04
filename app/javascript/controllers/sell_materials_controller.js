import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "menuItem",
    "addonSelect",
    "quantityField",
    "priceField",
    "rowTotalField",
    "totalField"
  ]

  connect() {
    this.updateTotalSale()
  }

  async handleMenuItemChange(event) {
    const row = event.target.closest('tr')
    const menuItemId = this.getMenuItemSelect(row)?.value
    const quantityField = this.getQuantityField(row)

    if (menuItemId) {
      await this.setMenuItemPriceAndMaxAddons(row, menuItemId)
      this.toggleAddonSelect(row, menuItemId)
      if (quantityField) {
        quantityField.value = 1
        quantityField.dispatchEvent(new Event('input', { bubbles: true }))
      }
    } else {
      this.resetRowFields(row)
      this.toggleAddonSelect(row, menuItemId)
    }
  }

  setAddonMaxSelected(event) {
    const row = event.target.closest('tr')
    const addonSelectElement = this.getAddonSelect(row)
    const menuItemSelectElement = this.getMenuItemSelect(row)

    if (!addonSelectElement || !menuItemSelectElement) return

    const maxAddons = parseInt(menuItemSelectElement.getAttribute("data-max-addons"), 10)

    const addonSelectController = this.application.getControllerForElementAndIdentifier(
      addonSelectElement,
      "slim-select"
    )

    if (addonSelectController) {
      addonSelectController.setMaxSelected(maxAddons)
    }
  }

  async setMenuItemPriceAndMaxAddons(row, menuItemId) {
    const priceField = this.getPriceField(row)
    const menuItemField = this.getMenuItemSelect(row)

    if (!menuItemId || !priceField || !menuItemField) return

    try {
      const response = await fetch(`/menu_items/${menuItemId}/get_menu_item_price`, {
        headers: { "Accept": "application/json" }
      });
      const data = await response.json()

      if (data) {
        priceField.value = data.price
        priceField.dispatchEvent(new Event('input', { bubbles: true }))

        menuItemField.setAttribute("data-max-addons", data.max_addons)
      }
    } catch (error) {
      console.error("Error al obtener el precio y max_addons del menu item:", error)
    }
  }

  toggleAddonSelect(row, menuItemId) {
    const addonSelectElement = this.getAddonSelect(row)

    if (!addonSelectElement) return

    const addonSelectController = this.application.getControllerForElementAndIdentifier(
      addonSelectElement,
      "slim-select"
    )

    if (addonSelectController) {
      addonSelectController.clearSelection()
      if (menuItemId) {
        addonSelectController.enable()
      } else {
        addonSelectController.disable()
      }
    }
  }

  resetRowFields(row) {
    const quantityField = this.getQuantityField(row)
    const priceField = this.getPriceField(row)
    const rowTotalField = this.getRowTotalField(row)

    if (quantityField) quantityField.value = 0
    if (priceField) {
      priceField.value = 0
      priceField.dispatchEvent(new Event('input', { bubbles: true }))
    }
    if (rowTotalField) rowTotalField.value = 0

    this.updateTotalSale()
  }

  removeRow(event) {
    const row = event.target.closest(".nested-form-wrapper")
    if (row) {
      const destroyField = row.querySelector("input[name$='[_destroy]']")
      if (destroyField) {
        destroyField.value = "1"
        row.style.display = "none"
        this.updateTotalSale()
      }
    }
  }

  calculateTotalForRow(event) {
    const row = event.target.closest("tr")
    const quantity = parseFloat(this.getQuantityField(row)?.value) || 0
    const price = parseFloat(this.getPriceField(row)?.value.replace(/\./g, "").replace(/,/g, ".")) || 0

    const total = quantity * price
    const rowTotalField = this.getRowTotalField(row)

    if (rowTotalField) {
      rowTotalField.value = new Intl.NumberFormat("es-CL").format(total)
    }
    this.updateTotalSale()
  }

  updateTotalSale() {
    let totalSale = 0
    this.rowTotalFieldTargets.forEach(rowTotalField => {
      const row = rowTotalField.closest(".nested-form-wrapper")
      const destroyField = row?.querySelector("input[name$='[_destroy]']")

      if (!destroyField || destroyField.value !== "1") {
        const rowTotal = parseFloat(rowTotalField.value.replace(/\./g, "").replace(/,/g, ".")) || 0
        totalSale += rowTotal
      }
    })

    if (this.hasTotalFieldTarget) {
      this.totalFieldTarget.value = new Intl.NumberFormat("es-CL").format(totalSale)
    }
  }

  getMenuItemSelect(row) {
    return row.querySelector('[data-sell-materials-target="menuItem"]') || null;
  }

  getAddonSelect(row) {
    return row.querySelector('[data-sell-materials-target="addonSelect"]') || null;
  }

  getQuantityField(row) {
    return row.querySelector('[data-sell-materials-target="quantityField"]') || null;
  }

  getPriceField(row) {
    return row.querySelector('[data-sell-materials-target="priceField"]') || null;
  }

  getRowTotalField(row) {
    return row.querySelector('[data-sell-materials-target="rowTotalField"]') || null;
  }
}