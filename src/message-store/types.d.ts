export interface IDomainEvent {
  id: string;
  type: string;
  data: {
    [key: string]: string;
  };
}

export type IDomainEvents = IDomainEvent[];

export interface IProjection {
  [x: string]: (arg0: any, arg1: IDomainEvent) => any;
  $init: () => any;
}
