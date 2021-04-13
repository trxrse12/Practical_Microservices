const {v4:uuid} = require('uuid');

const fakeDb = {
  query: async (...[streamName, fromPosition, maxMessages]) =>{
    const resObject = {};
    resObject.rows = [];
    resObject.rows = await Promise.resolve([{a:1},{b:2}]);
    return resObject;
  },
};

const fakeUserId = uuid();
const fakeStream = `identity:command-${fakeUserId}`;
const fakeTraceId = uuid();

const fakeContext = {
  attributes: {
    id: fakeUserId,
    email: "me@me.com"
  },
  traceId: fakeTraceId,
  passwordHash: '321123AB',
  messageStore: {
    write: jest.fn().mockReturnValue(true),
  },
  queries: {},
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

module.exports.fakeDb = fakeDb;
module.exports.fakeUserId = fakeUserId;
module.exports.fakeTraceId = fakeTraceId;
module.exports.fakeStream = fakeStream;
module.exports.fakeContext = fakeContext;
module.exports.fakeCommand = fakeCommand;