FROM node

WORKDIR /app

COPY . .

RUN npm i -g http-server

EXPOSE 80

ENTRYPOINT ["http-server", "-p 80"]