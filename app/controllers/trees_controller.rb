class TreesController < ApplicationController
  def index
    @families = Family.all
  end
end
