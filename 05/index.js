// create a request stream
const request$ = Rx.Observable.of('https://api.github.com/users');

// from the request stream create a response stream
const response$ = request$.flatMap(url => {
  return Rx.Observable.from(fetch(url)).flatMap(res =>
    Rx.Observable.from(res.json())
  );
});

// create a factory for making suggestion streams
const createSuggestion$ = res$ => {
  return res$.map(
    // get a random user from the response
    listUser => listUser[Math.floor(Math.random() * listUser.length)]
  );
};

// render a user at a specified selector
const renderSuggestion = (user, selector) => {
  const el = document.querySelector(selector);
  const usernameEl = el.querySelector('.js-username');

  usernameEl.href = user.html_url;
  usernameEl.textContent = user.login;

  const imgEl = el.querySelector('img');
  imgEl.src = user.avatar_url;
};

// create a suggestion stream for each user from the response stream
const suggestion1$ = createSuggestion$(response$);
const suggestion2$ = createSuggestion$(response$);
const suggestion3$ = createSuggestion$(response$);

// subscribe to the event stream, doing something with the event from that stream
suggestion1$.subscribe(user => renderSuggestion(user, '.js-suggestion-1'));
suggestion2$.subscribe(user => renderSuggestion(user, '.js-suggestion-2'));
suggestion3$.subscribe(user => renderSuggestion(user, '.js-suggestion-3'));
