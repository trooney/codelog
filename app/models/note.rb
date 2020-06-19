class Note < ApplicationRecord
  include PgSearch::Model

  pg_search_scope :search_text_blob_fulltext, against: :text_blob, using: { tsearch: { dictionary: 'english', prefix: true } }
  pg_search_scope :search_text_blob_trigram, against: :text_blob, using: { trigram: { word_similarity: true } }, ranked_by: ":trigram"

  acts_as_taggable

  include Discard::Model

  belongs_to :bucket
  belongs_to :creator, class_name: 'User'

  has_one :short_url, as: :owner
  has_many :stars
  has_many :starring_users, through: :stars, source: :creator

  after_create :set_short_url

  validates :bucket, presence: true
  validates :creator, presence: true

  def set_short_url
    self.short_url = ShortUrl.create!(owner: self)
  end

  def html_blob
    Kramdown::Document.new(text_blob, input: 'GFM').to_html
  end

  def search_data
    labels = tags_on(bucket.tag_context)

    attributes.merge(
      starring_user_ids: starring_users.pluck(:id),
      tag_names: labels.map(&:name),
      tag_ids: labels.map(&:id),
      is_discarded: discarded?,
      created_at: created_at.to_time,
      updated_at: updated_at.to_time
    )
  end

  def tags_on_bucket
    tags_on(bucket.tag_context)
  end
end
