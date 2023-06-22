Rails.application.routes.draw do
  devise_for :users
  root "people#index"
  
  resources :people
end
