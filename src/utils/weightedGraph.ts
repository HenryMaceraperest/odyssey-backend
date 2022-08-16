import PriorityQueue from './priorityQueue';

interface Edge {
    node: string;
    startDate: number;
    endDate: number;
    flight_id: string;
};
interface FlightTimeArray {
    [vertex: string]: number
};
interface PreviousArray {
    [vertex: string]: { location: string | null, flight_id: string | null }
};

class WeightedGraph {
    adjacencyList: { [vertex: string]: Edge[] };
    constructor() {
        this.adjacencyList = {};
    }
    addVertex(vertex: string) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }
    addEdge(vertex1: string, vertex2: string, startDateString: string, endDateString: string, flight_id: string) {
        let startDate = Date.parse(startDateString);
        let endDate = Date.parse(endDateString);
        const edge: Edge = { node: vertex2, startDate: startDate, endDate: endDate, flight_id: flight_id }
        this.adjacencyList[vertex1].push(edge);
    }
    removeEdge(vertex: string, flight_id: string) {
        this.adjacencyList[vertex] = this.adjacencyList[vertex].filter(data => data.flight_id != flight_id);
    }
    Dijkstra(start: string, finish: string, startingDate: string) {
        const nodes = new PriorityQueue();
        const flightTime: FlightTimeArray = {};
        const previous: PreviousArray = {};
        let path = [] //to return at end
        let smallest;
        let smallestValues;
        let smallestFlightEnd;
        var startDate = Date.parse(startingDate);

        //build up initial state

        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                flightTime[vertex] = 0;
                nodes.enqueue(vertex, startDate);
            } else {
                flightTime[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = { location: null, flight_id: null };
        }

        // as long as there is something to visit
        while (nodes.values.length) {
            smallestValues = nodes.dequeue();
            smallest = smallestValues.val;
            smallestFlightEnd = smallestValues.priority;

            // smallest is the name of the node, not the priority/value
            if (smallest === finish) {
                //WE ARE DONE
                //BUILD UP PATH TO RETURN AT END
                // go through the list previous at nodes queue, aka the first every time in the queue
                while (previous[smallest].location) {
                    path.push({ from: previous[smallest].location, to: smallest, flight_id: previous[smallest].flight_id });
                    smallest = previous[smallest].location;

                }
                break;
            }
            // if the first name at the nodes queue or the name at the FlightTime queue isn't infinity
            if (smallest || flightTime[smallest] !== Infinity) {

                for (let neighbor in this.adjacencyList[smallest]) {

                    //find neighboring node
                    if (smallest === start ? Date.parse((new Date(this.adjacencyList[smallest][neighbor].startDate).toISOString().split('T')[0])) === startDate : this.adjacencyList[smallest][neighbor].startDate > smallestFlightEnd) {

                        let nextNode = this.adjacencyList[smallest][neighbor];

                        let nextNodeFlightTime = nextNode.endDate;


                        if (nextNodeFlightTime >= flightTime[smallest]) {

                            let candidate = nextNode.endDate;

                            let nextNeighbor = nextNode.node;

                            if (candidate < flightTime[nextNeighbor]) {
                                flightTime[nextNeighbor] = candidate;

                                //updating previous - How we got to neighbor
                                previous[nextNeighbor] = { location: smallest, flight_id: nextNode.flight_id };

                                //enqueue in priority queue with new priority
                                nodes.enqueue(nextNeighbor, candidate);
                            }
                        }

                    }
                }
            }
        }

        return path.reverse();
    }
    allPaths(start: string, finish: string) {
        const nodes = new PriorityQueue();
        const flightTime: FlightTimeArray = {};
        const previous: PreviousArray = {};
        let path = [] //to return at end
        let smallest;
        let smallestValues;
        let smallestFlightEnd;

        //build up initial state

        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                flightTime[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                flightTime[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = { location: null, flight_id: null };
        }

        // as long as there is something to visit
        while (nodes.values.length) {
            smallestValues = nodes.dequeue();
            smallest = smallestValues.val;
            smallestFlightEnd = smallestValues.priority;

            if (smallest === finish) {
                //WE ARE DONE
                //BUILD UP PATH TO RETURN AT END
                // go through the list previous at nodes queue, aka the first every time in the queue
                while (previous[smallest].location) {
                    path.push({ from: previous[smallest].location, to: smallest, flight_id: previous[smallest].flight_id });
                    smallest = previous[smallest].location;

                }
                break;
            }
            // if the first name at the nodes queue or the name at the FlightTime queue isn't infinity
            if (smallest || flightTime[smallest] !== Infinity) {

                for (let neighbor in this.adjacencyList[smallest]) {

                    //find neighboring node
                    if (this.adjacencyList[smallest][neighbor].startDate > smallestFlightEnd) {

                        let nextNode = this.adjacencyList[smallest][neighbor];

                        let nextNodeFlightTime = nextNode.endDate;


                        if (nextNodeFlightTime >= flightTime[smallest]) {

                            let candidate = nextNode.endDate;

                            let nextNeighbor = nextNode.node;

                            if (candidate < flightTime[nextNeighbor]) {
                                flightTime[nextNeighbor] = candidate;

                                //updating previous - How we got to neighbor
                                previous[nextNeighbor] = { location: smallest, flight_id: nextNode.flight_id };

                                //enqueue in priority queue with new priority
                                nodes.enqueue(nextNeighbor, candidate);
                            }
                        }

                    }
                }
            }
        }
        return path.reverse();
    }
}

export default WeightedGraph;