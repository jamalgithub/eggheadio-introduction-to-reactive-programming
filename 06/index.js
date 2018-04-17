const refreshButton = document.querySelector('.js-refresh');

// this is just a click stream - it's not mapped to a URL at this point
const refreshClick$ = Rx.Observable.fromEvent(refreshButton, 'click');

// whenever the refresh button is clicked...
const requestOnRefresh$ = refreshClick$.map(() => {
  const randomOffset = Math.floor(Math.random() * 500);

  // return a random URL
  return `https://api.github.com/users?since=${randomOffset}`;
});

// this is now our original stream we were using to make requests in our
// request stream
const startupRequest$ = Rx.Observable.of('https://api.github.com/users');

// we get the random URL from our request stream every time the refresh button
// is clicked.
// The problem here is that until the refresh button is clicked, no request is
// made.
// We need to have an initial request for our response stream, after which we
// can handle refresh clicks
// This can be done by using 'merge'
// 'merge' returns results for either one stream or the other in a new stream:
// ----a-----b-------c---> (refresh stream)
// s---------------------> (startup stream)
//          merge
// s---a-----b-------c--->
const response$ = requestOnRefresh$
  // merge requestOnRefresh and the startupRequest streams
  .merge(startupRequest$)
  // map over the URLs
  .flatMap(url => {
    return Rx.Observable.from(fetch(url)).flatMap(res =>
      Rx.Observable.from(res.json())
    );
  });

const createSuggestion$ = res$ => {
  return res$.map(
    listUser => listUser[Math.floor(Math.random() * listUser.length)]
  );
};

const renderSuggestion = (user, selector) => {
  const el = document.querySelector(selector);
  const usernameEl = el.querySelector('.js-username');

  usernameEl.href = user.html_url;
  usernameEl.textContent = user.login;

  const imgEl = el.querySelector('img');
  imgEl.src = user.avatar_url;
};

// when working with event streams the idea is that we create them but without
// doing anything to them
const suggestion1$ = createSuggestion$(response$);
const suggestion2$ = createSuggestion$(response$);
const suggestion3$ = createSuggestion$(response$);

// Once we've created them, then we subscribe to them at which point we can do
// whatever we want with the events
suggestion1$.subscribe(user => renderSuggestion(user, '.js-suggestion-1'));
suggestion2$.subscribe(user => renderSuggestion(user, '.js-suggestion-2'));
suggestion3$.subscribe(user => renderSuggestion(user, '.js-suggestion-3'));
