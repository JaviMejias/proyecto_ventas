class CashClose < ApplicationRecord
  has_many :sells

  validate :verify_related_sells

  include Ransackable

  def calculate_totals(grouped_sells)
    {
      total_sales: grouped_sells.values.flatten.sum(&:total),
      total_cash: grouped_sells["efectivo"]&.sum(&:total) || 0,
      total_card: grouped_sells["tarjeta"]&.sum(&:total) || 0,
      total_transfer: grouped_sells["transferencia"]&.sum(&:total) || 0
    }
  end

  def calculate_differences
    grouped_sells = sells.group_by(&:payment_type)
    expected_totals = calculate_totals(grouped_sells)

    differences = {}
    differences["cash"] = total_cash.to_i - expected_totals[:total_cash]
    differences["card"] = total_card.to_i - expected_totals[:total_card]
    differences["transfer"] = total_transfer.to_i - expected_totals[:total_transfer]

    differences
  end

  private

  def verify_related_sells
    errors.add(Error: 'No se puede guardar una venta vacía.') if sells.empty?
  end
end
