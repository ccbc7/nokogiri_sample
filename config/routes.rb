Rails.application.routes.draw do
  root "home#index"
  post "home/aaa" => "home#aaa"
  post "/", to: "home#index"
  get 'home/show'
  get 'articles/article1', to: 'articles#article1'
  get 'articles/article2', to: 'articles#article2'
  get 'articles/article3', to: 'articles#article3'
  get 'articles/article4', to: 'articles#article4'
  resources :articles, only: [:index, :show]
end
