const {v4:uuid} = require('uuid');
const express = require('express');

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
    resObject.rows = [];
    resObject.rows = await Promise.resolve([{a:1},{b:2}]);
    return resObject;
  },
};

const fakeMessageStore = {
  createSubscription: () => {}
};

const fakeUserId = uuid();
const fakeStream = `identity:command-${fakeUserId}`;
const fakeTraceId = uuid();

const fakeAttributes = {
  id: fakeUserId,
  email: "me@me.com",
}

const byEmail = email => Promise.resolve({identity: 'trx'})
const fakeContext = {
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
};

function callFcnWithObjWithUnexpectedProps(badPropObject, fcn){
      fcn => badParam;
}

function checkReturningPromiseIsThrowing(badArgsArray, promiseFcn){

}

module.exports.badArgs = badArgs;
module.exports.fakeDb = fakeDb;
module.exports.fakeMessageStore = fakeMessageStore;
module.exports.fakeUserId = fakeUserId;
module.exports.fakeTraceId = fakeTraceId;
module.exports.fakeStream = fakeStream;
module.exports.fakeContext = fakeContext;
module.exports.fakeAttributes = fakeAttributes;
module.exports.fakeCommand = fakeCommand;
module.exports.fakeConfig = fakeConfig;
module.exports.callFcnWithObjWithUnexpectedProps = callFcnWithObjWithUnexpectedProps;