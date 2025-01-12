import { randomUUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Task {
  public static create(projectId: string, description: string) {
    const output = new Task();
    output.taskId = randomUUID();
    output.projectId = projectId;
    output.description = description;
    output.status = 'open';
    return output;
  }
  @PrimaryColumn({ name: 'task_id' })
  taskId: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column()
  description: string;

  @Column()
  status: string;
}
