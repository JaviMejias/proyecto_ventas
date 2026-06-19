Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :menu_items, only: [:index, :create, :update, :destroy]
      resources :sells, only: [:index, :create, :show, :update] do
        collection do
          get :export_excel
        end
      end
      resources :cash_closes, only: [:index, :create, :show] do
        collection do
          get :preview
          get :export_excel
        end
      end
      resources :addons, only: [:index, :create, :update, :destroy]
      resources :sellers, only: [:index, :create, :update, :destroy]
      
      get 'auth/csrf_token', to: 'auth#csrf_token'
      get 'auth/me', to: 'auth#me'
    end
  end

  devise_for :users

  # React takes over the root view
  # authenticated :user do
  #   root to: "menu_items#index", as: :authenticated_root
  # end

  devise_scope :user do
    unauthenticated do
      root to: "devise/sessions#new", as: :unauthenticated_root
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
  get "redirect_to_frontend", to: "application#redirect_to_frontend"
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
end
