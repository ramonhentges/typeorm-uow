import { UnitOfWork } from '@/modules/core/unit-of-work';
import { Project } from '@/modules/project/domain/project.entity';
import { ProjectRepository } from '@/modules/project/domain/project.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeormProjectRepository implements ProjectRepository {
  constructor(private readonly uow: UnitOfWork) {}

  private projectRepository() {
    return this.uow.manager().getRepository(Project);
  }

  async add(project: Project) {
    await this.projectRepository().insert(project);
    return project;
  }
}
