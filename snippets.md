# Challenge Snippets

Source: `apps/web/content/*.mdx`, excluding legal pages.

Edit this file manually before turning snippets into database seed data. Each section is one reusable `ChallengeSnippet` candidate.

Total snippets: 109

## 1. concat

slug: concat
topicSlug: array-methods
title: Array.concat
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.concat
sourceSnippet: concat
language: js

```js
Array.prototype.myConcat = function (...arrays) {
  const result = [...this];

  for (const array of arrays) {
    if (Array.isArray(array)) {
      result.push(...array);
    } else {
      result.push(array);
    }
  }

  return result;
};
```

## 2. fill

slug: fill
topicSlug: array-methods
title: Array.fill
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.fill
sourceSnippet: fill
language: js

```js
Array.prototype.customFill = function (value, start = 0, end = this.length) {
  if (start < 0) {
    start = this.length + start;
  }

  if (end < 0) {
    end = this.length + end;
  }

  for (let i = start; i < Math.min(end, this.length); i++) {
    this[i] = value;
  }

  return this;
};
```

## 3. pop

slug: pop
topicSlug: array-methods
title: Array.pop
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.pop
sourceSnippet: pop
language: js

```js
Array.prototype.customPop = function () {
  const length = this.length;

  if (length === 0) {
    return undefined;
  }

  const lastElement = this[length - 1];
  this.length = length - 1;

  return lastElement;
};
```

## 4. push

slug: push
topicSlug: array-methods
title: Array.push
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.push
sourceSnippet: push
language: js

```js
Array.prototype.customPush = function () {
  for (let i = 0; i < arguments.length; i++) {
    this[this.length] = arguments[i];
  }

  return this.length;
};
```

## 5. reverse

slug: reverse
topicSlug: array-methods
title: Array.reverse
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.reverse
sourceSnippet: reverse
language: js

```js
Array.prototype.customReverse = function () {
  const middle = Math.floor(this.length / 2);

  for (let i = 0; i < middle; i++) {
    const temp = this[i];
    this[i] = this[this.length - 1 - i];
    this[this.length - 1 - i] = temp;
  }

  return this;
};
```

## 6. shift

slug: shift
topicSlug: array-methods
title: Array.shift
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.shift
sourceSnippet: shift
language: js

```js
Array.prototype.customShift = function () {
  if (!this.length) return;

  const firstElement = this[0];

  for (let i = 0; i < this.length; i++) {
    this[i] = this[i + 1];
  }

  this.length -= 1;

  return firstElement;
};
```

## 7. unshift

slug: unshift
topicSlug: array-methods
title: Array.unshift
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.unshift
sourceSnippet: unshift
language: js

```js
Array.prototype.customUnshift = function (...elements) {
  const originalLength = this.length;
  const totalLength = elements.length + originalLength;

  // Shift existing elements to the right
  for (let i = originalLength - 1; i >= 0; i--) {
    this[i + elements.length] = this[i];
  }

  // Add new elements at the beginning
  for (let i = 0; i < elements.length; i++) {
    this[i] = elements[i];
  }

  return totalLength; // Return the new length
};
```

## 8. splice

slug: splice
topicSlug: array-methods
title: Array.splice
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.splice
sourceSnippet: splice
language: js

```js
Array.prototype.customSplice = function (
  startIndex,
  deleteCount,
  ...itemsToAdd
) {
  const length = this.length;

  // Handle negative indices
  startIndex =
    startIndex < 0
      ? Math.max(length + startIndex, 0)
      : Math.min(startIndex, length);

  // If deleteCount is undefined, remove all elements starting from startIndex
  if (deleteCount === undefined) {
    deleteCount = length - startIndex;
  } else {
    // Normalize deleteCount
    deleteCount = Math.max(0, Math.min(deleteCount, length - startIndex));
  }

  // Extract the array to be deleted
  const splicedItems = this.slice(startIndex, startIndex + deleteCount);

  // Create the resulting this by combining parts and items to add
  const remainingItems = [
    ...this.slice(0, startIndex),
    ...itemsToAdd,
    ...this.slice(startIndex + deleteCount),
  ];

  // Update the original array
  this.length = 0; // Clear the this
  for (let i = 0; i < remainingItems.length; i++) {
    this[i] = remainingItems[i];
  }

  // Return the deleted items
  return splicedItems;
};
```

## 9. filter

slug: filter
topicSlug: array-methods
title: Array.filter
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.filter
sourceSnippet: filter
language: js

```js
Array.prototype.myFilter = function (callback) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};
```

## 10. flat

slug: flat
topicSlug: array-methods
title: Array.flat
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.flat
sourceSnippet: flat
language: js

```js
Array.prototype.customFlat = function (depth = 1) {
  const result = [];

  const flatten = (array, depth) => {
    for (const item of array) {
      if (Array.isArray(item) && depth > 0) {
        flatten(item, depth - 1);
      } else {
        result.push(item);
      }
    }
  };
  flatten(this, depth);

  return result;
};
```

## 11. flatmap

slug: flatmap
topicSlug: array-methods
title: Array.flatMap
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.flatMap
sourceSnippet: flatMap
language: js

```js
Array.prototype.customFlatMap = function (callback, thisArg) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    const mapped = callback.call(thisArg, this[i], i, this);

    if (Array.isArray(mapped)) {
      result.push(...mapped); // Use spread operator for flattening
    } else {
      result.push(mapped);
    }
  }

  return result;
};
```

## 12. join

slug: join
topicSlug: array-methods
title: Array.join
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.join
sourceSnippet: join
language: js

