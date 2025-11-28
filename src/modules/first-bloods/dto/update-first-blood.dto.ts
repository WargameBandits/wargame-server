import { PartialType } from '@nestjs/mapped-types';
import { CreateFirstBloodDto } from './create-first-blood.dto';

export class UpdateFirstBloodDto extends PartialType(CreateFirstBloodDto) {}
