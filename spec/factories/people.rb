FactoryBot.define do
  factory :person do
    name { "MyString" }
    description { "MyString" }

    trait :invalid do
      name { nil }
    end
  end
end
