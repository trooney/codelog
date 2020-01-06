require 'test_helper'

class BucketUserTest < ActiveSupport::TestCase
  def setup
    @model = BucketUser.new
  end

  test 'associations' do
    assert_must belong_to(:bucket), @model
    assert_must belong_to(:user), @model
  end

  test 'validations' do
    assert_must validate_presence_of(:bucket), @model
    assert_must validate_presence_of(:user), @model
  end
end
