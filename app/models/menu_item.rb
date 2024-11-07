class MenuItem < ApplicationRecord
  has_one :sell_material

  include Ransackable
end
