#!/bin/bash
docker rm -f $(docker ps -a -q)
docker pull neojt/mredis

docker run -p 8080:8080 -d rhombus
docker run -p 9090:9090 -d erage/buffdai

docker run -d -p 6379:6379 neojt/mredis

cd telegram
docker build -t bot .
docker run --name bot -d -p 8545:8545 bot

cd ../api
docker build -t api .
docker run --name api -d -p 3000:3000 api

cd ../frontend
docker build -t front .
docker run --name front -d -p 80:80 front
