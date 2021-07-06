import * as nodemailer from 'nodemailer';
import { pipe } from 'fp-ts/lib/pipeable';
import { Either, left, right, mapLeft } from 'fp-ts/lib/Either';
import assert from 'assert';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type OriginStreamName = `identity-${UUID}`;

export type MailOptions = Pick<
  nodemailer.SendMailOptions,
  'to' | 'subject' | 'text' | 'html'
>;

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

class URLString {
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

module.exports.URLString = URLString;
