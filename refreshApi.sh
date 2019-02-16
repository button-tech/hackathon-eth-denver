#!/bin/bash
cd api

sudo docker rm -f api
sudo docker build -t api .
sudo docker run --name api -d -p 3000:3000 api
