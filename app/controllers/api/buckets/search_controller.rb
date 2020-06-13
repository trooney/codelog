class Api::Buckets::SearchController < ::Api::Buckets::ApplicationController
  def index
    query_str = params.dig(:query)
    @query = query_str || ''

    @query_params = {
        tag_ids: ''
    }.with_indifferent_access.merge(params.permit(:tag_ids))

    search_params = {
        bucket_id: [@bucket.id],
        is_discarded: false
    }
    
    search_params[:starring_user_ids] = [current_user.id] if params[:starred].present?
    search_params[:tag_ids] = @query_params[:tag_ids].split(',').map(&:to_i).reverse if @query_params[:tag_ids].present?

    @search = Note.search(
      query_str.present? ? query_str : '*',
      where: search_params,
      order: { _score: :desc, updated_at: :desc },
      boost_where: { tag_names: 1 },
      boost_by_recency: { updated_at: { scale: '7d', decay: 0.5 } },
      per_page: 25
    )

    notes = @search.results.to_a
    notes_by_id = notes.index_by(&:id)
    note_ids = notes.map(&:id)

    tags_by_id = ActsAsTaggableOn::Tag.all.index_by(&:id)

    taggings = ActsAsTaggableOn::Tagging.where(taggings: { taggable_type: Note.to_s, taggable_id: note_ids })
    taggings_for_note_id = taggings.group_by(&:taggable_id)

    stars_for_note_id = Star.where(creator: current_user, note_id: note_ids).index_by(&:note_id)

    association_data = note_ids.map do |note_id|
      note = notes_by_id[note_id]
      taggings = taggings_for_note_id[note_id] || []

      [
        note_id,
        {
          html_blob: note.html_blob,
          star: stars_for_note_id[note_id],
          tags: taggings.map { |tagging| tags_by_id[tagging.tag_id] }
        }
      ]
    end.to_h

    results = notes
                .map { |n| n.as_json(except: [:tags, :tag_list, :lock_version]).with_indifferent_access }
                .map do |note_hash|
                  note_id = note_hash[:id]
                  ad = association_data[note_id]

                  {}.merge(note_hash).merge(ad)
                end

    render json: { results: results, total_count: @search.total_count }
  end
end
