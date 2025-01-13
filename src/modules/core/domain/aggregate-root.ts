import { DomainEvent } from './domain-event';

export abstract class AggregateRoot {
  events: Set<DomainEvent> = new Set<DomainEvent>();

  addEvent(event: DomainEvent) {
    this.events.add(event);
  }

  clearEvents() {
    this.events.clear();
  }
}
