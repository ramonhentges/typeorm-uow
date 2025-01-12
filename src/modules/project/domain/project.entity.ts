import { randomUUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity({ name: 'projects' })
export class Project {
  public static create(name: string, description: string) {
    const output = new Project();
    output.projectId = randomUUID();
    output.name = name;
    output.description = description;
    return output;
  }

  @PrimaryColumn({ name: 'project_id' })
  projectId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  public addTask(description: string) {
    return Task.create(this.projectId, description);
  }
}
