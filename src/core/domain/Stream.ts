import {EMAIL_ID, UUID} from './Types';
import { EmailId } from './Identifiers';

enum EntityStreamType {
  ORIGIN = 'origin',
  EMAIL = 'email',
  IDENIITY = 'identity',
}

type IdentityEntityStreamName = `${EntityStreamType.IDENIITY}-${UUID}`;
export type OriginStreamName = `${EntityStreamType.ORIGIN}-${UUID}`;
type EmailEntityStreamName = `${EntityStreamType.EMAIL}-${EMAIL_ID}`;

export type EntityStream =
  | { type: EntityStreamType.ORIGIN; Name: IdentityEntityStreamName }
  | { type: EntityStreamType.EMAIL; Name: EmailEntityStreamName };




enum CommandStreamType {
  EMAIL = 'email',
  IDENIITY = 'identity',
}

type IdentityCommandStreamName = `${CommandStreamType.IDENIITY}-${UUID}`;

export type EntityCommandStream =
  | {type: CommandStreamType.IDENIITY; Name: IdentityCommandStreamName}

