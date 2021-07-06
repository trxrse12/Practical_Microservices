import {EventId, CommandId, UserId, EmailId} from './Identifiers';
import {MailOptions, PasswordHash, URLString} from "./Types";

type CommandTypes = 'Send' | 'Register' | 'PublishVideo';

type SendCommandData = {
  emailId: EmailId,
  to: MailOptions['to'],
  subject: MailOptions['subject'],
  text: MailOptions['text'],
  html: MailOptions['html'],
}

type RegisterCommandData = {
  userId: UserId,
  email: MailOptions['to'],
  passwordHash: PasswordHash,
}

type PublishVideoCommandData = {
  ownerId: UserId,
  sourceUri: URLString,
}
const ownerId = new UserId('1234-67567-3333-3323-222')
const sourceUri = new URLString('gigi');
const test: PublishVideoCommandData = {
  ownerId: ownerId,
  sourceUri: sourceUri
}

type Commands =
  | {type: 'sendCommand', id: CommandId, data: SendCommandData}
  | {type: 'registerCommand', id: CommandId, data: RegisterCommandData}

}

type RegisterCommandDataColumns = 'userId' | 'email' | 'passwordHash';

