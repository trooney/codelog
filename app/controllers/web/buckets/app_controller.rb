class Web::Buckets::AppController < Web::Buckets::ApplicationController
  before_action :load_bucket

  def index
    @data_react = {
      currentUser: current_user.as_json(only: [:id, :display_name]).deep_transform_keys! { |key| key.underscore.camelize(:lower) },
      bucketId: @bucket.id,
      tagId: params[:tag_ids].present? ? params[:tag_ids].to_i : nil,
      query: params[:query].present? ? params[:query] : ''
    }
  end
end
