/**
  Various testing tools and schemes for the algo's
  and data structures in parkbench. add a func,
  then register that func in the runer at the
  bottom to ensure it is run for testing.
**/

require('./array.js');

var assert = require('chai').assert;

const ARRAYSIZE = 5000;

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

function benchMarkSort (fn, arraySize, genCaseIterations) {
  /*
  A crude benchmarking of the different sorting algorithms.
  Obviously, the most 'typical' use case is a randomized
  (shuffled) array. however, the performance of sorting
  algorithms on other edge cases, such as full-equal,
  already-sorted, and reverse-sorted arrays is also notable.
  */

  console.log('Testing ' + fn.name);

  if (!(verifySorted(fn(genRandomArray(arraySize))))) {
    console.log('\tfailed!\n\n');
    return;
  } else {
    console.log('\tpassed!');
  }

  // our test arrays, generated fresh-baked for each function
  var sortedArray = genSortedArray(arraySize),
      randomArray = genRandomArray(arraySize),
      equalsArray = genEqualsArray(arraySize),
      reversedArray = genReversedArray(arraySize);

  // run 'em
  var sortedTime = timeIt(fn, null, sortedArray),
      randomTime = timeIt(fn, null, randomArray),
      equalsTime = timeIt(fn, null, equalsArray),
      reversedTime = timeIt(fn, null, reversedArray);

  console.log('\t\tsorted array completed in ' + sortedTime + ' seconds');
  console.log('\t\trandom array completed in ' + randomTime + ' seconds');
  console.log('\t\tequals array completed in ' + equalsTime + ' seconds');
  console.log('\t\treversed array completed in ' + reversedTime + ' seconds');

  // because this is the general use-case, let's run a number of tests to
  // get a good idea of how it performs, just in case one of our randomly
  // generated arrays lies too closely to an edge case.
  var iter = typeof genCaseIterations !== "number" ? 10 : genCaseIterations;
  var acc = 0;
  for (var x = 0; x < iter; x++) {
    var array = genRandomArray(arraySize);
    acc += timeIt(fn, null, array);
  }
  var avg = (acc / iter);
  console.log('\t\tsorted ' + iter + ' random arrays in an average of ' + (acc / iter) + ' seconds\n\n');

  return avg;
}

function testSort (fn) {
  var randomArray = genRandomArray(ARRAYSIZE),
      sortedArray = genSortedArray(ARRAYSIZE),
      equalsArray = genEqualsArray(ARRAYSIZE),
      reversedArray = genReversedArray(ARRAYSIZE),
      emptyArray = [];

  fn(randomArray);
  fn(sortedArray);
  fn(equalsArray);
  fn(reversedArray);
  fn(emptyArray);

  if (!verifySorted(randomArray) ||
      !verifySorted(sortedArray) ||
      !verifySorted(equalsArray) ||
      !verifySorted(reversedArray) ||
      !verifySorted(emptyArray)) {
    return false;
  }

  return true;
}