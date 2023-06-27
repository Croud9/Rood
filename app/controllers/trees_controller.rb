class TreesController < ApplicationController
  def index
    @families = Family.all
  end

  def get_family
    @people = ''
    people = Person.where(family: params[:id])
    people.each do |p|
      @people += "#{p.name} "
      children = ''
      people.where(father: p.id).and(people.where(mother: p.id)).each do |p|
        children += "#{ p.name } "
      end
      @people += "Дети: [#{ children }]"
      @people += ', ' if p != people.last
    end
    respond_to do |format|
      format.js
    end
  end
end