```js
Array.prototype.customJoin = function (separator = ",") {
  let result = "";

  for (let i = 0; i < this.length; i++) {
    if (i > 0) {
      result += separator;
    }

    result += this[i];
  }

  return result;
};
```

## 13. map

slug: map
topicSlug: array-methods
title: Array.map
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.map
sourceSnippet: map
language: js

```js
Array.prototype.customMap = function (callbackFn) {
  if (typeof callbackFn !== "function") {
    throw new TypeError("Callback must be a function");
  }

  const arr = [];
  for (let i = 0; i < this.length; i++) {
    arr.push(callbackFn(this[i], i, this));
  }

  return arr;
};
```

## 14. reduce

slug: reduce
topicSlug: array-methods
title: Array.reduce
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.reduce
sourceSnippet: reduce
language: js

```js
Array.prototype.customReduce = function (callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : this[0];

  const startIndex = initialValue !== undefined ? 0 : 1;

  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }

  return accumulator;
};
```

## 15. slice

slug: slice
topicSlug: array-methods
title: Array.slice
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.slice
sourceSnippet: slice
language: js

```js
Array.prototype.customSlice = function (start = 0, end) {
  const length = this.length;
  let endIndex = end || length;

  if (start < 0) {
    start = Math.max(length + start, 0);
  }
  if (endIndex < 0) {
    endIndex = Math.max(length + endIndex, 0);
  }

  const result = [];

  for (let i = start; i < endIndex && i < length; i++) {
    result.push(this[i]);
  }

  return result;
};
```

## 16. find

slug: find
topicSlug: array-methods
title: Array.find
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.find
sourceSnippet: find
language: js

```js
Array.prototype.customFind = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i])) {
      return this[i];
    }
  }
};
```

## 17. findlast

slug: findlast
topicSlug: array-methods
title: Array.findLast
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.findLast
sourceSnippet: findLast
language: js

```js
Array.prototype.customFindLast = function (callback) {
  for (let i = this.length; i >= 0; i--) {
    if (callback(this[i])) {
      return this[i];
    }
  }
};
```

## 18. at

slug: at
topicSlug: array-methods
title: Array.at
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.at
sourceSnippet: at
language: js

```js
Array.prototype.customAt = function (index) {
  if (index < 0) {
    index = this.length + index;
  }

  return this[index];
};
```

## 19. every

slug: every
topicSlug: array-methods
title: Array.every
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.every
sourceSnippet: every
language: js

```js
Array.prototype.customEvery = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (!callback(this[i], i)) {
      return false;
    }
  }

  return true;
};
```

## 20. includes

slug: includes
topicSlug: array-methods
title: Array.includes
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.includes
sourceSnippet: includes
language: js

```js
function sameValueZero(x, y) {
  return (
    x === y ||
    (typeof x === "number" && typeof y === "number" && x !== x && y !== y)
  );
}

Array.prototype.customIncludes = function (searchElement, fromIndex = 0) {
  const length = this.length;

  if (length === 0) {
    return false;
  }

  if (fromIndex < 0) {
    fromIndex = Math.max(length + fromIndex, 0);
  }

  for (let i = fromIndex; i < length; i++) {
    if (sameValueZero(this[i], searchElement)) {
      return true;
    }
  }

  return false;
};
```

## 21. some

slug: some
topicSlug: array-methods
title: Array.some
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.some
sourceSnippet: some
language: js

```js
Array.prototype.customSome = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return true;
    }
  }

  return false;
};
```

## 22. composition

slug: composition
topicSlug: composition-vs-inheritance
title: Composition
sourceFile: apps/web/content/composition-vs-inheritance.mdx
sourceSection: Composition
sourceSnippet: composition
language: js

```js
const dateFunc = () => new Date();
const textFunc = (date) => date.toDateString();
const labelFunc = (text) => `Today ${text}`;
const showLabelFunc = (label) => console.log(label);

const date = dateFunc();
const text = textFunc(date);
const label = labelFunc(text);
showLabelFunc(label); // Today Sat Sep 28 2024

function pipe(...steps) {
  return function runSteps() {
    let result;
    for (let i = 0; i < steps.length; i++) {
      let step = steps[i];
      result = step(result);
    }
    return result;
  };
}

const showDateLabel = pipe(dateFunc, textFunc, labelFunc, showLabelFunc);
showDateLabel(); // Today Sat Sep 28 2024
```

## 23. inheritance

slug: inheritance
topicSlug: composition-vs-inheritance
title: Inheritance
sourceFile: apps/web/content/composition-vs-inheritance.mdx
sourceSection: Inheritance
sourceSnippet: inheritance
language: typescript

```typescript
// Base class
class Vehicle {
  private readonly _make: string;
  private readonly _model: string;
  private readonly _year: number;

  constructor(make: string, model: string, year: number) {
    this._make = make;
    this._model = model;
    this._year = year;
  }

  displayInfo(): string {
    return `${this._year} ${this._make} ${this._model}`;
  }
}

// Derived class
class Car extends Vehicle {
  private readonly _doors: number;

  constructor(make: string, model: string, year: number, doors: number) {
    super(make, model, year); // Call the constructor of the base class
    this._doors = doors;
  }

  displayInfo(): string {
    return `${super.displayInfo()} - ${this._doors} doors`;
  }
}
```

## 24. this

slug: this
topicSlug: core-concepts
title: Understanding this
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Understanding this
sourceSnippet: this
language: js

