require "application_system_test_case"

class SellsTest < ApplicationSystemTestCase
  setup do
    @sell = sells(:sell_one)
    @menu_item = menu_items(:pollo)
    sign_in users(:archer)
  end
end