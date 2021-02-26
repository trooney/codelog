source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.1'

gem 'acts-as-taggable-on', git: 'https://github.com/mbleigh/acts-as-taggable-on.git', branch: 'master'
gem 'bootsnap', '>= 1.4.2', require: false
gem 'bootstrap', '~> 4.5.0'
gem 'default_value_for'
gem 'devise'
gem 'discard', '~> 1.0'
gem 'faraday', '~> 0.15.4' # Faraday 0.16.0 not compatible with elasticsearch-transport
gem 'haml-rails', '~> 2.0'
gem 'olive_branch'
gem 'pg'
gem 'pg_search'
gem 'puma', '~> 3.11'
gem 'rack-cors'
gem 'sass-rails', '~> 6'
gem 'sidekiq'
gem 'simple_form'
gem 'webpacker', '~> 4.0'

# Parsers
gem 'kramdown'
gem 'kramdown-parser-gfm'
gem 'rouge'

# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'rubocop', '~> 0.72.0', require: false
end

group :development do
  gem 'awesome_print'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console', '>= 3.3.0'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'codecov', '~> 0.4.3', require: false
  gem 'minitest-matchers_vaccine'
  gem 'mocha', '~> 1.5.0'
  gem 'poltergeist'
  gem 'selenium-webdriver'
  gem 'shoulda-matchers', '~> 4.1.0'
  gem 'webdrivers'
  gem 'webmock'
end

