class HomeController < ApplicationController
  layout 'unauthenticated'

  def index; end
  def terms; end
  def home; end

  def login_redirect
    if current_user.present?
      redirect_to web_bucket_index_path(bucket_id: current_user.default_bucket.id)
    end
  end

  helper_method :resource_name, :resource, :devise_mapping, :resource_class

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def resource_class
    User
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end
end
