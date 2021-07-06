// @ts-check
import { Knex } from 'knex';

const writeFunctionSql: string =
  'SELECT message_store.write_message($1, $2, $3, $4, $5, $6)';

const versionConflictError = require('./version-conflict-error');
const versionConflictErrorRegex = /^Wrong.*Stream Version: (\d+)\)/;

function createWrite({ db }: { db: Knex.Client }) {
  return (streamName: string, message: unknown, expectedVersion: unknown) => {
    if (!message.type){
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

    return db.query(writeFunctionSql, values)
      .then((res) => {
        return res
      })
      .catch(err => {
        const errorMatch = err.message.match(versionConflictErrorRegex);
        const notVersionConflict = errorMatch === null;

        if(notVersionConflict){
          throw err;
        }

        const actualVersion = parseInt(errorMatch[1], 10);

        const versionConflictError = new VersionConflictError(
          streamName,
          actualVersion,
          expectedVersion,
        );
        versionConflictError.stack = Err.stack;
        throw versionConflictError;
      })
  }
}

module.exports = createWrite;