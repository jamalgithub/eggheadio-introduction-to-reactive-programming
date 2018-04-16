const request$ = Rx.Observable.of('https://api.github.com/users');

const response$a = request$.map(url => {
  return Rx.Observable.from(fetch(url)).flatMap(res =>
    Rx.Observable.from(res.json())
  );
});

const response$b = request$.flatMap(url => {
  return Rx.Observable.from(fetch(url)).flatMap(res =>
    Rx.Observable.from(res.json())
  );
});
