# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_16_204533) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "addons", force: :cascade do |t|
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "addons_sell_materials", id: false, force: :cascade do |t|
    t.bigint "addon_id", null: false
    t.bigint "sell_material_id", null: false
    t.index ["sell_material_id", "addon_id"], name: "index_addons_sell_materials_on_sell_material_id_and_addon_id", unique: true
  end

  create_table "cash_closes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date"
    t.integer "total_card"
    t.integer "total_cash"
    t.integer "total_sales"
    t.integer "total_transfer"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_cash_closes_on_user_id"
  end

  create_table "menu_items", force: :cascade do |t|
    t.boolean "active", default: true
    t.integer "addon_quantity", default: 0
    t.datetime "created_at", null: false
    t.integer "lock_version", default: 0, null: false
    t.string "name"
    t.integer "price"
    t.datetime "updated_at", null: false
  end

  create_table "sell_material_addons", force: :cascade do |t|
    t.bigint "addon_id", null: false
    t.datetime "created_at", null: false
    t.bigint "sell_material_id", null: false
    t.datetime "updated_at", null: false
    t.index ["addon_id"], name: "index_sell_material_addons_on_addon_id"
    t.index ["sell_material_id"], name: "index_sell_material_addons_on_sell_material_id"
  end

  create_table "sell_materials", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "menu_item_id", null: false
    t.integer "price"
    t.integer "quantity"
    t.bigint "sell_id", null: false
    t.integer "total"
    t.datetime "updated_at", null: false
    t.index ["menu_item_id"], name: "index_sell_materials_on_menu_item_id"
    t.index ["sell_id"], name: "index_sell_materials_on_sell_id"
  end

  create_table "sells", force: :cascade do |t|
    t.bigint "cash_close_id"
    t.string "client_name"
    t.datetime "created_at", null: false
    t.date "document_date"
    t.integer "payment_type"
    t.integer "status", default: 0
    t.integer "total"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["cash_close_id"], name: "index_sells_on_cash_close_id"
    t.index ["user_id"], name: "index_sells_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "first_name"
    t.string "last_name"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "cash_closes", "users"
  add_foreign_key "sell_material_addons", "addons"
  add_foreign_key "sell_material_addons", "sell_materials"
  add_foreign_key "sell_materials", "menu_items"
  add_foreign_key "sell_materials", "sells"
  add_foreign_key "sells", "cash_closes"
  add_foreign_key "sells", "users"
end
