class CreateStuff < ActiveRecord::Migration[6.0]
  def change

    add_column :users, :full_name, :string
    add_column :users, :display_name, :string
    add_column :users, :default_bucket_id, :integer
    add_index :users, :default_bucket_id

    create_table :buckets do |t|
      t.string :name
      t.timestamps
    end

    create_table :bucket_users do |t|
      t.references :bucket
      t.references :user
      t.timestamps
    end

    add_index :bucket_users, [:bucket_id, :user_id], unique: true

    create_table :notes do |t|
      t.references :bucket, null: true
      t.references :creator, class: 'User'
      t.string :title
      t.text :text_blob
      t.integer :lock_version
      t.datetime :discarded_at, index: true
      t.timestamps
    end

    create_table :stars do |t|
      t.references :bucket
      t.references :note
      t.references :creator, class: 'User'
      t.timestamps
    end

    add_index :stars, [:bucket_id, :note_id, :creator_id], unique: true

    create_table :short_urls do |t|
      t.references :owner, polymorphic: true
      t.text :unique_key
      t.timestamps
    end
  end
end
