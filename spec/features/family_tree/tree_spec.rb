require 'rails_helper'

feature 'User can' do
  scenario 'click links show people or family and go back' do
    visit trees_path
    click_on 'Люди'
    expect(page).to have_content 'Люди'
    click_on 'Назад'

    click_on 'Семьи'
    expect(page).to have_content 'Семьи'
    click_on 'Назад'
  end

  scenario 'select family and see family tree' do
    Family.create(surname: 'Коряевы') 
    visit trees_path
    select 'Коряевы', from: 'Family'
    
  end
end