---
layout: post
title:  "Synchronized & Volatile"
date:   2022-11-09 20:06:31 +0900
categories:
---
# Synchronized & Volatile
## 문제 상황
- 멀티 스레드 환경에서 스레드끼리 프로세스의 static 영역과 heap 영역을 공유
- 공유 자원에 대한 동기화 문제

## 해결 방법
- synchronized 키워드가 붙은 메소드, 블럭 등을 lock을 걸어 동기화 시킨다.
- 스레드가 공유하는 변수를 volatile로 선언한다.

## 활용
```java
// 문제의 코드
private static boolean isRunning;

public static void main(String[] args) throws InterruptedException {

    Thread backgroundThread = new Thread(() -> {
        int i = 0;

        while (!isRunning) {
            i++;
        }
    });

    backgroundThread.start();
    isRunning = true;
}
```
- 스레드 간 변수의 동기화가 안됨
- 각자 cpu 캐시 메모리에 가지고 간 값이 다름
- 루프가 언제 정지될 지 장담 불가

```java
// volatile을 활용한 해결
private static volatile boolean isRunning;

public static void main(String[] args) throws InterruptedException {

    Thread backgroundThread = new Thread(() -> {
        int i = 0;

        while (!isRunning) {
            i++;
        }
    });

    backgroundThread.start();
    isRunning = true;
}

```
- volatile로 변수 선언
- CPU 캐시 메모리를 거치지 않고, 메인 메모리(RAM)에서 매번 읽고 쓰기 실행
- 스레드 정지 가능


```java
// synchronized를 활용한 해결
private static boolean isRunning;

public static void main(String[] args) throws InterruptedException {

    Thread backgroundThread = new Thread(() -> {
        int i = 0;

        while (!isRunning) {
            synchronized(i) {
                i++;
            }
        }
    });

    backgroundThread.start();
    isRunning = true;
}

```
- synchronized 블록 진입 전 CPU 캐시 메모리와 메인 메모리의 동기화
- 스레드 정지 가능