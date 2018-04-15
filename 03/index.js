const Rx = require('rxjs');

let a = 3;
let b = 10 * a;

// logging out b:
console.log(b);
// => 30

// then reassigning a
a = 4;
// b doesn't react to the change in a
console.log(b);
// => 30

// b needs to be updated
b = 11 * a;
// but is now prone to error
console.log(b);

// b is dynamic, but it it is not specified by the its dynamic behaviour at the
// time of instantiation
// What we want is for b to always be (10 * a) for whatever value we have, and
// as that value changes over time

// We can do this with streams:
const streamA = Rx.Observable.of(3, 4);
// whenever we get an event from streamA, streamB will be a modified version of
// that stream
const streamB = streamA.map(a => a * 10);

// To change a, most people would attempt to set it to another value:
// streamA.set(4)
// This is the wrong way to think of streams - they are dynamic values in time,
// and as per the property of streams that makes them useful:
// > Event streams allow one to specify the dynamic behaviour of a value
// > completely at the time of declaration.
// Doing the above would not be 'specifying the behaviour at the time of
// declaration'
// We need to define the values upfront with what we are expecting:
// Rx.Observable.of(3, 4);

console.log('=== streams ===');
streamB.subscribe(x => console.log(x));
