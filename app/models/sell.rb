class Sell < ApplicationRecord
  belongs_to :cash_close, optional: true
  belongs_to :user, optional: true

  has_many :sell_materials, dependent: :destroy
  accepts_nested_attributes_for :sell_materials, allow_destroy: true

  enum :payment_type, { efectivo: 0, tarjeta: 1, transferencia: 2 }
  enum :status, { recibido: 0, en_proceso: 1, listo: 2, entregado: 3 }

  after_save_commit :broadcast_sell

  scope :open_sells, -> { where(cash_close_id: nil) }
  scope :recent, -> { order(id: :desc) }
  scope :with_details, -> { includes(sell_materials: [:menu_item, :addons]) }

  include Ransackable

  def self.translate_type(type)
    types = {
      "cash" => "Efectivo",
      "card" => "Tarjeta",
      "transfer" => "Transferencia"
    }

    types[type]
  end

  private

  def broadcast_sell
    Rails.logger.info "========= BROADCASTING SELL #{self.id} ========="
    payload = self.as_json(
      include: {
        cash_close: { only: [:id] },
        sell_materials: {
          include: { menu_item: { only: [:id, :name] }, addons: { only: [:id, :name] } }
        }
      }
    )
    ActionCable.server.broadcast("sells_channel", { sell: payload })
    Rails.logger.info "========= BROADCAST SUCCESS ========="
  rescue => e
    Rails.logger.error "========= BROADCAST ERROR: #{e.message} ========="
  end
end
