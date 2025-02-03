# Zookeeper Configuration Editor UI Template project

It is template project to extend for owner configuration editor projects 

## UI
UI - trmplate project

## Backend
src - backend API sample project (some raw code)

docker-compose sample 
```
version: '3.0'
services:
  zoo:
    image: bitnami/zookeeper:3.6.2
    ports:
      - 2181:2181
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
  zooui:
    image: elkozmon/zoonavigator:latest
    environment:
      HTTP_PORT: 8080
      ZK_DEFAULT_NODE: "zoo:2181"
    ports:
      - 70:8080
```
