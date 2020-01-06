class Api::Buckets::StarsController < ::Api::Buckets::ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :load_star, only: [:destroy]

  rescue_from ActionController::ParameterMissing, with: :handle_bad_request
  rescue_from ActiveRecord::RecordInvalid, with: :handle_bad_request

  def create
    attrs = params_for_create
    star = Star.find_or_create_by!(attrs)

    render json: { status: 'success', star: star.as_json }
  end

  def destroy
    @star.destroy!
    render json: { status: 'success' }
  rescue ActiveRecord::RecordNotFound
    render json: { status: 'success' }
  end

  private def load_star
    @star = Star.find_by!(
      note_id: params[:id], # WRONG this shouldn't be note id when the url thinks it's the star id
      creator: current_user,
      bucket: @bucket
    )
  end

  private def params_for_create
    params
      .fetch(:star, {})
      .permit(:note_id)
      .merge(
        bucket_id: @bucket.id,
        creator_id: current_user.id
      )
  end

  protected def handle_bad_request
    render json: { message: 'something bad' }, status: :bad_request
  end
end
