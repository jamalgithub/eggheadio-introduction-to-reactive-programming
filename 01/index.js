const Rx = require('rxjs');

const plainArray = ['1', '1', 'foo', '2', '3', '5', 'bar', '8', '13'];

console.log('plainArray', plainArray);
// With an Observable we don't know when the events will be accessible
const stream = Rx.Observable.interval(400)
  .take(9)
  .map(i => plainArray[i]);

// we subscribe to an observable in order to consume it
// 'subscribe' is called an event listener. stream is the source of the events
stream.subscribe(x => console.log('stream: ', x));
