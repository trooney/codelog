require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    @model = User.new
  end

  test 'associations' do
    assert_must belong_to(:default_bucket).class_name('Bucket'), @model

    assert_must have_many(:buckets).through(:bucket_users), @model
    assert_must have_many(:bucket_users), @model
  end

  test 'validations' do
    assert_must validate_presence_of(:email), @model
    assert_must validate_presence_of(:full_name), @model
    assert_must validate_presence_of(:display_name), @model
  end
end
