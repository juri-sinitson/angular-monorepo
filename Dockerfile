# NOTE!
# Don't forget to rebuild the image when editing this file.

# Use the official Node.js LTS image as the base
FROM node:lts

# To avoid "Your system is missing the dependency: Xvfb"
# when running E2E tests with Cypress.
RUN apt-get update
RUN apt-get -y install xvfb vim lsof

WORKDIR /app
# We copy these files now because the commands in this file are executed
# during the build process. The mounting of the volume is done at the runtime
# of the container.
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

# Install playwright and cypress. They will usually be
# installed in the .cache of the current user.
RUN pnpm exec cypress install
RUN pnpm exec playwright install
RUN pnpm exec playwright install-deps
# Ensure that the exepected content is there. The outpu of
# this and other commands can be seen e.g. in the docker desktop
# client.
RUN ls -ahl /root/.cache
