import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager } from 'typeorm';

class TransactionContext {
  manager: EntityManager;
  constructor(manager: EntityManager) {
    this.manager = manager;
  }
}

@Injectable()
export class UnitOfWork {
  private static storage = new AsyncLocalStorage<TransactionContext>();

  constructor(
    @InjectDataSource()
    private readonly typeOrmDataSource: DataSource,
  ) {}

  private transactionContext(): TransactionContext | undefined {
    return UnitOfWork.storage.getStore();
  }

  manager = () => {
    const context = this.transactionContext();
    if (context) return context.manager;
    return this.typeOrmDataSource.manager;
  };

  transactional<Output>(fn: () => Promise<Output>) {
    return this.typeOrmDataSource.transaction((manager) => {
      const context = new TransactionContext(manager);
      return UnitOfWork.storage.run(context, fn);
    });
  }
}
