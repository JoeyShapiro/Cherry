FROM node:16

RUN npm install -g pnpm

# install mkcert
# RUN curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
# RUN chmod +x mkcert-v*-linux-amd64
# RUN cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert

# cant use mount yet
# RUN mkdir -p /var/www/certs
# RUN openssl req -x509 -newkey rsa:4096 -keyout /var/www/certs/key.pem -out /var/www/certs/cert.pem -sha256 -days 3650 -nodes \
#     -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"

# WORKDIR /var/www
WORKDIR /mnt/debug/cherry

# create certs
# RUN mkdir -p /var/www/certs
# RUN mkcert -install
# RUN mkcert -key-file /var/www/certs/key.pem -cert-file /var/www/certs/cert.pem localhost

ENTRYPOINT [ "/mnt/debug/entrypoint.sh" ]
