class Addon < ApplicationRecord
  has_many :sell_material_addons
  has_many :sell_materials, through: :sell_material_addons
  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