```js
Array.prototype.customFilter = function (callback, thisArg) {
  let result = [];

  for (let i = 0; i < this.length; i++) {
    if (callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};

Array.prototype.customFilterNoThis = function (callback) {
  let result = [];

  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};

const army = {
  minAge: 18,
  maxAge: 27,
  canJoin(user) {
    return user.age >= this.minAge && user.age < this.maxAge;
  },
};

const users = [{ age: 16 }, { age: 20 }, { age: 23 }, { age: 30 }];

const soldiers1 = users.customFilterNoThis(army.canJoin);
const soldiers2 = users.customFilterNoThis((user) => army.canJoin(user));
const soldiers3 = users.customFilter(army.canJoin, army);
```

## 25. object-method-this

slug: object-method-this
topicSlug: core-concepts
title: Object Methods and `this`
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Object Methods and `this`
sourceSnippet: object method this
language: js

```js
let user = {
  name: "John",
  sayHi() {
    console.log(user.name);
  },
};

const admin = user;
user = null;

admin.sayHi();
```

## 26. object-method-this-fix

slug: object-method-this-fix
topicSlug: core-concepts
title: Object Methods and `this`
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Object Methods and `this`
sourceSnippet: object method this fix
language: js

```js
let user = {
  name: "John",
  sayHi() {
    console.log(this.name);
  },
};

const admin = user;
user = null;

admin.sayHi();
```

## 27. object-literal-this

slug: object-literal-this
topicSlug: core-concepts
title: Object Literals and `this`
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Object Literals and `this`
sourceSnippet: object literal this
language: js

```js
function makeUser() {
  return {
    name: "John",
    ref: this,
  };
}

const user = makeUser();
console.log(user.ref?.name); 

function makeUserWithMethod() {
  return {
    name: "John",
    ref() {
      return this;
    },
  };
}

const user2 = makeUserWithMethod();
console.log(user2.ref().name);
```

## 28. method-chaining

slug: method-chaining
topicSlug: core-concepts
title: Method Chaining with `this`
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Method Chaining with `this`
sourceSnippet: method chaining
language: js

```js
const ladder = {
  step: 0,
  up() {
    this.step++;
    return this;
  },
  down() {
    this.step--;
    return this;
  },
  showStep() {
    console.log(this.step);
    return this;
  },
};

ladder.up().up().down().showStep().down().showStep();
```

## 29. for-vs-while

slug: for-vs-while
topicSlug: core-concepts
title: Loop Behavior: Pre/Post Increment
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Loop Behavior: Pre/Post Increment
sourceSnippet: for vs while
language: js

```js
let i = 0;
while (++i < 3) console.log(i);

let i2 = 0;
while (i2++ < 3) console.log(i2);

for (let i = 0; i < 3; i++) console.log(i);

for (let i = 0; i < 3; ++i) console.log(i);
```

## 30. object-to-map

slug: object-to-map
topicSlug: core-concepts
title: Object and Map Conversion
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Object and Map Conversion
sourceSnippet: Object to Map
language: js

```js
const prices = Object.fromEntries([
  ["banana", 1],
  ["orange", 2],
  ["meat", 4],
]);

console.log(prices);

const map = new Map();
map.set("banana", 1);
map.set("orange", 2);
map.set("meat", 4);

const arrayLikeMapEntries = map.entries();
const arrayMapEntries = Array.from(arrayLikeMapEntries);

const objectFromMap = Object.fromEntries(arrayMapEntries);
console.log(objectFromMap);

const mapFromObject = new Map(Object.entries(objectFromMap));
console.log(mapFromObject.get("meat"));
```

## 31. bind

slug: bind
topicSlug: core-concepts
title: bind
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: bind
sourceSnippet: bind
language: js

```js
const user = {
  firstName: "John",
  sayHi() {
    console.log(`Hello, ${this.firstName}!`);
  },
};

user.sayHi(); // Hello, John!
setTimeout(user.sayHi, 0); // Hello, undefined!
```

## 32. call-and-arrows

slug: call-and-arrows
topicSlug: core-concepts
title: `call` with Regular and Arrow Functions
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: `call` with Regular and Arrow Functions
sourceSnippet: call and arrows
language: js

```js
const obj = {
  value: 25,
  regularMethod() {
    return this.value;
  },
  arrowMethod: () => {
    return this?.value;
  },
};

const anotherObj = {
  value: 50,
};
```

## 34. object-create

slug: object-create
topicSlug: core-concepts
title: Inheriting Methods with `Object.create`
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Inheriting Methods with `Object.create`
sourceSnippet: Object.create
language: js

```js
const vehicle = {
  getInfo() {
    console.log(`${this.model} was made in ${this.year}`);
  },
};

const myCar = Object.create(vehicle);
myCar.model = "BMW";
myCar.year = 2010;
```

## 35. async-generator

slug: async-generator
topicSlug: core-concepts
title: Async Generators
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Async Generators
sourceSnippet: async generator
language: js

```js
async function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield i;
  }
}

const timer = async (callback) => {
  const generator = generateSequence(1, 5);
  for await (let value of generator) {
    callback(value);
  }
};
```

## 38. function-stack

slug: function-stack
topicSlug: core-concepts
title: Function Stack
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Function Stack
sourceSnippet: function stack
language: js

```js
function foo(i) {
  if (i < 0) {
    return;
  }
  console.log(`begin: ${i}`);
  foo(i - 1);
  console.log(`end: ${i}`);
}
```

## 43. handling-errors

slug: handling-errors
topicSlug: core-concepts
title: Synchronous vs Asynchronous Errors in Promises
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Synchronous vs Asynchronous Errors in Promises
sourceSnippet: handling errors
language: js

