---
layout: post
title:  "ArrayList"
date:   2022-11-30 11:22:31 +0900
categories: 
---
# ArrayList

## 개요, 특징
* 배열을 이용한 리스트
* 가변 길이
* 연속된 메모리 공간 활용, LinkedList에 비해 메모리 절약
* 저장된 데이터를 검색을 자주 하는 상황에 적합 

## 장점
* 검색
    - O(1) 
    - 인덱스를 통한 접근
* 가변 길이
    - 크기에 신경쓰지 않아도 됨

## 단점
* 추가
    - O(n)
    - 한 칸씩 뒤로 미뤄야함
* 삭제
    - O(n)
    - 한 칸씩 앞으로 땡겨야함

## 기타
* 자바에서는 제네릭 타입 지정 가능
```Java
ArrayList<Integer> list = new ArrayList<Integer>();
```

* C#에서는 박싱, 언박싱 과정 거쳐야함. 타입을 강제할 땐 List 사용
```C#
// 박싱, 언박싱 필연적 -> 속도 저하
ArrayList list = new ArrayList();

// 타입 지정 -> 속도 향상, 디버깅 편의성
List<int> list = new List<int>(); 
``` 

```python
from c_array import Array


class ArrayList:
    def __init__(self):
        self.count = 10
        self.index = 0
        self.arr = Array(self.count)


    def get(self, index):
        if index >= self.index:
            raise Exception("인덱스 초과")

        return self.arr[index]


    def remove(self, index):
        self.arr[index] = None
        for i in range(index, len(self.arr) - 1):
            self.arr[i] = self.arr[i + 1]

        self.index = len(self.arr) - 1


    def contains(self, element):
        for i in self.arr:
            if i == element:
                return True
        
        return False


    def add(self, element):
        if self.index >= self.count:
            self.count *= 2
            temp = self.arr
            self.arr = Array(self.count)

            for i in range(len(temp)):
                self.arr[i] = temp[i]
        
        self.arr[self.index] = element
        self.index += 1


    def clear(self):
        for i in range(len(self.arr)):
            self.arr[i] = None
        
        self.index = 0
    

    def size(self):
        return len(self.arr)
    

    def indexOf(self, element):
        for i in range(0, self.index):
            if self.arr[i] == element:
                return i
        return -1


    def display(self):
        self.arr.display()

```

```python
class Array:
    def __init__(self, size):
        self.arr = [None for i in range(size)]
        self.size = size

    def __getitem__(self, key):
        if key > self.size:
            raise Exception("잘못된 인덱스로 값에 접근") 
        return self.arr[key]

    def __setitem__(self, key, value):
        if key > self.size:
            raise Exception("인덱스 초과")
        
        self.arr[key]= value
    
    def __len__(self):
        count = 0
        for i in self.arr:
            if i == None:
                break
            count += 1
        
        return count

    def display(self):
        temp = []
        for i in self.arr:
            if i == None:
                break
            temp.append(i)
        print(temp)


```