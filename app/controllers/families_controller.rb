class FamiliesController < ApplicationController
  def index
    @families = Family.all
  end
  
  def new 
    @family = Family.new
  end

  def create
    @family = Family.new(family_params)

    if @family.save
      redirect_to families_path, notice: 'Семья сохранена'
    else
      render :new
    end
  end

  private

  def family_params
    params.require(:family).permit(:surname)
  end

end
