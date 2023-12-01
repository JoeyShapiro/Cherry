FROM python:alpine

RUN pip install flask
ADD app.py /var/www/app.py
ADD index.html /var/www/index.html

EXPOSE 8000

# WORKDIR /var/
WORKDIR /mnt/debug
ENTRYPOINT [ "python", "app.py" ]
