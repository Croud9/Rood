class FamiliesController < ApplicationController
  before_action :set_family, only: [:edit, :update]
  
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

  def edit
  end

  def update
    if @family.update(family_params)
      redirect_to families_path
    else
      render :edit
    end
  end

  private

  def family_params
    params.require(:family).permit(:surname)
  end

  def set_family
    @family = Family.find(params[:id])
  end
end
