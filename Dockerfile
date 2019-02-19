FROM alpine:3.9

RUN apk --no-cache add \
    nodejs \
    npm \
    ffmpeg \
  && npm install -g \
    npm@latest \
    mocha@5.2.0 \
  # Clean up obsolete files:
  && rm -rf \
    /tmp/* \
    /root/.npm

# Avoid permission issues with host mounts by assigning a user/group with
# uid/gid 1000 (usually the ID of the first user account on GNU/Linux):
RUN adduser -D -u 1000 mocha

USER mocha

WORKDIR /opt

ENTRYPOINT ["mocha"]
