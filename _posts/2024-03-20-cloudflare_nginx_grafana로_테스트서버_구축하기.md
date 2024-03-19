---
date: 2024-03-20
layout: post
title: cloudflare, nginx, grafana로 테스트서버 구축하기 
categories: [Devops]
image: >-
    https://github.com/lcw3176/lcw3176.github.io/assets/59993347/292dfaa2-4630-4b4f-aceb-0c1ad3d9a449
---

## 테스트 api 서버 구축하기

평소에는 그냥 배포 나가는데 이번에 나갈게 코드 변경이 꽤 많아서 뭔가 후달린다.

마침 개인적으로 쓰던 웹서비스 샤따도 내렸겠다 남는 서버로 테스트 서버를 구축하기로 했다.

## cloudflare

![스크린샷 2024-03-20 001444](https://github.com/lcw3176/lcw3176.github.io/assets/59993347/16cadcb6-9749-4747-8345-b5ba3efd0d26)

먼저 dns records 란으로 들어가서 ip를 잡아준다. 클라우드플레어가 이런건 추가 과금 안해서 좋은 것 같다. 마음에 드는 이름으로 주렁주렁 달아준다.


![스크린샷 2024-03-20 001611](https://github.com/lcw3176/lcw3176.github.io/assets/59993347/bafb93b9-8bcc-445a-a506-81369ba18f9b)

나는 참고로 서버쪽 인증서도 검증하는 설정을 사용중이다. Flexible로 사용하면 nginx 인증서 설정, 그러니까 https쪽 설정은 안해도 작동할 것 같다. 아마도??

나와 같은 설정을 쓰고 도메인 구입을 클라우드플레어에서 진행했다면 아마 어딘가에 인증서 키값을 쟁여놓았을 것이다. 잘 찾아보자.

## nginx

간만에 설치하려니까 까먹어서 찾아봤다. CentOS 7 기준이다.

```sh
sudo vim /etc/yum.repos.d/nginx.repo

[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/7/$basearch/
gpgcheck=0
enabled=1

sudo yum install -y nginx

sudo systemctl start nginx   
sudo systemctl enable nginx
```

기본적으로 설치되면 /etc/nginx 폴더에 설정값들이 존재한다. 인증서를 먹이려면 이것저것 좀 건드려야 한다. 나는 먼저 conf.d 폴더를 만든 후 그 안에 설정값을 따로 쟁여놓는다. 기본 nginx.conf 설정에 보면 conf.d 폴더를 자동 임포트 하는 코드가 이미 존재할 것이다.

```sh
cd /etc/nginx

sudo mkdir conf.d
cd conf.d

sudo vi default.conf

map $http_x_forwarded_for $maintenance {
    default		on;
}
  

server {
    listen 80;
    listen [::]:80;
        
    server_name 내도메인주소 ex) www.naver.com;
 	
    return 301 https://$host$request_uri;
}


server {
    listen 443 ssl;
    server_name 내도메인주소;
    
    ssl on;
    ssl_certificate /etc/nginx/keys/cert.pem;
    ssl_certificate_key /etc/nginx/keys/key.pem;
        
    http2_max_field_size 64k;
    http2_max_header_size 512k;	

		location / {
	
        access_log off;

        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
       	proxy_set_header Connection "upgrade";
        proxy_buffer_size          128k;
        proxy_buffers              4 256k;
        proxy_busy_buffers_size    256k;
	  }
}
```

인증서를 각자 폴더 하나 만들어서 잘 쟁여놓는다. 나는 /etc/nginx/keys 폴더를 하나 만들어서 짱박아놨다. ssl_certificate_key가 프라이빗 키다.

여기서부터 에러 대잔치인데, 보통은 nginx 관련 권한 문제다. chmod 777 같은걸로 잘 해결하고 다녀도 한계점이 있는 부분이 있다. 

```sh
 connect() to 127.0.0.1:3000 failed (13: Permission denied) while connecting to upstream, client: xxx.xxx.xx.xxx, server: 내.도메인,, request: "GET / HTTP/1.1", upstream: "http://127.0.0.1:3000/", host: "내.도메인"
```

/var/log/nginx/error.log 에 위와 같은 로그가 찍히고 502에러가 뜬다면 다음과 같은 커맨드를 입력하자. 참고로 저 로그에 접근이 안되거나 nginx가 기록을 못하는 경우가 있는데 그럴때는 /etc/nginx/nginx.conf 로 가서 user 쪽을 root로 박아버리거나 로그 폴더 권한 바꾸면 된다.

어쨌든 커맨드는 다음과 같다.

```sh
sudo cat /var/log/audit/audit.log | grep nginx | grep denied | audit2allow -M mynginx

sudo semodule -i mynginx.pp
```

만약 방화벽으로 리다이렉트 설정한 부분이 있다면 다 풀어주자. 환경마다 다를테지만 내 기준으로는 아래와 같다.

```sh
sudo firewall-cmd --permanent --remove-forward-port=port=80:proto=tcp:toport=8080:toaddr=

sudo firewall-cmd --permanent --remove-forward-port=port=443:proto=tcp:toport=8080:toaddr=

sudo firewall-cmd --reload
```

이걸 굳이 왜적냐면 그라파나는 위와같은 nginx 조합으로 사용하지 못한다. 그래서 방화벽 리다이렉트 설정도 좀 건드려줘야한다.


## grafana

인증서 먹이는 김에 그라파나도 https로 가보려고 똑같이 nginx로 띄워보니까 경고문이 뜨면서 실행이 되지를 않았다.

리버스 프록시 허용 안함 뭐시기뭐시기 뜨길래 전부 다시 설정했다. 오히려 간단하다.
일단 그라파나 기본 포트로 리다이렉트 시켜준다.

```sh
sudo firewall-cmd --permanent --add-forward-port=port=80:proto=tcp:toport=3000:toaddr=

sudo firewall-cmd --permanent --add-forward-port=port=443:proto=tcp:toport=3000:toaddr=

sudo firewall-cmd --reload
```

그리고 그라파나 yml 값을 건드려줘야한다. 각자의 그라파나 폴더로 가서 /conf/defaults.ini를 수정해준다.

```sh
...

#################################### Server ##############################
[server]
# Protocol (http, https, h2, socket)
protocol = https

....

# The public facing domain name used to access grafana from a browser
domain = 내.도메인.주소

...

# https certs & key file
cert_file = /etc/nginx/keys/cert.pem
cert_key = /etc/nginx/keys/key.pem
...

```

위의 값들을 각자 알맞게 수정해주면 된다. 나는 그냥 nginx 폴더쪽을 바라보게 해놨다.
그라파나를 재시작하면 이제 초록초록한 자물쇠를 확인할 수 있다.



## 참고

- https://stackoverflow.com/questions/58171865/nginx-error-13-permission-denied-while-reading-upstream-on-var-cache-nginx/77552458#77552458

- https://pydole.tistory.com/entry/grafana-https-%EC%A0%91%EC%86%8D%EC%9D%84-%EC%9C%84%ED%95%9C-%EB%B3%B4%EC%95%88%EC%9D%B8%EC%A6%9D%EC%84%9C-%EC%A0%81%EC%9A%A9

- https://deoking.tistory.com/4