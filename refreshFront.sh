#!/bin/bash
cd frontend

sudo docker rm -f front
sudo docker build -t front .
sudo docker run --name front -d -p 80:80 front
