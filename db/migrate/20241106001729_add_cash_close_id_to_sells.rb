class AddCashCloseIdToSells < ActiveRecord::Migration[7.2]
  def change
    add_reference :sells, :cash_close, null: true, foreign_key: true
  end
end
