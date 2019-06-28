// setTimeout(() => console.log(1));
// setImmediate(() => console.log(2));
// process.nextTick(() => console.log(3));
// Promise.resolve().then(() => console.log(4));
// (() => console.log(5))();

// setImmediate(function(){
//     console.log(1);
//     process.nextTick(function(){
//         console.log(2);
//     });
// });
// process.nextTick(function(){
//     console.log(3);
//     setImmediate(function(){
//         console.log(4);
//     })
// });

console.log(process.env.NODE_ENV)