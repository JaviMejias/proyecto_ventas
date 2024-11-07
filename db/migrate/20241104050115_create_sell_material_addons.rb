class CreateSellMaterialAddons < ActiveRecord::Migration[7.2]
  def change
    create_table :sell_material_addons do |t|
      t.references :sell_material, null: false, foreign_key: true
      t.references :addon, null: false, foreign_key: true

      t.timestamps
    end
  end
end
