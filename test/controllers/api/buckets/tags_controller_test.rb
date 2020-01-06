require 'test_helper'

class Api::Buckets::TagsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:johndoe)
    @bucket = buckets(:for_johndoe)

    sign_in @user
  end

  test "all bucket tags" do
    get api_bucket_tags_path(@bucket)
    assert_response :success
  end
end
