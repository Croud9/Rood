require 'rails_helper'

feature 'User can sign in', %q{
  In order to add people
  As an authentificated user
  I'd like ot be able to sign in
  } do 

  given(:user) { User.create(email: 'user@test.com', password: '123456789') }

  background { visit new_user_session_path }

  scenario 'Registered user tries to sign in' do 
    fill_in "Email",	with: user.email
    fill_in "Password",	with: user.password
    click_on 'Log in'
    
    expect(page).to have_content 'Signed in successfully.'
  end

  scenario 'Unregistered user tries to sign in' do 
    fill_in "Email",	with: "aura@test.com" 
    fill_in "Password",	with: "123456789" 
    click_on 'Log in'

    expect(page).to have_content 'Invalid Email or password.'
  end
end