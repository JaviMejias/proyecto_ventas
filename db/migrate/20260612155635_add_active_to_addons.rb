class AddActiveToAddons < ActiveRecord::Migration[8.1]
  def change
    add_column :addons, :active, :boolean, default: true
  end
end
