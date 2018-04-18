const refreshButton = document.querySelector('.js-refresh');
const closeButton1 = document.querySelector('.js-close-1');
const closeButton2 = document.querySelector('.js-close-2');
const closeButton3 = document.querySelector('.js-close-3');

const refreshClick$ = Rx.Observable.fromEvent(refreshButton, 'click');
const close1Click$ = Rx.Observable.fromEvent(closeButton1, 'click');
const close2Click$ = Rx.Observable.fromEvent(closeButton2, 'click');
const close3Click$ = Rx.Observable.fromEvent(closeButton3, 'click');

const requestOnRefresh$ = refreshClick$.map(() => {
  const randomOffset = Math.floor(Math.random() * 500);

  return `https://api.github.com/users?since=${randomOffset}`;
});

const startupRequest$ = Rx.Observable.of('https://api.github.com/users');

const request$ = requestOnRefresh$.merge(startupRequest$);

const response$ = request$
  .flatMap(url =>
    Rx.Observable.from(fetch(url)).flatMap(res =>
      Rx.Observable.from(res.json())
    )
  )
  .shareReplay(1);

// refreshClick$ ---------f------------------> (refreshing)
// request$      r--------r------------------> (making requests)
// response$     ----R-----------R-----------> (getting a response from the request)
// closeClick$   ----R-----------R------x----> (when close clicked, map to a new user)
// suggestion1$  N---u----N------u------u----> (either null, or a user)

const getRandomUser = users => users[Math.floor(Math.random() * users.length)];

const createSuggestion$ = (res$, closeClick$) =>
  res$
    .map(listUser => listUser[Math.floor(Math.random() * listUser.length)])
    .startWith(null)
    .merge(refreshClick$.map(_ => null))
    // we need to get a new user whenever the closeClick$ emits an event.
    // We need to get it into this stream, so we can use merge to do that
    .merge(
      // withLatestFrom allows one to make use of the latest values from an
      // existing stream.
      // Not only are we getting the click events now, but also the latest value
      // emitted from the response stream
      // We use the latest value from the response stream to return a random user
      // every time the suggestion's close button is clicked
      closeClick$.withLatestFrom(res$, (event, users) => {
        console.log(event, users);
        return getRandomUser(users);
      })
    );

const renderSuggestion = (user, selector) => {
  const el = document.querySelector(selector);

  if (user === null) {
    el.style.visibility = 'hidden';
    return;
  }

  el.style.visibility = 'visible';
  const usernameEl = el.querySelector('.js-username');

  usernameEl.href = user.html_url;
  usernameEl.textContent = user.login;

  const imgEl = el.querySelector('img');
  imgEl.src = user.avatar_url;
};

const suggestion1$ = createSuggestion$(response$, close1Click$);
const suggestion2$ = createSuggestion$(response$, close2Click$);
const suggestion3$ = createSuggestion$(response$, close3Click$);

suggestion1$.subscribe(user => renderSuggestion(user, '.js-suggestion-1'));
suggestion2$.subscribe(user => renderSuggestion(user, '.js-suggestion-2'));
suggestion3$.subscribe(user => renderSuggestion(user, '.js-suggestion-3'));

setTimeout(
  () =>
    suggestion4$.subscribe(user => renderSuggestion(user, '.js-suggestion-4')),
  3000
);
