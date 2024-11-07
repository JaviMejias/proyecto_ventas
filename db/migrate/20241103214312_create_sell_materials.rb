class CreateSellMaterials < ActiveRecord::Migration[7.2]
  def change
    create_table :sell_materials do |t|
      t.integer :quantity
      t.integer :price
      t.integer :total
      t.references :sell, null: false, foreign_key: true
      t.references :menu_item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
