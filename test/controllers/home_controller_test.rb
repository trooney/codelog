require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test '#home' do
    get root_path
    assert_response :success
  end

  test '#terms' do
    get terms_path
    assert_response :success
  end

  test '#privacy' do
    get privacy_path
    assert_response :success
  end
end
