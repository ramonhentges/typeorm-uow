import { DomainEventManager } from '@/modules/core/domain/domain-event-manager';
import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/common/domain/use-case';
import { Project } from '../domain/project.entity';
import { ProjectRepository } from '../domain/project.repository';
import { TaskRepository } from '../domain/task.repository';

@Injectable()
export class CreateProjectUseCase
  implements UseCase<CreateProjectInput, CreateProjectOutput>
{
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: ProjectRepository,
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: TaskRepository,
    private readonly domainEventManager: DomainEventManager,
  ) {}

  async execute(input: CreateProjectInput): Promise<CreateProjectOutput> {
    const project = Project.create(input.projectName, input.projectDescription);

    await this.projectRepository.add(project);
    await this.domainEventManager.publish(project);

    const tasks = input.initialTasks.map((task) =>
      project.addTask(task.description),
    );

    await Promise.all(tasks.map((task) => this.taskRepository.add(task)));

    return { projectId: project.projectId };
  }
}

export interface CreateProjectInput {
  projectDescription: string;
  projectName: string;
  initialTasks: { description: string }[];
}

export interface CreateProjectOutput {
  projectId: string;
}
