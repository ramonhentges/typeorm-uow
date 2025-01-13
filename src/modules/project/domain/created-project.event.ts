import { DomainEvent } from '@/modules/core/domain/domain-event';

export class ProjectCreatedEvent implements DomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(
    readonly aggregate_id: string,
    readonly name: string,
    readonly description: string,
  ) {
    this.occurred_on = new Date();
  }
}
