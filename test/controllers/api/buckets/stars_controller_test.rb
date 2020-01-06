require 'test_helper'

class Api::Buckets::StarsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:johndoe)
    @bucket = buckets(:for_johndoe)
    @note = notes(:first_for_johndoe)

    sign_in @user
  end

  test "#create_fails" do
    post api_bucket_stars_path(@bucket, @note), params: {}
    assert_response :bad_request
  end
end
