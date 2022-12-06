---
layout: post
title:  "LinkedList"
date:   2022-11-19 13:25:32 +0900
categories: 
---
# LinkedList

## 개요, 특징
* 노드들로 이어진 리스트
* 시작 노드 head, 끝 노드 tail로 구성
* 가변적 길이. 배열 재할당, 값 복사 불필요
* 데이터를 자주 저장, 삭제하는 상황에 적합

## 장점
*  삽입 
    - O(1)
    - tail에 node추가
* 삭제
    - O(1)
    - node가 가리키는 포인터만 변경하면 끝 (next)
## 단점
* 검색
    - O(n)
    - arrayList에 비해 비교적 느림
* 용량
    - Node로 인한 저장 공간 낭비

## 기타
* 자바 제네릭 사용 가능, 재량
```Java
// Object로 선언됨
LinkedList list = new LinkedList(); 

// 타입 설정
LinkedList<Integer> numList = new LinkedList<Integer>(); 
```

* C# 제네릭 사용, 이중 연결 리스트로 내부 구현
```C#
// 이중 연결
// AddBefore(), AddAfter() 등 특정 노드 앞,뒤 노드 추가 가능
LinkedList<string> list = new LinkedList<string>(); 
list.AddLast("hello");
list.AddLast("new");
list.AddLast("world");

LinkedList<string> foundNode = list.Find("new");
LinkedList<string> newNode = new LinkedList<string>("Monsieur");

list.AddAfter(foundNode, newNode);
``` 


```python

class Node:
    def __init__(self):
        self.data = None
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None
        self.tail = Node()
        self.length = 0
    

    def __add_first(self, data):
        first_node = Node()
        first_node.data = data
        first_node.next = self.tail
        
        self.head = first_node
        self.length += 1


    def __add_last(self, data):
        new_tail_node = Node()

        self.tail.data = data
        self.tail.next = new_tail_node
        self.tail = self.tail.next
        
        self.length += 1


    def add(self, data):
        if self.head == None or self.head.data == None:
            self.__add_first(data)
        else:
            self.__add_last(data)
    

    def get(self, index):
        if index >= self.length or self.length == 0:
            raise Exception("인덱스 초과")
        
        node = self.head
        for _ in range(index):
            node = node.next
        
        return node.data


    def remove(self, index):
        if index >= self.length or self.length == 0:
            raise Exception("인덱스 초과")
        
        count = 0
        node = self.head
        prev = None

        while count != index:
            prev = node
            node = node.next
            count += 1
        
        if node == self.head:
            self.head = node.next
        else:
            prev.next = node.next

        self.length -= 1


    def contains(self, element):
        node = self.head
        for _ in range(self.length):
            if node.data == element:
                return True
            node = node.next
        
        return False


    def clear(self):
        for _ in range(self.length):
            self.remove(0)


    def size(self):
        return self.length


    def indexOf(self, element):
        node = self.head
        index = 0

        for _ in range(self.length):
            if node.data == element:
                return index
            index += 1
            node = node.next
        
        return -1


    def display(self):
        node = self.head
        while node.data != None:
            print(node.data, end=" ")
            node = node.next
        print()
```