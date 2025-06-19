require "test_helper"

class SellsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sell = sells(:sell_one)
    @menu_item = menu_items(:pizza)
    sign_in users(:archer)
  end

  test "should get index" do
    get sells_url
    assert_response :success
  end

  test "should get new" do
    get new_sell_url
    assert_response :success
  end

  test "should create sell" do
    assert_difference("Sell.count") do
      post sells_url, params: { sell: {
        client_name: @sell.client_name,
        document_date: @sell.document_date,
        payment_type: @sell.payment_type,
        total: @sell.total,
        sell_materials_attributes: [
          { quantity: 1, price: 10.0, total: 10.0, menu_item_id: @menu_item.id }
        ]
      } }
    end

    assert_redirected_to new_sell_url
  end

  test "should show sell" do
    get sell_url(@sell)
    assert_response :success
  end
end