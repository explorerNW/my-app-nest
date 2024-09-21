<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## main service
  my-app-nest

## Micro-service
1. tcp

    path: micro-service/tcp
2. redis

    path: micro-service/tcp
3. mqtt

    path: micro-service/mqtt
4. rabbit-mq

    path: micro-service/rabbit-mq
5. nats

    path: micro-service/nats
6. kafka

    path: micro-service/kafka
7. grpc

    path: micro-service/grpc


## Docker
1. redis
  ```bash
    docker pull redis
    docker run --name myredis -d -p 6379:6379 -v :/data redis redis-server --appendonly yes
  ```
2. postgres
  ```bash
    docker pull postgres
    docker run --name postgres -e POSTGRES_PASSWORD=admin@me -v /home/server-1/data/postgresql:/var/lib/postgresql/data -d postgres

    docker exec -it postgres psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'admin@me';"
    docker exec -it postgres psql -U postgres -c "CREATE DATABASE db_nest;"
    docker exec -it postgres psql -U postgres -c "\list"
  ```
3. zookeeper kafka
  ```bash
    docker pull zookeeper
    docker pull bitnami/kafka:latest
    docker pull wurstmeister/kafka
    docker pull bitnami/kafka:latest

    docker run -d --name zookeeper -p 2181:2181 zookeeper
    docker run -d --name kafka -p 9092:9092 --link zookeeper --env KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 --env KAFKA_ADVERTISED_HOST_NAME=localhost wurstmeister/kafka
  ```
4. nats
  ```bash
    docker pull nats
    docker run -d --name nats-server -p 4222:4222 nats
  ```

5.rabbitmq
  ```bash
    docker pull rabbitmq
    docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management


    docker run -d -p 15673:15672 -p 5674:5672 \
        --restart=always \
        -e RABBITMQ_DEFAULT_VHOST=my_vhost  \
        -e RABBITMQ_DEFAULT_USER=admin \
        -e RABBITMQ_DEFAULT_PASS=admin123456 \
        --hostname myRabbit \
        --name rabbitmq-new\
        rabbitmq:latest

    docker exec -it 容器名/容器id rabbitmq-plugins enable rabbitmq_management
  ```
6. mongodb
  ```bash
    docker pull mongo:latest
    docker run --name mongo -p 27017:27017 -v /my/own/datadir:/data/db -d mongo

    docker run -dit --name mongo \
    -p 17017:27017 \
    -v /data/mongo/config/mongod.conf:/etc/mongod.conf \
    -v /data/mongo/data:/data/db \
    -v /data/mongo/logs:/var/log/mongodb \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=123456 \
    --restart=always  \
    mongo
  ```

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Wang Nie](superexplorernw@163.com)

## License

Nest is [MIT licensed](LICENSE).
