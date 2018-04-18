const refreshButton = document.querySelector('.js-refresh');

const refreshClick$ = Rx.Observable.fromEvent(refreshButton, 'click');

const requestOnRefresh$ = refreshClick$.map(() => {
  const randomOffset = Math.floor(Math.random() * 500);

  return `https://api.github.com/users?since=${randomOffset}`;
});

const startupRequest$ = Rx.Observable.of('https://api.github.com/users');

const response$ = requestOnRefresh$
  .merge(startupRequest$)
  .flatMap(url => {
    // let's naively track network requests
    console.log('network request');

    return Rx.Observable.from(fetch(url)).flatMap(res =>
      Rx.Observable.from(res.json())
    );
  })
  // Andre says it's useful to think of streams as videos. Two people can watch
  // the same video on different devices - each making their own network requests,
  // or they can share the network by watching on a single screen.
  // That's what shareReplay does for streams - any subscriptions to a stream
  // that is using shareReplay are now shared, and any later subscriptions
  // receive all the previous events
  // Now we have the 3 network requests consolidated into a single request
  .shareReplay(1);

const createSuggestion$ = res$ =>
  res$
    .map(listUser => listUser[Math.floor(Math.random() * listUser.length)])
    .startWith(null)
    .merge(refreshClick$.map(_ => null));

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

// over here we have 3 separate streams...
const suggestion1$ = createSuggestion$(response$);
const suggestion2$ = createSuggestion$(response$);
const suggestion3$ = createSuggestion$(response$);
const suggestion4$ = createSuggestion$(response$);

// and here we have 3 separate subscriptions. If we don't indicate to the
// original stream that these subscribers are all referring to, then we end up
// making 3 separate network requests, instead of making a single request
suggestion1$.subscribe(user => renderSuggestion(user, '.js-suggestion-1'));
suggestion2$.subscribe(user => renderSuggestion(user, '.js-suggestion-2'));
suggestion3$.subscribe(user => renderSuggestion(user, '.js-suggestion-3'));

// if we delay this subscription we can see there are no additional network
// requests made when the profile loads
// If we had only used 'share' instead of 'shareReplay' on the request stream,
// this subscription would not have any data until the user clicks refresh
setTimeout(
  () =>
    suggestion4$.subscribe(user => renderSuggestion(user, '.js-suggestion-4')),
  3000
);
