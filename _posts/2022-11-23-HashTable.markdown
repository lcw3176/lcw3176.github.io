---
layout: post
title:  "HashTable"
date:   2022-11-23 12:26:38 +0900
categories: 
---
# HashTable

## 개요
### 용어 정리
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Hash_table_3_1_1_0_1_0_0_SP.svg/330px-Hash_table_3_1_1_0_1_0_0_SP.svg.png">

- 해시(hash): 다양한 길이를 가진 데이터를 고정된 길이를 가진 데이터로 매핑한 **값** (key)
- 해시 테이블(hash table): 키와 값을 매핑해 둔 데이터 **구조**
- 해싱(hashing): 해시함수를 사용하여 주어진 값을 변환한 뒤, 해시 테이블에 저장하고 검색하는 **기법**
- 해시 함수: 임의의 길이를 갖는 임의의 데이터에 대해 고정된 길이의 데이터로 매핑하는 **함수**
- 슬롯, 버킷: 데이터(value)가 저장되는 공간

## 장점
- 리소스 관리
    - 해시 함수를 통한 매핑을 통해 키값 축약
- 인덱스
    - 해시값을 통한 삽입 / 삭제
    - 빠른 접근, 데이터 액세스 O(1)
- 보안
    - 키와 해시값 사이에 직접적 연관 x, 키 복원 어려움

## 단점
### 충돌
- 해시 함수가 서로 다른 입력에 대해 같은 값을 리턴할 수 있음
### 예방법
<img src="https://media.vlpt.us/post-images/cyranocoding/329e7e60-b226-11e9-a4ce-730fc6b3757a/16eBeaqTti8MxWPsw4xBgw.png">

- 체이닝
    - 링크드 리스트 이용
    - 중복되는 버킷을 링크드 리스트로 만듬

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Hash_table_5_0_1_1_1_1_0_SP.svg/570px-Hash_table_5_0_1_1_1_1_0_SP.svg.png">

- 오픈 어드레싱
    - 버킷에 데이터를 직접 전부 저장함
    - 순차적으로 빈 공간 탐색 후 값 저장
 

```python
class HashTableWithChain:
    def __init__(self, size):
        self.bucket = [0 for i in range(size)]
        self.size = size

    def put(self, key, value):
        hash = self.hashFunction(key)
        
        if self.bucket[hash] != 0:
            if type(self.bucket[hash]) == list:
                self.bucket[hash].append(value)
            else:
                temp = self.bucket[hash]
                self.bucket[hash] = []
                self.bucket[hash].append(temp)
                self.bucket[hash].append(value)

        else:
            self.bucket[hash] = value
    def get(self, key):
        hash = self.hashFunction(key)
        return self.bucket[hash]
    
    def hashFunction(self, key):
        return key % self.size

    def show(self):
        print(self.bucket)


hash = HashTableWithChain(10)
for i in range(10):
    hash.put(i, "hello")
print(hash.get(1)) ## hello
hash.put(0, "hello")
hash.show() ## [['hello', 'hello'], 'hello', 'hello', 'hello', 'hello', 'hello', 'hello', 'hello', 'hello', 'hello']
```