const {v4:uuid} = require('uuid');

const {
  fakeUserId,
  fakeTraceId,
  fakeStream,
  fakeContext,
  fakeCommand,
  callFcnWithObjWithUnexpectedProps
} = require('../../test-helpers');


const writeRegisterCommand = require('./write-register-command');

const {type,metadata,data,...other} = fakeCommand;
const fakeCommandStrippedOfId = {type,metadata,data};

describe('the writeCommandRegister function', () => {
  it('should throw if context argument invalid', () => {
    const invalidContextArgumentArray = [
      null, undefined, 1, "SomeString", false, ()=>{}
    ].forEach(function testInvalidInputs(notAnObj){
      expect(function shouldThrow(){
        const registerCommandWrongResult = writeRegisterCommand(notAnObj)
      }).toThrow("WriteRegisterCommand(): a context object should be provided")
    })
  });
  it('should throw if context object argument has unexpected props', () => {
    const badProp = 'badProperty';
    function callWithUnexpectedArgumentProperties(){
      const badParam = {};
      badParam[badProp] = 'unexpected';
      const WriteRegisterCommandWrongArgResult = writeRegisterCommand(badParam);
    }
    expect(callWithUnexpectedArgumentProperties)
      .toThrow("improper context object provided")
  });
  it('should write the command to the stream ', () => {
    const registerCommandResult = writeRegisterCommand(fakeContext);
    expect(fakeContext.messageStore.write).toHaveBeenCalled();
    expect(fakeContext.messageStore.write).toHaveBeenCalledWith(
      fakeStream,
      expect.objectContaining(fakeCommandStrippedOfId));
  });
});


