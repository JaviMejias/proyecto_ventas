class AddLockVersionToMenuItems < ActiveRecord::Migration[7.2]
  def change
    add_column :menu_items, :lock_version, :integer, default: 0, null: false
  end
end
