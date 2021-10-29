import * as nodemailer from 'nodemailer';
import { pipe } from 'fp-ts/lib/pipeable';
import { Either, left, right, mapLeft } from 'fp-ts/lib/Either';
import assert from 'assert';
import { StreamName } from './Stream';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type EMAIL_ID = `${string}-${string}-${string}-${string}-${string}`;

export type MailOptions = Pick<
  nodemailer.SendMailOptions,
  'to' | 'from' | 'subject' | 'text' | 'html'
>;

export function emailIsValid (email: string) {
  if (typeof email === 'string') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  throw new Error('emailIsValid(): not a valid string');
}

function toEmailAddress(s: string): Either<string, string>{
  try {
    return emailIsValid(s) ? right(s) : left('');
  } catch(err){
    return left('');
  }
}

export class EmailAddress {
  readonly s: string;
  private type!: string;
  constructor(s: string) {
    const testedString = pipe(
      toEmailAddress(s),
      mapLeft((a) => a.length)
    );
    if (testedString._tag !== 'Left') {
      assert(testedString.right.length);
      this.s = s;
    } else {
      this.s = '';
    }
  }
}

export type PasswordHash = string;

function toUrlString(s: string): Either<string, string> {
  try {
    return s?.indexOf('https://') === 0 || s?.indexOf('http://') === 0
      ? right(s)
      : left('');
  } catch (err) {
    return left('');
  }
}

export class URLString {
  readonly s: string;

  private type!: string;

  constructor(s: string) {
    const testedString = pipe(
      toUrlString(s),
      mapLeft((a) => a.length)
    );
    // eslint-disable-next-line no-underscore-dangle
    if (testedString._tag !== 'Left') {
      assert(testedString.right.length);
      this.s = s;
    } else {
      this.s = '';
    }
  }
}

// export function isUrlString(s: URLString): s is URLString {
//   // eslint-disable-next-line no-use-before-define
//   if (map(getStringLength)(toUrlString(s))){
//     return true;
//   }
//   return false;
// }

export type QueryParams = [
  streamName: StreamName,
  fromPosition: number,
  maxMessages: number
];

module.exports.URLString = URLString;
