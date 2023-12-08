FROM nginx

# TODO see if i can do all this with an existing iamge
RUN mkdir -p /etc/nginx/certs
RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/nginx/certs/key.pem -out /etc/nginx/certs/cert.pem -sha256 -days 3650 -nodes \
    -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"

ADD nginx.conf /etc/nginx/conf.d/nginx.conf
