Rails.application.routes.draw do
  resources :cash_closes, except: [ :edit, :update ]
  resources :addons, only: [ :create, :index, :destroy ]
  resources :sells, except: %i[edit destroy]
  resources :menu_items, except: %i[show] do
    member do
      get :get_menu_item_price
    end
  end
  devise_for :users

  authenticated :user do
    root to: "menu_items#index", as: :authenticated_root
  end

  devise_scope :user do
    unauthenticated do
      root to: "devise/sessions#new", as: :unauthenticated_root
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
end
