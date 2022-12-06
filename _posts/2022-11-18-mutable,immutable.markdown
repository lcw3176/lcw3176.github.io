---
layout: post
title:  "Mutable, Immutable"
date:   2022-11-18 21:26:22 +0900
categories: 
---
# Mutable - Immutable
## String

<div style="text-align:center;">
<img src="https://t1.daumcdn.net/cfile/tistory/99948B355E2F13350F">
<p>출처: https://ifuwanna.tistory.com/221</p>
<image src="https://dz2cdn1.dzone.com/storage/temp/14332760-java-7-8-memory.jpg">
<p>출처: https://dzone.com/articles/native-memory-may-cause-unknown-memory-leaks</p>
</div>

- String은 Metaspace 영역에서 관리됨.
- 기존의 heap에서 native 메모리 영역으로 옮김
- os 레벨에서 관리하므로, 메모리 확보가 용이해짐

```java
  public static void main(String[] args) {
        String immutable = "hello";
        String shallowCopy = immutable;
        String immutable1 = "hello";
        String staticImmutable = new String("hello");
        String constant = "constant";
        String staticConstant = new String("constant");
        String constant2 = "constant";
        String brandNew = new String("good");
        String brandNewGood = new String("good");
        String brandNewTwo = new String("goodTwo");
        String brandNewGoodTwo = new String("goodTwo");

        printHash(
                immutable, shallowCopy, immutable1, staticImmutable,
                constant, staticConstant, constant2,
                brandNew,brandNewGood,
                brandNewTwo, brandNewGoodTwo);
    }

    public static void printHash(String... data){

        for(String i : data){
            System.out.print("데이터: " + i + "  ");
            System.out.print("해시코드: " + i.hashCode() + "  ");
            System.out.println("객체주소: " + System.identityHashCode(i));
        }

    }
```
```java
## result

데이터: hello       해시코드: 99162322      객체주소: 2129789493
데이터: hello       해시코드: 99162322      객체주소: 2129789493
데이터: hello       해시코드: 99162322      객체주소: 2129789493
데이터: hello       해시코드: 99162322      객체주소: 668386784
데이터: constant    해시코드: -567811164    객체주소: 1329552164
데이터: constant    해시코드: -567811164    객체주소: 363771819
데이터: constant    해시코드: -567811164    객체주소: 1329552164
데이터: good        해시코드: 3178685       객체주소: 2065951873
데이터: good        해시코드: 3178685       객체주소: 1791741888
데이터: goodTwo     해시코드: 207008847     객체주소: 1595428806
데이터: goodTwo     해시코드: 207008847     객체주소: 1072408673
```

- 대표적인 Immutable 객체
- 큰따옴표("")로 선언된 String
    - String pool에 문자열 등록
    - 같은 값이면 계속 참조
- 생성자(new)로 선언된 String
    - 별개의 String을 생성
- 다른 패턴의 문자열 반복 연산 작업 등은 피해야 함
- 같은 값의 빈번한 조회 시 사용

## StringBuilder, StringBuffer
<div style="text-align:center;">

<img src="https://t1.daumcdn.net/cfile/tistory/9923A9505E2F133608">
<p>출처: https://ifuwanna.tistory.com/221</p>
</div>

### 공통점
- mutable 객체
- 동일 객채 내에서 문자열 변경 가능
- 추가, 수정, 삭제 빈번한 작업 시 사용

### 차이점
- StringBuilder
    - 동기화 X
    - 성능 상대적으로 좋음

- StringBuffer
    - 내부 메소드에 synchronized 붙어있음, 동기화 O
    - 성능 상대적으로 안좋음