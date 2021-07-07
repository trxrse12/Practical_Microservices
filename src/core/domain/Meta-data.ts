import { OriginStreamName } from './Stream';
import { TraceId, UserId } from './Identifiers';

export interface MetaData {
  readonly originStreamName: OriginStreamName;
  readonly traceId: TraceId;
  readonly userid: UserId;
}
