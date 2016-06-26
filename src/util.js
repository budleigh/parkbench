function verifySorted (array) {
  /*
  Ensures that the array is sorted by comparing
  values to those in indices directly ahead of it.
  If the forward index value is SMALLER than it,
  the array is obviously not correctly sorted in
  ascending order.
  */
  for (var x = 0; x < array.length; x++) {
    if (array[x] > array[x + 1]) {
      return false;
    }
  }

  return true;
}

function timeIt (fn, context) {
  /*
  times the function call in fractional seconds.
  all arguments passed the function are given
  to the function when it is called.
  */

  args = Array.from(arguments);
  var start = new Date().getTime();
  fn.apply(context, args.slice(2))

  return ((new Date().getTime()) - start) / 1000;
}

function getRandomInt(min, max) {
  // unnecessary comment: GIVES YOU A RANDOM INT
  // BETWEEN MIN AND MAX, EXCLUDING MAX (I think)
  return Math.floor(Math.random() * (max - min)) + min;
}

function genRandomArray (size) {
  // all elements in this array are randomly chosen
  // integers between 0 and (size). this is the
  // 'practical' use-case for sorting algorithms.
  out = [];
  for (var x = 0; x < size; x++) {
    out.push(getRandomInt((-1 * size), size));
    // includes negatives
  }

  return out;
}

function genEqualsArray (size) {
  // all elements of this array are EQUAL. oddly
  // we expect the shittier algorithms to do
  // better here because they are simpler or
  // do not blindly recurse.
  out = [];
  for (var x = 0; x < size; x++) {
    out.push(5);
  }

  return out;
}

function genSortedArray (size) {
  // the array is SORTED in ascending order.
  // again, we expect the shittier algo's to
  // do better here (generally 0 time).
  out = [];
  for (var x = 0; x < size; x++) {
    out.push(x + 1);
  }

  return out;
}

function genReversedArray (size) {
  // this is the 'worst case' for a lot of
  // the algorithms - the array is sorted in
  // descending order, exactly the opposite
  // of what the algorithm wants to achieve
  out = [];
  for (var x = size; x > 0; x--) {
    out.push(x);
  }

  return out;
}

[
  verifySorted,
  timeIt,
  getRandomInt,
  genRandomArray,
  genEqualsArray,
  genSortedArray,
  genReversedArray
].forEach(function (fn) {
  exports[fn.name] = fn;
});