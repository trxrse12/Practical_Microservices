const {isObject} = require('../../utils');
const {isEmptyObject, objHasProps} = require('../../utils');
const {v4:uuid} = require('uuid');

function writeRegisterCommand(context){
  if (!context || !isObject(context) || typeof context === 'function'){
    throw new Error("WriteRegisterCommand(): a context object should be provided");
  }

  // test the context obj shape (should have certain attributes to be valid)
  const contextProperties = ['attributes', 'traceId', 'passwordHash', 'messageStore', 'queries'];
  if (!objHasProps(context, contextProperties)){
    throw new Error ("WriteRegisterCommand(): improper context object provided:")
  }

  const userId = context?.attributes?.id;
  const stream = `identity:command-${userId}`;
  const command = {
    id: uuid(),
    type: 'Register',
    metadata: {
      traceId: context.traceId,
      userId,
    },
    data:{
      userId,
      email: context?.attributes?.email,
      passwordHash: context?.passwordHash
    }
  };

  context?.messageStore?.write(stream, command);
}

module.exports = writeRegisterCommand;