const {fakeDb} = require('../../../unit-test-helpers');

function writeRegisterCommand (context){
  return new Promise((resolve, reject) => {
    context
      ? process.nextTick(() => resolve([{a:1},{b:2}]))
      : process.nextTick(() => reject('Error in writing operation'))
  })
}

module.exports = writeRegisterCommand;