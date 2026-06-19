class Api::V1::AuthController < ApplicationController
  skip_before_action :authenticate_user!, only: [:csrf_token]

  def csrf_token
    render json: { csrf_token: form_authenticity_token }
  end

  def me
    if user_signed_in?
      render json: current_user.as_json(only: [:id, :email, :first_name, :last_name])
    else
      render json: { error: 'Not authenticated' }, status: :unauthorized
    end
  end
end
