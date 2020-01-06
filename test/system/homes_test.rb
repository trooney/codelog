require "application_system_test_case"

class HomesTest < ApplicationSystemTestCase
  test 'user registration flow' do
    # stub_request(:any, 'localhost:9200')

    visit root_url

    fill_in 'user[full_name]', with: 'Foo Bar'
    fill_in 'user[email]', with: 'foo@bar.com'
    fill_in 'user[password]', with: 'password'

    assert_difference -> { User.count } do
      click_on 'sign-up-submit'
    end

    # User.last.update(confirmed_at: Time.now)
    #
    # visit new_user_session_path
    #
    # fill_in 'user[email]', with: 'foo@bar.com'
    # fill_in 'user[password]', with: 'password'
    #
    # click_on 'sign-in-submit'
    #
    # assert page.has_content?('Foo Bar')
    # assert page.has_content?('New Note')
  end
end
