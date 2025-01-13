import { UnitOfWork } from '@/modules/core/unit-of-work';
import { Task } from '@/modules/project/domain/task.entity';
import { TaskRepository } from '@/modules/project/domain/task.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeormTaskRepository implements TaskRepository {
  constructor(private readonly uow: UnitOfWork) {}

  private taskRepository() {
    return this.uow.manager.getRepository(Task);
  }

  async add(task: Task) {
    await this.taskRepository().insert(task);
    return task;
  }
}
