class AddStatusToSells < ActiveRecord::Migration[8.1]
  def change
    add_column :sells, :status, :integer, default: 0
  end
end
