import { randomUUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Task {
  public static create(projectId: string, description: string) {
    const output = new Task();
    output.taskId = randomUUID();
    output.projectId = projectId;
    output.setDescription(description);
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

  private setDescription(description: string) {
    if (description.length > 100) {
      throw new Error("Description can't have more than 100 characters");
    }
    this.description = description;
  }
}
