import { UnitOfWork } from '@/modules/core/unit-of-work';
import {
  StoredEvent,
  StoredEventId,
} from '@/modules/stored-events/domain/stored-event.entity';
import { StoredEventRepository } from '@/modules/stored-events/domain/stored-event.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeormStoredEventRepository implements StoredEventRepository {
  constructor(private readonly uow: UnitOfWork) {}

  private storedEventRepository() {
    return this.uow.manager().getRepository(StoredEvent);
  }

  async add(storedEvent: StoredEvent) {
    const result = await this.storedEventRepository().insert(storedEvent);
    storedEvent.eventId = new StoredEventId(result.identifiers[0].eventId);
    return storedEvent;
  }
}
