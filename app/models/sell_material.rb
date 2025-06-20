class SellMaterial < ApplicationRecord
  belongs_to :sell
  belongs_to :menu_item
  has_many :sell_material_addons, dependent: :destroy
  has_many :addons, through: :sell_material_addons

  accepts_nested_attributes_for :sell_material_addons, allow_destroy: true

  validates :menu_item, presence: true
  validates :quantity, presence: true, numericality: { greater_than: 0 }
end
