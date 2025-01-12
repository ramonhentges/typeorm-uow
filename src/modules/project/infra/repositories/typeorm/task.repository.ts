import { Task } from '@/modules/project/domain/task.entity';
import { TaskRepository } from '@/modules/project/domain/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class TypeormTaskRepository implements TaskRepository {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async add(task: Task) {
    await this.taskRepository.insert(task);
    return task;
  }
}
