class Star < ApplicationRecord
  belongs_to :bucket
  belongs_to :note
  belongs_to :creator, class_name: 'User'

  validates :bucket, presence: true
  validates :note, presence: true
  validates :creator, presence: true
end
