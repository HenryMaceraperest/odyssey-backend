export default class PriorityQueue {
    values: any[];
    constructor() {
        this.values = [];
    }
    enqueue(val: string, priority: number) {
        this.values.push({ val, priority });
        this.sort();
    };
    dequeue() {
        return this.values.shift();
    };
    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    };
};