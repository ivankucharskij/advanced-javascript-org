export const savedSnippets = {
   "data": [
    {
      "id": "79c7a54c-bcbe-431f-83bc-7999872c3ca2",
      "slug": "concat",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.concat",
      "language": "js",
      "code": "Array.prototype.myConcat = function (...arrays) {\n  const result = [...this];\n\n  for (const array of arrays) {\n    if (Array.isArray(array)) {\n      result.push(...array);\n    } else {\n      result.push(array);\n    }\n  }\n\n  return result;\n};",
      "createdAt": "2026-08-16T14:31:34.821Z",
      "updatedAt": "2026-08-16T14:31:34.821Z"
    },
    {
      "id": "4b64342a-29f4-469b-a8be-98ed2b9020cd",
      "slug": "fill",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.fill",
      "language": "js",
      "code": "Array.prototype.customFill = function (value, start = 0, end = this.length) {\n  if (start < 0) {\n    start = this.length + start;\n  }\n\n  if (end < 0) {\n    end = this.length + end;\n  }\n\n  for (let i = start; i < Math.min(end, this.length); i++) {\n    this[i] = value;\n  }\n\n  return this;\n};",
      "createdAt": "2026-08-16T14:31:34.841Z",
      "updatedAt": "2026-08-16T14:31:34.841Z"
    },
    {
      "id": "c651ae6d-d2db-43a1-9450-87844106c285",
      "slug": "pop",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.pop",
      "language": "js",
      "code": "Array.prototype.customPop = function () {\n  const length = this.length;\n\n  if (length === 0) {\n    return undefined;\n  }\n\n  const lastElement = this[length - 1];\n  this.length = length - 1;\n\n  return lastElement;\n};",
      "createdAt": "2026-08-16T14:31:34.900Z",
      "updatedAt": "2026-08-16T14:31:34.900Z"
    },
    {
      "id": "f9cd55b6-3c1d-411d-935b-a48a2a050b17",
      "slug": "push",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.push",
      "language": "js",
      "code": "Array.prototype.customPush = function () {\n  for (let i = 0; i < arguments.length; i++) {\n    this[this.length] = arguments[i];\n  }\n\n  return this.length;\n};",
      "createdAt": "2026-08-16T14:31:34.911Z",
      "updatedAt": "2026-08-16T14:31:34.911Z"
    },
    {
      "id": "dde7cd74-b061-4df6-b043-8c1bdcb96fc0",
      "slug": "reverse",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.reverse",
      "language": "js",
      "code": "Array.prototype.customReverse = function () {\n  const middle = Math.floor(this.length / 2);\n\n  for (let i = 0; i < middle; i++) {\n    const temp = this[i];\n    this[i] = this[this.length - 1 - i];\n    this[this.length - 1 - i] = temp;\n  }\n\n  return this;\n};",
      "createdAt": "2026-08-16T14:31:34.922Z",
      "updatedAt": "2026-08-16T14:31:34.922Z"
    },
    {
      "id": "14f273d6-bc3a-4d03-af7c-e95087fd7e44",
      "slug": "shift",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.shift",
      "language": "js",
      "code": "Array.prototype.customShift = function () {\n  if (!this.length) return;\n\n  const firstElement = this[0];\n\n  for (let i = 0; i < this.length; i++) {\n    this[i] = this[i + 1];\n  }\n\n  this.length -= 1;\n\n  return firstElement;\n};",
      "createdAt": "2026-08-16T14:31:34.933Z",
      "updatedAt": "2026-08-16T14:31:34.933Z"
    },
    {
      "id": "fe54066f-3a8e-487f-99e9-9d512d281c85",
      "slug": "unshift",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.unshift",
      "language": "js",
      "code": "Array.prototype.customUnshift = function (...elements) {\n  const originalLength = this.length;\n  const totalLength = elements.length + originalLength;\n\n  // Shift existing elements to the right\n  for (let i = originalLength - 1; i >= 0; i--) {\n    this[i + elements.length] = this[i];\n  }\n\n  // Add new elements at the beginning\n  for (let i = 0; i < elements.length; i++) {\n    this[i] = elements[i];\n  }\n\n  return totalLength; // Return the new length\n};",
      "createdAt": "2026-08-16T14:31:34.945Z",
      "updatedAt": "2026-08-16T14:31:34.945Z"
    },
    {
      "id": "c48d1f14-99b5-438e-b1bd-fb798a927116",
      "slug": "splice",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.splice",
      "language": "js",
      "code": "Array.prototype.customSplice = function (\n  startIndex,\n  deleteCount,\n  ...itemsToAdd\n) {\n  const length = this.length;\n\n  // Handle negative indices\n  startIndex =\n    startIndex < 0\n      ? Math.max(length + startIndex, 0)\n      : Math.min(startIndex, length);\n\n  // If deleteCount is undefined, remove all elements starting from startIndex\n  if (deleteCount === undefined) {\n    deleteCount = length - startIndex;\n  } else {\n    // Normalize deleteCount\n    deleteCount = Math.max(0, Math.min(deleteCount, length - startIndex));\n  }\n\n  // Extract the array to be deleted\n  const splicedItems = this.slice(startIndex, startIndex + deleteCount);\n\n  // Create the resulting this by combining parts and items to add\n  const remainingItems = [\n    ...this.slice(0, startIndex),\n    ...itemsToAdd,\n    ...this.slice(startIndex + deleteCount),\n  ];\n\n  // Update the original array\n  this.length = 0; // Clear the this\n  for (let i = 0; i < remainingItems.length; i++) {\n    this[i] = remainingItems[i];\n  }\n\n  // Return the deleted items\n  return splicedItems;\n};",
      "createdAt": "2026-08-16T14:31:34.956Z",
      "updatedAt": "2026-08-16T14:31:34.956Z"
    },
    {
      "id": "c1088e64-b8b6-499a-b2cc-091321854eb1",
      "slug": "filter",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.filter",
      "language": "js",
      "code": "Array.prototype.myFilter = function (callback) {\n  const result = [];\n\n  for (let i = 0; i < this.length; i++) {\n    if (callback(this[i], i, this)) {\n      result.push(this[i]);\n    }\n  }\n\n  return result;\n};",
      "createdAt": "2026-08-16T14:31:34.967Z",
      "updatedAt": "2026-08-16T14:31:34.967Z"
    },
    {
      "id": "250f5cb7-2a13-46cc-b3c0-0a8443c46be3",
      "slug": "flat",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.flat",
      "language": "js",
      "code": "Array.prototype.customFlat = function (depth = 1) {\n  const result = [];\n\n  const flatten = (array, depth) => {\n    for (const item of array) {\n      if (Array.isArray(item) && depth > 0) {\n        flatten(item, depth - 1);\n      } else {\n        result.push(item);\n      }\n    }\n  };\n  flatten(this, depth);\n\n  return result;\n};",
      "createdAt": "2026-08-16T14:31:34.979Z",
      "updatedAt": "2026-08-16T14:31:34.979Z"
    },
    {
      "id": "ce35ff81-302b-48ac-964a-6aea2c6542ed",
      "slug": "flatmap",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.flatMap",
      "language": "js",
      "code": "Array.prototype.customFlatMap = function (callback, thisArg) {\n  const result = [];\n\n  for (let i = 0; i < this.length; i++) {\n    const mapped = callback.call(thisArg, this[i], i, this);\n\n    if (Array.isArray(mapped)) {\n      result.push(...mapped); // Use spread operator for flattening\n    } else {\n      result.push(mapped);\n    }\n  }\n\n  return result;\n};",
      "createdAt": "2026-08-16T14:31:34.989Z",
      "updatedAt": "2026-08-16T14:31:34.989Z"
    },
    {
      "id": "3477ad92-e041-48e1-9aa6-c98e97a7e8e9",
      "slug": "join",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.join",
      "language": "js",
      "code": "Array.prototype.customJoin = function (separator = \",\") {\n  let result = \"\";\n\n  for (let i = 0; i < this.length; i++) {\n    if (i > 0) {\n      result += separator;\n    }\n\n    result += this[i];\n  }\n\n  return result;\n};",
      "createdAt": "2026-08-16T14:31:35.000Z",
      "updatedAt": "2026-08-16T14:31:35.000Z"
    },
    {
      "id": "c0d3cc56-0208-442f-a20b-b52a422cc6d7",
      "slug": "map",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.map",
      "language": "js",
      "code": "Array.prototype.customMap = function (callbackFn) {\n  if (typeof callbackFn !== \"function\") {\n    throw new TypeError(\"Callback must be a function\");\n  }\n\n  const arr = [];\n  for (let i = 0; i < this.length; i++) {\n    arr.push(callbackFn(this[i], i, this));\n  }\n\n  return arr;\n};",
      "createdAt": "2026-08-16T14:31:35.010Z",
      "updatedAt": "2026-08-16T14:31:35.010Z"
    },
    {
      "id": "57646604-bc95-49e7-a046-43f53c540aae",
      "slug": "reduce",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.reduce",
      "language": "js",
      "code": "Array.prototype.customReduce = function (callback, initialValue) {\n  let accumulator = initialValue !== undefined ? initialValue : this[0];\n\n  const startIndex = initialValue !== undefined ? 0 : 1;\n\n  for (let i = startIndex; i < this.length; i++) {\n    accumulator = callback(accumulator, this[i], i, this);\n  }\n\n  return accumulator;\n};",
      "createdAt": "2026-08-16T14:31:35.021Z",
      "updatedAt": "2026-08-16T14:31:35.021Z"
    },
    {
      "id": "cb08319e-2049-41e1-9b4e-516834cb6adf",
      "slug": "slice",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.slice",
      "language": "js",
      "code": "Array.prototype.customSlice = function (start = 0, end) {\n  const length = this.length;\n  let endIndex = end || length;\n\n  if (start < 0) {\n    start = Math.max(length + start, 0);\n  }\n  if (endIndex < 0) {\n    endIndex = Math.max(length + endIndex, 0);\n  }\n\n  const result = [];\n\n  for (let i = start; i < endIndex && i < length; i++) {\n    result.push(this[i]);\n  }\n\n  return result;\n};",
      "createdAt": "2026-08-16T14:31:35.031Z",
      "updatedAt": "2026-08-16T14:31:35.031Z"
    },
    {
      "id": "33cba6c3-20e6-4da6-8366-9beefe3f5177",
      "slug": "find",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.find",
      "language": "js",
      "code": "Array.prototype.customFind = function (callback) {\n  for (let i = 0; i < this.length; i++) {\n    if (callback(this[i])) {\n      return this[i];\n    }\n  }\n};",
      "createdAt": "2026-08-16T14:31:35.042Z",
      "updatedAt": "2026-08-16T14:31:35.042Z"
    },
    {
      "id": "78600ee3-8e9b-44ae-b04f-1a0075f87738",
      "slug": "findlast",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.findLast",
      "language": "js",
      "code": "Array.prototype.customFindLast = function (callback) {\n  for (let i = this.length; i >= 0; i--) {\n    if (callback(this[i])) {\n      return this[i];\n    }\n  }\n};",
      "createdAt": "2026-08-16T14:31:35.053Z",
      "updatedAt": "2026-08-16T14:31:35.053Z"
    },
    {
      "id": "d025644d-8e17-4c49-a352-be0f50694766",
      "slug": "at",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.at",
      "language": "js",
      "code": "Array.prototype.customAt = function (index) {\n  if (index < 0) {\n    index = this.length + index;\n  }\n\n  return this[index];\n};",
      "createdAt": "2026-08-16T14:31:35.064Z",
      "updatedAt": "2026-08-16T14:31:35.064Z"
    },
    {
      "id": "71f132e1-a157-42ff-84f0-8e246f478c38",
      "slug": "every",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.every",
      "language": "js",
      "code": "Array.prototype.customEvery = function (callback) {\n  for (let i = 0; i < this.length; i++) {\n    if (!callback(this[i], i)) {\n      return false;\n    }\n  }\n\n  return true;\n};",
      "createdAt": "2026-08-16T14:31:35.074Z",
      "updatedAt": "2026-08-16T14:31:35.074Z"
    },
    {
      "id": "026c913e-864a-40b3-b750-ce3fbb2f3d02",
      "slug": "includes",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.includes",
      "language": "js",
      "code": "function sameValueZero(x, y) {\n  return (\n    x === y ||\n    (typeof x === \"number\" && typeof y === \"number\" && x !== x && y !== y)\n  );\n}\n\nArray.prototype.customIncludes = function (searchElement, fromIndex = 0) {\n  const length = this.length;\n\n  if (length === 0) {\n    return false;\n  }\n\n  if (fromIndex < 0) {\n    fromIndex = Math.max(length + fromIndex, 0);\n  }\n\n  for (let i = fromIndex; i < length; i++) {\n    if (sameValueZero(this[i], searchElement)) {\n      return true;\n    }\n  }\n\n  return false;\n};",
      "createdAt": "2026-08-16T14:31:35.084Z",
      "updatedAt": "2026-08-16T14:31:35.084Z"
    },
    {
      "id": "d44523e0-e3f3-4be0-91b4-aaecb88753c2",
      "slug": "some",
      "topicSlug": "array-methods",
      "title": "Implement Array.prototype.some",
      "language": "js",
      "code": "Array.prototype.customSome = function (callback) {\n  for (let i = 0; i < this.length; i++) {\n    if (callback(this[i], i, this)) {\n      return true;\n    }\n  }\n\n  return false;\n};",
      "createdAt": "2026-08-16T14:31:35.094Z",
      "updatedAt": "2026-08-16T14:31:35.094Z"
    },
    {
      "id": "5d4a8d85-968e-44ed-9ebc-c779bb3288cd",
      "slug": "composition",
      "topicSlug": "composition-vs-inheritance",
      "title": "Function Composition Pipeline",
      "language": "js",
      "code": "const dateFunc = () => new Date();\nconst textFunc = (date) => date.toDateString();\nconst labelFunc = (text) => `Today ${text}`;\nconst showLabelFunc = (label) => console.log(label);\n\nconst date = dateFunc();\nconst text = textFunc(date);\nconst label = labelFunc(text);\nshowLabelFunc(label);\n\nfunction pipe(...steps) {\n  return function runSteps() {\n    let result;\n    for (let i = 0; i < steps.length; i++) {\n      let step = steps[i];\n      result = step(result);\n    }\n    return result;\n  };\n}\n\nconst showDateLabel = pipe(dateFunc, textFunc, labelFunc, showLabelFunc);\nshowDateLabel();",
      "createdAt": "2026-08-16T14:31:35.104Z",
      "updatedAt": "2026-08-16T14:31:35.104Z"
    },
    {
      "id": "347bd14a-4f5d-417b-b85b-05e830e99dbf",
      "slug": "this",
      "topicSlug": "core-concepts",
      "title": "thisArg in Array Callbacks",
      "language": "js",
      "code": "\"use strict\";\n\nArray.prototype.customFilter = function (callback, thisArg) {\n  let result = [];\n\n  for (let i = 0; i < this.length; i++) {\n    if (callback.call(thisArg, this[i], i, this)) {\n      result.push(this[i]);\n    }\n  }\n\n  return result;\n};\n\nArray.prototype.customFilterNoThis = function (callback) {\n  let result = [];\n\n  for (let i = 0; i < this.length; i++) {\n    if (callback(this[i], i, this)) {\n      result.push(this[i]);\n    }\n  }\n\n  return result;\n};\n\nconst army = {\n  minAge: 18,\n  maxAge: 27,\n  canJoin(user) {\n    return user.age >= this.minAge && user.age < this.maxAge;\n  },\n};\n\nconst users = [{ age: 16 }, { age: 20 }, { age: 23 }, { age: 30 }];\n\nconst soldiers2 = users.customFilterNoThis((user) => army.canJoin(user));\nconst soldiers3 = users.customFilter(army.canJoin, army);\n\nconsole.log(soldiers2);\nconsole.log(soldiers3);",
      "createdAt": "2026-08-16T14:31:35.115Z",
      "updatedAt": "2026-08-16T14:31:35.115Z"
    },
    {
      "id": "86956479-1d9a-4194-b653-40bf3f051286",
      "slug": "object-method-this",
      "topicSlug": "core-concepts",
      "title": "Broken Object Method Receiver",
      "language": "js",
      "code": "let user = {\n  name: \"John\",\n  sayHi() {\n    console.log(user.name);\n  },\n};\n\nconst admin = user;\nuser = null;\n\nadmin.sayHi();",
      "createdAt": "2026-08-16T14:31:35.125Z",
      "updatedAt": "2026-08-16T14:31:35.125Z"
    },
    {
      "id": "c03013a4-92be-47ba-8251-595cb7d8c36a",
      "slug": "object-method-this-fix",
      "topicSlug": "core-concepts",
      "title": "Object Method Receiver with this",
      "language": "js",
      "code": "let user = {\n  name: \"John\",\n  sayHi() {\n    console.log(this.name);\n  },\n};\n\nconst admin = user;\nuser = null;\n\nadmin.sayHi();",
      "createdAt": "2026-08-16T14:31:35.135Z",
      "updatedAt": "2026-08-16T14:31:35.135Z"
    },
    {
      "id": "a394cd8b-fb61-424f-9428-5b86bf2cd3f2",
      "slug": "object-literal-this",
      "topicSlug": "core-concepts",
      "title": "Object Literals and this Binding",
      "language": "js",
      "code": "function makeUser() {\n  return {\n    name: \"John\",\n    ref: this,\n  };\n}\n\nconst user = makeUser();\nconsole.log(user.ref?.name); \n\nfunction makeUserWithMethod() {\n  return {\n    name: \"John\",\n    ref() {\n      return this;\n    },\n  };\n}\n\nconst user2 = makeUserWithMethod();\nconsole.log(user2.ref().name);",
      "createdAt": "2026-08-16T14:31:35.187Z",
      "updatedAt": "2026-08-16T14:31:35.187Z"
    },
    {
      "id": "0bc04f96-d428-4c41-9eaa-f4ce592669de",
      "slug": "method-chaining",
      "topicSlug": "core-concepts",
      "title": "Method Chaining with this",
      "language": "js",
      "code": "const ladder = {\n  step: 0,\n  up() {\n    this.step++;\n    return this;\n  },\n  down() {\n    this.step--;\n    return this;\n  },\n  showStep() {\n    console.log(this.step);\n    return this;\n  },\n};\n\nladder.up().up().down().showStep().down().showStep();",
      "createdAt": "2026-08-16T14:31:35.211Z",
      "updatedAt": "2026-08-16T14:31:35.211Z"
    },
    {
      "id": "d7293006-8811-405e-8994-b2306fee79a3",
      "slug": "for-vs-while",
      "topicSlug": "core-concepts",
      "title": "Pre-Increment vs Post-Increment in Loops",
      "language": "js",
      "code": "let i = 0;\nwhile (++i < 3) console.log(i);\n\nlet i2 = 0;\nwhile (i2++ < 3) console.log(i2);\n\nfor (let i = 0; i < 3; i++) console.log(i);\n\nfor (let i = 0; i < 3; ++i) console.log(i);",
      "createdAt": "2026-08-16T14:31:35.226Z",
      "updatedAt": "2026-08-16T14:31:35.226Z"
    },
    {
      "id": "b551abf5-45fa-477f-a000-87d95c2c4a8f",
      "slug": "bind",
      "topicSlug": "core-concepts",
      "title": "Lost Method Receiver in setTimeout",
      "language": "js",
      "code": "const user = {\n  firstName: \"John\",\n  sayHi() {\n    console.log(`Hello, ${this.firstName}!`);\n  },\n};\n\nuser.sayHi();\nsetTimeout(user.sayHi, 0);",
      "createdAt": "2026-08-16T14:31:35.373Z",
      "updatedAt": "2026-08-16T14:31:35.373Z"
    },
    {
      "id": "79b59a6d-dd35-43e1-a03f-0f07247c4a5f",
      "slug": "call-and-arrows",
      "topicSlug": "core-concepts",
      "title": "call with Regular and Arrow Functions",
      "language": "js",
      "code": "const obj = {\n  value: 25,\n  regularMethod() {\n    return this.value;\n  },\n  arrowMethod: () => {\n    return this?.value;\n  },\n};\n\nconst anotherObj = {\n  value: 50,\n};",
      "createdAt": "2026-08-16T14:31:35.497Z",
      "updatedAt": "2026-08-16T14:31:35.497Z"
    },
    {
      "id": "7321600e-4eea-4444-95ff-b13076d35cca",
      "slug": "object-create",
      "topicSlug": "core-concepts",
      "title": "Prototype Inheritance with Object.create",
      "language": "js",
      "code": "const vehicle = {\n  getInfo() {\n    console.log(`${this.model} was made in ${this.year}`);\n  },\n};\n\nconst myCar = Object.create(vehicle);\nmyCar.model = \"BMW\";\nmyCar.year = 2010;\n\nmyCar.getInfo();",
      "createdAt": "2026-08-16T14:31:35.507Z",
      "updatedAt": "2026-08-16T14:31:35.507Z"
    },
    {
      "id": "030f8b46-fc6d-42de-a752-6387b10d0937",
      "slug": "async-generator",
      "topicSlug": "core-concepts",
      "title": "Async Generator Sequence",
      "language": "js",
      "code": "async function* generateSequence(start, end) {\n  for (let i = start; i <= end; i++) {\n    await new Promise((resolve) => setTimeout(resolve, 1000));\n    yield i;\n  }\n}\n\nconst timer = async (callback) => {\n  const generator = generateSequence(1, 5);\n  for await (let value of generator) {\n    callback(value);\n  }\n};",
      "createdAt": "2026-08-16T14:31:35.517Z",
      "updatedAt": "2026-08-16T14:31:35.517Z"
    },
    {
      "id": "80f25650-0102-4e2f-a6ee-0f30a9c2aa30",
      "slug": "function-stack",
      "topicSlug": "core-concepts",
      "title": "Recursive Call Stack Order",
      "language": "js",
      "code": "function foo(i) {\n  if (i < 0) {\n    return;\n  }\n  console.log(`begin: ${i}`);\n  foo(i - 1);\n  console.log(`end: ${i}`);\n}",
      "createdAt": "2026-08-16T14:31:35.527Z",
      "updatedAt": "2026-08-16T14:31:35.527Z"
    },
    {
      "id": "2d789a8e-bbc5-482f-a276-71d8ce728fd2",
      "slug": "lexical-environment-scope-fixed",
      "topicSlug": "core-concepts",
      "title": "Closure Capture in Loops",
      "language": "js",
      "code": "function makeArmy() {\n  const shooters = [];\n\n  let i = 0;\n  while (i < 10) {\n    let j = i;\n    const shooter = function () {\n      return j;\n    };\n    shooters.push(shooter);\n    i++;\n  }\n\n  return shooters;\n}\n\nconst army = makeArmy();\n\nconsole.log(army[0]());\nconsole.log(army[1]());\nconsole.log(army[5]());",
      "createdAt": "2026-08-16T14:31:35.538Z",
      "updatedAt": "2026-08-16T14:31:35.538Z"
    },
    {
      "id": "75ac0c87-5c6e-482c-b2e0-ed017dbef07e",
      "slug": "lexical-environment-scope-broken",
      "topicSlug": "core-concepts",
      "title": "Broken Closure Scope in Loops",
      "language": "js",
      "code": "function makeArmy() {\n  const shooters = [];\n\n  let i = 0;\n  while (i < 10) {\n    const shooter = function () {\n      return i;\n    };\n    shooters.push(shooter);\n    i++;\n  }\n\n  return shooters;\n}\n\nconst army = makeArmy();\n\nconsole.log(army[0]());\nconsole.log(army[1]());\nconsole.log(army[5]());",
      "createdAt": "2026-08-16T14:31:35.548Z",
      "updatedAt": "2026-08-16T14:31:35.548Z"
    },
    {
      "id": "5706e730-9892-4489-afed-25774a00f6c4",
      "slug": "output-every-second",
      "topicSlug": "debounce-throttle",
      "title": "Interval-Based Number Printer",
      "language": "js",
      "code": "function printNumbers(from, to) {\n  let current = from;\n  let timerId;\n\n  function go() {\n    console.log(current);\n    if (current === to) {\n      clearInterval(timerId);\n    }\n    current++;\n  }\n\n  go();\n  timerId = setInterval(go, 1000);\n}\n\nprintNumbers(5, 10);",
      "createdAt": "2026-08-16T14:31:35.558Z",
      "updatedAt": "2026-08-16T14:31:35.558Z"
    },
    {
      "id": "94896dfb-4957-4a4f-a4ab-6bc4da15deca",
      "slug": "output-every-second-2",
      "topicSlug": "debounce-throttle",
      "title": "Timeout-Based Number Printer",
      "language": "js",
      "code": "function printNumbers(from, to) {\n  let current = from;\n\n  function go() {\n    console.log(current);\n    if (current < to) {\n      setTimeout(go, 1000);\n    }\n    current++;\n  }\n\n  go();\n}\n\nprintNumbers(5, 10);",
      "createdAt": "2026-08-16T14:31:35.568Z",
      "updatedAt": "2026-08-16T14:31:35.568Z"
    },
    {
      "id": "c0c66913-ce51-4352-a0dd-e1b218f84ea2",
      "slug": "debounce",
      "topicSlug": "debounce-throttle",
      "title": "Implement debounce",
      "language": "js",
      "code": "function debounce(func, ms) {\n  let timeout;\n\n  return function (...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => func.apply(this, args), ms);\n  };\n}\n\nconst timeLoggedConsoleLog = (...args) => {\n  console.log(`Logged after ${Date.now() - startTime} ms:`, ...args);\n};\n\nconst startTime = Date.now();\nconst f = debounce(timeLoggedConsoleLog, 500);\n\nf(\"a\");\nsetTimeout(() => f(\"b\"), 200);\nsetTimeout(() => f(\"c\"), 600);\nsetTimeout(() => f(\"d\"), 600);\nsetTimeout(() => f(\"e\"), 600); // Logged after 1118 ms: e",
      "createdAt": "2026-08-16T14:31:35.579Z",
      "updatedAt": "2026-08-16T14:31:35.579Z"
    },
    {
      "id": "6b5473a8-811b-48d2-8083-b00a80e8b95f",
      "slug": "throttle",
      "topicSlug": "debounce-throttle",
      "title": "Implement throttle",
      "language": "js",
      "code": "function throttle(fn, limit) {\n  let inThrottle;\n\n  return function (...args) {\n    if (inThrottle) return;\n    fn.apply(this, args);\n    inThrottle = true;\n    setTimeout(() => (inThrottle = false), limit);\n  };\n}\n\nconst timeLoggedConsoleLog = (...args) => {\n  console.log(`Logged after ${Date.now() - startTime} ms:`, ...args);\n};\n\nconst startTime = Date.now();\nconst f = throttle(timeLoggedConsoleLog, 500);",
      "createdAt": "2026-08-16T14:31:35.589Z",
      "updatedAt": "2026-08-16T14:31:35.589Z"
    },
    {
      "id": "804cdeb7-cf98-45a6-a838-ce1fc8166613",
      "slug": "promise-all-and-the-event-loop",
      "topicSlug": "event-loop",
      "title": "Promise.all and Event Loop Timing",
      "language": "js",
      "code": "const promise1 = Promise.resolve(3);\nconst promise2 = new Promise((resolve, reject) => {\n  setTimeout(resolve, 1000, \"foo\");\n});\nconst promise3 = 42;\n\nPromise.all([promise1, promise2, promise3]).then((values) => {\n  console.log({ values });\n});\n\n// Using setTimeout, we can execute code after the queue is empty\nsetTimeout(() => {\n  console.log(\"the queue is now empty\");\n});\n\nconst p3 = Promise.all([]); // Will be immediately resolved\nconst p4 = Promise.all([1337, \"hi\"]);\n\n// Non-promise values are ignored, but the evaluation is done asynchronously\nconsole.log({ p3 });\nconsole.log({ p4 });\n\nsetTimeout(() => {\n  console.log({ p4 });\n});\n\nPromise.all([promise1, promise2, promise3]).then((values) => {\n  console.log({ values2: values });\n});\n\nconst promise4 = Promise.resolve(3);\nconst promise5 = 42;\n\nPromise.all([promise4, promise5]).then((values) => {\n  console.log({ values3: values });\n});",
      "createdAt": "2026-08-16T14:31:35.600Z",
      "updatedAt": "2026-08-16T14:31:35.600Z"
    },
    {
      "id": "9e2e59e4-d5d6-40d5-a428-5c58df77c3bf",
      "slug": "promise-chaining-and-microtask-queue-order",
      "topicSlug": "event-loop",
      "title": "Promise Chain Microtask Order",
      "language": "js",
      "code": "const promise1 = Promise.resolve();\nconst promise2 = Promise.resolve();\n\npromise1.then(() => console.log(1)).then(() => console.log(2));\npromise2.then(() => console.log(3)).then(() => console.log(4));",
      "createdAt": "2026-08-16T14:31:35.610Z",
      "updatedAt": "2026-08-16T14:31:35.610Z"
    },
    {
      "id": "fa0e4f90-d243-4236-95ce-87ec41b7f0cf",
      "slug": "let-in-loops-with-settimeout",
      "topicSlug": "event-loop",
      "title": "let in Loops with setTimeout",
      "language": "js",
      "code": "for (let i = 0; i < 4; i++) {\n  setTimeout(() => {\n    console.log(i);\n  }, 1000);\n}",
      "createdAt": "2026-08-16T14:31:35.621Z",
      "updatedAt": "2026-08-16T14:31:35.621Z"
    },
    {
      "id": "560aebcb-0250-437c-9a5c-2830288777c1",
      "slug": "promise-lifecycle-and-event-loop-timing",
      "topicSlug": "event-loop",
      "title": "Promise Lifecycle Timing",
      "language": "js",
      "code": "const promise = new Promise((resolve, reject) => {\n  console.log(\"Promise callback\");\n  resolve(\"resolved\");\n  console.log(\"Promise callback end\");\n}).then((result) => {\n  console.log(\"Promise callback (.then)\", result);\n});\n\nsetTimeout(() => {\n  console.log(\"event-loop cycle: Promise (fulfilled)\", promise);\n}, 0);\n\nconsole.log(\"Promise (pending)\", promise);",
      "createdAt": "2026-08-16T14:31:35.631Z",
      "updatedAt": "2026-08-16T14:31:35.631Z"
    },
    {
      "id": "8d9e494b-04c8-4333-8be2-f0168cc09ff2",
      "slug": "async-function-and-timer-execution-order",
      "topicSlug": "event-loop",
      "title": "Async Function and Timer Ordering",
      "language": "js",
      "code": "async function run() {\n  console.log(\"run async\");\n  setTimeout(() => {\n    console.log(\"run timeout\");\n  }, 0);\n}\n\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\n// await or not, same result\nawait run();\n\nconsole.log(\"script\");",
      "createdAt": "2026-08-16T14:31:35.641Z",
      "updatedAt": "2026-08-16T14:31:35.641Z"
    },
    {
      "id": "6d7bb068-43b1-460e-8cfe-59563e6392f6",
      "slug": "blocking-the-event-loop-with-a-while-loop",
      "topicSlug": "event-loop",
      "title": "Blocking the Event Loop with a While Loop",
      "language": "js",
      "code": "const seconds = new Date().getTime() / 1000;\n\nsetTimeout(() => {\n  // prints out \"2\", meaning that the callback is not called immediately after 500 milliseconds.\n  console.log(`Ran after ${new Date().getTime() / 1000 - seconds} seconds`);\n}, 500);\n\nwhile (true) {\n  if (new Date().getTime() / 1000 - seconds >= 2) {\n    console.log(\"Good, looped for 2 seconds\");\n    break;\n  }\n}",
      "createdAt": "2026-08-16T14:31:35.651Z",
      "updatedAt": "2026-08-16T14:31:35.651Z"
    },
    {
      "id": "cb4dadd1-984a-480b-94d9-19b31fc0d01c",
      "slug": "script-microtasks-and-macrotasks-in-execution-order",
      "topicSlug": "event-loop",
      "title": "Script, Microtask, and Macrotask Order",
      "language": "js",
      "code": "console.log(\"Script start\");\n\nsetTimeout(() => {\n  console.log(\"setTimeout\");\n}, 0);\n\nPromise.resolve()\n  .then(() => {\n    console.log(\"Promise 1\");\n  })\n  .then(() => {\n    console.log(\"Promise 2\");\n  });\n\nconsole.log(\"Script end\");\n\nconst promise1 = new Promise((resolve, reject) => {\n  console.log(\"Promise constructor\");\n  resolve();\n}).then(() => {\n  console.log(\"Promise constructor resolve\");\n});\n\nqueueMicrotask(() => {\n  console.log(\"Microtask queue\");\n});\n\nconsole.log(\"After Promise constructor\");",
      "createdAt": "2026-08-16T14:31:35.662Z",
      "updatedAt": "2026-08-16T14:31:35.662Z"
    },
    {
      "id": "0cb1ec07-6fc2-43b9-bf24-090481f2ef81",
      "slug": "blocking-inside-async-callbacks",
      "topicSlug": "event-loop",
      "title": "Blocking Work Inside Async Callbacks",
      "language": "js",
      "code": "function longRunningTask() {\n  console.log(\"Start Long-Running Task\");\n\n  const startTime = Date.now();\n  while (Date.now() - startTime < 2000) {\n    // Simulate a long-running task (2 seconds)\n  }\n\n  console.log(\"Long-Running Task Completed\");\n}\n\nfunction simulateNonBlocking() {\n  console.log(\"Start\");\n\n  setTimeout(() => {\n    console.log(\"Non-blocking Operation\");\n    longRunningTask();\n  }, 0);\n\n  console.log(\"End\");\n}\n\nsimulateNonBlocking();",
      "createdAt": "2026-08-16T14:31:35.672Z",
      "updatedAt": "2026-08-16T14:31:35.672Z"
    },
    {
      "id": "258af7f8-e126-46a1-844a-d001e9255f20",
      "slug": "nested-microtasks-in-macrotasks",
      "topicSlug": "event-loop",
      "title": "Nested Microtasks Inside Macrotasks",
      "language": "js",
      "code": "console.log(\"Start\");\n\nsetTimeout(() => {\n  console.log(\"setTimeout 1\");\n  Promise.resolve().then(() => {\n    console.log(\"Promise inside setTimeout 1\");\n  });\n}, 0);\n\nsetTimeout(() => {\n  console.log(\"setTimeout 2\");\n}, 0);\n\nPromise.resolve()\n  .then(() => {\n    console.log(\"Promise 1\");\n  })\n  .then(() => {\n    console.log(\"Promise 2\");\n  });\n\nconsole.log(\"End\");",
      "createdAt": "2026-08-16T14:31:35.682Z",
      "updatedAt": "2026-08-16T14:31:35.682Z"
    },
    {
      "id": "8b065588-d7bd-4e50-a03d-835b41fd2052",
      "slug": "requestanimationframe-and-task-ordering",
      "topicSlug": "event-loop",
      "title": "requestAnimationFrame and Task Ordering",
      "language": "js",
      "code": "console.log(\"1\");\n\nsetTimeout(function () {\n  console.log(\"2\");\n\n  Promise.resolve().then(function () {\n    console.log(\"3\");\n  });\n}, 0);\n\nPromise.resolve().then(function () {\n  console.log(\"4\");\n\n  setTimeout(function () {\n    console.log(\"5\");\n  }, 0);\n});\n\nrequestAnimationFrame(function () {\n  console.log(\"7\");\n});\n\nconsole.log(\"6\");",
      "createdAt": "2026-08-16T14:31:35.692Z",
      "updatedAt": "2026-08-16T14:31:35.692Z"
    },
    {
      "id": "ac450f65-8d8f-41a6-b66b-20e2be3f305c",
      "slug": "has-path-dfs",
      "topicSlug": "graph-traversal",
      "title": "Directed Graph Path Search with DFS",
      "language": "ts",
      "code": "type Graph = Record<string, string[]>;\n\n// Depth-First Search\nconst hasPath = (graph: Graph, src: string, dst: string): boolean => {\n  if (src === dst) return true;\n\n  for (const neighbor of graph[src]) {\n    if (hasPath(graph, neighbor, dst)) {\n      return true;\n    }\n  }\n\n  return false;\n};",
      "createdAt": "2026-08-16T14:31:35.703Z",
      "updatedAt": "2026-08-16T14:31:35.703Z"
    },
    {
      "id": "a6ec011d-8ccd-401d-8268-434ac62d1714",
      "slug": "has-path-bfs",
      "topicSlug": "graph-traversal",
      "title": "Directed Graph Path Search with BFS",
      "language": "ts",
      "code": "type Graph = Record<string, string[]>;\n\nconst hasPath = (\n  graph: Graph,\n  src: string,\n  dst: string,\n): boolean => {\n  const queue: string[] = [src];\n\n  while (queue.length) {\n    const current = queue.shift();\n    if (current === dst) return true;\n\n    if (current && graph[current]) {\n      for (const neighbor of graph[current]) {\n        queue.push(neighbor);\n      }\n    }\n  }\n\n  return false;\n};",
      "createdAt": "2026-08-16T14:31:35.713Z",
      "updatedAt": "2026-08-16T14:31:35.713Z"
    },
    {
      "id": "9a246e18-6c29-47a4-b737-a80c7046ece9",
      "slug": "undirected-path",
      "topicSlug": "graph-traversal",
      "title": "Undirected Graph Path Search",
      "language": "ts",
      "code": "const undirectedPath = (\n  edges: [string, string][],\n  nodeA: string,\n  nodeB: string,\n): boolean => {\n  const graph = buildGraph(edges);\n  return hasPath(graph, nodeA, nodeB, new Set());\n};\n\nconst buildGraph = (edges: [string, string][]) => {\n  const graph: Record<string, string[]> = {};\n\n  for (const [a, b] of edges) {\n    if (!(a in graph)) graph[a] = [];\n    if (!(b in graph)) graph[b] = [];\n    graph[a].push(b);\n    graph[b].push(a);\n  }\n\n  return graph;\n};\n\nconst hasPath = (\n  graph: Record<string, string[]>,\n  src: string,\n  dst: string,\n  visited: Set<string>,\n): boolean => {\n  if (src === dst) return true;\n  if (visited.has(src)) return false;\n  visited.add(src);\n\n  for (const neighbor of graph[src]) {\n    if (hasPath(graph, neighbor, dst, visited)) {\n      return true;\n    }\n  }\n\n  return false;\n};",
      "createdAt": "2026-08-16T14:31:35.722Z",
      "updatedAt": "2026-08-16T14:31:35.722Z"
    },
    {
      "id": "56eeb472-b044-4ebe-b836-41b6efeefb98",
      "slug": "keyby",
      "topicSlug": "lodash",
      "title": "Implement keyBy",
      "language": "js",
      "code": "function keyBy(collection, iteratee) {\n  const result = {};\n\n  for (const item of collection) {\n    const key =\n      typeof iteratee === \"function\" ? iteratee(item) : item[iteratee];\n    result[key] = item;\n  }\n\n  return result;\n}",
      "createdAt": "2026-08-16T14:31:35.732Z",
      "updatedAt": "2026-08-16T14:31:35.732Z"
    },
    {
      "id": "6be0a5b5-a4de-4ef5-b359-3b21049ab360",
      "slug": "omit",
      "topicSlug": "lodash",
      "title": "Implement omit",
      "language": "js",
      "code": "function omit(obj, keys) {\n  const result = { ...obj };\n\n  if (!Array.isArray(keys)) {\n    delete result[keys];\n    return result;\n  }\n\n  for (const key of keys) {\n    delete result[key];\n  }\n\n  return result;\n}",
      "createdAt": "2026-08-16T14:31:35.742Z",
      "updatedAt": "2026-08-16T14:31:35.742Z"
    },
    {
      "id": "d934ac6c-af32-4180-b10f-8848a7e49efa",
      "slug": "orderby",
      "topicSlug": "lodash",
      "title": "Implement orderBy",
      "language": "js",
      "code": "function orderBy(array, property, order = \"asc\") {\n  const multiplier = order === \"asc\" ? 1 : -1;\n  const copy = [...array];\n\n  return copy.sort((a, b) => {\n    if (a[property] < b[property]) return -1 * multiplier;\n    if (a[property] > b[property]) return 1 * multiplier;\n    return 0;\n  });\n}",
      "createdAt": "2026-08-16T14:31:35.753Z",
      "updatedAt": "2026-08-16T14:31:35.753Z"
    },
    {
      "id": "46122b04-7420-4989-a6e2-861e23eb86e5",
      "slug": "pick",
      "topicSlug": "lodash",
      "title": "Implement pick",
      "language": "js",
      "code": "function pick(obj, keys) {\n  if (typeof keys === \"string\") {\n    return obj[keys] !== undefined ? { [keys]: obj[keys] } : {};\n  }\n\n  return (Array.isArray(keys) ? keys : []).reduce((result, key) => {\n    if (key in obj) {\n      result[key] = obj[key];\n    }\n    return result;\n  }, {});\n}",
      "createdAt": "2026-08-16T14:31:35.763Z",
      "updatedAt": "2026-08-16T14:31:35.763Z"
    },
    {
      "id": "701c97fd-79f5-4e2e-ac18-db0b788e9120",
      "slug": "curry",
      "topicSlug": "lodash",
      "title": "Implement curry",
      "language": "js",
      "code": "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn(...args);\n    } else {\n      return (...nextArgs) => curried(...args, ...nextArgs);\n    }\n  };\n}",
      "createdAt": "2026-08-16T14:31:35.773Z",
      "updatedAt": "2026-08-16T14:31:35.773Z"
    },
    {
      "id": "9f9529ea-5147-4ab8-a251-e98a35765606",
      "slug": "difference",
      "topicSlug": "lodash",
      "title": "Implement difference",
      "language": "js",
      "code": "const findDifference = function (arr1, arr2) {\n  const set1 = new Set(arr1);\n  const set2 = new Set(arr2);\n\n  const diffLeft = [];\n  const diffRight = [];\n\n  for (const item of set1) {\n    if (!set2.has(item)) diffLeft.push(item);\n  }\n\n  for (const item of set2) {\n    if (!set1.has(item)) diffRight.push(item);\n  }\n\n  return [diffLeft, diffRight];\n};",
      "createdAt": "2026-08-16T14:31:35.783Z",
      "updatedAt": "2026-08-16T14:31:35.783Z"
    },
    {
      "id": "78703489-1b42-4fa8-94e8-69e525468e75",
      "slug": "differenceby",
      "topicSlug": "lodash",
      "title": "Implement differenceBy",
      "language": "js",
      "code": "const differenceBy = (arr1, arr2, key) => {\n  const set2 = new Set(arr2.map((item) => item[key]));\n  const set1 = new Set(arr1.map((item) => item[key]));\n\n  const diffLeft = [];\n  const diffRight = [];\n\n  for (const item of arr1) {\n    if (!set2.has(item[key])) {\n      diffLeft.push(item);\n    }\n  }\n\n  for (const item of arr2) {\n    if (!set1.has(item[key])) {\n      diffRight.push(item);\n    }\n  }\n\n  return [diffLeft, diffRight];\n};",
      "createdAt": "2026-08-16T14:31:35.794Z",
      "updatedAt": "2026-08-16T14:31:35.794Z"
    },
    {
      "id": "a6dd21a8-5ef9-4c16-80b4-a5c808400505",
      "slug": "intersection",
      "topicSlug": "lodash",
      "title": "Implement intersection",
      "language": "js",
      "code": "const intersection = function (nums1, nums2) {\n  const set1 = new Set(nums1);\n  const set2 = new Set(nums2);\n  const result = [];\n\n  for (const nums of set2) {\n    if (set1.has(nums)) {\n      result.push(nums);\n    }\n  }\n\n  return result;\n};",
      "createdAt": "2026-08-16T14:31:35.804Z",
      "updatedAt": "2026-08-16T14:31:35.804Z"
    },
    {
      "id": "662b2e17-804b-4083-8674-59363cb0dec1",
      "slug": "union",
      "topicSlug": "lodash",
      "title": "Implement union",
      "language": "js",
      "code": "const union = (...arrays) => {\n  return Array.from(new Set([].concat(...arrays)));\n};",
      "createdAt": "2026-08-16T14:31:35.815Z",
      "updatedAt": "2026-08-16T14:31:35.815Z"
    },
    {
      "id": "65edba6b-734d-4c08-8068-2742b2092cc0",
      "slug": "object-groupby",
      "topicSlug": "map-and-set",
      "title": "Implement Object.groupBy",
      "language": "js",
      "code": "const groupBy = (arr, callback) => {\n  return arr.reduce((acc = {}, item) => {\n    const key = callback(item);\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n\n    return acc;\n  }, {});\n};",
      "createdAt": "2026-08-16T14:31:35.825Z",
      "updatedAt": "2026-08-16T14:31:35.825Z"
    },
    {
      "id": "28628142-6036-4d87-8f19-276d421fa1bf",
      "slug": "promise-all",
      "topicSlug": "promises",
      "title": "Implement Promise.all",
      "language": "js",
      "code": "function myPromiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    if (!Array.isArray(promises)) {\n      return reject(new TypeError(\"Argument must be an array\"));\n    }\n\n    const results = [];\n    let completedPromises = 0;\n\n    for (let index = 0; index < promises.length; index++) {\n      Promise.resolve(promises[index])\n        .then((value) => {\n          results[index] = value;\n          console.log(value);\n          completedPromises += 1;\n          if (completedPromises === promises.length) {\n            resolve(results);\n          }\n        })\n        .catch(reject);\n    }\n\n    if (promises.length === 0) {\n      resolve([]);\n    }\n  });\n}\n\nconst promise1 = new Promise((resolve, reject) => {\n  setTimeout(resolve, 3000, \"first\");\n});\nconst promise2 = new Promise((resolve, reject) => {\n  setTimeout(resolve, 1000, \"second\");\n});\nconst promise3 = new Promise((resolve, reject) => {\n  setTimeout(resolve, 5000, \"third\");\n});\n\nmyPromiseAll([promise1, promise2, promise3]).then((values) => {\n  console.log(values);\n});",
      "createdAt": "2026-08-16T14:31:35.836Z",
      "updatedAt": "2026-08-16T14:31:35.836Z"
    },
    {
      "id": "7c41b8a2-ff24-4652-8073-f0085c589b51",
      "slug": "promise-allsettled",
      "topicSlug": "promises",
      "title": "Implement Promise.allSettled",
      "language": "js",
      "code": "const rejectHandler = (reason) => ({ status: \"rejected\", reason });\nconst resolveHandler = (value) => ({ status: \"fulfilled\", value });\n\nPromise.customAllSettled = function (promises) {\n  const convertedPromises = promises.map((p) =>\n    Promise.resolve(p).then(resolveHandler, rejectHandler),\n  );\n\n  return Promise.all(convertedPromises);\n};\n\nPromise.customAllSettled([\n  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),\n  new Promise((resolve, reject) =>\n    setTimeout(() => reject(new Error(\"Whoops!\")), 2000),\n  ),\n  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),\n])\n  .then(console.info)\n  .catch(console.error);",
      "createdAt": "2026-08-16T14:31:35.846Z",
      "updatedAt": "2026-08-16T14:31:35.846Z"
    },
    {
      "id": "e009feda-50da-4ec8-bcec-da293cb37c50",
      "slug": "promise-any",
      "topicSlug": "promises",
      "title": "Implement Promise.any",
      "language": "js",
      "code": "Promise.customAny = function (promises) {\n  return new Promise((resolve, reject) => {\n    const errors = [];\n    let remaining = promises.length;\n\n    if (remaining === 0) {\n      return reject(new AggregateError([], \"All promises were rejected\"));\n    }\n\n    promises.forEach((promise, index) => {\n      Promise.resolve(promise)\n        .then(resolve)\n        .catch((error) => {\n          errors[index] = error;\n          remaining -= 1;\n          if (remaining === 0) {\n            reject(new AggregateError(errors, \"All promises were rejected\"));\n          }\n        });\n    });\n  });\n};\n\nconst promise1 = Promise.reject(0);\nconst promise2 = new Promise((resolve) => setTimeout(resolve, 100, \"quick\"));\nconst promise3 = new Promise((resolve) => setTimeout(resolve, 500, \"slow\"));\n\nconst promises = [promise1, promise2, promise3];\n\nPromise.customAny(promises).then((value) => console.log(value));",
      "createdAt": "2026-08-16T14:31:35.856Z",
      "updatedAt": "2026-08-16T14:31:35.856Z"
    },
    {
      "id": "97d063ad-45f6-4cbb-9729-cac74ece1a53",
      "slug": "promise-race",
      "topicSlug": "promises",
      "title": "Implement Promise.race",
      "language": "js",
      "code": "Promise.customRace = function (promises) {\n  return new Promise((resolve, reject) => {\n    for (const promise of promises) {\n      Promise.resolve(promise).then(resolve, reject);\n    }\n  });\n};\n\nPromise.customRace([\n  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),\n  new Promise((resolve, reject) =>\n    setTimeout(() => reject(new Error(\"Whoops!\")), 2000),\n  ),\n  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),\n]).then(console.log);",
      "createdAt": "2026-08-16T14:31:35.866Z",
      "updatedAt": "2026-08-16T14:31:35.866Z"
    },
    {
      "id": "74b709ba-99e9-4583-94c5-7bcd0afb863c",
      "slug": "clsx",
      "topicSlug": "random",
      "title": "Implement clsx",
      "language": "js",
      "code": "function clsx(...args) {\n  const classes = [];\n\n  for (const arg of args) {\n    // Skip the current iteration if the argument is falsy\n    if (!arg) continue;\n\n    if (typeof arg === \"string\") {\n      classes.push(arg);\n    } else if (Array.isArray(arg)) {\n      classes.push(clsx(...arg)); // Recursively process arrays\n    } else if (typeof arg === \"object\") {\n      for (const key in arg) {\n        if (arg[key]) {\n          classes.push(key); // Push key if value is truthy\n        }\n      }\n    }\n  }\n\n  return classes.join(\" \"); // Join classes with a space\n}",
      "createdAt": "2026-08-16T14:31:35.877Z",
      "updatedAt": "2026-08-16T14:31:35.877Z"
    },
    {
      "id": "299f83ea-5e6c-4cef-8db1-d1ac8c5dcf01",
      "slug": "filtermap",
      "topicSlug": "random",
      "title": "Implement filterMap",
      "language": "js",
      "code": "export const filterMap = (array, filterBoolean, mapCallback) => {\n  return array.reduce((acc, item, idx) => {\n    if (filterBoolean(item)) {\n      acc.push(mapCallback(item, idx));\n    }\n    return acc;\n  }, []);\n};\n\nconst people = [\n  { name: \"Alice\", age: 25, active: true },\n  { name: \"Bob\", age: 30, active: false },\n  { name: \"Charlie\", age: 35, active: true },\n];\n\nconst activeNames = filterMap(\n  people,\n  (person) => person.active,\n  (person) => person.name,\n);\n\nconsole.log(activeNames)",
      "createdAt": "2026-08-16T14:31:35.886Z",
      "updatedAt": "2026-08-16T14:31:35.886Z"
    },
    {
      "id": "b5f79ef6-f9e3-4e37-b906-8066cb7121c9",
      "slug": "innerjoin",
      "topicSlug": "random",
      "title": "Implement innerJoin",
      "language": "js",
      "code": "function innerJoin(predicate, records, ids) {\n  return records.filter((record) => ids.some((id) => predicate(record, id)));\n}\n\nconst result = innerJoin(\n  (record, id) => record.id === id,\n  [\n    { id: 824, name: \"Richie Furay\" },\n    { id: 956, name: \"Dewey Martin\" },\n    { id: 313, name: \"Bruce Palmer\" },\n    { id: 456, name: \"Stephen Stills\" },\n    { id: 177, name: \"Neil Young\" },\n  ],\n  [177, 456, 999],\n);\n\nconsole.log(result);",
      "createdAt": "2026-08-16T14:31:35.939Z",
      "updatedAt": "2026-08-16T14:31:35.939Z"
    },
    {
      "id": "2fad25c6-21b8-4545-9a6c-0163b0233eb7",
      "slug": "reducer",
      "topicSlug": "random",
      "title": "Reducer Pattern with Actions",
      "language": "js",
      "code": "function tasksReducer(tasks, action) {\n  switch (action.type) {\n    case \"added\": {\n      return [\n        ...tasks,\n        {\n          id: action.id,\n          text: action.text,\n          done: false,\n        },\n      ];\n    }\n    case \"changed\": {\n      return tasks.map((t) => {\n        if (t.id === action.id) {\n          const { type, ...actionNoType } = action;\n          return actionNoType;\n        } else {\n          return t;\n        }\n      });\n    }\n    case \"deleted\": {\n      return tasks.filter((t) => t.id !== action.id);\n    }\n    default: {\n      throw Error(\"Unknown action: \" + action.type);\n    }\n  }\n}\n\nconst initialState = [];\nconst actions = [\n  { type: \"added\", id: 1, text: \"Visit Kafka Museum\" },\n  { type: \"added\", id: 2, text: \"Watch a puppet show\" },\n  { type: \"deleted\", id: 1 },\n  { type: \"added\", id: 3, text: \"Lennon Wall pic\" },\n  { type: \"changed\", id: 3, text: \"Lennon Wall\", done: true },\n];\nconst finalState = actions.reduce(tasksReducer, initialState);\nconsole.log(finalState);",
      "createdAt": "2026-08-16T14:31:35.949Z",
      "updatedAt": "2026-08-16T14:31:35.949Z"
    },
    {
      "id": "f250e367-76e3-4978-aabf-7b9e482ebe0a",
      "slug": "topological-sort",
      "topicSlug": "random",
      "title": "Topological Sort by Dependencies",
      "language": "js",
      "code": "const cards = [\n  { id: 1, dependent: [6, 7, 8] },\n  { id: 2, dependent: [6] },\n  { id: 3, dependent: [] },\n  { id: 4, dependent: [6, 7, 8] },\n  { id: 5, dependent: [6, 8] },\n  { id: 6, dependent: [] },\n  { id: 7, dependent: [6] },\n  { id: 8, dependent: [7] },\n  { id: 9, dependent: [1] },\n  { id: 10, dependent: [9] },\n];\n\nconst getOrderedCards = (cards) => {\n  const result = [];\n  const added = new Set();\n\n  while (result.length < cards.length) {\n    let addedInPass = false;\n\n    for (const card of cards) {\n      if (\n        !added.has(card.id) &&\n        card.dependent.every((dep) => added.has(dep))\n      ) {\n        result.push(card.id);\n        added.add(card.id);\n        addedInPass = true;\n      }\n    }\n\n    if (!addedInPass) {\n      throw new Error(\"Cannot resolve dependency order\");\n    }\n  }\n\n  return result;\n};\n\nconsole.log(getOrderedCards(cards));",
      "createdAt": "2026-08-16T14:31:35.960Z",
      "updatedAt": "2026-08-16T14:31:35.960Z"
    }
  ],
  "meta": {
    "total": 71,
    "page": 1,
    "limit": 100,
    "totalPages": 1
  }
} as const;
