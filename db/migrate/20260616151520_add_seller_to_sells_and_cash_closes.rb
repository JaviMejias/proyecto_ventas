class AddSellerToSellsAndCashCloses < ActiveRecord::Migration[8.1]
  def change
    add_reference :sells, :seller, null: true, foreign_key: true
    add_reference :cash_closes, :seller, null: true, foreign_key: true
  end
end
