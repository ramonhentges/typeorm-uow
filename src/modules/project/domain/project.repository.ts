import { Project } from './project.entity';

export interface ProjectRepository {
  add: (project: Project) => Promise<Project>;
}
