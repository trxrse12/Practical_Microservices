const { URLString } = require('./Types');
const {badArgs} = require('../../unit-test-helpers');

describe('Class URLString', () => {
  it('should initialize to empty string if string is NOT URL', () => {
    const notUrlString = 'gigi';
    const processedUrlString = new URLString(notUrlString);
    console.log('YYYYYYYYY urlString', processedUrlString)
    expect(processedUrlString.s).toBe('');
  });

  it('should initialize to empty string if string is actually not a string type', () => {
    badArgs.forEach((badArg) => {
      const processedUrlString = new URLString(badArg);
      expect(processedUrlString.s).toBe('');
    });
  });

  it('should initialize to non-empty string if string is VALID http URL', () => {
    const urlString = 'http://aaa.com';
    const processedUrlString = new URLString(urlString);
    console.log('UUUUUUUUUUUUUUUUUUU processedUrlString=', processedUrlString);
    expect(processedUrlString.s).toBe(urlString);
  });

  it('should initialize to non-empty string if string is VALID https URL', () => {
    const urlString = 'https://aaa.com';
    const processedUrlString = new URLString(urlString);
    console.log('UUUUUUUUUUUUUUUUUUU processedUrlString=', processedUrlString);
    expect(processedUrlString.s).toBe(urlString);
  });
})