import { Task } from './task.entity';

export interface TaskRepository {
  add: (task: Task) => Promise<Task>;
}
