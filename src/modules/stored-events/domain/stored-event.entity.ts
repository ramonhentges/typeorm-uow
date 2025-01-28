import { AggregateRoot } from '@/modules/core/domain/aggregate-root';
import { DomainEvent } from '@/modules/core/domain/domain-event';
import { IntId } from '@/modules/core/domain/int-id.vo';
import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

export class StoredEventId extends IntId {}

export type StoredEventConstructorProps<T> = {
  body: T;
  occurredOn: Date;
  typeName: string;
};

@Entity({ name: 'stored_events' })
export class StoredEvent<Event = any> extends AggregateRoot {
  @Generated('increment')
  @PrimaryColumn({
    type: 'int',
    name: 'event_id',
    transformer: {
      from(value: number) {
        return new StoredEventId(value);
      },
      to(value: StoredEventId) {
        return value.value();
      },
    },
  })
  eventId: StoredEventId;

  @Column({ type: 'json' })
  body: Event;

  @Column({ type: 'timestamp' })
  occurredOn: Date;

  @Column({ length: '255' })
  typeName: string;

  static create(domainEvent: DomainEvent) {
    const output = new StoredEvent();
    output.body = domainEvent;
    output.occurredOn = domainEvent.occurredOn;
    output.typeName = domainEvent.constructor.name;
    return output;
  }
}
