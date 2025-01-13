import EventEmitter2 from 'eventemitter2';
import { AggregateRoot } from './aggregate-root';
import { DomainEvent } from './domain-event';

export class DomainEventManager {
  private readonly domainEventsSubscriber: EventEmitter2;

  constructor() {
    this.domainEventsSubscriber = new EventEmitter2({
      wildcard: true,
    });
  }

  register(
    event: string,
    handler: (eventData: unknown & DomainEvent) => Promise<void>,
  ) {
    this.domainEventsSubscriber.on(event, handler);
  }

  async publish(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.events) {
      const eventClassName = event.constructor.name;
      await this.domainEventsSubscriber.emitAsync(eventClassName, event);
    }
    aggregateRoot.clearEvents();
  }
}
