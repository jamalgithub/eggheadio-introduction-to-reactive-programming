const {Observable} = Rx;

const label = document.querySelector('label');
const button = document.querySelector('button');

// To manually handle double clicks we would need:
// a counter
// a timer
// With reactive streams we don't need any of that

const click$ = Observable.fromEvent(button, 'click');

const doubleClick$ = click$
  // buffer used to be used, but RxJs's API has been updated, and bufferWhen
  // is now the function to use to buffer values until some close event closes
  // the buffer
  // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-bufferWhen

  // From a description of bufferWhen:
  // (https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35#bufferWhen)
  // Buffer all values until closing selector emits, emit buffered values,
  // repeat...
  .bufferWhen(() => {
    // create a buffer when 250ms have passed between clicks on the click$
    return click$.debounceTime(250);
  })
  // get the length of each buffer
  .map(arr => arr.length)
  // filter out the events that are not 2 in length
  .filter(len => len == 2);
