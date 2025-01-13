import { Global, Module } from '@nestjs/common';
import { DomainEventManager } from './domain/domain-event-manager';
import { UnitOfWork } from './unit-of-work';

@Global()
@Module({
  providers: [UnitOfWork, DomainEventManager],
  exports: [UnitOfWork, DomainEventManager],
})
export class CoreModule {}
