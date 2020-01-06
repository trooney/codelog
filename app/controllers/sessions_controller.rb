class SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    super
    flash.delete(:notice)
  end

  # DELETE /resource/sign_out
  def destroy
    super
    flash.delete(:notice)
  end

  def login_redirect
    if current_user.present?
      redirect_to web_bucket_index_path(bucket_id: current_user.default_bucket.id)
    end
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
