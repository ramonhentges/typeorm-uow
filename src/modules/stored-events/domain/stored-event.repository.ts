import { StoredEvent } from './stored-event.entity';

export interface StoredEventRepository {
  add: (storedEvent: StoredEvent) => Promise<StoredEvent>;
}
