import { Module } from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { SpecializationsController } from './specializations.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Specialization } from './entities/specialization.entity';

@Module({
  imports: [SequelizeModule.forFeature([Specialization])],
  controllers: [SpecializationsController],
  providers: [SpecializationsService],
})
export class SpecializationsModule {}
