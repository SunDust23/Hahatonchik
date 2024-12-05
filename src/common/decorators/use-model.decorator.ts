import { SetMetadata } from '@nestjs/common';

export const UseModel = (model: any) => SetMetadata('model', model);
