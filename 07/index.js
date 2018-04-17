const refreshButton = document.querySelector('.js-refresh');

const refreshClick$ = Rx.Observable.fromEvent(refreshButton, 'click');

const requestOnRefresh$ = refreshClick$.map(() => {
  const randomOffset = Math.floor(Math.random() * 500);

  return `https://api.github.com/users?since=${randomOffset}`;
});

const startupRequest$ = Rx.Observable.of('https://api.github.com/users');

const response$ = requestOnRefresh$
  .merge(startupRequest$)
  .flatMap(url =>
    Rx.Observable.from(fetch(url)).flatMap(res =>
      Rx.Observable.from(res.json())
    )
  );

const createSuggestion$ = res$ =>
  res$
    .map(listUser => listUser[Math.floor(Math.random() * listUser.length)])
    // instead of defining 'null' for our users outside of a stream, we can
    // indicate what out stream should begin with - in this case null
    // startWith:
    // ----------u-------u-> (we get a response for a user)
    //    startWith(N)
    // N---------u--------->
    // -------------N--N---> (when refresh is clicked, we get null)
    //        merge
    // N---------u--N--N-u-> (merge everything)
    .startWith(null)
    // merge a stream of null values every time the refreshClick stream receives
    // an event
    .merge(refreshClick$.map(_ => null));

const renderSuggestion = (user, selector) => {
  const el = document.querySelector(selector);

  if (user === null) {
    el.style.visibility = 'hidden';
    return;
  }

  const usernameEl = el.querySelector('.js-username');

  usernameEl.href = user.html_url;
  usernameEl.textContent = user.login;

  const imgEl = el.querySelector('img');
};

const suggestion1$ = createSuggestion$(response$);
const suggestion2$ = createSuggestion$(response$);
const suggestion3$ = createSuggestion$(response$);

// clear the users when we don't have data
// This is not good, because we're contradicting the mantra that we need to
// specify dynamic behaviour at the time of declaration. This needs to be
// moved into a stream
// renderSuggestion(null, '.js-suggestion-1');
// renderSuggestion(null, '.js-suggestion-2');
// renderSuggestion(null, '.js-suggestion-3');

suggestion1$.subscribe(user => renderSuggestion(user, '.js-suggestion-1'));
suggestion2$.subscribe(user => renderSuggestion(user, '.js-suggestion-2'));
suggestion3$.subscribe(user => renderSuggestion(user, '.js-suggestion-3'));
