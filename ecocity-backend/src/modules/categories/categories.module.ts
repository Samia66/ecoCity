import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { CategoriesMapper } from './categories.mapper';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, CategoriesMapper],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
