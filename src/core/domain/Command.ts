import { CommandId, UserId, EmailId, VideoId } from './Identifiers';
import { MailOptions, PasswordHash, URLString } from './Types';

enum CommandTypes {
  SEND = 'Send',
  REGISTER = 'Register',
  PUBLISH_VIDEO = 'PublishVideo',
  NAME_VIDEO = 'NameVideo',
}

type SendCommandData = {
  emailId: EmailId;
  to: MailOptions['to'];
  subject: MailOptions['subject'];
  text: MailOptions['text'];
  html: MailOptions['html'];
};

type RegisterCommandData = {
  userId: UserId;
  email: MailOptions['to'];
  passwordHash: PasswordHash;
};

type PublishVideoCommandData = {
  ownerId: UserId;
  sourceUri: URLString;
};

type NameVideoCommandData = {
  videoId: VideoId;
  name: string;
};

export type DomainCommands =
  | { type: CommandTypes.SEND; id: CommandId; data: SendCommandData }
  | { type: CommandTypes.REGISTER; id: CommandId; data: RegisterCommandData }
  | { type: CommandTypes.PUBLISH_VIDEO; id: CommandId; data: PublishVideoCommandData }
  | { type: CommandTypes.NAME_VIDEO; id: CommandId; data: NameVideoCommandData }




