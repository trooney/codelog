class Api::Buckets::NotesController < ::Api::Buckets::ApplicationController
  before_action :load_note, only: [:update, :show, :trash]

  rescue_from ActionController::ParameterMissing, with: :handle_bad_request
  rescue_from ActiveRecord::RecordInvalid, with: :handle_bad_request

  def create
    attrs = params_for_create

    tag_list = attrs.delete(:tag_list)

    note = Note.new(attrs)
    note.creator = current_user
    note.bucket = @bucket
    note.set_tag_list_on(@bucket.tag_context, tag_list)
    note.save!

    @bucket.tag_list.add(tag_list, parse: true)
    @bucket.save!

    note_json = note_as_json(note)

    render json: { note: note_json }
  end

  def update
    attrs = params_for_update

    tag_list = attrs.delete(:tag_list)

    @note.assign_attributes(attrs)
    @note.set_tag_list_on(@bucket.tag_context, tag_list)
    @note.save!

    @bucket.tag_list.add(tag_list, parse: true)
    @bucket.save!

    note_json = note_as_json(@note)

    render json: { note: note_json }
  end

  def show
    note_json = note_as_json(@note)

    render json: { note: note_json }
  end

  def trash
    @note.discard! if !@note.discarded?
    render json: { status: 'success' }
  end

  def untrash
    @note.undiscard! if @note.discarded?
    render json: { status: 'success' }
  end

  private def load_note
    @note = Note.find_by!(
      id: params[:id],
      bucket: @bucket
    )
  end

  private def note_as_json(note)
    note.as_json(except: [:tag_list, :lock_version]).merge(
      html_blob: note.html_blob,
      tags: note.tags_on_bucket,
      star: note.stars.find_by(creator: current_user)
    )
  end

  private def params_for_update
    params.fetch(:note, {}).permit(:id, :text_blob, :tag_list)
  end

  private def params_for_create
    params.fetch(:note, {}).permit(:text_blob, :tag_list)
  end

  protected def handle_bad_request
    render json: { message: 'something bad' }, status: :bad_request
  end
end
