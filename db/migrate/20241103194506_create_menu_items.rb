class CreateMenuItems < ActiveRecord::Migration[7.2]
  def change
    create_table :menu_items do |t|
      t.string :name
      t.integer :price
      t.integer :addon_quantity, default: 0

      t.timestamps
    end
  end
end
