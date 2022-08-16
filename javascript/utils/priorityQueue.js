"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PriorityQueue {
    constructor() {
        this.values = [];
    }
    enqueue(val, priority) {
        this.values.push({ val, priority });
        this.sort();
    }
    ;
    dequeue() {
        return this.values.shift();
    }
    ;
    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
    ;
}
exports.default = PriorityQueue;
;
