module Ransackable
  extend ActiveSupport::Concern

  included do
    def self.ransackable_attributes(auth_object = nil)
      column_names - [ "encrypted_password", "password_reset_token" ]
    end
  end
end
