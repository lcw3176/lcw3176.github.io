---
date: 2023-03-08
layout: post
title: 가상 메모리
subtitle: '가상 메모리의 사용 이유, 그로 인한 이점'
description: >-
image: >-
  https://cdn.pixabay.com/photo/2020/04/08/16/32/keyboard-5017973_960_720.jpg
category: cs
author: coldrain
---
## Index

### 소개

가상 메모리는 메모리 관리 기법 중 하나로, 
각 프로그램에 실제 메모리 주소가 아닌 가상의 메모리 주소를 주는 방식이다.
프로세스가 직접 메모리 주소를 통해 접근하는 것을 방지하여 보안 및 자원 관리에
용이하다. 
 


### 사용 이유

![pagefault](https://cdn.techloris.com/app/uploads/2018/06/page-fault.png)


가상 메모리 사용 시 보안 향상 및 메모리 장치에 대한 의존성이 사라지고 
프로세스는 물리 메모리의 크기에 구애받지 않고 메모리 사용이 가능하다.
만약 잘못된 주소에 접근 할 경우, 
즉 가상 메모리의 페이지 테이블에 매핑된 물리 주소 정보가 없는 경우 
다음과 같은 에러를 만날 수 도 있다.

### 작동 방식

![메](https://user-images.githubusercontent.com/59993347/223632058-bab43832-c64e-4c84-9df0-64c04a7c436e.jpg)

프로세스는 자신이 사용하는 각각의 메모리 주소에 대한 정보를 가지고 있다.
예를 들어서 Process 1, Process 2, Process 3이 존재한다고 해보자.
만약 Process 1과 Process 2 둘 다 0번지 주소에 접근을 요청하면,
실제 물리 메모리의 같은 영역에 접근하게 되는 것일까?
답은 아니다. 

커널에는 메모리 매니저가 존재하는데, 이 메모리 매니저가 동적 주소 변환을 통해 
각 프로세스가 요청한 메모리 주소와 실제 메모리 주소를 매핑시켜 준다.  


![메모리](https://user-images.githubusercontent.com/59993347/223631226-73cc12bf-cb96-4695-8263-df040f097a22.jpg)

운영체제는 위와 같은 배열로 구성된 매핑 테이블을 가지고 있는데, 
이를 통해 프로세스는 실제 데이터가 램 or 하드디스크에 스왑되어 있는 상태인지
알 필요 없이 액세스를 요청할 수 있다.

### 이점

만약 프로세스가 오작동으로 인해 정지되었다고 치자.
이 때 OS에서는 해당 프로세스와 관련된 메모리 정보를 가지고 있기 때문에,
신속히 관련된 메모리 공간을 회수할 수 있다.

만약 가상 메모리 쳬계 없이 프로세스가 직접 메모리 주소를 관리하는 상황에서,
해당 프로세스가 오작동으로 인해 지속적으로 종료 & 재시작을 반복한다면
관련된 메모리 공간을 회수하지 못 할 것이고
점점 사용 가능한 메모리 용량이 줄어들게 된다.






#### 참고

- 위키백과, 가상메모리, https://ko.wikipedia.org/wiki/가상_메모리
- 조성호, 『쉽게 배우는 운영체제』, 한빛아카데미(2018)
- 널널한 개발자 TV, 가상 메모리 개요, https://www.youtube.com/watch?v=-jlzaslp-w4
- 널널한 개발자 TV, 가상 메모리 페이징 기법의 구현, https://www.youtube.com/watch?v=X6tLar-qNHE
- 한빛미디어, 가상메모리(1), https://www.youtube.com/watch?v=p1CTX5L_loc
- 한빛미디어, 가상메모리(2), https://www.youtube.com/watch?v=lvJERadRnSU


