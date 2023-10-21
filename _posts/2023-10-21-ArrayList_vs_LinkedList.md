---
date: 2023-10-21
layout: post
title: ArrayList vs LinkedList
categories: [Language]
image: >-
    https://github.com/lcw3176/lcw3176.github.io/assets/59993347/c6415da7-68f5-4dbe-aa08-8a53142c379c
---

## ArrayList란?

ArrayList는 크기가 가변적으로 변하는 리스트이다. 
일반적인 배열로 데이터를 다룰 때에는 처음 설정한 사이즈 그대로 다뤄야 한다는 불편함이 있지만, 
ArrayList는 데이터 크기에 따른 배열의 사이즈를 내부에서 자동으로 관리해준다.


## 내부 구현

### 생성자

```java

private static final Object[] EMPTY_ELEMENTDATA = {};
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
// ...


public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {
        this.elementData = EMPTY_ELEMENTDATA;
    } else {
        throw new IllegalArgumentException("Illegal Capacity: " + initialCapacity);
    }
}

public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

public ArrayList(Collection<? extends E> c) {
    Object[] a = c.toArray();
    if ((size = a.length) != 0) {
        if (c.getClass() == ArrayList.class) {
            elementData = a;
        } else {
            elementData = Arrays.copyOf(a, size, Object[].class);
        }
    } else {
        // replace with empty array.
        elementData = EMPTY_ELEMENTDATA;
    }
}

```

크기를 지정해서 생성해 줄 수 있으며, 별도로 지정하지 않으면 빈 배열로 초기화된다. 
만약 다른 타입의 컬렉션을 매개변수로 넣어준다면 해당 값을 복사해서 저장한다.

### 삽입(끝)

```java

public boolean add(E e) {
    modCount++;
    add(e, elementData, size);
    return true;
}

private void add(E e, Object[] elementData, int s) {
    if (s == elementData.length)
        elementData = grow();
    elementData[s] = e;
    size = s + 1;
}

```

리스트의 맨 마지막에 데이터를 삽입할 경우 먼저 modCount를 증가시킨다.
아마 modifyCount의 줄임말로 추측되는데, expectedModCount와 비교하며 데이터의 예상하지 않은
수정 여부를 판별하는 변수이다.

그리고 내부에 private 메서드로 정의된 add를 호출하는데, 
만약 더 이상 데이터를 추가할 공간이 없다면 grow() 메서드를 통해 배열을 키우고 데이터를 저장한다.

그렇다면 grow() 메서드는 어떻게 동작하는지 알아보자.


```java
private static final int DEFAULT_CAPACITY = 10;
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
// ...

private Object[] grow(int minCapacity) {
    return elementData = Arrays.copyOf(elementData,
                                    newCapacity(minCapacity));
}


private int newCapacity(int minCapacity) {
       
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1);

    if (newCapacity - minCapacity <= 0) {
        if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
            return Math.max(DEFAULT_CAPACITY, minCapacity);
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return minCapacity;
    }

    return (newCapacity - MAX_ARRAY_SIZE <= 0)
        ? newCapacity
        : hugeCapacity(minCapacity);
}

private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0)
        throw new OutOfMemoryError();
    return (minCapacity > MAX_ARRAY_SIZE)
        ? Integer.MAX_VALUE
        : MAX_ARRAY_SIZE;
}
```

기존 데이터를 복사하면서 배열 사이즈를 키우는데, 여기서 비트연산자가 사용된다.

예를 들어 현재 내부 배열의 크기가 32라면 오른쪽 시프트 연산을 통해 16만큼의 공간을 추가한다.
쉽게 생각하면 현재 크기의 절반만큼 새롭게 공간을 추가한다고 보면 될 것 같다.

### 삽입(중간)

```java
public void add(int index, E element) {
    rangeCheckForAdd(index);
    modCount++;
    final int s;
    Object[] elementData;
    if ((s = size) == (elementData = this.elementData).length)
        elementData = grow();
    System.arraycopy(elementData, index,
                    elementData, index + 1,
                    s - index);
    elementData[index] = element;
    size = s + 1;
}
```

arrayList의 중간에 데이터를 추가할 때 차이점이 있다면 매번 배열이 새롭게 복사된다는 점이다.

맨 끝에 데이터를 추가할 때에는 현재 배열에 여유공간이 없을 때만 배열이 새로 생성되고, 공간이 있다면
인덱스를 통한 빠른 추가가 가능했지만 중간에 데이터를 추가할 시 새로 추가된 자리 뒷쪽의 데이터는 전부 다 한칸씩
위치를 뒤로 이동해주어야 하기 때문에 데이터 복사가 일어나고, 이는 성능에 악영향을 끼칠 수 있다.

### 삭제

```java
public E remove(int index) {
    Objects.checkIndex(index, size);
    final Object[] es = elementData;

    @SuppressWarnings("unchecked") E oldValue = (E) es[index];
    fastRemove(es, index);

    return oldValue;
}


public boolean remove(Object o) {
    final Object[] es = elementData;
    final int size = this.size;
    int i = 0;
    found: {
        if (o == null) {
            for (; i < size; i++)
                if (es[i] == null)
                    break found;
        } else {
            for (; i < size; i++)
                if (o.equals(es[i]))
                    break found;
        }
        return false;
    }
    fastRemove(es, i);
    return true;
}

// ...
private void fastRemove(Object[] es, int i) {
    modCount++;
    final int newSize;
    if ((newSize = size - 1) > i)
        System.arraycopy(es, i + 1, es, i, newSize - i);
    es[size = newSize] = null;
}
```

