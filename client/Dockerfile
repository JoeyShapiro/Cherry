FROM node:16

RUN npm install -g pnpm

# WORKDIR /var/www
WORKDIR /mnt/debug/cherry

ENTRYPOINT [ "/mnt/debug/entrypoint.sh" ]
