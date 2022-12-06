---
layout: post
title:  "Spring-Session"
date:   2022-11-11 14:36:47 +0900
categories:
---
## Spring-Session
- Spring-Session은 필터로 동작
- 톰캣은 클라이언트 별로 Session 객체를 생성, 보관 후 다음 요청시 참조

## 세션 추적 & 생성
- 일반적으로 쿠키를 사용 (JSESSIONID), 유저 식별
- 요청이 있을 때 생성(getSession() 최초 호출 순간)
<img src="https://thecodinglog.github.io/assets/2020-08-06-filter-chain/2020-08-06-filter-chain_173534.png" width=400>

- Spring-Session 필터는 가장 먼저 실행
- 필터 재귀 호출 후, 모든 작업이 끝나면 commitSession()을 통해 세션 정보 저장, 쿠키 전달
- Response 헤더에 Set-Cookie 추가