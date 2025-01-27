import { AggregateRoot } from '@/modules/core/domain/aggregate-root';
import { randomUUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ProjectCreatedEvent } from './project-created.event';
import { Task } from './task.entity';

@Entity({ name: 'projects' })
export class Project extends AggregateRoot {
  public static create(name: string, description: string) {
    const output = new Project();
    output.projectId = randomUUID();
    output.name = name;
    output.description = description;
    output.addEvent(
      new ProjectCreatedEvent(
        output.projectId,
        output.name,
        output.description,
      ),
    );
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
