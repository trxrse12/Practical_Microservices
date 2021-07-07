// eslint-disable-next-line max-classes-per-file
import { v4 as uuid } from 'uuid';
import { UUID } from './Types';

class DomainId<T> {
  constructor(private id:T){};

  getValue(): T {
    return this.id;
  }
}

export class TraceId extends DomainId<UUID> {
  constructor(traceIdValue: UUID) {
    super(traceIdValue);
  }
}

export class UserId extends DomainId<UUID> {
  constructor(userIdValue: UUID) {
    super(userIdValue);
  }
}

export class EventId extends DomainId<UUID> {
  constructor(eventIdValue: UUID) {
    super(eventIdValue);
  }
}

export class CommandId extends DomainId<UUID> {
  constructor(commandIdValue: UUID) {
    super(commandIdValue);
  }
}

export class EmailId extends DomainId<UUID> {
  constructor(emailIdValue: UUID) {
    super(emailIdValue);
  }
}

export class VideoId extends DomainId<UUID> {
  constructor(videoIdValue: UUID) {
    super(videoIdValue);
  }
}

/**
 * @class - used to build Domain Entity type
 */
abstract class Identifiers<T> {
  constructor(private value: T){
    this.value = value;
  }

  equals (id?: Identifiers<T>): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  toString() {
    return String(this.value);
  }

  /**
   * Return the raw value of the identifier
   */
  toValue(): T {
    return this.value;
  }
}

// eslint-disable-next-line import/prefer-default-export
export class EntityId extends Identifiers<string | number> {
  constructor(id?: string | number) {
    super(id || uuid());
  }
}
