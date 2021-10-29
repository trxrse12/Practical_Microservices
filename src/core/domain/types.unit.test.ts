import { badArgsNonString, TestNonString } from '../../unit-test-helpers';

const { URLString, EmailAddress, emailIsValid } = require('./Types');
const { badArgs } = require('../../unit-test-helpers');
import { TestNonArray } from '../../unit-test-helpers';

describe('Class URLString', () => {
  it('should initialize to empty string if string is NOT URL', () => {
    const notUrlString = 'gigi';
    const processedUrlString = new URLString(notUrlString);
    expect(processedUrlString.s).toBe('');
  });

  it('should initialize to empty string if string is actually not a string type', () => {
    badArgs.forEach((badArg: any) => {
      const processedUrlString = new URLString(badArg);
      expect(processedUrlString.s).toBe('');
    });
  });

  it('should initialize to non-empty string if string is VALID http URL', () => {
    const urlString = 'http://aaa.com';
    const processedUrlString = new URLString(urlString);
    expect(processedUrlString.s).toBe(urlString);
  });

  it('should initialize to non-empty string if string is VALID https URL', () => {
    const urlString = 'https://aaa.com';
    const processedUrlString = new URLString(urlString);
    expect(processedUrlString.s).toBe(urlString);
  });
})

describe('emailIsValid()', () => {
  it.each<TestNonString>(badArgsNonString)(
    'should throw if param not a string',
    (nonString) => {
      expect(() => emailIsValid(nonString)).toThrow(
        'emailIsValid(): not a valid string'
      );
    }
  );

  it('should return false if input is string but no valid email format', () => {
    const wrongEmailFormat = 'sdhshgjhs';
    expect(emailIsValid(wrongEmailFormat)).toBe(false);
  });

  it('should return true if input is valid email format', () => {
    const rightEmailFormat = 'gigi@gmail.com';
    expect(emailIsValid(rightEmailFormat)).toBe(true)
  });
});

describe('Class EmailAddress', () => {
  it.each<TestNonString>(badArgsNonString)(
    'should initialize to empty string if input param not a valid string',
    (nonString) => {
      const emailAddress = new EmailAddress(nonString);
      expect(emailAddress?.s).toBe('');
    }
  );
  it('should initialize to empty string if input param valid string but not valid email', () => {
    const emailAddr = new EmailAddress('gigi');
    expect(emailAddr?.s).toBe('');
  });
  it('should initialize to non-empty string if input string is valid email address', () => {
    const emailAddr = new EmailAddress('gigi@gmail.com');
    expect(emailAddr?.s).toBe('gigi@gmail.com');
  });
});
