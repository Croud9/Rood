class Person
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :description, type: String
  field :birth_date, type: String
  field :death_date, type: String
  field :family, type: String
  field :father, type: String
  field :mother, type: String
  field :married_on, type: Array

  
  validates :name, presence: true
end
