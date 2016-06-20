/**
  Sam Wainwright, JUN/JUL 2016

  I hereby make no claims about the elegance or efficiency of
  these implementations. This is an academic experiment mostly
  for personal benefit.

  That said, if the implementations are terrible, having all
  been written by me, they must all be equally terrible, thus
  making this a valid benchmark of the algorithms themselves.

  or something.
**/


/***************
Helper Functions
***************/

function getRandomInt(min, max) {
  // unnecessary comment: GIVES YOU A RANDOM INT
  // BETWEEN MIN AND MAX, EXCLUDING MAX (I think)
  return Math.floor(Math.random() * (max - min)) + min;
}


Array.prototype.insertSorted = function (value) {
    /*
    Inserts the value into the array while
    maintaining sorted order. This is the
    gruntwork of bucketSort, not currently used
    by any other algorithms.
    */

    for (var x = 0; x < this.length; x++) {
      if (value < this[x]) {
        this.splice(x, 0, value);
      }

      else if (x === this.length - 1) {
        this.push(value);
      }
    }

    return this;
  }

Array.prototype.popAndInsert = function (from, to) {
  /*
  Removes the item at FROM, inserts the given item
  to TO in ARRAY. Useful at this point only for
  insertion sorting, but maybe for others later.
  */

  this.splice(to, 0, this.splice(from, 1)[0]);
}

Array.prototype.swap = function (i1 ,i2) {
  /*
  Swap the values in ARRAY at i1 and i2, in-place
  (does not create a new array, but the old array
  is MODIFIED).
  */

  var store = this[i1];
  this[i1] = this[i2];
  this[i2] = store;

  return this;
}

Array.prototype.shuffle = function () {
  /*
  Shuffle the current contents of the array back into
  the array in a randomized order. Currently only
  used in bogosort, but may be useful in testing.
  */

  for (var x = 0; x < this.length; x++) {
    // for each index:
    // pick a random index. swap the two.
    var max = this.length;
    var randomIndex = getRandomInt(0, this.length);
    this.swap(x, randomIndex);
  }

  return this;
}

