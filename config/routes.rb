Rails.application.routes.draw do
  devise_for :users
  root "trees#index"
  
  resources :people, :families, :trees
end
