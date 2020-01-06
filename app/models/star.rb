class Star < ApplicationRecord
  belongs_to :bucket
  belongs_to :note
  belongs_to :creator, class_name: 'User'

  after_commit :reindex_note

  validates :bucket, presence: true
  validates :note, presence: true
  validates :creator, presence: true

  def reindex_note
    note.sync_reindex
  end
end
