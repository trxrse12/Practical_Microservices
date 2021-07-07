// @ts-check
import { Knex } from 'knex';
import { EntityStream } from '../core/domain/Stream';
import { DomainCommands } from '../core/domain/Command';

const writeFunctionSql: string =
  'SELECT message_store.write_message($1, $2, $3, $4, $5, $6)';

const VersionConflictError = require('./version-conflict-error');

const versionConflictErrorRegex = /^Wrong.*Stream Version: (\d+)\)/;

function createWrite({ db }: { db: Knex.Client }) {
  return (
    streamName: EntityStream,
    message: DomainCommands,
    expectedVersion: unknown
  ) => {
    if (!message.type) {
      throw new Error('Messages must have a type');
    }

    const values = [
      message.id,
      streamName,
      message.type,
      message.data,
      message.metadata,
      expectedVersion,
    ];

    return db
      .query(writeFunctionSql, values)
      .then((res: unknown) => res)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          const errorMatch = err.message.match(versionConflictErrorRegex);
          const notVersionConflict = errorMatch === null;

          if (notVersionConflict) {
            throw err;
          }

          if (errorMatch) {
            const actualVersion = parseInt(errorMatch[1], 10);

            const versionConflictError = new VersionConflictError(
              streamName,
              actualVersion,
              expectedVersion
            );
            versionConflictError.stack = err.stack;
            throw versionConflictError;
          }
        }
        throw err;
      });
  };
}

module.exports = createWrite;
