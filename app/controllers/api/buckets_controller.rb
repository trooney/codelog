class Api::BucketsController < ApplicationController
  def index
    render json: { buckets: Bucket.for_user(current_user).sort.as_json }
  end
end
