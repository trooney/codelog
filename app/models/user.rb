class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :rememberable, :trackable and :omniauthable
  devise :database_authenticatable,
         :registerable,
         :confirmable,
         :recoverable,
         :validatable

  has_many :bucket_users
  has_many :buckets, through: :bucket_users

  belongs_to :default_bucket, class_name: 'Bucket', optional: true

  validates :full_name, presence: true
  validates :email, presence: true
  validates :display_name, presence: true

  default_value_for :display_name do |user|
    [user.full_name, user.username_from_email_address].compact.first
  end

  default_value_for :default_bucket do |user|
    user.buckets.build(name: 'My Bucket')
  end

  def username_from_email_address
    email.split('@').first&.titleize
  end
end
