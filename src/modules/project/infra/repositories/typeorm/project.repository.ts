import { Project } from '@/modules/project/domain/project.entity';
import { ProjectRepository } from '@/modules/project/domain/project.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class TypeormProjectRepository implements ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async add(project: Project) {
    await this.projectRepository.insert(project);
    return project;
  }
}
