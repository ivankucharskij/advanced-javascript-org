const promise1 = Promise.resolve();
const promise2 = Promise.resolve();

promise1.then(() => console.log(1)).then(() => console.log(2));
promise2.then(() => console.log(3)).then(() => console.log(4));
