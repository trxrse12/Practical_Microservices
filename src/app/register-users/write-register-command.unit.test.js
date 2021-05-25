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
    [null, undefined, 1, "SomeString", false, ()=>{}].forEach(async (notAnObj)=> {
        try {
        const res = await writeRegisterCommand(notAnObj)
      } catch(e) {
        expect(e?.message).toMatch(/a context object should be provided/);
      }
    });
  });
  it('should throw if context object argument has unexpected props', async () => {
    const badParam = {};
    const badProp = 'badProperty';
    badParam[badProp] = 'unexpected';
    try {
      const res = await writeRegisterCommand(badParam)
    } catch(e) {
      expect(e?.message).toMatch(/improper context object provided/);
    }
  });
  it('should write the command to the stream ', () => {
    const registerCommandResult = writeRegisterCommand(fakeContext);
    expect(fakeContext.messageStore.write).toHaveBeenCalled();
    expect(fakeContext.messageStore.write).toHaveBeenCalledWith(
      fakeStream,
      expect.objectContaining(fakeCommandStrippedOfId));
  });
});


