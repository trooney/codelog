#!/bin/bash

docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.3.0

docker-compose --project-name=nudge run --rm --entrypoint "bash" -v $SSH_AUTH_SOCK:/tmp/ssh_auth.sock -e SSH_AUTH_SOCK=/tmp/ssh_auth.sock app


docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.