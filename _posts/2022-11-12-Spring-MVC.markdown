---
layout: post
title:  "Spring-MVC"
date:   2022-11-12 16:32:36 +0900
categories: 
---
# Spring-MVC

## 스프링 MVC 핵심 구성 요소
- DispatcherServlet
- HandlerMapping
- HandlerAdapter
- ViewResolver

## 동작 과정
<img src="https://blog.kakaocdn.net/dn/QrwsU/btqJ8f78gtu/ZT5SB77K9NTqHd0ebncaO1/img.jpg">

1. 웹브라우저 요청
2. DispatcherServlet -> HandlerMapping
    - 요청 URL과 매칭되는 컨트롤러 검색
3. DispatcherServlet -> HandlerAdapter
    - 처리 요청
4. HandlerAdapter <-> 스프링 빈 컨트롤러
    - 실행, 결과 리턴
5. HandlerAdapter -> DispatcherServlet
    - 컨트롤러 실행 결과를 ModelAndView로 변환 후 리턴
6. DispatcherServlet -> ViewResolver
    - 컨트롤러의 실행 결과를 보여줄 View 탐색, 리턴
7. DispatcherServlet -> View
    - 알맞은 View 리턴

