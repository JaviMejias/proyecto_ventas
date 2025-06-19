# test/application_system_test_case.rb
require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  # Configura las opciones para Headless Chrome
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument("--no-sandbox")
  options.add_argument("--disable-dev-shm-usage")
  options.add_argument("--headless=new") # Para versiones recientes de Chrome

  # ¡Esta es la línea crucial! Le dice a Selenium dónde encontrar el binario del navegador.
  options.binary = "/usr/bin/chromium-browser" # <-- Usamos la ruta que confirmaste

  # Registra el driver de Capybara.
  # Capybara/Selenium ahora sabe dónde está el chromedriver (en tu PATH)
  # y dónde está el navegador (gracias a options.binary).
  Capybara.register_driver :headless_chrome do |app|
    Capybara::Selenium::Driver.new(
      app,
      browser: :chrome,
      options: options
    )
  end

  # Usa el driver que acabamos de registrar
  driven_by :headless_chrome, screen_size: [ 1400, 1400 ]
end
