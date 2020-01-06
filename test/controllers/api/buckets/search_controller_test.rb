require 'test_helper'

class Api::Buckets::SearchControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:johndoe)
    @bucket = buckets(:for_johndoe)

    sign_in @user
  end

  test "search without query" do
    get api_bucket_search_index_path(@bucket)
    assert_response :success
  end

  test "search with query" do
    get api_bucket_search_index_path(@bucket), params: { query: 'foo' }
    assert_response :success
  end
end
