FROM debian:jessie
MAINTAINER Dcylabs <dcylabs@gmail.com>

# Installing all build tools 
RUN apt-get update 
RUN apt-get install -y nodejs-legacy npm git-core ruby ruby-dev
RUN npm install -g bower grunt-cli
RUN gem install sass compass

# Fixing sass 
WORKDIR /var/lib/gems/2.1.0/gems/compass-core-1.0.3/stylesheets/compass/css3
RUN sass-convert _deprecated-support.scss _deprecated-support.scss

# Setting up environment 
RUN mkdir -p /var/crafter
WORKDIR /var/crafter 
COPY package.json /var/crafter
RUN npm install
COPY bower.json /var/crafter
RUN bower install --allow-root
COPY Gruntfile.js /var/crafter

CMD set -- $args && export env=${1:-dev} && grunt build:$env && chmod -R 777 dist