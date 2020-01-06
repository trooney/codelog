require 'test_helper'

class Web::Buckets::SettingsControllerTest < ActionDispatch::IntegrationTest
  test "#show" do
    user = users(:johndoe)
    bucket = buckets(:for_johndoe)
    sign_in user

    get web_bucket_settings_path(bucket)
    assert_response :success
  end
end
