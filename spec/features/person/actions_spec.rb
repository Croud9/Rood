require 'rails_helper'

feature 'User can create person' do 
  
  background {
    Family.create(surname: 'Мелиховы', people_ids: [])
    Family.create(surname: 'Ивановы', people_ids: [])
    Person.create(name: 'Иван', description: 'auauaua')
    Person.create(name: 'Иванесса', description: 'auauaua')
    Person.create(name: 'Роман', description: 'auauaua')
    Person.create(name: 'Романеса', description: 'auauaua')

    visit new_person_path
  }

  scenario 'without attributes' do
    click_on 'Save'
    
    expect(page).to have_content "Name can't be blank"
  end

  scenario 'without parents' do
    fill_in "Name",	with: 'Иванов Иван Иванович'
    fill_in "Description", with: 'Родился и вырос там то там'
    fill_in "Years",	with: '1900 - 2000'
    select 'Мелиховы', from: 'Family'

    click_on 'Save'
    
    expect(page).to have_content 'Person saved'
  end

  scenario 'with parents' do 
    fill_in "Name",	with: 'Иванов Иван Иванович'
    fill_in "Description", with: 'Родился и вырос там то там'
    fill_in "Years",	with: '1900 - 2000'
    select 'Мелиховы', from: 'Family'
    select 'Иван', from: 'Parents'
    select 'Романеса', from: 'Parents'
    
    click_on 'Save'
    
    expect(page).to have_content 'Person saved'
  end
end

feature 'User can' do 
  scenario 'delete person'
  scenario 'update person'
end