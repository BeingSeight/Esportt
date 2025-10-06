// esportt/lib/priorityQueue.js

export class SimplePriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    const newItem = { element, priority };
    let index = 0;
    while (index < this.items.length && this.items[index].priority >= priority) {
      index++;
    }
    this.items.splice(index, 0, newItem);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift().element;
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[0].element;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}
