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


export type StreamName = IdentityEntityStreamName;

enum CommandStreamType {
  SEND_EMAIL = 'send_email',
  VIDEO_PUBLISHING = 'video_publishing',
  IDENTITY = 'identity',
}

type SendEmailCommandStreamName = `${CommandStreamType.SEND_EMAIL}-${UUID}`;
type VideoPublishingCommandStreamName = `${CommandStreamType.VIDEO_PUBLISHING}-${UUID}`;
type IdentityCommandStreamName = `${CommandStreamType.IDENTITY}-${UUID}`;

export type EntityCommandStream =
  | { type: CommandStreamType.SEND_EMAIL; Name: SendEmailCommandStreamName}
  | { type: CommandStreamType.VIDEO_PUBLISHING; Name: VideoPublishingCommandStreamName}
  | { type: CommandStreamType.IDENTITY; Name: IdentityCommandStreamName}

export type StreamPosition = number;