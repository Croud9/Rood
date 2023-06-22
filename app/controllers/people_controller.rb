class PeopleController < ApplicationController
  before_action :load_person, only: [:show, :edit, :update, :destroy]

  def index
    @people = Person.all
  end

  def show
  end
  
  def new
    @person = Person.new
  end

  def edit
  end

  def create 
    @person = Person.new(person_params)
    
    if @person.save
      redirect_to @person
    else
      render :new
    end
  end

  def update
    if @person.update(person_params)
      redirect_to @person
    else
      render :edit
    end
  end

  def destroy
    @person.destroy
    redirect_to people_path
  end

  private
  
  def load_person 
    @person = Person.find(params[:id])
  end

  def person_params
    params.require(:person).permit(:name, :description)
  end
end
