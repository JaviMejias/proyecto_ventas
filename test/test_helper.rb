ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "bcrypt"

class ActiveSupport::TestCase
  parallelize(workers: :number_of_processors)

  fixtures :all

  include Devise::Test::IntegrationHelpers
end
