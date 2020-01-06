FROM ruby:2.6.3-alpine

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
    sqlite-dev

ENV BUNDLER_VERSION "2.0.2"
ENV APP_HOME /myapp
ENV RAILS_ENV production
ENV RACK_ENV production
ENV RAILS_MASTER_KEY e76d4fd1091d946bebe6dda24e881314

RUN mkdir $APP_HOME
WORKDIR $APP_HOME
COPY . /myapp

RUN gem install bundler:2.0.2
#RUN bundle install --jobs 5 --retry 5 --without development test

ENV PATH=$APP_HOME/bin:$PATH

CMD ["bundle", "exec", "rails", "assets:precompile"]

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]

