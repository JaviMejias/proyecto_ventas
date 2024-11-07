class CreateCashCloses < ActiveRecord::Migration[7.2]
  def change
    create_table :cash_closes do |t|
      t.date :date
      t.integer :total_sales
      t.integer :total_cash
      t.integer :total_card
      t.integer :total_transfer

      t.timestamps
    end
  end
end
