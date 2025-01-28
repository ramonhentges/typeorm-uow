import { Transactional } from '@/modules/core/decorators/transactional';
import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateProjectInput,
  CreateProjectUseCase,
} from '../use-cases/create-project.use-case';

@Controller()
export class CreateProjectController {
  constructor(private readonly useCase: CreateProjectUseCase) {}

  @Post('/projects/create')
  @Transactional()
  execute(@Body() data: CreateProjectInput) {
    return this.useCase.execute(data);
  }
}
