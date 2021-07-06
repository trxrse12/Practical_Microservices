import { DomainId } from './Identifiers';
import { UUID } from './Types';

import { SendEmailCommandDataColumns } from './Types';
import {MetaData} from "./Meta-data";

export type RegisteredEventCommandDataColumns =
  | 'userId'
  | 'email'
  | 'passwordHash';

export type SendEmailCommandData = Record<SendEmailCommandDataColumns, unknown>;

export interface DomainEvent {
  readonly id: UniqueEntityId;
  readonly type: string;
  readonly metadata: MetaData;
  readonly data: EventData | CommandData;
}