```js
new Promise(function (resolve, reject) {
  throw new Error("Whoops!");
}).catch((e) => console.error(e.message));
```

## 43. handling-errors2

slug: handling-errors
topicSlug: core-concepts
title: Synchronous vs Asynchronous Errors in Promises
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Synchronous vs Asynchronous Errors in Promises
sourceSnippet: handling errors
language: js

```js
new Promise(function (resolve, reject) {
  setTimeout(() => {
    throw new Error("Whoops!");
  }, 1000);
}).catch(console.error);
```

## 45. lexical-environment-scope

slug: lexical-environment-scope
topicSlug: core-concepts
title: Shooters: Closures & Lexical Scope
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Shooters: Closures & Lexical Scope
sourceSnippet: lexical environment(scope)
language: js

```js
function makeArmy() {
  const shooters = [];

  let i = 0;
  while (i < 10) {
    let j = i;
    const shooter = function () {
      return j; 
    };
    shooters.push(shooter); 
    i++;
  }
  
  return shooters;
}
```

## 45. lexical-environment-2

slug: lexical-environment-scope
topicSlug: core-concepts
title: Shooters: Closures & Lexical Scope
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Shooters: Closures & Lexical Scope
sourceSnippet: lexical environment(scope)
language: js

```js
function makeArmy() {
  const shooters = [];

  let i = 0;
  while (i < 10) {
    const shooter = function () {
      return j; 
    };
    shooters.push(shooter); 
    i++;
  }
  
  return shooters;
}
```

## 48. output-every-second

slug: output-every-second
topicSlug: debounce-throttle
title: Output Every Second
sourceFile: apps/web/content/debounce-throttle.mdx
sourceSection: Output Every Second
sourceSnippet: -
language: js

```js
function printNumbers(from, to) {
  let current = from;
  let timerId;

  function go() {
    console.log(current);
    if (current === to) {
      clearInterval(timerId);
    }
    current++;
  }

  go();
  timerId = setInterval(go, 1000);
}

printNumbers(5, 10);
```

## 49. output-every-second-2

slug: output-every-second-2
topicSlug: debounce-throttle
title: Output Every Second
sourceFile: apps/web/content/debounce-throttle.mdx
sourceSection: Output Every Second
sourceSnippet: -
language: js

```js
function printNumbers(from, to) {
  let current = from;

  function go() {
    console.log(current);
    if (current < to) {
      setTimeout(go, 1000);
    }
    current++;
  }

  go();
}

printNumbers(5, 10);
```

## 50. debounce

slug: debounce
topicSlug: debounce-throttle
title: Throttle and Debounce Decorators
sourceFile: apps/web/content/debounce-throttle.mdx
sourceSection: Throttle and Debounce Decorators
sourceSnippet: debounce
language: js

```js
function debounce(func, ms) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), ms);
  };
}

const timeLoggedConsoleLog = (...args) => {
  console.log(`Logged after ${Date.now() - startTime} ms:`, ...args);
};

const startTime = Date.now();
const f = debounce(timeLoggedConsoleLog, 500);
```

## 51. throttle

slug: throttle
topicSlug: debounce-throttle
title: Throttle and Debounce Decorators
sourceFile: apps/web/content/debounce-throttle.mdx
sourceSection: Throttle and Debounce Decorators
sourceSnippet: throttle
language: js

```js
function throttle(fn, limit) {
  let inThrottle;

  return function (...args) {
    if (inThrottle) return;
    fn.apply(this, args);
    inThrottle = true;
    setTimeout(() => (inThrottle = false), limit);
  };
}

const timeLoggedConsoleLog = (...args) => {
  console.log(`Logged after ${Date.now() - startTime} ms:`, ...args);
};

const startTime = Date.now();
const f = throttle(timeLoggedConsoleLog, 500);
```

## 52. dictionary-of-nested

slug: dictionary-of-nested
topicSlug: dictionary-of-nested
title: Plain JavaScript: Nested Loop Approach
sourceFile: apps/web/content/dictionary-of-nested.mdx
sourceSection: Plain JavaScript: Nested Loop Approach
sourceSnippet: dictionary of nested
language: js

```js
const data = [
  {
    id: 1,
    name: "Category A",
    items: [
      {
        id: 2,
        name: "Subcategory A1",
        items: [
          { id: 3, name: "Item A1-1", value: 10 },
          { id: 4, name: "Item A1-2", value: 15 },
        ],
      },
      {
        id: 5,
        name: "Subcategory A2",
        items: [
          { id: 6, name: "Item A2-1", value: 20 },
          { id: 7, name: "Item A2-2", value: 25 },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Category B",
    items: [
      {
        id: 9,
        name: "Subcategory B1",
        items: [
          { id: 10, name: "Item B1-1", value: 30 },
          { id: 11, name: "Item B1-2", value: 35 },
        ],
      },
      {
        id: 12,
        name: "Subcategory B2",
        items: [
          { id: 13, name: "Item B2-1", value: 40 },
          { id: 14, name: "Item B2-2", value: 45 },
        ],
      },
    ],
  },
];

function createNestedDictionary(data) {
  const dictionary = {};

  for (const category of data) {
    dictionary[category.id] = { ...category, subcategories: {} };

    for (const subcategory of category.items) {
      dictionary[category.id].subcategories[subcategory.id] = {
        ...subcategory,
        items: {},
      };

      for (const item of subcategory.items) {
        dictionary[category.id].subcategories[subcategory.id].items[item.id] =
          item;
      }
    }
  }

  return dictionary;
}

const nestedDictionary = createNestedDictionary(data);
```

