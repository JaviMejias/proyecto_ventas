class CreateAddons < ActiveRecord::Migration[7.2]
  def change
    create_table :addons do |t|
      t.string :name

      t.timestamps
    end
  end
end
