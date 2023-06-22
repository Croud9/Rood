require 'rails_helper'

feature 'User can create person', %q{
  In order to add people with attributes
  } do 

  scenario 'User create person' do
    visit new_person_path
    fill_in "Name",	with: 'Иванов Иван Иванович'
    fill_in "Description",	with: 'Родился и вырос там то там'
    click_on 'Save'
    
    expect(page).to have_content 'Person saved'
  end

  scenario 'User delete person'
  scenario 'User update person'
end