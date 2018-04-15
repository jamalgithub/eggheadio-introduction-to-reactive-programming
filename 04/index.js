// 'just' has been replaced with 'of'
// of: Converts arguments to an observable sequence.
const request$ = Rx.Observable.of('https://api.github.com/users');

// request$.subscribe(url => {
//   // we could handle event streams using fetch, axios, or jQuery, but now
//   // we're using stuff that doesn't look like event streams
//   // fetch(url)
//   //   .then(res => res.json())
//   //   .then(res => console.log(res))

//   // Instead we can create a response stream
//   // In the video fromPromise is used instead of from - this looks like an older
//   // version of the API
//   // The RxJs docs say one can use 'from' instead of 'fromPromise' and get the
//   // same result. 'fromPromise' will be deprecated in v6, too
//   const response$ = Rx.Observable.from(fetch(url)).flatMap(res =>
//     Rx.Observable.from(res.json())
//   );

//   // the problem over here is that we're nesting subscriptions which leads us
//   // back to callback hell.
//   // Instead, we can create the responseStream outside of this subscription
//   response$.subscribe(res => console.log(res));
// });

const response$a = request$.map(url => {
  // we have to make a request using a nested observable, leaving us with an
  // Observable of an Observable
  // To address this, instead of using map, we can use flatMap, which will
  // flatten one nested level
  // Because of the second request we make with fetch, we need to flatMap again
  return Rx.Observable.from(fetch(url)).flatMap(res =>
    Rx.Observable.from(res.json())
  );
});

const response$b = request$.flatMap(url => {
  return Rx.Observable.from(fetch(url)).flatMap(res =>
    Rx.Observable.from(res.json())
  );
});

// Now we're working with only 1 level of Observables and we don't have to do
// any work with pulling nested values out
response$b.subscribe(res => console.log(res));
