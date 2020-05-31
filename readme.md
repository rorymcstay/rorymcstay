feed/feed-admin/

# in order to develop locally you must ```keratin/authn-server``` locally

        docker run -it --rm   --publish 8080:3000   -e AUTHN_URL=http://localhost:8080   -e APP_DOMAINS=localhost   -e DATABASE_URL=sqlite3://:memory:?mode=memory\&cache=shared   -e SECRET_KEY_BASE=changeme   -e HTTP_AUTH_USERNAME=hello   -e HTTP_AUTH_PASSWORD=world   --name authn_app   keratin/authn-server:latest   sh -c "./authn migrate && ./authn server"

# Local https development
https://github.com/FiloSottile/mkcert#installation
https://urre.me/writings/docker-for-local-wordpress-development/
