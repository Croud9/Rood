class TreesController < ApplicationController
  def index
    @families = Family.all
  end

  def get_family
    @people = Person.where(family: params[:id])  # params[:id]
    respond_to do |format|
      format.js
    end
  end
end
