class Family
  include Mongoid::Document
  include Mongoid::Timestamps
  field :surname, type: String

  validates :surname, presence: true, uniqueness: true
end
