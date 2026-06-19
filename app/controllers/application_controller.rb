class ApplicationController < ActionController::Base
  respond_to :json, :html

  protect_from_forgery with: :exception, unless: -> { request.format.json? }
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  # allow_browser versions: :modern

  def redirect_to_frontend
    redirect_to "http://localhost:5173/", allow_other_host: true
  end

  private

  def after_sign_in_path_for(resource)
    if Rails.env.development?
      "/redirect_to_frontend"
    else
      "/"
    end
  end

  def not_found
    render json: { error: "Resource not found" }, status: :not_found
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name])
  end
end
