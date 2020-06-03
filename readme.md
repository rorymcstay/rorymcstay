feed/feed-admin/

# Developing Locally
App depends on KeratinAuthn for authentication. To develop locally it must be running. KeratinAuthn relies
on Cookies so content must be served over https.

1. Start KeratinAuthn

        docker run -it --publish 8080:3000 \
            -e AUTHN_URL=http://localhost:8080 \
            -e APP_DOMAINS=localhost,devfeedmachine.local,192.168.1.64 \
            -e DATABASE_URL=sqlite3://:memory:?mode=memory\&cache=shared \
            -e SECRET_KEY_BASE=changeme \
            -e HTTP_AUTH_USERNAME=hello \
            -e HTTP_AUTH_PASSWORD=world \
            --name authn \
            --network compose_default \
            keratin/authn-server:latest sh -c "./authn migrate && ./authn server"

2. Install mkcert https://github.com/FiloSottile/mkcert#installation 
3. Run the following commands

        feed-admin$ mkdir certs
        feed-admin$ mkcert -install
        feed-admin$ mkcert -key-file certs/devfeedmachine.local-key.pem -cert-file certs/devfeedmachine.local.pem

4. Application is ready to server

