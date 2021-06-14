const {v4:uuid} = require('uuid');
const express = require('express');
// const Bluebird = require('bluebird');

const badArgs = [
  [],
  null, undefined,
  0,
  'a',
  ()=>{},
  {a:1},
  [null,null],
  [null,undefined],
  [1,null],
  [undefined,1],
  [,],
  ['a','a'],
  [[1],[2]],
  ['s',null],
  ['s',undefined],
  ['s', []],
  [{}],
  [()=>{},()=>{}],
  [1,{a:2}],
  [1,[]],
  [{},{}],
  ['1',()=>{}],
  ['1',[]],
  // ['a',{a:1}]
];

const fakeDb = {
  query: async (...[streamName, fromPosition, maxMessages]) =>{
    const resObject = {};
    resObject.rows = await Promise.resolve([
      {data: '{"a": 100}'},
      {data: '{"b": 200}'}
  ])
    return resObject;
  },
};

const fakeMessageStore = {
  createSubscription: () => jest.fn(() => {subscription: 100}),
  read: () => Promise.resolve({read: 200}),
  readLastMessage: () => Promise.resolve({readLastMessage: 300}),
  write: () => Promise.resolve({write: 400}),
  fetch: () => Promise.resolve({fetch: 500})
};

const fakeUserId = uuid();
const fakeSubscriberId = 'appService:123';
const fakeStream = `identity:command-${fakeUserId}`;
const fakeTraceId = uuid();

const fakeAttributes = {
  id: fakeUserId,
  email: "meme@gmail.com",
  password: "test_password_123"
}

const fakeVideoId = "f35bc702-9992-43e1-b751-3ec07c67e311";
const fakeSourceUri = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

const byEmail = email => Promise.resolve({identity: 'trx'})
const fakeContext = {
  userId:'e29cbf58-6cf8-4dc8-a41e-0d4aa5ca27da',
  attributes: fakeAttributes,
  traceId: fakeTraceId,
  passwordHash: '321123AB',
  messageStore: {
    write: jest.fn().mockReturnValue(true),
  },
  queries: {
    byEmail: byEmail,
  },
};

const fakeCommand = {
  id: uuid(),
  type: 'Register',
  metadata: {
    traceId: fakeContext.traceId,
    userId: fakeUserId,
  },
  data:{
    userId: fakeUserId,
    email: fakeContext.attributes.email,
    passwordHash: fakeContext.passwordHash
  }
};

const fakeRouter = jest.fn((req, res) => {
  res.status(200);
  res.send([{
    state: 'NJ',
    capital: 'Trenton',
  }])
});

const fakeConfig = {
  homeApp: {
    router:fakeRouter ,
  },
  recordViewingsApp: {
    router: express.Router(),
  },
  registerUsersApp: {
    router: express.Router(),
  },
  authenticateApp: {
    router: express.Router(),
  },
  creatorsPortalApp: {
    router: express.Router(),
  },
  messageStore: fakeMessageStore,
  queries: {},
};

function callFcnWithObjWithUnexpectedProps(badPropObject, fcn){
      fcn => badParam;
}

function checkReturningPromiseIsThrowing(badArgsArray, promiseFcn){

}


// function fakeRead(streamName, from)
const fakeHandlers = {
  handler1: () => Promise.resolve({handlerResult: 1}),
  handler2: () => Promise.resolve({handlerResult: 2}),
};

const fakeRead = () => Promise.resolve('Here is the read function');
const fakeReadLastMessage = () => Promise.resolve('Here is the readLastMessage function');
const fakeWrite = () => Promise.resolve('Here is the write function');

const testMockedModule = fn => (async () => {
  console.log('OOOOOOOOOOOOOOOOOO res=',  await fn())
})()
  .catch(err => console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHH err=',err))

/* eslint-disable no-console */
process.on('unhandledRejection', err => {
  console.error(err.message, err.stack)
  // server.close();
  setTimeout(process.exit, 5000, 1);
})
/* eslint-enable no-console */

// process.on('uncaughtException', err => {
//   console.log(`Uncaught Exception: ${err.message}`)
//   process.exit(1)
// })

module.exports.badArgs = badArgs;
module.exports.fakeDb = fakeDb;
module.exports.fakeMessageStore = fakeMessageStore;
module.exports.fakeUserId = fakeUserId;
module.exports.fakeSubscriberId = fakeSubscriberId;
module.exports.fakeTraceId = fakeTraceId;
module.exports.fakeStream = fakeStream;
module.exports.fakeContext = fakeContext;
module.exports.fakeAttributes = fakeAttributes;
module.exports.fakeCommand = fakeCommand;
module.exports.fakeConfig = fakeConfig;
module.exports.callFcnWithObjWithUnexpectedProps = callFcnWithObjWithUnexpectedProps;


module.exports.fakeHandlers = fakeHandlers;
module.exports.fakeRead = fakeRead;
module.exports.fakeReadLastMessage = fakeReadLastMessage;
module.exports.fakeWrite = fakeWrite;
module.exports.testMockedModule = testMockedModule;
