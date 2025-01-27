import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { DomainEvent } from '../core/domain/domain-event';
import { DomainEventManager } from '../core/domain/domain-event-manager';
import { StoredEvent } from './domain/stored-event.entity';
import { StoredEventRepository } from './domain/stored-event.repository';
import { TypeormStoredEventRepository } from './infra/repositories/typeorm/stored-event.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: 'STORED_EVENT_REPOSITORY',
      useClass: TypeormStoredEventRepository,
    },
  ],
  controllers: [],
})
export class StoredEventsModule {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.domainEventManager.register('*', async (event: DomainEvent) => {
      const repo: StoredEventRepository = await this.moduleRef.resolve(
        'STORED_EVENT_REPOSITORY',
      );
      const storedEvent = StoredEvent.create(event);
      await repo.add(storedEvent);
    });
  }
}
