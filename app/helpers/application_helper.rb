module ApplicationHelper

  def short_url(model)
    options = { controller: :"/redirects", action: :show, id: model.unique_key, only_path: false }

    url = url_for(options)
    title = url_for(options.merge(only_path: true))

    link_to title, model.owner.try(:url).present? ? model.owner.try(:url) : url
  end

  def markdown_render(str)
    Kramdown::Document.new(
        str,
        input: 'GFM',
        highlighter: 'rogue',
        syntax_highlighter_opts: {}
    ).to_html
  end
end
