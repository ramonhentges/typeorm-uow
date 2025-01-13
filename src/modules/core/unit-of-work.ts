import { Injectable, Scope } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class UnitOfWork {
  constructor(
    @InjectDataSource()
    private readonly typeOrmDataSource: DataSource,
  ) {
    this.manager = typeOrmDataSource.manager;
  }

  manager: EntityManager;

  transactional<Output>(fn: () => Promise<Output>) {
    return this.typeOrmDataSource.transaction((manager) => {
      this.manager = manager;
      return fn();
    });
  }
}
