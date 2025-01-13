import { Task } from '@/modules/project/domain/task.entity';
import { ProjectModule } from '@/modules/project/project.module';
import { CreateProjectInput } from '@/modules/project/use-cases/create-project.use-case';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { Project } from '../modules/project/domain/project.entity';

describe('CreateProjectController (e2e)', () => {
  let app: INestApplication;
  let projectRepository: Repository<Project>;
  let taskRepository: Repository<Task>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ProjectModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    projectRepository = moduleFixture.get(getRepositoryToken(Project));
    taskRepository = moduleFixture.get(getRepositoryToken(Task));
    await app.init();
  });

  beforeEach(async () => {
    await projectRepository.delete({});
    await taskRepository.delete({});
  });

  it('should save all projects and tasks', async () => {
    const input: CreateProjectInput = {
      projectName: 'New Project',
      projectDescription: 'Project description',
      initialTasks: [{ description: 'Task A' }, { description: 'Task B' }],
    };

    const res = await request(app.getHttpServer())
      .post('/projects/create')
      .send(input);

    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.body).toEqual({ projectId: expect.any(String) });
    const projects = await projectRepository.find();
    expect(projects).toHaveLength(1);
    const savedProject = projects[0];
    expect(savedProject.name).toBe(input.projectName);
    expect(savedProject.description).toBe(input.projectDescription);
    const tasks = await taskRepository.find({ order: { description: 'ASC' } });
    expect(tasks).toHaveLength(2);
    input.initialTasks.forEach((taskDto, idx) => {
      expect(tasks[idx].description).toBe(taskDto.description);
    });
  });

  it('should not save anything if task length exceeds the limit', async () => {
    const input: CreateProjectInput = {
      projectName: 'New Project',
      projectDescription: 'Project description',
      initialTasks: [
        { description: 'Task A' },
        { description: 'A'.repeat(101) },
      ],
    };

    const res = await request(app.getHttpServer())
      .post('/projects/create')
      .send(input);

    expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

    const projects = await projectRepository.find();
    expect(projects).toHaveLength(0);
    const tasks = await taskRepository.find();
    expect(tasks).toHaveLength(0);
  });
});
