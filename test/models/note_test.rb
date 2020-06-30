require 'test_helper'

class NoteTest < ActiveSupport::TestCase
  def setup
    @model = Note.new
  end

  test 'associations' do
    assert_must belong_to(:bucket), @model
    assert_must belong_to(:creator).class_name('User'), @model
  end

  test 'validations' do
    assert_must validate_presence_of(:bucket), @model
    assert_must validate_presence_of(:creator), @model
  end
end
