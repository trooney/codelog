module CodelogSeed
  def self.populate
    bucket = Bucket.find_by(name: 'doe bucket')
    user = bucket.users.first

    Rails.root.glob('seed/*.txt').map do |path|
      tag_name, _index, _format = path.to_s.split('/').last.split('.')

      note = Note.new(
        bucket: bucket,
        text_blob: File.read(path),
        creator: user
      )
      note.set_tag_list_on(bucket.tag_context, tag_name)
      note.save!

      bucket.tag_list.add(tag_name, parse: true)
      bucket.save!

      note
    end
  end
end