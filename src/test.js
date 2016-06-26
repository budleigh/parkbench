/**
  Various testing tools and schemes for the algo's
  and data structures in parkbench. add a func,
  then register that func in the runer at the
  bottom to ensure it is run for testing.
**/

const array = require('./array.js');
const util = require('./util.js');

var ARRAYSIZE = 5000;

function testSort (fn) {
  var arrays = {
    empty: [],
    sorted: util.genSortedArray(ARRAYSIZE),
    equals: util.genEqualsArray(ARRAYSIZE),
    random: util.genRandomArray(ARRAYSIZE),
    reversed: util.genReversedArray(ARRAYSIZE)
  };
  var errors = [];

  for (var arrayType in arrays) {
    try {
      var sorted = util.verifySorted(fn(arrays[arrayType]));
      if (!sorted) {
        errors.push(fn.name + ' failed to sort array type: ' + arrayType);
      }
    } catch (err) {
      errors.push(fn.name + ' errored out on array type: ' + arrayType + ': ' + err);
    }
  }

  if (errors.length === 0) {
    console.log(fn.name + ' passed!');
  } else {
    console.log(fn.name + ' failed: ');
    console.log(errors);
  }
}

function runFromTerminal () {
  switch (process.argv[2]) {

    case 'bench':
      break;

    case 'test':
      for (var fn in array) {
        testSort(array[fn]);
      }
      break;

    default:
      console.log('unknown argument');
      break;
  }
}

runFromTerminal();