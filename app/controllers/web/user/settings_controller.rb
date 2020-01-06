class Web::User::SettingsController < ApplicationController
  layout 'web'

  def show; end

  def update
    current_user.update!(params_for_update)
    redirect_to action: :show, notice: 'Saved'
  rescue ActiveRecord::RecordInvalid
    flash.now[:error] = 'Error'
    render action: :show
  end

  private def params_for_update
    params.require(:user).permit(:id, :email, :display_name, :default_bucket_id)
  end
end
