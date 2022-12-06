---
layout: post
title:  "Spring Bean Life Cycle"
date:   2022-11-14 14:26:49 +0900
categories: 
---
## 스프링 컨테이너
스프링 컨테이너가 초기화 될 때 빈 객체의 생성도 일어난다.
- 컨테이너 초기화
    - 빈 객체 생성
    - 의존 주입
    - 초기화

컨테이너가 종료될 때에는 빈 객체가 소멸된다.
- 컨테이너 종료
    - 빈 객체 소멸

## 빈 객체의 라이프 사이클
스프링 컨테이너에 이해서 빈 객체는 다음과 같은 순서로 관리된다.
1. 객체 생성
2. 의존 설정
3. 초기화
4. 소멸

여기서 초기화는 InitializingBean 인터페이스를 구현한 afterPropertiesSet() 메소드를 가리킨다.

소멸은 DisposableBean 인터페이스를 구현한 destroy() 메소드로 재정의가 가능하다. 

```
@PostConstruct와 차이점

PostConstruct는 자바 스펙 요구서에 명시된 스펙으로, 
스프링 프레임워크에 의존적이 아니다. 
반면 InitializingBean은 스프링 프레임워크에 종속되는 
인터페이스를 구현하는 방법으로 스프링 프레임워크에 종속된다.
@PreDestroy 또한 마찬가지다
```

