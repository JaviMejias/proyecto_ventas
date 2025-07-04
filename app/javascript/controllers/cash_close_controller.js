import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "observedInput",
    "totalSales",
    "submitTotalCash",
    "submitTotalCard",
    "submitTotalTransfer"
  ]

  get expectedCashTarget() { return this.targets.find('expectedCash') }
  get expectedCardTarget() { return this.targets.find('expectedCard') }
  get expectedTransferTarget() { return this.targets.find('expectedTransfer') }
  get differenceCashTarget() { return this.targets.find('differenceCash') }
  get differenceCardTarget() { return this.targets.find('differenceCard') }
  get differenceTransferTarget() { return this.targets.find('differenceTransfer') }


  connect() {
    this.updateAllDifferences()
    this.updateTotalSales()
  }

  updateAllDifferences() {
    this.observedInputTargets.forEach(input => {
      this._updateSingleDifference(input)
    })
  }


  updateDifference(event) {
    this._updateSingleDifference(event.target)
    this.updateTotalSales()
  }

  _updateSingleDifference(inputElement) {
    const paymentType = inputElement.dataset.paymentType
    const observedAmount = parseInt(inputElement.value.replace(/\./g, '')) || 0

    let expectedAmount
    let differenceField
    let submitHiddenField

    switch (paymentType) {
      case 'cash':
        expectedAmount = parseInt(this.expectedCashTarget.dataset.expectedAmount) || 0
        differenceField = this.differenceCashTarget
        submitHiddenField = this.submitTotalCashTarget
        break
      case 'card':
        expectedAmount = parseInt(this.expectedCardTarget.dataset.expectedAmount) || 0
        differenceField = this.differenceCardTarget
        submitHiddenField = this.submitTotalCardTarget
        break
      case 'transfer':
        expectedAmount = parseInt(this.expectedTransferTarget.dataset.expectedAmount) || 0
        differenceField = this.differenceTransferTarget
        submitHiddenField = this.submitTotalTransferTarget
        break
      default:
        return
    }

    const difference = observedAmount - expectedAmount

    differenceField.textContent = `$${difference.toLocaleString('es-CL', { minimumFractionDigits: 0 })}`

    if (difference < 0) {
      differenceField.classList.add('text-red-400')
      differenceField.classList.remove('text-green-400', 'text-gray-300')
    } else if (difference > 0) {
      differenceField.classList.add('text-green-400')
      differenceField.classList.remove('text-red-400', 'text-gray-300')
    } else {
      differenceField.classList.add('text-gray-300')
      differenceField.classList.remove('text-red-400', 'text-green-400')
    }

    if (submitHiddenField) {
      submitHiddenField.value = observedAmount
    }
  }

  updateTotalSales() {
    const totalCash = parseInt(this.submitTotalCashTarget.value) || 0
    const totalCard = parseInt(this.submitTotalCardTarget.value) || 0
    const totalTransfer = parseInt(this.submitTotalTransferTarget.value) || 0
    const totalSales = totalCash + totalCard + totalTransfer

    this.totalSalesTarget.value = totalSales
  }
}