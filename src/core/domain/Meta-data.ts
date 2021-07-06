import { OriginStreamName, TraceId, UserId } from './Types';

export interface MetaData {
  readonly originStreamName: OriginStreamName;
  readonly traceId: TraceId;
  readonly userid: UserId;
}
