class Person
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :description, type: String

  validates :name, presence: true
end