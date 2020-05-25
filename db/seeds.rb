require 'byebug'
require 'pp'

ActsAsTaggableOn::Tagging.delete_all
ActsAsTaggableOn::Tag.delete_all

User.delete_all
Bucket.delete_all
BucketUser.delete_all
Note.delete_all
Star.delete_all
ShortUrl.delete_all

u1 = User.create!(email: 'john@doe.com', full_name: 'John Doe', password: 'password', confirmed_at: Time.now)
u2 = User.create!(email: 'jane@doe.com', full_name: 'Jane Doe', password: 'password', confirmed_at: Time.now)
u3 = User.create!(email: 'frank@frank.com', full_name: 'Frank', password: 'password', confirmed_at: Time.now)
u4 = User.create!(email: 'anon@anon.com', full_name: 'Anon', password: 'password', confirmed_at: Time.now)

b1 = Bucket.create!(name: 'doe bucket')
b1.users << [u1, u2]

b1_a = Bucket.create!(name: 'empty bucket')
b1_a.users << [u1, u2]

b2 = Bucket.create!(name: 'frank bucket')
b2.users << [u3]

b3 = Bucket.create!(name: 'anon bucket')
b3.users << [u4]

u1.update!(default_bucket: b1)
u2.update!(default_bucket: b1)

begin
  File.open('/Users/trooney/www/codelog/seed/bookmarks.html') do |f|
    Nokogiri::HTML(f).css('dl > dl').map do |dl|
      heading = dl.previous_sibling.css('h3').first
      tag_name = heading.content.strip


      if tag_name.casecmp?('lamic') || tag_name.casecmp?('psy') || tag_name.casecmp?('rental')
        next
      end

      b1.tag_list.add(heading.content.strip, parse: true)
      b1.save!

      dl.css('a')[0...10].map do |el|
        href = el['href']
        ts = el['add_date']
        title = el.content.strip.tr('|', '\|')

        content = [
          title,
          '',
          "<#{href}>"
        ].join("\n")

        b = Note.new(bucket: b1, text_blob: content, creator: u1, created_at: Time.at(ts.to_i) )
        b.set_tag_list_on(b1.tag_context, tag_name)
        b.save!
      end
    end

    b1.users.each do |u|
      b1.notes.last(5).each do |n|
        Star.create!(bucket: b1, note: n, creator: u)
      end
    end

  end
rescue Errno::ENOENT => _es
end 

Bucket.reindex
Note.reindex

# CodelogSeed.populate