데이터를 삭제하는 remove 메서드도 add와 비슷한 메카니즘으로 작동한다.

해당 데이터를 제외한 범위로 새로 배열을 복사한다.

### 탐색

```java
public E get(int index) {
    Objects.checkIndex(index, size);
    return elementData(index);
}

E elementData(int index) {
    return (E) elementData[index];
}

// ...

public int indexOf(Object o) {
    return indexOfRange(o, 0, size);
}

int indexOfRange(Object o, int start, int end) {
    Object[] es = elementData;
    if (o == null) {
        for (int i = start; i < end; i++) {
            if (es[i] == null) {
                return i;
            }
        }
    } else {
        for (int i = start; i < end; i++) {
            if (o.equals(es[i])) {
                return i;
            }
        }
    }
    return -1;
}

```

인덱스를 통해 빠르게 데이터에 접근, 값을 반환한다.

특정 값에 해당하는 인덱스를 찾을때도 for문을 통해 배열을 빠르게 순회한다.

## LinkedList란?

LinkedList 또한 데이터를 저장하는 리스트이다. 
각각의 노드가 관련 데이터와 다음 노드에 대한 포인터를 가지고 있다.

## 내부 구현

### 생성자

```java

transient int size = 0;
transient Node<E> first;
transient Node<E> last;

public LinkedList() {
}


public LinkedList(Collection<? extends E> c) {
    this();
    addAll(c);
}

// ..

private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;

    Node(Node<E> prev, E element, Node<E> next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}
```

arrayList에 비하면 매우 단순하다.

linkedList에서는 시작 노드와 마지막 노드에 대한 정보만 가지고 있고, 
각각의 노드는 이전 노드와 다음 노드에 대한 정보를 가지고 있다.

### 삽입(끝)
```java
public boolean add(E e) {
    linkLast(e);
    return true;
}

// ..

void linkLast(E e) {
    final Node<E> l = last;
    final Node<E> newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
}
```
상황에 따라 노드를 배정한다.

만약 현재 첫번째 노드에 대한 정보가 없다면 데이터가 추가되지 않은것이므로 첫번째 노드로 추가하고,
정보가 존재한다면 linkedList가 관리하는 마지막 노드에 대한 정보를 교체해준다

### 삽입(중간)

```java
public void add(int index, E element) {
    checkPositionIndex(index);

    if (index == size)
        linkLast(element);
    else
        linkBefore(element, node(index));
}

Node<E> node(int index) {
        
    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
        Node<E> x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}

void linkBefore(E e, Node<E> succ) {
    // assert succ != null;
    final Node<E> pred = succ.prev;
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}
```

이 과정은 arrayList에 비해 효과적인데, 데이터를 삽입하려는 인덱스의 노드를 찾은 후
새로운 노드를 해당 노드를 바라보도록 포인터 정보만 교체해준다.

arrayList는 인덱스 정보를 변경하기 위해 배열을 다시 배치하는 과정을 거쳤지만,
linkedList는 보다 효과적으로 데이터 삽입을 하고 있다.

### 삭제

```java
public boolean remove(Object o) {
    if (o == null) {
        for (Node<E> x = first; x != null; x = x.next) {
            if (x.item == null) {
                unlink(x);
                return true;
            }
        }
    } else {
        for (Node<E> x = first; x != null; x = x.next) {
            if (o.equals(x.item)) {
                unlink(x);
                return true;
            }
        }
    }
    return false;
}


E unlink(Node<E> x) {
    final E element = x.item;
    final Node<E> next = x.next;
    final Node<E> prev = x.prev;

    if (prev == null) {
        first = next;
    } else {
        prev.next = next;
        x.prev = null;
    }

    if (next == null) {
        last = prev;
    } else {
        next.prev = prev;
        x.next = null;
    }

    x.item = null;
    size--;
    modCount++;

    return element;
}
```

해당 데이터의 참조를 끊은 후, 주변 데이터의 포인터를 다시 연결시켜주는 방식으로 작동하고 있다.

### 탐색
```java
public E get(int index) {
    checkElementIndex(index);
    return node(index).item;
}

Node<E> node(int index) {
        
    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
        Node<E> x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}

// ..

public int indexOf(Object o) {
    int index = 0;
    if (o == null) {
        for (Node<E> x = first; x != null; x = x.next) {
            if (x.item == null)
                return index;
            index++;
        }
    } else {
        for (Node<E> x = first; x != null; x = x.next) {
            if (o.equals(x.item))
                return index;
            index++;
        }
    }

    return -1;
}
```

for문을 이용, 다음 노드에 대한 정보를 탐색하며 데이터를 비교한다.

arrayList는 배열이라는 선형적인 자료구조를 통해 빠른 접근이 가능했다면
linkedList는 같은 for문이라도 메모리 여러군데에 흩어져있는 노드를 한 곳씩 모두 방문 후 다음노드를 찾아가야하기 때문에
비교적 낮은 퍼포먼스를 보일 수 있다.

## 참고

- 자바니또의 Tech선물, Iterator의 내부동작, https://brandpark.github.io/java/2021/01/24/iterator.html

- 인텔리제이를 통한 코드 참고