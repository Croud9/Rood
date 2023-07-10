class TreesController < ApplicationController
  def index
    @families = Family.all
  end

  def get_family
    arr_people = []
    @people = Person.where(family: params[:id])
    @people.each do |p|
      arr_people << {
        id: p.id.to_s, 
        name: p.name, 
        parent: p.father, 
        mother: p.mother,
        partners: p.married_on.present? ? p.married_on : [],
        birth_date: p.birth_date,
        death_date: p.death_date,
      }
    end
    respond_to do |format|
      format.js
      format.html { render turbo_stream: turbo_stream.replace(
        "table_of_people", 
        partial: "people/table", 
        locals: { resource: params[:id] == '' ? Person.all : @people }
      ) }
      format.json { render json: arr_people }
    end
  end
end