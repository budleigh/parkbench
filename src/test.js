/**
  Various testing tools and schemes for the algo's
  and data structures in parkbench. add a func,
  then register that func in the runer at the
  bottom to ensure it is run for testing.
**/

const array = require('./array.js');
const util = require('./util.js');
const _ = require('../node_modules/underscore/underscore.js');

var ARRAYSIZE = 5000;

function benchMarkSort (fn, arraySize, genCaseIterations) {
  /*
  A crude benchmarking of the different sorting algorithms.
  Obviously, the most 'typical' use case is a randomized
  (shuffled) array. however, the performance of sorting
  algorithms on other edge cases, such as full-equal,
  already-sorted, and reverse-sorted arrays is also notable.
  */

  console.log('Testing ' + fn.name);

  try {
    testSort(fn);
  } catch (err) {
    console.log('' + fn.name + ' errored out: ' + err + '\n\n');
    return;
  }

  if (!(util.verifySorted(fn(util.genRandomArray(arraySize))))) {
    console.log('\tfailed!\n\n');
    return;
  } else {
    console.log('\tpassed!');
  }

  // our test arrays, generated fresh-baked for each function
  var sortedArray = util.genSortedArray(arraySize),
      randomArray = util.genRandomArray(arraySize),
      equalsArray = util.genEqualsArray(arraySize),
      reversedArray = util.genReversedArray(arraySize);

  // run 'em
  var sortedTime = util.timeIt(fn, null, sortedArray),
      randomTime = util.timeIt(fn, null, randomArray),
      equalsTime = util.timeIt(fn, null, equalsArray),
      reversedTime = util.timeIt(fn, null, reversedArray);

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
    var array = util.genRandomArray(arraySize);
    acc += util.timeIt(fn, null, array);
  }
  var avg = (acc / iter);
  console.log('\t\tsorted ' + iter + ' random arrays in an average of ' + (acc / iter) + ' seconds\n\n');

  return avg;
}

function testSort (fn) {
  var randomArray = util.genRandomArray(ARRAYSIZE),
      sortedArray = util.genSortedArray(ARRAYSIZE),
      equalsArray = util.genEqualsArray(ARRAYSIZE),
      reversedArray = util.genReversedArray(ARRAYSIZE),
      emptyArray = [];

  fn(randomArray);
  fn(sortedArray);
  fn(equalsArray);
  fn(reversedArray);
  fn(emptyArray);

  if (!util.verifySorted(randomArray) ||
      !util.verifySorted(sortedArray) ||
      !util.verifySorted(equalsArray) ||
      !util.verifySorted(reversedArray) ||
      !util.verifySorted(emptyArray)) {
    return false;
  }

  return true;
}

function runFromTerminal () {
  switch (process.argv[2]) {
    case 'bench':
      if (process.argv[3] !== undefined) {
        var arrsizeArg = parseInt(process.argv[3]);
        ARRAYSIZE = typeof arrsizeArg === 'number' ? arrsizeArg : ARRAYSIZE;

        if (ARRAYSIZE > 75000) {
          console.log('you put in a big number for the test array size.\nmight take a while!');
        }
      }
      _.each(array, (fn) => {
        benchMarkSort(fn, ARRAYSIZE, 10);
      });
      break;
    default:
      console.log('unknown argument: ' + process.argv[2]);
  }
}

function computeMaxCallStackSize() {
    try {
        return 1 + computeMaxCallStackSize();
    } catch (e) {
        // Call stack overflow
        return 1;
    }
}

runFromTerminal();