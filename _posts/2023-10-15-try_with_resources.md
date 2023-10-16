---
date: 2023-10-15
layout: post
title: 자바의 try with resources
categories: [Language]
image: >-
    https://github.com/lcw3176/lcw3176.github.io/assets/59993347/a7a8a4fa-1ed4-4399-b83f-12649af029a3
---

## try with resources 란?

try with resources는 자원 반납 코드를 자동으로 실행되도록 지원해주는 문법이다.

파이썬에서는 with, C#에서는 using과 같은 유사한 문법이 존재한다.

## 기존 방식 (try-catch-finally)

### 문제점

```java
public static void main(String args[]) {
    
    FileInputStream is = null;
    BufferedInputStream bis = null;

    try {
        is = new FileInputStream("test.txt");
        bis = new BufferedInputStream(is);
        // 처리...

    } catch(Exception e){
        log.info("에러", e);

    } finally {

        try{
            if (is != null) {
                is.close();
            }

            if (bis != null){
                bis.close();
            } 
        } catch(Exception e) {
            log.info("에러", e);
        }

    }
}

```

기존 방식에서는 null 체크, close() 등의 자원 반납 함수를 직접 호출해야했다.

이러한 방식은 자원 반납 코드를 추가해야하고, 실수로 자원을 반납하지 않거나 
자원 반납 코드에서 에러 발생 시 대처가 힘든 경우 등의 문제점이 존재했다.

이러한 문제점들을 해결하기 위해 try-with-resources 문법이 등장하게 되었다.

### 새로운 방식 (try-with-resources)

```java
public static void main(String args[]) {

    try (FileInputStream is = new FileInputStream("test.txt"); 
        BufferedInputStream bis = new BufferedInputStream(is)) {
        // 처리...
    } catch(Exception e) {
        log.info("에러", e);
    }

}
```

해당 문법을 통해 조금 더 직관적으로 파일스트림에서 발생하는
에러에 대처할 수 있는 코드를 작성할 수 있다.


## 구현 조건

### AutoCloseable

```java

public interface AutoCloseable {

    void close() throws Exception;

}

```

AutoCloseable 인터페이스를 구현해야한다.

해당 인터페이스의 close() 메서드를 구현해주지 않으면 
try-with-resources를 활용해서 자원 해제가 불가능하다.

## 참고

- 망나니개발자, try-with-resources란? try-with-resources 사용법 예시와 try-with-resources를 사용해야 하는 이유, https://mangkyu.tistory.com/217
- 인파, 자바 Try With Resource 예외 처리, https://inpa.tistory.com/entry/JAVA-%E2%98%95-%EC%98%88%EC%99%B8-%EC%B2%98%EB%A6%AC-Try-With-Resource-%EB%AC%B8%EB%B2%95