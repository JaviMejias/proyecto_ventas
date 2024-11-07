import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["observed", "difference", "hidden", "totalSales"]

  connect() {
    console.log("CashCloseController conectado")
  }

  updateDifference(event) {
    const paymentType = event.target.dataset.paymentType
    const hiddenField = document.querySelector(`#cash_close_total_${paymentType}`)
    const differenceField = document.querySelector(`#difference_${paymentType}`)

    if (hiddenField && differenceField) {
      const expectedAmount = parseInt(hiddenField.dataset.expectedAmount) || 0
      const observedAmount = parseInt(event.target.value.replace(/\./g, '')) || 0

      const difference = observedAmount - expectedAmount
      differenceField.textContent = `$${difference.toLocaleString('es-CL')}`
      hiddenField.value = observedAmount

      this.updateTotalSales()
    }
  }

  updateTotalSales() {
    const totalCash = parseInt(document.querySelector("#cash_close_total_cash").value) || 0
    const totalCard = parseInt(document.querySelector("#cash_close_total_card").value) || 0
    const totalTransfer = parseInt(document.querySelector("#cash_close_total_transfer").value) || 0

    const totalSales = totalCash + totalCard + totalTransfer
    this.totalSalesTarget.value = totalSales
  }
}
