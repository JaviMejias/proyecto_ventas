Rails.application.config.to_prepare do
  ApplicationRecord.descendants.each do |model|
    model.include Ransackable if model < ApplicationRecord
  end
end
