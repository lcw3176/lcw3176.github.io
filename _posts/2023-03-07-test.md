---
date: 2023-03-07
layout: post
title: 데이터베이스 인덱스
subtitle: 'DB 인덱스의 목적 및 장단점, 내부 구현'
description: >-
image: >-
  https://upload.wikimedia.org/wikipedia/commons/c/cb/Postgres_Query.jpg
category: cs
author: coldrain
---
## Index

### 소개
인덱스는 테이블의 컬럼 색인화, 책의 목차 기능을 제공한다.
데이터 정렬 후 별도의 메모리 공간에 저장하는데, 이 형태는 컬럼 값(key), 물리 주소(value)로 설정된다.

### 목적

|first_name|age|
|---|----|
|kim|15|
|lee|30|
|park|25|
|lee|20|
|park|10|

다음과 같은 자료가 있다고 가정해보자. 만약 인덱스가 없다면 다음과 같은 쿼리를 실행했을 경우
데이터베이스를 모두 스캔해야 한다.

```sql
SELECT first_name FROM 'TABLE' WHERE age = 20
```

하지만 인덱스가 있다면, 인덱스 테이블에서 해당 자료의 위치를 빠르게 찾아
결과를 빠르게 탐색할 수 있다. 
인덱스 존재 유무에 따른 속도 테스트를 진행해 보았다.
코드는 다음과 같다.

#### Entity 

```java

@Table(indexes = {@Index(name = "test_index",columnList = "first_name")}) 
// 해당 어노테이션을 기입, 제거하는 방식으로 진행했다. 

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class TestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;
}

```

#### Test Code

```java

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class DBTest {

    @Autowired
    private TestRepository testRepository;

    @BeforeAll
    void init(){
        for(long i = 0; i < 1000000; i++){
            TestEntity test = TestEntity.builder()
                    .firstName("kim" + i)
                    .build();
            testRepository.save(test);
        }

    }

    @AfterAll
    void release(){
        testRepository.deleteAll();
    }

    @ParameterizedTest
    @ValueSource(ints = {1,2,3,4,5,6,7,8,9,10})
    void test(int count){
        testRepository.findByFirstName("kim" + count);
    }
}


```

결과는 다음과 같다.

#### 인덱스 존재

![인덱스](https://user-images.githubusercontent.com/59993347/223391966-0e9b8fbb-e417-4d90-8256-40a3ee7aa521.jpg)

#### 인덱스 없음

![없음](https://user-images.githubusercontent.com/59993347/223391971-77917186-3b1a-4c44-a456-ac807c244f20.jpg)


인덱스의 존재 유무에 따라 차이가 확연한 것을 볼 수 있다.

### 장점
- 검색 속도 및 성능 향상(조건부)

인덱스는 정렬된 형태의 데이터를 가지기 때문에, 인덱스를 통해 테이블 검색 속도가 향상되고
이는 전반적인 어플리케이션의 성능 향상으로 이어질 수 있다. 하지만 반드시 인덱스를 설정한다고
모든 프로그램의 성능이 좋아지리라는 보장은 없다.

### 단점

- 잦은 데이터 수정 시 성능 저하

테이블의 데이터를 수정 시 인덱스의 내용도 수정되어야 한다.
이는 삽입 및 수정이 빈번한 경우에는 오히려 더 큰 부하로 작용할 수 있다.

- 데이터 제거 시 인덱스는 제거되지 않음

테이블에서 데이터가 삭제되어도, 인덱스 테이블에서는 '사용하지 않음' 처리 후 데이터를 남겨둔다고 한다.
이는 실제 데이터에 비해 인덱스 과도하게 커지는 문제점이 발생할 수 있다.
    
- 검색 성능 저하

인덱스를 잘못된 컬럼에 걸어 놓으면 오히려 성능이 저하될 수 있다.
나이, 성별과 같은 값의 범위가 좁은 경우에는 인덱스를 확인해도 
어차피 다시 많은 데이터를 조회해야 하기 때문이다.
        

### 사용하면 좋은 경우

데이터의 수정 및 삭제가 자주 발생하지 않으며,
검색과 같은 조회가 잦고, 
데이터의 중복도가 낮은 컬럼을 인덱스로 사용하면 큰 효과를 볼 수 있다. 

### 내부 구현

key, value로 이루어져 있기 때문에 해시테이블 같은 자료구조를 떠올리기 쉬우나, 
해시테이블의 특성상 등호(==) 연산에만 최적화 되어있고, 부등호(>, <) 연산에는 취약하므로 잘 사용되지 않는다고 한다.
실제 구현은 검색 범위를 좁히기도 쉽고, 범위 검색에도 좋은 B+ 트리를 사용한다고 한다.

### B+ Tree

<img src="https://camo.githubusercontent.com/f4a6165729ef1d76597d61a10eb70769e311578aa83da67a5bce7d54cdacca8e/68747470733a2f2f696d67312e6461756d63646e2e6e65742f7468756d622f523132383078302f3f73636f64653d6d746973746f72793226666e616d653d6874747073253341253246253246626c6f672e6b616b616f63646e2e6e6574253246646e253246624141524243253246627472644479646f5570372532463968344b4f58425279444e4b704b4441653275677130253246696d672e706e67">

B+ 트리는 오직 leaf node에만 데이터를 저장한다.
leaf node가 아닌 node에서는 자식의 포인터만 저장하고,
특정 key 에 접근하기 위해서는 leaf node까지 가야 한다.
그리고 leaf node끼리는 Linked list로 연결되어 있는데, 이를 통해
효율적인 순차 검색, 부등호 연산이 가능해지게 된다.


#### 참고
- https://www.youtube.com/watch?v=iNvYsGKelYs

