class Bucket < ApplicationRecord
  acts_as_taggable

  has_many :notes
  has_many :bucket_users
  has_many :users, through: :bucket_users

  validates :name, presence: true

  scope :for_user, ->(user) {
    Bucket.unscoped.joins(:bucket_users).where(bucket_users: { user: user })
  }

  def tag_context
    "bucket_#{id}".to_sym
  end
end
