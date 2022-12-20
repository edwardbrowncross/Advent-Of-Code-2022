import * as p from '../utils/parser.js';
import * as u from '../utils/utils.js';

export const parseInput = p.lines(p.number);

const createLinkedList = values => {
  const arr = [];
  let lastLink = null;
  values.forEach(value => {
    const link = { value };
    if (lastLink) {
      lastLink.next = link;
      link.prev = lastLink;
    }
    arr.push(link);
    lastLink = link;
  });
  lastLink.next = arr[0];
  arr[0].prev = lastLink;
  return arr;
}

const insertBefore = (link, newLink) => {
  newLink.prev.next = newLink.next;
  newLink.next.prev = newLink.prev;
  link.prev.next = newLink;
  newLink.prev = link.prev;
  link.prev = newLink;
  newLink.next = link;
}

const insertAfter = (link, newLink) => {
  newLink.prev.next = newLink.next;
  newLink.next.prev = newLink.prev;
  link.next.prev = newLink;
  newLink.next = link.next;
  link.next = newLink;
  newLink.prev = link;

}

const travel = (link, distance, withSkip = false) => {
  let target = link;
  for (let i = 0; i < Math.abs(distance); i++) {
    target = distance > 0 ? target.next : target.prev;
    if (withSkip && target === link) {
      i--;
    }
  }
  return target;
}

const move = (link, distance) => {
  let target = travel(link, distance, true)
  if (target === link) {
    return;
  }
  if (distance < 0) {
    insertBefore(target, link);
  } else {
    insertAfter(target, link);
  }
}

const printFrom = (link) => {
  let current = link;
  let str = '';
  do {
    str += current.value + ' ';
    current = current.next;
  } while (current !== link);
  console.log('> ', str);
}

const decrypt = (list) => {
  for (const obj of list) {
    move(obj, obj.value % (list.length - 1));
  }
}

const calculateValue = (list) => {
  const zero = list.find(x => x.value === 0);
  const indices = [1000, 2000, 3000]
  return u.sum(indices.map(i => travel(zero, i).value));
}

export const part1 = (input) => {
  const list = createLinkedList(input);
  decrypt(list);
  return calculateValue(list);
}

export const part2 = (input) => {
  const multiplied = input.map(x => x * 811589153);
  const list = createLinkedList(multiplied);
  for (let i = 0; i < 10; i++) {
    decrypt(list);
  }
  return calculateValue(list);
}