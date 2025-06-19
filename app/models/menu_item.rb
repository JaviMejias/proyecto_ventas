class MenuItem < ApplicationRecord
  has_one :sell_material, dependent: :destroy

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  include Ransackable
end
