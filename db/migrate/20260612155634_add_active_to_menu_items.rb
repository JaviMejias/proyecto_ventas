class AddActiveToMenuItems < ActiveRecord::Migration[8.1]
  def change
    add_column :menu_items, :active, :boolean, default: true
  end
end