Array.prototype.getMax = function () {
  /*
  Gets the maximum value in an unsorted arrayy. This is
  currently only valuable to bucketsort, which generates
  categories of buckets based on the largest value.
  */

  var max;

  for (var x = 0; x < this.length; x++) {
    if (max === undefined || this[x] > max) {
      max = this[x];
    }
  }

  return max;
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

/*********
Algorithms
*********/

function mergeSort (array) {
  /*
  COMPLEXITY: O(n logn)

  - If array is len 1, return it (base case)
  - If it is bigger than one, split it by:
    - putting the even numbers in 'left'
    - putting the odd numbers in 'right'
  - merge the recursive calls
  */

  function merge(array1, array2) {
    var out = [];

    while (array1.length !== 0 && array2.length !== 0) {
      /*
      Merge by:
        - creating a result array.
        - iterating through 'left' (array1)
        - if the value at left[i] is smaller than
          the value at right[i], push that. else,
          push the value at right[i]. thus the
          resulting array is always sorted.
      */
      if (array1[0] <= array2[0]) {
        out.push(array1.shift());
      } else {
        out.push(array2.shift());
      }
    }

    // the input arrays may differ in size by a max
    // of 1, so we just push them regardless.
    while (array1.length !== 0) {
      out.push(array1.shift());
    }
    while (array2.length !== 0) {
      out.push(array2.shift());
    }

    /*
    Mergesort runs into issues around input sizes of 150k.
    This appears to be an allocation issue with JavaScript
    itself (these tests were run in Node). This is not
    an algorithmic or implementation issue.
    */

    return out;
  }

  // base case - values begin being returned (and thus
  // merged back up per line 105) at this point.
  if (array.length === 1) {
    return array;
  }

  else {
    // we're not at the base case yet - split the arrays
    // in some even way. in this case we put odd indices
    // in one array and evens in the other.
    var left = [],
        right = [];

    for (var x = 0; x < array.length; x++) {
      if (x % 2 === 0) {  // the even indices go into 'left'
        left.push(array[x]);
      } else {  // the odd indices go into 'right'
        right.push(array[x]);
      }
    }

    /*
    the recursive call - begins by merging the
    base cases of left and right, which is two
    arrays of length 1, making subsequent sorting
    back up the call stack extremely efficient.
    */
    return merge(mergeSort(left), mergeSort(right));
  }
}
mergeSort.name = 'mergeSort';

function insertionSort (array) {
  /*
  COMPLEXITY: O(n^2)

  - for each item in the array
    - continue through the rest of the array until:
      - you find a value larger than the current one
      - you are at the end of the array
        - remove the value from its old location
        - insert it before the one that is larger
  */

  for (var x = 0; x < array.length; x++) {
    for (var i = 0; i < x; i++) {
      if (array[x] < array[i]) {
        array.popAndInsert(x, i);
      }
    }
  }

  return array;
}
insertionSort.name = 'insertionSort';

function selectionSort (array) {
  /*
  COMPLEXITY: O(n^2)

  - start at point i.
  - search through the array from i
    - nominate the smallest value found
    - switch that value with the value at i
    - increment i
  */

  for (var x = 0; x < array.length; x++) {
    // this level is the sorted subarray
    var mindex = x;

    for (var i = x; i < array.length; i++) {
      // this level is the unsorted subarray
      if (array[i] < array[mindex]) {
        mindex = i;
      }
    }

    if (mindex !== x) {
      // swap the smallest value in the unsorted subarray
      // with the first value in the unsorted subarray,
      // thus adding it to the SORTED subarray.
      array.swap(x, mindex);
    }
  }

  // the sorted subarray is now the whole array.
  return array;
}
selectionSort.name = 'selectionSort';

function radixSort (array) {
  /*
  COMPLEXITY: O(kn)
  */

  return array;
}
radixSort.name = 'radixSort';

function shellSort (array) {
  /*
  COMPLEXITY: O(n logn)^2 - sort of

  The key to shellsort is this quote from wikipedia:
  "The idea is to arrange the list of elements so that,
  starting anywhere, considering every hth element gives
  a sorted list."

  Where h refers to a group of predetermined 'gaps', ie
  [512, 300, 100, 50, 5, 3, 1]

  Where 1 becomes an insertion sort on a nearly-sorted
  array.
  */

  function gapInsertionSort (array, gap, low, target) {
    /*
    This is a bespoke insertion sort, where the 'array'
    is the sequence of values behind the target separated
    by a distance of GAP. this is the incremental sorting
    phase of shellsort. calling this for a gap of 1 is
    simply a regular insertion sort, BUT the previous steps
    ensure that it is ALMOST sorted, so the insertion sort
    is extremely optimized.
    */

    var value = array[target];

    for (var x = target - gap; x >= low; x -= gap) {
      /*
      Iterate backwards through the gap array until
      you find the value's valid position, then swap.
      */
      if (value < array[x]) {
        array.swap(target, x);
        target -= gap;
        // make sure you do the above, the target
        // changed position!! I forgot at first.
      } else {
        break;
      }
    }

    return array;
  }

  var gaps = [];
  // for no reason whatsoever, I'm using all powers of 2
  // such that 2^i <= half of the array length.
  for (var x = 0; Math.pow(2, x) <= Math.ceil((array.length / 2)); x++) {
    gaps.unshift(Math.pow(2, x));
  }

  // sort the array by each gap k, then the array is 'k-sorted'
  for (var x = 0; x < gaps.length; x++) {
    var gap = gaps[x];
    var base = 0;

    while (base < gap) {
      // this becomes an insertion sort for 'subarrays' made
      // of every GAP items starting from base (up to base=gap)
      for (var j = base; j < array.length; j += gap) {
        gapInsertionSort(array, gap, base, j);
      }

      // iterating once up to base ensures that any given
      // base point on the array is sorted for that gap
      base++;
    }
  }

  return array;
}
shellSort.name = 'shellSort';

function quickSort (array, lo, hi) {
  /*
  COMPLEXITY: O(n^2) - rare, generally O(n logn)
  becomes O(n^2) in its worst case, which is a
  reverse-sorted array.
  */

  function partition (array, lo, hi) {
    /*
    Opposed to merge sort, the bulk of the operations in
    quicksort occur on the way down. here we do a
    partition around a 'pivot', here the middle value in
    the array. the following is bascially an exact crib
    of the 'Hoare partition scheme'.

    - use two index pointers i and j, pointing to the low
      and high indices for the subarray.
    - identify a pivot
    - iterate through the array, from the front and back,
      until the two pointers converge
        - if we find a value on the left larger than the pivot
          -if we also find a value on the right smaller
          -swap!
    */

    var pivot = array[Math.floor((hi + lo) / 2)],
        i = lo,
        j = hi;

    while (i <= j) {
      while (array[i] < pivot) {
        // iterate from the 'bottom'
        // stop when you find a 'mismatch' -
        // a value larger than the pivot is on the
        // wrong side!
        i++;
      }

      while (array[j] > pivot) {
        // iterate from the 'top'
        // the same iteration rule applies here, but in
        // reverse a value SMALLER than the pivot is on
        // the wrong side.
        j--;
      }

      if (i <= j) {
        // swaperino the wrong bits to the correct sides.
        array.swap(i, j);
        i++;
        j--;
      }
    }

    return i;  // the point of convergence, where the next two
    // subarrays will be split from, if any
  }

  var index;

  if (array.length > 1) {  // base case, 0 or 1 items
    lo = lo === undefined ? 0 : lo;
    hi = hi === undefined ? array.length - 1 : hi;

    index = partition(array, lo, hi);
    // gives us the midpoint (pivot)

    if (lo < index - 1) {
      // recurse into the 'lower' subarray
      quickSort(array, lo, index - 1);
    }

    if (index < hi) {
      // recurse into the 'higher' subarray
      quickSort(array, index, hi);
    }
  }

  return array;
}
quickSort.name = 'quickSort';

function bubbleSort (array) {
  /*
  COMPLEXITY: O(n^2) - this sort sucks badly, but
  performs well on arrays that are EQUAL or ALREADY SORTED
  (lol)

  - While the array is unsorted:
    - move through the array
    - if the current item is greater than the item
    ahead of it:
      - swap the items
  */

  while (!(verifySorted(array))) {
    for (var x = 0; x < array.length; x++) {
      if (array[x] > array[x + 1]) {
        array.swap(x, x + 1);
        // items are out of place, swap the smaller one to
        // be before the bigger one.
      }
    }
  }

  return array;
}
bubbleSort.name = 'bubbleSort';

function heapSort (array) {
  /*
  COMPLEXITY: O(n logn)

  This algorithm takes advantage of the structure
  of the heap data structure, as it can be easily
  represented in an array with basic parent/child
  accessing rules via index.

  - put the array in heap order
  - move the first element to the end, as it is
    guaranteed to be the largest
  - goto first step
  - stop when the size of the sorted top-end array
    is the same size as the input array.
  */

  function heapify (array) {
    /*
    A good understanding of this process is difficult
    to convey in writing - a visual aid is better in
    determining the process of 'sifting', and why it
    works, even in a 'flat' array structure - and why
    the heap's inherent 'completeness' allows it to
    be represented as such.

    Essentially, the heap/array mishmash looks like this:
    [45, 23, 17, 11, 6, 7, 9, 2, 1]

    Would be the equivalent to the heap:
                  45
                 /  \
                23  17
               / \   /\
              11  6 7 9
             /  \
            2   1

    The values on each row sit next to each other in
    the array, reading identically from left-to-right
    (hence the necessity of completeness).

    You can access the children or parent of any index
    in the array with the following access rules:

    PARENT = floor((index - 1) / 2)
    LEFT CHILD = (2 * index) + 1
    RIGHT CHILD = (2 * index) + 2

    So the value at index 3, 11, would find:
      parent = floor((3 - 1) / 2)
             = floor(2 / 2)
             = floor(1)
             = 1
      so 11 (index 3) has its parent at index 1, which is
      23, which we can verify using the heap-tree helper
      visualization.
    */

    var start = getParent(array, array.length - 1);
    // we start looking at parent/child pairings by locating
    // the parent of the absolute last value in the array.

    while (start >= 0) {
      // iterate backwards through ALL of the valid parent
      // nodes (since they're next to each other in the
      // array), verifying EACH parent/child pair as being
      // in valid heap configuration.
      siftDown(array, start, array.length - 1);
      start--;
    }
  }

  function siftDown (array, start, end) {
    var rt = start;  // initialize root at the FIRST element

    while (getLeftChild(array, rt) <= end) {
      var leftChild = getLeftChild(array, rt),
          rightChild = getRightChild(array, rt),
          swp = rt;  // the swap target. if it is anything
          // other than the root itself, a swap will happen,
          // as the parent/child are out of order.

      /*
      This sequence compares all values to each other -
      parent, leftchild, and right child. it finds the biggest
      value of all of them. if it is one of the children,
      that child is moved into being the root node of this pair.
      if it is the root node already, we leave it be.
      */
      if (array[swp] < array[leftChild]) {
        swp = leftChild;
      }

      if (rightChild <= end && (array[swp] < array[rightChild])) {
        swp = rightChild;
      }

      if (swp === rt) {
        // the children/parent configuration of this node
        // is valid!!! hooray heaps! heaps of love! kthx
        return;
      }

      else {
        // the configuration is wrong - one of the children
        // was bigger than the parent, so we set that value
        // to be the TRUE parent, making a valid heap pairing.
        array.swap(rt, swp);
        rt = swp;
      }
    }
  }

  // heap access rules when stored in a flat array
  // (described above)
  function getParent (array, index) {
    return Math.floor((index - 1) / 2);
  }

  function getLeftChild (array, index) {
    return (2 * index) + 1;
  }

  function getRightChild (array, index) {
    return (2 * index) + 2;
  }

  heapify(array);
  /* now that we are in valid heap order, we KNOW that the first
  element (the root) is the LARGEST VALUE of the array. let's
  displace that value to the end of the array, make the array 1
  unit smaller (to ignore it), and continue. that array growing
  at the end of the original array will be sorted, so once that
  array is as big as the original, we've finished sorting.
  */
  var end = array.length - 1;
  while (end > 0) {
    array.swap(end, 0);
    end--;
    // we have injured the structure by removing the root
    // repair it by sifting through the resulting smaller
    // subarray
    siftDown(array, 0, end);
  }

  return array;
}
heapSort.name = 'heapSort';

function bucketSort (array) {
  /*
  COMPLEXITY: O(n^2)

  A super simple sort that bears similarities to
  other sorts, sort of a combination of radix and
  mergesort. This, like shellsort/radixsort, is
  very implementation dependent, in particular
  the means by which you divide values into buckets
  and how many buckets there are.

  - generate buckets
  - go through the array, putting values into buckets
    - these buckets have value ranges, ie
    [] [] [], bucket 1 range 0-5, bucket 2 6-10, 3 11-15
    - the values go into these buckets in sorted order
  - merge the sorted buckets together to get the final
    sorted array!
  */


  /*
  this is one of the variables of bucketsort implementation
  this one is based on the USF bucketsort visualization -
  the number of buckets is === the length of the array.
  obviously not the most space efficient, but it makes
  distribution of values quite simple.
  */
  var max = array.getMax();
  var buckets = new Array(array.length);
  buckets.fill([]);

  for (var x = 0; x < array.length; x++) {
    // distribute values into buckets
    // this is not super exact, we just sort of want to
    // get the values abstractly sorted and bucketed out
    var value = array[x];
    var bucketIndex = Math.round((value * array.length) / (max + 1));
    // the values enter as sorted
    buckets[bucketIndex].insertSorted(value);
  }

  /*
  Depending on how this is implemented, its not crazy to think
  that we'd run into similar memory allocation issues like we see
  in mergeSort when we get near n's of ~150,000.
  */
  return buckets.reduce((results, bucket) => {
    /*
    "The Merging of the Buckets" by Wagner
    all of the values in the buckets are already sorted
    the buckets THEMSELVES are sorted since they had
    alue ranges - ie all the values in bucket index x
    are smaller than all the values in bucket index x+1.
    */
    return results.concat(bucket);
  }, []);
}
bucketSort.name = 'bucketSort';

function bogoSort (array) {
  /*
  COMPLEXITY: unbounded (random) --> O(k^n) where k
  is all possible units in the input space.

  - Check to see if the array is sorted.
  - If it is, return it.
  - If it is not, shuffle the array.
  - Continue checking.
  - Die of old age.
  */

  while (!(verifySorted(array))) {
    array.shuffle();
  }

  return array;
}
bogoSort.name = 'bogoSort';

/******
Testing
******/

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
    out.push(getRandomInt(0, size));
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

function test (fn, arraySize, genCaseIterations) {
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

var arraySize = 100000;  // change me to something between 50k and 125k to see better comparison!
console.log('running tests on arrays of numbers, size ' + arraySize + '\n\n');

[
  heapSort,
  mergeSort,
  quickSort,
  shellSort,
  // radixSort,
  // bubbleSort,
  bucketSort
  // insertionSort,
  // selectionSort
].forEach(function (fn) {
  test(fn, arraySize);

  // set up exports/module, who knows
  // exports[fn.name] = fn;
});