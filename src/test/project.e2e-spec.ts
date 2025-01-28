import { Task } from '@/modules/project/domain/task.entity';
import { CreateProjectInput } from '@/modules/project/use-cases/create-project.use-case';
import { StoredEvent } from '@/modules/stored-events/domain/stored-event.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { Project } from '../modules/project/domain/project.entity';

describe('CreateProjectController (e2e)', () => {
  let app: INestApplication;
  let projectRepository: Repository<Project>;
  let taskRepository: Repository<Task>;
  let storedEventsRepository: Repository<StoredEvent>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const dataSource = moduleFixture.get(getDataSourceToken());
    projectRepository = dataSource.getRepository(Project);
    taskRepository = dataSource.getRepository(Task);
    storedEventsRepository = dataSource.getRepository(StoredEvent);
    await app.init();
  });

  beforeEach(async () => {
    await projectRepository.delete({});
    await taskRepository.delete({});
    await storedEventsRepository.delete({});
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
    const storedEvents = await storedEventsRepository.find();
    expect(storedEvents).toHaveLength(1);
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
    const storedEvents = await storedEventsRepository.find();
    expect(storedEvents).toHaveLength(0);
  });

  it('should run save and not save in parallel', async () => {
    const saveInput: CreateProjectInput = {
      projectName: 'New Project',
      projectDescription: 'Project description',
      initialTasks: [{ description: 'Task A' }, { description: 'Task B' }],
    };

    const savedPromise = request(app.getHttpServer())
      .post('/projects/create')
      .send(saveInput);

    const errorInput: CreateProjectInput = {
      projectName: 'New Project',
      projectDescription: 'Project description',
      initialTasks: [
        { description: 'Task A' },
        { description: 'A'.repeat(101) },
      ],
    };

    const notSavedPromise = request(app.getHttpServer())
      .post('/projects/create')
      .send(errorInput);

    const [resSaved, resNotSaved] = await Promise.all([
      savedPromise,
      notSavedPromise,
    ]);

    expect(resSaved.status).toBe(HttpStatus.CREATED);
    expect(resNotSaved.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    const projects = await projectRepository.find();
    expect(projects).toHaveLength(1);
    const tasks = await taskRepository.find({ order: { description: 'ASC' } });
    expect(tasks).toHaveLength(2);
    const storedEvents = await storedEventsRepository.find();
    expect(storedEvents).toHaveLength(1);
  });
});
