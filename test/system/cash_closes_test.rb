require "application_system_test_case"

class CashClosesTest < ApplicationSystemTestCase
   setup do
    @cash_close = cash_closes(:one)
    sign_in users(:archer)
  end

  test "visiting the index" do
    visit cash_closes_url
    assert_selector "h1", text: "Cash closes"
  end

  test "should create cash close" do
    visit cash_closes_url
    click_on "New cash close"

    fill_in "Date", with: @cash_close.date
    fill_in "Total card", with: @cash_close.total_card
    fill_in "Total cash", with: @cash_close.total_cash
    fill_in "Total sales", with: @cash_close.total_sales
    fill_in "Total transfer", with: @cash_close.total_transfer
    click_on "Create Cash close"

    assert_text "Cash close was successfully created"
    click_on "Back"
  end

  test "should update Cash close" do
    visit cash_close_url(@cash_close)
    click_on "Edit this cash close", match: :first

    fill_in "Date", with: @cash_close.date
    fill_in "Total card", with: @cash_close.total_card
    fill_in "Total cash", with: @cash_close.total_cash
    fill_in "Total sales", with: @cash_close.total_sales
    fill_in "Total transfer", with: @cash_close.total_transfer
    click_on "Update Cash close"

    assert_text "Cash close was successfully updated"
    click_on "Back"
  end

  test "should destroy Cash close" do
    visit cash_close_url(@cash_close)
    click_on "Destroy this cash close", match: :first

    assert_text "Cash close was successfully destroyed"
  end
end
