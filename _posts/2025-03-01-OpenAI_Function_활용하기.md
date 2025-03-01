---
date: 2025-03-01
layout: post
title: OpenAI Function 활용하기
categories: [Backend]
image: >-
    https://github.com/user-attachments/assets/4032a923-655d-497f-9041-f02b102dd1ad
---

## 스카이넷

어릴때 터미네이터 비디오를 빌려서 봤던 기억이 난다.

주요 골자는 인간이 개발한 스카이넷이라는 군사용 ai가 인간을 적으로 간주해서 온 지구에 핵잔치를 벌이고, 
인류는 이런 ai, 로봇과 싸우는 공상과학 영화다.

그런데 요즘 드는 생각은 어쩌면 가능한 미래이지 않을까 싶다. 
스타워즈 같은건 뭔가 미래라는 생각도 잘 안드는데 말이다. 지금부터라도 ai에게 좋은 인상을 심어줘야 하나 싶다. 
그래야 매트릭스마냥 인간 빠떼리 신세라도 면하지 않을까? 

어쨌든 이런 얘기를 왜 했냐면, 생각보다 ai가 굉장히 똘똘하다고 느꼈기 때문이다.

## tool

openai에게 도구를 사용할 수 있게 하는 옵션이 있다.
특정 함수들을 언제 사용해야 하는지 설명을 입력해주고, 파라미터에 대한 설명도 같이 보내준다.
그러면 유저 채팅에 따라서 그냥 메세지로 대답을 해야 하는지, 아니면 주어진 함수를 이용할 지 자기가 판단한 후에 적절한 값을 리턴해준다.

이전에 비슷한 기능을 사내 챗봇을 만들 때 구현해 본 적이 있다.
그때는 이런 기능을 몰라서 프롬프트를 이용해 제어했다. 
특정 문맥을 감지하고, 트리거가 발동되면 json 포맷을 리턴, 데이터를 꺼내와서 활용하는 방식으로 구현했다.

상당히 번거롭기도 하고 얘가 말하는 대로 잘 뱉지도 않아서 샘플 데이터를 대화마다 낑겨 넣어주는 등 상당히 귀찮은 작업이었는데 
이걸 스스로 해버리다니 ai에 대체될 날이 머지 않은 것 같다. 어쨌든 사용 방식을 알아보자. 

```python

    payload = {
        "messages": [

        ],
        "temperature": 0.1,
        "top_p": 0.8,
        "max_tokens": 2048,
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "help_template",
                    "description": "사용자가 챗봇의 사용법에 대해 잘 알지 못하는 경우 사용됩니다....",
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_all_ticker",
                    "description": "유저가 분석 가능한 주식 종목의 이름에 대해 알고 싶어할 때 사용...",
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "search_document",
                    "description": "사용자가 내부 문서 탐색이나 사내 규정에 대해 질문할 때 사용...",
                }
            },
            # ...
        ]
    }

    # ...

    async with aiohttp.ClientSession() as session:
        async with session.post(end_point, headers=header, json=payload) as response:
            response.raise_for_status()
            res = await response.json()

            if res['choices'][0]['message']['content']:
                return res['choices'][0]['message']['content']

            return res['choices'][0]['message']['tool_calls']
```

페이로드에 어떤 상황에 어떤 함수를 사용해야 하는지 설명을 적어주면 된다. 파라미터 정보도 같이 기입할 수 있고, 값의 범위를 지정해주면 유저가 대충 말해도 알아서 맥락 파악 후 올바른 파라미터로 찰떡같이 수정해주기도 한다. 

요청을 보내면 두 가지 케이스로 나뉘는데, 도구를 사용하는 상황이면 도구에 대한 정보만 리턴되고 사용하지 않는다고 판단되면 일반적인 ai의 응답이 리턴된다.

## 어떻게 활용하나?

우리가 기존에 온갖 코드로 가지치기 했던 케이스들을 ai가 1차적으로 걸러준다고 생각하면 편하다. 가령 !명령어 이런 포맷으로 특정 명령어를 입력하고, 우리가 서브스트링해서 커맨드를 처리했다면 그 과정을 조금 더 자연스럽게 처리할 수 있게 되었다고 생각하면 좋을 것 같다.

나는 사내 봇에다가 주식, 코인 데이터 분석 기능을 동의없이(?) 넣어버렸다. 잘 써서 다같이 부자되면 해피엔딩 아니겠는가. 아래 사진들과 같이 일반적인 대화를 통해서 사전에 지정된 다양한 명령 처리가 한결 쉬워졌다.

![Image](https://github.com/user-attachments/assets/e689a029-ab74-4fde-ae34-16b5c462c574)

![Image](https://github.com/user-attachments/assets/5cf49e0c-837a-4d9b-be6d-3045d9d504ca)

![Image](https://github.com/user-attachments/assets/
f1bb9d0e-14d1-4187-9211-aaf725edd006)

이제 부자 될 일만 남은 것인가?