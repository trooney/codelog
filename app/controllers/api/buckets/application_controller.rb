class Api::Buckets::ApplicationController < ApplicationController
  before_action :load_bucket

  def load_bucket
    @bucket = Bucket.find(params[:bucket_id])
  end
end
