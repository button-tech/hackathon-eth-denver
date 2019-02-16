#!/bin/bash
cd telegram

sudo docker rm -f bot
sudo docker build -t bot .
sudo docker run --name bot -d bot
