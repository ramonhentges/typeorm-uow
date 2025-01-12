import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './domain/project.entity';
import { Task } from './domain/task.entity';
import { TypeormProjectRepository } from './infra/repositories/typeorm/project.repository';
import { TypeormTaskRepository } from './infra/repositories/typeorm/task.repository';
import { CreateProjectController } from './presentation/create-project.controller';
import { CreateProjectUseCase } from './use-cases/create-project.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task])],
  providers: [
    CreateProjectUseCase,
    { provide: 'PROJECT_REPOSITORY', useClass: TypeormProjectRepository },
    { provide: 'TASK_REPOSITORY', useClass: TypeormTaskRepository },
  ],
  controllers: [CreateProjectController],
})
export class ProjectModule {}
