---
date: 2023-03-11
layout: post
title: 도커 & 스프링 부트 메모리 사용량
subtitle: '도커 & 스프링 부트가 구동되기 위한 최소 메모리'
description: 도커 & 스프링 부트가 구동되기 위한 최소 메모리
image: >-
  https://img.shields.io/badge/spring_&_docker-blue?style=for-the-badge
category: cs
author: coldrain
---
## 도커 & 스프링 부트 메모리 사용량
도커를 이용해서 스프링 부트를 구동할 시, 최소 얼마만큼의 메모리가 필요할까?
이를 알아보기 위해 여러가지 테스트를 진행해 보있다.
테스트 진행 환경은 다음과 같다.

- 윈도우 10, WSL2
- 윈도우용 docker desktop 4.16.0 (95345)
- docker-compose v2.15.1


### 주의
이번 테스트는 정상작동을 담보하는 것이 아닌, 
오로지 부팅이 가능한 최소 메모리 필요량을 알아보기 위한 것으로
해당 값으로 동작에 성공하였다고 해서 어플리케이션이 원활하게 작동한다고 담보하지 않는다.

### 테스트 환경

테스트를 진행한 환경은 다음과 같다.

#### build.gradle

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '2.6.5'
    id 'io.spring.dependency-management' version '1.1.0'
}

group = 'com.coldrain'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
}

tasks.named('test') {
    useJUnitPlatform()
}

```

자바 11에 스프링 부트 2.6.5 버전을 사용하였고,
spring-boot-starter-web 만 의존성에 포함시켰다.
먼저 jar 파일만 구동시켜 어느 정도의 메모리를 필요로 하는지 측정해 보았다.

### jar 테스트

#### 힙 사이즈 8MB

```shell
java -Xms8m -Xmx8m -jar demo.jar
```

![불가능](https://user-images.githubusercontent.com/59993347/224476447-e1a2b551-c0b2-449c-aa83-13d40a913bb5.jpg)


실행조차 안된다

#### 힙 사이즈 9MB
```shell
java -Xms9m -Xmx9m -jar demo.jar
```

![가능](https://user-images.githubusercontent.com/59993347/224476444-d27bd002-5ec8-428e-89f9-e29ac43e9abd.jpg)



![비주얼](https://user-images.githubusercontent.com/59993347/224476679-ea7c5f2f-d03c-4675-9f63-453bd0f0d75c.jpg)

진짜 실행만 된다. 실행 후 잠시 있으면 OOM으로 죽긴 하는데, 
일단 부팅은 되었으니 여기서 종료하고. 이제 도커를 통해 앱을 구동시켜 보겠다.


### docker 테스트

먼저 관련 테스트 파일 내용은 다음과 같다.

#### docker-compose
```yml
version: '3'

services:
  test-executor:
    build:
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    deploy:
      resources:
        limits:
          memory: {dynamic value}

```

#### Dockerfile

```Dockerfile
FROM eclipse-temurin:11-jre
COPY build/libs/demo.jar app.jar
CMD [ "java", "-jar", "-Xms9m", "-Xmx9m", "/app.jar" ]
```

이 파일들을 바탕으로 다양한 테스트를 진행해 보았다.

#### 52m

![52](https://user-images.githubusercontent.com/59993347/224478042-001aa731-be6f-4c9e-93d7-abce8f12430f.jpg)
 
137 에러 코드와 함께 종료되었다. 
도커 문서에 따르면 해당 에러 코드는 메모리 부족 에러라고 한다.

#### 53m

![53](https://user-images.githubusercontent.com/59993347/224478040-839b3556-52af-4bf6-97e6-d9819242c712.jpg)

간신히 작동에 성공했다.


### 결론

- 도커 & jar : 53m
- jar : 9m
- 순수 도커 컨테이너
    - 53m - 9m = 44m

내가 개발하고 있는 환경에서 메모리 필요량은 대략 다음과 같았다.
물론 사용하는 자바, 도커 버전, os 종류 등 환경에 따라 값은 다를 수 있으니
참고만 하자.