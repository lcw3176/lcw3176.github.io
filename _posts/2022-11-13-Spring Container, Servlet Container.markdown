---
layout: post
title:  "Spring Container, Servlet Container"
date:   2022-11-13 12:23:32 +0900
categories:
---
# Spring Container, Servlet Container


## Servlet
- 서블릿 프로그램 개발 시 구현해야 하는 메서드가 선언된 인터페이스, 표준

### GenericServlet
- Servlet 인터페이스를 상속, 클라이언트-서버 환경에서 서버단의 애플리케이션으로서 필요한 기능을 구현한 추상클래스
- service 메서드를 제외한 모든 메서드 재정의, 적절한 기능으로 구현함

### HttpServlet
- 일반적으로 언급되는 서블릿, HttpServlet을 상속받은 서블릿.
- HttpServlet은 GenericServlet을 상속받음
- service를 HTTP 프로토콜 요청 메서드에 적합하게 재구현해놓음.(GET, POST, DELETE...)

### 특징
- 서블릿에 의해 사용자가 정의한 서블릿 객체가 생성되고 호출되고 사라짐
- 프로그램에 의해 객체들이 관리됨, IoC(Inversion Of Control)


## Servlet Container
- servlet의 생성 ~ 소멸까지 라이프 사이클 관리
- 요청이 들어올 때 마다 새로운 자바 쓰레드 생성

### 동작 과정
<img src="https://media.vlpt.us/images/ieed0205/post/664520a5-7c57-4653-9692-338a81e6c7ad/33.png">

1. 사용자 요청 -> servlet container로 전송
2. container는 HttpServletRequest, HttpServletResponse 객체 생성
3. url 파싱, 조건에 맞는 서블릿 탐색
4. 서블릿 service 메소드 호출, get/post 여부에 따라 메소드 호출
5. 동적 페이지 생성 후 response 응답
6. httpServletRequest, httpServletResponse 객체 소멸

### 생명 주기
- init(): 서블릿 최초 요청시 한번 실행
- service: 요청 처리(request{get/post}, response)
- destroy(): 서버 종료 시 한번 실행

### 역할
- HTTP 요청을 받아 처리
- 웹 프레임워크 기본 기능이 구현되어 있음.
- 대부분의 웹 프레임워크들은 서블릿 컨테이너 위에서 동작하는 서블릿, 필터, 이벤트 리스너 등을 적절하게 구현한 것.


## Spring Container
- Bean의 라이프 사이클 관리
- BeanFactory, ApplicationContext
- ApplicationContext는 BeanFactory를 상속

### 동작 과정
1. 실행 시 WAS에 의해 web.xml 로딩
2. web.xml에 등록된 ContextLoaderListener가 생성됨. ContextLoaderListener는 ServletContextListener 인터페이스 구현, ApplicationContext 생성하는 역할
3. ContextLoaderListener는 applicationContext.xml 로딩
4. applicationContext.xml에 등록된 설정에 따라 Spring Container 구동. (SERVICE, DAO, VO 객체들 생성)
5. 클라이언트 요청
6. DispatcherServlet(Servlet) 생성, FrontController 역할 수행. 요청을 분석하여 알맞은 PageController에 전달.
PageController가 실질적인 작업, HandlerMapping, ViewResolver 가 해당됨
7. DispatcherServlet은 servlet-context.xml(spring-mvc.xml) 로딩
8. 두번째 Spring Container가 구동되면 응답에 맞는 PageController들이 동작. 첫번째 Spring Container가 구동되면서 생성된 DAO, VO, Service 클래스들과 협업하여 알맞은 작업을 처리.


### Spring boot의 DispatchServlet
- 스프링 부트에서 구현한 서블릿
- FrontController 역할

```java
## FrontController 동작 방식
## 제일 앞단에 배치되어 각각의 컨트롤러에 매칭

public class FrontController extends HttpServlet { 
    HashMap<String, Controller> controllerUrls = null; 
    
    @Override 
    public void init(ServletConfig sc) throws ServletException {
         controllerUrls = new HashMap<String, Controller>(); 
         controllerUrls.put("/memberInsert.do", new MemberInterController()); 
         controllerUrls.put("/memberDelete.do", new MemberDeleteController()); 
    } 
         
    public void service(HttpServletRequest request, HttpServletResponse response) { 
             String uri = request.getRequestURI(); 
             Controller subController = controllerUrls.get(uri);
             subController.execute(request, response); 
    } 
}

```

