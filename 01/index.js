const Rx = require('rxjs');

const plainArray = ['1', '1', 'foo', '2', '3', '5', 'bar', '8', '13'];

// array is printed out all at once
console.log('plainArray', plainArray);

// map,. filter, reduce on a plain array
const plainArraySum = plainArray
  .map(x => parseInt(x, 10))
  .filter(Boolean)
  .reduce((acc, x) => acc + x, 0);

console.log('plainArraySum', plainArraySum);

// With an Observable we don't know when the events will be accessible
const stream = Rx.Observable.interval(400)
  .take(9)
  .map(i => plainArray[i]);

// we subscribe to an observable in order to consume it
// 'subscribe' is called an event listener. stream is the source of the events
stream.subscribe(x => console.log('stream: ', x));

// we can use the same array functions on streams
const streamTotal = stream
  .map(x => parseInt(x, 10))
  .filter(Boolean)
  .reduce((acc, x) => acc + x, 0);

// a single event is only emitted once the stream emits a completed event
streamTotal.subscribe(x => console.log('streamTotal: ', x));
