Rails.application.routes.draw do
  devise_for :users
  root "trees#index"
  get 'get_family', to: 'trees#get_family'
  resources :people, :families, :trees
end
