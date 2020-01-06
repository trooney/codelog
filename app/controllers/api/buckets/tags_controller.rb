class Api::Buckets::TagsController < ::Api::Buckets::ApplicationController
  def index
    tags = @bucket.tags.order(name: :asc)
    render json: { tags: tags.as_json }
  end
end
