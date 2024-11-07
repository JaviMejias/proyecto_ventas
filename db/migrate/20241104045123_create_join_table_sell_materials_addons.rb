class CreateJoinTableSellMaterialsAddons < ActiveRecord::Migration[7.2]
  def change
    create_join_table :sell_materials, :addons do |t|
      t.index [ :sell_material_id, :addon_id ], unique: true
    end
  end
end