## 53. dictionary-of-nested-2

slug: dictionary-of-nested-2
topicSlug: dictionary-of-nested
title: Recursive Helper: `mapToDictionary()`
sourceFile: apps/web/content/dictionary-of-nested.mdx
sourceSection: Recursive Helper: `mapToDictionary()`
sourceSnippet: dictionary of nested
language: js

```js
const data = [
  {
    id: 1,
    name: "Category A",
    items: [
      {
        id: 2,
        name: "Subcategory A1",
        items: [
          { id: 3, name: "Item A1-1", value: 10 },
          { id: 4, name: "Item A1-2", value: 15 },
        ],
      },
      {
        id: 5,
        name: "Subcategory A2",
        items: [
          { id: 6, name: "Item A2-1", value: 20 },
          { id: 7, name: "Item A2-2", value: 25 },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Category B",
    items: [
      {
        id: 9,
        name: "Subcategory B1",
        items: [
          { id: 10, name: "Item B1-1", value: 30 },
          { id: 11, name: "Item B1-2", value: 35 },
        ],
      },
      {
        id: 12,
        name: "Subcategory B2",
        items: [
          { id: 13, name: "Item B2-1", value: 40 },
          { id: 14, name: "Item B2-2", value: 45 },
        ],
      },
    ],
  },
];

function mapToDictionary(data, keys) {
  const [currentKey, ...remainingKeys] = keys;

  return data.reduce((acc, item) => {
    acc[item.id] = {
      ...item,
      [currentKey || "items"]: item.items
        ? mapToDictionary(item.items, remainingKeys)
        : undefined,
    };
    return acc;
  }, {});
}

const nestedDictionary = mapToDictionary(data, ["subcategories", "items"]);
```

## 55. promise-all-and-the-event-loop

slug: promise-all-and-the-event-loop
topicSlug: event-loop
title: Promise.all and the Event Loop
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Promise.all and the Event Loop
sourceSnippet: -
language: js

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, "foo");
});
const promise3 = 42;

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log({ values });
});

// Using setTimeout, we can execute code after the queue is empty
setTimeout(() => {
  console.log("the queue is now empty");
});

const p3 = Promise.all([]); // Will be immediately resolved
const p4 = Promise.all([1337, "hi"]);

// Non-promise values are ignored, but the evaluation is done asynchronously
console.log({ p3 });
console.log({ p4 });

setTimeout(() => {
  console.log({ p4 });
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log({ values2: values });
});

const promise4 = Promise.resolve(3);
const promise5 = 42;

Promise.all([promise4, promise5]).then((values) => {
  console.log({ values3: values });
});
```

## 56. promise-chaining-and-microtask-queue-order

slug: promise-chaining-and-microtask-queue-order
topicSlug: event-loop
title: Promise Chaining and Microtask Queue Order
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Promise Chaining and Microtask Queue Order
sourceSnippet: -
language: js

```js
const promise1 = Promise.resolve();
const promise2 = Promise.resolve();

