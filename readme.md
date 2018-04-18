# Eggheadio Introduction To Reactive Programming

Learnings and annotations from https://egghead.io/courses/introduction-to-reactive-programming

1. [Understand reactive programming using RxJs](./01/index.js)

    ```bash
    $ node 01
    ```
2. [Use an event stream of double clicks](./02/index.js)

    ```bash
    $ npx live-server 02
    ```
3. [Why hoose RxJs]('./03/index.js')

    Key takeaway:

    Why should one use event streams?

    > Event streams allow one to specify the dynamic behaviour of a value
    > completely at the time of declaration.

    ^ this sounds awfully similar to *determinism* in state charts

    ```bash
    $ node 03
    ```
4. [Async requests and responses](./04/index.js)

    Takeaway:

    Use `Rx.Observable.flatMap` to flatten nested Observables and allow for
    working with only a single level of events / values in a stream.

    ```bash
    $ npx live-server 04
    ```
5. [Render on the Dom](./05/index.js)

    ```bash
    $ npx live-server 05
    ```
6. [Send new requests from refresh clicks](./06/index.js)

    Takeaways:

    - streams don't do anything until they are subscribed to
    - `merge` will take two streams and create a new stream of those streams:

        ```
        ----a-----b-------c--->
        s--------------------->
                 merge
        s---a-----b-------c--->
        ```

        http://rxmarbles.com/#merge

    ```bash
    $ npx live-server 06
    ```
7. [Send new requests from refresh clicks](./07/index.js)

    Takeaways:

    - use `startWith` to provide an initial value for a stream
    - use `merge` to take an existing stream and place values from that stream,
        or calculated from that stream, into the current stream

        ```
        ----------u-------u-> (we get a response for a user)
           startWith(N)
        N---------u--------->
        -------------N--N---> (when refresh is clicked, we get null)
               merge
        N---------u--N--N-u-> (merge everything)
        ```

        http://rxmarbles.com/#startWith

    ```bash
    $ npx live-server 07
    ```
8. [Share network requests](./08/index.js)

    Takeaways:

    `shareReplay` allows a stream to broadcast network requests to multiple
    subscriptions without creating a new stream each time. We can now use a
    single network request with multiple subscribers.

    `shareReplay` also caches the stream, allowing any subscribers coming at a
    later time access to all the events that happened in the past. This can be
    seen with the `setTimeout` example in `index.js`.

    If `share` were used instead of `shareReplay` then on first load the
    subscriber created inside the `setTimeout` would have no data to output. It
    would, however, have data once the user clicks refresh.

    ```bash
    $ npx live-server 08
    ```
