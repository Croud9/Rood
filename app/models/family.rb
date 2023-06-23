class Family
  include Mongoid::Document
  include Mongoid::Timestamps
  field :surname, type: String
  field :people_ids, type: String

  validates :surname, presence: true, uniqueness: true
end
