class DropSellers < ActiveRecord::Migration[8.1]
  def change
    drop_table :sellers do |t|
      t.string :name
      t.boolean :active
      t.timestamps
    end
  end
end
