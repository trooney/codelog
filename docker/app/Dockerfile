FROM ruby:2.7.1-alpine

# Set local timezone
RUN apk add --update tzdata && \
    cp /usr/share/zoneinfo/Canada/Eastern /etc/localtime && \
    echo "Canada/Eastern" > /etc/timezone

RUN set -ex && apk add --update --no-cache \
    build-base \
    linux-headers \
    ca-certificates \
    bash \
    git \
    nodejs \
    yarn \
    postgresql-dev

ENV LANG C.UTF-8
ENV BUNDLER_VERSION "2.1.4"
ENV BUNDLE_JOBS 5
ENV RAILS_ENV production
ENV RACK_ENV production
ENV RAILS_MASTER_KEY e76d4fd1091d946bebe6dda24e881314
ENV APP_HOME /myapp

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY Gemfile Gemfile.lock ./
RUN gem install bundler:2.1.4
#RUN bundle install --path=$BUNDLE_PATH
RUN bundle install

# COPY package.json yarn.lock  ./
# RUN yarn install

COPY . /myapp

# CMD ["bundle", "exec", "rails", "assets:precompile"]

EXPOSE 3000

# CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
CMD ["bundle", "exec", "rails", "server"]
