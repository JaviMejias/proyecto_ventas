class ReplaceSellerWithUserInSellsAndCashCloses < ActiveRecord::Migration[8.1]
  def change
    remove_reference :sells, :seller, foreign_key: true
    add_reference :sells, :user, foreign_key: true

    remove_reference :cash_closes, :seller, foreign_key: true
    add_reference :cash_closes, :user, foreign_key: true
  end
end
