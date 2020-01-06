class BucketUser < ApplicationRecord
  belongs_to :bucket
  belongs_to :user
end
