require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  Webdrivers::Chromedriver.required_version = '137.0.7151.119'

  driven_by :selenium, using: :headless_chrome, screen_size: [ 1400, 1400 ]
end