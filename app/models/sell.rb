class Sell < ApplicationRecord
  belongs_to :cash_close, optional: true

  has_many :sell_materials, dependent: :destroy
  accepts_nested_attributes_for :sell_materials, allow_destroy: true

  enum payment_type: { efectivo: 0, tarjeta: 1, transferencia: 2 }

  scope :open_sells, -> { where(cash_close_id: nil) }

  include Ransackable

  def self.translate_type(type)
    types = {
      "cash" => "Efectivo",
      "card" => "Tarjeta",
      "transfer" => "Transferencia"
    }

    types[type]
  end
end
