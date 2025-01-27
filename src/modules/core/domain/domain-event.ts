export interface DomainEvent {
  aggregateId: string;
  occurredOn: Date;
  eventVersion: number;
}
