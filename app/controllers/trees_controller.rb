class TreesController < ApplicationController
  def index
    @families = Family.all
  end

  def get_family
    @people = ''
    arr_people = []
    # Person.all.each do |p|
    #   arr_people << {id: p.id.to_s, name: p.name, parent: p.father}
    # end

    people = Person.where(family: params[:id])
    people.each do |p|
      arr_people << {
        id: p.id.to_s, 
        name: p.name, 
        parent: p.father, 
        mother: p.mother,
        partners: p.married_on.present? ? p.married_on : [],
        birth_date: p.birth_date,
        death_date: p.death_date,
      }
      # arr_people << {id: p.id.to_s, name: p.name, parent: p.mother}
      @people += "#{p.name} "
      children = ''
      people.where(father: p.id).or(people.where(mother: p.id)).each do |p|
        children += "#{ p.name } "
      end
      @people += "Дети: [#{ children }]"
      @people += ', ' if p != people.last
    end
    respond_to do |format|
      format.js
      format.json { render json: arr_people }
    end
  end
end