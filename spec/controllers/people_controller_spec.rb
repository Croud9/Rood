require 'rails_helper'

RSpec.describe PeopleController, type: :controller do
  let(:person) { FactoryBot.create(:person) }

  describe "GET /index" do
    it 'render index view' do 
      get :index
      expect(response).to render_template :index
    end
  end
  
  describe 'GET #show' do
    before { get :show, params: { id: person } }

    it 'assigns the requested person to @person' do 
      expect(assigns(:person)).to eq person
    end
    
    it 'render show view' do 
      expect(response).to render_template :show
    end
  end

  describe 'GET #new' do
    before {get :new}

    it 'assigns the new Person to @person' do 
      expect(assigns(:person)).to be_a_new(Person)
    end

    it 'render new view' do 
      expect(response).to render_template :new
    end
  end

  describe 'GET #edit' do
    before { get :edit, params: { id: person } }

    it 'assigns the requested person to @person' do 
      expect(assigns(:person)).to eq person
    end
    
    it 'render edit view' do 
      expect(response).to render_template :edit
    end
  end

  describe 'POST #create' do
    context 'with valid attributes' do
      it 'saves a new person in the DB' do
        expect { post :create, params: { person: FactoryBot.attributes_for(:person) } }.to change(Person, :count).by(1)
      end
      
      it 'redirect to show view' do 
        post :create, params: { person: FactoryBot.attributes_for(:person) } 
        expect(response).to redirect_to assigns(:person)
      end
    end
    
    context 'with invalid attributes' do
      it 'does not save the person' do 
        expect { post :create, params: { person: FactoryBot.attributes_for(:person, :invalid) } }.to_not change(Person, :count)
      end

      it 're-renders new view' do
        post :create, params: { person: FactoryBot.attributes_for(:person, :invalid) } 
        expect(response).to render_template :new
      end
    end
  end
  
  describe 'POST #create' do
    context 'with valid attributes' do
      it 'assigns the requested person to @person' do
        patch :update, params: { id: person, person: FactoryBot.attributes_for(:person)}
        expect(assigns(:person)).to eq person
      end
      
      it 'changes person attributes' do 
        patch :update, params: { id: person, person: {name: 'arara', description: 'bla-bla'} }
        person.reload

        expect(person.name).to eq('arara')
        expect(person.description).to eq('bla-bla')
      end

      it 'redirects to update person' do
        patch :update, params: { id: person, person: FactoryBot.attributes_for(:person)}
        expect(response).to redirect_to person
      end
    end
    
    context 'with invalid attributes' do
      before { patch :update, params: { id: person, person: FactoryBot.attributes_for(:person, :invalid) } }

      it 'does not change person' do 
        person.reload

        expect(person.name).to eq('MyString')
        expect(person.description).to eq('MyString')
      end

      it 're-renders edit view' do
        expect(response).to render_template :edit
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:person) { FactoryBot.create(:person) }

    it 'deletes the person' do 
      expect { delete :destroy, params: { id: person } }.to change(Person, :count).by(-1)
    end

    it 'redirect to index' do 
      delete :destroy, params: { id: person }
      expect(response).to redirect_to people_path
    end
  end
end

