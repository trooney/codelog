require 'test_helper'

class BucketTest < ActiveSupport::TestCase
  def setup
    @model = Bucket.new
  end

  test 'associations' do
    assert_must have_many(:notes), @model
    assert_must have_many(:users).through(:bucket_users), @model
    assert_must have_many(:bucket_users), @model
  end

  test 'validations' do
    assert_must validate_presence_of(:name), @model
  end

  test '#tag_context' do
    bucket = buckets(:for_johndoe)

    assert_equal "bucket_#{bucket.id}".to_sym, bucket.tag_context
  end
end
