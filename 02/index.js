const {Observable} = Rx;

const label = document.querySelector('label');
const button = document.querySelector('button');

// To manually handle double clicks we would need:
// a counter
// a timer
// With reactive streams we don't need any of that
