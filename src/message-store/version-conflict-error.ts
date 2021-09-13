import {
  EntityCommandStream,
  EntityStream,
  StreamPosition,
} from '../core/domain/Stream';

function VersionConflictError(
  this: Error,
  stream: EntityStream | EntityCommandStream,
  expected: StreamPosition,
  actual: StreamPosition
) {
  if (typeof this === 'object') {
    Error.captureStackTrace(this, this.constructor);
  }

  const message = [
    'VersionConflict: stream',
    stream,
    'expected version',
    expected,
    'but was at version',
    actual,
  ].join(' ');

  this.message = message;
  this.name = 'VersionConflictError';
}

VersionConflictError.prototype = Object.create(Error.prototype);
VersionConflictError.prototype.constructor = VersionConflictError;

module.exports = VersionConflictError;