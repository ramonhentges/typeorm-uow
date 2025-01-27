import { DomainEvent } from '@/modules/core/domain/domain-event';

export class ProjectCreatedEvent implements DomainEvent {
  readonly eventVersion: number = 1;
  readonly occurredOn: Date;

  constructor(
    readonly aggregateId: string,
    readonly name: string,
    readonly description: string,
  ) {
    this.occurredOn = new Date();
  }
}
