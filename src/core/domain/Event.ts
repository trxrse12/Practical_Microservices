import {EmailId, EventId, UserId, VideoId} from './Identifiers';
import {MailOptions, PasswordHash, URLString} from "./Types";

enum EventTypes {
  EMAIL_SENT = 'EmailSent',
  EMAIL_SEND_FAILED = 'EmailSendFailed',
  USER_REGISTERED = 'UserRegistered',
  USER_REGISTRATION_EMAIL_SENT = 'UserRegistrationEmailSent',
  USER_REGISTRATION_REJECTED = 'UserRegistrationRejected',
  VIDEO_NAMED = 'VideoNamed',
  VIOEO_NAME_REJECTED = 'VideoNamedRejected',
  VIDEO_PUBLISHED = 'VideoPublished',
  VIDEO_PUBLISHING_FAILED = 'VideoPublishingFailed'
}



type UserRegisteredData = {
  userId: UserId;
  email: MailOptions['to'];
  passwordHash: PasswordHash;
};

type UserRegistrationEmailSentData = {
  userId: UserId;
  emailId: EmailId;
};



enum UserRegistrationRejectedReasons {
  EMAIL_ADDRESS_NOT_VALID,
}

type UserRegistrationRejectedData = {
  userId: UserId;
  email: 'not an email';
  passwordHash: PasswordHash;
  reason: UserRegistrationRejectedReasons;
};



type EmailSentData = {
  emailId: EmailId;
  to: MailOptions['to'];
  from: MailOptions['from'];
  subject: MailOptions['from'];
  text: MailOptions['text'];
  html: MailOptions['html'];
};



enum EmailSendFailedReasons {
  COULD_NOT_REACH_EMAIL_PROVIDER,
}

type EmailSendFailedData = {
  emailId: EmailId;
  reason: EmailSendFailedReasons;
  to: MailOptions['to'];
  from: MailOptions['from'];
  subject: MailOptions['from'];
  text: MailOptions['text'];
  html: MailOptions['html'];
};

type VideoNamedData = {
  name: string;
};



enum VideoNameRejectedReasons {
  VALIDATION_ERROR_CANNOT_BE_BLANK,
}

type VideoNamedRejectedData = {
  name: string;
  reason: VideoNameRejectedReasons;
};


type VidePublishedData = {
  ownerId: UserId;
  sourceUri: URLString;
  transcodedUri: URLString;
  videoId: VideoId;
};



enum VideoPublishingFailedReasons {
  INVALID_FORMAT,
}

type VideoPublishingFailedData = {
  reason: VideoPublishingFailedReasons;
  ownerId: UserId;
  sourceUri: URLString;
  videoId: VideoId;
}

export type DomainEvents =
| { type: EventTypes.EMAIL_SENT; id: EventId; data: EmailSentData }
| { type: EventTypes.EMAIL_SEND_FAILED; id: EventId; data: EmailSendFailedData}
| { type: EventTypes.USER_REGISTERED; id: EventId; data: UserRegisteredData}
| { type: EventTypes.USER_REGISTRATION_EMAIL_SENT, id: EventId; data: UserRegistrationEmailSentData}
| { type: EventTypes.USER_REGISTRATION_REJECTED, id: EventId; data: UserRegistrationRejectedData}
| { type: EventTypes.VIDEO_NAMED; id: EventId; data: VideoNamedData}
| { type: EventTypes.VIOEO_NAME_REJECTED; id: EventId; data: VideoNamedRejectedData}
| { type: EventTypes.VIDEO_PUBLISHED; id: EventId; data: VidePublishedData}
| { type: EventTypes.VIDEO_PUBLISHING_FAILED; id: EventId; data: VideoPublishingFailedData}