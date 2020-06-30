require 'test_helper'

class Api::Buckets::NotesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:johndoe)
    @bucket = buckets(:for_johndoe)
    @note = notes(:first_for_johndoe)

    sign_in @user
  end

  test "#show" do
    get api_bucket_note_path(@bucket, @note)
    assert_response :success
  end
end
