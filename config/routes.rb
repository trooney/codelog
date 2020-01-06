Rails.application.routes.draw do


  devise_for :users,
             path: '',
             path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'join' },
             controllers: { registrations: 'registrations', sessions: 'sessions', confirmations: 'confirmations' }

  get '/login/redirect' => 'home#login_redirect', as: :user_root # creates user_root_path

  root to: "home#index"
  get '/terms' => 'home#terms'
  get '/privacy' => 'home#privacy'

  namespace :api do
    resources :buckets do
      scope module: :buckets do
        resources :notes, only: [:index, :create, :update, :show] do
          member do
            get :trash
            get :untrash
          end
        end
        resources :tags, only: [:index, :create, :destroy]
        resources :stars, only: [:create, :destroy]
        resources :search, controller: :search, only: :index
      end
    end
  end

  authenticate :user do
    namespace :web do
      resources :buckets, only: [] do
        scope module: :buckets do
          get :index, to: 'app#index', path: ''
          resource :settings, only: [:show, :update]
        end
      end
      namespace :user do
        resource :settings, only: [:show, :update]
      end
    end
  end

end
