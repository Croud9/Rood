require 'rails_helper'

feature 'User can create family' do 
  given(:family) { Family.create(surname: 'Коряевы') }

  background { visit new_family_path }

  scenario 'with surname' do
    fill_in "Surname",	with: 'Коряевы'
    click_on 'Сохранить'
    
    expect(page).to have_content 'Семья сохранена'
  end

  scenario 'without surname' do 
    click_on 'Сохранить'
    
    expect(page).to have_content "Surname can't be blank"
  end

  scenario 'surname alredy exist' do 
    fill_in "Surname", with: family.surname

    click_on 'Сохранить'
    
    expect(page).to have_content 'Surname has already been taken'
  end
end

feature 'User can' do 
  scenario 'delete family'
  scenario 'update family'
end