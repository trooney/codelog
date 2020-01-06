class Web::Buckets::ApplicationController < ApplicationController
  before_action :load_bucket

  def load_bucket
    @bucket = Bucket.for_user(current_user).find(params[:bucket_id])
  end
end