promise1.then(() => console.log(1)).then(() => console.log(2));
promise2.then(() => console.log(3)).then(() => console.log(4));
```

## 57. let-in-loops-with-settimeout

slug: let-in-loops-with-settimeout
topicSlug: event-loop
title: `let` in Loops with `setTimeout`
sourceFile: apps/web/content/event-loop.mdx
sourceSection: `let` in Loops with `setTimeout`
sourceSnippet: -
language: js

```js
for (let i = 0; i < 4; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

## 58. promise-lifecycle-and-event-loop-timing

slug: promise-lifecycle-and-event-loop-timing
topicSlug: event-loop
title: Promise Lifecycle and Event Loop Timing
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Promise Lifecycle and Event Loop Timing
sourceSnippet: -
language: js

```js
const promise = new Promise((resolve, reject) => {
  console.log("Promise callback");
  resolve("resolved");
  console.log("Promise callback end");
}).then((result) => {
  console.log("Promise callback (.then)", result);
});

setTimeout(() => {
  console.log("event-loop cycle: Promise (fulfilled)", promise);
}, 0);

console.log("Promise (pending)", promise);
```

## 59. async-function-and-timer-execution-order

slug: async-function-and-timer-execution-order
topicSlug: event-loop
title: Async Function and Timer Execution Order
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Async Function and Timer Execution Order
sourceSnippet: -
language: js

```js
async function run() {
  console.log("run async");
  setTimeout(() => {
    console.log("run timeout");
  }, 0);
}

setTimeout(() => {
  console.log("timeout");
}, 0);

// await or not, same result
await run();

console.log("script");
```

## 60. blocking-the-event-loop-with-a-while-loop

slug: blocking-the-event-loop-with-a-while-loop
topicSlug: event-loop
title: Blocking the Event Loop with a While Loop
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Blocking the Event Loop with a While Loop
sourceSnippet: -
language: js

```js
const seconds = new Date().getTime() / 1000;

setTimeout(() => {
  // prints out "2", meaning that the callback is not called immediately after 500 milliseconds.
  console.log(`Ran after ${new Date().getTime() / 1000 - seconds} seconds`);
}, 500);

while (true) {
  if (new Date().getTime() / 1000 - seconds >= 2) {
    console.log("Good, looped for 2 seconds");
    break;
  }
}
```

## 61. script-microtasks-and-macrotasks-in-execution-order

slug: script-microtasks-and-macrotasks-in-execution-order
topicSlug: event-loop
title: Script, Microtasks, and Macrotasks in Execution Order
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Script, Microtasks, and Macrotasks in Execution Order
sourceSnippet: -
language: js

```js
console.log("Script start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
  })
  .then(() => {
    console.log("Promise 2");
  });

console.log("Script end");

const promise1 = new Promise((resolve, reject) => {
  console.log("Promise constructor");
  resolve();
}).then(() => {
  console.log("Promise constructor resolve");
});

queueMicrotask(() => {
  console.log("Microtask queue");
});

console.log("After Promise constructor");
```

## 62. blocking-inside-async-callbacks

slug: blocking-inside-async-callbacks
topicSlug: event-loop
title: Blocking Inside Async Callbacks
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Blocking Inside Async Callbacks
sourceSnippet: -
language: js

```js
function longRunningTask() {
  console.log("Start Long-Running Task");

  const startTime = Date.now();
  while (Date.now() - startTime < 2000) {
    // Simulate a long-running task (2 seconds)
  }

  console.log("Long-Running Task Completed");
}

function simulateNonBlocking() {
  console.log("Start");

  setTimeout(() => {
    console.log("Non-blocking Operation");
    longRunningTask();
  }, 0);

  console.log("End");
}

simulateNonBlocking();
```

## 63. nested-microtasks-in-macrotasks

slug: nested-microtasks-in-macrotasks
topicSlug: event-loop
title: Nested Microtasks in Macrotasks
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Nested Microtasks in Macrotasks
sourceSnippet: -
language: js

```js
console.log("Start");

setTimeout(() => {
  console.log("setTimeout 1");
  Promise.resolve().then(() => {
    console.log("Promise inside setTimeout 1");
  });
}, 0);

setTimeout(() => {
  console.log("setTimeout 2");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
  })
  .then(() => {
    console.log("Promise 2");
  });

console.log("End");
```

## 64. requestanimationframe-and-task-ordering

slug: requestanimationframe-and-task-ordering
topicSlug: event-loop
title: requestAnimationFrame and Task Ordering
sourceFile: apps/web/content/event-loop.mdx
sourceSection: requestAnimationFrame and Task Ordering
sourceSnippet: -
language: js

```js
console.log("1");

setTimeout(function () {
  console.log("2");

  Promise.resolve().then(function () {
    console.log("3");
  });
}, 0);

Promise.resolve().then(function () {
  console.log("4");

  setTimeout(function () {
    console.log("5");
  }, 0);
});

requestAnimationFrame(function () {
  console.log("7");
});

console.log("6");
```

## 65. has-path-depth

slug: has-path
topicSlug: graph-traversal
title: Has Path in Directed Graphs (DFS & BFS)
sourceFile: apps/web/content/graph-traversal.mdx
sourceSection: Has Path in Directed Graphs (DFS & BFS)
sourceSnippet: has path
language: ts

```ts
type Graph = Record<string, string[]>;

// Depth-First Search
const hasPath = (graph: Graph, src: string, dst: string): boolean => {
  if (src === dst) return true;

  for (const neighbor of graph[src]) {
    if (hasPath(graph, neighbor, dst)) {
      return true;
    }
  }

  return false;
};
```

## 65. has-path-bredth

slug: has-path
topicSlug: graph-traversal
title: Has Path in Directed Graphs (DFS & BFS)
sourceFile: apps/web/content/graph-traversal.mdx
sourceSection: Has Path in Directed Graphs (DFS & BFS)
sourceSnippet: has path
language: ts

```ts
type Graph = Record<string, string[]>;

const hasPath = (
  graph: Graph,
  src: string,
  dst: string,
): boolean => {
  const queue: string[] = [src];

  while (queue.length) {
    const current = queue.shift();
    if (current === dst) return true;

    if (current && graph[current]) {
      for (const neighbor of graph[current]) {
        queue.push(neighbor);
      }
    }
  }

  return false;
};
```

## 66. undirected-path

slug: undirected-path
topicSlug: graph-traversal
title: Path Existence in Undirected Graphs (DFS with Visited Set)
sourceFile: apps/web/content/graph-traversal.mdx
sourceSection: Path Existence in Undirected Graphs (DFS with Visited Set)
sourceSnippet: undirected path
language: ts

```ts
const undirectedPath = (
  edges: [string, string][],
  nodeA: string,
  nodeB: string,
): boolean => {
  const graph = buildGraph(edges);
  return hasPath(graph, nodeA, nodeB, new Set());
};

const buildGraph = (edges: [string, string][]) => {
  const graph: Record<string, string[]> = {};

  for (const [a, b] of edges) {
    if (!(a in graph)) graph[a] = [];
    if (!(b in graph)) graph[b] = [];
    graph[a].push(b);
    graph[b].push(a);
  }

  return graph;
};

const hasPath = (
  graph: Record<string, string[]>,
  src: string,
  dst: string,
  visited: Set<string>,
): boolean => {
  if (src === dst) return true;
  if (visited.has(src)) return false;
  visited.add(src);

  for (const neighbor of graph[src]) {
    if (hasPath(graph, neighbor, dst, visited)) {
      return true;
    }
  }

  return false;
};
```

## 70. keyby

slug: keyby
topicSlug: lodash
title: keyBy
sourceFile: apps/web/content/lodash.mdx
sourceSection: keyBy
sourceSnippet: keyBy
language: js

```js
function keyBy(collection, iteratee) {
  const result = {};

  for (const item of collection) {
    const key =
      typeof iteratee === "function" ? iteratee(item) : item[iteratee];
    result[key] = item;
  }

  return result;
}
```

## 71. omit

slug: omit
topicSlug: lodash
title: omit
sourceFile: apps/web/content/lodash.mdx
sourceSection: omit
sourceSnippet: omit
language: js

```js
function omit(obj, keys) {
  const result = { ...obj };

  if (!Array.isArray(keys)) {
    delete result[keys];
    return result;
  }

  for (const key of keys) {
    delete result[key];
  }

  return result;
}
```

## 72. orderby

slug: orderby
topicSlug: lodash
title: orderBy
sourceFile: apps/web/content/lodash.mdx
sourceSection: orderBy
sourceSnippet: orderBy
language: js

```js
function orderBy(array, property, order = "asc") {
  const multiplier = order === "asc" ? 1 : -1;
  const copy = [...array];

  return copy.sort((a, b) => {
    if (a[property] < b[property]) return -1 * multiplier;
    if (a[property] > b[property]) return 1 * multiplier;
    return 0;
  });
}
```

## 73. pick

slug: pick
topicSlug: lodash
title: pick
sourceFile: apps/web/content/lodash.mdx
sourceSection: pick
sourceSnippet: pick
language: js

```js
function pick(obj, keys) {
  if (typeof keys === "string") {
    return obj[keys] !== undefined ? { [keys]: obj[keys] } : {};
  }

  return (Array.isArray(keys) ? keys : []).reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}
```

## 74. curry

slug: curry
topicSlug: lodash
title: curry
sourceFile: apps/web/content/lodash.mdx
sourceSection: curry
sourceSnippet: curry
language: js

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return (...nextArgs) => curried(...args, ...nextArgs);
    }
  };
}
```

## 75. difference

slug: difference
topicSlug: lodash
title: difference
sourceFile: apps/web/content/lodash.mdx
sourceSection: difference
sourceSnippet: difference
language: js

```js
const findDifference = function (arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const diffLeft = [];
  const diffRight = [];

  for (const item of set1) {
    if (!set2.has(item)) diffLeft.push(item);
  }

  for (const item of set2) {
    if (!set1.has(item)) diffRight.push(item);
  }

  return [diffLeft, diffRight];
};
```

## 76. differenceby

slug: differenceby
topicSlug: lodash
title: differenceBy
sourceFile: apps/web/content/lodash.mdx
sourceSection: differenceBy
sourceSnippet: differenceBy
language: js

```js
const differenceBy = (arr1, arr2, key) => {
  const set2 = new Set(arr2.map((item) => item[key]));
  const set1 = new Set(arr1.map((item) => item[key]));

  const diffLeft = [];
  const diffRight = [];

  for (const item of arr1) {
    if (!set2.has(item[key])) {
      diffLeft.push(item);
    }
  }

  for (const item of arr2) {
    if (!set1.has(item[key])) {
      diffRight.push(item);
    }
  }

  return [diffLeft, diffRight];
};
```

## 77. intersection

slug: intersection
topicSlug: lodash
title: intersection
sourceFile: apps/web/content/lodash.mdx
sourceSection: intersection
sourceSnippet: intersection
language: js

```js
const intersection = function (nums1, nums2) {
  const set1 = new Set(nums1);
  const set2 = new Set(nums2);
  const result = [];

  for (const nums of set2) {
    if (set1.has(nums)) {
      result.push(nums);
    }
  }

  return result;
};
```

## 78. union

slug: union
topicSlug: lodash
title: union
sourceFile: apps/web/content/lodash.mdx
sourceSection: union
sourceSnippet: union
language: js

```js
const union = (...arrays) => {
  return Array.from(new Set([].concat(...arrays)));
};
```

## 81. object-groupby

slug: object-groupby
topicSlug: map-and-set
title: Object.groupBy
sourceFile: apps/web/content/map-and-set.mdx
sourceSection: Object.groupBy
sourceSnippet: Object.groupBy
language: js

```js
const groupBy = (arr, callback) => {
  return arr.reduce((acc = {}, item) => {
    const key = callback(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {});
};
```

## 82. map-groupby

slug: map-groupby
topicSlug: map-and-set
title: Map.groupBy
sourceFile: apps/web/content/map-and-set.mdx
sourceSection: Map.groupBy
sourceSnippet: Map.groupBy
language: js

```js
// Map.groupBy isn't available yet
function groupBy(array, callback) {
  const map = new Map();

  for (const item of array) {
    const key = callback(item);
    const group = map.get(key) || [];
    group.push(item);
    map.set(key, group);
  }

  return map;
}
```

## 83. promise-all

slug: promise-all
topicSlug: promises
title: Promise.all
sourceFile: apps/web/content/promises.mdx
sourceSection: Promise.all
sourceSnippet: Promise.all
language: js

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    const results = [];
    let completedPromises = 0;

    for (let index = 0; index < promises.length; index++) {
      Promise.resolve(promises[index])
        .then((value) => {
          results[index] = value;
          console.log(value);
          completedPromises += 1;
          if (completedPromises === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    }

    if (promises.length === 0) {
      resolve([]);
    }
  });
}

const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, "first");
});
const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, "second");
});
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 5000, "third");
});

myPromiseAll([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
```

## 84. promise-allsettled

slug: promise-allsettled
topicSlug: promises
title: Promise.allSettled
sourceFile: apps/web/content/promises.mdx
sourceSection: Promise.allSettled
sourceSnippet: Promise.allSettled
language: js

```js
const rejectHandler = (reason) => ({ status: "rejected", reason });
const resolveHandler = (value) => ({ status: "fulfilled", value });

Promise.customAllSettled = function (promises) {
  const convertedPromises = promises.map((p) =>
    Promise.resolve(p).then(resolveHandler, rejectHandler),
  );

  return Promise.all(convertedPromises);
};

Promise.customAllSettled([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Whoops!")), 2000),
  ),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
])
  .then(console.info)
  .catch(console.error);
```

## 85. promise-any

slug: promise-any
topicSlug: promises
title: Promise.any
sourceFile: apps/web/content/promises.mdx
sourceSection: Promise.any
sourceSnippet: Promise.any
language: js

```js
Promise.customAny = function (promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let remaining = promises.length;

    if (remaining === 0) {
      return reject(new AggregateError([], "All promises were rejected"));
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve)
        .catch((error) => {
          errors[index] = error;
          remaining -= 1;
          if (remaining === 0) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
};

const promise1 = Promise.reject(0);
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, "quick"));
const promise3 = new Promise((resolve) => setTimeout(resolve, 500, "slow"));

const promises = [promise1, promise2, promise3];

Promise.customAny(promises).then((value) => console.log(value));
```

## 86. promise-race

slug: promise-race
topicSlug: promises
title: Promise.race
sourceFile: apps/web/content/promises.mdx
sourceSection: Promise.race
sourceSnippet: Promise.race
language: js

```js
Promise.customRace = function (promises) {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      Promise.resolve(promise).then(resolve, reject);
    }
  });
};

Promise.customRace([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Whoops!")), 2000),
  ),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
]).then(console.log);
```

## 87. clsx

slug: clsx
topicSlug: random
title: clsx
sourceFile: apps/web/content/random.mdx
sourceSection: clsx
sourceSnippet: clsx
language: js

```js
function clsx(...args) {
  const classes = [];

  for (const arg of args) {
    // Skip the current iteration if the argument is falsy
    if (!arg) continue;

    if (typeof arg === "string") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      classes.push(clsx(...arg)); // Recursively process arrays
    } else if (typeof arg === "object") {
      for (const key in arg) {
        if (arg[key]) {
          classes.push(key); // Push key if value is truthy
        }
      }
    }
  }

  return classes.join(" "); // Join classes with a space
}
```

## 90. filtermap

slug: filtermap
topicSlug: random
title: filterMap
sourceFile: apps/web/content/random.mdx
sourceSection: filterMap
sourceSnippet: filterMap
language: js

```js
export const filterMap = (array, filterBoolean, mapCallback) => {
  return array.reduce((acc, item, idx) => {
    if (filterBoolean(item)) {
      acc.push(mapCallback(item, idx));
    }
    return acc;
  }, []);
};

const people = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 30, active: false },
  { name: "Charlie", age: 35, active: true },
];

const activeNames = filterMap(
  people,
  (person) => person.active,
  (person) => person.name,
);
```

## 91. innerjoin

slug: innerjoin
topicSlug: random
title: innerJoin
sourceFile: apps/web/content/random.mdx
sourceSection: innerJoin
sourceSnippet: innerJoin
language: js

```js
function innerJoin(predicate, records, ids) {
  return records.filter((record) => ids.some((id) => predicate(record, id)));
}

const result = innerJoin(
  (record, id) => record.id === id,
  [
    { id: 824, name: "Richie Furay" },
    { id: 956, name: "Dewey Martin" },
    { id: 313, name: "Bruce Palmer" },
    { id: 456, name: "Stephen Stills" },
    { id: 177, name: "Neil Young" },
  ],
  [177, 456, 999],
);

console.log(result);
```

## 92. reducer

slug: reducer
topicSlug: random
title: Reducer Pattern with Actions
sourceFile: apps/web/content/random.mdx
sourceSection: Reducer Pattern with Actions
sourceSnippet: reducer
language: js

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.id) {
          const { type, ...actionNoType } = action;
          return actionNoType;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialState = [];
const actions = [
  { type: "added", id: 1, text: "Visit Kafka Museum" },
  { type: "added", id: 2, text: "Watch a puppet show" },
  { type: "deleted", id: 1 },
  { type: "added", id: 3, text: "Lennon Wall pic" },
  { type: "changed", id: 3, text: "Lennon Wall", done: true },
];
const finalState = actions.reduce(tasksReducer, initialState);
console.log(finalState);
```

## 95. topological-sort

slug: topological-sort
topicSlug: random
title: Topological Sort
sourceFile: apps/web/content/random.mdx
sourceSection: Topological Sort
sourceSnippet: topological sort
language: js

```js
const cards = [
  { id: 1, dependent: [6, 7, 8] },
  { id: 2, dependent: [6] },
  { id: 3, dependent: [] },
  { id: 4, dependent: [6, 7, 8] },
  { id: 5, dependent: [6, 8] },
  { id: 6, dependent: [] },
  { id: 7, dependent: [6] },
  { id: 8, dependent: [7] },
  { id: 9, dependent: [1] },
  { id: 10, dependent: [9] },
];

const getOrderedCards = (cards) => {
  const result = [];
  const added = new Set();

  while (result.length < cards.length) {
    let addedInPass = false;

    for (const card of cards) {
      if (
        !added.has(card.id) &&
        card.dependent.every((dep) => added.has(dep))
      ) {
        result.push(card.id);
        added.add(card.id);
        addedInPass = true;
      }
    }

    if (!addedInPass) {
      throw new Error("Cannot resolve dependency order");
    }
  }

  return result;
};

console.log(getOrderedCards(cards));
```
