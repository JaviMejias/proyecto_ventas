require "test_helper"

class CashClosesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @cash_close = cash_closes(:one)
    sign_in users(:archer)
  end

  test "should get index" do
    get cash_closes_url
    assert_response :success
  end

  test "should get new" do
    get new_cash_close_url
    assert_response :success
  end

  test "should create cash_close" do
    assert_difference("CashClose.count") do
      post cash_closes_url, params: { cash_close: { date: @cash_close.date, total_card: @cash_close.total_card, total_cash: @cash_close.total_cash, total_sales: @cash_close.total_sales, total_transfer: @cash_close.total_transfer } }
    end

    assert_redirected_to cash_closes_url
  end

  test "should show cash_close" do
    get cash_close_url(@cash_close)
    assert_response :success
  end

  test "should destroy cash_close" do
    assert_difference("CashClose.count", -1) do
      delete cash_close_url(@cash_close)
    end

    assert_redirected_to cash_closes_url
  end
end