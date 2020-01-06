require 'test_helper'

class Web::User::SettingsControllerTest < ActionDispatch::IntegrationTest
  test '#show' do
    user = users(:johndoe)
    sign_in user

    get web_user_settings_path
    assert_response :success
  end
end
