import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './modules/core/core.module';
import { Project } from './modules/project/domain/project.entity';
import { Task } from './modules/project/domain/task.entity';
import { ProjectModule } from './modules/project/project.module';
import { StoredEvent } from './modules/stored-events/domain/stored-event.entity';
import { StoredEventsModule } from './modules/stored-events/stored-events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db-test',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'uow',
      entities: [Project, Task, StoredEvent],
      synchronize: true,
      logging: true,
    }),
    CoreModule,
    ProjectModule,
    StoredEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
