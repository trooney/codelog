# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_08_17_221002) do

  create_table "bucket_users", force: :cascade do |t|
    t.integer "bucket_id"
    t.integer "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["bucket_id", "user_id"], name: "index_bucket_users_on_bucket_id_and_user_id", unique: true
    t.index ["bucket_id"], name: "index_bucket_users_on_bucket_id"
    t.index ["user_id"], name: "index_bucket_users_on_user_id"
  end

  create_table "buckets", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "notes", force: :cascade do |t|
    t.integer "bucket_id"
    t.integer "creator_id"
    t.string "title"
    t.text "text_blob"
    t.integer "lock_version"
    t.datetime "discarded_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["bucket_id"], name: "index_notes_on_bucket_id"
    t.index ["creator_id"], name: "index_notes_on_creator_id"
    t.index ["discarded_at"], name: "index_notes_on_discarded_at"
  end

  create_table "short_urls", force: :cascade do |t|
    t.string "owner_type"
    t.integer "owner_id"
    t.text "unique_key"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["owner_type", "owner_id"], name: "index_short_urls_on_owner_type_and_owner_id"
  end

  create_table "stars", force: :cascade do |t|
    t.integer "bucket_id"
    t.integer "note_id"
    t.integer "creator_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["bucket_id", "note_id", "creator_id"], name: "index_stars_on_bucket_id_and_note_id_and_creator_id", unique: true
    t.index ["bucket_id"], name: "index_stars_on_bucket_id"
    t.index ["creator_id"], name: "index_stars_on_creator_id"
    t.index ["note_id"], name: "index_stars_on_note_id"
  end

  create_table "taggings", force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.integer "taggable_id"
    t.string "tagger_type"
    t.integer "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at"
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "taggings_taggable_context_idx"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "full_name"
    t.string "display_name"
    t.integer "default_bucket_id"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["default_bucket_id"], name: "index_users_on_default_bucket_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "taggings", "tags"
end
