class PeopleController < ApplicationController
  before_action :load_person, only: [:show, :edit, :update, :destroy]

  def index
    @people = Person.all.order_by(family: :desc)
    @families = Family.all
  end

  def show
  end
  
  def new
    @person = Person.new
    @people = Person.all
    @families = Family.all
  end

  def edit
    @people = Person.where(family: @person.family)
    @families = Family.all
  end

  def create 
    @person = Person.new(person_params)
    
    if @person.save
      redirect_to people_path, notice: 'Person saved'
    else
      @people = Person.all
      @families = Family.all
      render :new
    end
  end

  def update
    if @person.update(person_params)
      redirect_to people_path
    else
      render :edit
    end
  end

  def destroy
    @person.destroy
    redirect_to people_path, notice: 'Человек удален'
  end

  private
  
  def load_person 
    @person = Person.find(params[:id])
  end

  def person_params
    params.require(:person).permit(:name, :description, :birth_date, :death_date, :family, :father, :mother, married_on: [])
  end
end
