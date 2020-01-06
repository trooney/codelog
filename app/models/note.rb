class Note < ApplicationRecord
  searchkick callbacks: false
  acts_as_taggable

  include Discard::Model

  belongs_to :bucket
  belongs_to :creator, class_name: 'User'

  has_one :short_url, as: :owner
  has_many :stars
  has_many :starring_users, through: :stars, source: :creator

  after_create :set_short_url
  after_commit :sync_reindex

  validates :bucket, presence: true
  validates :creator, presence: true
  validates :text_blob, presence: true

  def sync_reindex
    reindex(nil, refresh: true)
  end

  def set_short_url
    @short_url = ShortUrl.create!(owner: self)
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
