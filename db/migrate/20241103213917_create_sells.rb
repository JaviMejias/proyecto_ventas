class CreateSells < ActiveRecord::Migration[7.2]
  def change
    create_table :sells do |t|
      t.integer :total
      t.integer :payment_type
      t.string  :client_name
      t.date    :document_date

      t.timestamps
    end
  end
end
