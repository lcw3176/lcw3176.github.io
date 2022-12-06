---
layout: post
title:  "Transaction"
date:   2022-11-08 17:02:52 +0900
categories: 
---
# Transaction
## 정의
한 번 질의가 실행되면 질의가 모두 수행되거나 모두 수행되지 않는, 작업 수행의 논리적 단위.

## 사용 이유
데이터 부정합을 방지하고자 할 때 사용

## 특성
ACID 특성
- 원자성 (Atomicity)
    - All or Nothing
    - 작업 단위를 일부분만 실행하지 않음

- 일관성 (Consistency)
    - 트랜잭션 완료 시 일관적인 DB 상태 유지
    - ex) 트랜잭션 완료 후 동일한 데이터 타입 유지

- 격리성 (Isolation)
    - 트랜잭션 수행 중 다른 트랜잭션이 끼어들지 못하도록 보장
    - 서로 간섭 X

- 지속성 (Durability)
    - 성공적으로 수행된 트랜잭션은 영원히 반영
    - commit 시 현재 상태는 영원히 보장

## 원자성 보장
수행중인 트랜잭션에 의해 변경된 내역은 유지하면서, 이전에 commit된 상태를 임시 영역에 따로 저장.

현재 수행중인 트랜잭션에서 오류가 발생하면 임시 영역에 저장된 상태로 rollback

### 롤백 세그먼트, Undo 영역
이전 데이터들이 임시로 저장되는 영역


## 일관성 보장
트랜잭션 수행 전, 후에 데이터 모델의 모든 제약 조건(기본키, 외래키, 도메인, 도메인 제약조건 등)을 만족하는 것을 통해 보장

이벤트와 조건이 발생 시 트리거를 통해 보장

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile8.uf.tistory.com%2Fimage%2F9987213A5A7D978C169828">

create는 트리거를 생성하는 코드, after는 트리거가 실행되기 위한 event

## 고립성 보장
### 병행 처리
트랜잭션에 정해진 시간을 할당해서 작업을 하다가 부여된 시간이 끝나면 다른 트랜잭션을 실행하는 방식, 점차적으로 트랜잭션들을 처리함

이때 공통된 데이터가 다른 트랜잭션에 의해 방해되면 안됨.
```
A 트랜잭션: x = 100
<!-- timeout -->
B 트랜잭션: x -= 50
<!-- timeout -->
A 트랜잭션: x == 50 ?????
```

트랜잭션의 간섭이 일어날 경우 갱신분실, 오손판독, 반복불가능, 팬텀문제 등 여러 문제점들이 발생.

### 고립성 보장 방법
lock & excute unlock을 통해 고립성을 보장

데이터를 읽거나 쓸 때는 문을 잠궈서 다른 트랜잭션이 접근하지 못하도록 고립성을 보장하고, 수행을 마치면 unlock을 통해 데이터를 다른 트랜잭션이 접근할 수 있도록 허용하는 방식.

#### shared_lock
- 트랜잭션에서는 데이터를 읽을 때 사용 
- 여러 트랜잭션이 읽을 수는 있고 쓰기를 허용하지 않는 것

#### exclusive_lock
- 데이터를 쓸 때 사용
- 다른 트랜잭션이 읽을 수도 쓸 수도 없도록 하는 것

#### unlock
- 읽기, 쓰기 작업이 끝나면 사용
- 다른 트랜잭션이 lock을 할 수 있도록 데이터에 대한 잠금을 풀어줌.

#### deadlock
- 모든 트랜잭션이 아무것도 수행할 수 없는 상태

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile24.uf.tistory.com%2Fimage%2F99961F4B5A7D9C8712D0F9">


### 2PL 프로토콜 ( 2 Phase Locking protocol )
여러 트랜잭션이 공유하고 있는 데이터에 동시에 접근할 수 없도록 하는, 병행 처리 상황에서 트랜잭션의 고립성을 보장하기 위한 프로토콜


#### growing phase  
read_lock, write_lock을 의미

#### shrinking phase
unlock을 의미

#### 방법
<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile1.uf.tistory.com%2Fimage%2F9958D24B5A7D9F440F1103">

상승 단계와 하강 단계가 섞이면 안된다는 것을 의미.

lock과 unlock이 번갈아 수행되지 않고 lock이 모두 수행된 이후 unlock이 수행되어야 함


#### 한계
<img src="https://miro.medium.com/max/1400/1*StVsQ4erIFszl37zwA3fyw.png">

여전히 데드락의 발생 소지가 존재

좌측 그림은 데드락이 발생하지 않지만, 우측 그림은 프로토콜을 준수했음에도 교착상태가 발생한 예시.

<img src="https://miro.medium.com/max/1400/1*pFcb4xEBqZfOCyaGNZ859g.png">

연쇄 복귀, 회복 불가능 문제 발생 가능

만약 T2 트랜잭션이 commit 되지 않았다면 아무 문제 없는 트랜잭션까지 연달아 복귀하는 문제 발생

이미 T2 트랜잭션이 commit된 상태라면 지속성 조건에 따라 복귀 불가능


#### 해결법
#### 보수적 lock

트랜잭션이 시작되면 모든 lock을 얻음, 데드락 발생은 없지만 병행성 안좋음

#### 엄격한 lock

모든 lock에 대한 unlock 연산을 트랜잭션이 완전히 완료된 후에 실행.

트랜잭션이 commit을 만날 때 까지 lock을 갖고 
있다가 commit을 만날 때 unlock 하는 방식

대부분의 DBMS에서 사용중인 방식

## 격리 수준
동시에 여러 트랜잭션이 처리될 때

특정 트랜잭션이 다른 트랜잭션에서 변경하거나 조회하는 데이터를 볼 수 있도록 허용할지 말지를 결정하는 것.

### READ UNCOMMITTED
<img src="https://nesoy.github.io/assets/posts/img/2019-05-08-21-09-02.png" height=600>

- COMMIT이나 ROLLBACK 여부에 상관 없이 다른 트랜잭션에서 값을 읽을 수 있음
- DIRTY READ 발생

### READ COMMITTED
<img src="https://nesoy.github.io/assets/posts/img/2019-05-08-21-25-41.png" height=600>

- RDB에서 대부분 기본적으로 사용되고 있는 격리 수준.
- 실제 테이블 값을 가져오는 것이 아니라 Undo 영역에 백업된 레코드에서 값을 가져옴
- 같은 SELECT 쿼리 실행 시 정합성이 어긋나는 경우 발생

### REPEATABLE READ
<img src="https://nesoy.github.io/assets/posts/img/2019-05-08-21-52-08.png" height=600>

- 트랜잭션마다 트랜잭션 ID를 부여하여 트랜잭션 ID보다 작은 트랜잭션 번호에서 변경한 것만 읽게 함 (MYSQL)
- Undo 공간에 백업해두고 실제 레코드 값을 변경

<img src="https://nesoy.github.io/assets/posts/img/2019-05-08-22-14-18.png" height=600>

- PHANTOM READ 발생
    - 다른 트랜잭션에서 수행한 변경 작업에 의해 레코드가 보였다가 안 보였다가 하는 현상

### SERIALIZABLE
- 한 트랜잭션에서 읽는 레코드는 공유 잠금 설정
- 다른 트랜잭션에서 데이터 수정 불가