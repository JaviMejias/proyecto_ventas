require "application_system_test_case"

class CashClosesTest < ApplicationSystemTestCase
  setup do
    @cash_close = cash_closes(:one)
    sign_in users(:archer)
  end

  test "visiting the index" do
    visit cash_closes_url
    assert_selector "h1", text: "Cierres de Caja"
  end

  test "should create cash close" do
    visit cash_closes_url
    click_on "Nuevo Cierre de Caja"

    # ¡CORREGIDO! Usamos el ID exacto "observed_cash"
    fill_in "observed_cash", with: 10000

    click_on "Crear Cierre de Caja" # Confirma que este es el texto del botón final

    assert_text "Cierre de caja creado exitosamente."
  end
end
