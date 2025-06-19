require "application_system_test_case"

class MenuItemsTest < ApplicationSystemTestCase
  setup do
    @menu_item = menu_items(:pollo)
    @menu_item_to_destroy = menu_items(:item_para_eliminar)
    sign_in users(:archer)
  end

  test "visiting the index" do
    visit menu_items_url
    assert_selector "h1", text: "Carta"
    assert_text "Pollo"
  end

  test "should create menu item" do
    visit menu_items_url
    click_on "Agregar elemento al Menú" # Correcto

    # Asegúrate de que los labels "Nombre" y "Precio" sean exactos o usa los IDs/names.
    # Si el label es "Name" o "Price" o el ID es "menu_item_name", etc.
    fill_in "Nombre", with: "Nuevo Plato Test"
    fill_in "Precio", with: 9999

    # ¡CORREGIR ESTO! Casi seguro es "Guardar"
    click_on "Guardar" # <<--- Cambiar "Crear Menu item" por el texto exacto

    assert_text "Agregado al menú correctamente." # Confirma este mensaje de éxito
  end

  test "should update Menu item" do
    visit menu_items_url
    click_on @menu_item.name # Clickea en el nombre del ítem para editarlo

    # Asegúrate de que "Nombre" y "Precio" sean los labels exactos o usa sus IDs/Names
    fill_in "Nombre", with: "#{@menu_item.name} Actualizado"
    fill_in "Precio", with: @menu_item.price + 1000

    # ¡AJUSTA ESTE TEXTO! Podría ser "Guardar", "Actualizar", "Actualizar Elemento", etc.
    click_on "Guardar" # o el texto exacto del botón de actualización

    assert_text "Elemento actualizado correctamente." # Este ya lo corregimos
  end

  test "should destroy Menu item" do
    visit menu_items_url
    within("tr", text: @menu_item_to_destroy.name) do
      click_on "Eliminar"
    end
    accept_confirm # Esto ya está para manejar la alerta

    # ¡CORREGIDO! Usar el mensaje de éxito real de tu aplicación
    assert_text "Elemento eliminado correctamente."
    assert_no_text @menu_item_to_destroy.name
  end
end
